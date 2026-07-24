import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "../../../lib/supabase/server";
import { getFunds, getInvestor, getTransactions, todayIso } from "../../../portal/lib/queries";
import { computePortfolio } from "../../../portal/lib/portfolio";
import { DEMO_FUNDS, demoTransactions, getDemoInvestor } from "../../../portal/lib/demoData";

export const dynamic = "force-dynamic";

// Fund drill-down (FR-DASH-09 / §7.3): a fund's reference data + this investor's
// transactions and derived holding for that fund.
export async function GET(
  req: Request,
  ctx: { params: Promise<{ fundId: string }> }
) {
  try {
    const { fundId } = await ctx.params;
    const url = new URL(req.url);
    const investorId = url.searchParams.get("investorId");
    if (!investorId) {
      return NextResponse.json({ error: "investorId query param required" }, { status: 400 });
    }
    const id = Number(fundId);

    const demo = !isSupabaseConfigured();
    const [investor, funds, transactions] = demo
      ? [getDemoInvestor(investorId), DEMO_FUNDS, demoTransactions(investorId)]
      : await Promise.all([getInvestor(investorId), getFunds(), getTransactions(investorId)]);
    if (!investor) return NextResponse.json({ error: "Investor not found" }, { status: 404 });
    const fund = funds.find((f) => f.id === id);
    if (!fund) return NextResponse.json({ error: "Fund not found" }, { status: 404 });

    const fundTxns = transactions.filter((t) => t.fund_id === id);
    const asOf = todayIso();
    // reuse the portfolio engine on just this fund's transactions to get the holding
    const sub = computePortfolio(investor, fundTxns, funds, { asOf, to: asOf });
    const holding = sub.holdings[0] ?? null;

    return NextResponse.json({
      investor,
      fund,
      holding,
      transactions: fundTxns,
      asOf,
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
