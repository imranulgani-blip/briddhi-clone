import "server-only";
import { getSupabaseAdmin } from "../../lib/supabase/server";
import type { Fund, Investor, Transaction } from "./types";

// Server-side data access for the portal. Uses the service-role client.

export async function getInvestors(): Promise<Investor[]> {
  const db = getSupabaseAdmin();
  const { data, error } = await db
    .from("investors")
    .select("id,name,phone,age,gender,primary_risk,source")
    .order("id");
  if (error) throw error;
  return (data ?? []) as Investor[];
}

export async function getInvestor(id: string): Promise<Investor | null> {
  const db = getSupabaseAdmin();
  const { data, error } = await db
    .from("investors")
    .select("id,name,phone,age,gender,primary_risk,source")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as Investor) ?? null;
}

export async function getFunds(): Promise<Fund[]> {
  const db = getSupabaseAdmin();
  const { data, error } = await db
    .from("funds")
    .select("id,name,amc,asset_class,sector,market_segment,current_nav,nav_date");
  if (error) throw error;
  return (data ?? []) as Fund[];
}

interface RawTxn {
  id: number;
  investor_id: string;
  fund_id: number;
  txn_date: string;
  type: string;
  amount: number;
  unit_price: number | null;
  units: number | null;
  risk_profile: string | null;
  source: string | null;
  funds: { name: string; amc: string } | { name: string; amc: string }[] | null;
}

export async function getTransactions(investorId: string): Promise<Transaction[]> {
  const db = getSupabaseAdmin();
  const { data, error } = await db
    .from("transactions")
    .select("id,investor_id,fund_id,txn_date,type,amount,unit_price,units,risk_profile,source,funds(name,amc)")
    .eq("investor_id", investorId)
    .order("txn_date");
  if (error) throw error;
  return ((data ?? []) as RawTxn[]).map((t) => {
    const fund = Array.isArray(t.funds) ? t.funds[0] : t.funds;
    return {
      id: t.id,
      investor_id: t.investor_id,
      fund_id: t.fund_id,
      fund_name: fund?.name ?? "",
      amc: fund?.amc ?? "",
      txn_date: t.txn_date,
      type: t.type === "SIP" ? "SIP" : "LUMPSUM",
      amount: Number(t.amount),
      unit_price: t.unit_price != null ? Number(t.unit_price) : null,
      units: t.units != null ? Number(t.units) : null,
      risk_profile: t.risk_profile,
      source: t.source,
    } as Transaction;
  });
}

// Today's date (server) as ISO yyyy-mm-dd — used as the as-of valuation date.
export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}
