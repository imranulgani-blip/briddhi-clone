"use client";

import { bdt, fmtDate } from "../lib/format";
import type { Investor, PortfolioPayload, Transaction } from "../lib/types";

interface StatementData {
  investor: Investor;
  asOf: string;
  period: { from: string; to: string };
  portfolio: PortfolioPayload;
  transactions: Transaction[];
  taxReport: {
    period: { from: string; to: string };
    totalInvestedInPeriod: number;
    transactionCount: number;
    realizedGains: number | null;
    dividendIncome: number | null;
    note: string;
  };
}

// ---- Briddhi brand palette (from the logo) ----
const BLUE = "#0E50A0";
const BLUE_DARK = "#0A3A76";
const ORANGE = "#F5821E";
const ORANGE_SOFT = "#FEF2E6";
const GREEN = "#16A34A";
const RED = "#DC2626";
const INK = "#1E293B";
const MUTED = "#64748B";
const LINE = "#E5E9F1";
const SOFT = "#F8FAFC";

const DONUT = [ORANGE, BLUE, "#F6B24B", "#3B82C4", BLUE_DARK, "#F9CE9A", "#6AA0D0", "#0C2E5C", "#FBD9B0", "#93B7DA"];

// Per-AMC brand identity for the allocation badges.
const AMC_COLOR: Record<string, string> = {
  Investit: "#0E50A0",
  Ekush: "#F5821E",
  EDGE: "#0A3A76",
  VIPB: "#1F8A4C",
  "Midland Bank": "#B23A48",
  CWT: "#6D28D9",
};
const AMC_MONO: Record<string, string> = {
  Investit: "IN",
  Ekush: "EK",
  EDGE: "ED",
  VIPB: "VI",
  "Midland Bank": "MB",
  CWT: "CW",
};
// Real AMC logos (in public/fund-logos/). Any AMC without a file falls back to a monogram.
const AMC_LOGO: Record<string, string> = {
  Investit: "/fund-logos/investit.png",
  Ekush: "/fund-logos/ekush.png",
  EDGE: "/fund-logos/edge.png",
  VIPB: "/fund-logos/vipb.png",
  "Midland Bank": "/fund-logos/midland.png",
};

// Prominent ("macro") logo tile shown at the left of each allocation row.
function AmcLogo({ amc, w = 66, h = 42 }: { amc: string; w?: number; h?: number }) {
  const file = AMC_LOGO[amc];
  if (file) {
    return (
      <span
        style={{
          width: w,
          height: h,
          borderRadius: 8,
          background: "#fff",
          border: `1px solid ${LINE}`,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 5,
          flexShrink: 0,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={file} alt={amc} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
      </span>
    );
  }
  const color = AMC_COLOR[amc] ?? BLUE;
  const mono = AMC_MONO[amc] ?? amc.slice(0, 2).toUpperCase();
  return (
    <span
      style={{
        width: h,
        height: h,
        borderRadius: 8,
        background: color,
        color: "#fff",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: h * 0.36,
        fontWeight: 800,
        flexShrink: 0,
      }}
    >
      {mono}
    </span>
  );
}

// Short code from a fund name, e.g. "Investit Growth Fund" -> "IGF".
function abbrev(name: string): string {
  const skip = new Set(["the", "of", "and", "for", "first", "bank"]);
  const letters = name
    .split(/\s+/)
    .filter((w) => w && !skip.has(w.toLowerCase()))
    .map((w) => w[0].toUpperCase())
    .join("");
  return letters.slice(0, 5) || name.slice(0, 4).toUpperCase();
}

const na = (color = MUTED) => <span style={{ color, fontWeight: 400 }}>N/A</span>;

export default function StatementDocument({ data, showTax }: { data: StatementData; showTax: boolean }) {
  const { investor, portfolio, transactions, taxReport } = data;
  const holdings = portfolio.holdings;
  const k = portfolio.kpis;

  const investedTotal = k.netInvested;
  const investingSince = holdings.reduce(
    (m, h) => (h.firstDate < m ? h.firstDate : m),
    holdings[0]?.firstDate ?? data.period.from
  );
  const periodFrom = data.period.from === "0000-01-01" ? investingSince : data.period.from;
  const unitsHeld = holdings.length > 0 && holdings.every((h) => h.units != null)
    ? holdings.reduce((s, h) => s + (h.units ?? 0), 0)
    : null;
  const absReturnPct = k.netGainLossPct;

  return (
    <div
      className="statement-paper"
      style={{
        background: "#fff",
        color: INK,
        borderRadius: 14,
        overflow: "hidden",
        boxShadow: "0 24px 60px -30px rgba(0,0,0,0.6)",
        fontSize: 13,
        lineHeight: 1.4,
      }}
    >
      <div style={{ padding: "30px 34px 26px" }}>
        {/* ============ HEADER ============ */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/briddhi-logo.png" alt="Briddhi" style={{ height: 46, width: "auto", marginTop: 4 }} />
          <div style={{ textAlign: "right" }}>
            <div style={{ color: BLUE, fontSize: 30, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1 }}>
              Portfolio Statement
            </div>
            <div style={{ marginTop: 8, fontSize: 12, color: MUTED }}>
              Statement period: {fmtDate(periodFrom)} – {fmtDate(data.period.to)}
            </div>
            <div style={{ fontSize: 12, color: MUTED }}>Base currency: BDT (৳)</div>
            <div
              style={{
                display: "inline-block",
                marginTop: 8,
                border: `1.5px solid ${ORANGE}`,
                color: ORANGE,
                borderRadius: 6,
                padding: "4px 10px",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.04em",
              }}
            >
              GENERATED BY BRIDDHI STUDIO
            </div>
          </div>
        </div>

        {/* ============ INVESTOR INFO BAR ============ */}
        <div
          style={{
            marginTop: 22,
            display: "grid",
            gridTemplateColumns: "repeat(5,1fr)",
            border: `1px solid ${LINE}`,
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          {[
            ["INVESTOR NAME", investor.name],
            ["INVESTOR CODE", investor.id],
            ["ACCOUNT TYPE", "Individual"],
            ["INVESTING SINCE", fmtDate(investingSince)],
            ["HOLDINGS", `${portfolio.fundCount} Funds`],
          ].map(([label, value], i) => (
            <div key={label} style={{ padding: "12px 14px", borderLeft: i === 0 ? "none" : `1px solid ${LINE}` }}>
              <div style={{ fontSize: 10, color: MUTED, letterSpacing: "0.05em" }}>{label}</div>
              <div style={{ marginTop: 4, fontWeight: 700, color: INK, fontSize: 13 }}>{value}</div>
            </div>
          ))}
        </div>

        {/* ============ KPI CARDS ============ */}
        <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10 }}>
          <Kpi label="NET INVESTED" value={bdt(investedTotal)} sub={`${portfolio.txnCount} contributions`} />
          <Kpi label="CURRENT VALUE" value={k.currentValue == null ? null : bdt(k.currentValue)} sub={unitsHeld == null ? "units N/A" : `${unitsHeld.toLocaleString(undefined, { maximumFractionDigits: 0 })} units held`} />
          <Kpi
            label="NET GAIN / LOSS"
            value={k.netGainLoss == null ? null : `${k.netGainLoss >= 0 ? "+ " : "− "}${bdt(Math.abs(k.netGainLoss))}`}
            sub="Unrealised"
            color={k.netGainLoss == null ? undefined : k.netGainLoss >= 0 ? GREEN : RED}
          />
          <Kpi
            label="ABSOLUTE RETURN"
            value={absReturnPct == null ? null : `${absReturnPct >= 0 ? "+" : ""}${absReturnPct.toFixed(2)}%`}
            sub="Since inception"
            color={absReturnPct == null ? undefined : absReturnPct >= 0 ? GREEN : RED}
          />
          <Kpi
            label="ANNUALISED (XIRR)"
            value={k.xirrPct == null ? null : `${k.xirrPct.toFixed(2)}%`}
            sub="Money-weighted"
            highlight
          />
        </div>

        {/* ============ ALLOCATION + ACTIVITY ============ */}
        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 14 }}>
          <Allocation holdings={holdings} total={investedTotal} />
          <Activity
            from={periodFrom}
            to={data.period.to}
            opening={portfolio.activity.openingInvested}
            contributions={portfolio.activity.contributions}
            withdrawals={portfolio.activity.withdrawals}
            marketGainLoss={portfolio.activity.marketGainLoss}
            closing={portfolio.activity.closingValue ?? portfolio.activity.closingInvested}
            closingIsCost={portfolio.activity.closingValue == null}
          />
        </div>

        {/* ============ HOLDINGS & RETURNS ============ */}
        <div style={{ marginTop: 22 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: INK, margin: "0 0 10px" }}>Holdings &amp; Returns</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: BLUE, color: "#fff" }}>
                {["FUND", "UNITS", "WTD. AVG COST", "CURRENT NAV", "INVESTED (৳)", "MARKET VALUE (৳)", "GAIN / LOSS (৳)", "WEIGHT", "ABS. RETURN", "XIRR"].map((h, i) => (
                  <th key={h} style={{ padding: "9px 10px", fontSize: 10.5, textAlign: i === 0 ? "left" : "right", letterSpacing: "0.03em", fontWeight: 700 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {holdings.map((h, idx) => (
                <tr key={h.fundId} style={{ borderBottom: `1px solid ${LINE}` }}>
                  <td style={{ padding: "9px 10px" }}>
                    <div style={{ fontWeight: 700, color: BLUE }}>{abbrev(h.fundName)}</div>
                    <div style={{ fontSize: 10.5, color: MUTED }}>{h.fundName}</div>
                  </td>
                  <Num v={h.units} d={0} />
                  <Num v={h.avgCost} d={4} />
                  <Num v={h.currentNav} d={4} />
                  <Num v={h.invested} money />
                  <Num v={h.marketValue} money />
                  <Num v={h.gainLoss} money tone />
                  <td style={{ padding: "9px 10px", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, justifyContent: "flex-end" }}>
                      {h.weightPct.toFixed(1)}%
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: DONUT[idx % DONUT.length] }} />
                    </span>
                  </td>
                  <Num v={h.absoluteReturnPct} pct tone />
                  <Num v={h.xirrPct} pct tone bold />
                </tr>
              ))}
              {/* TOTAL */}
              <tr style={{ background: SOFT, fontWeight: 800 }}>
                <td style={{ padding: "10px" }}>TOTAL</td>
                <Num v={unitsHeld} d={0} bold />
                <td />
                <td />
                <Num v={investedTotal} money bold />
                <Num v={k.currentValue} money bold />
                <Num v={k.netGainLoss} money tone bold />
                <td style={{ padding: "10px", textAlign: "right" }}>100.0%</td>
                <Num v={absReturnPct} pct tone bold />
                <Num v={k.xirrPct} pct tone bold />
              </tr>
            </tbody>
          </table>
        </div>

        {/* ============ TRANSACTIONS ============ */}
        <div style={{ marginTop: 22, breakInside: "avoid" }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: INK, margin: "0 0 10px" }}>
            Transactions ({transactions.length})
          </h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${LINE}` }}>
                {["DATE", "FUND", "TYPE", "AMOUNT (৳)"].map((h, i) => (
                  <th key={h} style={{ padding: "7px 10px", fontSize: 10.5, color: MUTED, textAlign: i === 3 ? "right" : "left", letterSpacing: "0.03em" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} style={{ borderBottom: `1px solid ${SOFT}` }}>
                  <td style={{ padding: "7px 10px" }}>{fmtDate(t.txn_date)}</td>
                  <td style={{ padding: "7px 10px" }}>{t.fund_name}</td>
                  <td style={{ padding: "7px 10px" }}>
                    <span style={{ fontSize: 10.5, color: t.type === "SIP" ? BLUE : ORANGE, fontWeight: 700 }}>{t.type}</span>
                  </td>
                  <td style={{ padding: "7px 10px", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{bdt(t.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ============ TAX REPORT ============ */}
        {showTax && (
          <div style={{ marginTop: 22, breakInside: "avoid" }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: INK, margin: "0 0 10px" }}>Capital Gains / Tax Report</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                {[
                  ["Total invested in period", bdt(taxReport.totalInvestedInPeriod)],
                  ["Transactions", String(taxReport.transactionCount)],
                  ["Realized capital gains", taxReport.realizedGains == null ? "N/A" : bdt(taxReport.realizedGains)],
                  ["Dividend income", taxReport.dividendIncome == null ? "N/A" : bdt(taxReport.dividendIncome)],
                ].map(([l, v]) => (
                  <tr key={l} style={{ borderBottom: `1px solid ${LINE}` }}>
                    <td style={{ padding: "8px 10px", color: MUTED }}>{l}</td>
                    <td style={{ padding: "8px 10px", textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ marginTop: 6, fontSize: 10.5, color: MUTED }}>{taxReport.note}</p>
          </div>
        )}

        {/* ============ HOW FIGURES ARE CALCULATED ============ */}
        <div
          style={{
            marginTop: 22,
            background: ORANGE_SOFT,
            borderLeft: `4px solid ${ORANGE}`,
            borderRadius: "0 8px 8px 0",
            padding: "14px 16px",
            breakInside: "avoid",
          }}
        >
          <div style={{ color: ORANGE, fontWeight: 800, fontSize: 11.5, letterSpacing: "0.05em" }}>
            HOW YOUR FIGURES ARE CALCULATED
          </div>
          <p style={{ margin: "8px 0 0", fontSize: 11, color: "#475569", lineHeight: 1.55 }}>
            <strong>Weighted Avg Cost</strong> is the unit-weighted average price paid across all purchase lots
            (total invested ÷ units). <strong>Weight</strong> is each fund&apos;s share of invested capital.{" "}
            <strong>Absolute Return</strong> = Net Gain ÷ Net Invested. <strong>XIRR</strong> is the annualised,
            money-weighted return computed on the actual date and size of every cash flow plus the current
            valuation — the most accurate measure for a regular SIP / top-up investor.
          </p>
          <p style={{ margin: "8px 0 0", fontSize: 10.5, color: MUTED, lineHeight: 1.55 }}>
            NAV, unit price, market value, gain/loss and XIRR are derived from <strong>indicative
            demonstration NAVs</strong> — not live market data. Invested amounts, contribution history and
            weights are actuals from your ledger. Any field shown as <strong>N/A</strong> was unavailable in
            the source. This statement is generated by Briddhi Studio for informational purposes and is not
            investment advice; mutual-fund investments are subject to market risk.
          </p>
        </div>
      </div>

      {/* ============ FOOTER BAR ============ */}
      <div
        style={{
          background: ORANGE,
          color: "#fff",
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 34px",
          fontSize: 11.5,
        }}
      >
        <span>info@briddhi.net</span>
        <span>Briddhi Financial Technologies · Dhaka, Bangladesh</span>
        <span>www.briddhi.net</span>
      </div>
    </div>
  );
}

// ---- sub-components ----

function Kpi({
  label,
  value,
  sub,
  color,
  highlight,
}: {
  label: string;
  value: string | null;
  sub?: string;
  color?: string;
  highlight?: boolean;
}) {
  return (
    <div
      style={{
        border: highlight ? `1.5px solid ${ORANGE}` : `1px solid ${LINE}`,
        background: highlight ? ORANGE_SOFT : "#fff",
        borderRadius: 10,
        padding: "12px 12px",
      }}
    >
      <div style={{ fontSize: 9.5, color: MUTED, letterSpacing: "0.05em" }}>{label}</div>
      <div style={{ marginTop: 5, fontSize: 19, fontWeight: 800, color: color ?? INK, fontVariantNumeric: "tabular-nums" }}>
        {value ?? <span style={{ color: MUTED, fontWeight: 600, fontSize: 16 }}>N/A</span>}
      </div>
      {sub && <div style={{ marginTop: 3, fontSize: 10, color: MUTED }}>{sub}</div>}
    </div>
  );
}

function Num({
  v,
  d = 2,
  money,
  pct,
  tone,
  bold,
}: {
  v: number | null;
  d?: number;
  money?: boolean;
  pct?: boolean;
  tone?: boolean;
  bold?: boolean;
}) {
  let content: React.ReactNode;
  let color = INK;
  if (v == null) {
    content = na();
  } else if (money) {
    content = bdt(v);
    if (tone) color = v >= 0 ? GREEN : RED;
    if (tone && v > 0) content = "+" + bdt(v);
  } else if (pct) {
    content = `${v >= 0 ? "+" : ""}${v.toFixed(2)}%`;
    if (tone) color = v >= 0 ? GREEN : RED;
  } else {
    content = v.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });
  }
  return (
    <td style={{ padding: "9px 10px", textAlign: "right", fontVariantNumeric: "tabular-nums", color, fontWeight: bold ? 800 : 500 }}>
      {content}
    </td>
  );
}

function Allocation({ holdings, total }: { holdings: PortfolioPayload["holdings"]; total: number }) {
  const R = 42;
  const C = 2 * Math.PI * R;
  let offset = 0;
  const arcs = holdings.map((h, i) => {
    const frac = total ? h.invested / total : 0;
    const dash = frac * C;
    const a = { color: DONUT[i % DONUT.length], dash, gap: C - dash, off: offset, h };
    offset -= dash;
    return a;
  });
  return (
    <div style={{ border: `1px solid ${LINE}`, borderRadius: 10, padding: "14px 16px" }}>
      <div style={{ fontSize: 11.5, fontWeight: 800, color: INK, letterSpacing: "0.04em" }}>ASSET ALLOCATION</div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 10 }}>
        <div style={{ position: "relative", width: 130, height: 130, flexShrink: 0 }}>
          <svg viewBox="0 0 100 100" width="130" height="130" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="50" cy="50" r={R} fill="none" stroke="#EDF1F6" strokeWidth="13" />
            {arcs.map((a, i) => (
              <circle key={i} cx="50" cy="50" r={R} fill="none" stroke={a.color} strokeWidth="13" strokeDasharray={`${a.dash} ${a.gap}`} strokeDashoffset={a.off} />
            ))}
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}>
            <div>
              <div style={{ fontSize: 9, color: MUTED }}>TOTAL INVESTED</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: INK }}>{bdt(total)}</div>
            </div>
          </div>
        </div>
        <ul style={{ flex: 1, minWidth: 0, listStyle: "none", margin: 0, padding: 0 }}>
          {arcs.slice(0, 6).map((a, i) => (
            <li key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "5px 0", borderBottom: i < Math.min(5, arcs.length - 1) ? `1px solid ${SOFT}` : "none" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                <AmcLogo amc={a.h.amc} />
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: a.color, flexShrink: 0 }} />
                    <span style={{ fontWeight: 800, color: INK, fontSize: 12.5 }}>{abbrev(a.h.fundName)}</span>
                  </span>
                  <span style={{ display: "block", fontSize: 10, color: MUTED, marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 120 }}>
                    {a.h.amc}
                  </span>
                </span>
              </span>
              <span style={{ textAlign: "right", fontSize: 11, color: MUTED, flexShrink: 0 }}>
                <span style={{ color: INK, fontWeight: 600 }}>{bdt(a.h.invested)}</span>
                <br />
                {a.h.weightPct.toFixed(1)}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Activity({
  from,
  to,
  opening,
  contributions,
  withdrawals,
  marketGainLoss,
  closing,
  closingIsCost,
}: {
  from: string;
  to: string;
  opening: number;
  contributions: number;
  withdrawals: number;
  marketGainLoss: number | null;
  closing: number;
  closingIsCost: boolean;
}) {
  const Row = ({ label, value, color }: { label: string; value: React.ReactNode; color?: string }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: `1px solid ${LINE}` }}>
      <span style={{ color: MUTED }}>{label}</span>
      <span style={{ fontWeight: 600, color: color ?? INK, fontVariantNumeric: "tabular-nums" }}>{value}</span>
    </div>
  );
  return (
    <div style={{ border: `1px solid ${LINE}`, borderRadius: 10, padding: "14px 16px" }}>
      <div style={{ fontSize: 11.5, fontWeight: 800, color: INK, letterSpacing: "0.04em" }}>ACCOUNT ACTIVITY</div>
      <div style={{ marginTop: 6 }}>
        <Row label={`Opening value (${fmtDate(from)})`} value={bdt(opening)} />
        <Row label="(+) Contributions" value={bdt(contributions)} color={ORANGE} />
        <Row label="(−) Withdrawals" value={bdt(withdrawals)} />
        <Row label="(+) Market gain / loss" value={marketGainLoss == null ? na() : bdt(marketGainLoss)} color={marketGainLoss != null ? GREEN : undefined} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 11 }}>
          <span style={{ fontWeight: 800, color: INK }}>
            Closing value ({fmtDate(to)}){closingIsCost && <span style={{ fontWeight: 400, color: MUTED, fontSize: 10.5 }}> · at cost</span>}
          </span>
          <span style={{ fontWeight: 800, color: INK, fontSize: 15, fontVariantNumeric: "tabular-nums" }}>{bdt(closing)}</span>
        </div>
      </div>
    </div>
  );
}
