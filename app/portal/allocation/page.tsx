"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { usePortal } from "../lib/PortalContext";
import { useFetch } from "../lib/useFetch";
import { bdt } from "../lib/format";
import type { PortfolioPayload, AllocationSlice } from "../lib/types";
import { PALETTE, amcColor, amcLogo } from "../components/AllocationDonut";
import { Panel, MiniBars, PieChart } from "../components/bi";
import BangladeshMap from "../components/BangladeshMap";
import RiskMeter from "../components/RiskMeter";

interface AmcAgg {
  name: string;
  invested: number;
  value: number;
  gainPct: number;
}

// Deterministic starfield (module-level so SSR and client render identically).
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const STAR_RNG = mulberry32(0x5eed);
const STARS = Array.from({ length: 90 }, () => ({
  x: STAR_RNG() * 100,
  y: STAR_RNG() * 100,
  s: 0.6 + STAR_RNG() * 2, // px
  o: 0.25 + STAR_RNG() * 0.7,
  d: STAR_RNG() * 4, // twinkle delay (s)
  dur: 2 + STAR_RNG() * 3, // twinkle duration (s)
}));

function SpaceBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* nebula glows */}
      <div className="absolute -left-20 -top-16 h-72 w-72 rounded-full" style={{ background: "rgba(124,58,237,0.35)", filter: "blur(80px)" }} />
      <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full" style={{ background: "rgba(14,80,160,0.45)", filter: "blur(90px)" }} />
      <div className="absolute -bottom-20 left-1/3 h-64 w-64 rounded-full" style={{ background: "rgba(236,72,153,0.22)", filter: "blur(80px)" }} />
      <div className="absolute bottom-10 right-1/4 h-40 w-40 rounded-full" style={{ background: "rgba(56,189,248,0.25)", filter: "blur(70px)" }} />
      {/* stars */}
      {STARS.map((st, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white"
          style={{ left: `${st.x}%`, top: `${st.y}%`, width: st.s, height: st.s, opacity: st.o, animation: `twinkle ${st.dur}s ease-in-out ${st.d}s infinite` }}
        />
      ))}
      {/* shooting star — crosses once every ~10s */}
      <span className="shooting-star" style={{ top: "8%", left: "-12%" }} />
    </div>
  );
}

export default function AllocationPage() {
  const { investor } = usePortal();
  const url = investor ? `/api/portfolio/${investor.id}` : null;
  const { data, loading, error } = useFetch<PortfolioPayload>(url);

  const perAmc: AmcAgg[] = useMemo(() => {
    if (!data) return [];
    const m = new Map<string, { invested: number; value: number }>();
    for (const h of data.holdings) {
      const cur = m.get(h.amc) ?? { invested: 0, value: 0 };
      cur.invested += h.invested;
      cur.value += h.marketValue ?? h.invested;
      m.set(h.amc, cur);
    }
    return [...m.entries()]
      .map(([name, v]) => ({ name, invested: v.invested, value: v.value, gainPct: v.invested ? ((v.value - v.invested) / v.invested) * 100 : 0 }))
      .sort((a, b) => b.value - a.value);
  }, [data]);

  if (!investor) return null;
  if (error) return <div className="lcard border-amber-200 bg-amber-50 p-6 text-amber-700">{error}</div>;
  if (loading || !data) return <div className="text-slate-500">Mapping your money…</div>;

  const { allocations: a, kpis } = data;
  const cur = kpis.currentValue ?? kpis.netInvested;
  const gainPct = kpis.netGainLossPct ?? 0;
  const gain = kpis.netGainLoss ?? 0;
  const up = gain >= 0;

  return (
    <div className="space-y-8">
      {/* HERO — money map in space */}
      <div className="relative overflow-hidden rounded-3xl p-6 text-white sm:p-8" style={{ background: "radial-gradient(120% 120% at 70% 30%, #0b1836 0%, #060a1b 55%, #03040c 100%)" }}>
        <SpaceBackdrop />
        <div className="relative grid items-center gap-8 lg:grid-cols-2">
          {/* left — headline + growth tiles */}
          <div>
            <div className="text-sm text-white/60">Where your money works</div>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight">Your Wealth Universe</h1>
            <p className="mt-2 max-w-md text-sm text-white/70">
              Every taka you&apos;ve invested — spread across asset managers, fund types and sectors, and whether it&apos;s
              growing.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <GrowthTile label="Invested" value={bdt(kpis.netInvested)} />
              <GrowthTile label="Current value" value={bdt(cur)} />
              <GrowthTile label="Gain / Loss" value={`${up ? "+" : ""}${bdt(gain)}`} tone={up ? "up" : "down"} sub={`${up ? "▲" : "▼"} ${Math.abs(gainPct).toFixed(2)}%`} />
              <GrowthTile label="Annualised (XIRR)" value={kpis.xirrPct != null ? `${kpis.xirrPct.toFixed(1)}%` : "—"} tone={kpis.xirrPct && kpis.xirrPct >= 0 ? "up" : undefined} />
            </div>
          </div>

          {/* right — orbit */}
          <OrbitMap amcs={perAmc} currentValue={cur} gainPct={gainPct} />
        </div>
      </div>

      {/* COLORFUL PANELS */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="By fund type" accent="#12A150" soft="#f0fdf4" sub="growth · balanced · fixed · shariah">
          <PieChart slices={a.bySector ?? a.byAssetClass} colors={(a.bySector ?? a.byAssetClass ?? []).map((s) => fundTypeColor(s.label))} naNote="Fund-type data isn't populated yet." />
        </Panel>

        <Panel title="By asset manager" accent="#F5821E" soft="#fff7ed" sub="which house runs it">
          <MiniBars slices={a.byAmc} colors={a.byAmc.map((s, i) => amcColor(s.label, i))} logos={a.byAmc.map((s) => amcLogo(s.label))} />
        </Panel>

        <RiskMeter hint="How aggressive your mix is" slices={a.byRisk} />
      </div>

      {/* BY FUND */}
      <Panel title="Every fund your money is in" accent="#0E50A0" soft="#eff6ff" sub="share of total invested — largest first">
        <div className="space-y-3">
          {a.byFund.map((s, i) => (
            <RankedBar key={s.label} slice={s} color={PALETTE[i % PALETTE.length]} index={i} max={a.byFund[0]?.pct ?? 100} />
          ))}
        </div>
      </Panel>
    </div>
  );
}

// Colour a fund type by its category keyword (growth/balanced/fixed/shariah…).
function fundTypeColor(label: string) {
  const l = (label ?? "").toLowerCase();
  if (l.includes("shariah") || l.includes("islamic")) return "#7c3aed"; // violet
  if (l.includes("fixed") || l.includes("debt") || l.includes("income") || l.includes("money") || l.includes("bond")) return "#f59e0b"; // amber
  if (l.includes("balanced") || l.includes("hybrid")) return "#0ea5e9"; // blue
  if (l.includes("emerging")) return "#84cc16"; // lime
  if (l.includes("growth")) return "#16a34a"; // green
  if (l.includes("equity")) return "#12A150"; // brand green
  return "#64748b"; // slate
}

// ---------------------------------------------------------------------------
// Orbital visual: outer ring (clockwise) carries AMC logos, inner ring
// (anti-clockwise) carries money coins; centre shows live current value + gain.
function OrbitMap({ amcs, currentValue, gainPct }: { amcs: AmcAgg[]; currentValue: number; gainPct: number }) {
  const up = gainPct >= 0;
  const coins = Array.from({ length: 8 });
  // Size each AMC bubble by how much money is invested in it (bigger = more invested).
  const maxInv = Math.max(...amcs.map((a) => a.invested), 1);
  const minInv = Math.min(...amcs.map((a) => a.invested), 0);
  const bubbleSize = (inv: number) => {
    const t = maxInv === minInv ? 0.5 : (inv - minInv) / (maxInv - minInv);
    return Math.round(38 + t * 46); // 38px (smallest) … 84px (largest)
  };
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[440px]">
      {/* faint base rings */}
      {[54, 84].map((s) => (
        <div key={s} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" style={{ width: `${s}%`, height: `${s}%` }} />
      ))}

      {/* outer ring — clockwise, AMC logos */}
      <motion.div className="absolute inset-0" animate={{ rotate: 360 }} transition={{ duration: 85, ease: "linear", repeat: Infinity }}>
        <div className="absolute left-1/2 top-1/2 h-[84%] w-[84%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/15" />
        {amcs.map((amc, i) => {
          const ang = (i / amcs.length) * 2 * Math.PI - Math.PI / 2;
          const x = 50 + 42 * Math.cos(ang);
          const y = 50 + 42 * Math.sin(ang);
          const size = bubbleSize(amc.invested);
          return (
            <div key={amc.name} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${x}%`, top: `${y}%` }}>
              <motion.div animate={{ rotate: -360 }} transition={{ duration: 85, ease: "linear", repeat: Infinity }} className="flex flex-col items-center">
                <span
                  className="grid place-items-center rounded-full bg-white ring-1 ring-white/50"
                  style={{ width: size, height: size, padding: Math.round(size * 0.14), boxShadow: "0 10px 26px rgba(0,0,0,0.5), 0 0 22px 2px rgba(125,211,252,0.3)" }}
                  title={`${amc.name} · ${bdt(amc.invested)} invested`}
                >
                  <AmcMark name={amc.name} />
                </span>
                <span className="mt-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold text-white" style={{ background: amc.gainPct >= 0 ? "#059669" : "#e11d48" }}>
                  {amc.gainPct >= 0 ? "▲" : "▼"} {Math.abs(amc.gainPct).toFixed(1)}%
                </span>
              </motion.div>
            </div>
          );
        })}
      </motion.div>

      {/* inner ring — anti-clockwise, coins */}
      <motion.div className="absolute inset-0" animate={{ rotate: -360 }} transition={{ duration: 110, ease: "linear", repeat: Infinity }}>
        <div className="absolute left-1/2 top-1/2 h-[67%] w-[67%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/10" />
        {coins.map((_, i) => {
          const ang = (i / coins.length) * 2 * Math.PI;
          const x = 50 + 33.5 * Math.cos(ang);
          const y = 50 + 33.5 * Math.sin(ang);
          return (
            <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${x}%`, top: `${y}%` }}>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 110, ease: "linear", repeat: Infinity }}
                className="grid h-5 w-5 place-items-center rounded-full text-[9px] font-bold text-white shadow"
                style={{ background: i % 2 ? "#f5a623" : "#F5821E" }}
              >
                ৳
              </motion.span>
            </div>
          );
        })}
      </motion.div>

      {/* centre — real spinning Earth at night (true centre; wrapper handles
          centering so framer's scale transform can't override the translate) */}
      <div className="absolute left-1/2 top-1/2 h-[54%] w-[54%] -translate-x-1/2 -translate-y-1/2">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 160, damping: 16 }}
          className="relative h-full w-full overflow-hidden rounded-full"
          style={{ boxShadow: "0 0 60px 16px rgba(34,211,238,0.4), 0 0 0 1px rgba(34,211,238,0.45)" }}
        >
          {/* scrolling equirectangular night texture = axial rotation (brightened);
              carries the blinking Bangladesh markers so they track the rotation */}
          <motion.div
            className="absolute inset-0"
            style={{ backgroundImage: "url(/earth-night.jpg)", backgroundRepeat: "no-repeat", backgroundSize: "210%", backgroundPosition: "74% 34%", filter: "brightness(1.7) saturate(1.25) contrast(1.05)" }}
            initial={{ scale: 1.04 }}
            animate={{ scale: [1.04, 1.08, 1.04] }}
            transition={{ duration: 24, ease: "easeInOut", repeat: Infinity }}
          />
          {/* soft blue daylight wash so the globe isn't too dark */}
          <div className="pointer-events-none absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle at 34% 30%, rgba(125,211,252,0.35) 0%, rgba(59,130,246,0.12) 45%, rgba(0,0,0,0) 70%)", mixBlendMode: "screen" }} />
          {/* gentle spherical shading + cyan atmosphere rim */}
          <div
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              background: "radial-gradient(circle at 30% 26%, rgba(255,255,255,0.22) 0%, rgba(0,0,0,0) 40%), radial-gradient(circle at 80% 86%, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0) 66%)",
              boxShadow: "inset 0 0 30px rgba(34,211,238,0.5), inset -8px -10px 24px rgba(0,0,0,0.4)",
            }}
          />
          {/* Bangladesh — subtle drawn outline with a blinking border, on the zoomed region */}
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <BangladeshMap className="h-[46%] w-[46%] drop-shadow-[0_0_8px_rgba(74,222,128,0.55)]" />
          </div>
          {/* current value — fixed in the middle of the Earth */}
          <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center text-center">
            <div className="px-2">
              <div className="text-[10px] uppercase tracking-wide text-white/70 drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)]">Current value</div>
              <div className="text-lg font-extrabold text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.98)] sm:text-2xl">{bdt(currentValue)}</div>
              <div className="text-xs font-bold drop-shadow-[0_1px_5px_rgba(0,0,0,0.98)]" style={{ color: up ? "#86efac" : "#fecaca" }}>
                {up ? "▲" : "▼"} {Math.abs(gainPct).toFixed(2)}%
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function AmcMark({ name }: { name: string }) {
  const logo = amcLogo(name);
  if (logo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={logo} alt={name} className="max-h-full max-w-full object-contain" />;
  }
  return <span className="text-xs font-bold text-slate-700">{name.slice(0, 2).toUpperCase()}</span>;
}

// ---------------------------------------------------------------------------
function GrowthTile({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone?: "up" | "down" }) {
  const color = tone === "up" ? "#4ade80" : tone === "down" ? "#fb7185" : "#ffffff";
  return (
    <div className="rounded-2xl bg-white/10 p-3 backdrop-blur">
      <div className="text-[11px] uppercase tracking-wide text-white/50">{label}</div>
      <div className="mt-0.5 text-lg font-bold" style={{ color }}>{value}</div>
      {sub && <div className="text-xs font-semibold" style={{ color }}>{sub}</div>}
    </div>
  );
}

function RankedBar({ slice, color, index, max }: { slice: AllocationSlice; color: string; index: number; max: number }) {
  return (
    <motion.div initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }}>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="flex min-w-0 items-center gap-2">
          <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: color }} />
          <span className="truncate font-medium text-slate-800">{slice.label}</span>
        </span>
        <span className="shrink-0 tabular-nums">
          <span className="font-bold text-slate-900">{slice.pct.toFixed(1)}%</span>
          <span className="ml-2 text-xs text-slate-400">{bdt(slice.value)}</span>
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
        <motion.div className="h-full rounded-full" style={{ background: color }} initial={{ width: 0 }} whileInView={{ width: `${(slice.pct / (max || 100)) * 100}%` }} viewport={{ once: true }} transition={{ duration: 0.8, delay: index * 0.05, ease: "easeOut" }} />
      </div>
    </motion.div>
  );
}
