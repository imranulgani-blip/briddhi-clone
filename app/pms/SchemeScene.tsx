"use client";

// Animated, per-scheme banner scenery for the PrimeInvest cards.
// Hand-rolled SVG (no external assets, matching the project convention) with
// framer-motion loops. Renders full-bleed behind each card's banner; the parent
// sets the colour via `text-white` and the scene draws in `currentColor`.

import { motion, type Transition } from "framer-motion";

const spin = (dur: number): Transition => ({ duration: dur, repeat: Infinity, ease: "linear" });
const breathe = (dur: number): Transition => ({ duration: dur, repeat: Infinity, ease: "easeInOut" });

// A three-bladed windmill rotor that spins around its hub.
function Rotor({ x, y, r = 26 }: { x: number; y: number; r?: number }) {
  const up = { x2: x, y2: y - r };
  const bl = { x2: x - r * 0.87, y2: y + r * 0.5 };
  const br = { x2: x + r * 0.87, y2: y + r * 0.5 };
  return (
    <>
      <motion.g
        animate={{ rotate: 360 }}
        transition={spin(7)}
        style={{ transformBox: "view-box", transformOrigin: `${x}px ${y}px` }}
      >
        <path d={`M${x} ${y} L${up.x2} ${up.y2}`} strokeOpacity={0.4} />
        <path d={`M${x} ${y} L${bl.x2} ${bl.y2}`} strokeOpacity={0.4} />
        <path d={`M${x} ${y} L${br.x2} ${br.y2}`} strokeOpacity={0.4} />
      </motion.g>
      <circle cx={x} cy={y} r={2.4} strokeOpacity={0.5} />
    </>
  );
}

// Drifting upward particles shared by every scene — a subtle "alive" feel.
function Particles() {
  const dots = [
    { x: 60, s: 2.2, d: 0 },
    { x: 150, s: 1.6, d: 1.4 },
    { x: 235, s: 2.6, d: 0.7 },
    { x: 300, s: 1.8, d: 2.1 },
    { x: 355, s: 2.2, d: 1.1 },
  ];
  return (
    <>
      {dots.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x}
          r={p.s}
          fill="currentColor"
          stroke="none"
          initial={{ cy: 116, opacity: 0 }}
          animate={{ cy: [116, -8], opacity: [0, 0.5, 0] }}
          transition={{ duration: 6 + i, repeat: Infinity, ease: "easeOut", delay: p.d }}
          style={{ opacity: 0.4 }}
        />
      ))}
    </>
  );
}

function scene(id: string) {
  switch (id) {
    // Wealth Maximizer — rising bars, a drawn growth line, spinning turbines.
    case "wealth-maximizer":
      return (
        <>
          <path d="M18 104 H382" strokeOpacity={0.25} />
          <motion.g
            animate={{ scaleY: [0.86, 1, 0.86] }}
            transition={breathe(4)}
            style={{ transformBox: "view-box", transformOrigin: "0px 104px" }}
          >
            {[
              { x: 40, h: 30 },
              { x: 78, h: 46 },
              { x: 116, h: 60 },
              { x: 154, h: 76 },
              { x: 192, h: 92 },
            ].map((b) => (
              <rect
                key={b.x}
                x={b.x}
                y={104 - b.h}
                width={22}
                height={b.h}
                rx={3}
                fill="currentColor"
                fillOpacity={0.12}
                strokeOpacity={0.32}
              />
            ))}
          </motion.g>
          <motion.path
            d="M51 74 L89 58 L127 44 L165 28 L203 12"
            strokeOpacity={0.75}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 1] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
          />
          <path d="M203 12 l-9 1.5 l3 -8.5" strokeOpacity={0.75} />
          <path d="M300 104 V52" strokeOpacity={0.4} />
          <path d="M352 104 V64" strokeOpacity={0.4} />
          <Rotor x={300} y={52} r={26} />
          <Rotor x={352} y={64} r={18} />
        </>
      );

    // Monthly Investment Plan — calendar, recurring arrow, coins stacking up.
    case "monthly-investment-plan":
      return (
        <>
          <path d="M18 104 H382" strokeOpacity={0.22} />
          {/* calendar */}
          <rect x={36} y={30} width={92} height={66} rx={7} strokeOpacity={0.4} />
          <path d="M36 48 H128" strokeOpacity={0.4} />
          <path d="M58 22 V36 M106 22 V36" strokeOpacity={0.45} />
          <path
            d="M50 60 h10 M77 60 h10 M104 60 h6 M50 74 h10 M77 74 h10 M104 74 h6 M50 88 h10 M77 88 h10"
            strokeOpacity={0.3}
          />
          {/* recurring arrow */}
          <motion.g
            animate={{ rotate: 360 }}
            transition={spin(9)}
            style={{ transformBox: "view-box", transformOrigin: "168px 58px" }}
          >
            <path d="M168 34 a24 24 0 1 1 -22 14" strokeOpacity={0.5} />
            <path d="M168 34 l-8 5 l8 4" strokeOpacity={0.5} />
          </motion.g>
          {/* rising coin stacks — each "month" a little taller */}
          {[
            { x: 232, n: 2 },
            { x: 274, n: 3 },
            { x: 316, n: 4 },
            { x: 358, n: 5 },
          ].map((s, si) => (
            <motion.g
              key={s.x}
              animate={{ y: [4, -2, 4] }}
              transition={{ ...breathe(3.4), delay: si * 0.25 }}
            >
              {Array.from({ length: s.n }).map((_, k) => (
                <ellipse
                  key={k}
                  cx={s.x}
                  cy={98 - k * 11}
                  rx={15}
                  ry={5.5}
                  fill="currentColor"
                  fillOpacity={0.1}
                  strokeOpacity={0.4}
                />
              ))}
            </motion.g>
          ))}
        </>
      );

    // Equity Sharing (70:30) — two overlapping circles that gently breathe.
    case "equity-sharing":
      return (
        <>
          <motion.circle
            cx={168}
            cy={60}
            r={40}
            strokeOpacity={0.42}
            animate={{ r: [40, 43, 40] }}
            transition={breathe(4)}
          />
          <motion.circle
            cx={236}
            cy={60}
            r={40}
            strokeOpacity={0.42}
            animate={{ r: [40, 37, 40] }}
            transition={breathe(4)}
          />
          <path d="M202 26 V94" strokeOpacity={0.55} strokeDasharray="5 5" />
          <path d="M118 60 h6 M286 60 h-6" strokeOpacity={0.4} />
          {/* orbiting satellites */}
          {[0, 120, 240].map((deg, i) => (
            <motion.g
              key={deg}
              animate={{ rotate: [deg, deg + 360] }}
              transition={spin(12 + i * 2)}
              style={{ transformBox: "view-box", transformOrigin: "202px 60px" }}
            >
              <circle cx={202} cy={12} r={2.6} fill="currentColor" stroke="none" fillOpacity={0.5} />
            </motion.g>
          ))}
        </>
      );

    // Performance Scheme — podium, trophy, twinkling sparkles.
    case "performance-scheme":
      return (
        <>
          <path d="M18 104 H382" strokeOpacity={0.22} />
          {/* podium */}
          <rect x={150} y={72} width={38} height={32} rx={2} fill="currentColor" fillOpacity={0.1} strokeOpacity={0.35} />
          <rect x={188} y={52} width={40} height={52} rx={2} fill="currentColor" fillOpacity={0.14} strokeOpacity={0.4} />
          <rect x={228} y={84} width={38} height={20} rx={2} fill="currentColor" fillOpacity={0.1} strokeOpacity={0.35} />
          {/* trophy on the winner's block */}
          <motion.g animate={{ y: [0, -3, 0] }} transition={breathe(3)}>
            <path d="M198 24 H218 V34 Q218 46 208 47 Q198 46 198 34 Z" strokeOpacity={0.55} />
            <path d="M198 27 Q190 27 190 34 Q190 41 198 41" strokeOpacity={0.5} />
            <path d="M218 27 Q226 27 226 34 Q226 41 218 41" strokeOpacity={0.5} />
            <path d="M208 47 V52 M201 52 H215" strokeOpacity={0.5} />
          </motion.g>
          {/* sparkles */}
          {[
            { x: 70, y: 40, d: 0 },
            { x: 110, y: 70, d: 0.6 },
            { x: 300, y: 34, d: 1.1 },
            { x: 336, y: 62, d: 0.3 },
            { x: 260, y: 30, d: 0.9 },
          ].map((s, i) => (
            <motion.path
              key={i}
              d={`M${s.x} ${s.y - 6} V${s.y + 6} M${s.x - 6} ${s.y} H${s.x + 6}`}
              strokeOpacity={0.7}
              animate={{ opacity: [0, 1, 0], scale: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, delay: s.d, ease: "easeInOut" }}
              style={{ transformBox: "view-box", transformOrigin: `${s.x}px ${s.y}px` }}
            />
          ))}
        </>
      );

    // Capital Protected — a shield with an expanding pulse ring + drawn check.
    case "capital-protected":
      return (
        <>
          {[0, 1].map((i) => (
            <motion.path
              key={i}
              d="M200 22 L236 36 V64 Q236 92 200 106 Q164 92 164 64 V36 Z"
              strokeOpacity={0.4}
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: [1, 1.35], opacity: [0.5, 0] }}
              transition={{ duration: 2.6, repeat: Infinity, delay: i * 1.3, ease: "easeOut" }}
              style={{ transformBox: "view-box", transformOrigin: "200px 62px" }}
            />
          ))}
          <path
            d="M200 26 L232 38 V64 Q232 89 200 102 Q168 89 168 64 V38 Z"
            fill="currentColor"
            fillOpacity={0.1}
            strokeOpacity={0.5}
          />
          <motion.path
            d="M186 62 l10 11 l19 -22"
            strokeOpacity={0.85}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1.4, ease: "easeInOut" }}
          />
          {/* faint side shields */}
          <path d="M92 44 L108 50 V64 Q108 76 92 82 Q76 76 76 64 V50 Z" strokeOpacity={0.18} />
          <path d="M312 48 L326 54 V66 Q326 76 312 81 Q298 76 298 66 V54 Z" strokeOpacity={0.18} />
        </>
      );

    // Secured Income — treasury colonnade with a waving pennant + coins.
    case "secured-income":
      return (
        <>
          <path d="M18 104 H382" strokeOpacity={0.22} />
          {/* pediment + columns */}
          <path d="M148 46 L200 24 L252 46 Z" strokeOpacity={0.45} fill="currentColor" fillOpacity={0.08} />
          <path d="M150 52 H250" strokeOpacity={0.45} />
          <path d="M160 54 V94 M180 54 V94 M200 54 V94 M220 54 V94 M240 54 V94" strokeOpacity={0.4} />
          <path d="M142 98 H258 M148 92 H252" strokeOpacity={0.45} />
          {/* flagpole + waving pennant */}
          <path d="M200 24 V8" strokeOpacity={0.5} />
          <motion.path
            d="M200 10 L222 14 L200 20 Z"
            fill="currentColor"
            fillOpacity={0.35}
            strokeOpacity={0.5}
            animate={{ skewX: [0, -10, 0, 8, 0] }}
            transition={breathe(2.6)}
            style={{ transformBox: "view-box", transformOrigin: "200px 15px" }}
          />
          {/* coins to the sides */}
          {[80, 320].map((cx, i) => (
            <motion.g key={cx} animate={{ y: [3, -2, 3] }} transition={{ ...breathe(3.2), delay: i * 0.4 }}>
              {[0, 1, 2].map((k) => (
                <ellipse
                  key={k}
                  cx={cx}
                  cy={96 - k * 11}
                  rx={16}
                  ry={6}
                  fill="currentColor"
                  fillOpacity={0.1}
                  strokeOpacity={0.4}
                />
              ))}
            </motion.g>
          ))}
        </>
      );

    default:
      return (
        <>
          <circle cx={200} cy={60} r={26} strokeOpacity={0.4} />
          <path d="M186 60 l10 11 l19 -22" strokeOpacity={0.6} />
        </>
      );
  }
}

export function SchemeScene({ id, className }: { id: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 400 120"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {scene(id)}
      <Particles />
    </svg>
  );
}
