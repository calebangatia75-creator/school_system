import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { RoleLayoutShell } from "@/components/layout/RoleLayoutShell";
import { getBursarDashboardData } from "@/lib/bursar-dashboard";

export default async function BursarLayout({ children }: { children: ReactNode }) {
  const data = await getBursarDashboardData();

  if (!data) {
    redirect("/login");
  }

  return (
    <RoleLayoutShell role="bursar" schoolName={data.schoolName} schoolLocation={data.schoolLocation}>
      {children}
    </RoleLayoutShell>
  );
}
