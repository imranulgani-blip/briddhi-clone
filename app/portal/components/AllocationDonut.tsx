"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { bdt } from "../lib/format";
import type { AllocationSlice } from "../lib/types";

export const PALETTE = ["#F5821E", "#0E50A0", "#12A150", "#7c3aed", "#ec4899", "#0ea5e9", "#f59e0b", "#ef4444", "#14b8a6", "#8b5cf6", "#e11d48", "#64748b"];
export const AMC_COLOR: Record<string, string> = {
  Ekush: "#F5821E",
  EDGE: "#0E50A0",
  Investit: "#12A150",
  "Midland Bank": "#EF6461",
  VIPB: "#0891b2",
  CWT: "#7c3aed",
  Sonchoy: "#ec4899",
};
export const AMC_SLUG: Record<string, string> = { Ekush: "ekush", EDGE: "edge", Investit: "investit", "Midland Bank": "midland", VIPB: "vipb" };
export const amcColor = (name: string, i: number) => AMC_COLOR[name] ?? PALETTE[i % PALETTE.length];
export const amcLogo = (name: string) => (AMC_SLUG[name] ? `/fund-logos/${AMC_SLUG[name]}.png` : null);
export const riskColorHex = (label: string) => (label === "HIGH" ? "#ef4444" : label === "MEDIUM" ? "#f59e0b" : label === "LOW" ? "#10b981" : "#64748b");

// Interactive, scroll-spinning donut used across the portal (Dashboard & Money Map).
export function DonutCard({
  title,
  hint,
  slices,
  colors,
  logos,
  naNote,
}: {
  title: string;
  hint?: string;
  slices: AllocationSlice[] | null;
  colors: string[];
  logos?: (string | null)[];
  naNote?: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ringRef, offset: ["start end", "end start"] });
  const rotate = useTransform(scrollYProgress, [0, 1], [-150, -30]);

  if (!slices || slices.length === 0) {
    return (
      <div className="lcard p-6">
        <div className="text-lg font-bold text-slate-900">{title}</div>
        <div className="mt-6 grid place-items-center py-8 text-center">
          <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-400">N/A</span>
          {naNote && <p className="mt-3 max-w-xs text-xs text-slate-400">{naNote}</p>}
        </div>
      </div>
    );
  }
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  const R = 42;
  const C = 2 * Math.PI * R;
  let offset = 0;
  const arcs = slices.map((s, i) => {
    const dash = (s.value / total) * C;
    const arc = { ...s, color: colors[i] ?? PALETTE[i % PALETTE.length], dash, gap: C - dash, off: offset };
    offset -= dash;
    return arc;
  });
  const focus = hover != null ? arcs[hover] : null;

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.4 }} className="lcard p-6">
      <div className="text-lg font-bold text-slate-900">{title}</div>
      {hint && <div className="text-sm text-slate-500">{hint}</div>}
      <div className="mt-4 flex items-center gap-6">
        <div ref={ringRef} className="relative shrink-0" style={{ width: 148, height: 148 }}>
          <motion.svg viewBox="0 0 100 100" className="h-full w-full" style={{ rotate, transformOrigin: "50% 50%" }}>
            <circle cx="50" cy="50" r={R} fill="none" stroke="#eef2f7" strokeWidth="13" />
            {arcs.map((arc, i) => (
              <motion.circle
                key={i}
                cx="50"
                cy="50"
                r={R}
                fill="none"
                stroke={arc.color}
                strokeDashoffset={arc.off}
                initial={{ strokeDasharray: `0 ${C}` }}
                whileInView={{ strokeDasharray: `${arc.dash} ${arc.gap}` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.08, ease: "easeOut" }}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                style={{ strokeWidth: hover === i ? 17 : 13, opacity: hover == null || hover === i ? 1 : 0.35, transition: "stroke-width .2s ease, opacity .2s ease", cursor: "pointer" }}
              />
            ))}
          </motion.svg>
          <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
            {focus ? (
              <div>
                <div className="text-lg font-extrabold" style={{ color: focus.color }}>{focus.pct.toFixed(1)}%</div>
                <div className="max-w-[86px] truncate text-[10px] capitalize text-slate-500">{focus.label}</div>
              </div>
            ) : (
              <div>
                <div className="text-base font-extrabold text-slate-900">{slices.length}</div>
                <div className="text-[10px] uppercase tracking-wide text-slate-400">groups</div>
              </div>
            )}
          </div>
        </div>
        <ul className="min-w-0 flex-1 space-y-1.5">
          {arcs.map((arc, i) => (
            <li key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} className="flex cursor-pointer items-center justify-between gap-2 rounded-lg px-1.5 py-1 text-sm transition-colors" style={{ background: hover === i ? "#f8fafc" : undefined }}>
              <span className="flex min-w-0 items-center gap-2">
                {logos && logos[i] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logos[i] as string} alt="" className="h-4 w-4 shrink-0 object-contain" />
                ) : (
                  <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: arc.color }} />
                )}
                <span className="truncate capitalize text-slate-600">{arc.label}</span>
              </span>
              <span className="shrink-0 text-right">
                <span className="font-semibold tabular-nums text-slate-900">{arc.pct.toFixed(1)}%</span>
                <span className="ml-2 hidden text-xs text-slate-400 sm:inline">{bdt(arc.value)}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

// Shared card chrome + N/A state -------------------------------------------------
function CardShell({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.4 }} className="lcard p-6">
      <div className="text-lg font-bold text-slate-900">{title}</div>
      {hint && <div className="text-sm text-slate-500">{hint}</div>}
      {children}
    </motion.div>
  );
}

function NaCard({ title, naNote }: { title: string; naNote?: string }) {
  return (
    <div className="lcard p-6">
      <div className="text-lg font-bold text-slate-900">{title}</div>
      <div className="mt-6 grid place-items-center py-8 text-center">
        <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-400">N/A</span>
        {naNote && <p className="mt-3 max-w-xs text-xs text-slate-400">{naNote}</p>}
      </div>
    </div>
  );
}

// Horizontal ranked bars (with optional logos) ----------------------------------
export function BarCard({ title, hint, slices, colors, logos, naNote }: { title: string; hint?: string; slices: AllocationSlice[] | null; colors: string[]; logos?: (string | null)[]; naNote?: string }) {
  if (!slices || slices.length === 0) return <NaCard title={title} naNote={naNote} />;
  const max = Math.max(...slices.map((s) => s.pct)) || 100;
  return (
    <CardShell title={title} hint={hint}>
      <div className="mt-5 space-y-3.5">
        {slices.map((s, i) => (
          <div key={s.label}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="flex min-w-0 items-center gap-2">
                {logos && logos[i] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logos[i] as string} alt="" className="h-4 w-4 shrink-0 object-contain" />
                ) : (
                  <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: colors[i] ?? PALETTE[i % PALETTE.length] }} />
                )}
                <span className="truncate capitalize text-slate-700">{s.label}</span>
              </span>
              <span className="shrink-0 tabular-nums">
                <span className="font-bold text-slate-900">{s.pct.toFixed(1)}%</span>
                <span className="ml-2 hidden text-xs text-slate-400 sm:inline">{bdt(s.value)}</span>
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
              <motion.div className="h-full rounded-full" style={{ background: colors[i] ?? PALETTE[i % PALETTE.length] }} initial={{ width: 0 }} whileInView={{ width: `${(s.pct / max) * 100}%` }} viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.06, ease: "easeOut" }} />
            </div>
          </div>
        ))}
      </div>
    </CardShell>
  );
}

// Vertical columns --------------------------------------------------------------
export function ColumnCard({ title, hint, slices, colors, naNote }: { title: string; hint?: string; slices: AllocationSlice[] | null; colors: string[]; naNote?: string }) {
  if (!slices || slices.length === 0) return <NaCard title={title} naNote={naNote} />;
  const max = Math.max(...slices.map((s) => s.pct)) || 100;
  return (
    <CardShell title={title} hint={hint}>
      <div className="mt-6">
        <div className="flex items-end gap-3" style={{ height: 150 }}>
          {slices.map((s, i) => (
            <motion.div
              key={s.label}
              className="min-w-0 flex-1 rounded-t-md"
              style={{ background: colors[i] ?? PALETTE[i % PALETTE.length] }}
              initial={{ height: 0 }}
              whileInView={{ height: `${Math.max((s.pct / max) * 100, 3)}%` }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: "easeOut" }}
              title={`${s.label} · ${s.pct.toFixed(1)}%`}
            />
          ))}
        </div>
        <div className="mt-2 flex gap-3">
          {slices.map((s) => (
            <div key={s.label} className="min-w-0 flex-1 text-center">
              <div className="text-[11px] font-bold text-slate-800 tabular-nums">{s.pct.toFixed(0)}%</div>
              <div className="truncate text-[10px] capitalize text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </CardShell>
  );
}

// Single 100%-stacked bar -------------------------------------------------------
export function StackedBarCard({ title, hint, slices, colors, logos, naNote }: { title: string; hint?: string; slices: AllocationSlice[] | null; colors: string[]; logos?: (string | null)[]; naNote?: string }) {
  if (!slices || slices.length === 0) return <NaCard title={title} naNote={naNote} />;
  return (
    <CardShell title={title} hint={hint}>
      <div className="mt-5 flex h-6 w-full overflow-hidden rounded-full ring-1 ring-slate-100">
        {slices.map((s, i) => (
          <motion.div
            key={s.label}
            className="h-full"
            style={{ background: colors[i] ?? PALETTE[i % PALETTE.length] }}
            initial={{ width: 0 }}
            whileInView={{ width: `${s.pct}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: "easeOut" }}
            title={`${s.label} · ${s.pct.toFixed(1)}%`}
          />
        ))}
      </div>
      <ul className="mt-4 space-y-1.5">
        {slices.map((s, i) => (
          <li key={s.label} className="flex items-center justify-between gap-2 text-sm">
            <span className="flex min-w-0 items-center gap-2">
              {logos && logos[i] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logos[i] as string} alt="" className="h-4 w-4 shrink-0 object-contain" />
              ) : (
                <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: colors[i] ?? PALETTE[i % PALETTE.length] }} />
              )}
              <span className="truncate capitalize text-slate-700">{s.label}</span>
            </span>
            <span className="shrink-0 tabular-nums">
              <span className="font-bold text-slate-900">{s.pct.toFixed(1)}%</span>
              <span className="ml-2 hidden text-xs text-slate-400 sm:inline">{bdt(s.value)}</span>
            </span>
          </li>
        ))}
      </ul>
    </CardShell>
  );
}

// Spider / radar chart with a side-to-side gradient fill ------------------------
export function RadarCard({ title, hint, slices, colors, naNote }: { title: string; hint?: string; slices: AllocationSlice[] | null; colors: string[]; naNote?: string }) {
  if (!slices || slices.length === 0) return <NaCard title={title} naNote={naNote} />;
  const n = slices.length;
  const maxPct = Math.max(...slices.map((s) => s.pct)) || 100;
  const cx = 100;
  const cy = 100;
  const R = 66;
  const stops = colors.length ? colors : PALETTE;
  const gid = "rg-" + title.replace(/[^a-z0-9]/gi, "").toLowerCase();
  const pt = (i: number, r: number): [number, number] => {
    const a = (i / n) * 2 * Math.PI - Math.PI / 2;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  };
  const fmt = (p: [number, number]) => p.map((v) => v.toFixed(1)).join(",");
  const dataPts = slices.map((s, i) => pt(i, Math.max((s.pct / maxPct) * R, 2)));
  const polyStr = dataPts.map(fmt).join(" ");
  return (
    <CardShell title={title} hint={hint}>
      <div className="mt-4 flex items-center gap-6">
        <div className="relative shrink-0" style={{ width: 168, height: 168 }}>
          <svg viewBox="0 0 200 200" className="h-full w-full">
            <defs>
              <linearGradient id={gid} x1="0" y1="0" x2="1" y2="0">
                {stops.map((c, i) => (
                  <stop key={i} offset={`${stops.length === 1 ? 100 : (i / (stops.length - 1)) * 100}%`} stopColor={c} />
                ))}
              </linearGradient>
            </defs>
            {/* concentric grid rings */}
            {[0.25, 0.5, 0.75, 1].map((f, ri) => (
              <polygon key={ri} points={Array.from({ length: n }, (_, i) => fmt(pt(i, R * f))).join(" ")} fill="none" stroke="#e2e8f0" strokeWidth="1" />
            ))}
            {/* spokes */}
            {slices.map((_, i) => {
              const [x, y] = pt(i, R);
              return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#e2e8f0" strokeWidth="1" />;
            })}
            {/* data polygon (gradient-filled) */}
            <motion.polygon
              points={polyStr}
              fill={`url(#${gid})`}
              fillOpacity="0.5"
              stroke={`url(#${gid})`}
              strokeWidth="2.5"
              strokeLinejoin="round"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            {/* vertices */}
            {dataPts.map((p, i) => (
              <motion.circle
                key={i}
                cx={p[0]}
                cy={p[1]}
                r="3.2"
                fill={stops[i % stops.length]}
                stroke="#fff"
                strokeWidth="1.5"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.35 + i * 0.06 }}
              />
            ))}
          </svg>
        </div>
        <ul className="min-w-0 flex-1 space-y-1.5">
          {slices.map((s, i) => (
            <li key={s.label} className="flex items-center justify-between gap-2 text-sm">
              <span className="flex min-w-0 items-center gap-2">
                <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: stops[i % stops.length] }} />
                <span className="truncate capitalize text-slate-600">{s.label}</span>
              </span>
              <span className="shrink-0 text-right">
                <span className="font-semibold tabular-nums text-slate-900">{s.pct.toFixed(1)}%</span>
                <span className="ml-2 hidden text-xs text-slate-400 sm:inline">{bdt(s.value)}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </CardShell>
  );
}
