import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvFile(fileName: string) {
  const filePath = resolve(process.cwd(), fileName);
  if (!existsSync(filePath)) return;

  const content = readFileSync(filePath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator).trim();
    if (!key || process.env[key]) continue;

    const rawValue = trimmed.slice(separator + 1).trim();
    process.env[key] = rawValue.replace(/^['"]|['"]$/g, "");
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing Supabase service role credentials.");
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const users = [
  { email: "admin@shekinah.ac.ke", role: "admin", full_name: "Rev. Stephen Mukoya" },
  { email: "teacher1@shekinah.ac.ke", role: "teacher", full_name: "Ms. Everline Khisa" },
  { email: "teacher2@shekinah.ac.ke", role: "teacher", full_name: "Mr. Daniel Wekesa" },
  { email: "parent1@shekinah.ac.ke", role: "parent", full_name: "Jane Wekesa" },
  { email: "parent2@shekinah.ac.ke", role: "parent", full_name: "Grace Simiyu" },
  { email: "parent3@shekinah.ac.ke", role: "parent", full_name: "Michael Naswa" }
];

function assertNoError(label: string, error: { message: string } | null) {
  if (!error) return;

  if (error.message.includes("Could not find the table")) {
    throw new Error(`${label}: schema missing. Run supabase/schema.sql in the Supabase SQL Editor first.`);
  }

  throw new Error(`${label}: ${error.message}`);
}

async function ensureAuthUser(email: string, fullName: string) {
  const { data: listed, error: listError } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000
  });
  assertNoError("List auth users", listError);

  const existing = listed.users.find((user) => user.email === email);
  if (existing) {
    return existing.id;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: "Shekinah@2026",
    email_confirm: true,
    user_metadata: { full_name: fullName }
  });
  assertNoError(`Create auth user ${email}`, error);
  if (!data.user) {
    throw new Error(`Create auth user ${email}: missing user in response.`);
  }
  return data.user.id;
}

async function run() {
  const createdUsers = [];

  for (const user of users) {
    const id = await ensureAuthUser(user.email, user.full_name);
    createdUsers.push({ ...user, id });
  }

  for (const user of createdUsers) {
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role
    });
    assertNoError(`Upsert profile ${user.email}`, error);
  }

  const { error: schoolError } = await supabase.from("schools").upsert({
    name: "Shekinah School",
    location: "Kimilili, Bungoma County",
    curricula: ["CBC", "8-4-4"],
    enable_844: true,
    motto: "Excellence in Education, Grounded in Faith",
    contact_email: "office@shekinah.ac.ke",
    contact_phone: "+254 705 220 332"
  });
  assertNoError("Upsert school", schoolError);

  const parent1 = createdUsers.find((u) => u.email === "parent1@shekinah.ac.ke")!;
  const parent2 = createdUsers.find((u) => u.email === "parent2@shekinah.ac.ke")!;
  const parent3 = createdUsers.find((u) => u.email === "parent3@shekinah.ac.ke")!;
  const teacher1 = createdUsers.find((u) => u.email === "teacher1@shekinah.ac.ke")!;
  const teacher2 = createdUsers.find((u) => u.email === "teacher2@shekinah.ac.ke")!;

  const { data: students, error: studentsError } = await supabase.from("students").insert([
    {
      admission_number: "SHK-2401",
      first_name: "Mercy",
      last_name: "Wekesa",
      gender: "female",
      curriculum: "CBC",
      grade_level: "Grade 4",
      stream: "North",
      day_or_boarding: "day",
      parent_id: parent1.id,
      class_teacher_id: teacher1.id,
      emergency_contact_name: "Jane Wekesa",
      emergency_contact_phone: "+254712880214"
    },
    {
      admission_number: "SHK-2402",
      first_name: "Daniel",
      last_name: "Wekesa",
      gender: "male",
      curriculum: "CBC",
      grade_level: "Grade 8",
      stream: "Red",
      day_or_boarding: "boarding",
      parent_id: parent1.id,
      class_teacher_id: teacher2.id,
      emergency_contact_name: "Jane Wekesa",
      emergency_contact_phone: "+254712880214"
    },
    {
      admission_number: "SHK-2307",
      first_name: "Cynthia",
      last_name: "Njeri",
      gender: "female",
      curriculum: "CBC",
      grade_level: "Grade 6",
      stream: "South",
      day_or_boarding: "day",
      parent_id: parent2.id,
      class_teacher_id: teacher1.id,
      emergency_contact_name: "Grace Simiyu",
      emergency_contact_phone: "+254712550991"
    },
    {
      admission_number: "SHK-2205",
      first_name: "Brian",
      last_name: "Naswa",
      gender: "male",
      curriculum: "8-4-4",
      grade_level: "Class 8",
      stream: "East",
      day_or_boarding: "boarding",
      parent_id: parent3.id,
      class_teacher_id: teacher2.id,
      emergency_contact_name: "Michael Naswa",
      emergency_contact_phone: "+254721887300"
    },
    {
      admission_number: "SHK-2411",
      first_name: "Fiona",
      last_name: "Naswa",
      gender: "female",
      curriculum: "CBC",
      grade_level: "Grade 2",
      stream: "Blue",
      day_or_boarding: "day",
      parent_id: parent3.id,
      class_teacher_id: teacher1.id,
      emergency_contact_name: "Michael Naswa",
      emergency_contact_phone: "+254721887300"
    }
  ]).select("*");
  assertNoError("Insert students", studentsError);

  const { data: classes, error: classesError } = await supabase.from("classes").insert([
    {
      grade_level: "Grade 4",
      stream: "North",
      curriculum: "CBC",
      class_teacher_id: teacher1.id,
      year: 2026
    },
    {
      grade_level: "Grade 8",
      stream: "Red",
      curriculum: "CBC",
      class_teacher_id: teacher2.id,
      year: 2026
    }
  ]).select("*");
  assertNoError("Insert classes", classesError);

  if (classes) {
    const { error } = await supabase.from("teacher_assignments").insert([
      { teacher_id: teacher1.id, class_id: classes[0].id, subject: "English" },
      { teacher_id: teacher2.id, class_id: classes[1].id, subject: "Mathematics" }
    ]);
    assertNoError("Insert teacher assignments", error);
  }

  const { error: feeError } = await supabase.from("fee_structures").insert([
    { grade_level: "Grade 1-3", day_or_boarding: "day", amount: 19800, year: 2026, term: "2", created_by: teacher1.id },
    { grade_level: "Grade 4-6", day_or_boarding: "day", amount: 23500, year: 2026, term: "2", created_by: teacher1.id },
    { grade_level: "Grade 7-9", day_or_boarding: "boarding", amount: 41200, year: 2026, term: "2", created_by: teacher1.id }
  ]);
  assertNoError("Insert fee structures", feeError);

  if (students) {
    const invoiceRows = students.map((student) => ({
      student_id: student.id,
      amount: student.day_or_boarding === "boarding" ? 41200 : 23500,
      due_date: "2026-04-30",
      description: "Term 2, 2026 fees",
      created_by: teacher1.id
    }));
    const { data: invoices, error: invoicesError } = await supabase.from("invoices").insert(invoiceRows).select("*");
    assertNoError("Insert invoices", invoicesError);

    if (invoices && invoices[0]) {
      const { error } = await supabase.from("payments").insert({
        invoice_id: invoices[0].id,
        amount: 12000,
        method: "mpesa",
        reference_number: "QJ72B9",
        paid_by: "Jane Wekesa",
        recorded_by: teacher1.id
      });
      assertNoError("Insert sample payment", error);
    }

    const mercy = students.find((student) => student.admission_number === "SHK-2401");
    const daniel = students.find((student) => student.admission_number === "SHK-2402");
    const cynthia = students.find((student) => student.admission_number === "SHK-2307");
    const brian = students.find((student) => student.admission_number === "SHK-2205");

    const { error: homeworkError } = await supabase.from("homework").insert([
      {
        title: "English Composition",
        description: "Write a two-page composition about your Easter holiday.",
        subject: "English",
        grade_level: "Grade 4",
        stream: "North",
        due_date: "2026-04-18",
        created_by: teacher1.id
      },
      {
        title: "Fractions Revision",
        description: "Complete exercises 4-8 in the mathematics revision booklet.",
        subject: "Mathematics",
        grade_level: "Grade 8",
        stream: "Red",
        due_date: "2026-04-16",
        created_by: teacher2.id
      }
    ]);
    assertNoError("Insert homework", homeworkError);

    const assessments = [
      mercy && {
        student_id: mercy.id,
        subject: "English",
        competency: "Creative Writing",
        rating: "Meeting",
        teacher_notes: "Expresses ideas clearly with minor grammar support needed.",
        assessed_by: teacher1.id,
        term: "2",
        year: 2026
      },
      mercy && {
        student_id: mercy.id,
        subject: "Science",
        competency: "Observation Skills",
        rating: "Exceeding",
        teacher_notes: "Excellent curiosity during class experiments.",
        assessed_by: teacher1.id,
        term: "2",
        year: 2026
      },
      cynthia && {
        student_id: cynthia.id,
        subject: "Mathematics",
        competency: "Problem Solving",
        rating: "Approaching",
        teacher_notes: "Needs more confidence when solving word problems.",
        assessed_by: teacher1.id,
        term: "2",
        year: 2026
      },
      daniel && {
        student_id: daniel.id,
        subject: "Mathematics",
        competency: "Algebraic Thinking",
        rating: "Meeting",
        teacher_notes: "Understands patterns and simple equations well.",
        assessed_by: teacher2.id,
        term: "2",
        year: 2026
      }
    ].filter(Boolean);

    if (assessments.length > 0) {
      const { error } = await supabase.from("assessments").insert(assessments);
      assertNoError("Insert assessments", error);
    }

    if (brian) {
      const { error } = await supabase.from("results_844").insert({
        student_id: brian.id,
        subject: "Mathematics",
        score: 78,
        grade: "B+",
        term: "2",
        year: 2026,
        created_by: teacher2.id
      });
      assertNoError("Insert 8-4-4 results", error);
    }
  }

  const { error: announcementsError } = await supabase.from("announcements").insert([
    {
      title: "Boarding Store Day",
      content: "<p>Please send supplies by April 20, 2026.</p>",
      target_roles: ["parent"],
      priority: "high",
      posted_by: teacher1.id
    },
    {
      title: "Exam Week",
      content: "<p>Grade 7-9 assessments begin May 7, 2026.</p>",
      target_roles: ["parent", "student"],
      priority: "urgent",
      posted_by: teacher1.id
    }
  ]);
  assertNoError("Insert announcements", announcementsError);

  console.log("Seed completed.");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
