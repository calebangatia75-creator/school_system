import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { chromium } from "playwright-core";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = "http://localhost:3000";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const ARTIFACT_DIR = path.resolve(process.cwd(), "artifacts", "browser");

function loadEnvFile(fileName) {
  const filePath = path.resolve(process.cwd(), fileName);
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;
    const key = trimmed.slice(0, separator).trim();
    if (!key || process.env[key]) continue;
    process.env[key] = trimmed.slice(separator + 1).trim().replace(/^['"]|['"]$/g, "");
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing Supabase credentials in .env.local");
}

const admin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

function log(step, detail) {
  console.log(`[${step}] ${detail}`);
}

function ensure(condition, message) {
  if (!condition) throw new Error(message);
}

async function selectOptionContaining(locator, text) {
  await locator.waitFor({ state: "visible", timeout: 60000 });
  const options = await locator.locator("option").evaluateAll((nodes) =>
    nodes.map((node) => ({
      value: node.value,
      text: (node.textContent ?? "").trim()
    }))
  );
  const match = options.find((option) => option.value && option.text.includes(text));
  if (!match) {
    throw new Error(`Could not find option containing "${text}". Options: ${options.map((o) => o.text).join(", ")}`);
  }
  await locator.selectOption(match.value);
}

async function waitForToast(page, title) {
  await page.getByText(title, { exact: true }).waitFor({ state: "visible", timeout: 60000 });
}

async function waitForHydration(page) {
  await page.waitForLoadState("networkidle", { timeout: 60000 });
  await page.waitForTimeout(1500);
}

async function generateMagicLink(email, role) {
  const { data, error } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: {
      redirectTo: `${BASE_URL}/auth/callback?role=${role}`
    }
  });
  if (error) throw error;
  ensure(data?.properties?.action_link, `No magic link generated for ${email}`);
  return data.properties.action_link;
}

async function getProfileByEmail(email) {
  const { data, error } = await admin
    .from("profiles")
    .select("id, email, full_name, role")
    .eq("email", email)
    .maybeSingle();
  if (error) throw error;
  ensure(data, `Profile not found for ${email}`);
  return data;
}

async function getStudentByAdmission(admission) {
  const { data, error } = await admin
    .from("students")
    .select("id, admission_number, first_name, last_name, parent_id, grade_level, stream")
    .eq("admission_number", admission)
    .maybeSingle();
  if (error) throw error;
  ensure(data, `Student ${admission} not found`);
  return data;
}

async function waitForStudentPhoto(admission, timeoutMs = 30000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const student = await getStudentByAdmission(admission);
    if (student.photo_url) {
      return student;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  throw new Error(`Student ${admission} was created but photo_url did not populate in time`);
}

async function getBalance(studentId) {
  const { data: invoices, error: invoiceError } = await admin
    .from("invoices")
    .select("id, amount")
    .eq("student_id", studentId);
  if (invoiceError) throw invoiceError;
  const invoiceIds = (invoices ?? []).map((item) => item.id);

  const { data: payments, error: paymentError } =
    invoiceIds.length > 0
      ? await admin.from("payments").select("amount").in("invoice_id", invoiceIds)
      : { data: [], error: null };
  if (paymentError) throw paymentError;

  const totalInvoice = (invoices ?? []).reduce((sum, item) => sum + Number(item.amount), 0);
  const totalPaid = (payments ?? []).reduce((sum, item) => sum + Number(item.amount), 0);
  return { totalInvoice, totalPaid, balance: totalInvoice - totalPaid };
}

async function getAttendanceClassForTeacher(teacherId) {
  const { data, error } = await admin
    .from("teacher_assignments")
    .select("class:class_id(id, grade_level, stream)")
    .eq("teacher_id", teacherId);
  if (error) throw error;
  const classes = (data ?? []).flatMap((item) =>
    Array.isArray(item.class) ? item.class : item.class ? [item.class] : []
  );
  ensure(classes.length > 0, "No assigned class found for teacher");
  return classes[0];
}

function buildTempAssets() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "cbc-browser-"));
  const imagePath = path.join(tempDir, "student-photo.png");
  const homeworkPath = path.join(tempDir, "homework-note.txt");
  fs.writeFileSync(
    imagePath,
    Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO8B9pUAAAAASUVORK5CYII=", "base64")
  );
  fs.writeFileSync(homeworkPath, "Browser verification attachment");
  return { tempDir, imagePath, homeworkPath };
}

async function attachConsole(page, label) {
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      console.error(`[browser:${label}] ${msg.text()}`);
    }
  });
  page.on("pageerror", (error) => {
    console.error(`[pageerror:${label}] ${error.message}`);
  });
}

async function loginWithMagicLink(browser, email, role, verifyLoginToast = false) {
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();
  await attachConsole(page, role);
  page.setDefaultTimeout(60000);

  await page.goto(`${BASE_URL}/login`, { waitUntil: "domcontentloaded" });
  await page.getByText("Sign in with a magic link").waitFor({ timeout: 60000 });
  await waitForHydration(page);

  if (verifyLoginToast) {
    await page.locator('input[name="email"]').fill(email);
    await page.locator('select[name="role"]').selectOption(role);
    await page.getByRole("button", { name: "Send Magic Link" }).click();
    await waitForToast(page, "Magic link sent");
    log("auth", `${role} login form produced success toast`);
  }

  const actionLink = await generateMagicLink(email, role);
  await page.goto(actionLink, { waitUntil: "domcontentloaded" });

  const expectedPath =
    role === "teacher"
      ? "/teacher/dashboard"
      : role === "parent"
        ? "/parent/dashboard"
        : "/admin/dashboard";

  await page.waitForURL(`**${expectedPath}`, { timeout: 60000 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, `${role}-dashboard.png`), fullPage: true });
  log("auth", `${role} magic link landed on ${new URL(page.url()).pathname}`);
  return { context, page };
}

async function run() {
  const assets = buildTempAssets();
  const adminProfile = await getProfileByEmail("admin@shekinah.ac.ke");
  const teacherProfile = await getProfileByEmail("teacher1@shekinah.ac.ke");
  const parentProfile = await getProfileByEmail("parent1@shekinah.ac.ke");
  const mercy = await getStudentByAdmission("SHK-2401");
  const teacherClass = await getAttendanceClassForTeacher(teacherProfile.id);

  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true
  });

  try {
    const adminSession = await loginWithMagicLink(browser, adminProfile.email, "admin", false);
    const { page: adminPage, context: adminContext } = adminSession;

    log("admin", "Adding student with photo upload");
    await adminPage.goto(`${BASE_URL}/admin/students`, { waitUntil: "domcontentloaded" });
    await adminPage.getByRole("heading", { name: "Student Management" }).waitFor();

    const admission = `BRW-${Date.now()}`;
    await adminPage.locator('input[name="admission_number"]').fill(admission);
    await adminPage.locator('input[name="first_name"]').fill("Browser");
    await adminPage.locator('input[name="last_name"]').fill("Student");
    await adminPage.locator('select[name="gender"]').selectOption("male");
    await adminPage.locator('select[name="curriculum"]').selectOption("CBC");
    await adminPage.locator('select[name="grade_level"]').selectOption("Grade 3");
    await adminPage.locator('input[name="stream"]').fill("Gold");
    await adminPage.locator('select[name="day_or_boarding"]').selectOption("day");
    await adminPage.locator('input[name="enrollment_date"]').fill("2026-04-12");
    await adminPage.locator('input[name="emergency_contact_name"]').fill("Browser Guardian");
    await adminPage.locator('input[name="emergency_contact_phone"]').fill("+254700000001");
    await adminPage.locator('input[type="file"]').setInputFiles(assets.imagePath);
    await adminPage.getByRole("button", { name: "Add Student" }).click();
    await waitForToast(adminPage, "Student added");

    const createdStudent = await waitForStudentPhoto(admission);
    await adminPage.locator('input[placeholder="Search by name or admission"]').fill(admission);
    await adminPage.getByText("Browser Student").waitFor();

    const { data: uploadedFiles, error: uploadedError } = await admin.storage
      .from("school-media")
      .list(`students/${admission}`);
    if (uploadedError) throw uploadedError;
    ensure((uploadedFiles ?? []).length > 0, "Student photo was not uploaded to school-media");
    log("admin", "Student photo uploaded and student appears in list");

    const beforeBalance = await getBalance(mercy.id);
    const invoiceAmount = 1234;
    const paymentAmount = 500;
    const expectedBalance = beforeBalance.balance + invoiceAmount - paymentAmount;

    log("admin", "Creating invoice and recording payment");
    await adminPage.goto(`${BASE_URL}/admin/finance`, { waitUntil: "domcontentloaded" });
    await adminPage.getByRole("heading", { name: "Finance Overview" }).waitFor();

    const invoiceForm = adminPage.getByRole("button", { name: "Create Invoice" }).locator("xpath=ancestor::form");
    await selectOptionContaining(invoiceForm.locator('select[name="student_id"]'), "Mercy Wekesa");
    await invoiceForm.locator('input[name="amount"]').fill(String(invoiceAmount));
    await invoiceForm.locator('input[name="due_date"]').fill("2026-04-30");
    await invoiceForm.locator('input[name="description"]').fill("Browser verification invoice");
    await invoiceForm.getByRole("button", { name: "Create Invoice" }).click();
    await waitForToast(adminPage, "Invoice created");

    const { data: browserInvoice, error: invoiceLookupError } = await admin
      .from("invoices")
      .select("id")
      .eq("student_id", mercy.id)
      .eq("description", "Browser verification invoice")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (invoiceLookupError) throw invoiceLookupError;
    ensure(browserInvoice?.id, "Created invoice not found in Supabase");

    const paymentForm = adminPage.getByRole("button", { name: "Save Payment" }).locator("xpath=ancestor::form");
    await paymentForm.locator('select[name="invoice_id"]').selectOption(browserInvoice.id);
    await paymentForm.locator('input[name="amount"]').fill(String(paymentAmount));
    await paymentForm.locator('select[name="method"]').selectOption("mpesa");
    await paymentForm.locator('input[name="reference_number"]').fill(`BRW-${Date.now()}`);
    await paymentForm.locator('input[name="paid_by"]').fill("Jane Wekesa");
    await paymentForm.getByRole("button", { name: "Save Payment" }).click();
    await waitForToast(adminPage, "Payment recorded");
    await adminPage.getByText(`Balance: KSh ${invoiceAmount - paymentAmount}`).waitFor();
    log("admin", "Invoice and payment flow completed");

    const teacherSession = await loginWithMagicLink(browser, teacherProfile.email, "teacher");
    const { page: teacherPage, context: teacherContext } = teacherSession;

    log("teacher", "Verifying attendance flow");
    await teacherPage.goto(`${BASE_URL}/teacher/attendance`, { waitUntil: "domcontentloaded" });
    await teacherPage.getByRole("heading", { name: "Attendance" }).waitFor();
    await teacherPage.getByText(teacherClass.grade_level).first().click();
    await teacherPage.waitForURL(`**/teacher/attendance/${teacherClass.id}`, { timeout: 60000 });
    await teacherPage.locator("select").first().selectOption("late");
    await teacherPage.getByRole("button", { name: "Save" }).click();
    await waitForToast(teacherPage, "Attendance saved");
    await teacherPage.reload({ waitUntil: "domcontentloaded" });
    ensure(
      (await teacherPage.locator("select").first().inputValue()) === "late",
      "Attendance status did not persist after refresh"
    );
    log("teacher", "Attendance persisted after refresh");

    log("teacher", "Creating homework with attachment");
    await teacherPage.goto(`${BASE_URL}/teacher/homework`, { waitUntil: "domcontentloaded" });
    await teacherPage.getByRole("heading", { name: "Homework" }).waitFor();
    await teacherPage.locator('input[placeholder="Homework title"]').fill("Browser Homework");
    await teacherPage.locator('input[placeholder="Subject"]').fill("English");
    await teacherPage.locator('textarea[placeholder*="Describe the task"]').fill("Read the attachment and summarize it.");
    await selectOptionContaining(teacherPage.getByLabel("Class"), "Grade 4 North");
    await teacherPage.locator('input[name="due_date"]').fill("2026-04-19");
    await teacherPage.locator('input[type="file"]').setInputFiles(assets.homeworkPath);
    await teacherPage.getByRole("button", { name: "Publish Homework" }).click();
    await waitForToast(teacherPage, "Homework published");
    await teacherPage.getByText("Browser Homework").waitFor();
    log("teacher", "Homework created");

    log("teacher", "Recording assessment");
    await teacherPage.goto(`${BASE_URL}/teacher/assessments`, { waitUntil: "domcontentloaded" });
    await teacherPage.getByRole("heading", { name: "CBC Competency Assessments" }).waitFor();
    await selectOptionContaining(teacherPage.getByLabel("Student"), "Mercy Wekesa");
    await teacherPage.locator('input[placeholder="Subject"]').fill("Verification Skill");
    await teacherPage.locator('input[placeholder="Competency"]').fill("Browser Verification");
    await teacherPage.getByLabel("Rating").selectOption("Meeting");
    await teacherPage.getByLabel("Teacher notes").fill("Verified in browser flow.");
    await teacherPage.getByRole("button", { name: "Save Assessment" }).click();
    await waitForToast(teacherPage, "Assessment recorded");
    log("teacher", "Assessment recorded");

    const parentSession = await loginWithMagicLink(browser, parentProfile.email, "parent");
    const { page: parentPage, context: parentContext } = parentSession;

    log("parent", "Checking dashboard and child switching");
    await parentPage.getByRole("heading", { name: "Parent Dashboard" }).waitFor();
    await parentPage.getByText("Fee Balance").waitFor();
    const balanceText = await parentPage.locator("text=KSh").first().textContent();
    ensure(balanceText?.includes(String(expectedBalance)), `Parent dashboard balance did not reflect expected value ${expectedBalance}`);
    await parentPage.locator("select").first().selectOption({ label: "Daniel Wekesa" });
    await parentPage.getByText("Grade 8 focus").waitFor();
    await parentPage.locator("select").first().selectOption({ label: "Mercy Wekesa" });
    await parentPage.getByText("Grade 4 focus").waitFor();
    log("parent", "Dashboard widgets loaded and child switch updated");

    log("parent", "Checking homework visibility");
    await parentPage.goto(`${BASE_URL}/parent/homework`, { waitUntil: "domcontentloaded" });
    await parentPage.getByRole("heading", { name: "Homework" }).waitFor();
    await parentPage.locator("select").first().selectOption({ label: "Mercy Wekesa" });
    await parentPage.getByText("Browser Homework").waitFor();
    await parentPage.getByRole("link", { name: "Download" }).waitFor();
    log("parent", "Homework and attachment are visible");

    log("parent", "Checking progress radar and portfolio");
    await parentPage.goto(`${BASE_URL}/parent/progress`, { waitUntil: "domcontentloaded" });
    await parentPage.getByRole("heading", { name: "CBC Progress" }).waitFor();
    await parentPage.locator("select").first().selectOption({ label: "Mercy Wekesa" });
    await parentPage.getByText("Verification Skill").waitFor();
    ensure((await parentPage.locator("svg").count()) > 0, "Radar chart SVG did not render");
    log("parent", "Progress page shows updated assessment data");

    log("parent", "Checking receipt download");
    await parentPage.goto(`${BASE_URL}/parent/fees`, { waitUntil: "domcontentloaded" });
    await parentPage.getByRole("heading", { name: "Fees and Payments" }).waitFor();
    await parentPage.locator("select").first().selectOption({ label: "Mercy Wekesa" });
    await parentPage.getByText(`KSh ${expectedBalance}`).waitFor();
    const downloadPromise = parentPage.waitForEvent("download");
    await parentPage.getByRole("button", { name: "Receipt" }).first().click();
    const download = await downloadPromise;
    const receiptPath = path.join(ARTIFACT_DIR, "parent-receipt.pdf");
    await download.saveAs(receiptPath);
    ensure(fs.existsSync(receiptPath), "Receipt PDF was not downloaded");
    log("parent", "Receipt PDF downloaded");

    log("mobile", "Checking parent mobile navigation");
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
    });
    const mobilePage = await mobileContext.newPage();
    await attachConsole(mobilePage, "mobile-parent");
    const mobileLink = await generateMagicLink(parentProfile.email, "parent");
    await mobilePage.goto(mobileLink, { waitUntil: "domcontentloaded" });
    await mobilePage.waitForURL("**/parent/dashboard", { timeout: 60000 });
    await mobilePage.getByRole("link", { name: "Home" }).waitFor();
    await mobilePage.getByRole("link", { name: "Homework" }).waitFor();
    await mobilePage.screenshot({ path: path.join(ARTIFACT_DIR, "parent-mobile-dashboard.png"), fullPage: true });
    await mobileContext.close();
    log("mobile", "Bottom navigation is visible on mobile viewport");

    await adminContext.close();
    await teacherContext.close();
    await parentContext.close();

    console.log("");
    console.log("Browser verification completed successfully.");
    console.log(`Artifacts saved in ${ARTIFACT_DIR}`);
  } finally {
    await browser.close();
    fs.rmSync(assets.tempDir, { recursive: true, force: true });
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
