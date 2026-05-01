import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Self-service registration has been removed. Parent accounts are managed by the school office." },
    { status: 410 }
  );
}
