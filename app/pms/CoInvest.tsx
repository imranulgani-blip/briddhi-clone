"use client";

import { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useSpring,
  useMotionValueEvent,
} from "framer-motion";

// Briddhi brand palette (light theme).
const BLUE = "#0E50A0"; // you
const BLUE_DARK = "#0A3A75";
const ORANGE = "#F5821E"; // PBIL
const SOFT = "#EEF4FB";
const GAIN = "#059669"; // emerald — profit
const LOSS = "#dc2626"; // red — loss

// Your share : PBIL share
const YOU = 70;
const BANK = 30;

const AMOUNTS = [
  { v: 200000, label: "৳2 Lac" },
  { v: 500000, label: "৳5 Lac" },
  { v: 1000000, label: "৳10 Lac" },
  { v: 2500000, label: "৳25 Lac" },
];

function scenario(r: number): { label: string; emoji: string } {
  if (r >= 25) return { label: "Strong market", emoji: "🚀" };
  if (r >= 8) return { label: "Good year", emoji: "📈" };
  if (r > 0) return { label: "Modest gains", emoji: "🙂" };
  if (r === 0) return { label: "Flat market", emoji: "➖" };
  if (r > -12) return { label: "Market dip", emoji: "🌧️" };
  return { label: "Sharp downturn", emoji: "🐻" };
}

const fmt = (n: number) => "৳" + Math.round(Math.abs(n)).toLocaleString("en-IN");

// Spring-animated counting number
function Counter({ value, className }: { value: number; className?: string }) {
  const spring = useSpring(value, { stiffness: 120, damping: 20 });
  const [shown, setShown] = useState(value);
  useEffect(() => {
    spring.set(value);
  }, [value, spring]);
  useMotionValueEvent(spring, "change", (v) => setShown(v));
  const neg = shown < 0;
  return (
    <span className={className}>
      {neg ? "−" : ""}
      {fmt(shown)}
    </span>
  );
}

export default function CoInvest() {
  const [capital, setCapital] = useState(200000); // your 70% contribution
  const [ret, setRet] = useState(18); // portfolio return %

  const bank = (capital / YOU) * BANK; // PBIL co-invests its 30%
  const pool = capital + bank; // total invested capital
  const r = ret / 100;
  const totalPnl = pool * r; // total profit / loss
  const yourPnl = capital * r; // = 70% of totalPnl
  const bankPnl = bank * r; // = 30% of totalPnl
  const yourFinal = capital + yourPnl;
  const isLoss = ret < 0;
  const sc = scenario(ret);
  const outColor = ret === 0 ? "#334155" : isLoss ? LOSS : GAIN;

  return (
    <section id="co-invest" className="scroll-mt-20" style={{ background: SOFT }}>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-70px" }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: BLUE }}>
              PrimeInvest Equity Sharing
            </span>
            <span className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white" style={{ background: ORANGE }}>
              70&nbsp;:&nbsp;30
            </span>
          </div>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Co-Invest 70:30 — <span style={{ color: BLUE }}>we grow together</span>
          </h2>
          <p className="mt-3 text-slate-600">
            This is a true partnership. PBIL puts <strong>its own money in alongside yours</strong>, and
            every taka of profit <em>or</em> loss is shared in a fixed <strong>70:30</strong> ratio —
            you : PBIL. When the bank has real skin in the game, your interests and ours point the same way.
          </p>
        </motion.div>

        {/* Concept flow: You + PBIL -> one portfolio */}
        <div className="mt-10 grid grid-cols-1 items-stretch gap-4 md:grid-cols-[1fr_auto_1fr_auto_1.2fr]">
          <PartyCard
            delay={0}
            emoji="🧑‍💼"
            who="You invest"
            share={YOU}
            note="Your capital — 70% of the pool"
            ring={BLUE}
          />
          <Plus />
          <PartyCard
            delay={0.12}
            emoji="🏦"
            who="PBIL co-invests"
            share={BANK}
            note="Bank's own capital — 30% alongside you"
            ring={ORANGE}
          />
          <Arrow />
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-70px" }}
            transition={{ duration: 0.5, delay: 0.28 }}
            className="relative flex flex-col justify-center overflow-hidden rounded-3xl p-6 text-white shadow-lg"
            style={{ background: `linear-gradient(130deg, ${BLUE_DARK}, ${BLUE})` }}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute -right-3 -top-3 select-none text-7xl opacity-15"
            >
              🧺
            </span>
            <div className="relative text-3xl">🧺</div>
            <div className="relative mt-2 text-lg font-bold">One shared portfolio</div>
            <p className="relative mt-1 text-sm text-white/80">
              Managed by PBIL&apos;s investment committee. Profit and loss flow back to both of us in the
              same 70:30 split.
            </p>
          </motion.div>
        </div>

        {/* Interactive simulator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mt-8 overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-black/5"
        >
          <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
            <h3 className="text-lg font-bold text-slate-900">See how it plays out</h3>
            <p className="text-sm text-slate-500">
              Drag the market outcome and watch the 70:30 split — in good years and bad.
            </p>
          </div>

          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-2">
            {/* Controls */}
            <div>
              <div className="text-sm font-semibold text-slate-700">Your investment</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {AMOUNTS.map((a) => (
                  <button
                    key={a.v}
                    onClick={() => setCapital(a.v)}
                    className="rounded-xl px-3.5 py-1.5 text-sm font-semibold transition-colors"
                    style={
                      capital === a.v
                        ? { background: BLUE, color: "#fff" }
                        : { background: "#fff", color: "#475569", border: "1px solid #e2e8f0" }
                    }
                  >
                    {a.label}
                  </button>
                ))}
              </div>

              <div className="mt-6 flex items-baseline justify-between">
                <span className="text-sm font-semibold text-slate-700">Portfolio return this year</span>
                <span className="text-2xl font-extrabold tabular-nums" style={{ color: outColor }}>
                  {ret > 0 ? "+" : ret < 0 ? "−" : ""}
                  {Math.abs(ret)}%
                </span>
              </div>
              <input
                type="range"
                min={-30}
                max={40}
                step={1}
                value={ret}
                onChange={(e) => setRet(Number(e.target.value))}
                className="mt-3 w-full"
                style={{ accentColor: BLUE }}
              />
              <div className="mt-1 flex justify-between text-xs text-slate-400">
                <span>−30% (crash)</span>
                <span className="font-semibold" style={{ color: outColor }}>
                  {sc.emoji} {sc.label}
                </span>
                <span>+40% (boom)</span>
              </div>

              {/* Pool composition bar */}
              <div className="mt-8">
                <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <span>Invested pool</span>
                  <span className="tabular-nums text-slate-600">{fmt(pool)}</span>
                </div>
                <div className="flex h-10 overflow-hidden rounded-xl">
                  <div
                    className="flex items-center justify-center text-xs font-bold text-white"
                    style={{ width: `${YOU}%`, background: BLUE }}
                  >
                    You {YOU}%
                  </div>
                  <div
                    className="flex items-center justify-center text-xs font-bold text-white"
                    style={{ width: `${BANK}%`, background: ORANGE }}
                  >
                    PBIL {BANK}%
                  </div>
                </div>
                <div className="mt-1.5 flex justify-between text-xs text-slate-500">
                  <span>
                    You: <strong className="tabular-nums">{fmt(capital)}</strong>
                  </span>
                  <span>
                    PBIL: <strong className="tabular-nums">{fmt(bank)}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Outcome */}
            <div className="flex flex-col rounded-2xl bg-slate-50 p-5 sm:p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={isLoss ? "loss" : ret === 0 ? "flat" : "gain"}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="text-sm font-semibold"
                  style={{ color: outColor }}
                >
                  {ret === 0
                    ? "Flat year — nobody gains or loses."
                    : isLoss
                    ? "Down year — the loss is shared, so you don't carry it alone."
                    : "Profit year — shared 70:30, in your favour."}
                </motion.div>
              </AnimatePresence>

              {/* Total P/L split bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Total {isLoss ? "loss" : "profit"} on the pool</span>
                  <span className="tabular-nums font-semibold" style={{ color: outColor }}>
                    {isLoss ? "−" : ret > 0 ? "+" : ""}
                    {fmt(totalPnl)}
                  </span>
                </div>
                <div className="mt-2 flex h-8 w-full overflow-hidden rounded-lg bg-slate-200">
                  <motion.div
                    className="flex items-center justify-center text-[11px] font-bold text-white"
                    style={{ background: outColor }}
                    animate={{ width: ret === 0 ? "0%" : `${YOU}%` }}
                    transition={{ type: "spring", stiffness: 200, damping: 26 }}
                  >
                    {ret !== 0 && `You ${YOU}%`}
                  </motion.div>
                  <motion.div
                    className="flex items-center justify-center text-[11px] font-bold text-white"
                    style={{ background: outColor, opacity: 0.55 }}
                    animate={{ width: ret === 0 ? "0%" : `${BANK}%` }}
                    transition={{ type: "spring", stiffness: 200, damping: 26 }}
                  >
                    {ret !== 0 && `PBIL ${BANK}%`}
                  </motion.div>
                </div>
              </div>

              {/* Two result tiles */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                    <span className="h-2 w-2 rounded-full" style={{ background: BLUE }} />
                    Your share (70%)
                  </div>
                  <div className="mt-1 text-xl font-extrabold tabular-nums" style={{ color: outColor }}>
                    {isLoss ? "−" : ret > 0 ? "+" : ""}
                    <Counter value={yourPnl} />
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    Ends at <strong className="tabular-nums text-slate-700">{fmt(yourFinal)}</strong>
                  </div>
                </div>
                <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                    <span className="h-2 w-2 rounded-full" style={{ background: ORANGE }} />
                    PBIL&apos;s share (30%)
                  </div>
                  <div className="mt-1 text-xl font-extrabold tabular-nums" style={{ color: outColor }}>
                    {isLoss ? "−" : ret > 0 ? "+" : ""}
                    <Counter value={bankPnl} />
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {isLoss ? "Loss PBIL absorbs with you" : "PBIL earns only when you do"}
                  </div>
                </div>
              </div>

              <div
                className="mt-4 rounded-xl px-4 py-3 text-sm"
                style={{ background: isLoss ? "#fef2f2" : "#ecfdf5", color: isLoss ? LOSS : GAIN }}
              >
                {isLoss ? (
                  <>
                    🤝 PBIL takes <strong>{fmt(bankPnl)}</strong> of this loss off your shoulders — that&apos;s
                    the point of shared risk.
                  </>
                ) : ret === 0 ? (
                  <>➖ No movement, no split — your capital stays intact.</>
                ) : (
                  <>
                    🤝 You keep <strong>{fmt(yourPnl)}</strong>; PBIL earns <strong>{fmt(bankPnl)}</strong> only
                    because you did.
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Footnote */}
          <div className="border-t border-slate-100 px-6 py-4 text-xs text-slate-400 sm:px-8">
            Illustrative simulation. Assumes PBIL co-invests 30% alongside your 70% and both share the
            portfolio&apos;s profit or loss in that ratio. Minimum entry ৳2,00,000 · tenure 2 years or more.
            Investments are subject to market risk.
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
function PartyCard({
  delay,
  emoji,
  who,
  share,
  note,
  ring,
}: {
  delay: number;
  emoji: string;
  who: string;
  share: number;
  note: string;
  ring: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.45, delay }}
      className="relative flex flex-col justify-center overflow-hidden rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5"
      style={{ borderTop: `4px solid ${ring}` }}
    >
      <span aria-hidden className="pointer-events-none absolute -right-3 -top-2 select-none text-6xl opacity-[0.06]">
        {emoji}
      </span>
      <div className="relative flex items-center justify-between">
        <span className="text-3xl">{emoji}</span>
        <span className="rounded-lg px-2.5 py-1 text-lg font-extrabold tabular-nums" style={{ color: ring }}>
          {share}%
        </span>
      </div>
      <div className="relative mt-3 font-bold text-slate-900">{who}</div>
      <p className="relative mt-1 text-sm text-slate-500">{note}</p>
    </motion.div>
  );
}

function Plus() {
  return (
    <div className="flex items-center justify-center">
      <motion.span
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="text-2xl font-bold text-slate-400"
      >
        +
      </motion.span>
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex items-center justify-center">
      <motion.span
        initial={{ opacity: 0, x: -8 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="text-2xl font-bold"
        style={{ color: ORANGE }}
      >
        <span className="hidden md:inline">→</span>
        <span className="md:hidden">↓</span>
      </motion.span>
    </div>
  );
}
