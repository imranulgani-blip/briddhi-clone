// Populate INDICATIVE NAV data so market-value/gain/XIRR figures compute.
//
// This is demonstration data — NOT real NAVs. Each fund gets a current NAV, an
// annualised growth rate, an asset class and a sector. For every transaction we
// derive the purchase unit-price by discounting the current NAV back to the buy
// date at the fund's growth rate, then units = amount / unit_price. That makes
// earlier purchases show gains, consistent with the growth rate (XIRR ≈ rate).
//
// Usage:  node scripts/seed-navs.mjs
// Re-runnable. To clear it again: set the columns back to null (see bottom note).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

function loadEnv() {
  for (const f of [".env.local", ".env"]) {
    const p = path.join(ROOT, f);
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}
loadEnv();

const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const NAV_AS_OF = "2026-07-07";

// fund name -> { nav (current), r (annual growth), asset_class, sector }
const MODEL = {
  "Investit Growth Fund": { nav: 16.2, r: 0.16, asset_class: "equity", sector: "Diversified Equity" },
  "Ekush First Unit Fund": { nav: 13.1, r: 0.1, asset_class: "balanced", sector: "Balanced" },
  "Ekush Growth Fund": { nav: 13.7, r: 0.15, asset_class: "equity", sector: "Growth Equity" },
  "Ekush Stable Return Fund": { nav: 11.4, r: 0.06, asset_class: "debt", sector: "Fixed Income" },
  "EDGE Al-Amin Shariah Consumer Fund": { nav: 12.8, r: 0.13, asset_class: "equity", sector: "Shariah Consumer" },
  "EDGE AMC Growth Fund": { nav: 14.6, r: 0.15, asset_class: "equity", sector: "Growth Equity" },
  "EDGE Bangladesh Mutual Fund": { nav: 12.1, r: 0.09, asset_class: "balanced", sector: "Balanced" },
  "EDGE High Quality Income Fund": { nav: 10.9, r: 0.055, asset_class: "debt", sector: "Fixed Income" },
  "VIPB Growth Fund": { nav: 15.4, r: 0.145, asset_class: "equity", sector: "Growth Equity" },
  "Midland Bank Growth Fund": { nav: 13.3, r: 0.12, asset_class: "equity", sector: "Growth Equity" },
  "CWT Emerging Bangladesh First Growth Fund": { nav: 12.5, r: 0.14, asset_class: "equity", sector: "Emerging Equity" },
};

const DAY = 86400000;
const yearsBetween = (a, b) => (Date.parse(b) - Date.parse(a)) / (DAY * 365);

async function main() {
  const { data: funds, error: fErr } = await db.from("funds").select("id,name");
  if (fErr) throw fErr;

  // 1) update funds with current NAV + classification
  let updatedFunds = 0;
  const rateById = new Map();
  const navById = new Map();
  for (const f of funds) {
    const m = MODEL[f.name];
    if (!m) {
      console.warn("No NAV model for fund:", f.name);
      continue;
    }
    rateById.set(f.id, m.r);
    navById.set(f.id, m.nav);
    const { error } = await db
      .from("funds")
      .update({ current_nav: m.nav, nav_date: NAV_AS_OF, asset_class: m.asset_class, sector: m.sector })
      .eq("id", f.id);
    if (error) throw error;
    updatedFunds++;
  }

  // 2) derive unit_price + units for every transaction
  const { data: txns, error: tErr } = await db.from("transactions").select("id,fund_id,txn_date,amount");
  if (tErr) throw tErr;

  let updatedTxns = 0;
  for (const t of txns) {
    const r = rateById.get(t.fund_id);
    const nav = navById.get(t.fund_id);
    if (r == null || nav == null) continue;
    // discount current NAV back to purchase date at growth rate r
    const yrs = yearsBetween(t.txn_date, NAV_AS_OF);
    const unitPrice = nav / Math.pow(1 + r, Math.max(0, yrs));
    const units = Number(t.amount) / unitPrice;
    const { error } = await db
      .from("transactions")
      .update({ unit_price: Number(unitPrice.toFixed(4)), units: Number(units.toFixed(4)) })
      .eq("id", t.id);
    if (error) throw error;
    updatedTxns++;
  }

  console.log("Indicative NAV seed complete ✓");
  console.log(`  funds updated:        ${updatedFunds}`);
  console.log(`  transactions updated: ${updatedTxns}`);
  console.log(`  NAV as-of:            ${NAV_AS_OF}`);
  console.log("\nNote: these are INDICATIVE demo NAVs, not real market data.");
}

main().catch((e) => {
  console.error("NAV seed failed:", e.message || e);
  process.exit(1);
});
