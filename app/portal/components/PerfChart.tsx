"use client";

import type { PerformancePoint } from "../lib/types";

const fmt = (n: number) => {
  if (n >= 10_000_000) return `৳${(n / 10_000_000).toFixed(1)}Cr`;
  if (n >= 100_000) return `৳${(n / 100_000).toFixed(1)}L`;
  if (n >= 1000) return `৳${(n / 1000).toFixed(0)}k`;
  return `৳${Math.round(n)}`;
};

// Cumulative invested (real) with an optional current-value line (only when NAV present).
export default function PerfChart({ points, showValue }: { points: PerformancePoint[]; showValue: boolean }) {
  if (points.length === 0) {
    return <div className="lcard grid h-56 place-items-center text-sm text-slate-500">No activity in this period.</div>;
  }
  const width = 720;
  const height = 260;
  const padL = 48;
  const padR = 14;
  const padT = 14;
  const padB = 28;
  const innerW = width - padL - padR;
  const innerH = height - padT - padB;

  const values = points.flatMap((p) => [p.invested, ...(showValue && p.value != null ? [p.value] : [])]);
  const max = Math.max(...values) * 1.08 || 1;
  const n = points.length;

  const x = (i: number) => padL + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW);
  const y = (v: number) => padT + innerH - (v / max) * innerH;

  const line = (key: "invested" | "value") =>
    points
      .map((p, i) => {
        const v = p[key];
        if (v == null) return "";
        return `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`;
      })
      .filter(Boolean)
      .join(" ");

  const area = `${line("invested")} L ${x(n - 1)} ${padT + innerH} L ${x(0)} ${padT + innerH} Z`;
  const grid = 4;
  const labelStep = Math.max(1, Math.floor(n / 6));

  return (
    <div className="lcard p-4">
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" style={{ display: "block" }}>
        {Array.from({ length: grid + 1 }, (_, i) => {
          const v = (max / grid) * i;
          const yy = y(v);
          return (
            <g key={i}>
              <line x1={padL} x2={width - padR} y1={yy} y2={yy} stroke="#e5e9f1" strokeWidth={1} />
              <text x={padL - 8} y={yy + 3} textAnchor="end" className="mono" fill="#94a3b8" fontSize="10">
                {fmt(v)}
              </text>
            </g>
          );
        })}
        <path d={area} fill="rgba(245,130,30,0.12)" />
        <path d={line("invested")} fill="none" stroke="#F5821E" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
        {showValue && <path d={line("value")} fill="none" stroke="#38bdf8" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />}
        {points.map((p, i) =>
          i % labelStep === 0 || i === n - 1 ? (
            <text key={i} x={x(i)} y={height - 8} textAnchor="middle" fill="#94a3b8" fontSize="10">
              {p.label}
            </text>
          ) : null
        )}
      </svg>
      <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-3 rounded-sm bg-[#F5821E]" /> Invested (cumulative)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-3 rounded-sm" style={{ background: showValue ? "#38bdf8" : "#334155" }} />
          Current value {showValue ? "" : "(N/A — needs NAV)"}
        </span>
      </div>
    </div>
  );
}
