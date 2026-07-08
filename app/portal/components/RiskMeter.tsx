"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { AllocationSlice } from "../lib/types";

// Semicircular gauge (0–100) with a sweeping needle + a counting ticker.
const CX = 100;
const CY = 100;
const R = 78;
const P = (deg: number, r = R): [number, number] => {
  const a = ((deg - 90) * Math.PI) / 180; // -90 = left, 0 = top, 90 = right
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
};
const arc = (a0: number, a1: number, r = R) => {
  const [x0, y0] = P(a0, r);
  const [x1, y1] = P(a1, r);
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
};

const RISK_W: Record<string, number> = { HIGH: 90, MEDIUM: 55, MODERATE: 55, BALANCED: 55, LOW: 18, CONSERVATIVE: 18 };

export default function RiskMeter({ title = "Briddhi Risk Meter", hint, slices }: { title?: string; hint?: string; slices: AllocationSlice[] | null }) {
  const score = (() => {
    if (!slices || !slices.length) return 50;
    const tot = slices.reduce((s, x) => s + x.pct, 0) || 100;
    const w = slices.reduce((s, x) => s + (RISK_W[(x.label ?? "").toUpperCase()] ?? 50) * x.pct, 0);
    return Math.max(2, Math.min(98, w / tot));
  })();

  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0;
    let startT = 0;
    const dur = 1200;
    const tick = (t: number) => {
      if (!startT) startT = t;
      const p = Math.min((t - startT) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setV(score * e);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const ang = -90 + v * 1.8;
  const [nx, ny] = P(ang, R - 20);
  const cat = score < 40 ? { t: "Conservative", c: "#10b981" } : score < 70 ? { t: "Balanced", c: "#f59e0b" } : { t: "Aggressive", c: "#ef4444" };

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.4 }} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <div className="text-lg font-bold text-slate-900">{title}</div>
      <div className="text-sm text-slate-500">{hint ?? "Your portfolio's overall risk level"}</div>

      <div className="mx-auto mt-3 max-w-[300px]">
        <svg viewBox="0 0 200 118" className="w-full">
          {/* track */}
          <path d={arc(-90, 90)} stroke="#eef2f7" strokeWidth="16" fill="none" strokeLinecap="round" />
          {/* coloured zones */}
          <path d={arc(-90, -33)} stroke="#10b981" strokeWidth="16" fill="none" strokeLinecap="round" />
          <path d={arc(-29, 29)} stroke="#f59e0b" strokeWidth="16" fill="none" />
          <path d={arc(33, 90)} stroke="#ef4444" strokeWidth="16" fill="none" strokeLinecap="round" />
          {/* end labels */}
          <text x="14" y="114" fontSize="9" fontWeight="700" fill="#94a3b8">LOW</text>
          <text x="186" y="114" textAnchor="end" fontSize="9" fontWeight="700" fill="#94a3b8">HIGH</text>
          {/* needle */}
          <line x1={CX} y1={CY} x2={nx} y2={ny} stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx={CX} cy={CY} r="6.5" fill="#0f172a" />
          <circle cx={CX} cy={CY} r="2.5" fill="#fff" />
        </svg>
      </div>

      <div className="-mt-1 text-center">
        <div className="text-2xl font-extrabold" style={{ color: cat.c }}>{cat.t}</div>
        <div className="text-xs text-slate-400">risk score <span className="font-bold tabular-nums text-slate-600">{Math.round(v)}</span>/100</div>
      </div>

      <div className="mt-4 flex justify-center gap-4 text-[11px] text-slate-500">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: "#10b981" }} /> Low</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: "#f59e0b" }} /> Medium</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: "#ef4444" }} /> High</span>
      </div>
    </motion.div>
  );
}
