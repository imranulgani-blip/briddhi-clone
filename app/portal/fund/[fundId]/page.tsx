"use client";

import Link from "next/link";
import { use, useMemo } from "react";
import { usePortal } from "../../lib/PortalContext";
import { useFetch } from "../../lib/useFetch";
import { bdt, fmtDate, pct } from "../../lib/format";
import type { Fund, Holding, Transaction } from "../../lib/types";
import { Panel, KpiTile, MiniArea, MiniBars, GaugeRow, IconCoins, IconWallet, IconTrend, IconGauge } from "../../components/bi";

interface FundPayload {
  fund: Fund;
  holding: Holding | null;
  transactions: Transaction[];
  asOf: string;
}

// Deterministic PRNG so the illustrative figures are stable for a given fund.
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function FundDrillPage({ params }: { params: Promise<{ fundId: string }> }) {
  const { fundId } = use(params);
  const { investor } = usePortal();
  const url = investor ? `/api/funds/${fundId}?investorId=${investor.id}` : null;
  const { data, loading, error } = useFetch<FundPayload>(url);

  const sim = useMemo(() => {
    if (!data?.holding) return null;
    const h = data.holding;
    const invested = h.invested;
    const rng = mulberry32((parseInt(fundId, 10) || 1) * 2654435761);
    const cagr = 0.08 + rng() * 0.14; // 8%–22% annualised (illustrative)
    const divYield = 0.01 + rng() * 0.05; // 1%–6% p.a.
    const avgCost = 10 + rng() * 40; // avg purchase NAV per unit

    const start = new Date(h.firstDate).getTime();
    const end = new Date(data.asOf).getTime();
    const years = Math.max((end - start) / (365.25 * 864e5) || 0, 0.5);

    const growth = Math.pow(1 + cagr, years);
    const currentNav = avgCost * growth;
    const units = invested / avgCost;
    const marketValue = units * currentNav; // = invested * growth
    const capitalGain = marketValue - invested;
    const dividend = invested * divYield * years; // cumulative payout
    const totalGain = capitalGain + dividend;

    const months = Math.min(Math.max(Math.round(years * 12), 6), 60);
    const nav: number[] = [];
    for (let i = 0; i <= months; i++) {
      const t = i / months;
      const wobble = 1 + (rng() - 0.5) * 0.06;
      nav.push(avgCost * Math.pow(1 + cagr, years * t) * wobble);
    }
    nav[nav.length - 1] = currentNav;

    return {
      invested,
      avgCost,
      units,
      currentNav,
      marketValue,
      capitalGain,
      dividend,
      totalGain,
      cagrPct: cagr * 100,
      divYieldPct: divYield * 100,
      capReturnPct: (capitalGain / invested) * 100,
      divReturnPct: (dividend / invested) * 100,
      totalReturnPct: (totalGain / invested) * 100,
      years,
      nav,
    };
  }, [data, fundId]);

  if (!investor) return null;
  if (error) return <div className="lcard border-amber-200 bg-amber-50 p-6 text-amber-700">{error}</div>;
  if (loading || !data) return <div className="text-slate-500">Loading fund…</div>;

  const { fund, holding, transactions, asOf } = data;
  const up = (sim?.totalGain ?? 0) >= 0;

  const buildTotal = sim ? sim.invested + sim.totalGain : 1;
  const buildup = sim
    ? [
        { label: "Invested", value: sim.invested, pct: (sim.invested / buildTotal) * 100 },
        { label: "Capital gain", value: sim.capitalGain, pct: (sim.capitalGain / buildTotal) * 100 },
        { label: "Dividends", value: sim.dividend, pct: (sim.dividend / buildTotal) * 100 },
      ]
    : [];
  const returnGauges = sim
    ? [
        { label: "Capital", value: sim.capitalGain, pct: sim.capReturnPct },
        { label: "Dividend", value: sim.dividend, pct: sim.divReturnPct },
        { label: "Total", value: sim.totalGain, pct: sim.totalReturnPct },
      ]
    : [];

  return (
    <div className="space-y-5">
      <Link href="/portal/dashboard" className="text-sm text-[#F5821E] hover:text-[#e0761a]">
        ← Back to dashboard
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="rounded-full border border-slate-200 px-2 py-0.5">{fund.amc}</span>
            {holding?.riskProfile && <span className="rounded-full border border-slate-200 px-2 py-0.5">{holding.riskProfile}</span>}
            <span className="rounded-full bg-amber-100 px-2 py-0.5 font-semibold text-amber-700">Illustrative figures</span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight">{fund.name}</h1>
          <p className="text-sm text-slate-500">Fund analytics · as of {fmtDate(asOf)}</p>
        </div>
      </div>

      {/* KPI strip — the requested metrics (roomy 3-up rows) */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <KpiTile icon={<IconCoins />} accent="#F5821E" label="Invested" value={bdt(sim?.invested ?? holding?.invested ?? 0)} />
        <KpiTile icon={<IconWallet />} accent="#0E50A0" label="Market value" value={sim ? bdt(sim.marketValue) : "—"} />
        <KpiTile icon={<IconTrend />} accent="#12A150" label="Gain / loss" value={sim ? bdt(sim.capitalGain + sim.dividend) : "—"} sub={sim ? `(${pct(sim.totalReturnPct, true)})` : undefined} tone={up ? "pos" : "neg"} />
        <KpiTile icon={<IconGauge />} accent="#7c3aed" label="CAGR" value={sim ? pct(sim.cagrPct, true) : "—"} tone={sim && sim.cagrPct >= 0 ? "pos" : "neg"} />
        <KpiTile icon={<IconCoins />} accent="#0891b2" label="Avg cost / unit" value={sim ? `৳${sim.avgCost.toFixed(2)}` : "—"} />
        <KpiTile icon={<IconTrend />} accent="#db2777" label="Dividend return" value={sim ? pct(sim.divReturnPct, true) : "—"} sub={sim ? `${sim.divYieldPct.toFixed(1)}% p.a.` : undefined} tone="pos" />
      </div>

      {/* Main grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {/* NAV growth — solid blue panel */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0E50A0] to-[#2563eb] p-5 text-white shadow-sm ring-1 ring-black/5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold sm:text-xl">NAV growth</h3>
              <span className="text-[11px] font-semibold uppercase tracking-wide text-white/60">{sim ? `${sim.years.toFixed(1)} yr holding` : ""}</span>
            </div>
            <div className="mt-2 flex items-end justify-between">
              <div>
                <div className="text-3xl font-extrabold tabular-nums">{sim ? `৳${sim.currentNav.toFixed(2)}` : "—"}</div>
                <div className="text-xs font-semibold text-white/70">current NAV · from ৳{sim?.avgCost.toFixed(2)} avg cost</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold" style={{ color: up ? "#86efac" : "#fca5a5" }}>{sim ? pct(sim.capReturnPct, true) : "—"}</div>
                <div className="text-[11px] text-white/60">price return</div>
              </div>
            </div>
            <div className="mt-3">{sim && <MiniArea values={sim.nav} height={110} />}</div>
          </div>

          {/* Value build-up */}
          <Panel title="How your value is made up" accent="#12A150" soft="#f0fdf4" sub="invested · gain · dividends">
            <MiniBars slices={buildup} colors={["#94a3b8", "#12A150", "#F5821E"]} />
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <Stat label="Total value" value={sim ? bdt(sim.marketValue + sim.dividend) : "—"} />
              <Stat label="Units held" value={sim ? sim.units.toFixed(3) : "—"} />
              <Stat label="Cumulative dividend" value={sim ? bdt(sim.dividend) : "—"} />
            </div>
          </Panel>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <Panel title="Return mix" accent="#7c3aed" soft="#f5f3ff" sub="on invested capital">
            <GaugeRow slices={returnGauges} colors={["#0E50A0", "#db2777", "#12A150"]} />
          </Panel>
          <Panel title="At a glance" accent="#0d9488" soft="#f0fdfa">
            <ul className="space-y-2 text-sm">
              <Row label="Cost average / unit" value={sim ? `৳${sim.avgCost.toFixed(2)}` : "—"} />
              <Row label="Current NAV" value={sim ? `৳${sim.currentNav.toFixed(2)}` : "—"} />
              <Row label="CAGR" value={sim ? pct(sim.cagrPct, true) : "—"} pos />
              <Row label="Market value" value={sim ? bdt(sim.marketValue) : "—"} />
              <Row label="Gain / loss" value={sim ? bdt(sim.capitalGain + sim.dividend) : "—"} pos={up} />
              <Row label="Dividend return" value={sim ? pct(sim.divReturnPct, true) : "—"} pos />
            </ul>
          </Panel>
        </div>
      </div>

      {/* Transactions (real) */}
      <Panel title="Your transactions in this fund" accent="#0f172a" soft="#ffffff" sub="actual orders">
        <div className="overflow-x-auto">
          <table className="data w-full min-w-[560px] text-sm">
            <thead>
              <tr className="text-left">
                <th>Date</th>
                <th>Type</th>
                <th className="text-right">Amount</th>
                <th className="text-right">Unit price</th>
                <th className="text-right">Units</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td className="text-slate-800">{fmtDate(t.txn_date)}</td>
                  <td className="text-slate-600">{t.type}</td>
                  <td className="text-right mono text-slate-900">{bdt(t.amount)}</td>
                  <td className="text-right mono text-slate-500">{t.unit_price != null ? t.unit_price.toFixed(3) : sim ? sim.avgCost.toFixed(3) : "N/A"}</td>
                  <td className="text-right mono text-slate-500">{t.units != null ? t.units.toFixed(3) : sim ? (t.amount / sim.avgCost).toFixed(3) : "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="rounded-2xl bg-amber-50 p-4 text-xs leading-relaxed text-amber-700 ring-1 ring-amber-100">
        <strong>Illustrative:</strong> NAV, CAGR, market value, gain/loss and dividend return on this page are simulated from your real
        invested amount and holding period (stable per fund) to demonstrate the analytics. They are <em>not</em> official fund figures.
        Once <code className="mono">funds.current_nav</code> and per-order <code className="mono">unit_price</code> are populated, these panels switch to real data automatically.
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-slate-400">{label}</div>
      <div className="font-bold tabular-nums text-slate-800">{value}</div>
    </div>
  );
}

function Row({ label, value, pos }: { label: string; value: string; pos?: boolean }) {
  return (
    <li className="flex items-center justify-between gap-2">
      <span className="text-slate-500">{label}</span>
      <span className="font-bold tabular-nums" style={{ color: pos ? "#059669" : "#0f172a" }}>{value}</span>
    </li>
  );
}
