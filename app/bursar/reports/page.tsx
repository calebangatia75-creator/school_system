import { getBursarDashboardData } from "@/lib/bursar-dashboard";
import { formatCurrency } from "@/lib/formatters";
import { FeeStructureManager } from "@/components/bursar/FeeStructureManager";

export default async function BursarReportsPage() {
  const data = await getBursarDashboardData();
  if (!data) return null;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-[1.75rem] bg-white p-8 shadow-xl ring-1 ring-slate-100">
        <h2 className="text-2xl font-bold text-navy">Collection Summary</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Collected</p>
            <p className="mt-2 text-2xl font-bold text-navy">{formatCurrency(data.feeCollection)}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Outstanding</p>
            <p className="mt-2 text-2xl font-bold text-navy">{formatCurrency(data.totalOutstanding)}</p>
          </div>
        </div>
      </section>

      <FeeStructureManager initialFeeStructures={data.feeStructures} />
    </div>
  );
}
