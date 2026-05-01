import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { APP_SESSION_COOKIE, parseSessionToken } from "@/lib/auth";
import { getAdminDashboardStats } from "@/lib/portal-data";

export async function GET() {
  const session = parseSessionToken(cookies().get(APP_SESSION_COOKIE)?.value);
  if (!session || (session.role !== "admin" && session.role !== "bursar")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(await getAdminDashboardStats());
}
