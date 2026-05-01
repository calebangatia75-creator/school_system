import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { APP_SESSION_COOKIE, hashSecret, parseSessionToken } from "@/lib/auth";
import { createUser, listUsers } from "@/lib/portal-data";

type CreateUserBody = {
  password?: string;
  role?: "bursar" | "teacher";
  fullName?: string;
  phone?: string;
};

export async function GET() {
  const session = parseSessionToken(cookies().get(APP_SESSION_COOKIE)?.value);
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(await listUsers());
}

export async function POST(request: Request) {
  const session = parseSessionToken(cookies().get(APP_SESSION_COOKIE)?.value);
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as CreateUserBody;
  const password = body.password?.trim() ?? "";
  const fullName = body.fullName?.trim() ?? "";
  const phone = body.phone?.trim() ?? "";
  const role = body.role;

  if (!phone || !password || !fullName || (role !== "bursar" && role !== "teacher")) {
    return NextResponse.json({ error: "Fill in phone number, password, full name, and role." }, { status: 400 });
  }

  if (password.length !== 6) {
    return NextResponse.json({ error: "Password must be exactly 6 characters." }, { status: 400 });
  }

  const passwordHash = await hashSecret(password);

  try {
    const user = await createUser({
      username: phone.replace(/\D/g, ""),
      passwordHash,
      role,
      fullName,
      phone
    });

    return NextResponse.json(user);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create user.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
