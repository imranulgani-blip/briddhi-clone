// Seed Supabase from the real Excel ledger (Financial data/investor.ods).
//
// Usage:
//   1. Create .env.local (see .env.local.example) with SUPABASE_SERVICE_ROLE_KEY.
//   2. Run schema.sql in the Supabase SQL editor first.
//   3. node scripts/seed.mjs
//
// Idempotent: upserts on natural keys, so it's safe to re-run.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import AdmZip from "adm-zip";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// ---------------------------------------------------------------------------
// Minimal .env.local loader (no dotenv dependency)
// ---------------------------------------------------------------------------
function loadEnv() {
  // Accept either .env.local (preferred) or .env.
  const candidates = [".env.local", ".env"].map((f) => path.join(ROOT, f));
  const found = candidates.filter((p) => fs.existsSync(p));
  if (found.length === 0) {
    console.error("Missing .env.local (or .env) — copy .env.local.example and fill in your Supabase keys.");
    process.exit(1);
  }
  for (const p of found) {
    for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}
loadEnv();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local");
  process.exit(1);
}
const db = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

// ---------------------------------------------------------------------------
// Canonical fund reference (fixes casing dupes; maps each fund to its AMC).
// asset_class/sector/nav intentionally left null — not in the source data.
// ---------------------------------------------------------------------------
const FUND_CANON = [
  { name: "Investit Growth Fund", amc: "Investit" },
  { name: "Ekush First Unit Fund", amc: "Ekush" },
  { name: "Ekush Growth Fund", amc: "Ekush" },
  { name: "Ekush Stable Return Fund", amc: "Ekush" },
  { name: "EDGE Al-Amin Shariah Consumer Fund", amc: "EDGE" },
  { name: "EDGE AMC Growth Fund", amc: "EDGE" },
  { name: "EDGE Bangladesh Mutual Fund", amc: "EDGE" },
  { name: "EDGE High Quality Income Fund", amc: "EDGE" },
  { name: "VIPB Growth Fund", amc: "VIPB" },
  { name: "Midland Bank Growth Fund", amc: "Midland Bank" },
  { name: "CWT Emerging Bangladesh First Growth Fund", amc: "CWT" },
];
const CANON_BY_KEY = new Map(FUND_CANON.map((f) => [f.name.toUpperCase().replace(/\s+/g, " "), f]));
function canonFund(raw) {
  const key = String(raw || "").trim().replace(/\s+/g, " ").toUpperCase();
  return CANON_BY_KEY.get(key) || null;
}

// ---------------------------------------------------------------------------
// ODS parsing (same approach validated during exploration)
// ---------------------------------------------------------------------------
function readOdsContent() {
  const odsPath = path.join(ROOT, "Financial data", "investor.ods");
  if (!fs.existsSync(odsPath)) {
    console.error("Cannot find", odsPath);
    process.exit(1);
  }
  const zip = new AdmZip(odsPath);
  const entry = zip.getEntry("content.xml");
  return entry.getData().toString("utf8");
}

function parseFirstTable(xml) {
  const seg = xml.split("<table:table ")[1];
  const end = seg.indexOf("</table:table>");
  const body = end >= 0 ? seg.slice(0, end) : seg;
  const rows = [];
  const rowRe = /<table:table-row([^>]*)>([\s\S]*?)<\/table:table-row>/g;
  let rm;
  while ((rm = rowRe.exec(body))) {
    const rrep = parseInt((rm[1].match(/number-rows-repeated="(\d+)"/) || [])[1] || "1");
    const cells = [];
    const cellRe = /<table:(table-cell|covered-table-cell)([^>]*?)(\/>|>([\s\S]*?)<\/table:\1>)/g;
    let cm;
    while ((cm = cellRe.exec(rm[2]))) {
      const attrs = cm[2];
      const crep = parseInt((attrs.match(/number-columns-repeated="(\d+)"/) || [])[1] || "1");
      const val = (attrs.match(/office:value="([^"]*)"/) || [])[1];
      const inner = cm[4] || "";
      const texts = [...inner.matchAll(/<text:p[^>]*>([\s\S]*?)<\/text:p>/g)].map((t) =>
        t[1].replace(/<[^>]+>/g, "")
      );
      let text = texts
        .join(" ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&apos;/g, "'")
        .replace(/&quot;/g, '"')
        .trim();
      if (!text && val !== undefined) text = val;
      for (let k = 0; k < Math.min(crep, 60); k++) cells.push(text);
    }
    while (cells.length && cells[cells.length - 1] === "") cells.pop();
    for (let r = 0; r < Math.min(rrep, 3); r++) rows.push(cells);
  }
  return rows;
}

const MONTHS = { jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,oct:9,nov:10,dec:11 };
function parseDate(s) {
  // "2-Nov-2025" -> "2025-11-02"
  const m = String(s || "").trim().match(/^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/);
  if (!m) return null;
  const d = String(+m[1]).padStart(2, "0");
  const mo = MONTHS[m[2].toLowerCase()];
  if (mo === undefined) return null;
  return `${m[3]}-${String(mo + 1).padStart(2, "0")}-${d}`;
}

// ---------------------------------------------------------------------------
// Build records from the MOS sheet
// Column layout (after 2 leading blanks): SL, Date, CustID, Name, Phone, Age,
// Gender, Type, Amount, FundName, Risk, Postal, Source, ...
// ---------------------------------------------------------------------------
function buildRecords(rows) {
  const txns = [];
  const investors = new Map();
  const riskCount = new Map(); // investorId -> {risk: n}

  for (const r of rows) {
    const sl = String(r[2] || "").trim();
    if (!/^\d+$/.test(sl)) continue;
    const custId = String(r[4] || "").trim();
    if (!custId || custId === "---") continue;
    const canon = canonFund(r[11]);
    if (!canon) continue; // skip junk / unmapped rows
    const amount = parseFloat(String(r[10] || "").replace(/[^0-9.]/g, ""));
    const date = parseDate(r[3]);
    if (!amount || !date) continue;
    const risk = String(r[12] || "").trim().toUpperCase() || null;
    const type = String(r[9] || "").trim().toUpperCase() === "SIP" ? "SIP" : "LUMPSUM";

    txns.push({
      ext_key: `TXN-${sl}`,
      investor_id: custId,
      fund_name: canon.name,
      txn_date: date,
      type,
      amount,
      risk_profile: risk,
      source: String(r[14] || "").trim() || null,
      _sl: +sl,
    });

    if (!investors.has(custId)) {
      const age = parseInt(String(r[6] || "").replace(/[^0-9]/g, ""));
      investors.set(custId, {
        id: custId,
        name: String(r[5] || "").trim() || custId,
        phone: String(r[6 - 0] && r[6] ? r[6] : "").trim() || null, // phone is col 6? corrected below
        age: Number.isFinite(age) && age > 0 ? age : null,
        gender: String(r[8] || "").trim() || null,
        source: String(r[14] || "").trim() || null,
      });
    }
    if (risk) {
      const rc = riskCount.get(custId) || {};
      rc[risk] = (rc[risk] || 0) + 1;
      riskCount.set(custId, rc);
    }
  }

  // Fix investor fields using correct columns: Phone=r[6], Age=r[7], Gender=r[8]
  // (re-derive cleanly from the first transaction row per investor)
  const firstRow = new Map();
  for (const r of rows) {
    const sl = String(r[2] || "").trim();
    if (!/^\d+$/.test(sl)) continue;
    const custId = String(r[4] || "").trim();
    if (!custId || custId === "---" || firstRow.has(custId)) continue;
    firstRow.set(custId, r);
  }
  for (const [id, inv] of investors) {
    const r = firstRow.get(id);
    if (r) {
      inv.phone = String(r[6] || "").trim() || null;
      const age = parseInt(String(r[7] || "").replace(/[^0-9]/g, ""));
      inv.age = Number.isFinite(age) && age > 0 ? age : null;
      inv.gender = String(r[8] || "").trim() || null;
    }
    // primary risk = most common
    const rc = riskCount.get(id) || {};
    inv.primary_risk = Object.entries(rc).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  }

  return { txns, investors: [...investors.values()] };
}

// Notifications derived from real orders (mock delivery).
function buildNotifications(txns) {
  const byInvestor = new Map();
  for (const t of txns) {
    if (!byInvestor.has(t.investor_id)) byInvestor.set(t.investor_id, []);
    byInvestor.get(t.investor_id).push(t);
  }
  const notifs = [];
  const bdt = (n) => "৳" + new Intl.NumberFormat("en-IN").format(Math.round(n));
  for (const [investorId, list] of byInvestor) {
    // most recent 3 orders drive transactional notifications
    const recent = [...list].sort((a, b) => (a.txn_date < b.txn_date ? 1 : -1)).slice(0, 3);
    recent.forEach((t, i) => {
      notifs.push({
        ext_key: `NOTIF-${t.ext_key}-order`,
        investor_id: investorId,
        category: "order_placed",
        title: `Order placed — ${bdt(t.amount)} ${t.fund_name}`,
        body: `Your ${t.type} order for ${t.fund_name} was received on ${t.txn_date}.`,
        channel: i === 0 ? "push" : i === 1 ? "email" : "sms",
        status: "delivered",
      });
      notifs.push({
        ext_key: `NOTIF-${t.ext_key}-alloc`,
        investor_id: investorId,
        category: "allotment",
        title: `Units allotted — ${t.fund_name}`,
        body: `Allotment confirmed for your ${bdt(t.amount)} investment in ${t.fund_name}.`,
        channel: "email",
        status: "sent",
      });
    });
    // one engagement nudge per investor
    notifs.push({
      ext_key: `NOTIF-${investorId}-nudge`,
      investor_id: investorId,
      category: "nudge",
      title: "New curated list: Top Shariah funds this quarter",
      body: "Explore a hand-picked list of Shariah-compliant funds matched to your risk profile.",
      channel: "push",
      status: "sent",
    });
  }
  return notifs;
}

// ---------------------------------------------------------------------------
// Upsert everything
// ---------------------------------------------------------------------------
async function main() {
  console.log("Reading investor.ods …");
  const rows = parseFirstTable(readOdsContent());
  const { txns, investors } = buildRecords(rows);
  console.log(`Parsed: ${investors.length} investors, ${txns.length} transactions, ${FUND_CANON.length} funds.`);

  // 1) funds
  const { error: fErr } = await db
    .from("funds")
    .upsert(FUND_CANON.map((f) => ({ name: f.name, amc: f.amc })), { onConflict: "name" });
  if (fErr) throw fErr;

  const { data: fundRows, error: fSelErr } = await db.from("funds").select("id,name");
  if (fSelErr) throw fSelErr;
  const fundId = new Map(fundRows.map((f) => [f.name, f.id]));

  // 2) investors
  const { error: iErr } = await db.from("investors").upsert(investors, { onConflict: "id" });
  if (iErr) throw iErr;

  // 3) transactions
  const txnRows = txns.map((t) => ({
    ext_key: t.ext_key,
    investor_id: t.investor_id,
    fund_id: fundId.get(t.fund_name),
    txn_date: t.txn_date,
    type: t.type,
    amount: t.amount,
    risk_profile: t.risk_profile,
    source: t.source,
  }));
  const { error: tErr } = await db.from("transactions").upsert(txnRows, { onConflict: "ext_key" });
  if (tErr) throw tErr;

  // 4) notifications
  const notifs = buildNotifications(txns);
  const { error: nErr } = await db.from("notifications").upsert(notifs, { onConflict: "ext_key" });
  if (nErr) throw nErr;

  // 5) default notification preferences
  const prefs = investors.map((i) => ({ investor_id: i.id }));
  const { error: pErr } = await db
    .from("notification_preferences")
    .upsert(prefs, { onConflict: "investor_id", ignoreDuplicates: true });
  if (pErr) throw pErr;

  // sanity totals
  const totalInvested = txns.reduce((s, t) => s + t.amount, 0);
  console.log("\nSeed complete ✓");
  console.log(`  investors:      ${investors.length}`);
  console.log(`  transactions:   ${txns.length}`);
  console.log(`  funds:          ${FUND_CANON.length}`);
  console.log(`  notifications:  ${notifs.length}`);
  console.log(`  total invested: ৳${totalInvested.toLocaleString()}`);
  const bft001 = txns.filter((t) => t.investor_id === "BFT001").reduce((s, t) => s + t.amount, 0);
  console.log(`  BFT001 invested (expect ৳740,380): ৳${bft001.toLocaleString()}`);
}

main().catch((e) => {
  console.error("\nSeed failed:", e.message || e);
  process.exit(1);
});
