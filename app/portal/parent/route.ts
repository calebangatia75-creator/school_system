import { NextResponse } from "next/server";

export function GET(request: Request) {
  const url = new URL("/parent/login?next=/parent", request.url);
  const response = NextResponse.redirect(url);
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  return response;
}
