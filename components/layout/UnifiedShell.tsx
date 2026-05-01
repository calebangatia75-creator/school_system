"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import type { AppRole } from "@/lib/auth-shared";
import { getNavigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type UnifiedShellProps = {
  role: AppRole;
  title: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
};

export default function UnifiedShell({
  role,
  title,
  subtitle,
  children,
  actions
}: UnifiedShellProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = useMemo(() => getNavigation(role), [role]);

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-navy/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8 lg:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple text-sm font-bold text-white shadow-lg shadow-purple/25">
              S
            </div>
            <div>
              <p className="font-semibold text-white">Shekinah School</p>
              <p className="text-xs text-white/60">Unified School Portal</p>
            </div>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {actions}
            <div className="rounded-full bg-purple/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-purple-light">
              {role}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white md:hidden"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 lg:px-12">
        {menuOpen ? (
          <div className="mb-6 rounded-2xl border border-white/60 bg-white/80 p-3 shadow-sm backdrop-blur md:hidden">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                      isActive
                        ? "bg-purple/20 text-purple"
                        : "text-slate-600 hover:bg-purple/10 hover:text-purple"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            {actions ? <div className="mt-3 border-t border-slate-200 pt-3">{actions}</div> : null}
          </div>
        ) : null}

        <div className="flex gap-8">
          <aside className="hidden w-64 shrink-0 md:block">
            <div className="rounded-2xl border border-white/70 bg-white/75 p-4 shadow-sm backdrop-blur-sm">
              <div className="border-b border-slate-100 pb-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple">Navigation</p>
                <p className="mt-2 text-sm text-slate-500">Move through the portal with one consistent UI.</p>
              </div>
              <nav className="mt-4 space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                        isActive
                          ? "border-r-2 border-purple bg-purple/20 text-purple"
                          : "text-slate-600 hover:bg-purple/10 hover:text-purple"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          <main className="min-w-0 flex-1">
            <div className="mb-8 rounded-[1.75rem] border border-white/60 bg-[linear-gradient(135deg,rgba(30,58,95,0.98),rgba(42,74,115,0.94),rgba(139,92,246,0.78))] px-6 py-7 text-white shadow-xl">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                  {subtitle ? <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/80">{subtitle}</p> : null}
                </div>
                {actions ? <div className="hidden gap-3 md:flex">{actions}</div> : null}
              </div>
            </div>

            <div className="space-y-6">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
