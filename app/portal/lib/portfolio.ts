import type {
  Activity,
  Allocations,
  AllocationSlice,
  Fund,
  Holding,
  Investor,
  Kpis,
  PerformancePoint,
  PortfolioPayload,
  Transaction,
} from "./types";
import { xirr, type CashFlow } from "./xirr";

function slices(map: Map<string, number>, total: number): AllocationSlice[] {
  return [...map.entries()]
    .map(([label, value]) => ({ label, value, pct: total ? (value / total) * 100 : 0 }))
    .sort((a, b) => b.value - a.value);
}

// units held for a set of transactions: sum of explicit units, else amount/unit_price.
// Returns null if ANY transaction lacks the data (so we never show a partial figure).
function computeUnits(txns: Transaction[]): number | null {
  let sum = 0;
  for (const t of txns) {
    const u = t.units ?? (t.unit_price ? t.amount / t.unit_price : null);
    if (u == null) return null;
    sum += u;
  }
  return sum;
}

export interface PortfolioOptions {
  from?: string; // ISO — activity/period start (inclusive)
  to?: string; // ISO — activity/period end (inclusive)
  asOf: string; // ISO — valuation date for XIRR terminal flow
  periodLabel?: string;
}

export function computePortfolio(
  investor: Investor,
  transactions: Transaction[],
  funds: Fund[],
  opts: PortfolioOptions
): PortfolioPayload {
  const fundById = new Map(funds.map((f) => [f.id, f]));
  const txns = [...transactions].sort((a, b) => (a.txn_date < b.txn_date ? -1 : 1));
  const totalInvested = txns.reduce((s, t) => s + t.amount, 0);

  // ---- Holdings (one per fund) ----
  const byFund = new Map<number, Transaction[]>();
  for (const t of txns) {
    if (!byFund.has(t.fund_id)) byFund.set(t.fund_id, []);
    byFund.get(t.fund_id)!.push(t);
  }

  const holdings: Holding[] = [];
  for (const [fundId, list] of byFund) {
    const fund = fundById.get(fundId);
    const invested = list.reduce((s, t) => s + t.amount, 0);
    const units = computeUnits(list);
    const currentNav = fund?.current_nav ?? null;
    const marketValue = units != null && currentNav != null ? units * currentNav : null;
    const gainLoss = marketValue != null ? marketValue - invested : null;
    const absoluteReturnPct = gainLoss != null && invested ? (gainLoss / invested) * 100 : null;

    let xirrPct: number | null = null;
    if (marketValue != null) {
      const flows: CashFlow[] = list.map((t) => ({ date: t.txn_date, amount: -t.amount }));
      flows.push({ date: opts.asOf, amount: marketValue });
      xirrPct = xirr(flows);
    }

    holdings.push({
      fundId,
      fundName: fund?.name ?? list[0].fund_name,
      amc: fund?.amc ?? list[0].amc,
      riskProfile: list[0].risk_profile,
      assetClass: fund?.asset_class ?? null,
      txnCount: list.length,
      firstDate: list.reduce((m, t) => (t.txn_date < m ? t.txn_date : m), list[0].txn_date),
      lastDate: list.reduce((m, t) => (t.txn_date > m ? t.txn_date : m), list[0].txn_date),
      invested,
      weightPct: totalInvested ? (invested / totalInvested) * 100 : 0,
      units,
      avgCost: units && units > 0 ? invested / units : null,
      currentNav,
      marketValue,
      gainLoss,
      absoluteReturnPct,
      xirrPct,
    });
  }
  holdings.sort((a, b) => b.invested - a.invested);

  // ---- Allocations ----
  const fundMap = new Map<string, number>();
  const amcMap = new Map<string, number>();
  const riskMap = new Map<string, number>();
  const typeMap = new Map<string, number>();
  const assetMap = new Map<string, number>();
  let anyAssetClass = false;
  for (const t of txns) {
    const fund = fundById.get(t.fund_id);
    fundMap.set(fund?.name ?? t.fund_name, (fundMap.get(fund?.name ?? t.fund_name) ?? 0) + t.amount);
    amcMap.set(fund?.amc ?? t.amc, (amcMap.get(fund?.amc ?? t.amc) ?? 0) + t.amount);
    riskMap.set(t.risk_profile ?? "Unspecified", (riskMap.get(t.risk_profile ?? "Unspecified") ?? 0) + t.amount);
    typeMap.set(t.type, (typeMap.get(t.type) ?? 0) + t.amount);
    if (fund?.asset_class) {
      anyAssetClass = true;
      assetMap.set(fund.asset_class, (assetMap.get(fund.asset_class) ?? 0) + t.amount);
    }
  }
  const allocations: Allocations = {
    byFund: slices(fundMap, totalInvested),
    byAmc: slices(amcMap, totalInvested),
    byRisk: slices(riskMap, totalInvested),
    byType: slices(typeMap, totalInvested),
    byAssetClass: anyAssetClass ? slices(assetMap, totalInvested) : null,
  };

  // ---- KPIs ----
  const allValued = holdings.length > 0 && holdings.every((h) => h.marketValue != null);
  const currentValue = allValued ? holdings.reduce((s, h) => s + (h.marketValue ?? 0), 0) : null;
  const netGainLoss = currentValue != null ? currentValue - totalInvested : null;
  const netGainLossPct = netGainLoss != null && totalInvested ? (netGainLoss / totalInvested) * 100 : null;
  let portfolioXirr: number | null = null;
  if (currentValue != null) {
    const flows: CashFlow[] = txns.map((t) => ({ date: t.txn_date, amount: -t.amount }));
    flows.push({ date: opts.asOf, amount: currentValue });
    portfolioXirr = xirr(flows);
  }
  const kpis: Kpis = {
    netInvested: totalInvested,
    currentValue,
    netGainLoss,
    netGainLossPct,
    xirrPct: portfolioXirr,
  };

  // ---- Activity (for the selected period) ----
  const from = opts.from ?? "0000-01-01";
  const to = opts.to ?? opts.asOf;
  const openingInvested = txns.filter((t) => t.txn_date < from).reduce((s, t) => s + t.amount, 0);
  const contributions = txns
    .filter((t) => t.txn_date >= from && t.txn_date <= to)
    .reduce((s, t) => s + t.amount, 0);
  const activity: Activity = {
    periodLabel: opts.periodLabel ?? "All time",
    from,
    to,
    openingInvested,
    contributions,
    withdrawals: 0, // no redemption records in source data
    marketGainLoss: null, // N/A without NAV
    closingInvested: openingInvested + contributions,
    closingValue: null, // N/A without NAV
  };

  // ---- Performance (cumulative invested over time; value N/A without historical NAV) ----
  const performance: PerformancePoint[] = [];
  let cum = 0;
  for (const t of txns) {
    cum += t.amount;
    const d = new Date(t.txn_date);
    const label = d.toLocaleDateString("en-GB", { month: "short", year: "2-digit" });
    performance.push({ label, date: t.txn_date, invested: cum, value: null });
  }

  const amcCount = new Set(holdings.map((h) => h.amc)).size;

  return {
    investor,
    asOf: opts.asOf,
    navAvailable: allValued,
    kpis,
    holdings,
    allocations,
    activity,
    performance,
    amcCount,
    fundCount: holdings.length,
    txnCount: txns.length,
  };
}
