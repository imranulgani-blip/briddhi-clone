// Prime Bank Investment PLC (PBIL) — PrimeInvest marketing content, verbatim from
// PBIL's brief. Rendered by app/pms/PrimeInvestShowcase.tsx as an animated showcase
// at the top of /pms. Every point and line here is shown to the user.

import { PRIME_RED, PRIME_DARK } from "./pms";

export const INTRO = {
  brand: "PrimeInvest",
  by: "Prime Bank Investment PLC (PBIL)",
  hashtag: "#AccessToInvestment",
  lead:
    "At Prime Bank Investment PLC. (PBIL), we believe true wealth is defined by the power to create opportunities, shape futures, and broaden participation in financial growth.",
  vision: [
    "Guided by this vision, PrimeInvest—PBIL's flagship retail investment platform—was established to make investing more accessible, inclusive, and impactful for all.",
    "Anchored in our mission to advance #AccessToInvestment, PrimeInvest offers six curated solutions across four key segments: PrimeInvest Women, PrimeInvest Youth, PrimeInvest Shariah, and PrimeInvest Probashi. Each solution is designed to enable diverse investor groups with tailored strategies, professional portfolio management, and responsible market participation.",
    "Through these initiatives, PBIL is redefining Bangladesh's investment landscape—bridging traditional finance with innovation and creating pathways for every investor to participate in wealth creation.",
  ],
  closing:
    "At PBIL, we do more than manage investments—we help people invest in what truly matters: their future, their families, and the legacy they aspire to build.",
};

export interface Segment {
  key: string;
  name: string;
  icon: string;
  accent: string;
  desc: string;
}

export const SEGMENTS: Segment[] = [
  {
    key: "women",
    name: "PrimeInvest Women",
    icon: "🌸",
    accent: "#db2777",
    desc: "Investing is more than financial independence—it's a statement of confidence and leadership. PrimeInvest Women empowers women to move from managing homes to building legacies with clarity, purpose, and informed financial choice.",
  },
  {
    key: "shariah",
    name: "PrimeInvest Shariah",
    icon: "☪️",
    accent: "#7c3aed",
    desc: "For investors seeking Shariah-aligned opportunities, PrimeInvest Shariah offers a disciplined path where ethical principles and financial growth coexist, allowing wealth creation that honors both faith and value.",
  },
  {
    key: "probashi",
    name: "PrimeInvest Probashi",
    icon: "🌍",
    accent: "#0E50A0",
    desc: "For the global Bangladeshi community, investing back home is a way to stay connected to roots and contribute to national progress. PrimeInvest Probashi transforms distance into opportunity, linking overseas aspirations with meaningful local returns.",
  },
  {
    key: "youth",
    name: "PrimeInvest Youth",
    icon: "🌱",
    accent: "#0d9488",
    desc: "Designed for the emerging generation of investors, PrimeInvest Youth foster smart investing habits early—helping young professionals and first-time investors navigate markets confidently and build a foundation for long-term financial growth.",
  },
];

export interface Stat {
  label: string;
  value: string;
  hero?: boolean; // rendered larger / accented on the card
}

export interface Plan {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  description?: string;
  stats: Stat[]; // highlighted key metrics on the card
  features: string[];
  highlight?: boolean; // the 70:30 co-invest fund
  badge?: string;
  ctaHref?: string;
}

export const PLANS: Plan[] = [
  {
    id: "monthly-investment-plan",
    name: "PrimeInvest Monthly Investment Plan",
    tagline: "Stable return, no risk of loss.",
    icon: "📅",
    stats: [
      { label: "Min / month", value: "৳3,000", hero: true },
      { label: "Tenure", value: "3+ yrs" },
      { label: "Principal", value: "Protected" },
    ],
    description:
      "Start your journey with confidence. Invest as little as BDT 3,000 per month with a minimum tenure of 3 years. PrimeInvest helps you navigate market volatility with discipline, consistency, and purpose.",
    features: [
      "Principal Protection: Your initial deposit is safe if held for at least 3 years.",
      "Low Entry Point: Start with just BDT 3,000 monthly (in multiples of BDT 1,000).",
      "Flexible Tenure: Minimum of 3 years or more.",
      "Compounding Effect: Reinvested profits enhance long-term growth.",
      "Hassle-Free Deposits: Auto-debit on the 15th or 30th of each month.",
      "Tax Benefits: No tax on capital gains up to BDT 50 lac for individuals.",
      "Eligible for tax rebate benefits under the Income Tax Act 2023.",
      "Expert Management: Handled by PBIL's experienced investment management committee.",
    ],
  },
  {
    id: "wealth-maximizer",
    name: "PrimeInvest Wealth Maximizer Scheme",
    tagline: "Long-term growth with balanced risk.",
    icon: "🚀",
    stats: [
      { label: "Low entry", value: "৳2,00,000", hero: true },
      { label: "Tenure", value: "2+ yrs" },
      { label: "Aim", value: "High return" },
    ],
    description:
      "Begin your journey with a lump sum investment of just BDT 200,000 and unlock the potential for substantial long-term returns. Let your capital work harder, backed by disciplined strategy and expert management.",
    features: [
      "Expert Management: Managed by PBIL's seasoned fund managers.",
      "Low Entry Point: Start with BDT 200,000.",
      "Flexible Tenure: Minimum of 2 years or more.",
      "Tax Benefits: No tax on capital gains up to BDT 50 lac for individuals.",
      "Eligible for tax rebate benefits under the Income Tax Act 2023.",
      "Potential High Returns: Aimed at maximizing wealth through strategic investments.",
    ],
  },
  {
    id: "equity-sharing",
    name: "PrimeInvest Equity Sharing Scheme",
    tagline: "Bigger rewards with shared risk.",
    icon: "🤝",
    highlight: true,
    badge: "70 : 30 Co-Invest",
    ctaHref: "#co-invest",
    stats: [
      { label: "Profit / loss split", value: "70 : 30", hero: true },
      { label: "Low entry", value: "৳2,00,000" },
      { label: "Tenure", value: "2+ yrs" },
    ],
    description:
      "Capital investment and profit/loss will be shared between you and us in a 70:30 ratio because true partnership means growing together.",
    features: [
      "Shared Profit and Loss: Profits and losses are split 70:30 (you : PBIL).",
      "Low Entry Point: Start with just BDT 200,000.",
      "Flexible Tenure: Minimum of 2 years or more.",
      "Professional Management: Handled by PBIL's experienced fund managers.",
      "Tax Benefits: No tax on capital gains up to BDT 50 lac for individuals.",
      "Eligible for tax rebate benefits under the Income Tax Act 2023.",
      "Aligned Interests: PBIL invests alongside you, ensuring mutual commitment.",
    ],
  },
  {
    id: "performance-scheme",
    name: "PrimeInvest Performance Scheme",
    tagline: "We win only when you win.",
    icon: "🏆",
    stats: [
      { label: "You keep", value: "80%", hero: true },
      { label: "Fee only above", value: "10%" },
      { label: "Low entry", value: "৳2,00,000" },
    ],
    features: [
      "No Management Fee: Fees are only charged on profits exceeding a 10% annual threshold.",
      "Performance-Based Success Fee: 20% of profits above 10% go to PBIL; you keep 80%.",
      "Low Entry Point: Start with BDT 200,000.",
      "Flexible Tenure: Minimum of 2 years or more.",
      "Tax Benefits: No tax on capital gains up to BDT 50 lac for individuals.",
      "Eligible for tax rebate benefits under the Income Tax Act 2023.",
      "Expert Management: Handled by PBIL's seasoned fund managers.",
    ],
  },
  {
    id: "capital-protected",
    name: "PrimeInvest Capital Protected Scheme",
    tagline: "Return yours, risk ours.",
    icon: "🛡️",
    stats: [
      { label: "Capital protected", value: "100%", hero: true },
      { label: "Target return", value: "~12%" },
      { label: "Min", value: "৳3,00,000" },
    ],
    description:
      "We value your hard-earned money and are committed to protecting your principal while aiming for steady growth.",
    features: [
      "100% capital protection at maturity (PBIL bears any loss).",
      "Minimum investment starts from BDT 300,000 only.",
      "Flexible tenure of 3 years or more.",
      "Attractive potential returns (target ~12% annually).",
      "No tax on capital gains up to BDT 50 lac (individual investors).",
      "Eligible for tax rebate benefits under the Income Tax Act 2023.",
      "Managed by professional and experienced fund managers.",
    ],
  },
  {
    id: "secured-income",
    name: "PrimeInvest Secured Income",
    tagline: "Guaranteed return, no risk.",
    icon: "🛟",
    stats: [
      { label: "Risk-free", value: "100%", hero: true },
      { label: "From", value: "91 days" },
      { label: "Low entry", value: "৳1,00,000" },
    ],
    description:
      "The PrimeInvest Secured Income Scheme offers a simple, stable investment experience through a professionally managed portfolio focused on Government Treasury Bonds and Bills. Designed for peace of mind, it delivers steady annual returns with minimal risk, making your money work smarter, consistently. Enjoy dependable growth, expert management, and the added benefit of tax rebates, all in one seamless solution.",
    features: [
      "100% Risk-Free: Investments in government securities ensure complete safety.",
      "Steady Returns: Double-digit annual returns.",
      "Flexible Tenure: Starts at 91 days, customizable to your goals.",
      "No Upper Limit: Invest as much as you wish.",
      "Low Entry Point: Start with BDT 100,000.",
      "Quick Returns: T-Bill returns within 3 days; bonds pay semi-annually.",
      "Tax Benefits: No tax on capital gains from Treasury Bonds up to BDT 50 lac.",
      "Tax Rebate: Up to BDT 5 lac annually on investments, per the Income Tax Act 2023.",
      "Expert Management: Handled by PBIL's experienced fund managers.",
    ],
  },
];

export const DOCUMENTS = [
  { icon: "🪪", label: "NID verification" },
  { icon: "🏦", label: "Bank details" },
  { icon: "📷", label: "Passport size photo" },
  { icon: "🧾", label: "TIN Certificate (if any)" },
  { icon: "👥", label: "NID and photo of Nominee" },
];

export { PRIME_RED, PRIME_DARK };
