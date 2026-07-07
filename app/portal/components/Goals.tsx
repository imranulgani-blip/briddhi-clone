"use client";

import { useState } from "react";
import { bdt, fmtDate } from "../lib/format";
import { useFetch } from "../lib/useFetch";

interface Goal {
  id: number;
  name: string;
  target_amount: number;
  target_date: string | null;
}

// FR-DASH-06 — goal progress cards. Progress = invested / target (real, from portfolio).
export default function Goals({ investorId, invested }: { investorId: string; invested: number }) {
  const { data, loading, reload } = useFetch<{ goals: Goal[] }>(`/api/goals?investorId=${investorId}`);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [busy, setBusy] = useState(false);

  const goals = data?.goals ?? [];

  const add = async () => {
    if (!name || !amount) return;
    setBusy(true);
    await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ investorId, name, targetAmount: Number(amount), targetDate: date || null }),
    });
    setBusy(false);
    setName("");
    setAmount("");
    setDate("");
    setAdding(false);
    reload();
  };

  const remove = async (id: number) => {
    await fetch(`/api/goals?id=${id}`, { method: "DELETE" });
    reload();
  };

  return (
    <div>
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Goals</h2>
          <p className="mt-0.5 text-sm text-ink-400">Progress tracked against your total invested amount.</p>
        </div>
        <button
          onClick={() => setAdding((a) => !a)}
          className="rounded-lg border border-ink-600 bg-ink-800/60 px-3 py-1.5 text-sm text-ink-200 hover:bg-ink-700/70"
        >
          {adding ? "Cancel" : "+ Add goal"}
        </button>
      </div>

      {adding && (
        <div className="surface mb-4 grid grid-cols-1 gap-3 p-4 sm:grid-cols-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Goal name (e.g. Hajj fund)"
            className="rounded-lg border border-ink-600 bg-ink-800/60 px-3 py-2 text-sm text-ink-100 placeholder:text-ink-500 sm:col-span-2"
          />
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            placeholder="Target ৳"
            className="rounded-lg border border-ink-600 bg-ink-800/60 px-3 py-2 text-sm text-ink-100 placeholder:text-ink-500"
          />
          <input
            value={date}
            onChange={(e) => setDate(e.target.value)}
            type="date"
            className="rounded-lg border border-ink-600 bg-ink-800/60 px-3 py-2 text-sm text-ink-100"
          />
          <button
            onClick={add}
            disabled={busy || !name || !amount}
            className="rounded-lg bg-neon-400 px-3 py-2 text-sm font-semibold text-ink-950 hover:bg-neon-500 disabled:opacity-50 sm:col-span-4"
          >
            {busy ? "Saving…" : "Save goal"}
          </button>
        </div>
      )}

      {loading && <div className="text-sm text-ink-400">Loading goals…</div>}
      {!loading && goals.length === 0 && (
        <div className="surface p-6 text-center text-sm text-ink-400">
          No goals yet. Add one to track progress toward a target.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {goals.map((g) => {
          const progress = Math.min(100, (invested / g.target_amount) * 100);
          const reached = invested >= g.target_amount;
          return (
            <div key={g.id} className="surface p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-ink-100">{g.name}</div>
                  {g.target_date && <div className="text-xs text-ink-500">by {fmtDate(g.target_date)}</div>}
                </div>
                <button onClick={() => remove(g.id)} className="text-xs text-ink-500 hover:text-rose-400">
                  Remove
                </button>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-ink-700/60">
                <div
                  className={`h-full rounded-full ${reached ? "bg-neon-400" : "bg-sky-400"}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="mono text-ink-300">{bdt(invested)}</span>
                <span className={reached ? "text-neon-400" : "text-ink-400"}>{progress.toFixed(0)}%</span>
                <span className="mono text-ink-400">{bdt(g.target_amount)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
