"use client";

// Small info glyph carrying a "how this is calculated" note (FR-DASH-08).
export function Info({ note }: { note: string }) {
  return (
    <span
      title={note}
      className="ml-1 inline-grid h-4 w-4 cursor-help place-items-center rounded-full border border-slate-200 text-[10px] text-slate-500 align-middle"
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
      className="cursor-help rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-xs text-slate-500"
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
    tone === "pos" ? "text-emerald-600" : tone === "neg" ? "text-rose-600" : tone === "muted" ? "text-slate-600" : "text-slate-900";
  return (
    <div className="lcard p-4">
      <div className="flex items-center text-xs text-slate-500">
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
      {sub && <div className="mt-1 text-xs text-slate-400">{sub}</div>}
    </div>
  );
}

export function SectionHeading({ title, sub, right }: { title: string; sub?: string; right?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {sub && <p className="mt-0.5 text-sm text-slate-500">{sub}</p>}
      </div>
      {right}
    </div>
  );
}
