import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { APP_SESSION_COOKIE, parseSessionToken } from "@/lib/auth";
import { listLeads, updateLeadStatus } from "@/lib/portal-data";

type LeadBody = {
  id?: string;
  status?: "new" | "contacted" | "documents" | "enrolled" | "rejected";
};

export async function GET() {
  const session = parseSessionToken(cookies().get(APP_SESSION_COOKIE)?.value);
  if (!session || (session.role !== "admin" && session.role !== "bursar")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(await listLeads());
}

export async function PATCH(request: Request) {
  const session = parseSessionToken(cookies().get(APP_SESSION_COOKIE)?.value);
  if (!session || (session.role !== "admin" && session.role !== "bursar")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as LeadBody;
  if (!body.id || !body.status) {
    return NextResponse.json({ error: "Lead id and status are required." }, { status: 400 });
  }

  try {
    return NextResponse.json(await updateLeadStatus(body.id, body.status));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update lead.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
