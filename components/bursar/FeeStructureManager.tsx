"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

type FeeStructure = {
  id: string;
  grade: string;
  amount: number;
  updated_at?: string;
};

type FeeStructureManagerProps = {
  initialFeeStructures: FeeStructure[];
};

export function FeeStructureManager({ initialFeeStructures }: FeeStructureManagerProps) {
  const { addToast } = useToast();
  const [feeStructures, setFeeStructures] = useState(initialFeeStructures);
  const [grade, setGrade] = useState("");
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);

    try {
      const response = await fetch("/api/admin/fee-structures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grade, amount: Number(amount) })
      });

      const payload = (await response.json()) as FeeStructure[] & { error?: string };
      if (!response.ok) {
        addToast({
          title: "Fee update failed",
          description: payload.error ?? "Unable to save fee structure.",
          variant: "error"
        });
        return;
      }

      setFeeStructures(payload as FeeStructure[]);
      setGrade("");
      setAmount("");
      addToast({ title: "Fee updated", variant: "success" });
    } catch {
      addToast({
        title: "Fee update failed",
        description: "Unable to save fee structure right now.",
        variant: "error"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-[1.75rem] bg-white p-8 shadow-xl ring-1 ring-slate-100">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy">Fee Updates</h2>
          <p className="mt-2 text-slate-600">View every grade fee and update amounts from one place.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-[1fr_1fr_auto]">
        <input
          className="rounded-xl border border-slate-200 px-4 py-3"
          placeholder="Grade"
          value={grade}
          onChange={(event) => setGrade(event.target.value)}
          required
        />
        <input
          className="rounded-xl border border-slate-200 px-4 py-3"
          placeholder="Amount"
          type="number"
          min="1"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          required
        />
        <Button type="submit" disabled={saving} className="h-12 rounded-xl px-6">
          {saving ? "Saving..." : "Save"}
        </Button>
      </form>

      <div className="mt-6 space-y-3">
        {feeStructures.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3">
            <div>
              <p className="font-semibold text-navy">{item.grade}</p>
              <p className="text-sm text-slate-500">Current fee structure</p>
            </div>
            <p className="text-sm font-semibold text-slate-700">
              KES {item.amount.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
