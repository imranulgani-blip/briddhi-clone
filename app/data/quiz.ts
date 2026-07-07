export interface QuizOption {
  label: string;
  score: number;
  emoji: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  emoji: string;
  theme: string; // short gamified label
  options: QuizOption[];
}

export const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "How long can you leave your money invested?",
    emoji: "⏳",
    theme: "Time Horizon",
    options: [
      { label: "Less than 1 year", score: 1, emoji: "🐇" },
      { label: "1–3 years", score: 2, emoji: "🚶" },
      { label: "3–7 years", score: 3, emoji: "🧭" },
      { label: "More than 7 years", score: 4, emoji: "🌳" },
    ],
  },
  {
    id: 2,
    question: "If your fund dropped 20% in a month, you would:",
    emoji: "📉",
    theme: "Nerves of Steel",
    options: [
      { label: "Sell everything — I can't sleep at night", score: 1, emoji: "😱" },
      { label: "Sell some to reduce exposure", score: 2, emoji: "😟" },
      { label: "Hold and wait it out", score: 3, emoji: "😌" },
      { label: "Buy more while it's cheap", score: 4, emoji: "🤑" },
    ],
  },
  {
    id: 3,
    question: "What's your main goal?",
    emoji: "🎯",
    theme: "The Mission",
    options: [
      { label: "Preserve what I have", score: 1, emoji: "🛡️" },
      { label: "Beat inflation", score: 2, emoji: "💵" },
      { label: "Grow moderately over time", score: 3, emoji: "📈" },
      { label: "Maximise long-term growth", score: 4, emoji: "🚀" },
    ],
  },
  {
    id: 4,
    question: "How much investing experience do you have?",
    emoji: "🎓",
    theme: "Experience Points",
    options: [
      { label: "None — this is my first", score: 1, emoji: "🐣" },
      { label: "A little — savings accounts, FDR", score: 2, emoji: "🏦" },
      { label: "Some — mutual funds or bonds before", score: 3, emoji: "📊" },
      { label: "A lot — stocks, funds, active trading", score: 4, emoji: "🐺" },
    ],
  },
  {
    id: 5,
    question: "What share of your income can you invest?",
    emoji: "💰",
    theme: "Fire Power",
    options: [
      { label: "Under 5% — this is spare cash", score: 1, emoji: "🪙" },
      { label: "5–15%", score: 2, emoji: "💵" },
      { label: "15–30%", score: 3, emoji: "💸" },
      { label: "Over 30% — I'm saving aggressively", score: 4, emoji: "🔥" },
    ],
  },
];

export interface RiskResult {
  key: "low" | "medium" | "high";
  title: string;
  emoji: string;
  tagline: string;
  summary: string;
  suggestion: string;
  recommendedFundTypes: string[];
  // tailwind accent classes
  text: string;
  ring: string;
  bar: string;
}

export function classify(score: number): RiskResult {
  if (score <= 8) {
    return {
      key: "low",
      title: "Conservative",
      emoji: "🛡️",
      tagline: "The Guardian",
      summary:
        "You value stability over upside. Preservation and income matter more than chasing growth.",
      suggestion:
        "Lean toward Fixed Income and low-risk Shariah funds. Consider fixed deposits alongside.",
      recommendedFundTypes: ["Fixed", "Shariah"],
      text: "text-emerald-400",
      ring: "text-emerald-400",
      bar: "#10b981",
    };
  }
  if (score <= 14) {
    return {
      key: "medium",
      title: "Balanced",
      emoji: "⚖️",
      tagline: "The Strategist",
      summary:
        "You can tolerate some volatility for meaningful long-term growth, but not roller-coaster swings.",
      suggestion:
        "A Balanced fund core with a small Growth or Shariah allocation is a good starting mix.",
      recommendedFundTypes: ["Balanced", "Shariah"],
      text: "text-amber-400",
      ring: "text-amber-400",
      bar: "#f59e0b",
    };
  }
  return {
    key: "high",
    title: "Growth-Seeker",
    emoji: "🚀",
    tagline: "The Trailblazer",
    summary:
      "You have time and stomach for volatility, and you're focused on maximising long-term returns.",
    suggestion:
      "Growth-oriented equity funds should form the majority of your portfolio, balanced with 20–30% in more stable funds.",
    recommendedFundTypes: ["Growth", "Balanced"],
    text: "text-rose-400",
    ring: "text-rose-400",
    bar: "#f43f5e",
  };
}

// Live tilt (0–100) from the answers gathered so far, for the risk meter.
export function liveTilt(answers: Record<number, number>): number {
  const vals = Object.values(answers);
  if (vals.length === 0) return 0;
  const avg = vals.reduce((s, v) => s + v, 0) / vals.length; // 1..4
  return ((avg - 1) / 3) * 100;
}
