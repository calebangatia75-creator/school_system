import { cookies } from "next/headers";
import { APP_SESSION_COOKIE, parseSessionToken } from "@/lib/auth";
import {
  getParentById,
  listAttendanceForStudents,
  listAnnouncementsForRole,
  listHomeworkForClasses,
  listPaymentsForStudents,
  listStudentsForParent,
  readPortalData
} from "@/lib/portal-data";
import { formatCurrency, formatDate } from "@/lib/formatters";

export { formatCurrency, formatDate } from "@/lib/formatters";

export type AnnouncementRow = {
  id: string;
  title: string;
  content: string;
  priority: "low" | "normal" | "high" | "urgent";
  created_at: string | null;
  expires_at: string | null;
  target_roles: string[] | null;
};

export function getPriorityVariant(priority: AnnouncementRow["priority"]) {
  if (priority === "urgent") return "urgent";
  if (priority === "high") return "warning";
  return "default";
}

export async function getParentDashboardData() {
  const session = parseSessionToken(cookies().get(APP_SESSION_COOKIE)?.value);

  if (!session || session.role !== "parent" || !session.phone) {
    return null;
  }

  const [portal, parent, students, announcements] = await Promise.all([
    readPortalData(),
    getParentById(session.sub),
    listStudentsForParent(session.phone),
    listAnnouncementsForRole("parent")
  ]);

  const payments = await listPaymentsForStudents(students.map((student) => student.id));
  const attendance = await listAttendanceForStudents(students.map((student) => student.id));
  const homework = await listHomeworkForClasses(students.map((student) => student.class_name));
  const feeBalance = students.reduce((sum, student) => sum + student.balance, 0);
  const attendancePercent =
    attendance.length === 0
      ? 0
      : Math.round(
          (attendance.filter((entry) => entry.status === "Present").length / attendance.length) * 100
        );

  return {
    session,
    schoolName: portal.school.name,
    schoolLocation: portal.school.location,
    schoolPhone: portal.school.contact_phone,
    schoolEmail: portal.school.contact_email,
    account: parent,
    students,
    payments,
    announcements,
    feeBalance,
    attendance,
    attendancePercent,
    homework,
    recentPayment: payments[0] ?? null
  };
}
