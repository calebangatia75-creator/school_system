import { CreditCard } from "lucide-react";
import { formatCurrency, formatDate, getParentDashboardData } from "@/lib/parent-dashboard";

export default async function ParentFeesPage() {
  const data = await getParentDashboardData();
  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] bg-white p-8 shadow-xl ring-1 ring-slate-100">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-navy">Fees / Payments</h2>
            <p className="mt-2 text-slate-600">Each child linked to your phone number appears below.</p>
          </div>
          <CreditCard className="h-5 w-5 text-emerald-600" />
        </div>

        <div className="mt-6 rounded-[1.5rem] border border-emerald-100 bg-emerald-50 p-5">
          <p className="text-sm font-medium text-emerald-700">Outstanding balance</p>
          <p className="mt-2 text-3xl font-bold text-emerald-900">{formatCurrency(data.feeBalance)}</p>
          <p className="mt-2 text-sm text-emerald-700">
            Bank: Shekinah School Account | Reference: student admission number
          </p>
        </div>

        <div className="mt-6 space-y-4">
          {data.students.map((student) => (
            <div key={student.id} className="rounded-2xl border border-slate-100 px-5 py-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-navy">{student.full_name}</p>
                  <p className="text-sm text-slate-500">{student.grade}</p>
                </div>
                <p className="text-sm font-semibold text-slate-700">{student.admission_no}</p>
              </div>
              <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
                <p>Total fees: {formatCurrency(student.total_fees)}</p>
                <p>Amount paid: {formatCurrency(student.amount_paid)}</p>
                <p>Balance: {formatCurrency(student.balance)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[1.75rem] bg-white p-8 shadow-xl ring-1 ring-slate-100">
        <h2 className="text-2xl font-bold text-navy">Payment History</h2>
        <div className="mt-6 space-y-3">
          {data.payments.map((payment) => {
            const student = data.students.find((item) => item.id === payment.student_id);
            return (
              <div
                key={payment.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 px-4 py-3"
              >
                <div>
                  <p className="font-semibold text-navy">{student?.full_name ?? "Student payment"}</p>
                  <p className="text-sm text-slate-500">
                    {formatDate(payment.created_at)} | {payment.method.toUpperCase()} | Ref {payment.reference}
                  </p>
                </div>
                <p className="text-sm font-semibold text-slate-700">{formatCurrency(payment.amount)}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
