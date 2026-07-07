import { bdt, pct } from "../../data/funds";

export { bdt, pct };

// Render a nullable value or the "N/A" sentinel used across the portal.
export function naOr(value: number | null | undefined, fn: (v: number) => string): string {
  return value == null ? "N/A" : fn(value);
}

export function fmtDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

// Deterministic accent colours for allocation charts (dark-theme friendly).
export const CHART_COLORS = [
  "#4ade80",
  "#38bdf8",
  "#a78bfa",
  "#f472b6",
  "#fbbf24",
  "#34d399",
  "#60a5fa",
  "#f87171",
  "#c084fc",
  "#2dd4bf",
  "#facc15",
  "#fb923c",
];
