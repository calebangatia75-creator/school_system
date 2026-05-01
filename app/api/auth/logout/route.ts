import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { APP_SESSION_COOKIE, getSessionCookieOptions } from "@/lib/auth";

export async function POST() {
  cookies().set(APP_SESSION_COOKIE, "", {
    ...getSessionCookieOptions(),
    maxAge: 0
  });

  return NextResponse.json({ destination: "/" });
}
