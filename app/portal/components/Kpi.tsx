"use client";

// Small info glyph carrying a "how this is calculated" note (FR-DASH-08).
export function Info({ note }: { note: string }) {
  return (
    <span
      title={note}
      className="ml-1 inline-grid h-4 w-4 cursor-help place-items-center rounded-full border border-ink-600 text-[10px] text-ink-400 align-middle"
      aria-label={note}
    >
      i
    </span>
  );
}

export function NaBadge() {
  return (
    <span
      title="Requires NAV data, which is not present in the source dataset. Populate NAVs to compute this."
      className="cursor-help rounded-md border border-ink-600 bg-ink-800/60 px-1.5 py-0.5 text-xs text-ink-400"
    >
      N/A
    </span>
  );
}

export function KpiCard({
  label,
  value,
  isNa,
  sub,
  tone = "default",
  note,
}: {
  label: string;
  value: string;
  isNa?: boolean;
  sub?: string;
  tone?: "default" | "pos" | "neg" | "muted";
  note?: string;
}) {
  const color =
    tone === "pos" ? "text-neon-400" : tone === "neg" ? "text-rose-400" : tone === "muted" ? "text-ink-300" : "text-ink-100";
  return (
    <div className="surface p-4">
      <div className="flex items-center text-xs text-ink-400">
        {label}
        {note && <Info note={note} />}
      </div>
      {isNa ? (
        <div className="mt-2">
          <NaBadge />
        </div>
      ) : (
        <div className={`mono mt-1 text-2xl font-semibold ${color}`}>{value}</div>
      )}
      {sub && <div className="mt-1 text-xs text-ink-500">{sub}</div>}
    </div>
  );
}

export function SectionHeading({ title, sub, right }: { title: string; sub?: string; right?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {sub && <p className="mt-0.5 text-sm text-ink-400">{sub}</p>}
      </div>
      {right}
    </div>
  );
}
