import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  role: z.enum(["parent", "teacher", "bursar", "admin"])
});

const nullableString = z
  .string()
  .optional()
  .nullable()
  .transform((value) => (value === "" ? null : value));

const nullableUuid = z
  .string()
  .uuid()
  .or(z.literal(""))
  .optional()
  .nullable()
  .transform((value) => (value === "" ? null : value));

export const studentSchema = z.object({
  admission_number: z.string().min(3),
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  gender: z.enum(["male", "female"]),
  curriculum: z.enum(["CBC", "8-4-4"]),
  grade_level: z.string().min(2),
  stream: nullableString,
  day_or_boarding: z.enum(["day", "boarding"]),
  parent_id: nullableUuid,
  class_teacher_id: nullableUuid,
  emergency_contact_name: nullableString,
  emergency_contact_phone: nullableString,
  enrollment_date: nullableString,
  status: z.enum(["active", "transferred", "graduated", "withdrawn"]).optional()
});

export const feeStructureSchema = z.object({
  grade_level: z.string().min(2),
  day_or_boarding: z.enum(["day", "boarding"]),
  amount: z.coerce.number().min(0),
  year: z.coerce.number().min(2020),
  term: z.string().min(3)
});

export const invoiceSchema = z.object({
  student_id: z.string().uuid(),
  amount: z.coerce.number().min(0),
  due_date: nullableString,
  description: nullableString
});

export const paymentSchema = z.object({
  invoice_id: z.string().uuid(),
  amount: z.coerce.number().min(0),
  method: z.enum(["cash", "bank_transfer", "mpesa", "cheque"]),
  reference_number: nullableString,
  paid_by: nullableString
});

export const announcementSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(5),
  target_roles: z.array(z.string()).optional().nullable(),
  target_grades: z.array(z.string()).optional().nullable(),
  priority: z.enum(["low", "normal", "high", "urgent"]),
  expires_at: nullableString
});

export const homeworkSchema = z.object({
  title: z.string().min(3),
  description: nullableString,
  subject: z.string().min(2),
  grade_level: z.string().min(2),
  stream: nullableString,
  due_date: nullableString
});

export const assessmentSchema = z.object({
  student_id: z.string().uuid(),
  subject: z.string().min(2),
  competency: z.string().min(3),
  rating: z.enum(["Exceeding", "Meeting", "Approaching", "Below"]),
  teacher_notes: nullableString
});
