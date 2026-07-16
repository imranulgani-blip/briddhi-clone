// Real fund data researched from the AMCs' own websites (edgeamc.com, investitaml.com,
// ekushwml.com, midlandamcbd.net) and the LankaBD open-end fund review — July 2026.
//
// metricsReal = core figures (NAV, returns, inception, expense, AUM) are from the source.
// portfolioReal = false means the asset-allocation / sector / top-holdings breakdown is
// REPRESENTATIVE (illustrative, built from fund type + typical DSE blue-chips) because
// AMCs disclose those only in monthly factsheet PDFs, not on their websites.

export interface Person {
  name: string;
  title: string;
  credential?: string;
}

export interface Md {
  name: string;
  title: string;
  bio: string;
}

export interface Amc {
  slug: string; // matches /fund-logos/<slug>.png
  name: string;
  since: string;
  philosophy: string;
  blurb: string;
  team: Person[];
  md: Md; // current Managing Director / CEO (researched from the AMC's site & press)
  color: string; // brand accent for this AMC's themed pages
  soft: string; // very light tint of the accent (section backgrounds)
}

export interface Holding {
  name: string;
  ticker?: string;
  sector: string;
  weight: number; // % of NAV
}

export interface Slice {
  label: string;
  pct: number;
}

export interface Fund {
  id: string; // slug
  name: string;
  ticker: string;
  amc: string; // Amc.slug
  type: "Equity" | "Balanced" | "Fixed Income" | "Shariah Equity";
  risk: "Low" | "Medium" | "High";
  shariah: boolean;
  structure: string;
  inception: string; // display
  inceptionMonths: number; // months since inception (for the NAV chart)
  nav: number;
  aum: number | null; // BDT
  minInvestment: number;
  sip: boolean;
  ytd: number | null;
  sinceInception: number | null; // cumulative %
  annualized: number | null;
  expenseRatio: number | null;
  exitLoad: string | null;
  objective: string;
  managerName: string;
  assetClasses: Slice[];
  sectors: Slice[]; // empty for pure income funds
  topHoldings: Holding[];
  metricsReal: boolean;
  portfolioReal: boolean;
}

// ---------------------------------------------------------------------------
// AMCs
// ---------------------------------------------------------------------------
export const AMCS: Record<string, Amc> = {
  edge: {
    slug: "edge",
    name: "EDGE Asset Management",
    since: "Licensed Feb 2018",
    philosophy:
      "A thorough, fundamental research-based approach — identifying companies with strong corporate governance, capable management, durable business models and attractive valuations, then holding high-conviction, concentrated positions for a 3-year-plus horizon.",
    blurb:
      "Incorporated in 2017 and licensed by BSEC in February 2018, EDGE AMC manages mutual funds and separately managed accounts for institutions, HNWIs and retail investors across equity and fixed-income strategies. The team includes 5 CFA charterholders with experience at IFC and Tellimer.",
    team: [
      { name: "Asif Khan", title: "Chairman", credential: "CFA" },
      { name: "Ali Imam", title: "Managing Director & CEO", credential: "CFA" },
      { name: "Khandakar Safwan Saad", title: "Chief Investment Officer", credential: "CFA" },
      { name: "S. M. Sadekul Islam", title: "Manager, Finance & Operations" },
    ],
    md: {
      name: "Ali Imam, CFA",
      title: "Founder & CEO",
      bio: "Founder and CEO of EDGE AMC and a CFA charterholder, with a background in investment research and management at BRAC EPL Stock Brokerage and Eastern Bank.",
    },
    color: "#0E50A0", // EDGE — blue
    soft: "#EEF4FC",
  },
  ekush: {
    slug: "ekush",
    name: "Ekush Wealth Management",
    since: "Licensed Nov 2019",
    philosophy:
      "‘Wealth management for the greater good’ — prioritising serving a greater number of clients over chasing total assets, so investing is accessible regardless of wealth size.",
    blurb:
      "One of Bangladesh's rare management-owned AMCs, Ekush serves 500+ investors through three open-end mutual funds and separately managed accounts, and partners with BRAC Bank on distribution. Its team brings together 3 Fellow Chartered Accountants (FCA) and 3 CFA charterholders with 100+ years of combined experience.",
    team: [
      { name: "Ekush Investment Committee", title: "Portfolio Management", credential: "3× FCA · 3× CFA" },
    ],
    md: {
      name: "Kazi Ahsan Maruf, CFA",
      title: "Managing Director",
      bio: "Managing Director of Ekush and a CFA charterholder with 17+ years in investment management; previously CEO of IL Capital. BBA in Finance from the University of Dhaka.",
    },
    color: "#F5821E", // Ekush — orange
    soft: "#FFF4EA",
  },
  investit: {
    slug: "investit",
    name: "Investit Asset Management",
    since: "Fund launched Feb 2025",
    philosophy:
      "A disciplined, research-led methodology focused on high-potential growth stocks, aiming for strong long-term capital gains through careful stock selection and risk management.",
    blurb:
      "Founded and led by seasoned capital market professionals and fully licensed by BSEC, Investit offers professional fund management and investment advisory, with SIP options and regular performance reporting.",
    team: [{ name: "Investit Investment Team", title: "Fund Management", credential: "Capital-market professionals" }],
    md: {
      name: "Mohammad Emran Hasan",
      title: "Founder, MD & CEO",
      bio: "Founder, Managing Director & CEO of Investit with 16+ years in fund and risk management. Previously founding CEO of Shanta Asset Management, which won BSEC's ‘Best Asset Management Company’ award. MBA, University of Dhaka; BSc in Mechanical Engineering, BUET.",
    },
    color: "#12A150", // Investit — green
    soft: "#ECFDF3",
  },
  midland: {
    slug: "midland",
    name: "Midland Bank Asset Management",
    since: "Growth Fund launched Jun 2026",
    philosophy:
      "A disciplined investment approach backed by the governance, stability and trust of a leading bank — helping investors navigate opportunities with clarity and confidence.",
    blurb:
      "A subsidiary of Midland Bank PLC, Midland Bank Asset Management brings bank-grade governance to mutual-fund investing in Bangladesh, with a professional team focused on local and global market opportunities.",
    team: [{ name: "Midland AMC Investment Team", title: "Fund Management", credential: "Backed by Midland Bank PLC" }],
    md: {
      name: "Mohammad Samir Uddin",
      title: "Chief Executive Officer",
      bio: "CEO of Midland Bank Asset Management with 14+ years in Bangladesh's capital market and banking. Previously CEO of Shahjalal Asset Management and MBL Asset Management.",
    },
    color: "#EF6461", // Midland — light red
    soft: "#FEF2F2",
  },
};

// ---------------------------------------------------------------------------
// Representative portfolio building blocks (illustrative — not from factsheets)
// ---------------------------------------------------------------------------
const EQUITY_TOP: Holding[] = [
  { name: "Grameenphone", ticker: "GP", sector: "Telecom", weight: 9.4 },
  { name: "Square Pharmaceuticals", ticker: "SQURPHARMA", sector: "Pharma & Chemicals", weight: 8.6 },
  { name: "BRAC Bank", ticker: "BRACBANK", sector: "Banks & NBFI", weight: 7.2 },
  { name: "Renata", ticker: "RENATA", sector: "Pharma & Chemicals", weight: 6.5 },
  { name: "British American Tobacco BD", ticker: "BATBC", sector: "Consumer & Food", weight: 5.8 },
  { name: "LafargeHolcim BD", ticker: "LHBL", sector: "Cement & Materials", weight: 5.1 },
  { name: "Islami Bank Bangladesh", ticker: "IBBL", sector: "Banks & NBFI", weight: 4.6 },
  { name: "Beximco Pharma", ticker: "BXPHARMA", sector: "Pharma & Chemicals", weight: 4.2 },
  { name: "Marico Bangladesh", ticker: "MARICO", sector: "Consumer & Food", weight: 3.8 },
  { name: "Berger Paints Bangladesh", ticker: "BERGERPBL", sector: "Pharma & Chemicals", weight: 3.3 },
];

const SHARIAH_TOP: Holding[] = [
  { name: "Square Pharmaceuticals", ticker: "SQURPHARMA", sector: "Pharma & Chemicals", weight: 9.1 },
  { name: "Grameenphone", ticker: "GP", sector: "Telecom", weight: 8.3 },
  { name: "Marico Bangladesh", ticker: "MARICO", sector: "Consumer & Food", weight: 7.0 },
  { name: "Renata", ticker: "RENATA", sector: "Pharma & Chemicals", weight: 6.4 },
  { name: "LafargeHolcim BD", ticker: "LHBL", sector: "Cement & Materials", weight: 5.6 },
  { name: "Berger Paints Bangladesh", ticker: "BERGERPBL", sector: "Pharma & Chemicals", weight: 5.0 },
  { name: "Olympic Industries", ticker: "OLYMPIC", sector: "Consumer & Food", weight: 4.5 },
  { name: "RAK Ceramics", ticker: "RAKCERAMIC", sector: "Ceramics", weight: 4.0 },
  { name: "Islami Bank Bangladesh", ticker: "IBBL", sector: "Islamic Banking", weight: 3.7 },
  { name: "Singer Bangladesh", ticker: "SINGERBD", sector: "Consumer & Food", weight: 3.2 },
];

const BALANCED_TOP: Holding[] = [
  { name: "Bangladesh Govt. Treasury Bond 2030", sector: "Govt. Securities", weight: 14.0 },
  { name: "Grameenphone", ticker: "GP", sector: "Telecom", weight: 6.8 },
  { name: "Square Pharmaceuticals", ticker: "SQURPHARMA", sector: "Pharma & Chemicals", weight: 6.2 },
  { name: "BRAC Bank", ticker: "BRACBANK", sector: "Banks & NBFI", weight: 5.4 },
  { name: "Fixed Deposit (multiple banks)", sector: "Cash & FDR", weight: 8.0 },
  { name: "Renata", ticker: "RENATA", sector: "Pharma & Chemicals", weight: 4.6 },
  { name: "LafargeHolcim BD", ticker: "LHBL", sector: "Cement & Materials", weight: 4.0 },
  { name: "British American Tobacco BD", ticker: "BATBC", sector: "Consumer & Food", weight: 3.6 },
  { name: "Beximco Pharma", ticker: "BXPHARMA", sector: "Pharma & Chemicals", weight: 3.2 },
  { name: "Marico Bangladesh", ticker: "MARICO", sector: "Consumer & Food", weight: 2.9 },
];

const INCOME_TOP: Holding[] = [
  { name: "Bangladesh Govt. Treasury Bond 2029", sector: "Govt. Securities", weight: 18.0 },
  { name: "Fixed Deposit (multiple banks)", sector: "FDR", weight: 15.0 },
  { name: "Bangladesh Govt. Treasury Bill", sector: "Govt. Securities", weight: 12.0 },
  { name: "Govt. Treasury Bond 2032", sector: "Govt. Securities", weight: 9.0 },
  { name: "BRAC Bank Subordinated Bond", sector: "Corporate Bond", weight: 8.5 },
  { name: "City Bank Perpetual Bond", sector: "Corporate Bond", weight: 7.0 },
  { name: "Cash & Equivalents", sector: "Cash", weight: 7.0 },
  { name: "IPDC Finance Bond", sector: "Corporate Bond", weight: 6.0 },
  { name: "Commercial Paper", sector: "Money Market", weight: 5.5 },
  { name: "PRAN Agro Bond", sector: "Corporate Bond", weight: 5.0 },
];

const EQUITY_CLASSES: Slice[] = [
  { label: "Listed Equity", pct: 88 },
  { label: "Cash & Equivalents", pct: 7 },
  { label: "Fixed Income", pct: 5 },
];
const BALANCED_CLASSES: Slice[] = [
  { label: "Listed Equity", pct: 55 },
  { label: "Govt. Securities & Bonds", pct: 35 },
  { label: "Cash & Equivalents", pct: 10 },
];
const INCOME_CLASSES: Slice[] = [
  { label: "Govt. Securities", pct: 45 },
  { label: "Corporate Bonds", pct: 30 },
  { label: "FDR & Money Market", pct: 18 },
  { label: "Cash", pct: 7 },
];
const SHARIAH_CLASSES: Slice[] = [
  { label: "Shariah Equity", pct: 85 },
  { label: "Sukuk / Islamic Bonds", pct: 8 },
  { label: "Cash", pct: 7 },
];

const EQUITY_SECTORS: Slice[] = [
  { label: "Pharma & Chemicals", pct: 26 },
  { label: "Banks & NBFI", pct: 22 },
  { label: "Telecom", pct: 14 },
  { label: "Consumer & Food", pct: 12 },
  { label: "Cement & Materials", pct: 9 },
  { label: "Fuel & Power", pct: 7 },
  { label: "Engineering", pct: 6 },
  { label: "Others", pct: 4 },
];
const SHARIAH_SECTORS: Slice[] = [
  { label: "Pharma & Chemicals", pct: 30 },
  { label: "Consumer & Food", pct: 18 },
  { label: "Telecom", pct: 16 },
  { label: "Cement & Materials", pct: 12 },
  { label: "Ceramics", pct: 8 },
  { label: "Islamic Banking", pct: 8 },
  { label: "Others", pct: 8 },
];

// ---------------------------------------------------------------------------
// Funds
// ---------------------------------------------------------------------------
export const FUNDS: Fund[] = [
  // ---- EDGE ----
  {
    id: "edge-bangladesh-mutual-fund",
    name: "EDGE Bangladesh Mutual Fund",
    ticker: "EDGEBDMF",
    amc: "edge",
    type: "Balanced",
    risk: "Medium",
    shariah: false,
    structure: "Open-end",
    inception: "02 Aug 2018",
    inceptionMonths: 95,
    nav: 15.41,
    aum: 195_443_221,
    minInvestment: 1000,
    sip: true,
    ytd: 14.7,
    sinceInception: 109.6,
    annualized: 9.78,
    expenseRatio: 2.5,
    exitLoad: "2% within 60 days",
    objective:
      "A balanced fund blending listed equity with fixed income to pursue steady long-term growth while cushioning volatility — EDGE's flagship, launched in 2018.",
    managerName: "Khandakar Safwan Saad, CFA",
    assetClasses: BALANCED_CLASSES,
    sectors: EQUITY_SECTORS,
    topHoldings: BALANCED_TOP,
    metricsReal: true,
    portfolioReal: false,
  },
  {
    id: "edge-amc-growth-fund",
    name: "EDGE AMC Growth Fund",
    ticker: "EDGEAMCGF",
    amc: "edge",
    type: "Equity",
    risk: "High",
    shariah: false,
    structure: "Open-end",
    inception: "05 Sep 2019",
    inceptionMonths: 82,
    nav: 16.49,
    aum: 393_610_085,
    minInvestment: 1000,
    sip: true,
    ytd: 15.0,
    sinceInception: 101.2,
    annualized: 10.76,
    expenseRatio: 2.39,
    exitLoad: "2% within 60 days",
    objective:
      "An equity-focused growth fund holding high-conviction, concentrated positions in quality DSE companies for a 3-year-plus horizon.",
    managerName: "Khandakar Safwan Saad, CFA",
    assetClasses: EQUITY_CLASSES,
    sectors: EQUITY_SECTORS,
    topHoldings: EQUITY_TOP,
    metricsReal: true,
    portfolioReal: false,
  },
  {
    id: "edge-high-quality-income-fund",
    name: "EDGE High Quality Income Fund",
    ticker: "EDGEHQIF",
    amc: "edge",
    type: "Fixed Income",
    risk: "Low",
    shariah: false,
    structure: "Open-end",
    inception: "10 Feb 2022",
    inceptionMonths: 53,
    nav: 13.33,
    aum: 708_106_650,
    minInvestment: 1000,
    sip: true,
    ytd: 5.4,
    sinceInception: 51.3,
    annualized: 9.81,
    expenseRatio: 1.01,
    exitLoad: "1% within 30 days",
    objective:
      "A low-risk fixed-income fund investing in high-quality government securities, corporate bonds and money-market instruments for stable income.",
    managerName: "Khandakar Safwan Saad, CFA",
    assetClasses: INCOME_CLASSES,
    sectors: [],
    topHoldings: INCOME_TOP,
    metricsReal: true,
    portfolioReal: false,
  },
  {
    id: "edge-al-amin-shariah-consumer-fund",
    name: "EDGE Al-Amin Shariah Consumer Fund",
    ticker: "EDGEALAMIN",
    amc: "edge",
    type: "Shariah Equity",
    risk: "High",
    shariah: true,
    structure: "Open-end",
    inception: "11 Sep 2022",
    inceptionMonths: 46,
    nav: 11.52,
    aum: 143_071_983,
    minInvestment: 1000,
    sip: true,
    ytd: 6.9,
    sinceInception: 20.5,
    annualized: 4.97,
    expenseRatio: 2.66,
    exitLoad: "1% within 60 days",
    objective:
      "A Shariah-compliant equity fund focused on consumer and other halal sectors, screened to exclude interest-based and non-compliant businesses.",
    managerName: "Khandakar Safwan Saad, CFA",
    assetClasses: SHARIAH_CLASSES,
    sectors: SHARIAH_SECTORS,
    topHoldings: SHARIAH_TOP,
    metricsReal: true,
    portfolioReal: false,
  },
  // ---- Ekush ----
  {
    id: "ekush-first-unit-fund",
    name: "Ekush First Unit Fund",
    ticker: "EKUSH1STUF",
    amc: "ekush",
    type: "Balanced",
    risk: "Medium",
    shariah: false,
    structure: "Open-end",
    inception: "2021",
    inceptionMonths: 60,
    nav: 15.43,
    aum: null,
    minInvestment: 1000,
    sip: true,
    ytd: 13.6,
    sinceInception: 54.3,
    annualized: null,
    expenseRatio: null,
    exitLoad: null,
    objective:
      "An open-end fund holding a balanced portfolio of equity and debt securities — Ekush's first fund, designed for accessible, diversified long-term growth.",
    managerName: "Ekush Investment Committee",
    assetClasses: BALANCED_CLASSES,
    sectors: EQUITY_SECTORS,
    topHoldings: BALANCED_TOP,
    metricsReal: true,
    portfolioReal: false,
  },
  {
    id: "ekush-growth-fund",
    name: "Ekush Growth Fund",
    ticker: "EKUSHGF",
    amc: "ekush",
    type: "Equity",
    risk: "High",
    shariah: false,
    structure: "Open-end",
    inception: "2021",
    inceptionMonths: 54,
    nav: 13.13,
    aum: null,
    minInvestment: 1000,
    sip: true,
    ytd: 13.8,
    sinceInception: 31.3,
    annualized: null,
    expenseRatio: null,
    exitLoad: null,
    objective:
      "An open-end fund with a greater emphasis on equity investments, seeking higher long-term capital growth for investors comfortable with market volatility.",
    managerName: "Ekush Investment Committee",
    assetClasses: EQUITY_CLASSES,
    sectors: EQUITY_SECTORS,
    topHoldings: EQUITY_TOP,
    metricsReal: true,
    portfolioReal: false,
  },
  {
    id: "ekush-stable-return-fund",
    name: "Ekush Stable Return Fund",
    ticker: "EKUSHSRF",
    amc: "ekush",
    type: "Fixed Income",
    risk: "Low",
    shariah: false,
    structure: "Open-end",
    inception: "2020",
    inceptionMonths: 66,
    nav: 14.52,
    aum: null,
    minInvestment: 1000,
    sip: true,
    ytd: 5.4,
    sinceInception: 45.2,
    annualized: null,
    expenseRatio: null,
    exitLoad: null,
    objective:
      "An open-end fund investing exclusively in fixed-income securities and IPOs, targeting stable, lower-volatility returns.",
    managerName: "Ekush Investment Committee",
    assetClasses: INCOME_CLASSES,
    sectors: [],
    topHoldings: INCOME_TOP,
    metricsReal: true,
    portfolioReal: false,
  },
  // ---- Investit ----
  {
    id: "investit-growth-fund",
    name: "Investit Growth Fund",
    ticker: "INVSTGF",
    amc: "investit",
    type: "Equity",
    risk: "High",
    shariah: false,
    structure: "Open-end",
    inception: "Feb 2025",
    inceptionMonths: 17,
    nav: 11.69,
    aum: null,
    minInvestment: 1000,
    sip: true,
    ytd: 8.6,
    sinceInception: 18.3,
    annualized: null,
    expenseRatio: null,
    exitLoad: null,
    objective:
      "An equity-focused fund targeting high-potential growth stocks, aiming for strong long-term capital gains through disciplined, research-led stock selection.",
    managerName: "Investit Investment Team",
    assetClasses: EQUITY_CLASSES,
    sectors: EQUITY_SECTORS,
    topHoldings: EQUITY_TOP,
    metricsReal: true,
    portfolioReal: false,
  },
  // ---- Midland ----
  {
    id: "midland-bank-growth-fund",
    name: "Midland Bank Growth Fund",
    ticker: "MDBGF",
    amc: "midland",
    type: "Equity",
    risk: "High",
    shariah: false,
    structure: "Open-end",
    inception: "07 Jun 2026",
    inceptionMonths: 1,
    nav: 10.05,
    aum: null,
    minInvestment: 1000,
    sip: true,
    ytd: 0.5,
    sinceInception: 0.5,
    annualized: null,
    expenseRatio: null,
    exitLoad: null,
    objective:
      "A newly launched, bank-backed equity growth fund seeking long-term capital appreciation with the governance and stability of Midland Bank PLC.",
    managerName: "Midland AMC Investment Team",
    assetClasses: EQUITY_CLASSES,
    sectors: EQUITY_SECTORS,
    topHoldings: EQUITY_TOP,
    metricsReal: true,
    portfolioReal: false,
  },
];

export const AMC_LIST = Object.values(AMCS);

export function getFund(id: string): Fund | undefined {
  return FUNDS.find((f) => f.id === id);
}

export const bdtCompact = (n: number | null): string => {
  if (n == null) return "Not disclosed";
  if (n >= 1e7) return `৳${(n / 1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `৳${(n / 1e5).toFixed(2)} Lakh`;
  return `৳${n.toLocaleString("en-IN")}`;
};
