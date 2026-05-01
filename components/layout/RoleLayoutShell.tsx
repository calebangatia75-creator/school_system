"use client";

import type { ReactNode } from "react";
import type { AppRole } from "@/lib/auth-shared";
import { getRouteMeta } from "@/lib/navigation";
import { usePathname } from "next/navigation";
import Link from "next/link";
import UnifiedShell from "@/components/layout/UnifiedShell";
import { LogoutButton } from "@/components/auth/LogoutButton";

type RoleLayoutShellProps = {
  role: AppRole;
  children: ReactNode;
  schoolName: string;
  schoolLocation: string;
};

export function RoleLayoutShell({
  role,
  children,
  schoolName,
  schoolLocation
}: RoleLayoutShellProps) {
  const pathname = usePathname();
  const meta = getRouteMeta(role, pathname);
  const destination = role === "parent" ? "/parent/login" : "/login";

  return (
    <UnifiedShell
      role={role}
      title={meta.title}
      subtitle={meta.subtitle ?? `${schoolName} | ${schoolLocation}`}
      actions={
        <>
          <Link
            href="/"
            className="inline-flex items-center rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
          >
            View Site
          </Link>
          <LogoutButton destination={destination} />
        </>
      }
    >
      {children}
    </UnifiedShell>
  );
}
