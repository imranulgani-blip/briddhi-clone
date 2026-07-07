"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { usePortal } from "../lib/PortalContext";
import { useFetch } from "../lib/useFetch";
import type { Investor } from "../lib/types";

const FEATURED = ["BFT001", "BFT004", "BFT016", "BFT024", "BFT008"];

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = usePortal();
  const { data, loading, error } = useFetch<{ investors: Investor[] }>("/api/investors");
  const [query, setQuery] = useState("");

  const investors = useMemo(() => data?.investors ?? [], [data]);
  const featured = useMemo(
    () => FEATURED.map((id) => investors.find((i) => i.id === id)).filter(Boolean) as Investor[],
    [investors]
  );
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return investors;
    return investors.filter((i) => i.name.toLowerCase().includes(q) || i.id.toLowerCase().includes(q));
  }, [investors, query]);

  const choose = (inv: Investor) => {
    signIn({ id: inv.id, name: inv.name });
    router.replace("/portal/dashboard");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-ink-700/60 bg-ink-800/60 px-3 py-1 text-xs text-ink-300">
          <span className="h-1.5 w-1.5 rounded-full bg-neon-400 animate-pulse" />
          Investor Portal · demo sign-in
        </span>
        <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
          Sign in to your <span className="text-gradient">portfolio</span>
        </h1>
        <p className="mt-3 text-ink-300">
          Pick an investor to open their consolidated multi-AMC dashboard. This is a demo picker — no
          password required. Data is real (loaded from the Briddhi ledger).
        </p>
      </div>

      {error && (
        <div className="surface mt-8 border-amber-500/40 p-5 text-sm text-amber-200">
          <div className="font-semibold">Couldn&apos;t load investors.</div>
          <p className="mt-1 text-amber-200/80">{error}</p>
          <p className="mt-2 text-ink-400">
            Make sure Supabase is configured (<code className="mono">.env.local</code>), the schema is
            applied, and <code className="mono">node scripts/seed.mjs</code> has been run.
          </p>
        </div>
      )}

      {loading && <div className="mt-8 text-ink-400">Loading investors…</div>}

      {!loading && !error && (
        <>
          {featured.length > 0 && (
            <div className="mt-8">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-400">Featured portfolios</h2>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {featured.map((inv) => (
                  <button
                    key={inv.id}
                    onClick={() => choose(inv)}
                    className="surface group p-5 text-left transition-colors hover:border-neon-400/40"
                  >
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-neon-400 to-emerald-600 font-bold text-ink-950">
                        {inv.name.slice(0, 1)}
                      </span>
                      <div className="min-w-0">
                        <div className="truncate font-semibold text-ink-100">{inv.name}</div>
                        <div className="mono text-xs text-ink-500">{inv.id}</div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs text-ink-400">
                      {inv.primary_risk && (
                        <span className="rounded-full border border-ink-600 px-2 py-0.5">{inv.primary_risk}</span>
                      )}
                      <span className="text-neon-400 group-hover:translate-x-0.5 transition-transform">
                        Open dashboard →
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-400">
                All investors ({investors.length})
              </h2>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name or ID…"
                className="w-56 rounded-lg border border-ink-600 bg-ink-800/60 px-3 py-1.5 text-sm text-ink-100 placeholder:text-ink-500 focus:outline-none"
              />
            </div>
            <div className="surface mt-3 divide-y divide-ink-700/40">
              {filtered.map((inv) => (
                <button
                  key={inv.id}
                  onClick={() => choose(inv)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-ink-800/40"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-ink-700 text-xs font-semibold text-ink-100">
                      {inv.name.slice(0, 1)}
                    </span>
                    <div>
                      <div className="text-sm font-medium text-ink-100">{inv.name}</div>
                      <div className="mono text-xs text-ink-500">{inv.id}</div>
                    </div>
                  </div>
                  <span className="text-sm text-neon-400">Open →</span>
                </button>
              ))}
              {filtered.length === 0 && <div className="px-4 py-6 text-sm text-ink-400">No matches.</div>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
