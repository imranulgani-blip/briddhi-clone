"use client";

import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { INTRO, SEGMENTS, PLANS, DOCUMENTS, type Plan, type Stat } from "../data/primeinvest";
import { Illustration } from "./illustrations";
import { SchemeScene } from "./SchemeScene";

// Briddhi brand palette (light theme) — blue primary, orange accent.
const BLUE = "#0E50A0";
const BLUE_DARK = "#0A3A75";
const ORANGE = "#F5821E";
const SOFT = "#EEF4FB"; // light blue tint

// Dotted-grid backdrop for section "template" feel.
const dottedBg = {
  backgroundColor: "#F5F8FC",
  backgroundImage: "radial-gradient(rgba(14,80,160,0.10) 1px, transparent 1px)",
  backgroundSize: "22px 22px",
};

// Per-scheme banner accent — kept within the Briddhi blue/orange family.
const ACCENTS: Record<string, { from: string; to: string; solid: string }> = {
  "monthly-investment-plan": { from: BLUE, to: "#2f74c9", solid: BLUE },
  "wealth-maximizer": { from: ORANGE, to: "#ffa049", solid: ORANGE },
  "equity-sharing": { from: BLUE, to: ORANGE, solid: ORANGE },
  "performance-scheme": { from: BLUE_DARK, to: BLUE, solid: BLUE_DARK },
  "capital-protected": { from: "#124a8f", to: "#2f74c9", solid: BLUE },
  "secured-income": { from: ORANGE, to: "#f4a35e", solid: ORANGE },
};
const accentFor = (id: string) => ACCENTS[id] ?? { from: BLUE, to: "#2f74c9", solid: BLUE };

// Reusable decorative banner styles.
const bannerTexture = {
  backgroundImage:
    "linear-gradient(135deg, rgba(255,255,255,0.14) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.14) 50%, rgba(255,255,255,0.14) 75%, transparent 75%)",
  backgroundSize: "18px 18px",
};
const bannerSheen = {
  background: "radial-gradient(120% 100% at 0% 0%, rgba(255,255,255,0.28), transparent 60%)",
};

const listContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const listItem: Variants = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0, transition: { duration: 0.35 } },
};
const modalItem: Variants = {
  hidden: { opacity: 0, x: -14 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

// Pick a relevant icon for each feature line so the modal reads visually.
function featureIcon(f: string): string {
  const t = f.toLowerCase();
  if (t.includes("tax rebate") || t.includes("rebate")) return "💸";
  if (t.includes("tax")) return "🧾";
  if (
    t.includes("principal protection") ||
    t.includes("capital protection") ||
    t.includes("risk-free") ||
    t.includes("bears any loss") ||
    t.includes("100% capital")
  )
    return "🛡️";
  if (t.includes("no management fee") || t.includes("success fee") || t.includes("performance")) return "🏆";
  if (t.includes("shared profit") || t.includes("aligned") || t.includes("alongside") || t.includes("70:30")) return "🤝";
  if (t.includes("low entry") || t.includes("minimum investment") || t.includes("start with")) return "🎯";
  if (t.includes("tenure")) return "⏳";
  if (t.includes("compounding")) return "🔁";
  if (t.includes("auto-debit") || t.includes("hassle-free") || t.includes("deposit")) return "🔄";
  if (t.includes("no upper limit")) return "♾️";
  if (t.includes("quick returns") || t.includes("within 3 days") || t.includes("semi-annually")) return "⚡";
  if (t.includes("steady") || t.includes("double-digit") || t.includes("high returns") || t.includes("potential returns")) return "📈";
  if (
    t.includes("expert") ||
    t.includes("managed") ||
    t.includes("management") ||
    t.includes("fund managers") ||
    t.includes("committee")
  )
    return "👔";
  return "✅";
}

// Bold the "Label:" prefix of a feature line.
function FeatureText({ text }: { text: string }) {
  const idx = text.indexOf(": ");
  if (idx === -1) return <>{text}</>;
  return (
    <>
      <strong className="font-semibold text-slate-900">{text.slice(0, idx + 1)}</strong>
      {text.slice(idx + 1)}
    </>
  );
}

// Highlighted key-metric tile.
function StatTile({ stat, accent }: { stat: Stat; accent: string }) {
  return (
    <div
      className="rounded-xl px-2 py-2 text-center"
      style={
        stat.hero
          ? { background: `${accent}14`, boxShadow: `inset 0 0 0 1px ${accent}33` }
          : { background: "#F5F7FB" }
      }
    >
      <div
        className={`font-extrabold tabular-nums leading-tight ${stat.hero ? "text-base" : "text-sm"}`}
        style={{ color: stat.hero ? accent : "#0f172a" }}
      >
        {stat.value}
      </div>
      <div className="mt-0.5 text-[10px] font-medium leading-tight text-slate-500">{stat.label}</div>
    </div>
  );
}

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function PrimeInvestShowcase() {
  const [active, setActive] = useState<Plan | null>(null);
  return (
    <div className="text-slate-900">
      {/* ============ INTRO / VISION ============ */}
      <section
        className="relative overflow-hidden"
        style={{ background: `linear-gradient(180deg, ${BLUE_DARK} 0%, ${BLUE} 120%)` }}
      >
        <div
          className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full"
          style={{ background: "rgba(255,255,255,0.10)", filter: "blur(80px)" }}
        />
        <div
          className="pointer-events-none absolute -right-20 -bottom-24 h-96 w-96 rounded-full"
          style={{ background: "rgba(245,130,30,0.40)", filter: "blur(90px)" }}
        />
        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 md:py-28 lg:px-8">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur"
          >
            🤝 {INTRO.by}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl"
          >
            {INTRO.brand}
            <span className="mt-2 block text-2xl font-semibold text-white/80 sm:text-3xl">
              Access to Investment, for every Bangladeshi.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/85"
          >
            {INTRO.lead}
          </motion.p>

          <div className="mx-auto mt-8 max-w-2xl space-y-4 text-left">
            {INTRO.vision.map((p, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <p className="text-sm leading-relaxed text-white/75 sm:text-base">{p}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1} className="mt-8">
            <span
              className="inline-block rounded-full bg-white px-5 py-2 text-lg font-extrabold tracking-tight"
              style={{ color: ORANGE }}
            >
              {INTRO.hashtag}
            </span>
          </Reveal>
        </div>
      </section>

      {/* ============ FOUR SEGMENTS ============ */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <Reveal className="max-w-2xl">
            <div className="text-xs font-bold uppercase tracking-wider" style={{ color: BLUE }}>
              Six solutions · four segments
            </div>
            <h2 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
              Tailored for who you are
            </h2>
            <p className="mt-3 text-slate-500">
              Each PrimeInvest solution is built around a distinct investor group — with strategies,
              professional portfolio management, and responsible market participation designed for them.
            </p>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SEGMENTS.map((s, i) => (
              <motion.div
                key={s.key}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="relative flex h-full flex-col overflow-hidden rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5"
                style={{ borderTop: `4px solid ${s.accent}` }}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-4 -top-3 select-none text-8xl leading-none opacity-[0.07]"
                >
                  {s.icon}
                </span>
                <span
                  className="relative grid h-14 w-14 place-items-center rounded-2xl text-3xl"
                  style={{ background: `${s.accent}14` }}
                >
                  {s.icon}
                </span>
                <h3 className="relative mt-4 text-lg font-bold text-slate-900">{s.name}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-slate-500">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SCHEMES — cards + modal ============ */}
      <section className="relative overflow-hidden" style={dottedBg}>
        <div
          className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full"
          style={{ background: "rgba(14,80,160,0.10)", filter: "blur(90px)" }}
        />
        <div
          className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full"
          style={{ background: "rgba(245,130,30,0.12)", filter: "blur(90px)" }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <Reveal className="max-w-2xl">
            <div className="text-xs font-bold uppercase tracking-wider" style={{ color: BLUE }}>
              The PrimeInvest schemes
            </div>
            <h2 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
              Explore each scheme
            </h2>
            <p className="mt-3 text-slate-600">
              From guaranteed government-backed income to a true 70:30 co-investment partnership —
              tap any card to see the full details.
            </p>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {PLANS.map((p, i) => (
              <PlanCard key={p.id} plan={p} index={i} onOpen={() => setActive(p)} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ REQUIRED DOCUMENTS ============ */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <Reveal className="max-w-2xl">
            <div className="text-xs font-bold uppercase tracking-wider" style={{ color: BLUE }}>
              Getting started
            </div>
            <h2 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Required documents</h2>
            <p className="mt-3 text-slate-500">
              Have these ready and onboarding is quick and paperless.
            </p>
          </Reveal>
          <motion.ul
            variants={listContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
          >
            {DOCUMENTS.map((d) => (
              <motion.li
                key={d.label}
                variants={listItem}
                className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5"
              >
                <span
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-xl"
                  style={{ background: SOFT }}
                >
                  {d.icon}
                </span>
                <span className="font-medium text-slate-700">{d.label}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* Animated details modal */}
      <AnimatePresence>
        {active && <PlanModal plan={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Rich card with a gradient banner "template" — details live in the modal.
function PlanCard({ plan, index, onOpen }: { plan: Plan; index: number; onOpen: () => void }) {
  const highlight = plan.highlight;
  const a = accentFor(plan.id);
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: (index % 2) * 0.06 }}
      whileHover={{ y: -6 }}
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white text-left shadow-sm ring-1 transition-shadow hover:shadow-2xl ${
        highlight ? "ring-[#F5821E]/30" : "ring-black/5"
      }`}
      style={{ boxShadow: highlight ? "0 26px 60px -26px rgba(245,130,30,0.55)" : undefined }}
    >
      {/* BANNER template — animated, scheme-specific scenery */}
      <div
        className="relative h-40 w-full overflow-hidden sm:h-44"
        style={{ backgroundImage: `linear-gradient(120deg, ${a.from}, ${a.to})` }}
      >
        <div className="absolute inset-0" style={bannerTexture} />
        <div className="absolute inset-0" style={bannerSheen} />
        <SchemeScene
          id={plan.id}
          className="pointer-events-none absolute inset-0 h-full w-full text-white transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        {/* light sweep on hover */}
        <div
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full"
        />
        {plan.badge && (
          <motion.span
            animate={{ scale: [1, 1.07, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-bold shadow"
            style={{ color: ORANGE }}
          >
            {plan.badge}
          </motion.span>
        )}
      </div>

      {/* Glossy icon overlapping the banner */}
      <div className="relative -mt-9 px-6">
        <motion.span
          whileHover={{ rotate: -8, scale: 1.08 }}
          transition={{ type: "spring", stiffness: 300, damping: 12 }}
          className="grid h-16 w-16 place-items-center rounded-2xl bg-white text-3xl shadow-lg ring-1 ring-black/5"
        >
          {plan.icon}
        </motion.span>
      </div>

      {/* Body — thematic watermark on the white surface */}
      <div className="relative flex flex-1 flex-col overflow-hidden px-6 pb-6 pt-3">
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-9 -right-7 h-44 w-44 rotate-[-8deg] transition-transform duration-700 group-hover:scale-110 group-hover:rotate-[-4deg]"
          style={{ color: a.solid, opacity: 0.07 }}
        >
          <Illustration id={plan.id} className="h-full w-full" />
        </span>
        <div className="relative z-10 flex flex-1 flex-col">
        <h3 className="text-lg font-bold leading-tight text-slate-900">{plan.name}</h3>
        <p className="mt-0.5 text-sm font-semibold italic" style={{ color: a.solid }}>
          {plan.tagline}
        </p>

        {/* highlighted key metrics */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {plan.stats.map((s) => (
            <StatTile key={s.label} stat={s} accent={a.solid} />
          ))}
        </div>

        {plan.description && (
          <p className="mt-4 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-500">
            {plan.description}
          </p>
        )}
        <div className="mt-5 flex items-center justify-between">
          <span
            className="rounded-full px-3 py-1 text-xs font-semibold"
            style={{ background: SOFT, color: BLUE }}
          >
            {plan.features.length} key features
          </span>
          <span
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-transform group-hover:-translate-y-0.5"
            style={{ background: a.solid }}
          >
            View details
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </span>
        </div>
        </div>
      </div>
    </motion.button>
  );
}

// ---------------------------------------------------------------------------
// Animated details modal — icons + staggered feature reveal.
function PlanModal({ plan, onClose }: { plan: Plan; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 240, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
        className="my-8 w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        {/* header */}
        <div
          className="relative overflow-hidden p-6 text-white sm:p-7"
          style={{ background: `linear-gradient(120deg, ${BLUE_DARK}, ${BLUE})` }}
        >
          <div
            className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full"
            style={{ background: "rgba(245,130,30,0.35)", filter: "blur(34px)" }}
          />
          <Illustration
            id={plan.id}
            className="pointer-events-none absolute -right-2 bottom-0 h-28 w-40 text-white/20"
          />
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/15 hover:bg-white/25"
          >
            ✕
          </button>
          <motion.span
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 13, delay: 0.05 }}
            className="relative grid h-16 w-16 place-items-center rounded-2xl bg-white/15 text-4xl"
          >
            {plan.icon}
          </motion.span>
          <h3 className="relative mt-4 text-2xl font-bold leading-tight">{plan.name}</h3>
          <p className="relative mt-1 font-semibold text-white/85">{plan.tagline}</p>
          {plan.badge && (
            <span
              className="relative mt-3 inline-block rounded-full px-3 py-1 text-xs font-bold text-white"
              style={{ background: ORANGE }}
            >
              {plan.badge}
            </span>
          )}
        </div>

        <div className="space-y-6 p-6 sm:p-7">
          {/* highlighted key metrics */}
          <div className="grid grid-cols-3 gap-3">
            {plan.stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl p-3 text-center"
                style={s.hero ? { background: `${BLUE}12`, boxShadow: `inset 0 0 0 1px ${BLUE}33` } : { background: "#F5F7FB" }}
              >
                <div
                  className={`font-extrabold tabular-nums ${s.hero ? "text-xl" : "text-base"}`}
                  style={{ color: s.hero ? BLUE : "#0f172a" }}
                >
                  {s.value}
                </div>
                <div className="mt-0.5 text-[11px] font-medium text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>

          {plan.description && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="rounded-2xl p-4 text-sm leading-relaxed text-slate-700"
              style={{ background: SOFT }}
            >
              {plan.description}
            </motion.div>
          )}

          <div>
            <div className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400">
              Key features
            </div>
            <motion.ul variants={listContainer} initial="hidden" animate="show" className="space-y-2.5">
              {plan.features.map((f) => (
                <motion.li
                  key={f}
                  variants={modalItem}
                  className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3"
                >
                  <motion.span
                    whileHover={{ scale: 1.15 }}
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-lg shadow-sm"
                  >
                    {featureIcon(f)}
                  </motion.span>
                  <span className="self-center text-sm leading-relaxed text-slate-700">
                    <FeatureText text={f} />
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          </div>

          {plan.ctaHref && (
            <motion.a
              href={plan.ctaHref}
              onClick={onClose}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5"
              style={{ background: `linear-gradient(120deg, ${BLUE}, ${ORANGE})` }}
            >
              🤝 See the 70:30 co-invest in action ↓
            </motion.a>
          )}
        </div>

        <div className="flex gap-3 border-t border-slate-100 p-6">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Close
          </button>
          <a
            href="https://portal.pbil.com.bd"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-xl py-2.5 text-center text-sm font-semibold text-white shadow-lg"
            style={{ background: ORANGE }}
          >
            Open a PMS account →
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}
