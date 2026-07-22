"use client";

// Self-contained line-art SVG illustrations, one per PrimeInvest scheme.
// Rendered as a decorative backdrop inside each card's banner. Uses
// `currentColor` so the parent controls colour/opacity. No external assets.

function scene(id: string) {
  switch (id) {
    // Wealth Maximizer — wind turbines (growth / energy)
    case "wealth-maximizer":
      return (
        <>
          <path d="M4 84 H116" />
          <path d="M4 84 Q40 74 72 82" opacity={0.6} />
          {/* big turbine */}
          <path d="M74 84 V44" />
          <circle cx="74" cy="44" r="3.2" />
          <path d="M74 44 V18" />
          <path d="M74 44 L51 56" />
          <path d="M74 44 L97 56" />
          {/* small turbine */}
          <path d="M34 84 V58" />
          <circle cx="34" cy="58" r="2.4" />
          <path d="M34 58 V40" />
          <path d="M34 58 L21 66" />
          <path d="M34 58 L47 66" />
        </>
      );

    // Monthly Investment Plan — calendar + recurring arrow
    case "monthly-investment-plan":
      return (
        <>
          <rect x="30" y="30" width="52" height="46" rx="5" />
          <path d="M30 42 H82" />
          <path d="M44 24 V34" />
          <path d="M68 24 V34" />
          <path d="M40 52 h8 M56 52 h8 M40 62 h8 M56 62 h8" />
          {/* recurring arrow */}
          <path d="M92 44 a15 15 0 1 0 -4 16" />
          <path d="M92 44 l-6 1 l2 -6" />
        </>
      );

    // Equity Sharing — two overlapping circles (shared / co-invest)
    case "equity-sharing":
      return (
        <>
          <circle cx="50" cy="48" r="20" />
          <circle cx="76" cy="48" r="20" />
          <path d="M63 33 V63" opacity={0.7} />
          <circle cx="40" cy="48" r="2.6" />
          <circle cx="86" cy="48" r="2.6" />
        </>
      );

    // Performance Scheme — trophy
    case "performance-scheme":
      return (
        <>
          <path d="M47 28 H73 V40 Q73 55 60 57 Q47 55 47 40 Z" />
          <path d="M47 32 Q37 32 37 41 Q37 50 47 50" />
          <path d="M73 32 Q83 32 83 41 Q83 50 73 50" />
          <path d="M60 57 V66" />
          <path d="M50 72 H70" />
          <path d="M46 78 H74" />
          <path d="M54 40 l4 4 l8 -9" />
        </>
      );

    // Capital Protected — shield with check
    case "capital-protected":
      return (
        <>
          <path d="M60 18 L86 28 V49 Q86 71 60 82 Q34 71 34 49 V28 Z" />
          <path d="M49 49 l8 9 l15 -17" />
        </>
      );

    // Secured Income — treasury / bank building (govt. securities)
    case "secured-income":
      return (
        <>
          <path d="M28 38 L60 22 L92 38 Z" />
          <path d="M34 40 V70 M47 40 V70 M60 40 V70 M73 40 V70 M86 40 V70" />
          <path d="M24 74 H96" />
          <path d="M28 80 H92" />
        </>
      );

    default:
      return (
        <>
          <circle cx="60" cy="48" r="22" />
          <path d="M50 48 l7 8 l14 -16" />
        </>
      );
  }
}

export function Illustration({ id, className }: { id: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 120 96"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      preserveAspectRatio="xMidYMid meet"
      className={className}
      aria-hidden
    >
      {scene(id)}
    </svg>
  );
}
