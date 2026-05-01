import { NextResponse, type NextRequest } from "next/server";
import { APP_SESSION_COOKIE, getRoleHome } from "@/lib/auth-shared";
import { parseSessionTokenEdge } from "@/lib/auth-edge";

function applyLocalDevHeaders(request: NextRequest, response: NextResponse) {
  const hostname = request.nextUrl.hostname;
  const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";

  if (!isLocalhost) {
    return response;
  }

  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await parseSessionTokenEdge(request.cookies.get(APP_SESSION_COOKIE)?.value);
  const isPublicRoute = pathname === "/" || pathname === "/apply";
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/parent/login" ||
    pathname === "/register" ||
    pathname.startsWith("/portal/") ||
    pathname.startsWith("/auth");
  const isAuthApiRoute =
    pathname.startsWith("/api/auth/") ||
    pathname.startsWith("/api/parent-auth/") ||
    pathname === "/api/admissions";

  if (isPublicRoute || isAuthPage || isAuthApiRoute) {
    if (session && (pathname === "/login" || pathname === "/parent/login" || pathname === "/register")) {
      return applyLocalDevHeaders(
        request,
        NextResponse.redirect(new URL(getRoleHome(session.role), request.url))
      );
    }

    return applyLocalDevHeaders(request, NextResponse.next());
  }

  if (!session) {
    const redirectTarget = pathname.startsWith("/parent") ? "/parent/login" : "/login";
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = redirectTarget;
    redirectUrl.searchParams.set("next", pathname);
    return applyLocalDevHeaders(request, NextResponse.redirect(redirectUrl));
  }

  if (pathname.startsWith("/admin") && session.role !== "admin" && session.role !== "bursar") {
    return applyLocalDevHeaders(
      request,
      NextResponse.redirect(new URL(getRoleHome(session.role), request.url))
    );
  }

  if (pathname.startsWith("/admin") && session.role === "bursar") {
    return applyLocalDevHeaders(
      request,
      NextResponse.redirect(new URL(getRoleHome(session.role), request.url))
    );
  }

  if (pathname.startsWith("/bursar") && session.role !== "bursar") {
    return applyLocalDevHeaders(
      request,
      NextResponse.redirect(new URL(getRoleHome(session.role), request.url))
    );
  }

  if (pathname.startsWith("/teacher") && session.role !== "teacher") {
    return applyLocalDevHeaders(
      request,
      NextResponse.redirect(new URL(getRoleHome(session.role), request.url))
    );
  }

  if (pathname.startsWith("/parent") && session.role !== "parent") {
    return applyLocalDevHeaders(
      request,
      NextResponse.redirect(new URL(getRoleHome(session.role), request.url))
    );
  }

  return applyLocalDevHeaders(request, NextResponse.next());
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sw.js|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
  ]
};
