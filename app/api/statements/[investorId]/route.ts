import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "../../../lib/supabase/server";
import { getFunds, getInvestor, getTransactions, todayIso } from "../../../portal/lib/queries";
import { computePortfolio } from "../../../portal/lib/portfolio";

export const dynamic = "force-dynamic";

// GET /api/statements/BFT001?from=2025-11-01&to=2026-06-30
// Returns EKUSH-style statement data + a capital-gains/tax summary for the period.
export async function GET(
  req: Request,
  ctx: { params: Promise<{ investorId: string }> }
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured. Add .env.local." }, { status: 503 });
  }
  try {
    const { investorId } = await ctx.params;
    const url = new URL(req.url);
    const asOf = todayIso();
    const from = url.searchParams.get("from") || "0000-01-01";
    const to = url.searchParams.get("to") || asOf;

    const [investor, funds, allTxns] = await Promise.all([
      getInvestor(investorId),
      getFunds(),
      getTransactions(investorId),
    ]);
    if (!investor) return NextResponse.json({ error: "Investor not found" }, { status: 404 });

    const periodTxns = allTxns.filter((t) => t.txn_date >= from && t.txn_date <= to);
    // Full-portfolio holdings (as-of), plus period activity.
    const portfolio = computePortfolio(investor, allTxns, funds, {
      asOf,
      from,
      to,
      periodLabel: `${from} to ${to}`,
    });

    // Tax report: realized gains need redemptions + NAV (absent) → N/A. We surface the
    // invested/transaction summary that IS available.
    const taxReport = {
      period: { from, to },
      totalInvestedInPeriod: periodTxns.reduce((s, t) => s + t.amount, 0),
      transactionCount: periodTxns.length,
      realizedGains: null as number | null, // N/A — no redemptions/NAV in source
      dividendIncome: null as number | null, // N/A — not in source
      note:
        "Capital-gains/dividend figures require redemption records and NAV data, which are not present in the source dataset. Invested and transaction totals are actuals.",
    };

    return NextResponse.json({
      investor,
      asOf,
      period: { from, to },
      portfolio,
      transactions: periodTxns,
      taxReport,
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
