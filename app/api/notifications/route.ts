import { NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "../../lib/supabase/server";

export const dynamic = "force-dynamic";

function guard() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured. Add .env.local." }, { status: 503 });
  }
  return null;
}

// GET /api/notifications?investorId=BFT001
export async function GET(req: Request) {
  const g = guard();
  if (g) return g;
  try {
    const investorId = new URL(req.url).searchParams.get("investorId");
    if (!investorId) return NextResponse.json({ error: "investorId required" }, { status: 400 });
    const db = getSupabaseAdmin();
    const { data, error } = await db
      .from("notifications")
      .select("id,investor_id,category,title,body,channel,status,created_at,read_at")
      .eq("investor_id", investorId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json({ notifications: data ?? [] });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

// PATCH /api/notifications  { id?, investorId?, markAllRead? }
export async function PATCH(req: Request) {
  const g = guard();
  if (g) return g;
  try {
    const body = await req.json();
    const db = getSupabaseAdmin();
    const nowIso = new Date().toISOString();
    if (body.markAllRead && body.investorId) {
      const { error } = await db
        .from("notifications")
        .update({ read_at: nowIso })
        .eq("investor_id", body.investorId)
        .is("read_at", null);
      if (error) throw error;
      return NextResponse.json({ ok: true });
    }
    if (body.id) {
      const { error } = await db
        .from("notifications")
        .update({ read_at: body.read === false ? null : nowIso })
        .eq("id", Number(body.id));
      if (error) throw error;
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "id or markAllRead+investorId required" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
