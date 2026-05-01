import { MessageSquare } from "lucide-react";

export default function ParentMessagesPage() {
  return (
    <section className="rounded-[1.75rem] bg-white p-8 shadow-xl ring-1 ring-slate-100">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-navy">Messages / Contact School</h2>
        <MessageSquare className="h-5 w-5 text-slate-400" />
      </div>
      <p className="mt-3 text-slate-600">
        Keep communication light with WhatsApp, email, or a quick call.
      </p>
      <div className="mt-5 flex flex-col gap-3">
        <a
          href={`https://wa.me/254700000000?text=${encodeURIComponent("Hello, I would like to contact the school.")}`}
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
  );
}
