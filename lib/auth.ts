import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { APP_SESSION_COOKIE, getRoleHome, type AppRole, type AppSessionPayload, type SessionSubjectType } from "@/lib/auth-shared";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

function getSessionSecret() {
  return process.env.APP_SESSION_SECRET ?? process.env.PARENT_SESSION_SECRET ?? "cbc-local-auth-secret";
}

export async function hashSecret(value: string) {
  return bcrypt.hash(value, 10);
}

export async function verifySecret(value: string, hash: string) {
  return bcrypt.compare(value, hash);
}

export function isValidParentPin(pin: string) {
  return /^\d{4,6}$/.test(pin);
}

export function createSessionToken(payload: AppSessionPayload) {
  return jwt.sign(payload, getSessionSecret(), {
    algorithm: "HS256",
    expiresIn: SESSION_TTL_SECONDS
  });
}

export function parseSessionToken(token?: string | null) {
  if (!token) return null;

  try {
    return jwt.verify(token, getSessionSecret()) as AppSessionPayload;
  } catch {
    return null;
  }
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS
  };
}

export { APP_SESSION_COOKIE, getRoleHome };
export type { AppRole, AppSessionPayload, SessionSubjectType };
