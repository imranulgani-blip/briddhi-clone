"use client";

import { CHART_COLORS, bdt } from "../lib/format";
import type { AllocationSlice } from "../lib/types";

// Hand-rolled SVG donut + legend. No chart library.
export default function AllocationChart({
  title,
  slices,
  naNote,
}: {
  title: string;
  slices: AllocationSlice[] | null;
  naNote?: string;
}) {
  if (slices == null) {
    return (
      <div className="lcard p-5">
        <div className="text-sm font-semibold text-slate-900">{title}</div>
        <div className="mt-6 grid place-items-center py-6 text-center">
          <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-500">N/A</span>
          <p className="mt-3 max-w-xs text-xs text-slate-400">{naNote}</p>
        </div>
      </div>
    );
  }

  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  const R = 42;
  const C = 2 * Math.PI * R;
  let offset = 0;
  const arcs = slices.map((s, i) => {
    const frac = s.value / total;
    const dash = frac * C;
    const arc = { color: CHART_COLORS[i % CHART_COLORS.length], dash, gap: C - dash, off: offset, ...s };
    offset -= dash;
    return arc;
  });

  return (
    <div className="lcard p-5">
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      <div className="mt-4 flex items-center gap-5">
        <svg viewBox="0 0 100 100" width="112" height="112" className="shrink-0 -rotate-90">
          <circle cx="50" cy="50" r={R} fill="none" stroke="#e5e9f1" strokeWidth="12" />
          {arcs.map((a, i) => (
            <circle
              key={i}
              cx="50"
              cy="50"
              r={R}
              fill="none"
              stroke={a.color}
              strokeWidth="12"
              strokeDasharray={`${a.dash} ${a.gap}`}
              strokeDashoffset={a.off}
            />
          ))}
        </svg>
        <ul className="min-w-0 flex-1 space-y-1.5">
          {arcs.map((a, i) => (
            <li key={i} className="flex items-center justify-between gap-2 text-xs">
              <span className="flex min-w-0 items-center gap-2">
                <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: a.color }} />
                <span className="truncate text-slate-600">{a.label}</span>
              </span>
              <span className="mono shrink-0 text-slate-500">{a.pct.toFixed(1)}%</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-3 border-t border-slate-200 pt-2 text-right text-xs text-slate-400">
        Total invested <span className="mono text-slate-600">{bdt(total)}</span>
      </div>
    </div>
  );
}
