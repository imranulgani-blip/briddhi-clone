"use client";

import { bdt } from "../lib/format";
import type { Activity } from "../lib/types";
import { NaBadge } from "./Kpi";

// Account activity for the selected period (FR-DASH-04).
export default function ActivityTable({ activity }: { activity: Activity }) {
  const rows: { label: string; value: number | null; tone?: "pos" | "neg" }[] = [
    { label: "Opening value", value: activity.openingInvested },
    { label: "Contributions", value: activity.contributions, tone: "pos" },
    { label: "Withdrawals", value: -activity.withdrawals, tone: "neg" },
    { label: "Market gain / loss", value: activity.marketGainLoss, tone: "pos" },
    { label: "Closing value", value: activity.closingValue ?? activity.closingInvested },
  ];
  return (
    <div className="lcard p-5">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-900">Account activity</div>
        <span className="text-xs text-slate-500">{activity.periodLabel}</span>
      </div>
      <table className="mt-3 w-full text-sm">
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-t border-slate-100">
              <td className="py-2 text-slate-600">
                {r.label}
                {r.label === "Closing value" && activity.closingValue == null && (
                  <span className="ml-1 text-xs text-slate-400">(at cost)</span>
                )}
              </td>
              <td className="py-2 text-right">
                {r.value == null ? (
                  <NaBadge />
                ) : (
                  <span
                    className={`mono ${
                      r.tone === "pos" && r.value !== 0
                        ? "text-[#F5821E]"
                        : r.tone === "neg" && r.value !== 0
                        ? "text-rose-600"
                        : "text-slate-900"
                    }`}
                  >
                    {bdt(r.value)}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-xs text-slate-400">
        Opening/closing shown at invested cost; market gain/loss and market closing value require NAV
        data (not in source).
      </p>
    </div>
  );
}
