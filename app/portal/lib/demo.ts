// Portal demo mode — client-safe flag (no server/data imports so it can be used
// in client components like Shell without bloating the bundle).
//
// When PORTAL_DEMO is true the portal skips the mock-login gate and auto-signs-in
// a default investor, and the API routes serve baked-in demo data (see
// app/portal/lib/demoData.ts) whenever Supabase is not configured. This lets a
// designer review every portal screen, fully populated, with no login and no DB.
//
// To restore the real login + Supabase flow: set PORTAL_DEMO = false and provide
// the Supabase env vars. (An env override is honoured if present.)
export const PORTAL_DEMO: boolean =
  process.env.NEXT_PUBLIC_PORTAL_DEMO === "false" ? false : true;

// Identity used for the auto-login when PORTAL_DEMO is on.
export const DEMO_DEFAULT_INVESTOR = { id: "BINV001", name: "Imranul Gani Fira" };
