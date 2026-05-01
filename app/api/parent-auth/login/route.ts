import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  APP_SESSION_COOKIE,
  createSessionToken,
  getRoleHome,
  getSessionCookieOptions,
  verifySecret
} from "@/lib/auth";
import { getParentByPhone } from "@/lib/portal-data";

type LoginBody = {
  phone?: string;
  password?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as LoginBody;
  const phone = body.phone?.trim() ?? "";
  const password = body.password?.trim() ?? "";

  if (!phone || !password) {
    return NextResponse.json({ error: "Enter your phone number and password." }, { status: 400 });
  }

  if (password.length !== 6) {
    return NextResponse.json({ error: "Password must be exactly 6 characters." }, { status: 400 });
  }

  const parent = await getParentByPhone(phone);
  if (!parent) {
    return NextResponse.json({ error: "Parent account not found." }, { status: 404 });
  }

  const validPassword = await verifySecret(password, parent.password_hash);
  if (!validPassword) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const token = createSessionToken({
    sub: parent.id,
    role: "parent",
    fullName: parent.full_name,
    subjectType: "parent",
    phone: parent.phone
  });

  cookies().set(APP_SESSION_COOKIE, token, getSessionCookieOptions());
  return NextResponse.json({ destination: getRoleHome("parent") });
}
