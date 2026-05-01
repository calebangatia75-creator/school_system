"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { ArrowRight, DollarSign, MessageCircle, Users } from "lucide-react";

type DashboardData = {
  newLeads: number;
  messagesSent: number;
  feeCollection: number;
  totalStudents: number;
  recentPayments: Array<{ id: string; student_id: string; amount: number; method: string; reference: string; created_at: string }>;
  feeStructures: Array<{ id: string; grade: string; amount: number }>;
  staff: Array<{ id: string; username: string; role: string; full_name: string; phone?: string | null }>;
  students: Array<{ id: string; full_name: string; grade: string; balance: number }>;
};

export default function AdminDashboardPage() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [creatingUser, setCreatingUser] = useState(false);
  const [savingFee, setSavingFee] = useState(false);
  const [savingPayment, setSavingPayment] = useState(false);
  const [userForm, setUserForm] = useState({ password: "", role: "bursar", fullName: "", phone: "" });
  const [feeForm, setFeeForm] = useState({ grade: "", amount: "" });
  const [paymentForm, setPaymentForm] = useState({ studentId: "", amount: "", method: "mpesa", reference: "" });

  const fetchData = async () => {
    setLoading(true);
    const response = await fetch("/api/admin/dashboard");
    const payload = (await response.json()) as DashboardData & { error?: string };
    if (!response.ok) {
      addToast({ title: "Could not load dashboard", description: payload.error, variant: "error" });
      setLoading(false);
      return;
    }
    setData(payload);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateUser = async (event: React.FormEvent) => {
    event.preventDefault();
    setCreatingUser(true);
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userForm)
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        addToast({ title: "Account not created", description: payload.error, variant: "error" });
        return;
      }
      addToast({ title: "Account created", variant: "success" });
      setUserForm({ password: "", role: "bursar", fullName: "", phone: "" });
      fetchData();
    } finally {
      setCreatingUser(false);
    }
  };

  const handleSaveFee = async (event: React.FormEvent) => {
    event.preventDefault();
    setSavingFee(true);
    try {
      const response = await fetch("/api/admin/fee-structures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grade: feeForm.grade, amount: Number(feeForm.amount) })
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        addToast({ title: "Fee structure not saved", description: payload.error, variant: "error" });
        return;
      }
      addToast({ title: "Fee structure updated", variant: "success" });
      setFeeForm({ grade: "", amount: "" });
      fetchData();
    } finally {
      setSavingFee(false);
    }
  };

  const handleRecordPayment = async (event: React.FormEvent) => {
    event.preventDefault();
    setSavingPayment(true);
    try {
      const response = await fetch("/api/admin/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: paymentForm.studentId,
          amount: Number(paymentForm.amount),
          method: paymentForm.method,
          reference: paymentForm.reference
        })
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        addToast({ title: "Payment not recorded", description: payload.error, variant: "error" });
        return;
      }
      addToast({ title: "Payment recorded", variant: "success" });
      setPaymentForm({ studentId: "", amount: "", method: "mpesa", reference: "" });
      fetchData();
    } finally {
      setSavingPayment(false);
    }
  };

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "New Leads", value: data?.newLeads ?? 0, icon: Users, color: "text-green-600" },
          { label: "Messages Sent", value: data?.messagesSent ?? 0, icon: MessageCircle, color: "text-blue-600" },
          { label: "Fee Collection", value: `KSh ${(data?.feeCollection ?? 0).toLocaleString()}`, icon: DollarSign, color: "text-emerald-600" },
          { label: "Total Students", value: data?.totalStudents ?? 0, icon: Users, color: "text-purple-600" }
        ].map((item) => (
          <Card key={item.label} className="glass-hover p-6">
            <CardHeader className="pb-3">
              <div className={`flex items-center gap-2 ${item.color}`}>
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-12 w-24" /> : <p className="text-3xl font-bold text-navy">{item.value}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="glass-hover">
          <CardHeader>
            <h2 className="text-2xl font-bold text-navy">Create Portal Account</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateUser} className="space-y-3">
              <input className="w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="Full name" value={userForm.fullName} onChange={(e) => setUserForm({ ...userForm, fullName: e.target.value })} />
              <input className="w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="Phone number" value={userForm.phone} onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })} />
              <input className="w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="6-character password" type="password" maxLength={6} value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} />
              <select className="w-full rounded-xl border border-slate-200 px-4 py-3" value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}>
                <option value="bursar">Bursar</option>
                <option value="teacher">Teacher</option>
              </select>
              <Button type="submit" disabled={creatingUser} className="w-full">
                {creatingUser ? "Creating..." : "Create Account"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="glass-hover">
          <CardHeader>
            <h2 className="text-2xl font-bold text-navy">Set Fee Structure</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveFee} className="space-y-3">
              <input className="w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="Grade" value={feeForm.grade} onChange={(e) => setFeeForm({ ...feeForm, grade: e.target.value })} />
              <input className="w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="Amount" type="number" value={feeForm.amount} onChange={(e) => setFeeForm({ ...feeForm, amount: e.target.value })} />
              <Button type="submit" disabled={savingFee} className="w-full">
                {savingFee ? "Saving..." : "Save Fee Structure"}
              </Button>
            </form>
            <div className="mt-5 space-y-2 text-sm text-slate-600">
              {data?.feeStructures.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2">
                  <span>{item.grade}</span>
                  <span>KSh {item.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-hover">
          <CardHeader>
            <h2 className="text-2xl font-bold text-navy">Record Payment</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRecordPayment} className="space-y-3">
              <select className="w-full rounded-xl border border-slate-200 px-4 py-3" value={paymentForm.studentId} onChange={(e) => setPaymentForm({ ...paymentForm, studentId: e.target.value })}>
                <option value="">Select student</option>
                {data?.students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.full_name} - {student.grade} - Bal KSh {student.balance.toLocaleString()}
                  </option>
                ))}
              </select>
              <input className="w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="Amount" type="number" value={paymentForm.amount} onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })} />
              <select className="w-full rounded-xl border border-slate-200 px-4 py-3" value={paymentForm.method} onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}>
                <option value="mpesa">M-Pesa</option>
                <option value="bank">Bank</option>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
              </select>
              <input className="w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="Reference" value={paymentForm.reference} onChange={(e) => setPaymentForm({ ...paymentForm, reference: e.target.value })} />
              <Button type="submit" disabled={savingPayment} className="w-full">
                {savingPayment ? "Recording..." : "Record Payment"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card className="glass-hover">
          <CardHeader>
            <h2 className="text-2xl font-bold text-navy">Recent Payments</h2>
          </CardHeader>
          <CardContent className="space-y-3">
            {data?.recentPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3">
                <div>
                  <p className="font-semibold text-navy">{payment.reference}</p>
                  <p className="text-sm text-slate-500">{payment.method.toUpperCase()} | {new Date(payment.created_at).toLocaleDateString()}</p>
                </div>
                <p className="text-sm font-semibold text-slate-700">KSh {payment.amount.toLocaleString()}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-hover">
          <CardHeader>
            <h2 className="text-2xl font-bold text-navy">Quick Actions</h2>
          </CardHeader>
          <CardContent className="grid gap-4 pt-0">
            <Link href="/admin/leads" className="glass h-20 px-6 py-4 flex items-center justify-center rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300">
              Manage Leads <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link href="/admin/announce" className="glass h-20 px-6 py-4 flex items-center justify-center rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300">
              Send Announcement <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link href="/admin/announcements" className="glass h-20 px-6 py-4 flex items-center justify-center rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300">
              Manage Announcements <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
