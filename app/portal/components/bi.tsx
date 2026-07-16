"use client";

// BI-dashboard building blocks — colorful pastel panels + a spread of chart types
// (KPI tiles, vertical columns, horizontal bars, radial gauges, a value spiral,
// and an area chart), styled after a classic multi-panel analytics board.

import { motion } from "framer-motion";
import { bdt } from "../lib/format";
import type { AllocationSlice } from "../lib/types";

// Compact taka label for tight spaces (৳3.0L, ৳80k …)
export const kbdt = (v: number) =>
  v >= 1e7 ? `৳${(v / 1e7).toFixed(1)}Cr` : v >= 1e5 ? `৳${(v / 1e5).toFixed(1)}L` : v >= 1e3 ? `৳${Math.round(v / 1e3)}k` : `৳${Math.round(v)}`;

// --- Panel -------------------------------------------------------------------
export function Panel({
  title,
  accent,
  soft,
  sub,
  right,
  children,
  className = "",
}: {
  title: string;
  accent: string;
  soft: string;
  sub?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4 }}
      className={`rounded-2xl p-4 shadow-sm ring-1 ring-black/5 sm:p-5 ${className}`}
      style={{ background: soft }}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-baseline gap-2">
          <h3 className="text-lg font-extrabold tracking-tight sm:text-xl" style={{ color: accent }}>
            {title}
          </h3>
          {sub && <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{sub}</span>}
        </div>
        {right}
      </div>
      {children}
    </motion.section>
  );
}

// --- KPI tile with icon ------------------------------------------------------
export function KpiTile({
  icon,
  label,
  value,
  sub,
  accent,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  accent: string;
  tone?: "pos" | "neg" | "default";
}) {
  const valColor = tone === "pos" ? "#059669" : tone === "neg" ? "#e11d48" : "#0f172a";
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-100">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl" style={{ background: `${accent}1a`, color: accent }}>
        {icon}
      </span>
      <div className="min-w-0">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</div>
        <div className="text-xl font-extrabold tabular-nums leading-tight" style={{ color: valColor }}>
          {value}
        </div>
        {sub && (
          <div className="text-[11px] font-semibold" style={{ color: valColor }}>
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

// --- Vertical columns --------------------------------------------------------
export function MiniColumns({ slices, colors, height = 150, showValue = true }: { slices: AllocationSlice[]; colors: string[]; height?: number; showValue?: boolean }) {
  const max = Math.max(...slices.map((s) => s.value)) || 1;
  return (
    <div>
      <div className="flex items-end gap-2" style={{ height }}>
        {slices.map((s, i) => (
          <div key={s.label} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end">
            <span className="mb-1 text-[10px] font-bold tabular-nums text-slate-700">{showValue ? kbdt(s.value) : `${s.pct.toFixed(0)}%`}</span>
            <motion.div
              className="w-full max-w-[40px] rounded-t-md"
              style={{ background: colors[i % colors.length] }}
              initial={{ height: 0 }}
              whileInView={{ height: `${Math.max((s.value / max) * 100, 3)}%` }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: i * 0.07, ease: "easeOut" }}
              title={`${s.label} · ${bdt(s.value)} · ${s.pct.toFixed(1)}%`}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        {slices.map((s) => (
          <div key={s.label} className="min-w-0 flex-1 truncate text-center text-[10px] capitalize text-slate-500">
            {s.label}
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Horizontal bars ---------------------------------------------------------
export function MiniBars({ slices, colors, logos, track = "rgba(0,0,0,0.06)" }: { slices: AllocationSlice[]; colors: string[]; logos?: (string | null)[]; track?: string }) {
  const max = Math.max(...slices.map((s) => s.value)) || 1;
  return (
    <div className="space-y-2.5">
      {slices.map((s, i) => (
        <div key={s.label}>
          <div className="mb-0.5 flex items-center justify-between text-xs">
            <span className="flex min-w-0 items-center gap-1.5">
              {logos && logos[i] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logos[i] as string} alt="" className="h-4 w-4 shrink-0 object-contain" />
              ) : (
                <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: colors[i % colors.length] }} />
              )}
              <span className="truncate font-medium capitalize text-slate-700">{s.label}</span>
            </span>
            <span className="shrink-0 tabular-nums">
              <span className="font-bold text-slate-800">{s.pct.toFixed(1)}%</span>
              <span className="ml-1.5 hidden text-[11px] text-slate-400 sm:inline">{kbdt(s.value)}</span>
            </span>
          </div>
          <div className="h-3 overflow-hidden rounded-full" style={{ background: track }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: colors[i % colors.length] }}
              initial={{ width: 0 }}
              whileInView={{ width: `${(s.value / max) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.06, ease: "easeOut" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// --- Radial gauges -----------------------------------------------------------
export function Gauge({ label, pct, color }: { label: string; pct: number; color: string }) {
  const R = 30;
  const C = 2 * Math.PI * R;
  const dash = (Math.min(pct, 100) / 100) * C;
  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: 80, height: 80 }}>
        <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
          <circle cx="40" cy="40" r={R} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="7" />
          <motion.circle
            cx="40"
            cy="40"
            r={R}
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            initial={{ strokeDasharray: `0 ${C}` }}
            whileInView={{ strokeDasharray: `${dash} ${C - dash}` }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center text-base font-extrabold text-slate-800">{Math.round(pct)}%</div>
      </div>
      <div className="mt-1 max-w-[84px] truncate text-center text-[11px] font-semibold capitalize" style={{ color }} title={label}>
        {label}
      </div>
    </div>
  );
}

export function GaugeRow({ slices, colors }: { slices: AllocationSlice[]; colors: string[] }) {
  return (
    <div className="flex flex-wrap justify-around gap-3">
      {slices.map((s, i) => (
        <Gauge key={s.label} label={s.label} pct={s.pct} color={colors[i % colors.length]} />
      ))}
    </div>
  );
}

// --- Concentric value spiral (satisfaction-style) ----------------------------
export function SpiralChart({ slices, colors }: { slices: AllocationSlice[]; colors: string[] }) {
  const cx = 50;
  const cy = 50;
  const n = Math.max(slices.length, 1);
  const inner = 12;
  const outer = 44;
  const step = (outer - inner) / n;
  const polar = (r: number, deg: number): [number, number] => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)];
  const arcPath = (r: number, f: number) => {
    const start = polar(r, -90);
    const endDeg = -90 + 360 * Math.min(f, 0.9999);
    const end = polar(r, endDeg);
    const large = f > 0.5 ? 1 : 0;
    return `M ${start[0].toFixed(2)} ${start[1].toFixed(2)} A ${r} ${r} 0 ${large} 1 ${end[0].toFixed(2)} ${end[1].toFixed(2)}`;
  };
  const maxPct = Math.max(...slices.map((s) => s.pct)) || 100;
  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 100 100" className="h-36 w-36 shrink-0">
        {slices.map((s, i) => {
          const r = inner + step * (i + 0.5);
          const f = (s.pct / maxPct) * 0.92; // largest reaches ~92% of the ring
          return (
            <g key={s.label}>
              <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth={step * 0.7} />
              <motion.path
                d={arcPath(r, f)}
                fill="none"
                stroke={colors[i % colors.length]}
                strokeWidth={step * 0.7}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
              />
            </g>
          );
        })}
      </svg>
      <ul className="min-w-0 flex-1 space-y-1">
        {slices.map((s, i) => (
          <li key={s.label} className="flex items-center justify-between gap-2 text-xs">
            <span className="flex min-w-0 items-center gap-1.5">
              <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: colors[i % colors.length] }} />
              <span className="truncate capitalize text-slate-600">{s.label}</span>
            </span>
            <span className="shrink-0 font-bold tabular-nums text-slate-800">{s.pct.toFixed(1)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// --- Area chart (for solid colored panels) -----------------------------------
export function MiniArea({ values, stroke = "#ffffff", fill = "rgba(255,255,255,0.22)", height = 96 }: { values: number[]; stroke?: string; fill?: string; height?: number }) {
  if (!values.length) return null;
  const w = 320;
  const h = height;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const nx = (i: number) => (values.length <= 1 ? 0 : (i / (values.length - 1)) * w);
  const ny = (v: number) => h - ((v - min) / (max - min || 1)) * (h - 10) - 5;
  const line = values.map((v, i) => `${i ? "L" : "M"} ${nx(i).toFixed(1)} ${ny(v).toFixed(1)}`).join(" ");
  const area = `${line} L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full" style={{ height }}>
      <path d={area} fill={fill} />
      <motion.path d={line} fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: "easeOut" }} />
    </svg>
  );
}

// --- Insight donut (segmented ring, center metric, % badges) -----------------
export function InsightDonut({
  title,
  hint,
  slices,
  colors,
  naNote,
  centerLabel = "groups",
}: {
  title: string;
  hint?: string;
  slices: AllocationSlice[] | null;
  colors: string[];
  naNote?: string;
  centerLabel?: string;
}) {
  const card = (children: React.ReactNode) => (
    <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.4 }} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <div className="text-lg font-bold text-slate-900">{title}</div>
      {hint && <div className="text-sm text-slate-500">{hint}</div>}
      {children}
    </motion.div>
  );
  if (!slices || slices.length === 0) {
    return card(
      <div className="mt-6 grid place-items-center py-8 text-center">
        <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-400">N/A</span>
        {naNote && <p className="mt-3 max-w-xs text-xs text-slate-400">{naNote}</p>}
      </div>
    );
  }
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  const R = 38;
  const C = 2 * Math.PI * R;
  const gap = 3;
  let acc = 0;
  const arcs = slices.map((s, i) => {
    const len = (s.value / total) * C;
    const dash = Math.max(len - gap, 1);
    const mid = acc + len / 2;
    const ang = (mid / C) * 2 * Math.PI - Math.PI / 2;
    const bx = 50 + R * Math.cos(ang);
    const by = 50 + R * Math.sin(ang);
    const seg = { ...s, color: colors[i % colors.length], dash, rest: C - dash, offset: -acc, bx, by };
    acc += len;
    return seg;
  });
  return card(
    <div className="mt-4 flex items-center gap-6">
      <div className="relative shrink-0" style={{ width: 176, height: 176 }}>
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r={R} fill="none" stroke="#eef2f7" strokeWidth="13" />
          {arcs.map((a, i) => (
            <motion.circle
              key={i}
              cx="50"
              cy="50"
              r={R}
              fill="none"
              stroke={a.color}
              strokeWidth="13"
              strokeLinecap="round"
              strokeDashoffset={a.offset}
              initial={{ strokeDasharray: `0 ${C}` }}
              whileInView={{ strokeDasharray: `${a.dash} ${a.rest}` }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: i * 0.08, ease: "easeOut" }}
            />
          ))}
        </svg>
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <div>
            <div className="text-2xl font-extrabold text-slate-900">{slices.length}</div>
            <div className="text-[10px] uppercase tracking-wide text-slate-400">{centerLabel}</div>
          </div>
        </div>
        {arcs
          .filter((a) => a.pct >= 3)
          .map((a, i) => (
            <div
              key={i}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border bg-white px-1.5 py-0.5 text-[9px] font-bold text-slate-600 shadow-sm"
              style={{ left: `${a.bx}%`, top: `${a.by}%`, borderColor: a.color }}
            >
              {a.pct.toFixed(0)}%
            </div>
          ))}
      </div>
      <ul className="min-w-0 flex-1 space-y-1.5">
        {arcs.map((a, i) => (
          <li key={i} className="flex items-center justify-between gap-2 text-sm">
            <span className="flex min-w-0 items-center gap-2">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: a.color }} />
              <span className="truncate capitalize text-slate-600">{a.label}</span>
            </span>
            <span className="shrink-0 text-right">
              <span className="font-semibold tabular-nums text-slate-900">{a.pct.toFixed(1)}%</span>
              <span className="ml-2 hidden text-xs text-slate-400 sm:inline">{bdt(a.value)}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// --- Pie chart (filled wedges + legend) --------------------------------------
export function PieChart({ slices, colors, naNote }: { slices: AllocationSlice[] | null; colors: string[]; naNote?: string }) {
  if (!slices || slices.length === 0) {
    return (
      <div className="grid place-items-center py-8 text-center">
        <span className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-400">N/A</span>
        {naNote && <p className="mt-3 max-w-xs text-xs text-slate-400">{naNote}</p>}
      </div>
    );
  }
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  const cx = 50;
  const cy = 50;
  const R = 46;
  const pt = (f: number): [number, number] => {
    const a = f * 2 * Math.PI - Math.PI / 2;
    return [cx + R * Math.cos(a), cy + R * Math.sin(a)];
  };
  let acc = 0;
  const wedges = slices.map((s, i) => {
    const f0 = acc / total;
    acc += s.value;
    const f1 = acc / total;
    const [x0, y0] = pt(f0);
    const [x1, y1] = pt(f1);
    const large = f1 - f0 > 0.5 ? 1 : 0;
    const d = `M ${cx} ${cy} L ${x0.toFixed(2)} ${y0.toFixed(2)} A ${R} ${R} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z`;
    return { ...s, color: colors[i % colors.length], d };
  });
  const single = slices.length === 1;
  return (
    <div className="mt-2 flex items-center gap-6">
      <motion.svg viewBox="0 0 100 100" className="h-40 w-40 shrink-0" initial={{ opacity: 0, scale: 0.85, rotate: -12 }} whileInView={{ opacity: 1, scale: 1, rotate: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.6, ease: "easeOut" }} style={{ transformOrigin: "50% 50%" }}>
        {single ? (
          <circle cx={cx} cy={cy} r={R} fill={wedges[0].color} stroke="#ffffff" strokeWidth="1" />
        ) : (
          wedges.map((w, i) => (
            <motion.path key={i} d={w.d} fill={w.color} stroke="#ffffff" strokeWidth="1" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.3 }} />
          ))
        )}
      </motion.svg>
      <ul className="min-w-0 flex-1 space-y-1.5">
        {wedges.map((w, i) => (
          <li key={i} className="flex items-center justify-between gap-2 text-sm">
            <span className="flex min-w-0 items-center gap-2">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: w.color }} />
              <span className="truncate capitalize text-slate-600">{w.label}</span>
            </span>
            <span className="shrink-0 text-right">
              <span className="font-semibold tabular-nums text-slate-900">{w.pct.toFixed(1)}%</span>
              <span className="ml-2 hidden text-xs text-slate-400 sm:inline">{bdt(w.value)}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// --- Icons -------------------------------------------------------------------
const iconProps = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
export const IconWallet = () => (
  <svg {...iconProps}>
    <path d="M3 7a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <path d="M16 12h3v-2h-3a1 1 0 000 2z" />
  </svg>
);
export const IconCoins = () => (
  <svg {...iconProps}>
    <ellipse cx="9" cy="6" rx="6" ry="3" />
    <path d="M3 6v6c0 1.7 2.7 3 6 3s6-1.3 6-3V6" />
    <path d="M15 12c0 1.7 2.7 3 6 3M15 12V9" />
    <path d="M9 15v3c0 1.7 2.7 3 6 3s6-1.3 6-3v-3" />
  </svg>
);
export const IconTrend = () => (
  <svg {...iconProps}>
    <path d="M3 17l6-6 4 4 8-8" />
    <path d="M17 7h4v4" />
  </svg>
);
export const IconGauge = () => (
  <svg {...iconProps}>
    <path d="M12 13l4-4" />
    <path d="M4.5 18a9 9 0 1115 0" />
    <circle cx="12" cy="13" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);
