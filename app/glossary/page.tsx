"use client";

import { useMemo, useState } from "react";
import { GLOSSARY, Term } from "../data/glossary";

function groupByLetter(terms: Term[]): Record<string, Term[]> {
  const g: Record<string, Term[]> = {};
  for (const t of terms) {
    const letter = t.term[0].toUpperCase();
    if (!g[letter]) g[letter] = [];
    g[letter].push(t);
  }
  for (const k of Object.keys(g)) {
    g[k].sort((a, b) => a.term.localeCompare(b.term));
  }
  return g;
}

export default function GlossaryPage() {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    if (!q.trim()) return GLOSSARY;
    const needle = q.toLowerCase();
    return GLOSSARY.filter(
      (t) =>
        t.term.toLowerCase().includes(needle) ||
        t.short?.toLowerCase().includes(needle) ||
        t.definition.toLowerCase().includes(needle)
    );
  }, [q]);

  const grouped = useMemo(() => groupByLetter(filtered), [filtered]);
  const letters = Object.keys(grouped).sort();
  const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <div className="mb-8">
        <div className="text-xs font-semibold uppercase tracking-wider text-ink-400">Learn</div>
        <h1 className="mt-1 text-3xl md:text-4xl font-bold tracking-tight">Investing glossary</h1>
        <p className="mt-2 text-ink-300 max-w-2xl">
          {GLOSSARY.length} terms. Plain-English definitions with worked examples.
        </p>
      </div>

      <div className="surface p-4 mb-6 sticky top-16 z-30 backdrop-blur-lg">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search a term or abbreviation (e.g. NAV, SIP)"
          className="w-full bg-ink-950 border border-ink-700/50 rounded-lg px-4 py-2.5 text-sm focus:border-neon-400/60 outline-none"
        />
        <div className="mt-3 flex flex-wrap gap-1 text-xs">
          {allLetters.map((l) => {
            const active = grouped[l] !== undefined;
            return active ? (
              <a
                key={l}
                href={`#letter-${l}`}
                className="mono px-2 py-1 rounded hover:bg-ink-700/60 text-neon-400 font-semibold"
              >
                {l}
              </a>
            ) : (
              <span key={l} className="mono px-2 py-1 rounded text-ink-600">
                {l}
              </span>
            );
          })}
        </div>
      </div>

      {letters.length === 0 && (
        <div className="surface p-10 text-center text-ink-400">
          No terms matched &ldquo;{q}&rdquo;.
        </div>
      )}

      <div className="space-y-8">
        {letters.map((letter) => (
          <section key={letter} id={`letter-${letter}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="mono h-9 w-9 rounded-lg bg-neon-400/10 border border-neon-400/30 grid place-items-center text-neon-400 font-bold">
                {letter}
              </div>
              <div className="hairline flex-1" />
            </div>
            <div className="space-y-3">
              {grouped[letter].map((t) => (
                <div key={t.term} className="surface p-5">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <h3 className="text-lg font-semibold">{t.term}</h3>
                    {t.short && (
                      <span className="mono text-xs px-2 py-0.5 rounded bg-ink-800 border border-ink-700/50 text-ink-300">
                        {t.short}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-ink-300 leading-relaxed">{t.definition}</p>
                  {t.example && (
                    <div className="mt-3 text-xs bg-ink-950/60 border-l-2 border-neon-400/40 pl-3 py-1.5 text-ink-400">
                      <span className="text-neon-400 font-semibold mr-1">e.g.</span>
                      {t.example}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
