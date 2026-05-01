import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { APP_SESSION_COOKIE, parseSessionToken } from "@/lib/auth";
import { markAttendance } from "@/lib/portal-data";

type AttendanceBody = {
  studentId?: string;
  date?: string;
  status?: "Present" | "Absent";
};

export async function POST(request: Request) {
  const session = parseSessionToken(cookies().get(APP_SESSION_COOKIE)?.value);
  if (!session || session.role !== "teacher") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as AttendanceBody;
  if (!body.studentId || !body.date || !body.status) {
    return NextResponse.json({ error: "Student, date, and attendance status are required." }, { status: 400 });
  }

  await markAttendance({
    teacherUserId: session.sub,
    studentId: body.studentId,
    date: body.date,
    status: body.status
  });

  return NextResponse.json({ ok: true });
}
