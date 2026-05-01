import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { APP_SESSION_COOKIE, parseSessionToken } from "@/lib/auth";

const BUCKET = "school-media";

export async function POST(request: Request) {
  const session = parseSessionToken(cookies().get(APP_SESSION_COOKIE)?.value);

  if (!session || (session.role !== "admin" && session.role !== "bursar" && session.role !== "teacher")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const path = formData.get("path");
  const file = formData.get("file");

  if (typeof path !== "string" || !path || !(file instanceof File)) {
    return NextResponse.json({ error: "Missing upload payload" }, { status: 400 });
  }

  const serviceClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
  );

  const { error } = await serviceClient.storage.from(BUCKET).upload(path, Buffer.from(await file.arrayBuffer()), {
    contentType: file.type || undefined,
    upsert: true
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const { data } = serviceClient.storage.from(BUCKET).getPublicUrl(path);
  return NextResponse.json({ publicUrl: data.publicUrl });
}
