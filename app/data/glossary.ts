export interface Term {
  term: string;
  short?: string;
  definition: string;
  example?: string;
}

export const GLOSSARY: Term[] = [
  {
    term: "Annual Return",
    definition:
      "The percentage gain (or loss) a fund produced over one year, including price change and dividends.",
    example: "A fund whose NAV moved from 10.00 to 10.71 (with no dividend) had a 7.1% annual return.",
  },
  {
    term: "Assets Under Management",
    short: "AUM",
    definition:
      "The total market value of all money the fund is currently managing on behalf of its investors.",
    example: "A fund with 250 crore AUM manages ৳2.5 billion of investor capital.",
  },
  {
    term: "Buy Price",
    definition:
      "The price at which you buy one unit of a fund. Usually slightly above NAV to cover load and fees.",
  },
  {
    term: "Compound Annual Growth Rate",
    short: "CAGR",
    definition:
      "The smooth annual growth rate that would take an investment from its starting to ending value over a period, assuming reinvested returns.",
    example: "5 years, 10.4% CAGR turns ৳100,000 into ৳164,050.",
  },
  {
    term: "Cumulative Return",
    definition:
      "The total percentage change in value since inception (or a chosen start date), regardless of how many years have passed.",
  },
  {
    term: "Dividend Yield",
    definition:
      "The annual dividend a fund pays out, expressed as a percentage of its current NAV.",
    example: "৳0.42 dividend on a ৳12.00 NAV = 3.5% dividend yield.",
  },
  {
    term: "Expense Ratio",
    definition:
      "The percentage of fund assets deducted each year to cover management, admin, and operating costs. Lower is better, holding return constant.",
    example: "1.85% expense ratio quietly costs you ৳1,850 per year on every ৳100,000 invested.",
  },
  {
    term: "Fixed Income Fund",
    definition:
      "A fund that invests primarily in bonds and other fixed-income securities, aiming for stable, predictable returns.",
  },
  {
    term: "Growth Fund",
    definition:
      "An equity-heavy fund that aims for capital appreciation. Higher expected return, higher risk.",
  },
  {
    term: "Lumpsum",
    definition:
      "Investing an entire amount in one go, rather than spreading it out. Higher exposure to timing risk.",
  },
  {
    term: "Net Asset Value",
    short: "NAV",
    definition:
      "The per-unit value of a mutual fund, calculated as (total assets − liabilities) / units outstanding. Recalculated daily.",
  },
  {
    term: "Risk Profile",
    definition:
      "A classification (typically low / medium / high) of how much price volatility a fund or investor can tolerate.",
  },
  {
    term: "Sell Price",
    definition:
      "The price at which you can redeem one unit of a fund back to the AMC. Usually slightly below NAV.",
  },
  {
    term: "Shariah-Compliant Fund",
    definition:
      "A fund whose holdings are screened to meet Islamic finance principles: no interest-bearing debt, no prohibited industries.",
  },
  {
    term: "Systematic Investment Plan",
    short: "SIP",
    definition:
      "A commitment to invest a fixed amount at regular intervals (usually monthly), regardless of price. Averages your cost over time.",
    example: "৳5,000 per month for 10 years at 10% return grows to ~৳10.3 lakh.",
  },
  {
    term: "Volatility",
    definition:
      "How much a fund's price bounces around. Often measured as standard deviation of returns. Higher volatility = higher risk.",
  },
];
