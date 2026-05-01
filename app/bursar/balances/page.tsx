import { getBursarDashboardData } from "@/lib/bursar-dashboard";
import { formatCurrency } from "@/lib/formatters";

export default async function BursarBalancesPage() {
  const data = await getBursarDashboardData();
  if (!data) return null;

  return (
    <section className="rounded-[1.75rem] bg-white p-8 shadow-xl ring-1 ring-slate-100">
      <h2 className="text-2xl font-bold text-navy">Student Balances</h2>
      <div className="mt-6 space-y-3">
        {data.students.map((student) => (
          <div key={student.id} className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-4">
            <div>
              <p className="font-semibold text-navy">{student.full_name}</p>
              <p className="text-sm text-slate-500">{student.grade}</p>
            </div>
            <p className="text-sm font-semibold text-slate-700">{formatCurrency(student.balance)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
