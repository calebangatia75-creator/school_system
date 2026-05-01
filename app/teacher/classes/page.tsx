import { Users } from "lucide-react";
import { getTeacherDashboardData } from "@/lib/teacher-dashboard";

export default async function TeacherClassesPage() {
  const data = await getTeacherDashboardData();
  if (!data) return null;

  return (
    <section className="rounded-[1.75rem] bg-white p-8 shadow-xl ring-1 ring-slate-100">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy">My Classes</h2>
          <p className="mt-2 text-slate-600">The classes currently assigned to you.</p>
        </div>
        <Users className="h-5 w-5 text-slate-400" />
      </div>

      <div className="mt-6 grid gap-4">
        {data.classes.map((classroom) => (
          <article key={classroom.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
            <h3 className="text-lg font-semibold text-navy">{classroom.class_name}</h3>
            <p className="mt-2 text-sm text-slate-600">Subject: {classroom.subject}</p>
            <p className="mt-1 text-sm text-slate-600">Learners: {classroom.learners}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
