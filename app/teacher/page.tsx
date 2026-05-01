import { Bell, CalendarCheck2, Users } from "lucide-react";
import { formatDate } from "@/lib/parent-dashboard";
import { getTeacherDashboardData } from "@/lib/teacher-dashboard";

export default async function TeacherPage() {
  const data = await getTeacherDashboardData();

  if (!data) {
    return null;
  }

  const latestAnnouncement = data.announcements[0];
  const memberSince = formatDate(data.account?.created_at ?? null);
  const latestHomework = data.homework[0];

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,rgba(4,18,38,0.98),rgba(9,31,60,0.94),rgba(15,44,84,0.9))] px-6 py-8 text-white shadow-2xl sm:px-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">
            Teacher Dashboard
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Welcome, {data.account?.full_name ?? data.session.fullName}
          </h1>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur">
            <p className="text-sm text-slate-300">My classes</p>
            <p className="mt-2 text-xl font-semibold text-white">{data.classes.length} active classes</p>
            <p className="mt-2 text-sm text-slate-300">{data.classes[0]?.class_name}</p>
          </div>
          <div className="rounded-[1.5rem] border border-amber-300/15 bg-amber-300/10 p-5 backdrop-blur">
            <p className="text-sm text-amber-50">Attendance</p>
            <p className="mt-2 text-xl font-semibold text-white">{data.students.length} learners in focus</p>
            <p className="mt-2 text-sm text-amber-50/90">Today's roll call matters most.</p>
          </div>
          <div className="rounded-[1.5rem] border border-emerald-300/15 bg-emerald-400/10 p-5 backdrop-blur">
            <p className="text-sm text-emerald-100">Latest homework</p>
            <p className="mt-2 text-base font-semibold text-white">
              {latestHomework?.title ?? "Ready to post"}
            </p>
            <p className="mt-2 text-sm text-emerald-100/90">
              {latestHomework ? `Due ${formatDate(latestHomework.due_date)}` : "No homework posted yet"}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-[1.75rem] bg-white p-7 shadow-xl ring-1 ring-slate-100">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-blue-50 p-3 text-navy">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Students</p>
              <p className="text-lg font-semibold text-navy">{data.students.length} in focus</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-600">Member since {memberSince}</p>
        </div>

        <div className="rounded-[1.75rem] bg-white p-7 shadow-xl ring-1 ring-slate-100">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-amber-50 p-3 text-amber-600">
              <CalendarCheck2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Attendance</p>
              <p className="text-lg font-semibold text-navy">Ready for today</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-600">Open attendance to mark present and absent learners.</p>
        </div>

        <div className="rounded-[1.75rem] bg-white p-7 shadow-xl ring-1 ring-slate-100">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Announcements</p>
              <p className="text-lg font-semibold text-navy">{data.announcements.length} teacher notices</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-600">Share class-specific updates without admin tools.</p>
        </div>
      </section>

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

      <section className="rounded-[1.75rem] bg-white p-8 shadow-xl ring-1 ring-slate-100">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-navy">Students</h2>
            <p className="mt-2 text-slate-600">View learners in the classes you teach.</p>
          </div>
          <Users className="h-5 w-5 text-slate-400" />
        </div>

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
              <span className="inline-flex items-center rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
                {student.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[1.75rem] bg-white p-8 shadow-xl ring-1 ring-slate-100">
        <h2 className="text-2xl font-bold text-navy">Homework</h2>
        <div className="mt-6 space-y-3">
          {data.homework.map((item) => (
            <article key={item.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-navy">{item.title}</h3>
                <span className="text-sm text-slate-500">{item.class_name}</span>
              </div>
              <p className="mt-2 text-slate-600">{item.description}</p>
              <p className="mt-3 text-sm text-slate-500">Due {formatDate(item.due_date)}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
