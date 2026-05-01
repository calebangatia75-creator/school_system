import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  APP_SESSION_COOKIE,
  createSessionToken,
  getRoleHome,
  getSessionCookieOptions,
  verifySecret
} from "@/lib/auth";
import { getUserByPhone } from "@/lib/portal-data";

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

  const user = await getUserByPhone(phone);
  if (!user) {
    return NextResponse.json({ error: "Account not found." }, { status: 404 });
  }

  const validPassword = await verifySecret(password, user.password_hash);
  if (!validPassword) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const token = createSessionToken({
    sub: user.id,
    role: user.role,
    fullName: user.full_name,
    subjectType: "user",
    username: user.username,
    phone: user.phone
  });

  cookies().set(APP_SESSION_COOKIE, token, getSessionCookieOptions());
  return NextResponse.json({ destination: getRoleHome(user.role) });
}
