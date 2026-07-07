"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { LightHeader, LightFooter } from "../components/LightChrome";

// ============================================================================
// Briddhi — light-mode redesign DRAFT (from Figma). Self-contained: own header
// & footer (global dark chrome is hidden on /draft). "Stable money" aesthetic.
// ============================================================================

const BLUE = "#0E50A0";
const ORANGE = "#F5821E";

const HERO_CARDS = [
  { id: "ekush-first-unit-fund", name: "Ekush First Unit Fund", amc: "ekush", ytm: 13.6, nav: 15.43, min: 1000, alloc: [55, 35, 10] },
  { id: "edge-amc-growth-fund", name: "EDGE AMC Growth Fund", amc: "edge", ytm: 15.0, nav: 16.49, min: 1000, alloc: [88, 7, 5] },
  { id: "investit-growth-fund", name: "Investit Growth Fund", amc: "investit", ytm: 8.6, nav: 11.69, min: 1000, alloc: [88, 7, 5] },
  { id: "ekush-growth-fund", name: "Ekush Growth Fund", amc: "ekush", ytm: 13.8, nav: 13.13, min: 1000, alloc: [88, 7, 5] },
  { id: "midland-bank-growth-fund", name: "Midland Bank Growth Fund", amc: "midland", ytm: 0.5, nav: 10.05, min: 1000, alloc: [88, 7, 5] },
];

const PARTNERS = ["ekush", "investit", "edge", "vipb", "midland"];

export default function DraftPage() {
  return (
    <div className="min-h-screen bg-[#F7F8FB] text-slate-900" style={{ colorScheme: "light" }}>
      <LightHeader />
      <Hero />
      <LogosStrip />
      <JourneySection />
      <WhatIsMutualFund />
      <HowItWorks />
      <StepsSection />
      <CTASection />
      <LightFooter />
    </div>
  );
}

// ----------------------------------------------------------------------------
// Hero — 6s crossfading slideshow + auto-sliding fund cards
// ----------------------------------------------------------------------------
const HERO_WORDS = ["Mutual Funds", "Bangladesh", "You"];

function RotatingHeadline() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setI((p) => (p + 1) % HERO_WORDS.length), 2200);
    return () => window.clearInterval(id);
  }, []);
  return (
    <motion.h1
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-4xl font-bold leading-[1.12] tracking-tight text-white sm:text-5xl md:text-6xl"
    >
      Invest in{" "}
      <span className="relative inline-block align-bottom">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={HERO_WORDS[i]}
            initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="inline-block whitespace-nowrap"
            style={{ color: ORANGE }}
          >
            {HERO_WORDS[i]}
          </motion.span>
        </AnimatePresence>
      </span>
    </motion.h1>
  );
}

const HERO_SLIDES = ["/hero-3.jpg", "/hero-1.jpg", "/hero-2.jpg"];
const HERO_SLIDE_MS = 6000; // 6 seconds per image

function Hero() {
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), HERO_SLIDE_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: "#0a1122" }}>
      {/* crossfading background slideshow */}
      <div className="absolute inset-0">
        {HERO_SLIDES.map((src, idx) => (
          <motion.div
            key={src}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${src}')` }}
            initial={false}
            animate={{ opacity: slide === idx ? 1 : 0, scale: slide === idx ? 1.06 : 1 }}
            transition={{ opacity: { duration: 1.2, ease: "easeInOut" }, scale: { duration: HERO_SLIDE_MS / 1000, ease: "linear" } }}
          />
        ))}
      </div>
      {/* dark overlay for text legibility */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgba(6,11,26,0.80) 0%, rgba(9,18,40,0.46) 40%, rgba(7,14,32,0.82) 100%)" }}
      />

      <div className="relative mx-auto max-w-5xl px-4 pt-16 pb-4 text-center sm:px-6 md:pt-24 lg:px-8">
        <RotatingHeadline />
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          <Link href="/funds" className="rounded-lg px-5 py-3 font-semibold text-white shadow-lg transition-transform hover:-translate-y-0.5" style={{ background: ORANGE }}>
            Start Investing →
          </Link>
          <Link href="/learn" className="rounded-lg border border-white/25 bg-white/10 px-5 py-3 font-semibold text-white backdrop-blur transition-colors hover:bg-white/20">
            Learn to Invest
          </Link>
        </motion.div>
      </div>

      <div className="group/slider relative pb-14 pt-6 md:pb-20">
        <div className="marquee-mask overflow-hidden">
          <div className="animate-slide flex w-max gap-5 px-4">
            {[...HERO_CARDS, ...HERO_CARDS].map((c, i) => (
              <FundCard key={i} card={c} />
            ))}
          </div>
        </div>
      </div>

      {/* 6-second slide indicators */}
      <div className="relative z-10 flex justify-center gap-2 pb-6">
        {HERO_SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setSlide(idx)}
            aria-label={`Show slide ${idx + 1}`}
            className="h-2 rounded-full transition-all"
            style={{ width: slide === idx ? 26 : 8, background: slide === idx ? ORANGE : "rgba(255,255,255,0.45)" }}
          />
        ))}
      </div>
    </section>
  );
}

function FundCard({ card }: { card: (typeof HERO_CARDS)[number] }) {
  const [stock, govt, others] = card.alloc;
  return (
    <div className="w-[310px] shrink-0 rounded-2xl bg-white p-5 text-slate-900 shadow-xl ring-1 ring-black/5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-slate-200 bg-white p-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/fund-logos/${card.amc}.png`} alt="" className="max-h-full max-w-full object-contain" />
          </span>
          <div className="min-w-0 text-sm font-semibold leading-tight">{card.name}</div>
        </div>
        <span className="shrink-0 rounded-md border border-sky-200 bg-sky-50 px-2 py-1 text-xs font-semibold text-sky-700">
          {card.ytm >= 0 ? "+" : ""}
          {card.ytm}% YTD
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="font-medium text-slate-500">Asset Allocation</span>
        <span className="font-semibold tabular-nums">{stock}:{govt}:{others}</span>
      </div>
      <div className="mt-2 flex h-2.5 overflow-hidden rounded-full bg-slate-100">
        <span style={{ width: `${stock}%`, background: ORANGE }} />
        <span style={{ width: `${govt}%`, background: BLUE }} />
        <span style={{ width: `${others}%`, background: "#10b981" }} />
      </div>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full" style={{ background: ORANGE }} /> Equity
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full" style={{ background: BLUE }} /> Govt. Securities
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full" style={{ background: "#10b981" }} /> Cash &amp; Others
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="flex gap-5 text-xs">
          <div>
            <div className="text-slate-400">Min</div>
            <div className="text-sm font-semibold">৳{card.min.toLocaleString("en-IN")}</div>
          </div>
          <div>
            <div className="text-slate-400">Nav</div>
            <div className="text-sm font-semibold tabular-nums">{card.nav.toFixed(3)}</div>
          </div>
        </div>
        <Link href={`/funds/${card.id}`} className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5" style={{ background: ORANGE }}>
          Invest Now
        </Link>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Partner logos strip
// ----------------------------------------------------------------------------
function LogosStrip() {
  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-4 py-6 sm:px-6 lg:px-8">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Partnered with</span>
        {PARTNERS.map((p) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={p} src={`/fund-logos/${p}.png`} alt={p} className="h-7 w-auto opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0" />
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// "Your Journey to Financial Freedom" — 3 stat cards
// ----------------------------------------------------------------------------
const JOURNEY = [
  { badge: "Institutional Grade", icon: "🏙️", tint: "from-orange-100 to-amber-50", accent: ORANGE, prefix: "BDT ", value: 131, suffix: " Lakh+", title: "Total value processed", body: "Handled with full transparency and the trust of thousands of investors." },
  { badge: "Strong Partnerships", icon: "🌉", tint: "from-sky-100 to-blue-50", accent: BLUE, prefix: "BDT ", value: 288, suffix: " CR++", title: "Assets under management", body: "Managed together with Bangladesh's leading partner AMCs." },
  { badge: "Built for Everyone", icon: "🌱", tint: "from-emerald-100 to-green-50", accent: "#10b981", prefix: "Start with ৳", value: 1000, suffix: "", title: "No exit fees, no commissions", body: "Just a simpler, smarter way to start investing — from any income." },
];

function JourneySection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <Reveal>
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
          Your Journey to <span style={{ color: BLUE }}>Financial Freedom</span> Begins Today
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-slate-500">
          Invest confidently with trusted platforms, powerful partnerships, and opportunities designed to grow with you.
        </p>
      </Reveal>
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {JOURNEY.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.1}>
            <motion.div whileHover={{ y: -6 }} className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5">
              <div className={`relative grid h-40 place-items-center bg-gradient-to-br ${c.tint}`}>
                <span className="text-6xl drop-shadow-sm">{c.icon}</span>
                <span className="absolute left-4 top-4 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold" style={{ color: c.accent }}>
                  {c.badge}
                </span>
              </div>
              <div className="p-6">
                <div className="text-2xl font-extrabold tracking-tight" style={{ color: c.accent }}>
                  <CountUp prefix={c.prefix} to={c.value} suffix={c.suffix} />
                </div>
                <div className="mt-1 font-semibold text-slate-900">{c.title}</div>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{c.body}</p>
              </div>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------------
// "What is a Mutual Fund?" — a jar pulling in blue-chip stocks (motion visual)
// ----------------------------------------------------------------------------
const BLUE_CHIPS = [
  { t: "GP", c: "#0ea5e9" },
  { t: "SQUARE", c: "#10b981" },
  { t: "BRAC", c: "#f97316" },
  { t: "BEXIMCO", c: "#8b5cf6" },
  { t: "WALTON", c: "#ef4444" },
  { t: "RENATA", c: "#14b8a6" },
  { t: "CITY BK", c: "#3b82f6" },
  { t: "BATBC", c: "#eab308" },
  { t: "LHBL", c: "#64748b" },
];

function WhatIsMutualFund() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
        <Reveal>
          <div className="inline-block rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold" style={{ color: ORANGE }}>
            THE BASICS
          </div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            What is a <span style={{ color: ORANGE }}>Mutual Fund?</span>
          </h2>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-slate-600">
            Think of it as one jar that holds many investments. You buy a single unit — and instantly own a
            slice of dozens of blue-chip companies and bonds, chosen and managed by experts.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-slate-600">
            {["Instant diversification, one purchase", "Managed by professional fund managers", "Start with as little as ৳1,000"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span className="grid h-5 w-5 place-items-center rounded-full text-white" style={{ background: "#10b981" }}>✓</span>
                {t}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.15}>
          <Jar />
        </Reveal>
      </div>
    </section>
  );
}

function Jar() {
  return (
    <div className="relative mx-auto h-[420px] w-full max-w-[420px]">
      {/* falling blue-chip stock chips being pulled into the jar */}
      {BLUE_CHIPS.map((chip, i) => (
        <motion.div
          key={chip.t}
          className="absolute left-1/2 top-0 z-10"
          initial={{ x: 0, y: 0, opacity: 0 }}
          animate={{
            x: [(i % 2 ? 1 : -1) * (30 + (i % 3) * 46), (i % 2 ? 1 : -1) * 10, 0],
            y: [10, 150, 250],
            opacity: [0, 1, 1, 0],
            rotate: [(i % 2 ? -14 : 14), 0],
            scale: [0.9, 1, 0.7],
          }}
          transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.45, ease: "easeIn" }}
        >
          <span
            className="-translate-x-1/2 rounded-lg px-2.5 py-1 text-xs font-bold text-white shadow-lg"
            style={{ background: chip.c }}
          >
            {chip.t}
          </span>
        </motion.div>
      ))}

      {/* the jar */}
      <svg viewBox="0 0 300 340" className="absolute inset-0 mx-auto h-full w-full">
        <defs>
          <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e6f0fb" />
            <stop offset="1" stopColor="#d6e4f5" />
          </linearGradient>
          <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f9b878" />
            <stop offset="1" stopColor={ORANGE} />
          </linearGradient>
        </defs>
        {/* lid */}
        <rect x="95" y="60" width="110" height="20" rx="6" fill="#cbd5e1" />
        {/* body */}
        <path d="M85 88 Q150 76 215 88 L210 300 Q150 320 90 300 Z" fill="url(#glass)" stroke="#b6c6db" strokeWidth="2" />
        {/* animated fill level */}
        <motion.path
          d="M92 210 Q150 200 208 210 L206 300 Q150 318 94 300 Z"
          fill="url(#fill)"
          initial={{ opacity: 0.5, y: 40 }}
          whileInView={{ opacity: 0.95, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        />
        <text x="150" y="270" textAnchor="middle" fill="#fff" fontSize="15" fontWeight="700">
          1 Fund
        </text>
        {/* shine */}
        <path d="M105 96 Q112 200 120 296" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" opacity="0.5" fill="none" />
      </svg>

      <div className="absolute inset-x-0 bottom-0 text-center text-sm font-medium text-slate-400">
        Many blue-chip stocks → one simple fund
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// "How a Mutual Fund Works" — interactive gamified motion visual
// ----------------------------------------------------------------------------
const WORK_STAGES = [
  {
    key: "invest",
    tag: "STEP 1",
    title: "You invest",
    body: "Put in as little as ৳1,000 — one-time or monthly (SIP). No jargon, no barrier.",
    emoji: "🪙",
  },
  {
    key: "pool",
    tag: "STEP 2",
    title: "Money is pooled",
    body: "Your money joins thousands of other investors in one large, shared pool.",
    emoji: "🫙",
  },
  {
    key: "diversify",
    tag: "STEP 3",
    title: "Experts diversify it",
    body: "Professional managers spread the pool across stocks, bonds and more — reducing risk.",
    emoji: "📊",
  },
  {
    key: "grow",
    tag: "STEP 4",
    title: "Your money grows",
    body: "As the portfolio earns, the fund's NAV (unit price) rises — and so does your value.",
    emoji: "📈",
  },
  {
    key: "redeem",
    tag: "STEP 5",
    title: "Redeem anytime",
    body: "Sell your units at the current NAV whenever you like. No lock-in, no exit fees.",
    emoji: "🎉",
  },
];

function HowItWorks() {
  const [stage, setStage] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-120px" });

  useEffect(() => {
    if (!inView) return;
    const id = window.setInterval(() => setStage((s) => (s + 1) % WORK_STAGES.length), 3200);
    return () => window.clearInterval(id);
  }, [inView]);

  const active = WORK_STAGES[stage];
  const pct = ((stage + 1) / WORK_STAGES.length) * 100;

  return (
    <section ref={ref} className="bg-gradient-to-b from-[#F7F8FB] to-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
            How a <span style={{ color: BLUE }}>Mutual Fund</span> Works
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-slate-500">
            Follow the money — it plays automatically. 🎮
          </p>
        </Reveal>

        <div className="mt-12 grid items-center gap-8 lg:grid-cols-2">
          {/* Stage list (interactive) */}
          <div>
            <div className="mb-5 h-2 overflow-hidden rounded-full bg-slate-200">
              <motion.div className="h-full rounded-full" style={{ background: ORANGE }} animate={{ width: `${pct}%` }} transition={{ duration: 0.4 }} />
            </div>
            <div className="space-y-2.5">
              {WORK_STAGES.map((s, i) => {
                const on = i === stage;
                return (
                  <button
                    key={s.key}
                    onClick={() => setStage(i)}
                    className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all ${
                      on ? "border-transparent bg-white shadow-lg" : "border-slate-200 bg-white/50 hover:bg-white"
                    }`}
                  >
                    <span
                      className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-xl transition-transform ${on ? "scale-110" : ""}`}
                      style={{ background: on ? ORANGE : "#FEF2E6" }}
                    >
                      <span className={on ? "grayscale-0" : ""}>{s.emoji}</span>
                    </span>
                    <div>
                      <div className="text-[11px] font-bold" style={{ color: ORANGE }}>{s.tag}</div>
                      <div className="font-semibold text-slate-900">{s.title}</div>
                      {on && (
                        <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-1 text-sm text-slate-500">
                          {s.body}
                        </motion.p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stage visual (motion) */}
          <div className="grid min-h-[340px] place-items-center rounded-3xl bg-white p-8 shadow-sm ring-1 ring-black/5">
            <WorkVisual stage={active.key} />
          </div>
        </div>
      </div>
    </section>
  );
}

function WorkVisual({ stage }: { stage: string }) {
  if (stage === "invest") {
    return (
      <div className="relative grid h-56 w-full place-items-center">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute grid h-14 w-14 place-items-center rounded-full text-2xl text-white shadow-lg"
            style={{ background: ORANGE }}
            initial={{ y: -140, opacity: 0 }}
            animate={{ y: 40, opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.5, ease: "easeIn" }}
          >
            ৳
          </motion.div>
        ))}
        <div className="absolute bottom-0 rounded-2xl bg-slate-100 px-6 py-3 font-semibold text-slate-700">Your wallet → Fund</div>
      </div>
    );
  }
  if (stage === "pool") {
    return (
      <div className="relative grid h-56 w-full place-items-center">
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute h-6 w-6 rounded-full"
            style={{ background: i % 2 ? ORANGE : BLUE }}
            initial={{ x: (i - 5) * 34, y: -70, opacity: 0 }}
            animate={{ x: 0, y: 30, opacity: [0, 1, 1] }}
            transition={{ duration: 1.4, repeat: Infinity, repeatType: "reverse", delay: i * 0.12 }}
          />
        ))}
        <motion.div
          className="grid h-24 w-24 place-items-center rounded-full text-3xl shadow-inner"
          style={{ background: "#e2e8f0" }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🫙
        </motion.div>
      </div>
    );
  }
  if (stage === "diversify") {
    const assets = [
      { t: "Stocks", c: ORANGE, e: "📈" },
      { t: "Bonds", c: BLUE, e: "📜" },
      { t: "Cash", c: "#10b981", e: "💵" },
      { t: "Shariah", c: "#8b5cf6", e: "☪️" },
    ];
    return (
      <div className="relative grid h-56 w-full grid-cols-2 place-items-center gap-4">
        {assets.map((a, i) => (
          <motion.div
            key={a.t}
            className="flex w-32 items-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold text-white shadow"
            style={{ background: a.c }}
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, delay: i * 0.15 }}
          >
            <span>{a.e}</span>
            <span>{a.t}</span>
          </motion.div>
        ))}
      </div>
    );
  }
  if (stage === "grow") {
    return (
      <div className="grid h-56 w-full place-items-center">
        <div className="flex h-40 items-end gap-3">
          {[40, 62, 55, 80, 100].map((h, i) => (
            <motion.div
              key={i}
              className="w-8 rounded-t-lg"
              style={{ background: i === 4 ? ORANGE : "#cbd5e1" }}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: "easeOut" }}
            />
          ))}
        </div>
        <div className="mt-3 text-sm text-slate-500">
          NAV <span className="font-bold text-slate-900"><CountUp prefix="৳" to={14} suffix=".62" /></span> ↑
        </div>
      </div>
    );
  }
  // redeem
  return (
    <div className="relative grid h-56 w-full place-items-center">
      <motion.div
        className="grid h-24 w-24 place-items-center rounded-2xl text-4xl shadow-lg"
        style={{ background: "#dcfce7" }}
        animate={{ rotate: [0, -8, 8, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      >
        🎉
      </motion.div>
      <div className="mt-4 rounded-xl bg-slate-900 px-5 py-2 font-semibold text-white">Cash in your account 💵</div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 6 Simple Steps — gamified auto-playing journey (grasp in < 10 seconds)
// ----------------------------------------------------------------------------
const STEPS = [
  { icon: "🪪", label: "Sign up", tip: "Just your phone" },
  { icon: "✅", label: "Verify", tip: "KYC, online" },
  { icon: "🔍", label: "Pick a fund", tip: "Risk & return" },
  { icon: "💸", label: "Invest", tip: "From ৳1,000" },
  { icon: "📈", label: "Track", tip: "All AMCs" },
  { icon: "🌳", label: "Grow", tip: "Redeem anytime" },
];

function StepsSection() {
  const [cur, setCur] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-120px" });

  useEffect(() => {
    if (!inView) return;
    const id = window.setInterval(() => setCur((c) => (c + 1) % STEPS.length), 1300);
    return () => window.clearInterval(id);
  }, [inView]);

  // keep the active step centered on small screens
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    if (max > 4) el.scrollTo({ left: (cur / (STEPS.length - 1)) * max, behavior: "smooth" });
  }, [cur]);

  const pct = (cur / (STEPS.length - 1)) * 100;

  return (
    <section ref={ref} className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <Reveal>
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
          Start Investing in <span style={{ color: BLUE }}>6 Simple Steps</span>
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-slate-500">
          Watch the 10-second journey. 🎮
        </p>
      </Reveal>

      <div ref={scrollRef} className="mt-14 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="relative mx-auto min-w-[620px] max-w-4xl px-8">
          <div className="relative h-36">
            {/* base + fill line */}
            <div className="absolute left-0 right-0 top-8 h-1.5 -translate-y-1/2 rounded-full bg-slate-200" />
            <motion.div
              className="absolute left-0 top-8 h-1.5 -translate-y-1/2 rounded-full"
              style={{ background: ORANGE }}
              animate={{ width: `${pct}%` }}
              transition={{ type: "spring", stiffness: 90, damping: 18 }}
            />
            {/* rocket token */}
            <motion.div
              className="absolute top-8 z-20 -translate-y-1/2"
              animate={{ left: `${pct}%` }}
              transition={{ type: "spring", stiffness: 90, damping: 18 }}
            >
              <motion.div
                className="-translate-x-1/2 -translate-y-9 text-3xl drop-shadow"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                🚀
              </motion.div>
            </motion.div>
            {/* nodes */}
            {STEPS.map((s, i) => {
              const done = i <= cur;
              const on = i === cur;
              const left = (i / (STEPS.length - 1)) * 100;
              return (
                <div key={s.label} className="absolute top-0 flex w-24 -translate-x-1/2 flex-col items-center" style={{ left: `${left}%` }}>
                  <motion.button
                    onClick={() => setCur(i)}
                    className="grid h-16 w-16 place-items-center rounded-full text-2xl shadow-md ring-4 ring-white"
                    animate={{ scale: on ? 1.15 : 1, backgroundColor: done ? ORANGE : "#e2e8f0" }}
                    transition={{ type: "spring", stiffness: 260, damping: 16 }}
                  >
                    {s.icon}
                  </motion.button>
                  <div className="mt-0.5 text-[10px] font-bold" style={{ color: ORANGE }}>
                    STEP {i + 1}
                  </div>
                  <div className={`text-center text-xs font-semibold ${done ? "text-slate-900" : "text-slate-400"}`}>{s.label}</div>
                  <div className="text-center text-[10px] text-slate-400">{s.tip}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </section>
  );
}

// ----------------------------------------------------------------------------
// CTA + Footer
// ----------------------------------------------------------------------------
function CTASection() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl px-8 py-14 text-center text-white shadow-xl" style={{ background: `linear-gradient(120deg, ${BLUE}, #0a3a76)` }}>
          <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full" style={{ background: "rgba(245,130,30,0.35)", filter: "blur(40px)" }} />
          <h2 className="relative text-3xl font-bold tracking-tight sm:text-4xl">Your money deserves to grow — steadily.</h2>
          <p className="relative mx-auto mt-3 max-w-xl text-white/80">Open an account free and start with as little as ৳1,000.</p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/portal" className="rounded-lg px-6 py-3 font-semibold text-white shadow-lg" style={{ background: ORANGE }}>
              Start Investing →
            </Link>
            <Link href="/learn" className="rounded-lg border border-white/30 bg-white/10 px-6 py-3 font-semibold text-white hover:bg-white/20">
              Learn to Invest
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------
function Reveal({ children, delay = 0, y = 20 }: { children: React.ReactNode; delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function CountUp({ to, prefix = "", suffix = "", dur = 1300 }: { to: number; prefix?: string; suffix?: string; dur?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    let start: number | null = null;
    const tick = (t: number) => {
      if (start == null) start = t;
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, dur]);
  return (
    <span ref={ref}>
      {prefix}
      {n.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}
