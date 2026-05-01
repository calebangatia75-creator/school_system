import { Phone, UserRound } from "lucide-react";
import { formatDate } from "@/lib/parent-dashboard";
import { getTeacherDashboardData } from "@/lib/teacher-dashboard";

export default async function TeacherProfilePage() {
  const data = await getTeacherDashboardData();

  if (!data) {
    return null;
  }

  return (
    <section className="rounded-[1.75rem] bg-white p-8 shadow-xl ring-1 ring-slate-100">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-navy">Profile</h2>
        <UserRound className="h-5 w-5 text-slate-400" />
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
          <p className="text-sm text-slate-500">Name</p>
          <p className="mt-2 text-lg font-semibold text-navy">
            {data.account?.full_name ?? data.session.fullName}
          </p>
          <p className="mt-2 text-sm text-slate-600">Role: Teacher</p>
          <p className="mt-1 text-sm text-slate-600">
            Member since {formatDate(data.account?.created_at ?? null)}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
          <div className="text-slate-600">Username: {data.account?.username ?? data.session.username}</div>
          <div className="mt-4 flex items-center gap-3 text-slate-600">
            <Phone className="h-4 w-4 text-slate-400" />
            {data.account?.phone ?? data.schoolPhone}
          </div>
        </div>
      </div>
    </section>
  );
}
