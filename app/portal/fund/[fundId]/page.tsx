"use client";

import Link from "next/link";
import { use } from "react";
import { usePortal } from "../../lib/PortalContext";
import { useFetch } from "../../lib/useFetch";
import { bdt, fmtDate, naOr, pct } from "../../lib/format";
import type { Fund, Holding, Transaction } from "../../lib/types";
import { KpiCard } from "../../components/Kpi";

interface FundPayload {
  fund: Fund;
  holding: Holding | null;
  transactions: Transaction[];
  asOf: string;
}

export default function FundDrillPage({ params }: { params: Promise<{ fundId: string }> }) {
  const { fundId } = use(params);
  const { investor } = usePortal();
  const url = investor ? `/api/funds/${fundId}?investorId=${investor.id}` : null;
  const { data, loading, error } = useFetch<FundPayload>(url);

  if (!investor) return null;
  if (error) return <div className="surface border-amber-500/40 p-6 text-amber-200">{error}</div>;
  if (loading || !data) return <div className="text-ink-400">Loading fund…</div>;

  const { fund, holding, transactions, asOf } = data;

  return (
    <div className="space-y-6">
      <Link href="/portal/dashboard" className="text-sm text-neon-400 hover:text-neon-500">
        ← Back to dashboard
      </Link>

      <div>
        <div className="flex items-center gap-2 text-xs text-ink-400">
          <span className="rounded-full border border-ink-600 px-2 py-0.5">{fund.amc}</span>
          {holding?.riskProfile && (
            <span className="rounded-full border border-ink-600 px-2 py-0.5">{holding.riskProfile}</span>
          )}
        </div>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">{fund.name}</h1>
        <p className="text-sm text-ink-400">Fund analytics · as of {fmtDate(asOf)}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Invested" value={bdt(holding?.invested ?? 0)} note="Σ your purchases in this fund." />
        <KpiCard label="Units" value={naOr(holding?.units ?? null, (v) => v.toFixed(3))} isNa={holding?.units == null} note="amount ÷ purchase NAV." />
        <KpiCard label="Market value" value={naOr(holding?.marketValue ?? null, bdt)} isNa={holding?.marketValue == null} note="units × current NAV." />
        <KpiCard
          label="Abs. return"
          value={naOr(holding?.absoluteReturnPct ?? null, (v) => pct(v, true))}
          isNa={holding?.absoluteReturnPct == null}
          tone={holding?.absoluteReturnPct != null && holding.absoluteReturnPct >= 0 ? "pos" : "neg"}
          note="gain ÷ invested."
        />
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold tracking-tight">Your transactions in this fund</h2>
        <div className="surface overflow-x-auto">
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
                  <td className="text-ink-200">{fmtDate(t.txn_date)}</td>
                  <td className="text-ink-300">{t.type}</td>
                  <td className="text-right mono text-ink-100">{bdt(t.amount)}</td>
                  <td className="text-right mono text-ink-400">{t.unit_price != null ? t.unit_price.toFixed(3) : "N/A"}</td>
                  <td className="text-right mono text-ink-400">{t.units != null ? t.units.toFixed(3) : "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="surface p-5 text-xs leading-relaxed text-ink-400">
        <strong className="text-ink-300">Reference:</strong> Asset class{" "}
        {fund.asset_class ?? "N/A"}, sector {fund.sector ?? "N/A"}, current NAV{" "}
        {fund.current_nav != null ? fund.current_nav.toFixed(4) : "N/A"}. NAV-dependent analytics light
        up automatically once <code className="mono">funds.current_nav</code> and per-order{" "}
        <code className="mono">unit_price</code> are populated.
      </div>
    </div>
  );
}
