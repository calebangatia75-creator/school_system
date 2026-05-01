"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

type DashboardData = {
  recentPayments: Array<{ id: string; amount: number; method: string; reference: string; created_at: string }>;
  students: Array<{ id: string; full_name: string; grade: string; balance: number }>;
};

export default function BursarPaymentsPage() {
  const { addToast } = useToast();
  const [data, setData] = useState<DashboardData | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ studentId: "", amount: "", method: "mpesa", reference: "" });

  const fetchData = async () => {
    const response = await fetch("/api/admin/dashboard");
    const payload = (await response.json()) as DashboardData & { error?: string };
    if (!response.ok) {
      addToast({ title: "Could not load payments", description: payload.error, variant: "error" });
      return;
    }
    setData(payload);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await fetch("/api/admin/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: form.studentId,
          amount: Number(form.amount),
          method: form.method,
          reference: form.reference
        })
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        addToast({ title: "Payment not recorded", description: payload.error, variant: "error" });
        return;
      }

      addToast({ title: "Payment recorded", variant: "success" });
      setForm({ studentId: "", amount: "", method: "mpesa", reference: "" });
      fetchData();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <section className="rounded-[1.75rem] bg-white p-8 shadow-xl ring-1 ring-slate-100">
        <h2 className="text-2xl font-bold text-navy">Record Payment</h2>
        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <select className="w-full rounded-xl border border-slate-200 px-4 py-3" value={form.studentId} onChange={(event) => setForm({ ...form, studentId: event.target.value })}>
            <option value="">Select student</option>
            {data?.students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.full_name} - {student.grade} - Bal KSh {student.balance.toLocaleString()}
              </option>
            ))}
          </select>
          <input className="w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="Amount" type="number" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} />
          <select className="w-full rounded-xl border border-slate-200 px-4 py-3" value={form.method} onChange={(event) => setForm({ ...form, method: event.target.value })}>
            <option value="mpesa">M-Pesa</option>
            <option value="bank">Bank</option>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
          </select>
          <input className="w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="Reference" value={form.reference} onChange={(event) => setForm({ ...form, reference: event.target.value })} />
          <Button type="submit" disabled={saving} className="w-full">
            {saving ? "Recording..." : "Record Payment"}
          </Button>
        </form>
      </section>

      <section className="rounded-[1.75rem] bg-white p-8 shadow-xl ring-1 ring-slate-100">
        <h2 className="text-2xl font-bold text-navy">Recent Payments</h2>
        <div className="mt-6 space-y-3">
          {data?.recentPayments.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3">
              <div>
                <p className="font-semibold text-navy">{payment.reference}</p>
                <p className="text-sm text-slate-500">
                  {payment.method.toUpperCase()} | {new Date(payment.created_at).toLocaleDateString()}
                </p>
              </div>
              <p className="text-sm font-semibold text-slate-700">KSh {payment.amount.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
