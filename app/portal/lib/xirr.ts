// XIRR — internal rate of return for irregularly-timed cashflows (Newton-Raphson
// with a bisection fallback). Returns an annualised rate as a PERCENT, or null if
// it can't be computed (needs at least one negative and one positive cashflow).

export interface CashFlow {
  date: string; // ISO date
  amount: number; // negative = outflow (investment), positive = inflow (current value / redemption)
}

const DAY = 1000 * 60 * 60 * 24;

function yearsBetween(a: number, b: number): number {
  return (b - a) / (DAY * 365);
}

function npv(rate: number, flows: { t: number; amount: number }[], t0: number): number {
  let sum = 0;
  for (const f of flows) sum += f.amount / Math.pow(1 + rate, yearsBetween(t0, f.t));
  return sum;
}

function dNpv(rate: number, flows: { t: number; amount: number }[], t0: number): number {
  let sum = 0;
  for (const f of flows) {
    const y = yearsBetween(t0, f.t);
    sum += (-y * f.amount) / Math.pow(1 + rate, y + 1);
  }
  return sum;
}

export function xirr(cashflows: CashFlow[]): number | null {
  if (cashflows.length < 2) return null;
  const flows = cashflows
    .map((c) => ({ t: Date.parse(c.date), amount: c.amount }))
    .filter((f) => Number.isFinite(f.t))
    .sort((a, b) => a.t - b.t);
  const hasNeg = flows.some((f) => f.amount < 0);
  const hasPos = flows.some((f) => f.amount > 0);
  if (!hasNeg || !hasPos) return null;
  const t0 = flows[0].t;

  // Newton-Raphson
  let rate = 0.1;
  for (let i = 0; i < 100; i++) {
    const f = npv(rate, flows, t0);
    const df = dNpv(rate, flows, t0);
    if (Math.abs(df) < 1e-12) break;
    const next = rate - f / df;
    if (!Number.isFinite(next)) break;
    if (Math.abs(next - rate) < 1e-8) {
      rate = next;
      return rate <= -1 ? null : rate * 100;
    }
    rate = next;
  }

  // Bisection fallback over a wide bracket
  let lo = -0.9999;
  let hi = 10;
  let flo = npv(lo, flows, t0);
  let fhi = npv(hi, flows, t0);
  if (flo * fhi > 0) return null;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const fm = npv(mid, flows, t0);
    if (Math.abs(fm) < 1e-7) return mid * 100;
    if (flo * fm < 0) {
      hi = mid;
      fhi = fm;
    } else {
      lo = mid;
      flo = fm;
    }
  }
  return ((lo + hi) / 2) * 100;
}
