import { CalendarDays } from "lucide-react";
import { formatDate } from "@/lib/parent-dashboard";

const upcomingEvents = [
  { id: "event-1", title: "Mid-term exams", date: "2026-04-24" },
  { id: "event-2", title: "Parents meeting", date: "2026-05-02" },
  { id: "event-3", title: "Sports day", date: "2026-05-15" }
];

export default function ParentEventsPage() {
  return (
    <section className="rounded-[1.75rem] bg-white p-8 shadow-xl ring-1 ring-slate-100">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-navy">Events / Calendar</h2>
        <CalendarDays className="h-5 w-5 text-slate-400" />
      </div>
      <p className="mt-3 text-slate-600">Upcoming events for parents and students.</p>
      <div className="mt-5 space-y-3">
        {upcomingEvents.map((event) => (
          <div
            key={event.id}
            className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 px-4 py-3"
          >
            <p className="font-semibold text-navy">{event.title}</p>
            <p className="text-sm text-slate-500">{formatDate(event.date)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
