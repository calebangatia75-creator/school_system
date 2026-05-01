export type AppRole = "admin" | "bursar" | "teacher" | "parent";
export type SessionSubjectType = "user" | "parent";

export type AppSessionPayload = {
  sub: string;
  role: AppRole;
  fullName: string;
  subjectType: SessionSubjectType;
  username?: string | null;
  phone?: string | null;
};

export const APP_SESSION_COOKIE = "cbc_session";

export function getRoleHome(role: AppRole) {
  if (role === "bursar") return "/bursar";
  if (role === "teacher") return "/teacher";
  if (role === "parent") return "/parent";
  return "/admin/dashboard";
}
