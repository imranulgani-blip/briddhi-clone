export type FundType = "Fixed" | "Balanced" | "Growth" | "Shariah";
export type RiskLevel = "low" | "medium" | "high";

export interface Fund {
  id: number;
  name: string;
  shortName: string;
  fund_type: FundType;
  risk_level: RiskLevel;
  is_shariah_compliant: boolean;
  min_investment: number;
  aum: number;
  current_nav: number;
  buy_price: number;
  sell_price: number;
  annual_return: number;
  three_year_return: number;
  five_year_return: number;
  cumulative_return: number;
  dividend_yield: number;
  expense_ratio: number;
  company: string;
  inception_year: number;
}

export const FUNDS: Fund[] = [
  {
    id: 1,
    name: "Ekush First Balanced Fund",
    shortName: "EFBF",
    fund_type: "Balanced",
    risk_level: "medium",
    is_shariah_compliant: false,
    min_investment: 1000,
    aum: 250_000_000,
    current_nav: 12.457,
    buy_price: 12.7,
    sell_price: 12.2,
    annual_return: 7.1,
    three_year_return: 22.4,
    five_year_return: 41.2,
    cumulative_return: 82.6,
    dividend_yield: 4.2,
    expense_ratio: 1.85,
    company: "Ekush Wealth Management",
    inception_year: 2016,
  },
  {
    id: 2,
    name: "Investit Shariah Growth Fund",
    shortName: "ISGF",
    fund_type: "Shariah",
    risk_level: "medium",
    is_shariah_compliant: true,
    min_investment: 1000,
    aum: 480_000_000,
    current_nav: 15.812,
    buy_price: 16.05,
    sell_price: 15.6,
    annual_return: 9.2,
    three_year_return: 31.6,
    five_year_return: 58.4,
    cumulative_return: 112.5,
    dividend_yield: 3.4,
    expense_ratio: 1.95,
    company: "Investit Asset Management",
    inception_year: 2015,
  },
  {
    id: 3,
    name: "Briddhi Income Fund",
    shortName: "BIF",
    fund_type: "Fixed",
    risk_level: "low",
    is_shariah_compliant: false,
    min_investment: 1000,
    aum: 180_000_000,
    current_nav: 10.984,
    buy_price: 11.15,
    sell_price: 10.85,
    annual_return: 4.8,
    three_year_return: 14.1,
    five_year_return: 26.7,
    cumulative_return: 44.9,
    dividend_yield: 5.0,
    expense_ratio: 1.25,
    company: "Briddhi Financial Technologies",
    inception_year: 2018,
  },
  {
    id: 4,
    name: "Ekush Aggressive Growth Fund",
    shortName: "EAGF",
    fund_type: "Growth",
    risk_level: "high",
    is_shariah_compliant: false,
    min_investment: 5000,
    aum: 620_000_000,
    current_nav: 22.104,
    buy_price: 22.45,
    sell_price: 21.8,
    annual_return: 12.5,
    three_year_return: 46.9,
    five_year_return: 88.2,
    cumulative_return: 175.4,
    dividend_yield: 2.1,
    expense_ratio: 2.15,
    company: "Ekush Wealth Management",
    inception_year: 2014,
  },
  {
    id: 5,
    name: "Investit Balanced Fund",
    shortName: "IBF",
    fund_type: "Balanced",
    risk_level: "medium",
    is_shariah_compliant: false,
    min_investment: 1000,
    aum: 310_000_000,
    current_nav: 13.221,
    buy_price: 13.45,
    sell_price: 13.0,
    annual_return: 6.4,
    three_year_return: 19.8,
    five_year_return: 37.5,
    cumulative_return: 78.2,
    dividend_yield: 3.9,
    expense_ratio: 1.75,
    company: "Investit Asset Management",
    inception_year: 2017,
  },
  {
    id: 6,
    name: "Briddhi Shariah Fixed Income",
    shortName: "BSFI",
    fund_type: "Shariah",
    risk_level: "low",
    is_shariah_compliant: true,
    min_investment: 1000,
    aum: 210_000_000,
    current_nav: 11.402,
    buy_price: 11.55,
    sell_price: 11.25,
    annual_return: 5.6,
    three_year_return: 16.7,
    five_year_return: 31.4,
    cumulative_return: 52.8,
    dividend_yield: 4.8,
    expense_ratio: 1.35,
    company: "Briddhi Financial Technologies",
    inception_year: 2019,
  },
  {
    id: 7,
    name: "Sonchoy High Growth Fund",
    shortName: "SHGF",
    fund_type: "Growth",
    risk_level: "high",
    is_shariah_compliant: false,
    min_investment: 5000,
    aum: 540_000_000,
    current_nav: 19.847,
    buy_price: 20.15,
    sell_price: 19.55,
    annual_return: 11.8,
    three_year_return: 42.1,
    five_year_return: 78.6,
    cumulative_return: 148.9,
    dividend_yield: 2.4,
    expense_ratio: 2.05,
    company: "Sonchoy Asset Management",
    inception_year: 2015,
  },
  {
    id: 8,
    name: "Sonchoy Shariah Equity Fund",
    shortName: "SSEF",
    fund_type: "Shariah",
    risk_level: "high",
    is_shariah_compliant: true,
    min_investment: 2500,
    aum: 395_000_000,
    current_nav: 17.325,
    buy_price: 17.6,
    sell_price: 17.05,
    annual_return: 10.4,
    three_year_return: 36.8,
    five_year_return: 68.1,
    cumulative_return: 128.7,
    dividend_yield: 2.9,
    expense_ratio: 1.9,
    company: "Sonchoy Asset Management",
    inception_year: 2016,
  },
];

export const bdt = (n: number) => "৳" + new Intl.NumberFormat("en-IN").format(Math.round(n));
export const pct = (n: number, sign = false) =>
  `${sign && n > 0 ? "+" : ""}${n.toFixed(1)}%`;
