import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { APP_SESSION_COOKIE, parseSessionToken } from "@/lib/auth";
import { listFeeStructures, upsertFeeStructure } from "@/lib/portal-data";

type FeeBody = {
  grade?: string;
  amount?: number;
};

export async function GET() {
  const session = parseSessionToken(cookies().get(APP_SESSION_COOKIE)?.value);
  if (!session || (session.role !== "admin" && session.role !== "bursar")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(await listFeeStructures());
}

export async function POST(request: Request) {
  const session = parseSessionToken(cookies().get(APP_SESSION_COOKIE)?.value);
  if (!session || (session.role !== "admin" && session.role !== "bursar")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as FeeBody;
  const grade = body.grade?.trim() ?? "";
  const amount = Number(body.amount);

  if (!grade || !Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: "Enter a valid grade and fee amount." }, { status: 400 });
  }

  return NextResponse.json(await upsertFeeStructure({ grade, amount }));
}
