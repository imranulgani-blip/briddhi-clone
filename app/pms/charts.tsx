"use client";

import { PRIME_RED, type Returns, type Slice } from "../data/pms";

const DONUT_PALETTE = [PRIME_RED, "#F5821E", "#0d9488", "#f59e0b", "#94a3b8"];

// ---------------------------------------------------------------------------
// Allocation donut
// ---------------------------------------------------------------------------
export function Donut({ slices, size = 128 }: { slices: Slice[]; size?: number }) {
  const total = slices.reduce((s, x) => s + x.pct, 0) || 100;
  const R = 42;
  const C = 2 * Math.PI * R;
  let offset = 0;
  const arcs = slices.map((s, i) => {
    const dash = (s.pct / total) * C;
    const a = { color: DONUT_PALETTE[i % DONUT_PALETTE.length], dash, gap: C - dash, off: offset, ...s };
    offset -= dash;
    return a;
  });
  return (
    <div className="flex items-center gap-5">
      <svg viewBox="0 0 100 100" width={size} height={size} className="shrink-0 -rotate-90">
        <circle cx="50" cy="50" r={R} fill="none" stroke="#eef2f7" strokeWidth="13" />
        {arcs.map((a, i) => (
          <circle key={i} cx="50" cy="50" r={R} fill="none" stroke={a.color} strokeWidth="13" strokeDasharray={`${a.dash} ${a.gap}`} strokeDashoffset={a.off} />
        ))}
      </svg>
      <ul className="min-w-0 flex-1 space-y-1.5">
        {arcs.map((a, i) => (
          <li key={i} className="flex items-center justify-between gap-2 text-sm">
            <span className="flex min-w-0 items-center gap-2">
              <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: a.color }} />
              <span className="truncate text-slate-600">{a.label}</span>
            </span>
            <span className="font-semibold tabular-nums text-slate-900">{a.pct}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Growth of ৳100 over 3 years — scheme vs DSEX benchmark
// ---------------------------------------------------------------------------
export function GrowthLine({ si, benchmarkSi, risk }: { si: number; benchmarkSi: number; risk: "Low" | "Medium" | "High" }) {
  const months = 36;
  const vol = risk === "High" ? 0.05 : risk === "Medium" ? 0.03 : 0.014;
  const grow = (rate: number, t: number) => 100 * Math.pow(1 + rate / 100, 3 * t);
  const scheme: number[] = [];
  const bench: number[] = [];
  for (let i = 0; i <= months; i++) {
    const t = i / months;
    const wave = i === 0 || i === months ? 0 : Math.sin(i * 0.7) * vol * 100 * t;
    scheme.push(grow(si, t) + wave);
    bench.push(grow(benchmarkSi, t) + (i === 0 || i === months ? 0 : Math.sin(i * 0.5) * 0.6));
  }
  const W = 640;
  const H = 220;
  const padL = 36;
  const padB = 22;
  const padT = 12;
  const innerW = W - padL - 12;
  const innerH = H - padT - padB;
  const all = [...scheme, ...bench];
  const min = Math.min(...all) * 0.99;
  const max = Math.max(...all) * 1.02;
  const x = (i: number) => padL + (i / months) * innerW;
  const y = (v: number) => padT + innerH - ((v - min) / (max - min || 1)) * innerH;
  const path = (arr: number[]) => arr.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const area = `${path(scheme)} L ${x(months)} ${padT + innerH} L ${padL} ${padT + innerH} Z`;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%">
        {[0, 0.5, 1].map((g) => {
          const v = min + (max - min) * g;
          return (
            <g key={g}>
              <line x1={padL} x2={W - 12} y1={y(v)} y2={y(v)} stroke="#eef2f7" strokeWidth={1} />
              <text x={padL - 5} y={y(v) + 3} textAnchor="end" fontSize="9" fill="#94a3b8">৳{v.toFixed(0)}</text>
            </g>
          );
        })}
        <path d={area} fill={PRIME_RED} fillOpacity={0.1} />
        <path d={path(bench)} fill="none" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 4" strokeLinecap="round" />
        <path d={path(scheme)} fill="none" stroke={PRIME_RED} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={x(months)} cy={y(scheme[months])} r={4} fill={PRIME_RED} stroke="#fff" strokeWidth={2} />
        <text x={padL} y={H - 6} fontSize="9" fill="#94a3b8">3 years ago</text>
        <text x={W - 12} y={H - 6} fontSize="9" fill="#94a3b8" textAnchor="end">Today</text>
      </svg>
      <div className="mt-1 flex items-center gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5"><span className="h-1 w-4 rounded" style={{ background: PRIME_RED }} /> This scheme → ৳{scheme[months].toFixed(0)}</span>
        <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 rounded border-t-2 border-dashed border-slate-400" /> DSEX → ৳{bench[months].toFixed(0)}</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tiny 5-bar return sparkline for scheme cards
// ---------------------------------------------------------------------------
export function MiniBars({ returns }: { returns: Returns }) {
  const vals = [returns.m1, returns.m6, returns.y1, returns.y3, returns.si];
  const max = Math.max(...vals) || 1;
  return (
    <div className="flex h-8 items-end gap-1">
      {vals.map((v, i) => (
        <span key={i} className="w-1.5 rounded-t" style={{ height: `${Math.max(12, (v / max) * 100)}%`, background: PRIME_RED, opacity: 0.35 + (i / 8) }} />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Horizontal return bar (leaderboard) — scheme value vs a max, with benchmark tick
// ---------------------------------------------------------------------------
export function HBar({ value, max, benchmark }: { value: number; max: number; benchmark?: number }) {
  return (
    <div className="relative h-3 w-full overflow-visible rounded-full bg-slate-100">
      <div className="h-full rounded-full" style={{ width: `${Math.max(2, (value / max) * 100)}%`, background: PRIME_RED }} />
      {benchmark != null && (
        <div className="absolute top-1/2 h-4 w-0.5 -translate-y-1/2 bg-slate-400" style={{ left: `${(benchmark / max) * 100}%` }} title={`DSEX ${benchmark}%`} />
      )}
    </div>
  );
}
