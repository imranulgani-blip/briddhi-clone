"use client";

import { useState } from "react";
import { usePortal } from "../lib/PortalContext";
import { useFetch } from "../lib/useFetch";
import { bdt, fmtDate, naOr, pct } from "../lib/format";
import type { PortfolioPayload } from "../lib/types";
import { KpiCard, SectionHeading } from "../components/Kpi";
import PerfChart from "../components/PerfChart";
import HoldingsTable from "../components/HoldingsTable";
import AllocationChart from "../components/AllocationChart";
import ActivityTable from "../components/ActivityTable";
import Goals from "../components/Goals";

const PERIODS = ["1M", "3M", "6M", "1Y", "ALL"] as const;

export default function DashboardPage() {
  const { investor } = usePortal();
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>("ALL");
  const url = investor ? `/api/portfolio/${investor.id}?period=${period}` : null;
  const { data, loading, error } = useFetch<PortfolioPayload>(url);

  if (!investor) return null;
  if (error) {
    return (
      <div className="surface border-amber-500/40 p-6 text-sm text-amber-200">
        <div className="font-semibold">Couldn&apos;t load the portfolio.</div>
        <p className="mt-1 text-amber-200/80">{error}</p>
        <p className="mt-2 text-ink-400">
          Confirm Supabase is configured and seeded (<code className="mono">node scripts/seed.mjs</code>).
        </p>
      </div>
    );
  }
  if (loading || !data) return <div className="text-ink-400">Loading portfolio…</div>;

  const { kpis, holdings, allocations, activity, performance, asOf } = data;
  const perfPoints = performance.filter((p) => p.date >= activity.from);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{investor.name}</h1>
            <p className="text-sm text-ink-400">
              Consolidated portfolio · <span className="mono">{investor.id}</span>
            </p>
          </div>
          <div className="text-right text-xs text-ink-400">
            As of <span className="text-ink-200">{fmtDate(asOf)}</span>
            <div className="mt-1 flex gap-2">
              <Chip>{data.fundCount} funds</Chip>
              <Chip>{data.amcCount} AMCs</Chip>
              <Chip>{data.txnCount} orders</Chip>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs — FR-DASH-01 */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard
          label="Net invested"
          value={bdt(kpis.netInvested)}
          note="Sum of all purchase amounts across every fund and AMC."
        />
        <KpiCard
          label="Current value"
          value={naOr(kpis.currentValue, bdt)}
          isNa={kpis.currentValue == null}
          tone="default"
          note="Units × current NAV, summed. Requires NAV data."
        />
        <KpiCard
          label="Net gain / loss"
          value={kpis.netGainLoss == null ? "" : `${bdt(kpis.netGainLoss)} (${pct(kpis.netGainLossPct ?? 0, true)})`}
          isNa={kpis.netGainLoss == null}
          tone={kpis.netGainLoss != null && kpis.netGainLoss >= 0 ? "pos" : "neg"}
          note="Current value − net invested. Requires NAV data."
        />
        <KpiCard
          label="Annualised (XIRR)"
          value={naOr(kpis.xirrPct, (v) => pct(v, true))}
          isNa={kpis.xirrPct == null}
          tone={kpis.xirrPct != null && kpis.xirrPct >= 0 ? "pos" : "neg"}
          note="Money-weighted annual return over dated cashflows + current value. Requires NAV data."
        />
      </div>

      {/* Performance — FR-DASH-05 */}
      <div>
        <SectionHeading
          title="Performance over time"
          sub="Cumulative invested (actual). Current-value line appears once NAVs are added."
          right={
            <div className="no-print flex rounded-lg border border-ink-700/50 bg-ink-800/40 p-0.5">
              {PERIODS.map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`rounded-md px-2.5 py-1 text-xs ${
                    period === p ? "bg-ink-700 text-neon-400" : "text-ink-400 hover:text-ink-200"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          }
        />
        <PerfChart points={perfPoints} showValue={data.navAvailable} />
      </div>

      {/* Holdings — FR-DASH-02 */}
      <div>
        <SectionHeading
          title="Holdings"
          sub="Every fund across every AMC (multi-AMC consolidated). Drill into any fund →"
        />
        <HoldingsTable holdings={holdings} investorId={investor.id} />
      </div>

      {/* Allocations — FR-DASH-03 */}
      <div>
        <SectionHeading title="Allocation breakdown" sub="By invested amount." />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AllocationChart title="By fund" slices={allocations.byFund} />
          <AllocationChart title="By AMC (multi-AMC)" slices={allocations.byAmc} />
          <AllocationChart title="By risk profile" slices={allocations.byRisk} />
          <AllocationChart title="By investment type" slices={allocations.byType} />
          <AllocationChart
            title="By asset class"
            slices={allocations.byAssetClass}
            naNote="Asset-class (equity / debt / cash / commodity) tagging is not in the source dataset. Populate funds.asset_class to enable."
          />
          <AllocationChart
            title="By sector / market"
            slices={null}
            naNote="Sector and market-segment classification is not in the source dataset. Populate funds.sector / market_segment to enable."
          />
        </div>
      </div>

      {/* Activity — FR-DASH-04 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ActivityTable activity={activity} />
        <div className="surface p-5">
          <div className="text-sm font-semibold text-ink-100">How these figures are calculated</div>
          <ul className="mt-3 space-y-2 text-xs leading-relaxed text-ink-400">
            <li><strong className="text-ink-300">Net invested</strong> — Σ purchase amounts (actual).</li>
            <li><strong className="text-ink-300">Weight %</strong> — a fund&apos;s invested ÷ total invested (actual).</li>
            <li><strong className="text-ink-300">Avg cost / Units</strong> — invested ÷ units, where units = amount ÷ purchase NAV. <em>N/A until NAV data is added.</em></li>
            <li><strong className="text-ink-300">Market value / Gain-loss</strong> — units × current NAV. <em>N/A until NAV data is added.</em></li>
            <li><strong className="text-ink-300">XIRR</strong> — money-weighted annualised return over dated cashflows. <em>N/A until NAV data is added.</em></li>
          </ul>
          <p className="mt-3 text-xs text-ink-500">All figures as of {fmtDate(asOf)}.</p>
        </div>
      </div>

      {/* Goals — FR-DASH-06 */}
      <Goals investorId={investor.id} invested={kpis.netInvested} />
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-ink-700/60 bg-ink-800/60 px-2 py-0.5 text-[11px] text-ink-300">
      {children}
    </span>
  );
}
