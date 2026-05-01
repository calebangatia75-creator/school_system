import { cookies } from "next/headers";
import { APP_SESSION_COOKIE, parseSessionToken } from "@/lib/auth";
import { getAdminDashboardStats, listAnnouncements, readPortalData } from "@/lib/portal-data";

export async function getBursarDashboardData() {
  const session = parseSessionToken(cookies().get(APP_SESSION_COOKIE)?.value);

  if (!session || session.role !== "bursar") {
    return null;
  }

  const [portal, stats, announcements] = await Promise.all([
    readPortalData(),
    getAdminDashboardStats(),
    listAnnouncements()
  ]);

  const totalOutstanding = stats.students.reduce((sum, student) => sum + student.balance, 0);

  return {
    session,
    schoolName: portal.school.name,
    schoolLocation: portal.school.location,
    schoolPhone: portal.school.contact_phone,
    schoolEmail: portal.school.contact_email,
    ...stats,
    announcements,
    totalOutstanding
  };
}
