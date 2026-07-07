import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "../../../lib/supabase/server";
import { getFunds, getInvestor, getTransactions, todayIso } from "../../../portal/lib/queries";
import { computePortfolio } from "../../../portal/lib/portfolio";

export const dynamic = "force-dynamic";

const PERIODS: Record<string, { months: number | null; label: string }> = {
  "1M": { months: 1, label: "Last 1 month" },
  "3M": { months: 3, label: "Last 3 months" },
  "6M": { months: 6, label: "Last 6 months" },
  "1Y": { months: 12, label: "Last 1 year" },
  ALL: { months: null, label: "All time" },
};

function fromDate(asOf: string, months: number | null): string {
  if (months == null) return "0000-01-01";
  const d = new Date(asOf);
  d.setMonth(d.getMonth() - months);
  return d.toISOString().slice(0, 10);
}

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
    const periodKey = (url.searchParams.get("period") || "ALL").toUpperCase();
    const period = PERIODS[periodKey] ?? PERIODS.ALL;

    const [investor, funds, transactions] = await Promise.all([
      getInvestor(investorId),
      getFunds(),
      getTransactions(investorId),
    ]);
    if (!investor) {
      return NextResponse.json({ error: "Investor not found" }, { status: 404 });
    }

    const asOf = todayIso();
    const payload = computePortfolio(investor, transactions, funds, {
      asOf,
      from: fromDate(asOf, period.months),
      to: asOf,
      periodLabel: period.label,
    });
    return NextResponse.json(payload);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
