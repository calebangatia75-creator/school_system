import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

// Inline type for Edge compatibility
export type AppRole = "admin" | "bursar" | "teacher" | "parent";

export type UserRecord = {
  id: string;
  username: string;
  password_hash: string;
  role: Exclude<AppRole, "parent">;
  full_name: string;
  phone: string | null;
  created_at: string;
};

export type ParentRecord = {
  id: string;
  phone: string;
  password_hash: string;
  full_name: string;
  created_at: string;
  pin_hash?: string;
};

export type StudentRecord = {
  id: string;
  full_name: string;
  grade: string;
  class_name: string;
  stream: string;
  admission_no: string;
  parent_phone: string;
  total_fees: number;
  amount_paid: number;
  balance: number;
  status: "Active" | "Pending Review";
};

export type PaymentRecord = {
  id: string;
  student_id: string;
  amount: number;
  method: "cash" | "mpesa" | "bank" | "card";
  reference: string;
  recorded_by: string;
  created_at: string;
};

export type AnnouncementRecord = {
  id: string;
  title: string;
  content: string;
  priority: "low" | "normal" | "high" | "urgent";
  target_roles: AppRole[] | null;
  target_grades: string[] | null;
  channel: "sms" | "whatsapp" | "portal";
  delivery_status: "draft" | "sent" | "delivered";
  recipients_count: number;
  posted_by: string;
  expires_at: string | null;
  created_at: string;
};

export type LeadRecord = {
  id: string;
  parent_name: string | null;
  phone: string;
  child_name: string | null;
  grade: string | null;
  prev_school: string | null;
  message: string | null;
  application_kind?: "inquiry" | "full_application";
  assigned_roles?: string[] | null;
  details?: Record<string, string | boolean | null> | null;
  status: "new" | "contacted" | "documents" | "enrolled" | "rejected";
  created_at: string;
};

export type FeeStructureRecord = {
  id: string;
  grade: string;
  amount: number;
  updated_at: string;
};

export type TeacherClassRecord = {
  id: string;
  teacher_user_id: string;
  class_name: string;
  subject: string;
  learners: number;
};

export type AttendanceRecord = {
  id: string;
  teacher_user_id: string;
  class_name: string;
  student_id: string;
  date: string;
  status: "Present" | "Absent";
};

export type HomeworkRecord = {
  id: string;
  teacher_user_id: string;
  class_name: string;
  title: string;
  description: string;
  due_date: string;
  created_at: string;
};

export type PortalData = {
  school: {
    name: string;
    location: string;
    contact_phone: string;
    contact_email: string;
    motto: string;
  };
  users: UserRecord[];
  parents: ParentRecord[];
  students: StudentRecord[];
  payments: PaymentRecord[];
  announcements: AnnouncementRecord[];
  leads: LeadRecord[];
  fee_structures: FeeStructureRecord[];
  teacher_classes: TeacherClassRecord[];
  attendance: AttendanceRecord[];
  homework: HomeworkRecord[];
};

const bundledDataDir = path.join(process.cwd(), "data");
const isVercelRuntime = process.env.VERCEL === "1";
const dataDir = isVercelRuntime ? path.join(os.tmpdir(), "cbc-data") : bundledDataDir;
const bundledPortalDataPath = path.join(bundledDataDir, "portal-data.json");
const portalDataPath = path.join(dataDir, "portal-data.json");
const ADMIN_PHONE = normalizePhone("0712345678");
const BURSAR_PHONE = normalizePhone("0709876543");

function nowIso() {
  return new Date().toISOString();
}

export function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("254")) return `+${digits}`;
  if (digits.startsWith("0")) return `+254${digits.slice(1)}`;
  if (digits.startsWith("7") && digits.length === 9) return `+254${digits}`;
  return `+${digits}`;
}

function recalculateStudents(students: StudentRecord[], payments: PaymentRecord[]) {
  return students.map((student) => {
    const amountPaid = payments
      .filter((payment) => payment.student_id === student.id)
      .reduce((sum, payment) => sum + payment.amount, 0);

    return {
      ...student,
      amount_paid: amountPaid,
      balance: Math.max(student.total_fees - amountPaid, 0)
    };
  });
}

function createDefaultData(): PortalData {
  const createdAt = nowIso();
  const adminId = randomUUID();
  const bursarId = randomUUID();
  const teacherId = randomUUID();
  const parentId = randomUUID();
  const parentPhone = normalizePhone("0710414220");
  const studentOneId = randomUUID();
  const studentTwoId = randomUUID();

  const base: PortalData = {
    school: {
      name: "Shekinah School",
      location: "Kimilili, Bungoma County",
      contact_phone: "+254 710 414 220",
      contact_email: "support@shekinah.ac.ke",
      motto: "Excellence in Education, Grounded in Faith."
    },
    users: [
      {
        id: adminId,
        username: "admin",
        password_hash: bcrypt.hashSync("abcdef", 10),
        role: "admin",
        full_name: "System Administrator",
        phone: ADMIN_PHONE,
        created_at: createdAt
      },
      {
        id: bursarId,
        username: "bursar",
        password_hash: bcrypt.hashSync("fedcba", 10),
        role: "bursar",
        full_name: "School Bursar",
        phone: BURSAR_PHONE,
        created_at: createdAt
      },
      {
        id: teacherId,
        username: "teacher",
        password_hash: bcrypt.hashSync("ghijkl", 10),
        role: "teacher",
        full_name: "Sam Barasa",
        phone: "+254700000103",
        created_at: createdAt
      }
    ],
    parents: [
      {
        id: parentId,
        phone: parentPhone,
        password_hash: bcrypt.hashSync("123456", 10),
        full_name: "Cal Max",
        created_at: createdAt
      }
    ],
    students: [
      {
        id: studentOneId,
        full_name: "Blessing Wekesa",
        grade: "Grade 6",
        class_name: "Grade 6 North",
        stream: "North",
        admission_no: "CBC-2026-014",
        parent_phone: parentPhone,
        total_fees: 54000,
        amount_paid: 0,
        balance: 54000,
        status: "Active"
      },
      {
        id: studentTwoId,
        full_name: "Daniela Wekesa",
        grade: "Grade 2",
        class_name: "Grade 2 East",
        stream: "East",
        admission_no: "CBC-2026-115",
        parent_phone: parentPhone,
        total_fees: 42000,
        amount_paid: 0,
        balance: 42000,
        status: "Active"
      }
    ],
    payments: [
      {
        id: randomUUID(),
        student_id: studentOneId,
        amount: 12000,
        method: "mpesa",
        reference: "QWE123",
        recorded_by: bursarId,
        created_at: "2026-04-03T09:00:00.000Z"
      },
      {
        id: randomUUID(),
        student_id: studentTwoId,
        amount: 3500,
        method: "bank",
        reference: "BNK778",
        recorded_by: bursarId,
        created_at: "2026-03-11T09:00:00.000Z"
      },
      {
        id: randomUUID(),
        student_id: studentTwoId,
        amount: 2000,
        method: "cash",
        reference: "CASH112",
        recorded_by: bursarId,
        created_at: "2026-02-02T09:00:00.000Z"
      }
    ],
    announcements: [
      {
        id: randomUUID(),
        title: "Term Fees Reminder",
        content: "Please clear outstanding balances before Friday for a smooth re-opening.",
        priority: "high",
        target_roles: ["parent"],
        target_grades: null,
        channel: "portal",
        delivery_status: "delivered",
        recipients_count: 1,
        posted_by: adminId,
        expires_at: null,
        created_at: "2026-04-20T08:00:00.000Z"
      },
      {
        id: randomUUID(),
        title: "Grade 6 Homework Focus",
        content: "Carry revision books for tomorrow's Mathematics lesson.",
        priority: "normal",
        target_roles: ["teacher"],
        target_grades: ["Grade 6"],
        channel: "portal",
        delivery_status: "sent",
        recipients_count: 1,
        posted_by: teacherId,
        expires_at: null,
        created_at: "2026-04-21T08:00:00.000Z"
      }
    ],
    leads: [
      {
        id: randomUUID(),
        parent_name: "Rose Naliaka",
        phone: normalizePhone("0700000001"),
        child_name: "Ariana Naliaka",
        grade: "Grade 4",
        prev_school: "Victory Academy",
        message: "Looking for a faith-based school with strong academics.",
        application_kind: "inquiry",
        assigned_roles: ["Admissions Office"],
        details: null,
        status: "new",
        created_at: "2026-04-26T09:00:00.000Z"
      },
      {
        id: randomUUID(),
        parent_name: "John Wanyama",
        phone: normalizePhone("0700000002"),
        child_name: "Mark Wanyama",
        grade: "Grade 2",
        prev_school: "Kimilili Junior",
        message: "Would like to understand fees and boarding options.",
        application_kind: "inquiry",
        assigned_roles: ["Admissions Office"],
        details: null,
        status: "contacted",
        created_at: "2026-04-25T09:00:00.000Z"
      }
    ],
    fee_structures: [
      {
        id: randomUUID(),
        grade: "Grade 2",
        amount: 42000,
        updated_at: createdAt
      },
      {
        id: randomUUID(),
        grade: "Grade 6",
        amount: 54000,
        updated_at: createdAt
      }
    ],
    teacher_classes: [
      {
        id: randomUUID(),
        teacher_user_id: teacherId,
        class_name: "Grade 6 North",
        subject: "Mathematics",
        learners: 34
      },
      {
        id: randomUUID(),
        teacher_user_id: teacherId,
        class_name: "Grade 2 East",
        subject: "Science",
        learners: 31
      }
    ],
    attendance: [
      {
        id: randomUUID(),
        teacher_user_id: teacherId,
        class_name: "Grade 6 North",
        student_id: studentOneId,
        date: "2026-04-19",
        status: "Present"
      },
      {
        id: randomUUID(),
        teacher_user_id: teacherId,
        class_name: "Grade 2 East",
        student_id: studentTwoId,
        date: "2026-04-19",
        status: "Present"
      }
    ],
    homework: [
      {
        id: randomUUID(),
        teacher_user_id: teacherId,
        class_name: "Grade 6 North",
        title: "Mathematics Revision",
        description: "Complete the fractions worksheet before tomorrow.",
        due_date: "2026-04-30",
        created_at: "2026-04-28T08:00:00.000Z"
      }
    ]
  };

  base.students = recalculateStudents(base.students, base.payments);
  return base;
}

function ensureUser(
  users: UserRecord[],
  input: {
    username: string;
    password: string;
    role: Exclude<AppRole, "parent">;
    fullName: string;
    phone: string;
  }
) {
  const existing = users.find((user) => user.role === input.role);
  const phone = normalizePhone(input.phone);

  if (existing) {
    existing.username = input.username;
    existing.password_hash = bcrypt.hashSync(input.password, 10);
    existing.full_name = input.fullName;
    existing.phone = phone;
    return existing;
  }

  const created: UserRecord = {
    id: randomUUID(),
    username: input.username,
    password_hash: bcrypt.hashSync(input.password, 10),
    role: input.role,
    full_name: input.fullName,
    phone,
    created_at: nowIso()
  };
  users.push(created);
  return created;
}

function migratePortalData(data: PortalData) {
  data.school.name = "Shekinah School";
  data.school.location = "Kimilili, Bungoma County";

  const admin = ensureUser(data.users, {
    username: "admin",
    password: "abcdef",
    role: "admin",
    fullName: "System Administrator",
    phone: "0712345678"
  });

  const bursar = ensureUser(data.users, {
    username: "bursar",
    password: "fedcba",
    role: "bursar",
    fullName: "School Bursar",
    phone: "0709876543"
  });

  const teacher = data.users.find((user) => user.role === "teacher");
  if (teacher) {
    teacher.password_hash = bcrypt.hashSync("ghijkl", 10);
    if (teacher.phone) {
      teacher.phone = normalizePhone(teacher.phone);
    }
  }

  data.parents = data.parents.map((parent) => ({
    ...parent,
    phone: normalizePhone(parent.phone),
    password_hash: parent.password_hash ?? bcrypt.hashSync("123456", 10)
  }));

  data.students = data.students.map((student) => ({
    ...student,
    parent_phone: normalizePhone(student.parent_phone)
  }));

  data.leads = data.leads.map((lead) => ({
    ...lead,
    phone: normalizePhone(lead.phone),
    message: lead.message ?? null,
    application_kind: lead.application_kind ?? "inquiry",
    assigned_roles: lead.assigned_roles ?? ["Admissions Office"],
    details: lead.details ?? null
  }));

  data.payments = data.payments.map((payment) => {
    if (payment.recorded_by === admin.id || payment.recorded_by === bursar.id) {
      return payment;
    }
    return payment;
  });

  return data;
}

async function ensureStore() {
  await fs.mkdir(dataDir, { recursive: true });

  try {
    await fs.access(portalDataPath);
  } catch {
    let initialData = createDefaultData();

    try {
      const bundledContent = await fs.readFile(bundledPortalDataPath, "utf8");
      initialData = migratePortalData(JSON.parse(bundledContent) as PortalData);
    } catch {
      // Fall back to generated demo data when no bundled data file exists.
    }

    initialData.students = recalculateStudents(initialData.students, initialData.payments);
    await fs.writeFile(portalDataPath, JSON.stringify(initialData, null, 2), "utf8");
  }
}

export async function readPortalData() {
  await ensureStore();
  const content = await fs.readFile(portalDataPath, "utf8");
  const parsed = migratePortalData(JSON.parse(content) as PortalData);
  parsed.students = recalculateStudents(parsed.students, parsed.payments);
  return parsed;
}

export async function writePortalData(data: PortalData) {
  await ensureStore();
  const nextData = { ...data, students: recalculateStudents(data.students, data.payments) };
  await fs.writeFile(portalDataPath, JSON.stringify(nextData, null, 2), "utf8");
  return nextData;
}

export async function getUserByUsername(username: string) {
  const data = await readPortalData();
  return data.users.find((user) => user.username.toLowerCase() === username.trim().toLowerCase()) ?? null;
}

export async function getUserByPhone(phone: string) {
  const normalizedPhone = normalizePhone(phone);
  const data = await readPortalData();
  return data.users.find((user) => user.phone === normalizedPhone) ?? null;
}

export async function getUserById(id: string) {
  const data = await readPortalData();
  return data.users.find((user) => user.id === id) ?? null;
}

export async function getParentByPhone(phone: string) {
  const normalizedPhone = normalizePhone(phone);
  const data = await readPortalData();
  return data.parents.find((parent) => parent.phone === normalizedPhone) ?? null;
}

export async function getParentById(id: string) {
  const data = await readPortalData();
  return data.parents.find((parent) => parent.id === id) ?? null;
}

export async function listStudentsForParent(phone: string) {
  const normalizedPhone = normalizePhone(phone);
  const data = await readPortalData();
  return data.students.filter((student) => student.parent_phone === normalizedPhone);
}

export async function listPaymentsForStudents(studentIds: string[]) {
  const data = await readPortalData();
  return data.payments
    .filter((payment) => studentIds.includes(payment.student_id))
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function listAttendanceForStudents(studentIds: string[]) {
  const data = await readPortalData();
  return data.attendance
    .filter((entry) => studentIds.includes(entry.student_id))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function listHomeworkForClasses(classNames: string[]) {
  const data = await readPortalData();
  return data.homework
    .filter((entry) => classNames.includes(entry.class_name))
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function listAnnouncementsForRole(role: AppRole) {
  const data = await readPortalData();
  return data.announcements
    .filter((announcement) => {
      if (!announcement.target_roles || announcement.target_roles.length === 0) return true;
      return announcement.target_roles.includes(role);
    })
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function listTeacherClasses(teacherUserId: string) {
  const data = await readPortalData();
  return data.teacher_classes.filter((item) => item.teacher_user_id === teacherUserId);
}

export async function listTeacherStudents(teacherUserId: string) {
  const data = await readPortalData();
  const classNames = data.teacher_classes
    .filter((item) => item.teacher_user_id === teacherUserId)
    .map((item) => item.class_name);

  return data.students.filter((student) => classNames.includes(student.class_name));
}

export async function listAttendanceForTeacher(teacherUserId: string) {
  const data = await readPortalData();
  return data.attendance
    .filter((entry) => entry.teacher_user_id === teacherUserId)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function listHomeworkForTeacher(teacherUserId: string) {
  const data = await readPortalData();
  return data.homework
    .filter((entry) => entry.teacher_user_id === teacherUserId)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function markAttendance(input: {
  teacherUserId: string;
  studentId: string;
  date: string;
  status: "Present" | "Absent";
}) {
  const data = await readPortalData();
  const student = data.students.find((item) => item.id === input.studentId);
  if (!student) {
    throw new Error("Student not found.");
  }

  const existing = data.attendance.find(
    (entry) =>
      entry.teacher_user_id === input.teacherUserId &&
      entry.student_id === input.studentId &&
      entry.date === input.date
  );

  if (existing) {
    existing.status = input.status;
  } else {
    data.attendance.push({
      id: randomUUID(),
      teacher_user_id: input.teacherUserId,
      class_name: student.class_name,
      student_id: input.studentId,
      date: input.date,
      status: input.status
    });
  }

  await writePortalData(data);
}

export async function createHomework(input: {
  teacherUserId: string;
  className: string;
  title: string;
  description: string;
  dueDate: string;
}) {
  const data = await readPortalData();
  const item: HomeworkRecord = {
    id: randomUUID(),
    teacher_user_id: input.teacherUserId,
    class_name: input.className,
    title: input.title,
    description: input.description,
    due_date: input.dueDate,
    created_at: nowIso()
  };

  data.homework.push(item);
  await writePortalData(data);
  return item;
}

export async function createUser(input: {
  username: string;
  passwordHash: string;
  role: "bursar" | "teacher";
  fullName: string;
  phone?: string | null;
}) {
  const data = await readPortalData();
  const username = input.username.trim().toLowerCase();

  if (data.users.some((user) => user.username.toLowerCase() === username)) {
    throw new Error("Username already exists.");
  }

  const user: UserRecord = {
    id: randomUUID(),
    username,
    password_hash: input.passwordHash,
    role: input.role,
    full_name: input.fullName.trim(),
    phone: input.phone ? normalizePhone(input.phone) : null,
    created_at: nowIso()
  };

  data.users.push(user);
  await writePortalData(data);
  return user;
}

export async function listUsers() {
  const data = await readPortalData();
  return data.users.sort((a, b) => a.full_name.localeCompare(b.full_name));
}

export async function upsertFeeStructure(input: { grade: string; amount: number }) {
  const data = await readPortalData();
  const grade = input.grade.trim();
  const existing = data.fee_structures.find((item) => item.grade.toLowerCase() === grade.toLowerCase());
  const updatedAt = nowIso();

  if (existing) {
    existing.amount = input.amount;
    existing.updated_at = updatedAt;
  } else {
    data.fee_structures.push({
      id: randomUUID(),
      grade,
      amount: input.amount,
      updated_at: updatedAt
    });
  }

  data.students = data.students.map((student) =>
    student.grade.toLowerCase() === grade.toLowerCase()
      ? { ...student, total_fees: input.amount }
      : student
  );

  const saved = await writePortalData(data);
  return saved.fee_structures.sort((a, b) => a.grade.localeCompare(b.grade));
}

export async function listFeeStructures() {
  const data = await readPortalData();
  return data.fee_structures.sort((a, b) => a.grade.localeCompare(b.grade));
}

export async function recordPayment(input: {
  studentId: string;
  amount: number;
  method: PaymentRecord["method"];
  reference: string;
  recordedBy: string;
}) {
  const data = await readPortalData();
  const student = data.students.find((item) => item.id === input.studentId);
  if (!student) {
    throw new Error("Student not found.");
  }

  const payment: PaymentRecord = {
    id: randomUUID(),
    student_id: input.studentId,
    amount: input.amount,
    method: input.method,
    reference: input.reference.trim(),
    recorded_by: input.recordedBy,
    created_at: nowIso()
  };

  data.payments.push(payment);
  const saved = await writePortalData(data);
  const updatedStudent = saved.students.find((item) => item.id === input.studentId) ?? student;
  return { payment, student: updatedStudent };
}

export async function listPayments() {
  const data = await readPortalData();
  return data.payments.sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function listLeads() {
  const data = await readPortalData();
  return data.leads.sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function updateLeadStatus(id: string, status: LeadRecord["status"]) {
  const data = await readPortalData();
  const lead = data.leads.find((item) => item.id === id);
  if (!lead) {
    throw new Error("Lead not found.");
  }
  lead.status = status;
  await writePortalData(data);
  return lead;
}

export async function createLead(input: {
  parentName: string;
  phone: string;
  childClassInterested: string;
  message: string;
}) {
  const data = await readPortalData();
  const normalizedPhone = normalizePhone(input.phone);
  const existing = data.leads.find(
    (lead) =>
      lead.phone === normalizedPhone &&
      lead.parent_name?.toLowerCase() === input.parentName.trim().toLowerCase() &&
      lead.grade?.toLowerCase() === input.childClassInterested.trim().toLowerCase() &&
      (lead.application_kind ?? "inquiry") === "inquiry"
  );

  if (existing) {
    existing.message = input.message.trim();
    existing.created_at = nowIso();
    await writePortalData(data);
    return existing;
  }

  const lead: LeadRecord = {
    id: randomUUID(),
    parent_name: input.parentName.trim(),
    phone: normalizedPhone,
    child_name: null,
    grade: input.childClassInterested.trim(),
    prev_school: null,
    message: input.message.trim(),
    application_kind: "inquiry",
    assigned_roles: ["Admissions Office"],
    details: null,
    status: "new",
    created_at: nowIso()
  };

  data.leads.unshift(lead);
  await writePortalData(data);
  return lead;
}

export async function createAdmissionApplication(input: {
  parentName: string;
  relationshipToStudent: string;
  phone: string;
  alternatePhone?: string;
  email?: string;
  homeLocation: string;
  studentName: string;
  studentGender: string;
  dateOfBirth: string;
  birthCertificateNumber?: string;
  applyingGrade: string;
  currentSchool: string;
  lastCompletedGrade: string;
  transferReason: string;
  transportMode: string;
  specialNeeds?: string;
  medicalInformation?: string;
  siblingInformation?: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  parentExpectation: string;
}) {
  const data = await readPortalData();
  const lead: LeadRecord = {
    id: randomUUID(),
    parent_name: input.parentName.trim(),
    phone: normalizePhone(input.phone),
    child_name: input.studentName.trim(),
    grade: input.applyingGrade.trim(),
    prev_school: input.currentSchool.trim(),
    message: input.parentExpectation.trim(),
    application_kind: "full_application",
    assigned_roles: ["Headteacher", "Deputy Headteacher"],
    details: {
      relationship_to_student: input.relationshipToStudent.trim(),
      alternate_phone: input.alternatePhone?.trim() || null,
      email: input.email?.trim() || null,
      home_location: input.homeLocation.trim(),
      student_gender: input.studentGender.trim(),
      date_of_birth: input.dateOfBirth,
      birth_certificate_number: input.birthCertificateNumber?.trim() || null,
      last_completed_grade: input.lastCompletedGrade.trim(),
      transfer_reason: input.transferReason.trim(),
      transport_mode: input.transportMode.trim(),
      special_needs: input.specialNeeds?.trim() || null,
      medical_information: input.medicalInformation?.trim() || null,
      sibling_information: input.siblingInformation?.trim() || null,
      emergency_contact_name: input.emergencyContactName.trim(),
      emergency_contact_phone: normalizePhone(input.emergencyContactPhone),
      emergency_contact_relationship: input.emergencyContactRelationship.trim(),
      routed_to_headteacher: true,
      routed_to_deputy_headteacher: true
    },
    status: "new",
    created_at: nowIso()
  };

  data.leads.unshift(lead);
  await writePortalData(data);
  return lead;
}

export async function listAnnouncements() {
  const data = await readPortalData();
  return data.announcements.sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function saveAnnouncement(input: {
  id?: string;
  title: string;
  content: string;
  priority: AnnouncementRecord["priority"];
  targetRoles: AppRole[] | null;
  targetGrades: string[] | null;
  channel?: AnnouncementRecord["channel"];
  postedBy: string;
  expiresAt?: string | null;
}) {
  const data = await readPortalData();
  const recipientsCount = input.targetRoles?.includes("parent")
    ? data.parents.length
    : input.targetRoles?.includes("teacher")
      ? data.users.filter((user) => user.role === "teacher").length
      : data.students.length;

  if (input.id) {
    const existing = data.announcements.find((item) => item.id === input.id);
    if (!existing) {
      throw new Error("Announcement not found.");
    }

    existing.title = input.title.trim();
    existing.content = input.content.trim();
    existing.priority = input.priority;
    existing.target_roles = input.targetRoles;
    existing.target_grades = input.targetGrades;
    existing.channel = input.channel ?? existing.channel;
    existing.posted_by = input.postedBy;
    existing.expires_at = input.expiresAt ?? null;
    existing.delivery_status = "delivered";
    existing.recipients_count = recipientsCount;
  } else {
    data.announcements.push({
      id: randomUUID(),
      title: input.title.trim(),
      content: input.content.trim(),
      priority: input.priority,
      target_roles: input.targetRoles,
      target_grades: input.targetGrades,
      channel: input.channel ?? "portal",
      delivery_status: "delivered",
      recipients_count: recipientsCount,
      posted_by: input.postedBy,
      expires_at: input.expiresAt ?? null,
      created_at: nowIso()
    });
  }

  const saved = await writePortalData(data);
  return saved.announcements.sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function deleteAnnouncement(id: string) {
  const data = await readPortalData();
  data.announcements = data.announcements.filter((item) => item.id !== id);
  await writePortalData(data);
}

export async function getAdminDashboardStats() {
  const data = await readPortalData();
  const totalStudents = data.students.length;
  const feeCollection = data.payments.reduce((sum, payment) => sum + payment.amount, 0);
  const newLeads = data.leads.filter((lead) => lead.status === "new").length;
  const messagesSent = data.announcements.length;

  return {
    newLeads,
    messagesSent,
    feeCollection,
    totalStudents,
    recentPayments: data.payments.slice().sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 5),
    feeStructures: data.fee_structures.slice().sort((a, b) => a.grade.localeCompare(b.grade)),
    staff: data.users.slice().sort((a, b) => a.full_name.localeCompare(b.full_name)),
    students: data.students.slice().sort((a, b) => a.full_name.localeCompare(b.full_name))
  };
}
