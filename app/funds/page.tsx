"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FUNDS, AMCS, AMC_LIST, bdtCompact, type Fund, type Amc } from "../data/amcFunds";
import { LightHeader, LightFooter, BRAND_ORANGE as ORANGE } from "../components/LightChrome";
import FundCompare from "./FundCompare";

const riskColor: Record<string, { bg: string; fg: string }> = {
  Low: { bg: "#ecfdf5", fg: "#059669" },
  Medium: { bg: "#fffbeb", fg: "#b45309" },
  High: { bg: "#fef2f2", fg: "#dc2626" },
};

export default function FundsPage() {
  const [compareIds, setCompareIds] = useState<string[]>(["ekush-first-unit-fund", "edge-amc-growth-fund"]);
  const compareRef = useRef<HTMLDivElement>(null);
  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 4) return prev;
      setTimeout(() => compareRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 40);
      return [...prev, id];
    });
  };

  return (
    <div className="min-h-screen bg-[#F7F8FB] text-slate-900" style={{ colorScheme: "light" }}>
      <LightHeader />

      {/* HERO */}
      <section className="bg-gradient-to-b from-white to-[#F7F8FB]">
        <div className="mx-auto max-w-7xl px-4 pb-6 pt-14 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold" style={{ color: ORANGE }}>
              {FUNDS.length} funds · {AMC_LIST.length} asset managers
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
              Explore <span style={{ color: ORANGE }}>mutual funds</span>
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-500">
              Every fund, organised by asset manager. Each house has its own colour — jump to one, or browse them all.
            </p>
          </motion.div>

          {/* AMC quick-nav */}
          <div className="mt-8 flex flex-wrap gap-2">
            {AMC_LIST.map((a) => (
              <a
                key={a.slug}
                href={`#amc-${a.slug}`}
                className="flex items-center gap-2 rounded-xl border px-3.5 py-1.5 text-sm font-semibold transition-colors"
                style={{ borderColor: a.color, color: a.color, background: a.soft }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/fund-logos/${a.slug}.png`} alt="" className="h-4 w-auto" />
                {a.name.split(" ")[0]}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARE */}
      <section ref={compareRef} className="mx-auto max-w-7xl scroll-mt-20 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-5">
          <h2 className="text-2xl font-bold tracking-tight">
            Compare <span style={{ color: ORANGE }}>funds</span>
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            <span className="font-semibold text-slate-700">Click any fund below</span> to add it here — then compare growth,
            returns and key metrics side by side.
          </p>
        </div>
        <FundCompare ids={compareIds} setIds={setCompareIds} />
      </section>

      {/* AMC SECTIONS */}
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        {AMC_LIST.map((a) => {
          const funds = FUNDS.filter((f) => f.amc === a.slug).sort((x, y) => (y.sinceInception ?? 0) - (x.sinceInception ?? 0));
          return <AmcSection key={a.slug} amc={a} funds={funds} compareIds={compareIds} onToggle={toggleCompare} />;
        })}

        <p className="mt-8 text-xs leading-relaxed text-slate-400">
          Core figures (NAV, returns, AUM, fees, inception) are sourced from the AMCs&apos; own websites and the LankaBD
          open-end fund review, July 2026. Asset-allocation, sector and top-holding breakdowns are representative
          illustrations — official figures are published in each fund&apos;s monthly factsheet.
        </p>
      </div>

      <LightFooter />
    </div>
  );
}

function AmcSection({ amc, funds, compareIds, onToggle }: { amc: Amc; funds: Fund[]; compareIds: string[]; onToggle: (id: string) => void }) {
  return (
    <section id={`amc-${amc.slug}`} className="scroll-mt-20 py-8">
      {/* themed band header */}
      <div
        className="overflow-hidden rounded-3xl p-6 sm:p-7"
        style={{ background: amc.soft, borderLeft: `6px solid ${amc.color}` }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white p-2 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/fund-logos/${amc.slug}.png`} alt="" className="max-h-full max-w-full object-contain" />
            </span>
            <div>
              <h2 className="text-2xl font-bold tracking-tight" style={{ color: amc.color }}>
                {amc.name}
              </h2>
              <div className="text-sm text-slate-500">
                {amc.since} · {funds.length} fund{funds.length > 1 ? "s" : ""}
              </div>
            </div>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-slate-600">{amc.philosophy}</p>
        </div>
      </div>

      {/* fund cards in this AMC's colour */}
      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {funds.map((f, i) => (
          <FundCard
            key={f.id}
            fund={f}
            amc={amc}
            index={i}
            selected={compareIds.includes(f.id)}
            disabled={!compareIds.includes(f.id) && compareIds.length >= 4}
            onToggle={() => onToggle(f.id)}
          />
        ))}
      </div>
    </section>
  );
}

function FundCard({
  fund,
  amc,
  index,
  selected,
  disabled,
  onToggle,
}: {
  fund: Fund;
  amc: Amc;
  index: number;
  selected: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  const risk = riskColor[fund.risk];
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.35, delay: (index % 3) * 0.05 }}
      whileHover={{ y: -4 }}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => !disabled && onToggle()}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && !disabled && onToggle()}
        aria-pressed={selected}
        className={`relative flex h-full flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 transition-all ${
          disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:shadow-lg"
        }`}
        style={{ borderTop: `4px solid ${amc.color}`, ...(selected ? { boxShadow: `0 0 0 2px ${amc.color}` } : {}) }}
      >
        {selected && (
          <span className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full text-xs font-bold text-white shadow" style={{ background: amc.color }}>
            ✓
          </span>
        )}

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate font-semibold leading-tight text-slate-900">{fund.name}</div>
            <div className="font-mono text-xs text-slate-400">{fund.ticker}</div>
          </div>
          {fund.shariah && (
            <span className="shrink-0 rounded-md bg-violet-50 px-2 py-0.5 text-[10px] font-bold text-violet-700">SHARIAH</span>
          )}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span className="rounded-md px-2 py-0.5 text-xs font-semibold text-white" style={{ background: amc.color }}>
            {fund.type}
          </span>
          <span className="rounded-md px-2 py-0.5 text-xs font-semibold" style={{ background: risk.bg, color: risk.fg }}>
            {fund.risk} risk
          </span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 text-center">
          <Stat label="NAV" value={fund.nav.toFixed(2)} />
          <Stat label="Since incep." value={fund.sinceInception != null ? `+${fund.sinceInception.toFixed(0)}%` : "—"} color="#059669" />
          <Stat label="AUM" value={fund.aum != null ? bdtCompact(fund.aum) : "—"} small />
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-sm">
          <span
            className="font-semibold"
            style={{ color: selected ? amc.color : disabled ? "#94a3b8" : "#334155" }}
          >
            {selected ? "✓ Comparing" : disabled ? "Compare full (4)" : "＋ Compare"}
          </span>
          <Link
            href={`/funds/${fund.id}`}
            onClick={(e) => e.stopPropagation()}
            className="text-slate-400 hover:text-slate-700"
          >
            View fund →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function Stat({ label, value, color, small }: { label: string; value: string; color?: string; small?: boolean }) {
  return (
    <div>
      <div className={`font-bold tabular-nums ${small ? "text-sm" : "text-base"}`} style={{ color: color ?? "#0f172a" }}>
        {value}
      </div>
      <div className="mt-0.5 text-[10px] uppercase tracking-wide text-slate-400">{label}</div>
    </div>
  );
}
