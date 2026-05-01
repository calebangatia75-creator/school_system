import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { APP_SESSION_COOKIE, parseSessionToken, type AppRole } from "@/lib/auth";
import { deleteAnnouncement, listAnnouncements, saveAnnouncement } from "@/lib/portal-data";

type AnnouncementBody = {
  id?: string;
  title?: string;
  content?: string;
  priority?: "low" | "normal" | "high" | "urgent";
  target_roles?: AppRole[] | null;
  target_grades?: string[] | null;
  channel?: "sms" | "whatsapp" | "portal";
  expires_at?: string | null;
};

export async function GET() {
  const session = parseSessionToken(cookies().get(APP_SESSION_COOKIE)?.value);
  if (!session || (session.role !== "admin" && session.role !== "bursar")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(await listAnnouncements());
}

export async function POST(request: Request) {
  const session = parseSessionToken(cookies().get(APP_SESSION_COOKIE)?.value);
  if (!session || (session.role !== "admin" && session.role !== "bursar")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as AnnouncementBody;
  if (!body.title?.trim() || !body.content?.trim() || !body.priority) {
    return NextResponse.json({ error: "Title, content, and priority are required." }, { status: 400 });
  }

  return NextResponse.json(
    await saveAnnouncement({
      id: body.id,
      title: body.title,
      content: body.content,
      priority: body.priority,
      targetRoles: body.target_roles ?? null,
      targetGrades: body.target_grades ?? null,
      channel: body.channel ?? "portal",
      postedBy: session.sub,
      expiresAt: body.expires_at ?? null
    })
  );
}

export async function DELETE(request: Request) {
  const session = parseSessionToken(cookies().get(APP_SESSION_COOKIE)?.value);
  if (!session || (session.role !== "admin" && session.role !== "bursar")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Announcement id is required." }, { status: 400 });
  }

  await deleteAnnouncement(id);
  return NextResponse.json({ ok: true });
}
