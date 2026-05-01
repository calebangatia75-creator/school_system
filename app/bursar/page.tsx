import Link from "next/link";
import { CreditCard, FileText, Megaphone, Wallet } from "lucide-react";
import { getBursarDashboardData } from "@/lib/bursar-dashboard";
import { formatCurrency } from "@/lib/formatters";

export default async function BursarDashboardPage() {
  const data = await getBursarDashboardData();
  if (!data) return null;

  const cards = [
    { label: "Collected", value: formatCurrency(data.feeCollection), icon: CreditCard, tone: "text-emerald-600" },
    { label: "Outstanding", value: formatCurrency(data.totalOutstanding), icon: Wallet, tone: "text-amber-600" },
    { label: "Students", value: `${data.totalStudents}`, icon: FileText, tone: "text-blue-600" },
    { label: "Announcements", value: `${data.announcements.length}`, icon: Megaphone, tone: "text-purple-600" }
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <section key={card.label} className="rounded-[1.75rem] bg-white p-6 shadow-xl ring-1 ring-slate-100">
            <div className={`flex items-center gap-3 ${card.tone}`}>
              <card.icon className="h-5 w-5" />
              <p className="text-sm font-semibold uppercase tracking-[0.16em]">{card.label}</p>
            </div>
            <p className="mt-4 text-3xl font-bold text-navy">{card.value}</p>
          </section>
        ))}
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[1.75rem] bg-white p-8 shadow-xl ring-1 ring-slate-100">
          <h2 className="text-2xl font-bold text-navy">Recent Payments</h2>
          <div className="mt-6 space-y-3">
            {data.recentPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3">
                <div>
                  <p className="font-semibold text-navy">{payment.reference}</p>
                  <p className="text-sm text-slate-500">{payment.method.toUpperCase()}</p>
                </div>
                <p className="text-sm font-semibold text-slate-700">{formatCurrency(payment.amount)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.75rem] bg-white p-8 shadow-xl ring-1 ring-slate-100">
          <h2 className="text-2xl font-bold text-navy">Quick Actions</h2>
          <div className="mt-6 grid gap-4">
            <Link href="/bursar/payments" className="rounded-2xl border border-slate-200 px-5 py-4 font-semibold text-navy transition hover:border-purple hover:bg-purple/5">
              Record Payment
            </Link>
            <Link href="/bursar/balances" className="rounded-2xl border border-slate-200 px-5 py-4 font-semibold text-navy transition hover:border-purple hover:bg-purple/5">
              Review Balances
            </Link>
            <Link href="/bursar/reports" className="rounded-2xl border border-slate-200 px-5 py-4 font-semibold text-navy transition hover:border-purple hover:bg-purple/5">
              Open Fee Reports
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
