/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#05070d",
          900: "#0a0f1a",
          800: "#0f1626",
          700: "#1a2338",
          600: "#2a3552",
          500: "#3c4970",
          400: "#6b7898",
          300: "#a4adc5",
          200: "#d1d6e3",
          100: "#eef0f6",
        },
        neon: {
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
        },
        signal: {
          up: "#10b981",
          down: "#ef4444",
          warn: "#f59e0b",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(74, 222, 128, 0.35)",
      },
    },
  },
  plugins: [],
};
