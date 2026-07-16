"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { FUNDS, bdt, pct } from "./data/funds";
import Sparkline from "./components/Sparkline";
import TickerTape from "./components/TickerTape";

const TOOLS = [
  {
    href: "/funds",
    title: "Compare funds",
    body: "Sort, filter, and compare 8 partner funds by return, risk, AUM, and expense ratio.",
    kicker: "1 · Explore",
    accent: "from-neon-400 to-emerald-600",
  },
  {
    href: "/learn",
    title: "Learn to invest",
    body: "Free video lessons — Mutual Fund 101, Real Estate 101, and money basics for first-time investors.",
    kicker: "2 · Learn",
    accent: "from-sky-400 to-indigo-500",
  },
  {
    href: "/risk-quiz",
    title: "Risk profile quiz",
    body: "Answer 5 questions to identify whether Conservative, Balanced, or Growth-Seeker fits you.",
    kicker: "3 · Discover",
    accent: "from-amber-400 to-orange-500",
  },
  {
    href: "/glossary",
    title: "Investing glossary",
    body: "NAV, AUM, SIP, expense ratio, CAGR — plain-English definitions with examples.",
    kicker: "4 · Learn",
    accent: "from-teal-400 to-cyan-600",
  },
];

const WHY = [
  {
    icon: "shield",
    title: "Independent & unbiased",
    body: "We don't sell funds or take commissions. Every number is presented objectively so you can decide for yourself.",
  },
  {
    icon: "bolt",
    title: "Terminal-grade speed",
    body: "No sign-up, no loading spinners. Sort 8 funds, project 30 years of growth, and profile your risk in seconds.",
  },
  {
    icon: "moon",
    title: "Built for Bangladesh",
    body: "Taka-first formatting, Shariah-compliant filtering, and local AMC coverage — not a re-skin of a foreign app.",
  },
  {
    icon: "book",
    title: "Learn as you go",
    body: "A plain-English glossary and worked examples turn NAV, CAGR, and expense ratios into things you actually understand.",
  },
  {
    icon: "lock",
    title: "Private by design",
    body: "Everything runs in your browser. No account, no tracking of your money, nothing sent to a server. Ever.",
  },
  {
    icon: "chart",
    title: "Honest projections",
    body: "Compound-growth charts show invested vs. projected value side by side — so expectations stay grounded.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Finally a fund comparison that speaks Taka and flags Shariah funds without me digging through 40-page PDFs.",
    name: "Tanvir Ahmed",
    role: "Software engineer, Dhaka",
    initials: "TA",
  },
  {
    quote:
      "I used the SIP calculator to plan my monthly investment before opening my first BO account. It made the maths obvious.",
    name: "Nusrat Jahan",
    role: "First-time investor",
    initials: "NJ",
  },
  {
    quote:
      "The risk quiz put me in the Balanced bucket and matched me to funds I'd never have found on my own. Genuinely useful.",
    name: "Rakib Hasan",
    role: "University lecturer, Chittagong",
    initials: "RH",
  },
];

const FAQS = [
  {
    q: "Is Briddhi Studio a broker? Can I buy funds here?",
    a: "No. Briddhi is an independent research and education toolkit. We help you compare, project, and understand mutual funds — you invest through your chosen AMC or broker. We never touch your money.",
  },
  {
    q: "Where does the fund data come from?",
    a: "All figures in this demo — NAVs, returns, AUMs — are static and simulated to showcase the tools. In a production build these would sync from AMC disclosures and the exchange.",
  },
  {
    q: "Do you support Shariah-compliant funds?",
    a: "Yes. Every fund is tagged, and the comparison table lets you filter to Shariah-compliant funds only, alongside risk level and fund type.",
  },
  {
    q: "Do I need to create an account?",
    a: "No account, no sign-up, no email. Every tool runs entirely in your browser, so your inputs never leave your device.",
  },
  {
    q: "Is this financial advice?",
    a: "No. Briddhi provides tools and objective data for your own research. It is not investment advice. Always do your own due diligence or consult a licensed adviser.",
  },
];

const PARTNERS = [
  "Ekush Wealth Management",
  "Investit Asset Management",
  "Briddhi Financial Technologies",
  "Sonchoy Asset Management",
];

const TOP = [...FUNDS].sort((a, b) => b.annual_return - a.annual_return).slice(0, 4);
const AVG_RETURN = FUNDS.reduce((s, f) => s + f.annual_return, 0) / FUNDS.length;
const TOTAL_AUM = FUNDS.reduce((s, f) => s + f.aum, 0);

// Fund cards for the auto-sliding hero row. amc maps to /fund-logos/<amc>.png.
// alloc = [stock, government, others] percentages.
const HERO_CARDS = [
  { name: "Ekush First Unit Fund", amc: "ekush", ytm: 18.4, nav: 11.19, min: 1000, alloc: [50, 40, 10] },
  { name: "Investit Growth Fund", amc: "investit", ytm: 16.2, nav: 16.05, min: 1000, alloc: [70, 20, 10] },
  { name: "EDGE AMC Growth Fund", amc: "edge", ytm: 15.1, nav: 14.6, min: 5000, alloc: [65, 25, 10] },
  { name: "VIPB Growth Fund", amc: "vipb", ytm: 14.5, nav: 15.4, min: 1000, alloc: [60, 30, 10] },
  { name: "Midland Bank Growth Fund", amc: "midland", ytm: 12.8, nav: 13.3, min: 5000, alloc: [55, 35, 10] },
];

export default function Home() {
  return (
    <>
      <TickerTape />

      {/* HERO */}
      <section
        className="relative overflow-hidden border-b border-ink-800/60"
        style={{
          backgroundImage:
            "radial-gradient(900px 380px at 50% 118%, rgba(245,130,30,0.20), transparent 62%)," +
            "radial-gradient(1200px 520px at 50% -12%, rgba(14,80,160,0.30), transparent 60%)," +
            "linear-gradient(180deg, rgba(5,7,13,0.68) 0%, rgba(5,7,13,0.52) 38%, rgba(5,7,13,0.96) 100%)," +
            "url('/hero-3.jpg')",
          backgroundColor: "#060a14",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto max-w-5xl px-4 pt-20 pb-6 text-center sm:px-6 md:pt-28 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl"
          >
            Invest in Mutual Funds,
            <br />
            Co-Invest PMS in <span className="text-gradient">Bangladesh</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mt-5 max-w-2xl text-lg text-ink-200"
          >
            Briddhi brings institutional-grade investment tools to every investor.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            <Link
              href="/funds"
              className="inline-flex items-center gap-2 rounded-lg bg-neon-400 px-5 py-3 font-semibold text-ink-950 shadow-glow transition-colors hover:bg-neon-500"
            >
              Explore funds →
            </Link>
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 rounded-lg border border-ink-500/70 bg-ink-900/50 px-5 py-3 font-semibold text-ink-100 backdrop-blur transition-colors hover:bg-ink-800/70"
            >
              Learn to invest
            </Link>
          </motion.div>
        </div>

        {/* Auto-sliding fund cards */}
        <div className="group/slider relative pb-16 pt-4 md:pb-24">
          <div className="marquee-mask overflow-hidden">
            <div className="animate-slide flex w-max gap-5 px-4">
              {[...HERO_CARDS, ...HERO_CARDS].map((c, i) => (
                <FundHeroCard key={i} card={c} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="border-y border-ink-700/40 bg-ink-900/40">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <TrustStat value={FUNDS.length.toString()} label="Funds tracked" big />
            <TrustStat value={bdt(TOTAL_AUM)} label="Combined AUM" big />
            <TrustStat value={pct(AVG_RETURN, true)} label="Avg 1Y return" big />
            <TrustStat value={PARTNERS.length.toString()} label="Asset managers" big />
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 opacity-70">
            <span className="text-xs uppercase tracking-wider text-ink-500">Covering funds from</span>
            {PARTNERS.map((p) => (
              <span key={p} className="text-sm font-medium text-ink-300">
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* TOP PERFORMERS */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Top performers</h2>
            <p className="mt-1 text-sm text-ink-400">Ranked by 1-year annual return</p>
          </div>
          <Link href="/funds" className="text-sm text-neon-400 hover:text-neon-500">
            See all funds →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TOP.map((fund) => (
            <motion.div
              key={fund.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35 }}
              className="surface group p-5 transition-colors hover:border-neon-400/40"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-ink-400">{fund.company}</div>
                  <div className="mt-1 font-semibold">{fund.shortName}</div>
                </div>
                <span
                  className={`rounded-full border px-2 py-0.5 text-xs ${
                    fund.risk_level === "low"
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                      : fund.risk_level === "medium"
                      ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                      : "border-rose-500/40 bg-rose-500/10 text-rose-300"
                  }`}
                >
                  {fund.risk_level}
                </span>
              </div>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <div className="text-xs text-ink-400">1Y return</div>
                  <div className={`mono text-2xl font-semibold ${fund.annual_return >= 0 ? "text-neon-400" : "text-rose-400"}`}>
                    {pct(fund.annual_return, true)}
                  </div>
                </div>
                <Sparkline seed={fund.id} trend={fund.annual_return} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 border-t border-ink-700/40 pt-4 text-xs">
                <div>
                  <div className="text-ink-400">NAV</div>
                  <div className="mono text-ink-100">{fund.current_nav.toFixed(3)}</div>
                </div>
                <div>
                  <div className="text-ink-400">Min</div>
                  <div className="mono text-ink-100">{bdt(fund.min_investment)}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="hairline mx-auto max-w-7xl" />

      {/* WHY BRIDDHI */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Why investors choose <span className="text-gradient">Briddhi</span>
          </h2>
          <p className="mt-2 text-ink-400">
            Everything a first-time or seasoned investor needs to make a confident decision — and
            nothing that gets in the way.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {WHY.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
              className="surface p-6"
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl border border-neon-400/30 bg-neon-400/10 text-neon-400">
                <Icon name={f.icon} />
              </div>
              <div className="mt-4 text-lg font-semibold">{f.title}</div>
              <p className="mt-2 text-sm leading-relaxed text-ink-300">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="hairline mx-auto max-w-7xl" />

      {/* TOOLKIT */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold tracking-tight">The toolkit</h2>
        <p className="mt-1 text-sm text-ink-400">Five tools, one workflow. Everything runs client-side.</p>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool, i) => (
            <motion.div
              key={tool.href}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
            >
              <Link
                href={tool.href}
                className="surface group block h-full p-6 transition-colors hover:border-neon-400/40"
              >
                <div className={`mb-4 inline-block h-8 w-8 rounded-lg bg-gradient-to-br ${tool.accent}`} />
                <div className="text-xs font-semibold uppercase tracking-wider text-ink-400">{tool.kicker}</div>
                <div className="mt-1 text-xl font-semibold">{tool.title}</div>
                <p className="mt-2 text-sm leading-relaxed text-ink-300">{tool.body}</p>
                <div className="mt-4 text-sm text-neon-400 transition-transform group-hover:translate-x-0.5">Open →</div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="hairline mx-auto max-w-7xl" />

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Trusted by everyday investors</h2>
          <p className="mt-2 text-ink-400">Real workflows, from first SIP to portfolio rebalancing.</p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="surface flex flex-col p-6"
            >
              <div className="text-neon-400" aria-hidden>
                ★★★★★
              </div>
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-ink-200">“{t.quote}”</blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-ink-700/40 pt-4">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-ink-700 text-xs font-semibold text-ink-100">
                  {t.initials}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-ink-100">{t.name}</span>
                  <span className="block text-xs text-ink-400">{t.role}</span>
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </section>

      <div className="hairline mx-auto max-w-7xl" />

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">Frequently asked questions</h2>
        <div className="mt-8 space-y-3">
          {FAQS.map((f) => (
            <FaqItem key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </section>

      {/* CTA BAND */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="glass relative overflow-hidden p-10 text-center md:p-14">
          <div className="grid-bg pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Start making <span className="text-gradient">clearer</span> investment decisions.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-ink-300">
              Compare funds, project your growth, and find your risk profile — free, private, and
              built for Bangladesh.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/funds"
                className="inline-flex items-center gap-2 rounded-lg bg-neon-400 px-6 py-3 font-semibold text-ink-950 shadow-glow transition-colors hover:bg-neon-500"
              >
                Explore funds →
              </Link>
              <Link
                href="/learn"
                className="inline-flex items-center gap-2 rounded-lg border border-ink-600 bg-ink-800/60 px-6 py-3 font-semibold text-ink-100 transition-colors hover:bg-ink-700/70"
              >
                Start learning
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function FundHeroCard({
  card,
}: {
  card: { name: string; amc: string; ytm: number; nav: number; min: number; alloc: number[] };
}) {
  const [stock, govt, others] = card.alloc;
  return (
    <div className="w-[320px] shrink-0 rounded-2xl bg-white p-5 text-slate-900 shadow-2xl">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-slate-200 bg-white p-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/fund-logos/${card.amc}.png`} alt="" className="max-h-full max-w-full object-contain" />
          </span>
          <div className="min-w-0 font-semibold leading-tight">{card.name}</div>
        </div>
        <span className="shrink-0 rounded-md border border-sky-200 bg-sky-50 px-2 py-1 text-xs font-semibold text-sky-700">
          {card.ytm}% <span className="text-sky-400">YTM</span>
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="font-medium text-slate-600">Asset Allocation</span>
        <span className="font-semibold tabular-nums">
          {stock} : {govt} : {others}
        </span>
      </div>
      <div className="mt-2 flex h-2.5 overflow-hidden rounded-full bg-slate-100">
        <span style={{ width: `${stock}%`, background: "#F5821E" }} />
        <span style={{ width: `${govt}%`, background: "#0E50A0" }} />
        <span style={{ width: `${others}%`, background: "#10b981" }} />
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          <Legend color="#F5821E" label="Stock" />
          <Legend color="#0E50A0" label="Government" />
          <Legend color="#10b981" label="Others" />
        </div>
        <Link href="/funds" className="shrink-0 font-medium text-slate-400 hover:text-slate-600">
          View Insight ›
        </Link>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="flex gap-5">
          <div>
            <div className="text-[11px] text-slate-500">Min</div>
            <div className="text-sm font-semibold">৳{card.min.toLocaleString("en-IN")}</div>
          </div>
          <div>
            <div className="text-[11px] text-slate-500">Nav</div>
            <div className="text-sm font-semibold tabular-nums">{card.nav.toFixed(3)}</div>
          </div>
        </div>
        <Link
          href="/portal"
          className="rounded-lg bg-[#F5821E] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#e0761a]"
        >
          Invest Now
        </Link>
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

function TrustStat({
  value,
  label,
  stars,
  big,
}: {
  value: string;
  label: string;
  stars?: boolean;
  big?: boolean;
}) {
  return (
    <div>
      <div className={`mono font-semibold text-ink-100 ${big ? "text-2xl md:text-3xl" : "text-xl"}`}>{value}</div>
      <div className="mt-0.5 flex items-center gap-1 text-xs text-ink-400">
        {stars && <span className="text-neon-400">★</span>}
        {label}
      </div>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="surface overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <span className="font-medium text-ink-100">{q}</span>
        <span className={`text-neon-400 transition-transform ${open ? "rotate-45" : ""}`} aria-hidden>
          +
        </span>
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.2 }}
          className="px-5 pb-4 text-sm leading-relaxed text-ink-300"
        >
          {a}
        </motion.div>
      )}
    </div>
  );
}

function Icon({ name }: { name: string }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6l7-3z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    case "bolt":
      return (
        <svg {...common}>
          <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
        </svg>
      );
    case "moon":
      return (
        <svg {...common}>
          <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />
        </svg>
      );
    case "book":
      return (
        <svg {...common}>
          <path d="M4 5a2 2 0 012-2h12v16H6a2 2 0 00-2 2V5z" />
          <path d="M18 3v18" />
        </svg>
      );
    case "lock":
      return (
        <svg {...common}>
          <rect x="4" y="10" width="16" height="11" rx="2" />
          <path d="M8 10V7a4 4 0 018 0v3" />
        </svg>
      );
    case "chart":
      return (
        <svg {...common}>
          <path d="M4 20V4M4 20h16" />
          <path d="M8 16l3-4 3 2 4-6" />
        </svg>
      );
    default:
      return null;
  }
}
