import { NextResponse, type NextRequest } from "next/server";

type AppRole = "admin" | "bursar" | "teacher" | "parent";

type AppSessionPayload = {
  sub: string;
  role: AppRole;
  fullName: string;
  subjectType: "user" | "parent";
  username?: string | null;
  phone?: string | null;
};

const APP_SESSION_COOKIE = "cbc_session";

function getRoleHome(role: AppRole) {
  if (role === "bursar") return "/bursar";
  if (role === "teacher") return "/teacher";
  if (role === "parent") return "/parent";
  return "/admin/dashboard";
}

function decodeBase64(input: string) {
  // Use globalThis for Edge runtime compatibility
  const atobFn = typeof globalThis.atob === "function" ? globalThis.atob : atob;
  return atobFn(input);
}

function fromBase64Url(input: string) {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  return decodeBase64(normalized + padding);
}

function getSessionSecret() {
  return process.env.APP_SESSION_SECRET ?? process.env.PARENT_SESSION_SECRET ?? "cbc-local-auth-secret";
}

async function hmacSha256(value: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  const bytes = Array.from(new Uint8Array(signature));
  return globalThis.btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

async function parseSessionTokenEdge(token?: string | null) {
  if (!token) return null;

  const [header, payload, signature] = token.split(".");
  if (!header || !payload || !signature) return null;

  const expected = await hmacSha256(`${header}.${payload}`);
  if (expected !== signature) return null;

  try {
    const parsed = JSON.parse(fromBase64Url(payload)) as AppSessionPayload & { exp?: number };
    if (parsed.exp && parsed.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

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
