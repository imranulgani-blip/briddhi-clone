"use client";

import { useState } from "react";
import { usePortal } from "../lib/PortalContext";
import { useFetch } from "../lib/useFetch";
import type { Investor, PortfolioPayload, Transaction } from "../lib/types";
import StatementDocument from "../components/StatementDocument";

interface StatementResponse {
  investor: Investor;
  asOf: string;
  period: { from: string; to: string };
  portfolio: PortfolioPayload;
  transactions: Transaction[];
  taxReport: {
    period: { from: string; to: string };
    totalInvestedInPeriod: number;
    transactionCount: number;
    realizedGains: number | null;
    dividendIncome: number | null;
    note: string;
  };
}

export default function StatementsPage() {
  const { investor } = usePortal();
  const [from, setFrom] = useState("2025-11-01");
  const [to, setTo] = useState("2026-06-30");
  const [showTax, setShowTax] = useState(true);

  const url = investor ? `/api/statements/${investor.id}?from=${from}&to=${to}` : null;
  const { data, loading, error } = useFetch<StatementResponse>(url);

  // Print the statement in an isolated window so the app's layout/print CSS can't
  // interfere and brand background colours are preserved. User picks "Save as PDF".
  const handleDownload = () => {
    const el = document.getElementById("statement-doc");
    if (!el) return;
    const win = window.open("", "_blank", "width=920,height=1200");
    if (!win) {
      window.print(); // popup blocked — fall back to normal print
      return;
    }
    win.document.write(`<!doctype html><html><head><meta charset="utf-8">
<title>Briddhi Portfolio Statement — ${investor?.name ?? ""}</title>
<base href="${window.location.origin}/">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  html, body { margin: 0; background: #fff; font-family: Inter, system-ui, sans-serif; }
  @page { size: A4; margin: 10mm; }
</style></head><body>${el.outerHTML}</body></html>`);
    win.document.close();
    let printed = false;
    const doPrint = () => {
      if (printed) return;
      printed = true;
      win.focus();
      win.print();
    };
    // Wait for every image (Briddhi logo + all fund logos) before printing.
    const imgs = Array.from(win.document.images);
    let pending = imgs.filter((i) => !i.complete).length;
    if (pending === 0) {
      setTimeout(doPrint, 300);
    } else {
      const done = () => {
        if (--pending <= 0) doPrint();
      };
      imgs.forEach((i) => {
        if (!i.complete) {
          i.addEventListener("load", done);
          i.addEventListener("error", done);
        }
      });
      setTimeout(doPrint, 2500); // safety fallback if an image stalls
    }
  };

  if (!investor) return null;

  return (
    <div className="space-y-6">
      <div className="no-print">
        <h1 className="text-2xl font-bold tracking-tight">Statements &amp; Reports</h1>
        <p className="text-sm text-ink-400">
          Generate an EKUSH-style portfolio statement and tax report for any period, then download as PDF.
        </p>
      </div>

      {/* Controls */}
      <div className="no-print surface flex flex-wrap items-end gap-4 p-4">
        <label className="text-xs text-ink-400">
          From
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="mt-1 block rounded-lg border border-ink-600 bg-ink-800/60 px-3 py-2 text-sm text-ink-100"
          />
        </label>
        <label className="text-xs text-ink-400">
          To
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="mt-1 block rounded-lg border border-ink-600 bg-ink-800/60 px-3 py-2 text-sm text-ink-100"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-ink-300">
          <input type="checkbox" checked={showTax} onChange={(e) => setShowTax(e.target.checked)} />
          Include tax report
        </label>
        <button
          onClick={handleDownload}
          disabled={!data}
          className="ml-auto rounded-lg bg-neon-400 px-4 py-2 text-sm font-semibold text-ink-950 hover:bg-neon-500 disabled:opacity-50"
        >
          Download PDF ↓
        </button>
      </div>
      <p className="no-print -mt-2 text-xs text-ink-500">
        Opens the print dialog — choose <strong>“Save as PDF”</strong> as the destination.
      </p>

      {error && <div className="surface border-amber-500/40 p-6 text-amber-200">{error}</div>}
      {loading && <div className="text-ink-400">Generating statement…</div>}

      {data && (
        <div id="statement-doc" className="print-area">
          <StatementDocument data={data} showTax={showTax} />
        </div>
      )}
    </div>
  );
}
