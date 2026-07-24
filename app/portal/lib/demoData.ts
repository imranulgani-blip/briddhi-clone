// Baked-in demo dataset for the Investor Portal.
//
// Served by the API route handlers whenever Supabase is not configured (see the
// routes in app/api/*). Because funds carry current_nav / asset_class / sector and
// every transaction carries a unit_price, the real portfolio engine
// (computePortfolio) produces fully-populated, realistic figures — current value,
// gain/loss, XIRR, and allocation by asset class & sector all light up.
//
// This is illustrative sample data — NOT real investor information.

import type { Fund, Investor, Transaction } from "./types";

// ---------------------------------------------------------------------------
// Funds — 10 funds across 6 AMCs, with NAV + classification so nothing shows N/A.
// ---------------------------------------------------------------------------
export const DEMO_FUNDS: Fund[] = [
  { id: 1, name: "EDGE Bangladesh First Growth Fund", amc: "EDGE AMC", asset_class: "Equity", sector: "Financials", market_segment: "Growth", current_nav: 15.42, nav_date: "2026-07-20" },
  { id: 2, name: "EDGE Shariah Equity Fund", amc: "EDGE AMC", asset_class: "Equity", sector: "Shariah", market_segment: "Growth", current_nav: 13.88, nav_date: "2026-07-20" },
  { id: 3, name: "EKUSH First Balanced Fund", amc: "EKUSH Investments", asset_class: "Balanced", sector: "Diversified", market_segment: "Balanced", current_nav: 12.65, nav_date: "2026-07-20" },
  { id: 4, name: "EKUSH Income Fund", amc: "EKUSH Investments", asset_class: "Debt", sector: "Fixed Income", market_segment: "Income", current_nav: 11.30, nav_date: "2026-07-20" },
  { id: 5, name: "InvestIT Blue Chip Fund", amc: "InvestIT AML", asset_class: "Equity", sector: "Large Cap", market_segment: "Growth", current_nav: 16.74, nav_date: "2026-07-20" },
  { id: 6, name: "InvestIT Money Market Fund", amc: "InvestIT AML", asset_class: "Money Market", sector: "Cash & Equivalents", market_segment: "Liquidity", current_nav: 10.46, nav_date: "2026-07-20" },
  { id: 7, name: "Midland Growth Fund", amc: "Midland AMC", asset_class: "Equity", sector: "Pharmaceuticals", market_segment: "Growth", current_nav: 14.05, nav_date: "2026-07-20" },
  { id: 8, name: "Midland Balanced Fund", amc: "Midland AMC", asset_class: "Balanced", sector: "Diversified", market_segment: "Balanced", current_nav: 12.10, nav_date: "2026-07-20" },
  { id: 9, name: "VIPB Value Fund", amc: "VIPB Asset Management", asset_class: "Equity", sector: "Consumer Goods", market_segment: "Value", current_nav: 13.20, nav_date: "2026-07-20" },
  { id: 10, name: "LankaBangla Shariah Fund", amc: "LankaBangla AML", asset_class: "Equity", sector: "Shariah", market_segment: "Growth", current_nav: 12.95, nav_date: "2026-07-20" },
];

const fundById = new Map(DEMO_FUNDS.map((f) => [f.id, f]));

// ---------------------------------------------------------------------------
// Investors — 6 profiles. BINV001 is the rich default (auto-login target).
// ---------------------------------------------------------------------------
export const DEMO_INVESTORS: Investor[] = [
  { id: "BINV001", name: "Imranul Gani Fira", phone: "+8801711000001", age: 34, gender: "Male", primary_risk: "Growth-Seeker", source: "App" },
  { id: "BINV002", name: "Farhana Akter", phone: "+8801711000002", age: 41, gender: "Female", primary_risk: "Balanced", source: "Branch" },
  { id: "BINV003", name: "Tanvir Ahmed", phone: "+8801711000003", age: 29, gender: "Male", primary_risk: "Growth-Seeker", source: "App" },
  { id: "BINV004", name: "Nusrat Jahan", phone: "+8801711000004", age: 37, gender: "Female", primary_risk: "Conservative", source: "App" },
  { id: "BINV005", name: "Rezaul Karim", phone: "+8801711000005", age: 52, gender: "Male", primary_risk: "Conservative", source: "Agent" },
  { id: "BINV006", name: "Shabnam Sultana", phone: "+8801711000006", age: 45, gender: "Female", primary_risk: "Balanced", source: "Branch" },
];

export function getDemoInvestor(id: string): Investor | null {
  return DEMO_INVESTORS.find((i) => i.id === id) ?? null;
}

// ---------------------------------------------------------------------------
// Transactions — [investor, fundId, date, type, amount, unitPrice, risk].
// unit_price < current_nav for most → healthy but realistic gains.
// ---------------------------------------------------------------------------
type Row = [string, number, string, "LUMPSUM" | "SIP", number, number, string];

const ROWS: Row[] = [
  // BINV001 — 8 funds, 6 AMCs, 3-year history
  ["BINV001", 5, "2023-01-25", "LUMPSUM", 100000, 12.40, "Growth-Seeker"],
  ["BINV001", 1, "2023-03-12", "LUMPSUM", 50000, 11.20, "Growth-Seeker"],
  ["BINV001", 3, "2023-04-18", "LUMPSUM", 60000, 10.90, "Balanced"],
  ["BINV001", 2, "2023-06-05", "LUMPSUM", 40000, 11.80, "Balanced"],
  ["BINV001", 1, "2023-09-10", "SIP", 5000, 12.10, "Growth-Seeker"],
  ["BINV001", 9, "2023-11-30", "LUMPSUM", 35000, 11.50, "Balanced"],
  ["BINV001", 1, "2024-02-15", "SIP", 5000, 12.60, "Growth-Seeker"],
  ["BINV001", 7, "2024-03-22", "LUMPSUM", 45000, 12.00, "Growth-Seeker"],
  ["BINV001", 3, "2024-05-12", "SIP", 8000, 11.90, "Balanced"],
  ["BINV001", 10, "2024-07-09", "LUMPSUM", 40000, 11.20, "Balanced"],
  ["BINV001", 1, "2024-08-20", "SIP", 5000, 13.30, "Growth-Seeker"],
  ["BINV001", 5, "2024-11-05", "LUMPSUM", 50000, 15.10, "Growth-Seeker"],
  ["BINV001", 6, "2025-01-15", "LUMPSUM", 75000, 10.10, "Conservative"],
  ["BINV001", 7, "2025-06-18", "SIP", 6000, 13.40, "Growth-Seeker"],

  // BINV002 — Balanced
  ["BINV002", 3, "2023-05-20", "LUMPSUM", 80000, 11.10, "Balanced"],
  ["BINV002", 4, "2023-08-14", "LUMPSUM", 60000, 10.70, "Conservative"],
  ["BINV002", 8, "2024-01-30", "LUMPSUM", 50000, 11.40, "Balanced"],
  ["BINV002", 9, "2024-06-11", "SIP", 7000, 12.30, "Balanced"],
  ["BINV002", 3, "2025-02-19", "SIP", 7000, 12.20, "Balanced"],

  // BINV003 — Growth-Seeker
  ["BINV003", 5, "2023-07-03", "LUMPSUM", 120000, 13.00, "Growth-Seeker"],
  ["BINV003", 7, "2024-04-16", "LUMPSUM", 55000, 12.20, "Growth-Seeker"],
  ["BINV003", 1, "2024-10-28", "SIP", 10000, 13.60, "Growth-Seeker"],
  ["BINV003", 1, "2025-03-24", "SIP", 10000, 14.10, "Growth-Seeker"],

  // BINV004 — Conservative
  ["BINV004", 4, "2023-09-05", "LUMPSUM", 90000, 10.80, "Conservative"],
  ["BINV004", 6, "2024-02-27", "LUMPSUM", 70000, 10.05, "Conservative"],
  ["BINV004", 3, "2024-09-13", "LUMPSUM", 40000, 11.70, "Balanced"],

  // BINV005 — Conservative
  ["BINV005", 6, "2023-12-01", "LUMPSUM", 150000, 10.00, "Conservative"],
  ["BINV005", 4, "2024-05-22", "SIP", 8000, 11.00, "Conservative"],
  ["BINV005", 4, "2025-01-09", "SIP", 8000, 11.15, "Conservative"],

  // BINV006 — Balanced
  ["BINV006", 8, "2023-06-18", "LUMPSUM", 70000, 11.20, "Balanced"],
  ["BINV006", 2, "2023-10-24", "LUMPSUM", 45000, 11.60, "Balanced"],
  ["BINV006", 3, "2024-03-08", "SIP", 6000, 11.80, "Balanced"],
  ["BINV006", 10, "2024-08-30", "LUMPSUM", 35000, 11.40, "Balanced"],
  ["BINV006", 3, "2025-04-15", "SIP", 6000, 12.35, "Balanced"],
];

let _seq = 0;
const ALL_TXNS: Transaction[] = ROWS.map(([investor, fundId, date, type, amount, price, risk]) => {
  const f = fundById.get(fundId)!;
  return {
    id: ++_seq,
    investor_id: investor,
    fund_id: fundId,
    fund_name: f.name,
    amc: f.amc,
    txn_date: date,
    type,
    amount,
    unit_price: price,
    units: null, // engine derives units = amount / unit_price
    risk_profile: risk,
    source: type === "SIP" ? "Auto-debit" : "App",
  };
});

export function demoTransactions(investorId: string): Transaction[] {
  return ALL_TXNS.filter((t) => t.investor_id === investorId);
}

// ---------------------------------------------------------------------------
// Goals
// ---------------------------------------------------------------------------
export interface DemoGoal {
  id: number;
  investor_id: string;
  name: string;
  target_amount: number;
  target_date: string | null;
  created_at: string;
}

const GOALS: Record<string, Omit<DemoGoal, "investor_id" | "created_at">[]> = {
  BINV001: [
    { id: 1, name: "Hajj Fund", target_amount: 800000, target_date: "2028-12-31" },
    { id: 2, name: "Children's Education", target_amount: 1500000, target_date: "2033-06-30" },
    { id: 3, name: "Emergency Reserve", target_amount: 300000, target_date: null },
  ],
  BINV002: [{ id: 4, name: "Home Down-payment", target_amount: 2000000, target_date: "2030-01-31" }],
  BINV003: [{ id: 5, name: "Startup Capital", target_amount: 1000000, target_date: "2029-06-30" }],
  BINV004: [{ id: 6, name: "Retirement Nest", target_amount: 5000000, target_date: "2045-12-31" }],
  BINV005: [{ id: 7, name: "Grandchildren's Gift", target_amount: 600000, target_date: "2031-03-31" }],
  BINV006: [{ id: 8, name: "World Tour", target_amount: 900000, target_date: "2029-12-31" }],
};

export function demoGoals(investorId: string): DemoGoal[] {
  const list = GOALS[investorId] ?? [{ id: 99, name: "Wealth Growth", target_amount: 500000, target_date: "2030-01-01" }];
  return list.map((g) => ({ ...g, investor_id: investorId, created_at: "2023-01-01T00:00:00Z" }));
}

// ---------------------------------------------------------------------------
// Notifications — derived from the investor's own transactions + platform nudges.
// ---------------------------------------------------------------------------
export interface DemoNotif {
  id: number;
  investor_id: string;
  category: string;
  title: string;
  body: string | null;
  channel: string;
  status: string;
  created_at: string;
  read_at: string | null;
}

const bdt = (n: number) => "৳" + n.toLocaleString("en-US");

export function demoNotifications(investorId: string): DemoNotif[] {
  const txns = [...demoTransactions(investorId)].sort((a, b) => (a.txn_date < b.txn_date ? 1 : -1));
  const out: DemoNotif[] = [];
  let n = 0;
  const push = (o: Partial<DemoNotif> & { category: string; title: string; created_at: string }) =>
    out.push({
      id: ++n,
      investor_id: investorId,
      body: null,
      channel: "push",
      status: "delivered",
      read_at: null,
      ...o,
    });

  // Recent platform-level notifications (unread → shows the unread badge working).
  push({ category: "nudge", title: "You're on track for your top goal", body: "Add a little more this month to stay ahead of schedule.", created_at: "2026-07-22T06:30:00Z" });
  push({ category: "sip", title: "SIP instalment due in 3 days", body: "Your next monthly SIP is scheduled for 27 Jul 2026.", channel: "sms", created_at: "2026-07-20T04:00:00Z" });
  push({ category: "payment", title: "Payment received", body: "Your auto-debit for this month's SIP was successful.", read_at: "2026-07-19T10:00:00Z", created_at: "2026-07-18T03:15:00Z" });

  // Order + allotment pairs from the 4 most recent transactions.
  txns.slice(0, 4).forEach((t, i) => {
    push({
      category: "order_placed",
      title: `Order placed · ${t.fund_name}`,
      body: `${t.type === "SIP" ? "SIP" : "Lump-sum"} order of ${bdt(t.amount)} received.`,
      created_at: `${t.txn_date}T09:15:00Z`,
      read_at: i > 1 ? `${t.txn_date}T12:00:00Z` : null,
    });
    push({
      category: "allotment",
      title: `Units allotted · ${t.fund_name}`,
      body: `Units have been credited to your folio.`,
      channel: "email",
      read_at: `${t.txn_date}T18:00:00Z`,
      created_at: `${t.txn_date}T17:30:00Z`,
    });
  });

  return out.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
}

// ---------------------------------------------------------------------------
// Notification preferences
// ---------------------------------------------------------------------------
export function demoPreferences(investorId: string) {
  return {
    investor_id: investorId,
    push: true,
    sms: true,
    email: true,
    goal_nudges: true,
    sip_reminders: true,
    curated_lists: investorId === "BINV001",
  };
}
