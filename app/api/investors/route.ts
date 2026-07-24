import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "../../lib/supabase/server";
import { getInvestors } from "../../portal/lib/queries";
import { DEMO_INVESTORS } from "../../portal/lib/demoData";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ investors: DEMO_INVESTORS });
  }
  try {
    const investors = await getInvestors();
    return NextResponse.json({ investors });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
