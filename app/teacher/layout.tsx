import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { RoleLayoutShell } from "@/components/layout/RoleLayoutShell";
import { getTeacherDashboardData } from "@/lib/teacher-dashboard";

export default async function TeacherLayout({ children }: { children: ReactNode }) {
  const data = await getTeacherDashboardData();

  if (!data) {
    redirect("/login");
  }

  return (
    <RoleLayoutShell role="teacher" schoolName={data.schoolName} schoolLocation={data.schoolLocation}>
      {children}
    </RoleLayoutShell>
  );
}
