import { cookies } from "next/headers";
import { APP_SESSION_COOKIE, parseSessionToken } from "@/lib/auth";
import {
  getUserById,
  listAnnouncementsForRole,
  listAttendanceForTeacher,
  listHomeworkForTeacher,
  listTeacherClasses,
  listTeacherStudents,
  readPortalData
} from "@/lib/portal-data";

export async function getTeacherDashboardData() {
  const session = parseSessionToken(cookies().get(APP_SESSION_COOKIE)?.value);

  if (!session || session.role !== "teacher") {
    return null;
  }

  const [portal, account, classes, students, attendance, homework, announcements] = await Promise.all([
    readPortalData(),
    getUserById(session.sub),
    listTeacherClasses(session.sub),
    listTeacherStudents(session.sub),
    listAttendanceForTeacher(session.sub),
    listHomeworkForTeacher(session.sub),
    listAnnouncementsForRole("teacher")
  ]);

  return {
    session,
    schoolName: portal.school.name,
    schoolLocation: portal.school.location,
    schoolPhone: portal.school.contact_phone,
    schoolEmail: portal.school.contact_email,
    account,
    classes,
    students,
    attendance,
    homework,
    announcements
  };
}
