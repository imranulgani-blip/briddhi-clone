"use client";

import Link from "next/link";
import { use, useMemo } from "react";
import { usePortal } from "../../lib/PortalContext";
import { useFetch } from "../../lib/useFetch";
import { bdt, fmtDate, pct } from "../../lib/format";
import type { PortfolioPayload, AllocationSlice } from "../../lib/types";
import HoldingsTable from "../../components/HoldingsTable";
import { amcColor, amcLogo, riskColorHex, PALETTE } from "../../components/AllocationDonut";
import { Panel, KpiTile, InsightDonut, SpiralChart, MiniColumns, GaugeRow, IconCoins, IconWallet, IconTrend, IconGauge } from "../../components/bi";

export default function AmcReportPage({ params }: { params: Promise<{ amc: string }> }) {
  const { amc } = use(params);
  const name = decodeURIComponent(amc);
  const { investor } = usePortal();
  const url = investor ? `/api/portfolio/${investor.id}` : null;
  const { data, loading, error } = useFetch<PortfolioPayload>(url);

  const report = useMemo(() => {
    if (!data) return null;
    const hs = data.holdings.filter((h) => h.amc === name);
    const invested = hs.reduce((s, h) => s + h.invested, 0);
    const value = hs.reduce((s, h) => s + (h.marketValue ?? h.invested), 0);
    const gain = value - invested;
    const gainPct = invested ? (gain / invested) * 100 : 0;
    const totalPortfolio = data.holdings.reduce((s, h) => s + h.invested, 0) || 1;
    const share = (invested / totalPortfolio) * 100;

    const byFund: AllocationSlice[] = hs
      .map((h) => ({ label: h.fundName, value: h.invested, pct: invested ? (h.invested / invested) * 100 : 0 }))
      .sort((a, b) => b.value - a.value);

    const rm = new Map<string, number>();
    for (const h of hs) {
      const k = h.riskProfile ?? "Unspecified";
      rm.set(k, (rm.get(k) ?? 0) + h.invested);
    }
    const byRisk: AllocationSlice[] = [...rm.entries()].map(([label, v]) => ({ label, value: v, pct: invested ? (v / invested) * 100 : 0 })).sort((a, b) => b.value - a.value);

    const funds = hs
      .map((h) => {
        const v = h.marketValue ?? h.invested;
        return { fundId: h.fundId, fundName: h.fundName, invested: h.invested, value: v, gainPct: h.invested ? ((v - h.invested) / h.invested) * 100 : 0, risk: h.riskProfile };
      })
      .sort((a, b) => b.value - a.value);

    return { hs, invested, value, gain, gainPct, share, byFund, byRisk, funds };
  }, [data, name]);

  if (!investor) return null;
  if (error) return <div className="lcard border-amber-200 bg-amber-50 p-6 text-amber-700">{error}</div>;
  if (loading || !data || !report) return <div className="text-slate-500">Loading AMC report…</div>;

  const logo = amcLogo(name);
  const color = amcColor(name, 0);

  if (!report.funds.length) {
    return (
      <div className="space-y-4">
        <Link href="/portal/dashboard" className="text-sm text-[#F5821E] hover:text-[#e0761a]">← Back to dashboard</Link>
        <div className="lcard p-6 text-slate-600">You have no holdings with <strong>{name}</strong>.</div>
      </div>
    );
  }

  const up = report.gain >= 0;
  const topFund = report.funds[0];

  return (
    <div className="space-y-5">
      <Link href="/portal/dashboard" className="text-sm text-[#F5821E] hover:text-[#e0761a]">← Back to dashboard</Link>

      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white p-2 shadow-sm ring-1 ring-slate-100">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt={name} className="max-h-full max-w-full object-contain" />
          ) : (
            <span className="text-lg font-bold" style={{ color }}>{name.slice(0, 2).toUpperCase()}</span>
          )}
        </span>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">{name}</h1>
          <p className="text-sm text-slate-500">Your investment with this asset manager · as of {fmtDate(data.asOf)}</p>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <KpiTile icon={<IconCoins />} accent="#F5821E" label="Invested" value={bdt(report.invested)} />
        <KpiTile icon={<IconWallet />} accent="#0E50A0" label="Current value" value={bdt(report.value)} />
        <KpiTile icon={<IconTrend />} accent="#12A150" label="Gain / loss" value={bdt(report.gain)} sub={`(${pct(report.gainPct, true)})`} tone={up ? "pos" : "neg"} />
        <KpiTile icon={<IconGauge />} accent="#7c3aed" label="Return" value={pct(report.gainPct, true)} tone={up ? "pos" : "neg"} />
        <KpiTile icon={<IconCoins />} accent="#0891b2" label="Funds" value={String(report.funds.length)} />
        <KpiTile icon={<IconTrend />} accent="#db2777" label="Portfolio share" value={`${report.share.toFixed(1)}%`} />
      </div>

      {/* Main grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {/* Value snapshot — solid brand-colored panel */}
          <div className="relative overflow-hidden rounded-2xl p-5 text-white shadow-sm ring-1 ring-black/5" style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold sm:text-xl">Snapshot</h3>
              <span className="text-[11px] font-semibold uppercase tracking-wide text-white/70">{report.funds.length} fund{report.funds.length > 1 ? "s" : ""}</span>
            </div>
            <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
              <div>
                <div className="text-3xl font-extrabold tabular-nums">{bdt(report.value)}</div>
                <div className="text-xs font-semibold text-white/80">current value · invested {bdt(report.invested)}</div>
              </div>
              <div className="rounded-full bg-white/20 px-3 py-1 text-sm font-bold backdrop-blur">
                {up ? "▲" : "▼"} {Math.abs(report.gainPct).toFixed(2)}%
              </div>
            </div>
            <div className="mt-3 text-xs text-white/80">Top holding: <strong>{topFund.fundName}</strong> · {bdt(topFund.value)}</div>
          </div>

          {/* Funds — clickable rows */}
          <Panel title="Funds in this AMC" accent="#0f172a" soft="#ffffff" sub="click a fund for its report">
            <div className="space-y-2">
              {report.funds.map((f, i) => {
                const fu = f.gainPct >= 0;
                const gc = fu ? "#059669" : "#e11d48";
                return (
                  <Link key={f.fundId} href={`/portal/fund/${f.fundId}`} className="flex items-center justify-between gap-3 rounded-xl px-3 py-2 ring-1 ring-slate-100 transition-colors hover:bg-slate-50">
                    <span className="flex min-w-0 items-center gap-2">
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: PALETTE[i % PALETTE.length] }} />
                      <span className="min-w-0">
                        <span className="block truncate font-medium text-slate-800">{f.fundName}</span>
                        <span className="text-[11px] text-slate-400">{f.risk ?? "—"} · invested {bdt(f.invested)}</span>
                      </span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="block font-bold tabular-nums text-slate-900">{bdt(f.value)}</span>
                      <span className="text-[11px] font-bold" style={{ color: gc }}>{fu ? "▲" : "▼"} {Math.abs(f.gainPct).toFixed(1)}%</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </Panel>

          {/* Value by fund columns */}
          <Panel title="Value by fund" accent="#12A150" soft="#f0fdf4" sub="current value">
            <MiniColumns slices={report.funds.map((f) => ({ label: f.fundName, value: f.value, pct: report.value ? (f.value / report.value) * 100 : 0 }))} colors={report.funds.map((_, i) => PALETTE[i % PALETTE.length])} />
          </Panel>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <InsightDonut title="By fund" hint="Share within this AMC" centerLabel="funds" slices={report.byFund} colors={report.byFund.map((_, i) => PALETTE[i % PALETTE.length])} />
          <Panel title="Risk mix" accent="#7c3aed" soft="#f5f3ff" sub="within this AMC">
            {report.byRisk.length > 1 ? (
              <SpiralChart slices={report.byRisk} colors={report.byRisk.map((s) => riskColorHex(s.label))} />
            ) : (
              <GaugeRow slices={report.byRisk} colors={report.byRisk.map((s) => riskColorHex(s.label))} />
            )}
          </Panel>
        </div>
      </div>

      {/* Holdings table (filtered) */}
      <Panel title="Holdings" accent="#0f172a" soft="#ffffff" sub={`${name} · your funds`}>
        <HoldingsTable holdings={report.hs} investorId={investor.id} />
      </Panel>
    </div>
  );
}
