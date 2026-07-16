"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { FUNDS, AMCS, type Fund } from "../data/amcFunds";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MAX_FUNDS = 4;
const PERIODS = [1, 3, 5] as const;

const fmtMoney = (v: number) => {
  if (v >= 100000) return `${(v / 100000).toFixed(1)}L`;
  if (v >= 1000) return `${Math.round(v / 1000)}k`;
  return `${Math.round(v)}`;
};

// Deterministic growth-of-investment series for a fund over `months`.
function genSeries(f: Fund, months: number): number[] {
  const r = (f.ytd ?? f.annualized ?? 12) / 100; // annual growth
  const seed = f.id.length + Math.round(f.nav);
  const base = 16000 + f.nav * 380;
  const out: number[] = [];
  for (let i = 0; i < months; i++) {
    const t = i / 12;
    const wave = Math.sin(i * 0.7 + seed) * 0.045 * (0.4 + t);
    out.push(Math.round(base * Math.pow(1 + r, t) * (1 + wave)));
  }
  return out;
}

export default function FundCompare({ ids, setIds }: { ids: string[]; setIds: React.Dispatch<React.SetStateAction<string[]>> }) {
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>(1);
  const [hover, setHover] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const funds = useMemo(() => ids.map((id) => FUNDS.find((f) => f.id === id)).filter(Boolean) as Fund[], [ids]);
  const months = period * 12;
  const series = useMemo(
    () => funds.map((f) => ({ fund: f, color: AMCS[f.amc].color, values: genSeries(f, months) })),
    [funds, months]
  );

  const labels = useMemo(() => {
    if (period === 1) return MONTHS;
    return Array.from({ length: months }, (_, i) => (i % 12 === 0 ? `Y${i / 12 + 1}` : ""));
  }, [period, months]);

  const available = FUNDS.filter((f) => !ids.includes(f.id));
  const add = (id: string) => {
    if (ids.length < MAX_FUNDS) setIds([...ids, id]);
    setAdding(false);
  };
  const remove = (id: string) => setIds(ids.filter((x) => x !== id));

  // ---- chart geometry ----
  const W = 900;
  const H = 320;
  const padL = 42;
  const padR = 16;
  const padT = 14;
  const padB = 30;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const n = months;
  const maxV = Math.max(1, ...series.flatMap((s) => s.values)) * 1.12;
  const x = (i: number) => padL + (n <= 1 ? 0 : (i / (n - 1)) * innerW);
  const y = (v: number) => padT + innerH - (v / maxV) * innerH;
  const path = (vals: number[]) => vals.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");

  const onMove = (e: React.MouseEvent) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const vbx = ((e.clientX - rect.left) / rect.width) * W;
    const idx = Math.round(((vbx - padL) / innerW) * (n - 1));
    setHover(Math.max(0, Math.min(n - 1, idx)));
  };

  const gridVals = Array.from({ length: 5 }, (_, i) => (maxV / 4) * i);

  return (
    <div className="space-y-5">
      {/* selected funds + add */}
      <div className="flex flex-wrap items-center gap-2">
        {funds.map((f) => (
          <span key={f.id} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/fund-logos/${f.amc}.png`} alt="" className="h-4 w-auto" />
            <span className="font-medium text-slate-800">{f.name}</span>
            {funds.length > 1 && (
              <button onClick={() => remove(f.id)} className="text-slate-400 hover:text-rose-500" aria-label="Remove">
                ✕
              </button>
            )}
          </span>
        ))}
        {ids.length < MAX_FUNDS && (
          <div className="relative">
            <button onClick={() => setAdding((a) => !a)} className="rounded-xl border border-dashed border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-600 hover:border-slate-400">
              + Add fund
            </button>
            {adding && (
              <div className="absolute z-30 mt-2 max-h-72 w-72 overflow-y-auto rounded-2xl bg-white p-2 shadow-xl ring-1 ring-black/5">
                {available.map((f) => (
                  <button key={f.id} onClick={() => add(f.id)} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left hover:bg-slate-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/fund-logos/${f.amc}.png`} alt="" className="h-4 w-auto shrink-0" />
                    <span className="truncate text-sm text-slate-700">{f.name}</span>
                  </button>
                ))}
                {available.length === 0 && <div className="px-2 py-2 text-sm text-slate-400">All funds added.</div>}
              </div>
            )}
          </div>
        )}
      </div>

      {/* GROWTH PROJECTION */}
      <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-semibold text-slate-900">
            <span>📈</span> Growth Projection
          </div>
          <div className="flex rounded-lg border border-slate-200 p-0.5">
            {PERIODS.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`rounded-md px-3 py-1 text-xs font-semibold ${period === p ? "bg-slate-900 text-white" : "text-slate-500"}`}
              >
                {p} Year
              </button>
            ))}
          </div>
        </div>

        {/* NAV row */}
        <div className="mt-4 flex flex-wrap gap-6">
          {series.map((s) => (
            <div key={s.fund.id} className="border-l-2 pl-3" style={{ borderColor: s.color }}>
              <div className="text-xs text-slate-400">NAV of {s.fund.amc.charAt(0).toUpperCase() + s.fund.amc.slice(1)}</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900">{s.fund.nav.toFixed(3)}</span>
                <span className="text-xs font-semibold text-emerald-600">▲ {(s.fund.ytd ?? 0).toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* chart */}
        <div className="relative mt-4">
          <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} width="100%" onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
            {gridVals.map((v, i) => (
              <g key={i}>
                <line x1={padL} x2={W - padR} y1={y(v)} y2={y(v)} stroke="#eef2f7" strokeDasharray="3 4" />
                <text x={padL - 6} y={y(v) + 3} textAnchor="end" fontSize="10" fill="#94a3b8">{fmtMoney(v)}</text>
              </g>
            ))}
            {labels.map((l, i) =>
              l ? (
                <text key={i} x={x(i)} y={H - 8} textAnchor="middle" fontSize="10" fill="#94a3b8">{l}</text>
              ) : null
            )}
            {series.map((s) => (
              <path key={s.fund.id} d={path(s.values)} fill="none" stroke={s.color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
            ))}

            {/* hover guide + tooltip */}
            {hover != null && (
              <>
                <line x1={x(hover)} x2={x(hover)} y1={padT} y2={padT + innerH} stroke="#cbd5e1" strokeDasharray="3 3" />
                {series.map((s) => (
                  <circle key={s.fund.id} cx={x(hover)} cy={y(s.values[hover])} r={4} fill="#fff" stroke={s.color} strokeWidth={2} />
                ))}
                {(() => {
                  const bx = Math.min(x(hover) + 10, W - 150);
                  const by = padT + 6;
                  const rows = series.length;
                  return (
                    <g>
                      <rect x={bx} y={by} width={138} height={26 + rows * 18} rx={8} fill="#0f172a" />
                      <text x={bx + 12} y={by + 18} fontSize="11" fill="#94a3b8">{labels[hover] || `Point ${hover + 1}`}</text>
                      {series.map((s, r) => (
                        <g key={s.fund.id}>
                          <rect x={bx + 12} y={by + 26 + r * 18} width={3} height={12} fill={s.color} />
                          <text x={bx + 20} y={by + 36 + r * 18} fontSize="11" fill="#fff">
                            {s.fund.amc.charAt(0).toUpperCase() + s.fund.amc.slice(1)} : {fmtMoney(s.values[hover])}
                          </text>
                        </g>
                      ))}
                    </g>
                  );
                })()}
              </>
            )}
          </svg>
        </div>

        {/* legend */}
        <div className="mt-3 flex flex-wrap gap-4 border-t border-slate-100 pt-3 text-xs">
          {series.map((s) => (
            <span key={s.fund.id} className="flex items-center gap-2 text-slate-600">
              <span className="h-2 w-4 rounded" style={{ background: s.color }} />
              {s.fund.name}
            </span>
          ))}
        </div>
      </div>

      {/* ANNUAL RETURN + OVERVIEW */}
      <div className="grid gap-5 lg:grid-cols-5">
        {/* Annual return bars */}
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 lg:col-span-2">
          <div className="flex items-center gap-2 font-semibold text-slate-900">📊 Annual Return</div>
          <div className="mt-4 space-y-5">
            {funds.map((f) => {
              const ret = f.ytd ?? f.annualized ?? 0;
              const max = Math.max(1, ...funds.map((x) => x.ytd ?? x.annualized ?? 0));
              return (
                <div key={f.id}>
                  <div className="text-2xl font-bold text-slate-900">{ret.toFixed(2)}%</div>
                  <div className="text-xs text-slate-400">{f.name}</div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full" style={{ width: `${(ret / max) * 100}%`, background: AMCS[f.amc].color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Overview cards */}
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 lg:col-span-3">
          <div className="mb-4 font-semibold text-slate-900">Overview of funds</div>
          <div className="flex flex-wrap gap-4">
            {funds.map((f) => (
              <OverviewCard key={f.id} fund={f} />
            ))}
            {ids.length < MAX_FUNDS && (
              <button onClick={() => setAdding(true)} className="grid min-h-[220px] w-40 place-items-center rounded-2xl border border-dashed border-slate-300 text-sm font-semibold text-slate-500 hover:border-slate-400">
                + Add fund
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function OverviewCard({ fund }: { fund: Fund }) {
  const color = AMCS[fund.amc].color;
  const riskColor = fund.risk === "High" ? "#ef4444" : fund.risk === "Medium" ? "#f59e0b" : "#10b981";
  const spark = genSeries(fund, 14);
  const min = Math.min(...spark);
  const max = Math.max(...spark) || 1;
  const W = 130;
  const Hh = 44;
  const sp = spark.map((v, i) => `${i === 0 ? "M" : "L"} ${(i / (spark.length - 1)) * W} ${Hh - ((v - min) / (max - min || 1)) * Hh}`).join(" ");
  const sell = (fund.nav * 0.988).toFixed(3);
  return (
    <div className="w-52 rounded-2xl border border-slate-100 p-4">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
        <span className="truncate text-sm font-semibold text-slate-900">{fund.name}</span>
      </div>
      <div className="relative mt-3">
        <span className="absolute right-0 top-0 text-[10px] font-semibold" style={{ color: riskColor }}>{fund.risk} Risk</span>
        <svg viewBox={`0 0 ${W} ${Hh}`} width="100%" height="44" className="mt-3">
          <path d={`${sp} L ${W} ${Hh} L 0 ${Hh} Z`} fill={riskColor} fillOpacity={0.1} />
          <path d={sp} fill="none" stroke={riskColor} strokeWidth={1.6} />
        </svg>
      </div>
      <dl className="mt-3 space-y-1.5 text-xs">
        <Row k="Category" v={fund.shariah ? "Shariah" : fund.type} />
        <Row k="Min invest" v={`৳${fund.minInvestment.toLocaleString("en-IN")}`} />
        <Row k="Current NAV" v={`৳${fund.nav.toFixed(3)}`} />
        <Row k="Sell price" v={`৳${sell}`} />
      </dl>
      <Link href={`/funds/${fund.id}`} className="mt-3 block text-xs font-semibold" style={{ color }}>
        View fund →
      </Link>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-slate-400">{k}</dt>
      <dd className="font-semibold text-slate-800">{v}</dd>
    </div>
  );
}
