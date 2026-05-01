import { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { parseSessionToken, APP_SESSION_COOKIE } from "@/lib/auth";
import { RoleLayoutShell } from "@/components/layout/RoleLayoutShell";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const session = parseSessionToken(cookies().get(APP_SESSION_COOKIE)?.value);

  if (!session || (session.role !== "admin" && session.role !== "bursar")) {
    redirect("/login");
  }

  return (
    <RoleLayoutShell
      role={session.role}
      schoolName="Shekinah School"
      schoolLocation="Kimilili, Bungoma County"
    >
      {children}
    </RoleLayoutShell>
  );
}
