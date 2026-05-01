import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { APP_SESSION_COOKIE, parseSessionToken } from "@/lib/auth";
import { listAnnouncementsForRole, listAttendanceForTeacher, listTeacherClasses, listTeacherStudents } from "@/lib/portal-data";

export async function GET() {
  const session = parseSessionToken(cookies().get(APP_SESSION_COOKIE)?.value);
  if (!session || session.role !== "teacher") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [classes, students, attendance, announcements] = await Promise.all([
    listTeacherClasses(session.sub),
    listTeacherStudents(session.sub),
    listAttendanceForTeacher(session.sub),
    listAnnouncementsForRole("teacher")
  ]);

  return NextResponse.json({ classes, students, attendance, announcements });
}
