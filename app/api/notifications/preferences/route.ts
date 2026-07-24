import { NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "../../../lib/supabase/server";
import { demoPreferences } from "../../../portal/lib/demoData";

export const dynamic = "force-dynamic";

const DEMO = !isSupabaseConfigured();

const DEFAULTS = {
  push: true,
  sms: true,
  email: true,
  goal_nudges: true,
  sip_reminders: true,
  curated_lists: false,
};

// GET /api/notifications/preferences?investorId=BFT001
export async function GET(req: Request) {
  try {
    const investorId = new URL(req.url).searchParams.get("investorId");
    if (!investorId) return NextResponse.json({ error: "investorId required" }, { status: 400 });
    if (DEMO) return NextResponse.json({ preferences: demoPreferences(investorId) });
    const db = getSupabaseAdmin();
    const { data, error } = await db
      .from("notification_preferences")
      .select("*")
      .eq("investor_id", investorId)
      .maybeSingle();
    if (error) throw error;
    return NextResponse.json({ preferences: data ?? { investor_id: investorId, ...DEFAULTS } });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

// PATCH /api/notifications/preferences  { investorId, ...toggles }
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { investorId, ...rest } = body;
    if (!investorId) return NextResponse.json({ error: "investorId required" }, { status: 400 });
    const allowed = ["push", "sms", "email", "goal_nudges", "sip_reminders", "curated_lists"];
    const patch: Record<string, boolean> = {};
    for (const k of allowed) if (k in rest) patch[k] = Boolean(rest[k]);

    if (DEMO) {
      return NextResponse.json({ preferences: { ...demoPreferences(investorId), ...patch } });
    }
    const db = getSupabaseAdmin();
    const { data, error } = await db
      .from("notification_preferences")
      .upsert({ investor_id: investorId, ...patch, updated_at: new Date().toISOString() }, { onConflict: "investor_id" })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ preferences: data });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
