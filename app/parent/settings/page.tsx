import { Settings } from "lucide-react";
import { ParentLogoutButton } from "@/components/auth/ParentLogoutButton";

export default function ParentSettingsPage() {
  return (
    <section className="rounded-[1.75rem] bg-white p-8 shadow-xl ring-1 ring-slate-100">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-navy">Settings</h2>
        <Settings className="h-5 w-5 text-slate-400" />
      </div>
      <p className="mt-3 text-slate-600">Update contact details, request password help, or sign out.</p>
      <div className="mt-5 flex flex-col gap-3">
        <a
          href="mailto:support@shekinah.ac.ke?subject=Update%20my%20parent%20profile"
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-navy transition hover:bg-slate-50"
        >
          Update Phone / Email
        </a>
        <a
          href="mailto:support@shekinah.ac.ke?subject=Reset%20parent%20portal%20password"
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-navy transition hover:bg-slate-50"
        >
          Reset Password
        </a>
        <div className="pt-1">
          <ParentLogoutButton />
        </div>
      </div>
    </section>
  );
}
