"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { AMCS, getFund, type Fund } from "../data/amcFunds";
import { LightHeader, LightFooter, BRAND_BLUE, BRAND_ORANGE } from "../components/LightChrome";

// ---------------------------------------------------------------------------
// Model
// ---------------------------------------------------------------------------
type RiskType = "Conservative" | "Balanced" | "Aggressive" | "Shariah";

const EQUITY_EXPOSURE: Record<Fund["type"], number> = {
  Equity: 0.88,
  "Shariah Equity": 0.85,
  Balanced: 0.55,
  "Fixed Income": 0.05,
};
const TYPE_RETURN: Record<Fund["type"], number> = {
  Equity: 11,
  "Shariah Equity": 8,
  Balanced: 9.5,
  "Fixed Income": 8.5,
};

const EQUITY_SLEEVE: [string, number][] = [
  ["edge-amc-growth-fund", 0.3],
  ["ekush-growth-fund", 0.26],
  ["investit-growth-fund", 0.24],
  ["midland-bank-growth-fund", 0.2],
];
const INCOME_SLEEVE: [string, number][] = [
  ["edge-high-quality-income-fund", 0.55],
  ["ekush-stable-return-fund", 0.45],
];
const SHARIAH_FUND = "edge-al-amin-shariah-consumer-fund";

interface Holding {
  id: string;
  weight: number;
}

const DEFAULT_BASKETS: {
  key: string;
  name: string;
  emoji: string;
  split: string;
  tagline: string;
  accent: string;
  soft: string;
  holdings: Holding[];
}[] = [
  {
    key: "growth",
    name: "Growth Pack",
    emoji: "🚀",
    split: "80 / 20",
    tagline: "Equity-heavy — go for maximum long-term growth.",
    accent: "#12A150",
    soft: "#ECFDF3",
    holdings: [
      { id: "edge-amc-growth-fund", weight: 28 },
      { id: "ekush-growth-fund", weight: 24 },
      { id: "investit-growth-fund", weight: 16 },
      { id: "midland-bank-growth-fund", weight: 12 },
      { id: "edge-high-quality-income-fund", weight: 12 },
      { id: "ekush-stable-return-fund", weight: 8 },
    ],
  },
  {
    key: "balanced",
    name: "Balanced Pack",
    emoji: "⚖️",
    split: "50 / 50",
    tagline: "Half growth, half income — steady with a cushion.",
    accent: BRAND_BLUE,
    soft: "#EEF4FC",
    holdings: [
      { id: "edge-bangladesh-mutual-fund", weight: 28 },
      { id: "ekush-first-unit-fund", weight: 22 },
      { id: "edge-amc-growth-fund", weight: 18 },
      { id: "edge-high-quality-income-fund", weight: 18 },
      { id: "ekush-stable-return-fund", weight: 14 },
    ],
  },
  {
    key: "income",
    name: "Safety Pack",
    emoji: "🛡️",
    split: "10 / 90",
    tagline: "Protect your money with stable, steady payouts.",
    accent: BRAND_ORANGE,
    soft: "#FFF4EA",
    holdings: [
      { id: "edge-high-quality-income-fund", weight: 50 },
      { id: "ekush-stable-return-fund", weight: 40 },
      { id: "edge-amc-growth-fund", weight: 10 },
    ],
  },
  {
    key: "mix",
    name: "Mix Pack",
    emoji: "🏆",
    split: "All-Star",
    tagline: "The best fund from every asset manager — one diversified all-star basket.",
    accent: "#7c3aed",
    soft: "#F5F3FF",
    holdings: [
      { id: "edge-amc-growth-fund", weight: 30 },
      { id: "ekush-first-unit-fund", weight: 30 },
      { id: "investit-growth-fund", weight: 20 },
      { id: "midland-bank-growth-fund", weight: 20 },
    ],
  },
];

const AMOUNTS = [
  { value: 30_000, label: "৳30K" },
  { value: 50_000, label: "৳50K" },
  { value: 100_000, label: "৳1 Lakh" },
  { value: 500_000, label: "৳5 Lakh" },
];

const RISKS: { key: RiskType; emoji: string; tag: string; accent: string; soft: string }[] = [
  { key: "Conservative", emoji: "🐢", tag: "Play it safe", accent: BRAND_ORANGE, soft: "#FFF4EA" },
  { key: "Balanced", emoji: "⚖️", tag: "Best of both", accent: BRAND_BLUE, soft: "#EEF4FC" },
  { key: "Aggressive", emoji: "🚀", tag: "Go for growth", accent: "#12A150", soft: "#ECFDF3" },
  { key: "Shariah", emoji: "🌙", tag: "Halal only", accent: "#7c3aed", soft: "#F5F3FF" },
];

// Playful investor archetype per basket.
const BADGE: Record<string, { name: string; emoji: string; accent: string; soft: string }> = {
  Growth: { name: "Bold Builder", emoji: "🚀", accent: "#12A150", soft: "#ECFDF3" },
  Balanced: { name: "Smart Balancer", emoji: "⚖️", accent: BRAND_BLUE, soft: "#EEF4FC" },
  "Fixed Income": { name: "Steady Guardian", emoji: "🛡️", accent: BRAND_ORANGE, soft: "#FFF4EA" },
  Shariah: { name: "Halal Grower", emoji: "🌙", accent: "#7c3aed", soft: "#F5F3FF" },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
const bdt = (n: number) => `৳${Math.round(n).toLocaleString("en-IN")}`;
const bdtShort = (n: number) => {
  if (n >= 1e7) return `৳${(n / 1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `৳${(n / 1e5).toFixed(2)} L`;
  if (n >= 1e3) return `৳${(n / 1e3).toFixed(0)}K`;
  return `৳${Math.round(n)}`;
};

function roundTo100(holdings: Holding[]): Holding[] {
  const floored = holdings.map((h) => ({ ...h, weight: Math.floor(h.weight) }));
  let drift = 100 - floored.reduce((s, h) => s + h.weight, 0);
  const order = holdings
    .map((h, i) => ({ i, frac: h.weight - Math.floor(h.weight) }))
    .sort((a, b) => b.frac - a.frac);
  for (let k = 0; k < order.length && drift > 0; k++, drift--) floored[order[k].i].weight += 1;
  return floored.filter((h) => h.weight > 0);
}

function recommend(age: number, years: number, risk: RiskType) {
  if (risk === "Shariah") {
    return { equityPct: 85, archetype: "Shariah", holdings: [{ id: SHARIAH_FUND, weight: 100 }] };
  }
  let eq = 100 - age; // core rule
  eq += risk === "Conservative" ? -15 : risk === "Aggressive" ? 15 : 0;
  eq += clamp((years - 5) * 2, -10, 15);
  eq = clamp(Math.round(eq), 10, 90);
  const fixed = 100 - eq;
  const holdings = roundTo100([
    ...EQUITY_SLEEVE.map(([id, p]) => ({ id, weight: eq * p })),
    ...INCOME_SLEEVE.map(([id, p]) => ({ id, weight: fixed * p })),
  ]);
  const archetype = eq >= 65 ? "Growth" : eq >= 40 ? "Balanced" : "Fixed Income";
  return { equityPct: eq, archetype, holdings };
}

function basketStats(holdings: Holding[]) {
  const total = holdings.reduce((s, h) => s + h.weight, 0) || 1;
  let equity = 0;
  let ret = 0;
  for (const h of holdings) {
    const f = getFund(h.id);
    if (!f) continue;
    const w = h.weight / total;
    equity += w * EQUITY_EXPOSURE[f.type];
    ret += w * (f.annualized ?? TYPE_RETURN[f.type]);
  }
  return { equityPct: Math.round(equity * 100), expReturn: ret };
}

// deterministic confetti pieces (seeded so SSR & client agree)
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const CR = mulberry32(0x9a3f);
const CONFETTI_COLORS = ["#12A150", "#0E50A0", "#F5821E", "#7c3aed", "#f43f5e", "#22d3ee"];
const CONFETTI = Array.from({ length: 46 }, () => ({
  x: CR() * 100,
  s: 6 + CR() * 7,
  rot: (CR() * 2 - 1) * 540,
  dur: 1.6 + CR() * 1.4,
  delay: CR() * 0.35,
  color: CONFETTI_COLORS[Math.floor(CR() * CONFETTI_COLORS.length)],
}));
// gold coins raining down while the basket drops in
const COINS = Array.from({ length: 16 }, () => ({
  x: CR() * 100,
  delay: 0.2 + CR() * 1.2,
  dur: 1.1 + CR() * 1.0,
  size: 12 + CR() * 12,
  rot: (CR() * 2 - 1) * 220,
}));

// Rotating hero word — same crossfade/blur style as the home page headline.
const HERO_WORDS = ["Briddhi Basket", "Mutual Fund Basket"];

function RotatingBasketWord() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setI((p) => (p + 1) % HERO_WORDS.length), 2200);
    return () => window.clearInterval(id);
  }, []);
  return (
    <span className="mt-1 block min-h-[1.15em]">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={HERO_WORDS[i]}
          initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block whitespace-nowrap"
          style={{ color: BRAND_ORANGE }}
        >
          {HERO_WORDS[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
const STEPS = ["Age", "Horizon", "Risk", "Amount"];

export default function BasketPage() {
  const [step, setStep] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [age, setAge] = useState(30);
  const [years, setYears] = useState(10);
  const [risk, setRisk] = useState<RiskType>("Balanced");
  const [amount, setAmount] = useState(50_000);
  const [dir, setDir] = useState(1);

  const rec = useMemo(() => recommend(age, years, risk), [age, years, risk]);

  const go = (d: number) => {
    setDir(d);
    if (d > 0 && step === STEPS.length - 1) {
      setRevealed(true);
      return;
    }
    setStep((s) => clamp(s + d, 0, STEPS.length - 1));
  };

  const restart = () => {
    setRevealed(false);
    setStep(0);
    setDir(-1);
  };

  return (
    <div className="min-h-screen bg-[#F7F8FB] text-slate-900" style={{ colorScheme: "light" }}>
      <LightHeader />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-[#F7F8FB]">
        <div className="mx-auto max-w-4xl px-4 pb-6 pt-12 text-center sm:px-6">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold" style={{ color: BRAND_ORANGE }}>
              🧺 Briddhi Basket · build your fund bundle in 4 taps
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
              Let&apos;s build your
              <RotatingBasketWord />
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-base text-slate-500">
              Answer 4 quick questions. We&apos;ll size your share-market bet with the famous{" "}
              <span className="font-semibold text-slate-700">100 − age</span> rule and hand you a ready basket of Briddhi
              funds. 🎯
            </p>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-2xl px-4 pb-8 sm:px-6">
        <AnimatePresence mode="wait">
          {!revealed ? (
            <motion.div key="wizard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* progress */}
              <div className="mb-5">
                <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>
                    Step {step + 1} of {STEPS.length} · {STEPS[step]}
                  </span>
                  <span>{Math.round(((step + 1) / STEPS.length) * 100)}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${BRAND_ORANGE}, #12A150)` }}
                    animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                    transition={{ type: "spring", stiffness: 120, damping: 18 }}
                  />
                </div>
              </div>

              {/* question card */}
              <div className="relative min-h-[360px] overflow-hidden rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 sm:p-8">
                <AnimatePresence mode="wait" custom={dir}>
                  <motion.div
                    key={step}
                    custom={dir}
                    initial={{ opacity: 0, x: dir * 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: dir * -60 }}
                    transition={{ duration: 0.28 }}
                  >
                    {step === 0 && <AgeStep age={age} setAge={setAge} rec={rec} />}
                    {step === 1 && <HorizonStep years={years} setYears={setYears} />}
                    {step === 2 && <RiskStep risk={risk} setRisk={setRisk} />}
                    {step === 3 && <AmountStep amount={amount} setAmount={setAmount} />}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* nav */}
              <div className="mt-5 flex items-center justify-between">
                <button
                  onClick={() => go(-1)}
                  disabled={step === 0}
                  className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-100 disabled:opacity-0"
                >
                  ← Back
                </button>
                <button
                  onClick={() => go(1)}
                  className="rounded-xl px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5"
                  style={{ background: step === STEPS.length - 1 ? "#12A150" : BRAND_ORANGE }}
                >
                  {step === STEPS.length - 1 ? "Reveal my basket 🎉" : "Next →"}
                </button>
              </div>
            </motion.div>
          ) : (
            <Reveal key="reveal" rec={rec} amount={amount} years={years} age={age} risk={risk} onRestart={restart} onAdjust={() => setRevealed(false)} />
          )}
        </AnimatePresence>
      </div>

      {/* QUICK-START PACKS */}
      <div className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <div className="mb-5 text-center">
          <h2 className="text-2xl font-bold tracking-tight">
            …or grab a <span style={{ color: BRAND_ORANGE }}>starter pack</span> ⚡
          </h2>
          <p className="mt-1 text-sm text-slate-500">Prebuilt from funds already on Briddhi · priced for {bdt(amount)}.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {DEFAULT_BASKETS.map((b, i) => (
            <PackCard key={b.key} pack={b} amount={amount} years={years} index={i} />
          ))}
        </div>

        <p className="mt-10 text-center text-xs leading-relaxed text-slate-400">
          Illustrative only — not investment advice. The 100 − age rule is a rule of thumb for sizing equity exposure.
          Returns are blended from each fund&apos;s reported figure (or a representative rate for newer funds) and are not
          guaranteed. Mutual fund investments are subject to market risk.
        </p>
      </div>

      <LightFooter />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Steps
// ---------------------------------------------------------------------------
function StepHead({ emoji, q, sub }: { emoji: string; q: string; sub?: string }) {
  return (
    <div className="text-center">
      <div className="text-5xl">{emoji}</div>
      <h3 className="mt-3 text-2xl font-bold tracking-tight">{q}</h3>
      {sub && <p className="mt-1 text-sm text-slate-500">{sub}</p>}
    </div>
  );
}

function ageEmoji(a: number) {
  if (a < 25) return "🧑‍🎓";
  if (a < 35) return "🧑‍💼";
  if (a < 50) return "👨‍👩‍👧";
  if (a < 60) return "🧔";
  return "🧓";
}

function AgeStep({ age, setAge, rec }: { age: number; setAge: (n: number) => void; rec: ReturnType<typeof recommend> }) {
  const eq = 100 - age;
  return (
    <div>
      <StepHead emoji={ageEmoji(age)} q="How old are you?" sub="This sets how much goes into the share market." />
      <div className="mt-6 text-center">
        <span className="text-5xl font-extrabold tabular-nums" style={{ color: BRAND_ORANGE }}>
          {age}
        </span>
        <span className="ml-1 text-lg font-semibold text-slate-400">years</span>
      </div>
      <input
        type="range"
        min={18}
        max={70}
        value={age}
        onChange={(e) => setAge(Number(e.target.value))}
        className="mt-4 w-full"
        style={{ accentColor: BRAND_ORANGE }}
      />
      {/* live 100 - age visual */}
      <div className="mt-6 rounded-2xl bg-slate-50 p-4">
        <div className="text-center text-sm font-semibold text-slate-600">
          100 − {age} = <span style={{ color: "#12A150" }}>{eq}%</span> in share market
        </div>
        <div className="mt-2 flex h-4 overflow-hidden rounded-full bg-slate-200">
          <motion.div className="h-full" style={{ background: "#12A150" }} animate={{ width: `${eq}%` }} transition={{ type: "spring", stiffness: 120, damping: 18 }} />
          <motion.div className="h-full" style={{ background: "#cbd5e1" }} animate={{ width: `${100 - eq}%` }} transition={{ type: "spring", stiffness: 120, damping: 18 }} />
        </div>
        <div className="mt-1.5 flex justify-between text-[11px] font-medium text-slate-400">
          <span>🚀 Growth {eq}%</span>
          <span>🛡️ Safety {100 - eq}%</span>
        </div>
      </div>
    </div>
  );
}

function HorizonStep({ years, setYears }: { years: number; setYears: (n: number) => void }) {
  const tree = years < 3 ? "🌱" : years < 10 ? "🌿" : "🌳";
  const line = years < 3 ? "Short & steady wins." : years < 10 ? "Nice — time to grow." : "Long game = big compounding!";
  return (
    <div>
      <StepHead emoji={tree} q="How long will you stay invested?" sub="Longer time lets you take a little more risk." />
      <div className="mt-6 text-center">
        <span className="text-5xl font-extrabold tabular-nums" style={{ color: "#12A150" }}>
          {years}
        </span>
        <span className="ml-1 text-lg font-semibold text-slate-400">years</span>
      </div>
      <input type="range" min={1} max={30} value={years} onChange={(e) => setYears(Number(e.target.value))} className="mt-4 w-full" style={{ accentColor: "#12A150" }} />
      <div className="mt-6 rounded-2xl bg-emerald-50 p-4 text-center text-sm font-semibold text-emerald-700">{line}</div>
    </div>
  );
}

function RiskStep({ risk, setRisk }: { risk: RiskType; setRisk: (r: RiskType) => void }) {
  return (
    <div>
      <StepHead emoji="🎮" q="Pick your play style" sub="How do you feel about ups and downs?" />
      <div className="mt-6 grid grid-cols-2 gap-3">
        {RISKS.map((r) => {
          const on = risk === r.key;
          return (
            <button
              key={r.key}
              onClick={() => setRisk(r.key)}
              className="rounded-2xl border-2 p-4 text-left transition-all"
              style={on ? { borderColor: r.accent, background: r.soft } : { borderColor: "#e2e8f0", background: "#fff" }}
            >
              <div className="text-3xl">{r.emoji}</div>
              <div className="mt-2 font-bold text-slate-800">{r.key}</div>
              <div className="text-xs text-slate-500">{r.tag}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AmountStep({ amount, setAmount }: { amount: number; setAmount: (n: number) => void }) {
  return (
    <div>
      <StepHead emoji="🪙" q="How much to invest?" sub="Pick a preset or type your own." />
      <div className="mt-6 grid grid-cols-2 gap-3">
        {AMOUNTS.map((a) => {
          const on = amount === a.value;
          return (
            <button
              key={a.value}
              onClick={() => setAmount(a.value)}
              className="rounded-2xl border-2 p-4 text-center transition-all"
              style={on ? { borderColor: BRAND_ORANGE, background: "#FFF4EA" } : { borderColor: "#e2e8f0", background: "#fff" }}
            >
              <div className="text-xl font-extrabold" style={{ color: on ? BRAND_ORANGE : "#334155" }}>
                {a.label}
              </div>
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2">
        <span className="text-lg text-slate-400">৳</span>
        <input
          type="number"
          min={1000}
          step={1000}
          value={amount}
          onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
          className="w-full bg-transparent text-lg font-bold tabular-nums outline-none"
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Reveal
// ---------------------------------------------------------------------------
function Reveal({
  rec,
  amount,
  years,
  age,
  risk,
  onRestart,
  onAdjust,
}: {
  rec: ReturnType<typeof recommend>;
  amount: number;
  years: number;
  age: number;
  risk: RiskType;
  onRestart: () => void;
  onAdjust: () => void;
}) {
  const stats = basketStats(rec.holdings);
  const fixedPct = 100 - stats.equityPct;
  const projected = amount * Math.pow(1 + stats.expReturn / 100, years);
  const badge = BADGE[rec.archetype] ?? BADGE.Balanced;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="relative">
      {/* confetti */}
      <div className="pointer-events-none absolute inset-x-0 -top-6 h-64 overflow-hidden">
        {CONFETTI.map((c, i) => (
          <motion.span
            key={i}
            className="absolute rounded-sm"
            style={{ left: `${c.x}%`, top: "-10%", width: c.s, height: c.s * 1.5, background: c.color }}
            initial={{ y: 0, opacity: 1, rotate: 0 }}
            animate={{ y: 260, opacity: [1, 1, 0], rotate: c.rot }}
            transition={{ duration: c.dur, delay: c.delay, ease: "easeIn" }}
          />
        ))}
      </div>

      <div className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-lg ring-1 ring-black/5 sm:p-8" style={{ boxShadow: `0 0 0 2px ${badge.accent}22, 0 20px 50px rgba(0,0,0,0.10)` }}>
        {/* a golden basket drops from the top, then the funds rain into it */}
        <BasketDrop holdings={rec.holdings} amount={amount} accent={badge.accent} />
        {/* badge */}
        <div className="text-center">
          <motion.div initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }} className="mx-auto grid h-20 w-20 place-items-center rounded-full text-4xl" style={{ background: badge.soft }}>
            {badge.emoji}
          </motion.div>
          <div className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">You are a</div>
          <div className="text-2xl font-extrabold" style={{ color: badge.accent }}>
            {badge.name}
          </div>
          <div className="mt-1 text-sm text-slate-500">
            Age {age} · {years}-yr horizon · {risk} · <span className="font-semibold">{rec.archetype} basket</span>
          </div>
        </div>

        {/* projection */}
        <div className="mt-6 rounded-2xl p-5 text-center" style={{ background: badge.soft }}>
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Your {bdtShort(amount)} could grow to</div>
          <div className="mt-1 text-4xl font-extrabold tabular-nums" style={{ color: badge.accent }}>
            <CountUp value={projected} format={bdtShort} />
          </div>
          <div className="mt-1 text-sm text-slate-500">
            in {years} years · ~{stats.expReturn.toFixed(1)}%/yr (illustrative)
          </div>
        </div>

        {/* split */}
        <div className="mt-6">
          <div className="flex justify-between text-xs font-semibold text-slate-500">
            <span>🚀 Share market {stats.equityPct}%</span>
            <span>🛡️ Fixed income {fixedPct}%</span>
          </div>
          <div className="mt-1.5 flex h-3.5 overflow-hidden rounded-full bg-slate-100">
            <motion.div style={{ background: badge.accent }} initial={{ width: 0 }} animate={{ width: `${stats.equityPct}%` }} transition={{ duration: 0.7, delay: 0.2 }} />
            <motion.div style={{ background: "#cbd5e1" }} initial={{ width: 0 }} animate={{ width: `${fixedPct}%` }} transition={{ duration: 0.7, delay: 0.35 }} />
          </div>
        </div>

        {/* funds */}
        <div className="mt-6 space-y-2.5">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Your {rec.holdings.length} funds</div>
          {rec.holdings.map((h, i) => {
            const f = getFund(h.id);
            if (!f) return null;
            const amc = AMCS[f.amc];
            return (
              <motion.div
                key={h.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="flex items-center gap-3 rounded-xl bg-slate-50 p-2.5"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white ring-1 ring-black/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/fund-logos/${f.amc}.png`} alt="" className="max-h-5 max-w-5 object-contain" />
                </span>
                <div className="min-w-0 flex-1">
                  <Link href={`/funds/${f.id}`} className="block truncate text-sm font-semibold text-slate-800 hover:underline">
                    {f.name}
                  </Link>
                  <div className="text-[11px] text-slate-400">
                    {f.type} · {f.risk} risk
                  </div>
                </div>
                <div className="shrink-0 text-right tabular-nums">
                  <div className="text-sm font-bold" style={{ color: amc?.color ?? "#0f172a" }}>
                    {h.weight}%
                  </div>
                  <div className="text-[11px] text-slate-400">{bdt((amount * h.weight) / 100)}</div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* actions */}
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Link href="/portal" className="flex-1 rounded-xl py-3 text-center text-sm font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5" style={{ background: badge.accent }}>
            Invest this basket →
          </Link>
          <button onClick={onAdjust} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50">
            ✏️ Adjust
          </button>
          <button onClick={onRestart} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50">
            ↺ Restart
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// count-up number animation
function CountUp({ value, format }: { value: number; format: (n: number) => string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const dur = 1000;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{format(n)}</>;
}

// ---------------------------------------------------------------------------
// Quick-start pack card
// ---------------------------------------------------------------------------
function PackCard({ pack, amount, years, index }: { pack: (typeof DEFAULT_BASKETS)[number]; amount: number; years: number; index: number }) {
  const stats = basketStats(pack.holdings);
  const projected = amount * Math.pow(1 + stats.expReturn / 100, years);
  const [open, setOpen] = useState(false);
  const N = pack.holdings.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setOpen(true)}
      onHoverEnd={() => setOpen(false)}
      onClick={() => setOpen((o) => !o)}
      className="flex h-full flex-col rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5"
      style={{ borderTop: `4px solid ${pack.accent}`, zIndex: open ? 20 : 1 }}
    >
      {/* header */}
      <div className="flex items-center justify-between">
        <span className="text-2xl">{pack.emoji}</span>
        <span className="rounded-full px-2.5 py-1 text-[11px] font-bold" style={{ background: pack.soft, color: pack.accent }}>
          {pack.split}
        </span>
      </div>
      <div className="mt-2 font-bold text-slate-900">{pack.name}</div>
      <p className="text-xs leading-snug text-slate-500">{pack.tagline}</p>

      {/* ── BASKET STAGE — transparent basket silhouette; funds orbit out in a circle on hover ── */}
      <div className="relative mt-2 h-[240px] select-none overflow-hidden" title="Hover to open the basket">
        {/* faint, colour-tinted see-through basket */}
        <BasketSilhouette color={pack.accent} open={open} />

        {/* fund balls — cluster inside the basket at rest, orbit into a ring on hover */}
        {pack.holdings.map((h, i) => {
          const f = getFund(h.id);
          if (!f) return null;
          const amc = AMCS[f.amc];
          const ang = ((-90 + i * (360 / N)) * Math.PI) / 180; // evenly spaced around a circle, first ball at top
          const R = 76;
          return (
            <motion.div
              key={h.id}
              custom={i}
              initial="rest"
              animate={open ? "open" : "rest"}
              variants={{
                rest: (ci: number) => ({ x: (ci - (N - 1) / 2) * 14, y: 30 + (ci % 3) * 5, scale: 0.72, opacity: 0.9 }),
                open: () => ({ x: Math.cos(ang) * R, y: Math.sin(ang) * R, scale: 1, opacity: 1, transition: { type: "spring", stiffness: 240, damping: 15, delay: i * 0.05 } }),
              }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
              className="absolute left-1/2 top-1/2"
              style={{ zIndex: 5 + i }}
            >
              <div className="flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                {/* the AMC ball */}
                <span className="grid h-11 w-11 place-items-center rounded-full bg-white shadow-lg ring-2" style={{ borderColor: amc?.color ?? "#e2e8f0" }} title={f.name}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/fund-logos/${f.amc}.png`} alt={amc?.name ?? ""} className="max-h-6 max-w-6 object-contain" />
                </span>
                {/* weight % pill — appears when the basket opens */}
                <motion.span
                  initial="rest"
                  animate={open ? "open" : "rest"}
                  variants={{ rest: { opacity: 0, y: -4 }, open: { opacity: 1, y: 0, transition: { delay: 0.14 + i * 0.05 } } }}
                  className="mt-1 rounded-full bg-white px-1.5 py-0.5 text-[10px] font-bold shadow-sm ring-1 ring-black/5 tabular-nums"
                  style={{ color: amc?.color }}
                >
                  {h.weight}%
                </motion.span>
              </div>
            </motion.div>
          );
        })}

        {/* hint */}
        <motion.div animate={{ opacity: open ? 0 : 1 }} className="absolute inset-x-0 bottom-1 text-center text-[10px] font-medium text-slate-400">
          hover to open 🧺
        </motion.div>
      </div>

      {/* projection + invest */}
      <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
        <span>Equity {stats.equityPct}%</span>
        <span>{N} funds</span>
      </div>
      <div className="mt-2 rounded-xl p-2.5 text-center" style={{ background: pack.soft }}>
        <div className="text-[10px] uppercase tracking-wide text-slate-500">In {years} yrs ≈</div>
        <div className="text-lg font-extrabold" style={{ color: pack.accent }}>
          {bdtShort(projected)}
        </div>
      </div>

      <Link href="/portal" onClick={(e) => e.stopPropagation()} className="mt-3 rounded-xl py-2 text-center text-sm font-bold text-white transition-transform hover:-translate-y-0.5" style={{ background: pack.accent }}>
        Invest →
      </Link>
    </motion.div>
  );
}

// A faint, see-through basket drawn in the pack's accent colour. Gives a gentle
// squeeze/scale when the funds pop out.
function BasketSilhouette({ color, open }: { color: string; open: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 160 130"
      className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ width: 150, height: 122, opacity: 0.55 }}
      fill="none"
      stroke={color}
      animate={{ scale: open ? 1.05 : 1, y: open ? 6 : 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 16 }}
    >
      {/* handle */}
      <path d="M44 62 A36 30 0 0 1 116 62" strokeWidth="4" strokeLinecap="round" opacity="0.55" />
      {/* rim */}
      <ellipse cx="80" cy="66" rx="54" ry="9" strokeWidth="3" fill={color} fillOpacity="0.06" />
      {/* body */}
      <path d="M30 66 L130 66 L116 120 L44 120 Z" strokeWidth="3" fill={color} fillOpacity="0.08" strokeLinejoin="round" />
      {/* vertical weave */}
      <path d="M58 68 L52 118 M80 68 L80 120 M102 68 L108 118" strokeWidth="2" opacity="0.4" />
      {/* horizontal weave */}
      <path d="M34 82 L126 82 M37 98 L123 98 M40 112 L120 112" strokeWidth="2" opacity="0.32" />
    </motion.svg>
  );
}

// Reveal showpiece: a GIANT 50%-transparent basket sits in the middle, the fund
// balls fall into it (each sized by the money invested), and hovering pops every
// ball up into a circle around the basket.
function BasketDrop({ holdings, amount, accent }: { holdings: Holding[]; amount: number; accent: string }) {
  const N = holdings.length;
  const maxW = Math.max(...holdings.map((h) => h.weight), 1);
  const [open, setOpen] = useState(false);

  // rest slots — cluster the balls DOWN INSIDE the bowl; size scaled by ৳ invested.
  const slots = holdings.map((h, i) => {
    const r = mulberry32(0x77 + i * 0x9e3779b1);
    const a = r();
    const b = r();
    return {
      size: Math.round(40 + (h.weight / maxW) * 44), // 40 … 84 px by amount
      x: clamp((i - (N - 1) / 2) * (118 / Math.max(N, 1)) + (a * 2 - 1) * 16, -92, 92),
      y: 34 + b * 40, // 34 … 74 px below centre → sits in the bowl
      zi: Math.round((h.weight / maxW) * 10),
    };
  });
  const basketSpring = { type: "spring" as const, stiffness: 240, damping: 16, delay: 0.05 };
  const R = 118; // hover ring radius

  return (
    <div
      className="relative mx-auto mb-3 flex h-[380px] w-full max-w-xl cursor-pointer justify-center overflow-hidden"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={() => setOpen((o) => !o)}
    >
      {/* golden glow (centred via margins so framer's transform can't offset it) */}
      <motion.div
        className="pointer-events-none absolute rounded-full"
        style={{ left: "50%", top: "50%", marginLeft: -210, marginTop: -160, width: 420, height: 320, background: "radial-gradient(circle, rgba(245,180,60,0.3) 0%, rgba(245,180,60,0) 68%)" }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: [0, 1, 0.8], scale: [0.6, 1.12, 1] }}
        transition={{ duration: 1.3, times: [0, 0.5, 1] }}
      />

      {/* raining coins */}
      {COINS.map((c, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute select-none"
          style={{ left: `${c.x}%`, top: -36, fontSize: c.size + 4, zIndex: 1 }}
          initial={{ y: 0, opacity: 0, rotate: 0 }}
          animate={{ y: 420, opacity: [0, 1, 1, 0], rotate: c.rot }}
          transition={{ duration: c.dur + 0.4, delay: c.delay, ease: "easeIn", repeat: Infinity, repeatDelay: 1.8 }}
        >
          🪙
        </motion.span>
      ))}

      {/* GIANT 50%-transparent basket — centred in the card via margins */}
      <motion.svg
        viewBox="0 0 360 260"
        className="pointer-events-none absolute"
        style={{ left: "50%", top: "50%", marginLeft: -180, marginTop: -130, width: 360, height: 260, zIndex: 2 }}
        fill="none"
        stroke="#b9791f"
        initial={{ y: -440, opacity: 0 }}
        animate={{ y: 0, opacity: 0.5, scaleY: [1, 1, 0.94, 1] }}
        transition={{ y: basketSpring, opacity: { duration: 0.2, delay: 0.05 }, scaleY: { duration: 0.5, delay: 0.32 } }}
      >
        {/* handle */}
        <path d="M86 120 A94 82 0 0 1 274 120" strokeWidth="8" strokeLinecap="round" opacity="0.7" />
        {/* rim */}
        <ellipse cx="180" cy="122" rx="146" ry="18" strokeWidth="6" fill="#f2c25a" fillOpacity="0.12" />
        {/* body */}
        <path d="M34 122 L326 122 L276 246 L84 246 Z" strokeWidth="6" fill="#f2c25a" fillOpacity="0.14" strokeLinejoin="round" />
        {/* vertical weave */}
        <path d="M82 124 L98 244 M132 124 L138 246 M180 124 L180 246 M228 124 L222 246 M278 124 L262 244" strokeWidth="4" opacity="0.5" />
        {/* horizontal weave */}
        <path d="M44 156 L316 156 M52 188 L308 188 M62 218 L298 218" strokeWidth="4" opacity="0.42" />
      </motion.svg>

      {/* fund balls — fall into the basket; hover pops them into a circle */}
      {holdings.map((h, i) => {
        const f = getFund(h.id);
        if (!f) return null;
        const amc = AMCS[f.amc];
        const s = slots[i];
        const shortName = f.name.split(" ").slice(0, 2).join(" ");
        const ang = ((-90 + i * (360 / N)) * Math.PI) / 180;
        const target = open ? { x: Math.cos(ang) * R, y: Math.sin(ang) * R } : { x: s.x, y: s.y };
        const delay = 0.6 + i * 0.12;
        return (
          <div key={h.id} className="absolute left-1/2 top-1/2" style={{ zIndex: 6 + s.zi }}>
            {/* entrance fall */}
            <motion.div initial={{ y: -440, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 340, damping: 13, delay }}>
              {/* rest ↔ circle offset */}
              <motion.div animate={{ x: target.x, y: target.y }} transition={{ type: "spring", stiffness: 260, damping: 18 }}>
                <div className="flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                  {/* name + % pill — shows when popped into the circle */}
                  <AnimatePresence>
                    {open && (
                      <motion.span
                        initial={{ opacity: 0, y: 8, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.8 }}
                        transition={{ delay: 0.1 + i * 0.03 }}
                        className="mb-1 whitespace-nowrap rounded-full bg-white px-2 py-0.5 text-[11px] font-bold shadow-lg ring-1 ring-black/5"
                        style={{ color: amc?.color }}
                      >
                        {shortName} · {h.weight}%
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {/* the AMC ball, sized by amount */}
                  <span
                    className="grid place-items-center rounded-full bg-white shadow-lg ring-2"
                    style={{ width: s.size, height: s.size, borderColor: amc?.color ?? "#e2e8f0" }}
                    title={`${f.name} · ${bdt((amount * h.weight) / 100)}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/fund-logos/${f.amc}.png`} alt={amc?.name ?? ""} className="object-contain" style={{ maxHeight: s.size * 0.56, maxWidth: s.size * 0.56 }} />
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        );
      })}

      {/* hint */}
      <motion.div animate={{ opacity: open ? 0 : 1 }} className="pointer-events-none absolute inset-x-0 bottom-1 text-center text-[11px] font-medium text-slate-400">
        hover the basket to see your funds 🧺
      </motion.div>
    </div>
  );
}
