"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PBIL,
  MODELS,
  SCHEMES,
  OBJECTIVES,
  ACCENT,
  SECTORS,
  RETURNS,
  BENCHMARK,
  PERIODS,
  ALLOC,
  METRICS,
  PRIME_RED,
  PRIME_SOFT,
  type Objective,
  type Scheme,
  type PeriodKey,
} from "../data/pms";
import { LightHeader, LightFooter } from "../components/LightChrome";
import { Donut, GrowthLine, MiniBars, HBar } from "./charts";

const riskColor: Record<string, { bg: string; fg: string }> = {
  Low: { bg: "#ecfdf5", fg: "#059669" },
  Medium: { bg: "#fffbeb", fg: "#b45309" },
  High: { bg: "#fef2f2", fg: "#dc2626" },
};
const RED = PRIME_RED;

export default function PmsPage() {
  const [obj, setObj] = useState<Objective | "all">("all");
  const [period, setPeriod] = useState<PeriodKey>("y1");
  const [active, setActive] = useState<Scheme | null>(null);

  const schemes = useMemo(() => (obj === "all" ? SCHEMES : SCHEMES.filter((s) => s.objective === obj)), [obj]);
  const ranked = useMemo(() => [...SCHEMES].sort((a, b) => RETURNS[b.id][period] - RETURNS[a.id][period]), [period]);
  const maxRet = Math.max(...SCHEMES.map((s) => RETURNS[s.id][period]));

  return (
    <div className="min-h-screen bg-[#F7F8FB] text-slate-900" style={{ colorScheme: "light" }}>
      <LightHeader />

      {/* HERO */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(180deg, #3a0a13 0%, #7f1020 100%)" }}>
        <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full" style={{ background: "rgba(200,16,46,0.45)", filter: "blur(70px)" }} />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:py-20 lg:grid-cols-2 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur">
              🤝 Powered by {PBIL.name}
            </span>
            <h1 className="mt-5 max-w-xl text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl">
              Portfolio Management, <span style={{ color: "#ff8ba0" }}>measured.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-white/70">
              Compare every PrimeInvest scheme by real return periods, see the analytics, and let Bangladesh&apos;s
              <strong className="text-white"> #1 merchant bank</strong> manage a portfolio around your goals.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={PBIL.portal} target="_blank" rel="noopener noreferrer" className="rounded-xl px-5 py-3 font-semibold text-white shadow-lg transition-transform hover:-translate-y-0.5" style={{ background: RED }}>
                Open a PMS account →
              </a>
              <a href="#leaderboard" className="rounded-xl border border-white/25 bg-white/10 px-5 py-3 font-semibold text-white backdrop-blur hover:bg-white/20">
                Compare schemes ↓
              </a>
            </div>
          </motion.div>

          {/* hero data-viz mockup */}
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.15 }} className="rounded-3xl bg-white p-5 shadow-2xl">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Top schemes · 1-year return</div>
            <div className="mt-3 space-y-3">
              {[...SCHEMES].sort((a, b) => RETURNS[b.id].y1 - RETURNS[a.id].y1).slice(0, 4).map((s) => (
                <div key={s.id} className="flex items-center gap-3">
                  <span className="w-28 shrink-0 truncate text-sm font-medium text-slate-700">{s.name}</span>
                  <HBar value={RETURNS[s.id].y1} max={Math.max(...SCHEMES.map((x) => RETURNS[x.id].y1))} />
                  <span className="w-12 shrink-0 text-right text-sm font-bold" style={{ color: RED }}>{RETURNS[s.id].y1}%</span>
                </div>
              ))}
            </div>
            <div className="mt-3 border-t border-slate-100 pt-2 text-[11px] text-slate-400">Indicative figures · vs DSEX {BENCHMARK.y1}%</div>
          </motion.div>
        </div>
      </section>

      {/* METRICS BAND */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 md:grid-cols-4 lg:px-8">
          {PBIL.metrics.map((m) => (
            <div key={m.label} className="text-center md:text-left">
              <div className="text-2xl font-extrabold tracking-tight md:text-3xl" style={{ color: RED }}>{m.value}</div>
              <div className="mt-0.5 text-xs uppercase tracking-wide text-slate-500">{m.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS — illustrated flow */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Head kicker="How PMS works" title="Your money, expertly managed" />
        <HowFlow />
      </section>

      {/* LEADERBOARD */}
      <section id="leaderboard" className="scroll-mt-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <Head kicker="Performance" title="Compare schemes by return" sub="Ranked by your chosen period, measured against the DSEX benchmark." />
          <div className="mt-6 flex flex-wrap gap-2">
            {PERIODS.map((p) => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className="rounded-lg px-3.5 py-1.5 text-sm font-semibold transition-colors"
                style={period === p.key ? { background: RED, color: "#fff" } : { background: "#fff", color: "#475569", border: "1px solid #e2e8f0" }}
                title={p.long}
              >
                {p.label}
              </button>
            ))}
            <span className="ml-auto self-center text-xs text-slate-400">DSEX {PERIODS.find((p) => p.key === period)?.label}: <strong className="text-slate-600">{BENCHMARK[period]}%</strong></span>
          </div>

          <div className="mt-5 space-y-2.5">
            {ranked.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setActive(s)}
                className="flex w-full items-center gap-3 rounded-2xl bg-white p-3 text-left shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-md sm:gap-4 sm:p-4"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold" style={{ background: i < 3 ? RED : "#f1f5f9", color: i < 3 ? "#fff" : "#64748b" }}>
                  {i + 1}
                </span>
                <span className="hidden text-xl sm:block">{s.icon}</span>
                <div className="w-32 shrink-0 sm:w-44">
                  <div className="truncate text-sm font-semibold text-slate-900">{s.name}</div>
                  <div className="truncate text-xs text-slate-400">{s.tagline}</div>
                </div>
                <div className="hidden flex-1 sm:block">
                  <HBar value={RETURNS[s.id][period]} max={maxRet} benchmark={BENCHMARK[period]} />
                </div>
                <span className="ml-auto shrink-0 text-right text-lg font-extrabold tabular-nums" style={{ color: RED }}>
                  {RETURNS[s.id][period]}%
                </span>
                <span className="hidden shrink-0 text-sm font-semibold sm:inline" style={{ color: "#0f172a" }}>→</span>
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-400">Tap any scheme for full analytics. Vertical tick on each bar marks the DSEX benchmark.</p>
        </div>
      </section>

      {/* SCHEME SUITE */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Head kicker="The PrimeInvest Suite" title="Ready-made schemes for every goal" sub="Filter by what you want to achieve — each is professionally managed by PBIL's investment committee." />
        <div className="mt-8 flex flex-wrap gap-2">
          {OBJECTIVES.map((o) => (
            <button
              key={o.key}
              onClick={() => setObj(o.key)}
              className="rounded-xl px-3.5 py-1.5 text-sm font-semibold transition-colors"
              style={obj === o.key ? { background: RED, color: "#fff" } : { background: "#fff", color: "#475569", border: "1px solid #e2e8f0" }}
            >
              {o.label}
            </button>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {schemes.map((s, i) => (
            <SchemeCard key={s.id} scheme={s} index={i} onOpen={() => setActive(s)} />
          ))}
        </div>
      </section>

      {/* COMPARE TABLE */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <Head kicker="Compare all" title="Every scheme, every period" sub="Trailing returns side by side. Best in each column is highlighted." />
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="sticky left-0 bg-white pb-3 pr-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">Scheme</th>
                  {PERIODS.map((p) => (
                    <th key={p.key} className="pb-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">{p.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...SCHEMES].sort((a, b) => RETURNS[b.id].y1 - RETURNS[a.id].y1).map((s) => (
                  <tr key={s.id} className="border-t border-slate-100">
                    <td className="sticky left-0 bg-white py-3 pr-4">
                      <button onClick={() => setActive(s)} className="text-left">
                        <div className="font-medium text-slate-900 hover:underline">{s.name}</div>
                        <div className="text-xs capitalize text-slate-400">{s.objective === "lifestage" ? "life stage" : s.objective}</div>
                      </button>
                    </td>
                    {PERIODS.map((p) => {
                      const v = RETURNS[s.id][p.key];
                      const colMax = Math.max(...SCHEMES.map((x) => RETURNS[x.id][p.key]));
                      const best = v === colMax;
                      return (
                        <td key={p.key} className="py-3 text-right">
                          <span
                            className="inline-block rounded-md px-2 py-1 font-semibold tabular-nums"
                            style={{ background: `rgba(200,16,46,${0.06 + (v / colMax) * 0.16})`, color: best ? RED : "#0f172a", outline: best ? `1px solid ${RED}` : "none" }}
                          >
                            {v}%
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
                <tr className="border-t-2 border-slate-200">
                  <td className="sticky left-0 bg-white py-3 pr-4 font-semibold text-slate-500">DSEX benchmark</td>
                  {PERIODS.map((p) => (
                    <td key={p.key} className="py-3 text-right font-semibold tabular-nums text-slate-500">{BENCHMARK[p.key]}%</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* THREE MODELS */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Head kicker="Three ways to invest" title="Choose how hands-on you want to be" />
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {MODELS.map((m, i) => (
            <Reveal key={m.id} delay={i * 0.08}>
              <div className="flex h-full flex-col rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                <div className="grid h-12 w-12 place-items-center rounded-2xl text-2xl" style={{ background: PRIME_SOFT }}>{m.icon}</div>
                <div className="mt-4 text-xs font-bold uppercase tracking-wide" style={{ color: RED }}>{m.tagline}</div>
                <h3 className="mt-1 text-lg font-bold text-slate-900">{m.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{m.who}</p>
                <ul className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
                  {m.points.map((p) => (
                    <li key={p} className="flex gap-2"><span style={{ color: RED }}>•</span>{p}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FEES + TRACK RECORD */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <div className="h-full rounded-3xl p-8" style={{ background: PRIME_SOFT }}>
              <Head kicker="Transparent fees" title="0.5% – 2%, and that's it" />
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Management fees range from <strong>0.5% to 2%</strong> of your portfolio, set by the scheme and your
                horizon. Income schemes sit lower; active growth schemes higher. No hidden charges.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                {[{ l: "Income / secured", v: "0.5–1.0%" }, { l: "Balanced", v: "1.0–1.5%" }, { l: "Active growth", v: "1.5–2.0%" }].map((f) => (
                  <div key={f.l} className="rounded-xl bg-white px-4 py-3 text-center shadow-sm">
                    <div className="text-lg font-bold" style={{ color: RED }}>{f.v}</div>
                    <div className="text-[11px] text-slate-500">{f.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="h-full rounded-3xl bg-slate-900 p-8 text-white">
              <div className="text-xs font-bold uppercase tracking-wide" style={{ color: "#ff8ba0" }}>Track record</div>
              <h3 className="mt-1 text-2xl font-bold">A merchant bank you can trust</h3>
              <div className="mt-6 grid grid-cols-1 gap-4">
                {PBIL.track.map((t) => (
                  <div key={t.label} className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-sm text-slate-300">{t.label}</span>
                    <span className="text-xl font-extrabold">{t.value}</span>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-sm text-slate-400">Wholly-owned subsidiary of Prime Bank PLC · investing since {PBIL.since}.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SECTORS */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Head kicker="Where your money goes" title="Deep coverage across the economy" />
        <div className="mt-6 flex flex-wrap gap-2">
          {SECTORS.map((s) => (
            <span key={s} className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-600">{s}</span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl px-8 py-14 text-center text-white shadow-xl" style={{ background: "linear-gradient(120deg, #7f1020, #c8102e)" }}>
          <h2 className="relative text-3xl font-bold tracking-tight sm:text-4xl">Let the experts manage it for you.</h2>
          <p className="relative mx-auto mt-3 max-w-xl text-white/80">Open a PrimeInvest PMS account with Prime Bank Investment and put a professional team on your portfolio.</p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <a href={PBIL.portal} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-white px-6 py-3 font-semibold shadow-lg" style={{ color: RED }}>Open a PMS account →</a>
            <a href={`tel:${PBIL.phone}`} className="rounded-xl border border-white/30 bg-white/10 px-6 py-3 font-semibold text-white hover:bg-white/20">Call {PBIL.phone}</a>
          </div>
        </div>
        <p className="mt-8 text-xs leading-relaxed text-slate-400">
          Portfolio Management Services are provided by {PBIL.name} (PBIL). Firm metrics, scheme names and the 0.5–2%
          fee band are from PBIL&apos;s disclosures (pbil.com.bd, July 2026). Trailing returns, benchmark comparisons,
          allocations and risk metrics shown are <strong>illustrative</strong> for demonstration — actual terms and
          performance are set per client mandate. Investments are subject to market risk.
        </p>
      </section>

      {/* ANALYTICS MODAL */}
      <AnimatePresence>{active && <SchemeModal scheme={active} onClose={() => setActive(null)} />}</AnimatePresence>

      <LightFooter />
    </div>
  );
}

// ---------------------------------------------------------------------------
function Head({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) {
  return (
    <Reveal>
      <div className="max-w-2xl">
        <div className="text-xs font-bold uppercase tracking-wider" style={{ color: RED }}>{kicker}</div>
        <h2 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
        {sub && <p className="mt-3 text-slate-500">{sub}</p>}
      </div>
    </Reveal>
  );
}

function HowFlow() {
  const steps = [
    { icon: "💰", title: "You invest", body: "Fund your PMS account" },
    { icon: "🏦", title: "PBIL committee", body: "Experts allocate & manage" },
    { icon: "🧺", title: "Diversified portfolio", body: "Govt. securities + blue-chip equities" },
    { icon: "📈", title: "Returns to you", body: "Track, report & withdraw" },
  ];
  return (
    <div className="mt-10 grid grid-cols-1 items-stretch gap-4 md:grid-cols-4">
      {steps.map((s, i) => (
        <Reveal key={s.title} delay={i * 0.1}>
          <div className="relative flex h-full flex-col items-center rounded-3xl bg-white p-6 text-center shadow-sm ring-1 ring-black/5">
            <span className="grid h-16 w-16 place-items-center rounded-2xl text-3xl" style={{ background: PRIME_SOFT }}>{s.icon}</span>
            <div className="mt-4 text-xs font-bold" style={{ color: RED }}>STEP {i + 1}</div>
            <div className="mt-1 font-bold text-slate-900">{s.title}</div>
            <p className="mt-1 text-sm text-slate-500">{s.body}</p>
            {i < steps.length - 1 && (
              <span className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-2xl md:block" style={{ color: RED }}>→</span>
            )}
          </div>
        </Reveal>
      ))}
    </div>
  );
}

function SchemeCard({ scheme, index, onOpen }: { scheme: Scheme; index: number; onOpen: () => void }) {
  const accent = ACCENT[scheme.objective];
  const risk = riskColor[scheme.risk];
  const r = RETURNS[scheme.id];
  return (
    <motion.button
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.35, delay: (index % 3) * 0.05 }}
      whileHover={{ y: -4 }}
      onClick={onOpen}
      className="flex h-full flex-col rounded-2xl bg-white p-5 text-left shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-lg"
      style={{ borderTop: `4px solid ${RED}` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-xl" style={{ background: PRIME_SOFT }}>{scheme.icon}</span>
          <div className="min-w-0">
            <div className="truncate font-bold text-slate-900">{scheme.name}</div>
            <span className="rounded px-1.5 py-0.5 text-[10px] font-bold uppercase" style={{ background: `${accent}1a`, color: accent }}>
              {scheme.objective === "lifestage" ? "Life stage" : scheme.objective}
            </span>
          </div>
        </div>
        <span className="shrink-0 rounded-md px-2 py-0.5 text-xs font-semibold" style={{ background: risk.bg, color: risk.fg }}>{scheme.risk}</span>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <div className="text-2xl font-extrabold" style={{ color: RED }}>{r.y1}%</div>
          <div className="text-[10px] uppercase tracking-wide text-slate-400">1-year return*</div>
        </div>
        <MiniBars returns={r} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4 text-xs">
        <div><div className="text-slate-400">Minimum</div><div className="font-semibold text-slate-900">{scheme.minInvestment}</div></div>
        <div><div className="text-slate-400">Fee</div><div className="font-semibold text-slate-900">{scheme.fee}</div></div>
      </div>

      <div className="mt-4 text-sm font-semibold" style={{ color: RED }}>View analytics →</div>
    </motion.button>
  );
}

function SchemeModal({ scheme, onClose }: { scheme: Scheme; onClose: () => void }) {
  const r = RETURNS[scheme.id];
  const m = METRICS[scheme.risk];
  const risk = riskColor[scheme.risk];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ type: "spring", stiffness: 240, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
        className="my-8 w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        {/* header */}
        <div className="flex items-center justify-between gap-3 p-6 text-white" style={{ background: `linear-gradient(120deg, #7f1020, ${RED})` }}>
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 text-2xl">{scheme.icon}</span>
            <div>
              <div className="text-lg font-bold">{scheme.name}</div>
              <div className="text-sm text-white/80">{scheme.tagline}</div>
            </div>
          </div>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-white/15 hover:bg-white/25">✕</button>
        </div>

        <div className="space-y-6 p-6">
          <p className="text-sm text-slate-600"><strong className="text-slate-800">Best for: </strong>{scheme.bestFor}</p>

          {/* growth chart */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <h4 className="font-bold text-slate-900">Growth of ৳100 vs DSEX</h4>
              <span className="rounded-md px-2 py-0.5 text-xs font-semibold" style={{ background: risk.bg, color: risk.fg }}>{scheme.risk} risk</span>
            </div>
            <GrowthLine si={r.si} benchmarkSi={BENCHMARK.si} risk={scheme.risk} />
          </div>

          {/* trailing returns */}
          <div>
            <h4 className="mb-2 font-bold text-slate-900">Trailing returns</h4>
            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                    <th className="p-2.5 text-left">Period</th>
                    {PERIODS.map((p) => <th key={p.key} className="p-2.5 text-right">{p.label}</th>)}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-slate-100">
                    <td className="p-2.5 font-medium text-slate-700">This scheme</td>
                    {PERIODS.map((p) => (
                      <td key={p.key} className="p-2.5 text-right font-bold tabular-nums" style={{ color: RED }}>{r[p.key]}%</td>
                    ))}
                  </tr>
                  <tr className="border-t border-slate-100">
                    <td className="p-2.5 font-medium text-slate-500">DSEX</td>
                    {PERIODS.map((p) => (
                      <td key={p.key} className="p-2.5 text-right tabular-nums text-slate-500">{BENCHMARK[p.key]}%</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* allocation + risk */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h4 className="mb-2 font-bold text-slate-900">Asset allocation</h4>
              <Donut slices={ALLOC[scheme.objective]} />
            </div>
            <div>
              <h4 className="mb-2 font-bold text-slate-900">Risk & efficiency</h4>
              <div className="grid grid-cols-3 gap-2">
                <RiskTile label="Std. dev" value={`${m.stdDev}%`} />
                <RiskTile label="Sharpe" value={m.sharpe.toFixed(2)} />
                <RiskTile label="Beta" value={m.beta.toFixed(2)} />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-slate-50 p-2.5"><div className="text-slate-400">Minimum</div><div className="font-semibold text-slate-900">{scheme.minInvestment}</div></div>
                <div className="rounded-lg bg-slate-50 p-2.5"><div className="text-slate-400">Management fee</div><div className="font-semibold text-slate-900">{scheme.fee}</div></div>
              </div>
            </div>
          </div>

          {/* features */}
          <div>
            <h4 className="mb-2 font-bold text-slate-900">Key features</h4>
            <ul className="space-y-1.5 text-sm text-slate-600">
              {scheme.features.map((f) => (
                <li key={f} className="flex gap-2"><span style={{ color: RED }}>✓</span>{f}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex gap-3 border-t border-slate-100 p-6">
          <button onClick={onClose} className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">Close</button>
          <a href={PBIL.portal} target="_blank" rel="noopener noreferrer" className="flex-1 rounded-xl py-2.5 text-center text-sm font-semibold text-white shadow-lg" style={{ background: RED }}>
            Invest in this scheme →
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

function RiskTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 text-center">
      <div className="text-base font-bold text-slate-900">{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-slate-400">{label}</div>
    </div>
  );
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-70px" }} transition={{ duration: 0.5, delay }}>
      {children}
    </motion.div>
  );
}
