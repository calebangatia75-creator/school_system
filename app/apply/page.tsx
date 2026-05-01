import Link from "next/link";
import { AdmissionApplicationForm } from "@/components/admissions/AdmissionApplicationForm";

export default function ApplyPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple">Admissions</p>
            <h1 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">Student Application</h1>
          </div>
          <Link
            href="/"
            className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-navy transition hover:bg-slate-100"
          >
            Back to Home
          </Link>
        </div>

        <AdmissionApplicationForm
          title="Apply for admission"
          intro="Complete the student details below and submit the application for review."
        />
      </div>
    </main>
  );
}
