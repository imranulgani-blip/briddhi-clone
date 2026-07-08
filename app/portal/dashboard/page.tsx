"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePortal } from "../lib/PortalContext";
import { useFetch } from "../lib/useFetch";
import { bdt, fmtDate, naOr, pct } from "../lib/format";
import type { PortfolioPayload } from "../lib/types";
import PerfChart from "../components/PerfChart";
import HoldingsTable from "../components/HoldingsTable";
import { PALETTE, amcColor, amcLogo, riskColorHex } from "../components/AllocationDonut";
import { Panel, KpiTile, MiniColumns, MiniBars, GaugeRow, SpiralChart, MiniArea, IconCoins, IconWallet, IconTrend, IconGauge } from "../components/bi";
import RiskMeter from "../components/RiskMeter";

const PERIODS = ["1M", "3M", "6M", "1Y", "ALL"] as const;
const PINKS = ["#db2777", "#ec4899", "#f472b6", "#be185d", "#f9a8d4", "#e879f9"];
const GREENS = ["#12A150", "#16a34a", "#22c55e", "#4ade80", "#15803d", "#86efac"];
const RISK_ORDER = ["#ef4444", "#f59e0b", "#10b981", "#64748b"];

export default function DashboardPage() {
  const { investor } = usePortal();
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>("ALL");
  const url = investor ? `/api/portfolio/${investor.id}?period=${period}` : null;
  const { data, loading, error } = useFetch<PortfolioPayload>(url);

  const perAmc = useMemo(() => {
    if (!data) return [] as { name: string; invested: number; value: number; funds: number; gainPct: number; share: number }[];
    const m = new Map<string, { invested: number; value: number; funds: number }>();
    for (const h of data.holdings) {
      const cur = m.get(h.amc) ?? { invested: 0, value: 0, funds: 0 };
      cur.invested += h.invested;
      cur.value += h.marketValue ?? h.invested;
      cur.funds += 1;
      m.set(h.amc, cur);
    }
    const totalInv = [...m.values()].reduce((s, v) => s + v.invested, 0) || 1;
    return [...m.entries()]
      .map(([name, v]) => ({ name, ...v, gainPct: v.invested ? ((v.value - v.invested) / v.invested) * 100 : 0, share: (v.invested / totalInv) * 100 }))
      .sort((a, b) => b.value - a.value);
  }, [data]);

  if (!investor) return null;
  if (error) {
    return (
      <div className="lcard border-amber-200 bg-amber-50 p-6 text-sm text-amber-700">
        <div className="font-semibold">Couldn&apos;t load the portfolio.</div>
        <p className="mt-1 text-amber-600">{error}</p>
        <p className="mt-2 text-slate-500">
          Confirm Supabase is configured and seeded (<code className="mono">node scripts/seed.mjs</code>).
        </p>
      </div>
    );
  }
  if (loading || !data) return <div className="text-slate-500">Loading portfolio…</div>;

  const { kpis, holdings, allocations, activity, performance, asOf } = data;
  const perfPoints = performance.filter((p) => p.date >= activity.from);
  const gain = kpis.netGainLoss;
  const up = gain != null && gain >= 0;

  const topFunds = allocations.byFund.slice(0, 6);
  const gaugeSlices = (allocations.byAssetClass && allocations.byAssetClass.length ? allocations.byAssetClass : allocations.byFund).slice(0, 4);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            <span className="text-[#F5821E]">Portfolio</span> Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            {investor.name} · <span className="mono">{investor.id}</span>
          </p>
        </div>
        <div className="text-right text-xs text-slate-500">
          As of <span className="text-slate-800">{fmtDate(asOf)}</span>
          <div className="mt-1 flex gap-2">
            <Chip>{data.fundCount} funds</Chip>
            <Chip>{data.amcCount} AMCs</Chip>
            <Chip>{data.txnCount} orders</Chip>
          </div>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiTile icon={<IconCoins />} accent="#F5821E" label="Net invested" value={bdt(kpis.netInvested)} />
        <KpiTile icon={<IconWallet />} accent="#0E50A0" label="Current value" value={naOr(kpis.currentValue, bdt)} tone={kpis.currentValue == null ? "default" : "default"} />
        <KpiTile
          icon={<IconTrend />}
          accent="#12A150"
          label="Net gain / loss"
          value={gain == null ? "N/A" : bdt(gain)}
          sub={gain == null ? undefined : `(${pct(kpis.netGainLossPct ?? 0, true)})`}
          tone={gain == null ? "default" : up ? "pos" : "neg"}
        />
        <KpiTile icon={<IconGauge />} accent="#7c3aed" label="Annualised (XIRR)" value={naOr(kpis.xirrPct, (v) => pct(v, true))} tone={kpis.xirrPct == null ? "default" : kpis.xirrPct >= 0 ? "pos" : "neg"} />
      </div>

      {/* Main grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* LEFT (2 cols) */}
        <div className="space-y-4 lg:col-span-2">
          <Panel title="Portfolio" accent="#db2777" soft="#fdf2f8" sub="by fund · invested">
            <MiniColumns slices={topFunds} colors={PINKS} />
          </Panel>

          <div className="grid gap-4 sm:grid-cols-2">
            <RiskMeter slices={allocations.byRisk} />
            <Panel title="Risk mix" accent="#7c3aed" soft="#f5f3ff" sub="by risk profile">
              <SpiralChart slices={allocations.byRisk} colors={allocations.byRisk.map((s) => riskColorHex(s.label))} />
            </Panel>
          </div>

          <Panel title="Allocation" accent="#F5821E" soft="#fff7ed" sub="by AMC">
            <MiniBars slices={allocations.byAmc} colors={allocations.byAmc.map((s, i) => amcColor(s.label, i))} logos={allocations.byAmc.map((s) => amcLogo(s.label))} />
          </Panel>
        </div>

        {/* RIGHT (1 col) */}
        <div className="space-y-4">
          {/* Performance — solid blue panel */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0E50A0] to-[#2563eb] p-5 text-white shadow-sm ring-1 ring-black/5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold sm:text-xl">Performance</h3>
              <span className="text-[11px] font-semibold uppercase tracking-wide text-white/60">invested over time</span>
            </div>
            <div className="mt-2">
              <div className="text-3xl font-extrabold tabular-nums">{naOr(kpis.currentValue, bdt)}</div>
              <div className="text-xs font-semibold text-white/70">current value{kpis.netGainLossPct != null ? ` · ${pct(kpis.netGainLossPct, true)}` : ""}</div>
            </div>
            <div className="mt-3">
              <MiniArea values={perfPoints.map((p) => p.invested)} />
            </div>
          </div>

          <Panel title="Fund type" accent="#0d9488" soft="#f0fdfa" sub="share of portfolio">
            <GaugeRow slices={gaugeSlices} colors={["#0d9488", "#0891b2", "#7c3aed", "#F5821E"]} />
          </Panel>

          <div className="grid grid-cols-2 gap-4">
            <Panel title="Type" accent="#0E50A0" soft="#eff6ff" sub="SIP · lump">
              <MiniColumns slices={allocations.byType} colors={["#0E50A0", "#0ea5e9", "#38bdf8"]} height={110} showValue={false} />
            </Panel>
            <Panel title="Risk" accent="#12A150" soft="#f0fdf4" sub="exposure">
              <MiniColumns slices={allocations.byRisk} colors={RISK_ORDER} height={110} showValue={false} />
            </Panel>
          </div>
        </div>
      </div>

      {/* Individual AMCs — per-manager performance cards */}
      <div>
        <div className="mb-3">
          <h2 className="text-xl font-extrabold tracking-tight">Individual AMCs</h2>
          <p className="text-sm text-slate-500">How each asset manager is performing for you.</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {perAmc.map((a, i) => {
            const logo = amcLogo(a.name);
            const color = amcColor(a.name, i);
            const up = a.gainPct >= 0;
            const gainCol = up ? "#059669" : "#e11d48";
            return (
              <motion.div
                key={a.name}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link
                  href={`/portal/amc/${encodeURIComponent(a.name)}`}
                  className="group block rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 transition-all hover:-translate-y-0.5 hover:shadow-md hover:ring-slate-200"
                >
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl bg-slate-50 p-1.5 ring-1 ring-slate-100">
                    {logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={logo} alt={a.name} className="max-h-full max-w-full object-contain" />
                    ) : (
                      <span className="text-sm font-bold" style={{ color }}>{a.name.slice(0, 2).toUpperCase()}</span>
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-bold text-slate-900">{a.name}</div>
                    <div className="text-[11px] text-slate-400">{a.funds} fund{a.funds > 1 ? "s" : ""} · {a.share.toFixed(1)}% of portfolio</div>
                  </div>
                  <span className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold" style={{ background: `${gainCol}1a`, color: gainCol }}>
                    {up ? "▲" : "▼"} {Math.abs(a.gainPct).toFixed(1)}%
                  </span>
                </div>
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-wide text-slate-400">Current value</div>
                    <div className="text-lg font-extrabold tabular-nums text-slate-900">{bdt(a.value)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-wide text-slate-400">Invested</div>
                    <div className="text-sm font-semibold tabular-nums text-slate-500">{bdt(a.invested)}</div>
                  </div>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                  <motion.div className="h-full rounded-full" style={{ background: color }} initial={{ width: 0 }} whileInView={{ width: `${a.share}%` }} viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.05, ease: "easeOut" }} />
                </div>
                <div className="mt-3 flex items-center justify-end text-[11px] font-semibold text-slate-400 transition-colors group-hover:text-[#F5821E]">View report →</div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Holdings — second to last */}
      <Panel title="Holdings" accent="#0f172a" soft="#ffffff" sub="every fund · every AMC" right={<Link href="/portal/allocation" className="text-sm font-semibold" style={{ color: "#F5821E" }}>Open Wealth Universe →</Link>}>
        <HoldingsTable holdings={holdings} investorId={investor.id} />
      </Panel>

      {/* Performance over time — full width, last */}
      <Panel
        title="Performance over time"
        accent="#0E50A0"
        soft="#ffffff"
        right={
          <div className="no-print flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
            {PERIODS.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`rounded-md px-2.5 py-1 text-xs ${period === p ? "bg-slate-200 text-[#F5821E]" : "text-slate-500 hover:text-slate-800"}`}
              >
                {p}
              </button>
            ))}
          </div>
        }
      >
        <PerfChart points={perfPoints} showValue={data.navAvailable} />
      </Panel>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-600">{children}</span>;
}
