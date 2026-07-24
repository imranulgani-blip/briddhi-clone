import { NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "../../lib/supabase/server";
import { demoGoals } from "../../portal/lib/demoData";

export const dynamic = "force-dynamic";

const DEMO = !isSupabaseConfigured();

// GET /api/goals?investorId=BFT001
export async function GET(req: Request) {
  try {
    const investorId = new URL(req.url).searchParams.get("investorId");
    if (!investorId) return NextResponse.json({ error: "investorId required" }, { status: 400 });
    if (DEMO) return NextResponse.json({ goals: demoGoals(investorId) });
    const db = getSupabaseAdmin();
    const { data, error } = await db
      .from("goals")
      .select("id,investor_id,name,target_amount,target_date,created_at")
      .eq("investor_id", investorId)
      .order("created_at");
    if (error) throw error;
    return NextResponse.json({ goals: data ?? [] });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

// POST /api/goals  { investorId, name, targetAmount, targetDate? }
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { investorId, name, targetAmount, targetDate } = body;
    if (!investorId || !name || !targetAmount) {
      return NextResponse.json({ error: "investorId, name, targetAmount required" }, { status: 400 });
    }
    if (DEMO) {
      // Demo mode has no DB — echo the goal back so the UI updates optimistically.
      return NextResponse.json(
        {
          goal: {
            id: Math.floor(Math.random() * 1e6) + 1000,
            investor_id: investorId,
            name,
            target_amount: Number(targetAmount),
            target_date: targetDate || null,
            created_at: new Date().toISOString(),
          },
        },
        { status: 201 }
      );
    }
    const db = getSupabaseAdmin();
    const { data, error } = await db
      .from("goals")
      .insert({
        investor_id: investorId,
        name,
        target_amount: Number(targetAmount),
        target_date: targetDate || null,
      })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ goal: data }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

// DELETE /api/goals?id=123
export async function DELETE(req: Request) {
  try {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    if (DEMO) return NextResponse.json({ ok: true });
    const db = getSupabaseAdmin();
    const { error } = await db.from("goals").delete().eq("id", Number(id));
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
