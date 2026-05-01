"use client";

import { useEffect, useState } from "react";
import { CalendarCheck2 } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { formatDate } from "@/lib/formatters";

type TeacherAttendanceData = {
  students: Array<{ id: string; full_name: string; class_name: string }>;
  attendance: Array<{ id: string; class_name: string; date: string }>;
};

export default function TeacherAttendancePage() {
  const { addToast } = useToast();
  const [data, setData] = useState<TeacherAttendanceData | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    fetch("/api/teacher/dashboard")
      .then((response) => response.json())
      .then((payload) => setData(payload))
      .catch(() => {
        addToast({ title: "Could not load attendance", variant: "error" });
      });
  }, []);

  const handleMark = async (studentId: string, status: "Present" | "Absent") => {
    setSavingId(studentId);
    try {
      const response = await fetch("/api/teacher/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, date: today, status })
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        addToast({ title: "Attendance not saved", description: payload.error, variant: "error" });
        return;
      }

      addToast({ title: "Attendance saved", variant: "success" });
    } finally {
      setSavingId(null);
    }
  };

  const grouped = (data?.attendance ?? []).reduce<Record<string, number>>((acc, entry) => {
    acc[`${entry.class_name}-${entry.date}`] = (acc[`${entry.class_name}-${entry.date}`] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] bg-white p-8 shadow-xl ring-1 ring-slate-100">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-navy">Attendance</h2>
            <p className="mt-2 text-slate-600">Mark learners present or absent for the day.</p>
          </div>
          <CalendarCheck2 className="h-5 w-5 text-slate-400" />
        </div>

        <div className="mt-6 grid gap-3">
          {(data?.students ?? []).map((student) => (
            <div
              key={student.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 px-4 py-3"
            >
              <div>
                <p className="font-semibold text-navy">{student.full_name}</p>
                <p className="text-sm text-slate-500">{student.class_name}</p>
              </div>
              <div className="flex gap-2">
                <button
                  disabled={savingId === student.id}
                  onClick={() => handleMark(student.id, "Present")}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  Present
                </button>
                <button
                  disabled={savingId === student.id}
                  onClick={() => handleMark(student.id, "Absent")}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-navy disabled:opacity-60"
                >
                  Absent
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[1.75rem] bg-white p-8 shadow-xl ring-1 ring-slate-100">
        <h2 className="text-2xl font-bold text-navy">Recent Registers</h2>
        <div className="mt-6 space-y-3">
          {Object.entries(grouped).map(([key, marked]) => {
            const [className, date] = key.split("-");
            return (
              <div
                key={key}
                className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 px-4 py-3"
              >
                <div>
                  <p className="font-semibold text-navy">{className}</p>
                  <p className="text-sm text-slate-500">{formatDate(date)}</p>
                </div>
                <p className="text-sm font-semibold text-slate-700">{marked} marked</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
