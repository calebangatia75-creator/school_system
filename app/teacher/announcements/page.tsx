"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { formatDate } from "@/lib/formatters";

type TeacherAnnouncementsData = {
  classes: Array<{ id: string; class_name: string }>;
  announcements: Array<{ id: string; title: string; content: string; created_at: string | null }>;
};

export default function TeacherAnnouncementsPage() {
  const { addToast } = useToast();
  const [data, setData] = useState<TeacherAnnouncementsData | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [className, setClassName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/teacher/dashboard")
      .then((response) => response.json())
      .then((payload) => {
        setData(payload);
        setClassName(payload.classes?.[0]?.class_name ?? "");
      })
      .catch(() => {
        addToast({ title: "Could not load teacher data", variant: "error" });
      });
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("/api/teacher/homework", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ className, title, description, dueDate })
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        addToast({ title: "Homework not posted", description: payload.error, variant: "error" });
        return;
      }

      addToast({ title: "Homework posted", variant: "success" });
      setTitle("");
      setDescription("");
      setDueDate("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] bg-white p-8 shadow-xl ring-1 ring-slate-100">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-navy">Homework</h2>
            <p className="mt-2 text-slate-600">Post homework while keeping the same teacher-friendly flow.</p>
          </div>
          <Bell className="h-5 w-5 text-slate-400" />
        </div>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-3">
          <select
            value={className}
            onChange={(event) => setClassName(event.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-3"
          >
            {(data?.classes ?? []).map((item) => (
              <option key={item.id} value={item.class_name}>
                {item.class_name}
              </option>
            ))}
          </select>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Homework title"
            className="rounded-xl border border-slate-200 px-4 py-3"
          />
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Homework instructions"
            rows={4}
            className="rounded-xl border border-slate-200 px-4 py-3"
          />
          <input
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-3"
          />
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-navy px-4 py-3 font-semibold text-white disabled:opacity-60"
          >
            {submitting ? "Posting..." : "Post Homework"}
          </button>
        </form>
      </section>

      <section className="rounded-[1.75rem] bg-white p-8 shadow-xl ring-1 ring-slate-100">
        <h2 className="text-2xl font-bold text-navy">Recent Teacher Notices</h2>
        <div className="mt-6 space-y-4">
          {(data?.announcements ?? []).map((announcement) => (
            <article key={announcement.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
              <h3 className="text-lg font-semibold text-navy">{announcement.title}</h3>
              <p className="mt-3 text-slate-600">{announcement.content}</p>
              <p className="mt-4 text-sm text-slate-500">{formatDate(announcement.created_at)}</p>
            </article>
          ))}
          {(data?.announcements?.length ?? 0) === 0 ? (
            <p className="text-slate-600">No teacher notices yet.</p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
