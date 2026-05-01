import Link from "next/link";
import { getBursarDashboardData } from "@/lib/bursar-dashboard";
import { formatDate } from "@/lib/formatters";

export default async function BursarAnnouncementsPage() {
  const data = await getBursarDashboardData();
  if (!data) return null;

  return (
    <section className="rounded-[1.75rem] bg-white p-8 shadow-xl ring-1 ring-slate-100">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy">Announcements</h2>
          <p className="mt-2 text-slate-600">Finance-related reminders and recent notices.</p>
        </div>
        <Link href="/admin/announcements" className="text-sm font-semibold text-purple">
          Manage in admin tools
        </Link>
      </div>
      <div className="mt-6 space-y-4">
        {data.announcements.map((announcement) => (
          <article key={announcement.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-navy">{announcement.title}</h3>
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                {announcement.priority}
              </span>
            </div>
            <p className="mt-3 text-slate-600">{announcement.content}</p>
            <p className="mt-4 text-sm text-slate-500">{formatDate(announcement.created_at)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
