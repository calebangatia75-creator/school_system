import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { APP_SESSION_COOKIE, parseSessionToken } from "@/lib/auth";
import { createHomework } from "@/lib/portal-data";

type HomeworkBody = {
  className?: string;
  title?: string;
  description?: string;
  dueDate?: string;
};

export async function POST(request: Request) {
  const session = parseSessionToken(cookies().get(APP_SESSION_COOKIE)?.value);
  if (!session || session.role !== "teacher") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as HomeworkBody;
  if (!body.className?.trim() || !body.title?.trim() || !body.description?.trim() || !body.dueDate) {
    return NextResponse.json({ error: "Class, title, description, and due date are required." }, { status: 400 });
  }

  return NextResponse.json(
    await createHomework({
      teacherUserId: session.sub,
      className: body.className,
      title: body.title,
      description: body.description,
      dueDate: body.dueDate
    })
  );
}
