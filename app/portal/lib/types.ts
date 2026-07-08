// Shared types for the investor portal. Fields that require NAV data are `number | null`
// and render as "N/A" until NAVs are populated in the DB.

export interface Investor {
  id: string;
  name: string;
  phone: string | null;
  age: number | null;
  gender: string | null;
  primary_risk: string | null;
  source: string | null;
}

export interface Fund {
  id: number;
  name: string;
  amc: string;
  asset_class: string | null;
  sector: string | null;
  market_segment: string | null;
  current_nav: number | null;
  nav_date: string | null;
}

export interface Transaction {
  id: number;
  investor_id: string;
  fund_id: number;
  fund_name: string;
  amc: string;
  txn_date: string; // ISO date
  type: "LUMPSUM" | "SIP";
  amount: number;
  unit_price: number | null;
  units: number | null;
  risk_profile: string | null;
  source: string | null;
}

export interface Holding {
  fundId: number;
  fundName: string;
  amc: string;
  riskProfile: string | null;
  assetClass: string | null;
  txnCount: number;
  firstDate: string;
  lastDate: string;
  invested: number;
  weightPct: number; // by invested cost — always available
  units: number | null;
  avgCost: number | null; // weighted average unit cost
  currentNav: number | null;
  marketValue: number | null;
  gainLoss: number | null;
  absoluteReturnPct: number | null;
  xirrPct: number | null;
}

export interface AllocationSlice {
  label: string;
  value: number; // invested amount
  pct: number;
}

export interface Allocations {
  byFund: AllocationSlice[];
  byAmc: AllocationSlice[];
  byRisk: AllocationSlice[];
  byType: AllocationSlice[];
  byAssetClass: AllocationSlice[] | null; // null = N/A (needs asset_class data)
  bySector: AllocationSlice[] | null; // null = N/A (needs sector data)
}

export interface Activity {
  periodLabel: string;
  from: string;
  to: string;
  openingInvested: number;
  contributions: number;
  withdrawals: number;
  marketGainLoss: number | null; // N/A without NAV
  closingInvested: number;
  closingValue: number | null; // N/A without NAV
}

export interface PerformancePoint {
  label: string;
  date: string;
  invested: number; // cumulative
  value: number | null; // N/A without NAV
}

export interface Kpis {
  netInvested: number;
  currentValue: number | null;
  netGainLoss: number | null;
  netGainLossPct: number | null;
  xirrPct: number | null;
}

export interface PortfolioPayload {
  investor: Investor;
  asOf: string;
  navAvailable: boolean;
  kpis: Kpis;
  holdings: Holding[];
  allocations: Allocations;
  activity: Activity;
  performance: PerformancePoint[];
  amcCount: number;
  fundCount: number;
  txnCount: number;
}
