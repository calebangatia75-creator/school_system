import { Bell, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  formatDate,
  getParentDashboardData,
  getPriorityVariant
} from "@/lib/parent-dashboard";

export default async function ParentAnnouncementsPage() {
  const data = await getParentDashboardData();

  if (!data) {
    return null;
  }

  return (
    <section className="rounded-[1.75rem] bg-white p-8 shadow-xl ring-1 ring-slate-100">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy">Recent Announcements</h2>
          <p className="mt-2 text-slate-600">School notices for parents.</p>
        </div>
        <Bell className="h-5 w-5 text-slate-400" />
      </div>

      {data.announcements.length === 0 ? (
        <p className="mt-6 text-slate-600">No announcements yet.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {data.announcements.map((announcement) => (
            <article
              key={announcement.id}
              className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-navy">
                  {announcement.title === "Boarding Store Day" ? "Visiting Day" : announcement.title}
                </h3>
                <Badge variant={getPriorityVariant(announcement.priority)}>
                  {announcement.priority}
                </Badge>
              </div>
              <p className="mt-3 leading-relaxed text-slate-600">{announcement.content}</p>
              <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                <CalendarDays className="h-4 w-4" />
                {formatDate(announcement.created_at)}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
