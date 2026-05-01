"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  CreditCard,
  FileText,
  LayoutDashboard,
  Menu,
  Settings,
  X
} from "lucide-react";
import { ParentLogoutButton } from "@/components/auth/ParentLogoutButton";

const menuItems = [
  { href: "/parent", label: "Dashboard", icon: LayoutDashboard },
  { href: "/parent/fees", label: "Fees / Payments", icon: CreditCard },
  { href: "/parent/announcements", label: "Announcements", icon: FileText },
  { href: "/parent/applications", label: "Applications / Admissions", icon: FileText },
  { href: "/parent/settings", label: "Settings", icon: Settings },
  { href: "/parent/events", label: "Events / Calendar", icon: CalendarDays }
];

export function ParentDashboardMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="parent-dashboard-menu"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-navy/20 bg-navy text-white shadow-sm transition hover:bg-slate-800"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close parent menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm"
          />
          <aside
            id="parent-dashboard-menu"
            className="absolute right-4 top-4 w-[min(22rem,calc(100vw-2rem))] rounded-[2rem] border border-white/15 bg-[linear-gradient(180deg,rgba(3,17,36,0.98),rgba(10,31,60,0.96))] p-5 text-white shadow-2xl"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
                  Parent Menu
                </p>
                <p className="mt-2 text-lg font-semibold">Quick Navigation</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white transition hover:bg-white/15"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="mt-5 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                      active
                        ? "border-emerald-300/30 bg-emerald-400/15 text-white"
                        : "border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
                    }`}
                  >
                    <Icon className="h-4 w-4 text-slate-300" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
              <div className="flex items-start gap-3">
                <CreditCard className="mt-0.5 h-5 w-5 text-emerald-300" />
                <div>
                  <p className="text-sm font-semibold text-white">Fees first</p>
                  <p className="mt-1 text-xs text-slate-300">
                    Keep balance, payment history, and payment help one tap away.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <ParentLogoutButton />
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
