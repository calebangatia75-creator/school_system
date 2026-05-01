import { Bell, CreditCard, MessageSquare, Phone, UserRound, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  formatCurrency,
  formatDate,
  getParentDashboardData
} from "@/lib/parent-dashboard";

export default async function ParentPage() {
  const data = await getParentDashboardData();

  if (!data) {
    return null;
  }

  const { account, announcements, schoolEmail, schoolPhone, students, feeBalance } = data;
  const latestAnnouncement = announcements[0];
  const latestAnnouncementDate = latestAnnouncement?.created_at ?? "2026-04-12";
  const memberSince = formatDate(account?.created_at ?? null);
  const primaryStudent = students[0];
  const recentHomework = data.homework[0];
  const recentPayment = data.recentPayment;

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,rgba(4,18,38,0.98),rgba(9,31,60,0.94),rgba(15,44,84,0.9))] px-6 py-8 text-white shadow-2xl sm:px-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">
            Parent Dashboard
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Welcome, {account?.full_name ?? data.session.fullName}
          </h1>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur">
            <p className="text-sm text-slate-300">Student info</p>
            <p className="mt-2 text-xl font-semibold text-white">{students.length} enrolled</p>
            <p className="mt-2 text-sm text-slate-300">
              {students[0]?.full_name} in {students[0]?.grade}
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-emerald-300/15 bg-emerald-400/10 p-5 backdrop-blur">
            <p className="text-sm text-emerald-100">Fee balance</p>
            <p className="mt-2 text-xl font-semibold text-white">{formatCurrency(feeBalance)}</p>
            <p className="mt-2 text-sm text-emerald-100/90">One tap away from payment help.</p>
          </div>
          <div className="rounded-[1.5rem] border border-amber-200/15 bg-amber-300/10 p-5 backdrop-blur">
            <p className="text-sm text-amber-50">Latest announcement</p>
            <p className="mt-2 text-base font-semibold text-white">
              {latestAnnouncement?.title ?? "School update"}
            </p>
            <p className="mt-2 text-sm text-amber-50/90">{formatDate(latestAnnouncementDate)}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[1.5rem] bg-white p-6 shadow-xl ring-1 ring-slate-100">
          <p className="text-sm text-slate-500">Child Name</p>
          <p className="mt-2 text-xl font-semibold text-navy">{primaryStudent?.full_name ?? "No learner linked"}</p>
          <p className="mt-2 text-sm text-slate-600">{primaryStudent?.grade ?? "Awaiting school update"}</p>
        </div>

        <div className="rounded-[1.5rem] bg-white p-6 shadow-xl ring-1 ring-slate-100">
          <p className="text-sm text-slate-500">Balance</p>
          <p className="mt-2 text-xl font-semibold text-navy">{formatCurrency(feeBalance)}</p>
          <p className="mt-2 text-sm text-slate-600">Current total across linked children</p>
        </div>

        <div className="rounded-[1.5rem] bg-white p-6 shadow-xl ring-1 ring-slate-100">
          <p className="text-sm text-slate-500">Recent Payment</p>
          <p className="mt-2 text-xl font-semibold text-navy">
            {recentPayment ? formatCurrency(recentPayment.amount) : "No payment yet"}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            {recentPayment ? formatDate(recentPayment.created_at) : "Payments will appear here"}
          </p>
        </div>

        <div className="rounded-[1.5rem] bg-white p-6 shadow-xl ring-1 ring-slate-100">
          <p className="text-sm text-slate-500">Latest Announcement</p>
          <p className="mt-2 text-lg font-semibold text-navy">{latestAnnouncement?.title ?? "No announcement yet"}</p>
          <p className="mt-2 text-sm text-slate-600">{formatDate(latestAnnouncementDate)}</p>
        </div>

        <div className="rounded-[1.5rem] bg-white p-6 shadow-xl ring-1 ring-slate-100">
          <p className="text-sm text-slate-500">Attendance %</p>
          <p className="mt-2 text-xl font-semibold text-navy">{data.attendancePercent}%</p>
          <p className="mt-2 text-sm text-slate-600">Based on recorded attendance entries</p>
        </div>

        <div className="rounded-[1.5rem] bg-white p-6 shadow-xl ring-1 ring-slate-100">
          <p className="text-sm text-slate-500">Homework</p>
          <p className="mt-2 text-lg font-semibold text-navy">{recentHomework?.title ?? "No homework posted"}</p>
          <p className="mt-2 text-sm text-slate-600">
            {recentHomework ? `Due ${formatDate(recentHomework.due_date)}` : "Teachers will post updates here"}
          </p>
        </div>

        <div className="rounded-[1.5rem] bg-white p-6 shadow-xl ring-1 ring-slate-100 md:col-span-2 xl:col-span-2">
          <p className="text-sm text-slate-500">Contact School</p>
          <p className="mt-2 text-xl font-semibold text-navy">{schoolPhone}</p>
          <p className="mt-2 text-sm text-slate-600">{schoolEmail}</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <a
              href={`https://wa.me/254710414220?text=${encodeURIComponent("Hello, I would like to contact the school.")}`}
              className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              WhatsApp School
            </a>
            <a
              href="mailto:support@shekinah.ac.ke?subject=Message%20from%20parent%20dashboard"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-navy transition hover:bg-slate-50"
            >
              Send Message
            </a>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-[1.75rem] bg-white p-7 shadow-xl ring-1 ring-slate-100">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-blue-50 p-3 text-navy">
              <UserRound className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Account</p>
              <p className="text-lg font-semibold text-navy">{account?.phone ?? data.session.phone}</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-600">Member since {memberSince}</p>
        </div>

        <div className="rounded-[1.75rem] bg-white p-7 shadow-xl ring-1 ring-slate-100">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-amber-50 p-3 text-amber-600">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Announcements</p>
              <p className="text-lg font-semibold text-navy">{announcements.length} available</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-600">Recent school updates appear below.</p>
        </div>

        <div className="rounded-[1.75rem] bg-white p-7 shadow-xl ring-1 ring-slate-100">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Contact</p>
              <p className="text-lg font-semibold text-navy">{schoolPhone}</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-600">{schoolEmail}</p>
        </div>
      </section>

      <section className="rounded-[1.75rem] bg-white p-8 shadow-xl ring-1 ring-slate-100">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-navy">Student Information</h2>
            <p className="mt-2 text-slate-600">View class details, admission numbers, and enrolled learners.</p>
          </div>
          <Users className="h-5 w-5 text-slate-400" />
        </div>

        <div className="mt-6 grid gap-4">
          {students.map((student) => (
            <article
              key={student.id}
              className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-navy">{student.full_name}</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {student.grade} | {student.stream} Stream
                  </p>
                </div>
                <Badge variant="success">{student.status}</Badge>
              </div>
              <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                <p>Admission No: {student.admission_no}</p>
                <p>Guardian Phone: {account?.phone ?? data.session.phone}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[1.75rem] bg-white p-8 shadow-xl ring-1 ring-slate-100">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-navy">Fees Snapshot</h2>
            <p className="mt-2 text-slate-600">Check the current balance at a glance before making a payment.</p>
          </div>
          <CreditCard className="h-5 w-5 text-emerald-600" />
        </div>
        <div className="mt-6 rounded-[1.5rem] border border-emerald-100 bg-emerald-50 p-5">
          <p className="text-sm font-medium text-emerald-700">Outstanding balance</p>
          <p className="mt-2 text-3xl font-bold text-emerald-900">{formatCurrency(feeBalance)}</p>
          <p className="mt-2 text-sm text-emerald-700">Open Fees / Payments from the menu for full history.</p>
        </div>
      </section>

      <section className="rounded-[1.75rem] bg-white p-8 shadow-xl ring-1 ring-slate-100">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-bold text-navy">Messages / Contact School</h2>
          <MessageSquare className="h-5 w-5 text-slate-400" />
        </div>
        <p className="mt-3 text-slate-600">Reach the school quickly using WhatsApp or email.</p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <a
            href={`https://wa.me/254710414220?text=${encodeURIComponent("Hello, I would like to contact the school.")}`}
            className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            WhatsApp School
          </a>
          <a
            href="mailto:support@shekinah.ac.ke?subject=Message%20from%20parent%20dashboard"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-navy transition hover:bg-slate-50"
          >
            Send Message
          </a>
        </div>
      </section>
    </div>
  );
}
