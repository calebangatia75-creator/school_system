import { Badge } from "@/components/ui/badge";
import { getTeacherDashboardData } from "@/lib/teacher-dashboard";

export default async function TeacherStudentsPage() {
  const data = await getTeacherDashboardData();
  if (!data) return null;

  return (
    <section className="rounded-[1.75rem] bg-white p-8 shadow-xl ring-1 ring-slate-100">
      <h2 className="text-2xl font-bold text-navy">Students</h2>
      <p className="mt-2 text-slate-600">View learners in the classes you teach.</p>

      <div className="mt-6 space-y-3">
        {data.students.map((student) => (
          <div
            key={student.id}
            className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 px-4 py-3"
          >
            <div>
              <p className="font-semibold text-navy">{student.full_name}</p>
              <p className="text-sm text-slate-500">{student.class_name}</p>
            </div>
            <Badge variant={student.status === "Active" ? "success" : "warning"}>
              {student.status}
            </Badge>
          </div>
        ))}
      </div>
    </section>
  );
}
