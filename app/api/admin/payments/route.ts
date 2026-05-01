import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { APP_SESSION_COOKIE, parseSessionToken } from "@/lib/auth";
import { listPayments, recordPayment } from "@/lib/portal-data";

type PaymentBody = {
  studentId?: string;
  amount?: number;
  method?: "cash" | "mpesa" | "bank" | "card";
  reference?: string;
};

export async function GET() {
  const session = parseSessionToken(cookies().get(APP_SESSION_COOKIE)?.value);
  if (!session || (session.role !== "admin" && session.role !== "bursar")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(await listPayments());
}

export async function POST(request: Request) {
  const session = parseSessionToken(cookies().get(APP_SESSION_COOKIE)?.value);
  if (!session || (session.role !== "admin" && session.role !== "bursar")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as PaymentBody;
  const amount = Number(body.amount);

  if (!body.studentId || !Number.isFinite(amount) || amount <= 0 || !body.method || !body.reference?.trim()) {
    return NextResponse.json({ error: "Fill in student, amount, method, and reference." }, { status: 400 });
  }

  try {
    return NextResponse.json(
      await recordPayment({
        studentId: body.studentId,
        amount,
        method: body.method,
        reference: body.reference,
        recordedBy: session.sub
      })
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to record payment.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
