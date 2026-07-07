"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Browser client — uses the public anon key. Reads only, demo-permissive RLS.
let browserClient: SupabaseClient | null = null;

export function getSupabaseBrowser(): SupabaseClient {
  if (browserClient) return browserClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error(
      "Supabase env vars missing. Copy .env.local.example to .env.local and fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }
  browserClient = createClient(url, anon, {
    auth: { persistSession: false },
  });
  return browserClient;
}
