"use client";

import Link from "next/link";
import { bdt, naOr, pct } from "../lib/format";
import type { Holding } from "../lib/types";
import { NaBadge } from "./Kpi";

function Cell({ value, fmt, tone }: { value: number | null; fmt: (v: number) => string; tone?: boolean }) {
  if (value == null) return <NaBadge />;
  const color = tone ? (value >= 0 ? "text-neon-400" : "text-rose-400") : "text-ink-100";
  return <span className={`mono ${color}`}>{fmt(value)}</span>;
}

export default function HoldingsTable({ holdings, investorId }: { holdings: Holding[]; investorId: string }) {
  return (
    <div className="surface overflow-x-auto">
      <table className="data w-full min-w-[900px] text-sm">
        <thead>
          <tr className="text-left">
            <th>Fund</th>
            <th>AMC</th>
            <th className="text-right">Units</th>
            <th className="text-right">Avg cost</th>
            <th className="text-right">NAV</th>
            <th className="text-right">Invested</th>
            <th className="text-right">Market value</th>
            <th className="text-right">Gain / Loss</th>
            <th className="text-right">Weight %</th>
            <th className="text-right">Abs. return</th>
            <th className="text-right">XIRR</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((h) => (
            <tr key={h.fundId}>
              <td>
                <div className="font-medium text-ink-100">{h.fundName}</div>
                <div className="text-xs text-ink-500">
                  {h.txnCount} order{h.txnCount > 1 ? "s" : ""} · {h.riskProfile ?? "—"}
                </div>
              </td>
              <td className="text-ink-300">{h.amc}</td>
              <td className="text-right"><Cell value={h.units} fmt={(v) => v.toFixed(3)} /></td>
              <td className="text-right"><Cell value={h.avgCost} fmt={(v) => v.toFixed(3)} /></td>
              <td className="text-right"><Cell value={h.currentNav} fmt={(v) => v.toFixed(3)} /></td>
              <td className="text-right mono text-ink-100">{bdt(h.invested)}</td>
              <td className="text-right"><Cell value={h.marketValue} fmt={bdt} /></td>
              <td className="text-right"><Cell value={h.gainLoss} fmt={(v) => bdt(v)} tone /></td>
              <td className="text-right mono text-ink-300">{h.weightPct.toFixed(1)}%</td>
              <td className="text-right"><Cell value={h.absoluteReturnPct} fmt={(v) => pct(v, true)} tone /></td>
              <td className="text-right"><Cell value={h.xirrPct} fmt={(v) => pct(v, true)} tone /></td>
              <td className="text-right">
                <Link
                  href={`/portal/fund/${h.fundId}`}
                  className="text-neon-400 hover:text-neon-500"
                  title="Open fund analytics"
                >
                  →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-ink-600/60">
            <td className="font-semibold text-ink-100" colSpan={5}>
              Total ({holdings.length} funds)
            </td>
            <td className="text-right mono font-semibold text-ink-100">
              {bdt(holdings.reduce((s, h) => s + h.invested, 0))}
            </td>
            <td className="text-right">
              {holdings.every((h) => h.marketValue != null) && holdings.length > 0 ? (
                <span className="mono font-semibold text-ink-100">
                  {bdt(holdings.reduce((s, h) => s + (h.marketValue ?? 0), 0))}
                </span>
              ) : (
                <NaBadge />
              )}
            </td>
            <td colSpan={5}></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
