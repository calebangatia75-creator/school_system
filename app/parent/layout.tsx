import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { RoleLayoutShell } from "@/components/layout/RoleLayoutShell";
import { getParentDashboardData } from "@/lib/parent-dashboard";

export default async function ParentLayout({ children }: { children: ReactNode }) {
  const data = await getParentDashboardData();

  if (!data) {
    redirect("/parent/login");
  }

  return (
    <RoleLayoutShell role="parent" schoolName={data.schoolName} schoolLocation={data.schoolLocation}>
      {children}
    </RoleLayoutShell>
  );
}
