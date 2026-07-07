"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { QUESTIONS, classify, liveTilt } from "../data/quiz";
import { FUNDS, pct, bdt } from "../data/funds";

const CHEERS = ["Nice pick! 🙌", "Great choice! ✨", "Locked in. 🔒", "Ooh, bold. 🔥", "Noted! 📝"];

export default function RiskQuizPage() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [cheer, setCheer] = useState<string | null>(null);

  const totalScore = useMemo(() => Object.values(answers).reduce((s, v) => s + v, 0), [answers]);
  const answeredCount = Object.keys(answers).length;
  const tilt = useMemo(() => liveTilt(answers), [answers]);
  const result = useMemo(() => classify(totalScore), [totalScore]);
  const maxScore = QUESTIONS.length * 4;

  const suggestedFunds = useMemo(
    () =>
      FUNDS.filter((f) => result.recommendedFundTypes.includes(f.fund_type))
        .sort((a, b) => b.annual_return - a.annual_return)
        .slice(0, 3),
    [result]
  );

  const isLast = step === QUESTIONS.length - 1;
  const currentQ = QUESTIONS[step];
  const currentAnswer = answers[currentQ.id];

  const choose = (score: number, idx: number) => {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: score }));
    setCheer(CHEERS[idx % CHEERS.length]);
    if (!isLast) {
      window.setTimeout(() => {
        setStep((s) => Math.min(QUESTIONS.length - 1, s + 1));
        setCheer(null);
      }, 620);
    }
  };

  const reset = () => {
    setAnswers({});
    setStep(0);
    setSubmitted(false);
    setCheer(null);
  };

  // ---------------- RESULT ----------------
  if (submitted) {
    return (
      <div className="relative mx-auto max-w-4xl overflow-hidden px-4 py-10 sm:px-6 md:py-14 lg:px-8">
        <MoneyRain />
        <Confetti color={result.bar} />
        <div className="relative flex flex-col items-center text-center">
          <Gauge fraction={totalScore / maxScore} color={result.bar} emoji={result.emoji} />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6"
          >
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-400">
              {result.tagline}
            </div>
            <h1 className="mt-1 text-4xl font-bold tracking-tight md:text-5xl">
              You&apos;re <span className={result.text}>{result.title}</span>
            </h1>
            <p className="mx-auto mt-3 max-w-2xl leading-relaxed text-ink-300">{result.summary}</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4"
        >
          <StatTile label="XP earned" value={<CountUp to={totalScore} />} sub={`of ${maxScore}`} />
          <StatTile label="Profile" value={<span className="capitalize">{result.key} risk</span>} />
          <StatTile label="Match" value={`${Math.round((totalScore / maxScore) * 100)}%`} sub="risk appetite" />
          <StatTile label="Fund types" value={result.recommendedFundTypes.join(" · ")} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          className="surface mt-6 p-6"
        >
          <h3 className="font-semibold">🧭 What to do next</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-300">{result.suggestion}</p>
        </motion.div>

        <div className="mt-8">
          <h3 className="mb-3 font-semibold">🎯 Funds that match your profile</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {suggestedFunds.map((f, i) => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.1 }}
                className="surface p-5"
              >
                <div className="text-xs text-ink-400">{f.company}</div>
                <div className="mt-1 font-semibold">{f.name}</div>
                <div className="mt-3 flex items-baseline justify-between">
                  <div className="mono text-2xl font-semibold text-neon-400">{pct(f.annual_return, true)}</div>
                  <div className="text-xs text-ink-400">1Y return</div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 border-t border-ink-700/40 pt-3 text-xs">
                  <div>
                    <div className="text-ink-400">Type</div>
                    <div className="text-ink-100">{f.fund_type}</div>
                  </div>
                  <div>
                    <div className="text-ink-400">Min</div>
                    <div className="mono text-ink-100">{bdt(f.min_investment)}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            onClick={reset}
            className="rounded-lg border border-ink-700/50 bg-ink-800/60 px-4 py-2 text-sm hover:bg-ink-700/70"
          >
            ↻ Play again
          </button>
          <Link
            href="/funds"
            className="rounded-lg bg-neon-400 px-4 py-2 text-sm font-semibold text-ink-950 hover:bg-neon-500"
          >
            Open fund comparison →
          </Link>
        </div>
      </div>
    );
  }

  // ---------------- QUIZ ----------------
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-neon-400">Level up</div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">Risk Profile Quiz 🎮</h1>
        </div>
        <div className="surface flex items-center gap-2 px-3 py-2">
          <span className="text-lg">⭐</span>
          <div className="leading-tight">
            <div className="mono text-lg font-bold text-neon-400">{totalScore}</div>
            <div className="text-[10px] text-ink-400">XP</div>
          </div>
        </div>
      </div>

      {/* live risk-o-meter — unveils as you answer */}
      <RiskMeter tilt={tilt} answered={answeredCount} />

      {/* progress dots */}
      <div className="my-5 flex items-center justify-center gap-2">
        {QUESTIONS.map((q, i) => {
          const done = answers[q.id] != null;
          const active = i === step;
          return (
            <div
              key={q.id}
              className={`h-2.5 rounded-full transition-all ${
                active ? "w-8 bg-neon-400" : done ? "w-2.5 bg-neon-500/70" : "w-2.5 bg-ink-700"
              }`}
            />
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ.id}
          initial={{ opacity: 0, x: 24, rotateY: 8 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          exit={{ opacity: 0, x: -24, rotateY: -8 }}
          transition={{ duration: 0.25 }}
          className="surface p-6"
        >
          <div className="flex items-center gap-3">
            <motion.span
              initial={{ scale: 0.5, rotate: -12 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 14 }}
              className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-ink-700 to-ink-800 text-3xl shadow-glow"
            >
              {currentQ.emoji}
            </motion.span>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                {currentQ.theme} · Q{step + 1}
              </div>
              <h2 className="mt-0.5 text-xl font-semibold leading-snug">{currentQ.question}</h2>
            </div>
          </div>

          <motion.div
            className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2"
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.06 } } }}
          >
            {currentQ.options.map((opt, idx) => {
              const selected = currentAnswer === opt.score;
              return (
                <motion.button
                  key={opt.label}
                  variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => choose(opt.score, idx)}
                  className={`relative flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                    selected
                      ? "border-neon-400 bg-neon-400/10"
                      : "border-ink-700/50 bg-ink-950 hover:border-ink-500 hover:bg-ink-800/50"
                  }`}
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-ink-800/80 text-2xl">
                    {opt.emoji}
                  </span>
                  <span className={`text-sm ${selected ? "font-semibold text-ink-100" : "text-ink-200"}`}>
                    {opt.label}
                  </span>
                  <AnimatePresence>
                    {selected && (
                      <motion.span
                        initial={{ scale: 0, rotate: -30 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 12 }}
                        className="ml-auto grid h-6 w-6 place-items-center rounded-full bg-neon-400 text-xs font-bold text-ink-950"
                      >
                        ✓
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </motion.div>

          {/* cheer + reveal */}
          <div className="mt-5 flex min-h-[40px] items-center justify-between">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="text-sm text-ink-400 hover:text-ink-200 disabled:opacity-30"
            >
              ← Back
            </button>
            <AnimatePresence mode="wait">
              {cheer && (
                <motion.span
                  key={cheer + step}
                  initial={{ opacity: 0, scale: 0.7, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-full bg-neon-400/15 px-3 py-1 text-sm font-medium text-neon-400"
                >
                  {cheer}
                </motion.span>
              )}
            </AnimatePresence>
            {isLast && currentAnswer != null ? (
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={() => setSubmitted(true)}
                className="rounded-lg bg-neon-400 px-5 py-2.5 text-sm font-bold text-ink-950 shadow-glow hover:bg-neon-500"
              >
                Reveal my profile ✨
              </motion.button>
            ) : (
              <span className="w-16" />
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <p className="mt-4 text-center text-xs text-ink-500">
        Tap an answer to continue · 5 questions · your answers aren&apos;t saved
      </p>
    </div>
  );
}

// ---------------- pieces ----------------

function RiskMeter({ tilt, answered }: { tilt: number; answered: number }) {
  const zoneEmoji = answered === 0 ? "❓" : tilt < 34 ? "🛡️" : tilt < 67 ? "⚖️" : "🚀";
  const zoneLabel = answered === 0 ? "Answer to reveal…" : tilt < 34 ? "Leaning Conservative" : tilt < 67 ? "Leaning Balanced" : "Leaning Growth";
  return (
    <div className="surface p-4">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold uppercase tracking-wider text-ink-400">Risk-o-meter</span>
        <motion.span key={zoneLabel} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-ink-200">
          {zoneLabel}
        </motion.span>
      </div>
      <div
        className="relative mt-4 h-3 rounded-full"
        style={{ background: "linear-gradient(90deg,#10b981 0%,#f59e0b 50%,#f43f5e 100%)" }}
      >
        <motion.div
          className="absolute top-1/2"
          initial={{ left: "0%" }}
          animate={{ left: `${tilt}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 16 }}
        >
          <div className="-translate-x-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-ink-950 text-base shadow-lg">
            {zoneEmoji}
          </div>
        </motion.div>
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-ink-500">
        <span>🛡️ Safe</span>
        <span>⚖️ Balanced</span>
        <span>🚀 Bold</span>
      </div>
    </div>
  );
}

function Gauge({ fraction, color, emoji }: { fraction: number; color: string; emoji: string }) {
  const r = 78;
  const C = 2 * Math.PI * r;
  return (
    <div className="relative h-48 w-48">
      <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
        <circle cx="100" cy="100" r={r} fill="none" stroke="#1a2338" strokeWidth="14" />
        <motion.circle
          cx="100"
          cy="100"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={C}
          initial={{ strokeDashoffset: C }}
          animate={{ strokeDashoffset: C * (1 - fraction) }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <motion.div
        initial={{ scale: 0, rotate: -40 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.3 }}
        className="absolute inset-0 grid place-items-center text-6xl"
      >
        {emoji}
      </motion.div>
    </div>
  );
}

function MoneyRain() {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const t = window.setTimeout(() => setOn(false), 6500);
    return () => window.clearTimeout(t);
  }, []);
  if (!on) return null;
  const bits = ["💵", "💰", "💎", "🪙", "🏆", "🤑", "💸", "🏵️", "💲", "👑"];
  const drops = Array.from({ length: 46 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 1.8,
    dur: 2.6 + Math.random() * 2,
    size: 16 + Math.random() * 24,
    rot: (Math.random() - 0.5) * 260,
    drift: (Math.random() - 0.5) * 90,
    emoji: bits[i % bits.length],
  }));
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {drops.map((d) => (
        <motion.span
          key={d.id}
          initial={{ top: "-12vh", x: 0, opacity: 0, rotate: 0 }}
          animate={{ top: "112vh", x: d.drift, opacity: [0, 1, 1, 0.85], rotate: d.rot }}
          transition={{ duration: d.dur, delay: d.delay, ease: "easeIn", repeat: 1, repeatDelay: 0.15 }}
          className="absolute"
          style={{ left: `${d.left}%`, fontSize: d.size }}
        >
          {d.emoji}
        </motion.span>
      ))}
    </div>
  );
}

function Confetti({ color }: { color: string }) {
  const bits = ["🎉", "✨", "💸", "📈", "🌟", "🎊"];
  const pieces = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 520,
    y: -120 - Math.random() * 260,
    rot: (Math.random() - 0.5) * 360,
    delay: Math.random() * 0.25,
    emoji: bits[i % bits.length],
    dot: i % 3 === 0,
  }));
  return (
    <div className="pointer-events-none absolute inset-x-0 top-24 z-10 flex justify-center">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ opacity: 1, x: 0, y: 0, scale: 0.6, rotate: 0 }}
          animate={{ opacity: 0, x: p.x, y: p.y, scale: 1.1, rotate: p.rot }}
          transition={{ duration: 1.6, delay: p.delay, ease: "easeOut" }}
          className="absolute text-xl"
          style={p.dot ? { color } : undefined}
        >
          {p.dot ? "●" : p.emoji}
        </motion.span>
      ))}
    </div>
  );
}

function StatTile({ label, value, sub }: { label: string; value: React.ReactNode; sub?: string }) {
  return (
    <div className="surface p-4">
      <div className="text-xs uppercase tracking-wider text-ink-400">{label}</div>
      <div className="mt-1 text-lg font-semibold text-ink-100">{value}</div>
      {sub && <div className="text-xs text-ink-500">{sub}</div>}
    </div>
  );
}

function CountUp({ to, ms = 900 }: { to: number; ms?: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const steps = Math.max(1, to);
    const per = ms / steps;
    let cur = 0;
    const id = setInterval(() => {
      cur += 1;
      setN(cur);
      if (cur >= to) clearInterval(id);
    }, per);
    return () => clearInterval(id);
  }, [to, ms]);
  return <span className="mono">{n}</span>;
}
