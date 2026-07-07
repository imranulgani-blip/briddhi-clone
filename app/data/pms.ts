// Portfolio Management Services — powered by Prime Bank Investment Limited (PBIL),
// a wholly-owned subsidiary of Prime Bank PLC. Data researched from pbil.com.bd (Jul 2026).
//
// REAL: firm metrics (AUM, clients, track record), scheme names & focus, fee band (0.5–2%).
// INDICATIVE (representative): per-scheme target returns and minimum investments — PBIL sets
// these per client mandate; the figures here are illustrative for comparison.

export const PBIL = {
  name: "Prime Bank Investment Limited",
  short: "PBIL",
  tagline: "Delivering trusted investment solutions, anchored by the strength of Prime Bank PLC.",
  since: "2010",
  phone: "09678-771773",
  portal: "https://portal.pbil.com.bd",
  metrics: [
    { label: "Assets under management", value: "৳20 Bn+" },
    { label: "Portfolio clients", value: "3,000+" },
    { label: "Investing since", value: "2010" },
    { label: "Ranked", value: "#1 Merchant Bank" },
  ],
  track: [
    { label: "Equity Capital Market raised", value: "৳12.25 Bn" },
    { label: "Debt Capital Market raised", value: "৳78.5 Bn" },
    { label: "Landmark transactions", value: "40+" },
  ],
};

export interface Model {
  id: string;
  name: string;
  tagline: string;
  who: string;
  icon: string;
  points: string[];
}

export const MODELS: Model[] = [
  {
    id: "discretionary",
    name: "Discretionary — PrimeInvest",
    tagline: "We manage it for you",
    who: "Best if you want a professional team to make the calls.",
    icon: "🏦",
    points: [
      "PBIL's investment committee builds & rebalances your portfolio",
      "Invested in govt. securities and fundamentally strong listed stocks",
      "Choose a ready scheme matched to your goal",
    ],
  },
  {
    id: "sma",
    name: "Specially Managed Account (SMA)",
    tagline: "Built around you",
    who: "Best for larger portfolios with specific goals.",
    icon: "🎯",
    points: [
      "A personalised strategy tailored to your unique objectives",
      "Dedicated relationship & portfolio manager",
      "Custom mandates, constraints and reporting",
    ],
  },
  {
    id: "non-discretionary",
    name: "Non-Discretionary",
    tagline: "You decide, we advise",
    who: "Best if you want control with expert input.",
    icon: "🧭",
    points: [
      "Strategic insights, research and timely updates",
      "Every buy/sell decision stays in your hands",
      "Execution and settlement handled by PBIL",
    ],
  },
];

export type Objective = "income" | "growth" | "protection" | "shariah" | "lifestage";

export interface Scheme {
  id: string;
  name: string;
  tagline: string;
  objective: Objective;
  bestFor: string;
  risk: "Low" | "Medium" | "High";
  indicativeReturn: string; // p.a., illustrative
  minInvestment: string;
  fee: string; // within PBIL's 0.5–2% band
  icon: string;
  features: string[];
}

export const OBJECTIVES: { key: Objective | "all"; label: string; accent: string }[] = [
  { key: "all", label: "All schemes", accent: "#0f172a" },
  { key: "income", label: "Income", accent: "#0d9488" },
  { key: "growth", label: "Growth", accent: "#F5821E" },
  { key: "protection", label: "Protection", accent: "#0E50A0" },
  { key: "shariah", label: "Shariah", accent: "#7c3aed" },
  { key: "lifestage", label: "For your life stage", accent: "#db2777" },
];

export const ACCENT: Record<Objective, string> = {
  income: "#0d9488",
  growth: "#F5821E",
  protection: "#0E50A0",
  shariah: "#7c3aed",
  lifestage: "#db2777",
};

export const SCHEMES: Scheme[] = [
  {
    id: "secured-income",
    name: "Secured Income",
    tagline: "Steady, predictable income",
    objective: "income",
    bestFor: "Retirees & conservative savers who want regular returns.",
    risk: "Low",
    indicativeReturn: "9–11%",
    minInvestment: "৳5,00,000",
    fee: "0.5–1.0%",
    icon: "🛟",
    features: [
      "Weighted toward government securities & high-grade bonds",
      "Lower volatility, focus on capital stability",
      "Regular income distributions",
    ],
  },
  {
    id: "wealth-maximizer",
    name: "Wealth Maximizer",
    tagline: "Grow capital over the long run",
    objective: "growth",
    bestFor: "Long-horizon investors comfortable with market swings.",
    risk: "High",
    indicativeReturn: "15%+",
    minInvestment: "৳10,00,000",
    fee: "1.5–2.0%",
    icon: "🚀",
    features: [
      "Equity-heavy, actively optimised for growth",
      "High-conviction positions in strong DSE companies",
      "Best suited for a 3-year-plus horizon",
    ],
  },
  {
    id: "capital-protected",
    name: "Capital Protected",
    tagline: "Upside with a safety net",
    objective: "protection",
    bestFor: "Cautious investors who want growth without risking principal.",
    risk: "Low",
    indicativeReturn: "8–12%",
    minInvestment: "৳10,00,000",
    fee: "1.0–1.5%",
    icon: "🛡️",
    features: [
      "Structured to protect your invested capital",
      "Majority in fixed income, a slice in equity for upside",
      "Defined protection horizon",
    ],
  },
  {
    id: "monthly-investment-plan",
    name: "Monthly Investment Plan (MIP)",
    tagline: "Invest a little, every month",
    objective: "income",
    bestFor: "Salaried savers building wealth gradually (SIP-style).",
    risk: "Medium",
    indicativeReturn: "12–14%",
    minInvestment: "৳5,000 / month",
    fee: "1.0–1.5%",
    icon: "📅",
    features: [
      "Contribute monthly or as a lump sum — fully flexible",
      "Rupee-cost averaging smooths out volatility",
      "Balanced equity + fixed-income mix",
    ],
  },
  {
    id: "equity-sharing",
    name: "Equity Sharing",
    tagline: "Direct equity, professionally run",
    objective: "growth",
    bestFor: "Investors who want equity exposure with expert management.",
    risk: "High",
    indicativeReturn: "14–16%",
    minInvestment: "৳5,00,000",
    fee: "1.5–2.0%",
    icon: "📈",
    features: [
      "Concentrated exposure to listed equities",
      "Active stock selection by PBIL's committee",
      "Transparent, shared-growth structure",
    ],
  },
  {
    id: "performance-scheme",
    name: "Performance Scheme",
    tagline: "Fees aligned to results",
    objective: "growth",
    bestFor: "Investors who want the manager's incentives aligned with theirs.",
    risk: "High",
    indicativeReturn: "15%+",
    minInvestment: "৳20,00,000",
    fee: "1.0% + performance fee",
    icon: "🏆",
    features: [
      "Lower base fee plus a performance-linked component",
      "Manager is rewarded when you win",
      "Growth-oriented equity mandate",
    ],
  },
  {
    id: "primeinvest-shariah",
    name: "PrimeInvest Shariah",
    tagline: "Faith-aligned investing",
    objective: "shariah",
    bestFor: "Investors who want fully Shariah-compliant portfolios.",
    risk: "Medium",
    indicativeReturn: "12–14%",
    minInvestment: "৳5,00,000",
    fee: "1.0–1.5%",
    icon: "☪️",
    features: [
      "Invests only in DSE Shariah Index-compliant securities",
      "Screened to exclude interest-based & non-compliant businesses",
      "Sukuk and Shariah money-market instruments",
    ],
  },
  {
    id: "primeinvest-probashi",
    name: "PrimeInvest Probashi",
    tagline: "For Bangladeshis abroad",
    objective: "lifestage",
    bestFor: "Non-resident Bangladeshis investing back home.",
    risk: "Medium",
    indicativeReturn: "11–13%",
    minInvestment: "৳5,00,000",
    fee: "1.0–1.5%",
    icon: "🌍",
    features: [
      "Remittance-friendly funding & repatriable returns",
      "Fully managed remotely — no need to be in-country",
      "Balanced, diversified mandate",
    ],
  },
  {
    id: "primeinvest-women",
    name: "PrimeInvest Women",
    tagline: "Wealth, on your terms",
    objective: "lifestage",
    bestFor: "Women investors seeking tailored guidance and flexibility.",
    risk: "Medium",
    indicativeReturn: "12–14%",
    minInvestment: "৳3,00,000",
    fee: "1.0–1.5%",
    icon: "🌸",
    features: [
      "Advisory tailored to your goals and life stage",
      "Flexible contributions and withdrawals",
      "Diversified, professionally managed portfolio",
    ],
  },
  {
    id: "primeinvest-youth",
    name: "PrimeInvest Youth",
    tagline: "Start early, compound longer",
    objective: "lifestage",
    bestFor: "Young & first-time investors starting their journey.",
    risk: "High",
    indicativeReturn: "13–15%",
    minInvestment: "৳2,000 / month",
    fee: "1.0–1.5%",
    icon: "🌱",
    features: [
      "Low entry point — start small, grow over time",
      "Growth-tilted mix to make the most of a long horizon",
      "Learn as you invest with regular insights",
    ],
  },
];

export const SECTORS = [
  "Banking",
  "Insurance",
  "Power & Energy",
  "Infrastructure",
  "Pharmaceuticals",
  "Cement",
  "Textile & RMG",
  "Food & Allied",
  "IT & Digital Economy",
  "Paper & Printing",
  "Leather",
  "Electronics",
];

export const HOW_IT_WORKS = [
  { icon: "🪪", title: "Open your PMS account", body: "Apply online or book an appointment — quick, paperless onboarding." },
  { icon: "🎯", title: "Set goals & risk profile", body: "Pick a scheme that matches your goal, horizon and risk appetite." },
  { icon: "🏦", title: "The committee invests", body: "PBIL's investment team builds and rebalances your portfolio." },
  { icon: "📊", title: "Track & withdraw", body: "Follow performance with regular reporting; withdraw per your terms." },
];

// ---------------------------------------------------------------------------
// Prime Bank co-brand palette
// ---------------------------------------------------------------------------
export const PRIME_RED = "#C8102E";
export const PRIME_SOFT = "#FDECEE";
export const PRIME_DARK = "#7f1020";

// ---------------------------------------------------------------------------
// Performance data (INDICATIVE / representative — for comparison visuals).
// Trailing returns: 1M & 6M are absolute; 1Y, 3Y, Since-inception are annualised (CAGR).
// ---------------------------------------------------------------------------
export interface Returns {
  m1: number;
  m6: number;
  y1: number;
  y3: number;
  si: number;
}
export type PeriodKey = keyof Returns;

export const PERIODS: { key: PeriodKey; label: string; long: string }[] = [
  { key: "m1", label: "1M", long: "1 month" },
  { key: "m6", label: "6M", long: "6 months" },
  { key: "y1", label: "1Y", long: "1 year (CAGR)" },
  { key: "y3", label: "3Y", long: "3 year (CAGR)" },
  { key: "si", label: "SI", long: "Since inception (CAGR)" },
];

export const BENCHMARK: { name: string } & Returns = { name: "DSEX", m1: 1.6, m6: 6.4, y1: 9.2, y3: 8.0, si: 7.2 };

export const RETURNS: Record<string, Returns> = {
  "secured-income": { m1: 0.8, m6: 5.0, y1: 10.4, y3: 9.6, si: 9.4 },
  "wealth-maximizer": { m1: 3.1, m6: 11.2, y1: 23.5, y3: 17.2, si: 18.8 },
  "capital-protected": { m1: 1.0, m6: 5.6, y1: 11.0, y3: 10.2, si: 10.0 },
  "monthly-investment-plan": { m1: 1.9, m6: 7.4, y1: 13.6, y3: 12.4, si: 12.8 },
  "equity-sharing": { m1: 2.8, m6: 10.1, y1: 20.4, y3: 15.8, si: 16.9 },
  "performance-scheme": { m1: 3.0, m6: 10.8, y1: 22.1, y3: 16.6, si: 18.0 },
  "primeinvest-shariah": { m1: 2.2, m6: 8.2, y1: 14.8, y3: 12.9, si: 13.4 },
  "primeinvest-probashi": { m1: 1.7, m6: 6.9, y1: 12.6, y3: 11.5, si: 11.8 },
  "primeinvest-women": { m1: 1.9, m6: 7.6, y1: 13.8, y3: 12.6, si: 12.9 },
  "primeinvest-youth": { m1: 2.5, m6: 9.2, y1: 16.4, y3: 14.0, si: 14.6 },
};

export interface Slice {
  label: string;
  pct: number;
}
export const ALLOC: Record<Objective, Slice[]> = {
  income: [
    { label: "Govt. Securities", pct: 55 },
    { label: "Corporate Bonds", pct: 25 },
    { label: "Equity", pct: 12 },
    { label: "Cash", pct: 8 },
  ],
  growth: [
    { label: "Listed Equity", pct: 85 },
    { label: "Fixed Income", pct: 8 },
    { label: "Cash", pct: 7 },
  ],
  protection: [
    { label: "Fixed Income", pct: 70 },
    { label: "Equity", pct: 22 },
    { label: "Cash", pct: 8 },
  ],
  shariah: [
    { label: "Shariah Equity", pct: 78 },
    { label: "Sukuk", pct: 15 },
    { label: "Cash", pct: 7 },
  ],
  lifestage: [
    { label: "Listed Equity", pct: 62 },
    { label: "Fixed Income", pct: 30 },
    { label: "Cash", pct: 8 },
  ],
};

export interface RiskMetrics {
  stdDev: number;
  sharpe: number;
  beta: number;
}
export const METRICS: Record<Scheme["risk"], RiskMetrics> = {
  Low: { stdDev: 5.2, sharpe: 1.7, beta: 0.42 },
  Medium: { stdDev: 9.8, sharpe: 1.35, beta: 0.72 },
  High: { stdDev: 15.6, sharpe: 1.12, beta: 0.98 },
};
