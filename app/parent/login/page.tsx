"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { ParentAuthShell } from "@/components/auth/ParentAuthShell";

export default function ParentLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const nextDestination = searchParams.get("next");

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/parent-auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password })
      });

      const payload = (await response.json()) as { destination?: string; error?: string };
      if (!response.ok) {
        addToast({
          title: "Login failed",
          description: payload.error ?? "Unable to sign you in.",
          variant: "error"
        });
        return;
      }

      router.replace(nextDestination?.startsWith("/") ? nextDestination : payload.destination ?? "/parent");
      router.refresh();
    } catch {
      addToast({
        title: "Login failed",
        description: "Unable to sign you in right now.",
        variant: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ParentAuthShell
      title="Parent Login"
      subtitle="Sign in with your phone number and password."
      footerLinkHref="/login"
      footerLinkLabel="Admin login"
    >
      <form onSubmit={handleLogin} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300" htmlFor="phone">
            Phone Number
          </label>
          <Input
            id="phone"
            type="tel"
            placeholder="0710414220 or +254710414220"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            required
            className="h-12 rounded-xl border border-slate-500/15 bg-[rgba(15,30,58,0.92)] px-4 text-base text-slate-100 placeholder:text-slate-500 focus:border-slate-400/30 focus:ring-slate-400/20"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300" htmlFor="password">
            Password
          </label>
          <Input
            id="password"
            type="password"
            pattern=".{6}"
            maxLength={6}
            placeholder="Enter 6-character password"
            value={password}
            onChange={(event) => setPassword(event.target.value.slice(0, 6))}
            required
            className="h-12 rounded-xl border border-slate-500/15 bg-[rgba(15,30,58,0.92)] px-4 text-base text-slate-100 placeholder:text-slate-500 focus:border-slate-400/30 focus:ring-slate-400/20"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-xl bg-gradient-to-r from-green-600 to-green-700 text-base font-semibold text-white shadow-lg shadow-green-950/30 transition-all hover:scale-[1.02] hover:from-green-700 hover:to-green-800 active:scale-[0.98] sm:text-lg"
        >
          {loading ? "Signing in..." : "Enter Parent Portal"}
        </Button>

        <p className="text-center text-sm text-slate-400">
          Admin?{" "}
          <Link href="/login" className="font-semibold text-emerald-300 transition hover:text-emerald-200">
            Use admin portal
          </Link>
        </p>
      </form>
    </ParentAuthShell>
  );
}
