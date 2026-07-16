"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getFund, AMCS, bdtCompact, type Slice, type Holding } from "../../data/amcFunds";
import { LightHeader, LightFooter, BRAND_ORANGE as ORANGE, BRAND_BLUE as BLUE } from "../../components/LightChrome";

const PALETTE = [ORANGE, BLUE, "#0d9488", "#7c3aed", "#f59e0b", "#0ea5e9", "#ef4444", "#64748b"];
const riskColor: Record<string, { bg: string; fg: string }> = {
  Low: { bg: "#ecfdf5", fg: "#059669" },
  Medium: { bg: "#fffbeb", fg: "#b45309" },
  High: { bg: "#fef2f2", fg: "#dc2626" },
};

// Holding "logo": colour by sector + a short monogram (real logos can replace these).
const SECTOR_COLOR: Record<string, string> = {
  "Govt. Securities": "#0E50A0",
  FDR: "#0d9488",
  "Cash & FDR": "#0d9488",
  "Corporate Bond": "#6366f1",
  Cash: "#64748b",
  "Money Market": "#f59e0b",
  "Pharma & Chemicals": "#16a34a",
  Telecom: "#0ea5e9",
  "Banks & NBFI": "#7c3aed",
  "Islamic Banking": "#059669",
  "Consumer & Food": "#f97316",
  "Cement & Materials": "#78716c",
  Ceramics: "#ec4899",
};
const holdingColor = (h: Holding) => SECTOR_COLOR[h.sector] ?? "#64748b";
const holdingMono = (h: Holding) => {
  if (h.ticker) return h.ticker.replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase();
  const stop = new Set(["the", "of", "and", "(multiple", "banks)", "&"]);
  const words = h.name.split(/\s+/).filter((w) => w.length > 1 && !stop.has(w.toLowerCase()));
  return ((words[0]?.[0] ?? "") + (words[1]?.[0] ?? "")).toUpperCase() || h.name.slice(0, 2).toUpperCase();
};

// Person photo from /public/managers/<name-slug>.png when present, else a coloured initial.
function personSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/,.*$/, "")
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
function PersonAvatar({ name, color, size }: { name: string; color: string; size: number }) {
  const [err, setErr] = useState(false);
  const initial = (name.match(/[A-Za-z]/)?.[0] ?? name.slice(0, 1)).toUpperCase();
  if (!err) {
    return (
      <span className="shrink-0 overflow-hidden rounded-full ring-1 ring-slate-200" style={{ width: size, height: size }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/managers/${personSlug(name)}.png`} alt={name} className="h-full w-full object-cover" onError={() => setErr(true)} />
      </span>
    );
  }
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full font-bold text-white"
      style={{ width: size, height: size, background: color, fontSize: size * 0.38 }}
    >
      {initial}
    </span>
  );
}

// Shows the real company logo from /public/holdings/<ticker>.png when present,
// otherwise falls back to the sector-coloured monogram.
function HoldingBadge({ h }: { h: Holding }) {
  const [err, setErr] = useState(false);
  const slug = h.ticker ? h.ticker.toLowerCase().replace(/[^a-z0-9]/g, "") : null;
  if (slug && !err) {
    return (
      <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-lg bg-white ring-1 ring-slate-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/holdings/${slug}.png`} alt="" className="h-7 w-7 object-contain" onError={() => setErr(true)} />
      </span>
    );
  }
  return (
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[11px] font-bold text-white" style={{ background: holdingColor(h) }}>
      {holdingMono(h)}
    </span>
  );
}

export default function FundDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const fund = getFund(id);
  if (!fund) notFound();
  const amc = AMCS[fund.amc];
  const risk = riskColor[fund.risk];
  const theme = amc.color; // AMC accent colour drives this page
  const [showInvest, setShowInvest] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F8FB] text-slate-900" style={{ colorScheme: "light" }}>
      <LightHeader />

      <div className="relative">
        {/* themed hero band in the AMC's colour */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-80" style={{ background: `linear-gradient(180deg, ${amc.soft} 0%, #F7F8FB 100%)` }} />

        <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/funds" className="text-sm font-semibold" style={{ color: theme }}>
          ← All funds
        </Link>

        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mt-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-slate-200 bg-white p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/fund-logos/${amc.slug}.png`} alt="" className="max-h-full max-w-full object-contain" />
              </span>
              <div>
                <div className="text-sm text-slate-400">
                  {amc.name} · <span className="font-mono">{fund.ticker}</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{fund.name}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Badge bg={theme} fg="#fff">{fund.type}</Badge>
                  <Badge bg={risk.bg} fg={risk.fg}>{fund.risk} risk</Badge>
                  {fund.shariah && <Badge bg="#f5f3ff" fg="#7c3aed">Shariah-compliant</Badge>}
                  <Badge bg="#f1f5f9" fg="#475569">{fund.structure}</Badge>
                  <span className="text-xs text-slate-400">Since {fund.inception}</span>
                </div>
              </div>
            </div>
            <button onClick={() => setShowInvest(true)} className="rounded-xl px-6 py-3 font-semibold text-white shadow-lg transition-transform hover:-translate-y-0.5" style={{ background: theme }}>
              Invest now →
            </button>
          </div>
        </motion.div>

        {/* KEY STATS */}
        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          <Stat label="NAV" value={`৳${fund.nav.toFixed(2)}`} />
          <Stat label="Since inception" value={fund.sinceInception != null ? `+${fund.sinceInception.toFixed(1)}%` : "—"} color="#059669" />
          <Stat label="YTD return" value={fund.ytd != null ? `+${fund.ytd.toFixed(1)}%` : "—"} color="#059669" />
          <Stat label="Annualized" value={fund.annualized != null ? `${fund.annualized.toFixed(2)}%` : "—"} />
          <Stat label="Fund size" value={bdtCompact(fund.aum)} />
          <Stat label="Expense ratio" value={fund.expenseRatio != null ? `${fund.expenseRatio.toFixed(2)}%` : "—"} />
        </div>

        {/* OBJECTIVE + NAV CHART */}
        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <H>Fund philosophy</H>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{fund.objective}</p>
            <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
              <Row k="Structure" v={fund.structure} />
              <Row k="Minimum" v={`৳${fund.minInvestment.toLocaleString("en-IN")}`} />
              <Row k="SIP" v={fund.sip ? "Available" : "—"} />
              <Row k="Exit load" v={fund.exitLoad ?? "—"} />
            </div>
          </Card>
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between">
              <H>NAV growth since inception</H>
              <span className="text-xs text-slate-400">as of Jul 2026</span>
            </div>
            <NavChart months={fund.inceptionMonths} endNav={fund.nav} color={theme} />
          </Card>
        </div>

        {/* ALLOCATION + SECTORS */}
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <Card>
            <H>Asset allocation</H>
            <Donut slices={fund.assetClasses} color={theme} />
          </Card>
          {fund.sectors.length > 0 ? (
            <Card>
              <H>Sector breakdown</H>
              <div className="mt-4 space-y-2.5">
                {fund.sectors.map((s, i) => (
                  <Bar key={s.label} slice={s} color={PALETTE[i % PALETTE.length]} />
                ))}
              </div>
            </Card>
          ) : (
            <Card>
              <H>Instrument mix</H>
              <p className="mt-2 text-sm text-slate-500">
                A fixed-income portfolio of government securities, corporate bonds, FDRs and money-market instruments —
                see holdings below.
              </p>
              <Donut slices={fund.assetClasses} color={theme} />
            </Card>
          )}
        </div>

        {/* TOP HOLDINGS */}
        <Card className="mt-5">
          <div className="flex items-center justify-between">
            <H>Top 5 holdings</H>
            <span className="text-xs text-slate-400">% of NAV</span>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
                  <th className="pb-2 font-semibold">#</th>
                  <th className="pb-2 font-semibold">Holding</th>
                  <th className="pb-2 font-semibold">Sector</th>
                  <th className="pb-2 text-right font-semibold">Weight</th>
                </tr>
              </thead>
              <tbody>
                {fund.topHoldings.slice(0, 5).map((h: Holding, i) => (
                  <tr key={h.name} className="border-t border-slate-100">
                    <td className="py-3 text-slate-400">{i + 1}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <HoldingBadge h={h} />
                        <div>
                          <div className="font-medium text-slate-900">{h.name}</div>
                          {h.ticker && <div className="font-mono text-[11px] text-slate-400">{h.ticker}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-slate-500">{h.sector}</td>
                    <td className="py-2.5">
                      <div className="flex items-center justify-end gap-2">
                        <span className="hidden h-1.5 w-24 overflow-hidden rounded-full bg-slate-100 sm:block">
                          <span className="block h-full rounded-full" style={{ width: `${Math.min(100, h.weight * 8)}%`, background: theme }} />
                        </span>
                        <span className="font-semibold tabular-nums text-slate-900">{h.weight.toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* MANAGER + AMC */}
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <Card>
            <H>Fund manager</H>
            <div className="mt-3 flex items-center gap-3">
              <PersonAvatar name={amc.md.name} color={theme} size={56} />
              <div>
                <div className="font-semibold text-slate-900">{amc.md.name}</div>
                <div className="text-sm" style={{ color: theme }}>{amc.md.title}</div>
                <div className="text-xs text-slate-400">{amc.name}</div>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{amc.md.bio}</p>
            <div className="mt-4 border-t border-slate-100 pt-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Investment team</div>
              <ul className="mt-3 space-y-2.5 text-sm">
                {amc.team
                  .filter((p) => !amc.md.name.toLowerCase().startsWith(p.name.toLowerCase()))
                  .map((p) => (
                  <li key={p.name} className="flex items-center gap-3">
                    <PersonAvatar name={p.name} color={theme} size={34} />
                    <span className="min-w-0 flex-1 text-slate-700">
                      {p.name}
                      <span className="text-slate-400"> · {p.title}</span>
                    </span>
                    {p.credential && <span className="shrink-0 rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">{p.credential}</span>}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/fund-logos/${amc.slug}.png`} alt="" className="h-7 w-auto" />
              <span className="text-xs text-slate-400">{amc.since}</span>
            </div>
            <H className="mt-3">About {amc.name}</H>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{amc.blurb}</p>
            <div className="mt-4 rounded-xl p-4" style={{ background: amc.soft }}>
              <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: theme }}>Investment philosophy</div>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{amc.philosophy}</p>
            </div>
          </Card>
        </div>

        {/* DISCLAIMER + CTA */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 text-xs leading-relaxed text-slate-500">
          <strong className="text-slate-600">Data note:</strong> NAV, returns, AUM, fees and inception are sourced from{" "}
          {amc.name}&apos;s website and the LankaBD open-end fund review (July 2026). The asset-allocation, sector and
          top-holding breakdowns shown here are <strong>representative illustrations</strong> based on the fund&apos;s type
          and typical DSE blue-chip holdings — official figures are published in the fund&apos;s monthly factsheet.
          Mutual-fund investments are subject to market risk; past performance does not guarantee future results.
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={() => setShowInvest(true)} className="rounded-xl px-6 py-3 font-semibold text-white shadow-lg transition-transform hover:-translate-y-0.5" style={{ background: theme }}>
            Invest in this fund →
          </button>
          <Link href="/funds" className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50">
            Compare other funds
          </Link>
        </div>
        </div>
      </div>

      {/* INVEST SYNOPSIS MODAL */}
      <AnimatePresence>
        {showInvest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4 backdrop-blur-sm"
            onClick={() => setShowInvest(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
            >
              {/* header */}
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-5">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white p-1.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/fund-logos/${amc.slug}.png`} alt="" className="max-h-full max-w-full object-contain" />
                  </span>
                  <div className="min-w-0">
                    <div className="truncate font-bold text-slate-900">{fund.name}</div>
                    <div className="text-xs text-slate-400">{amc.name} · {fund.ticker}</div>
                  </div>
                </div>
                <button onClick={() => setShowInvest(false)} className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-400 hover:bg-slate-100">
                  ✕
                </button>
              </div>

              {/* synopsis */}
              <div className="p-5">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Fund synopsis</div>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{fund.objective}</p>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <MiniStat label="NAV" value={`৳${fund.nav.toFixed(2)}`} />
                  <MiniStat label="Since inception" value={fund.sinceInception != null ? `+${fund.sinceInception.toFixed(1)}%` : "—"} color="#059669" />
                  <MiniStat label="Type / risk" value={`${fund.type} · ${fund.risk}`} />
                  <MiniStat label="Min investment" value={`৳${fund.minInvestment.toLocaleString("en-IN")}`} />
                </div>

                <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
                  <span>🔒</span>
                  <span>You&apos;ll complete the actual purchase securely in the Investor Portal.</span>
                </div>
              </div>

              {/* actions */}
              <div className="flex gap-3 border-t border-slate-100 p-5">
                <button onClick={() => setShowInvest(false)} className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                  Cancel
                </button>
                <Link href="/portal" className="flex-1 rounded-xl py-2.5 text-center text-sm font-semibold text-white shadow-lg" style={{ background: theme }}>
                  Proceed in Portal →
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <LightFooter />
    </div>
  );
}

// ---- pieces ----
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 ${className}`}>{children}</div>;
}
function H({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <h3 className={`text-lg font-bold tracking-tight text-slate-900 ${className}`}>{children}</h3>;
}
function Badge({ children, bg, fg }: { children: React.ReactNode; bg: string; fg: string }) {
  return (
    <span className="rounded-md px-2 py-0.5 text-xs font-semibold" style={{ background: bg, color: fg }}>
      {children}
    </span>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-400">{k}</span>
      <span className="font-medium text-slate-800">{v}</span>
    </div>
  );
}
function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
      <div className="text-lg font-bold tabular-nums" style={{ color: color ?? "#0f172a" }}>{value}</div>
      <div className="mt-0.5 text-[11px] uppercase tracking-wide text-slate-400">{label}</div>
    </div>
  );
}
function MiniStat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <div className="text-sm font-bold" style={{ color: color ?? "#0f172a" }}>{value}</div>
      <div className="mt-0.5 text-[10px] uppercase tracking-wide text-slate-400">{label}</div>
    </div>
  );
}
function Bar({ slice, color }: { slice: Slice; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-600">{slice.label}</span>
        <span className="font-semibold tabular-nums text-slate-900">{slice.pct}%</span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full" style={{ width: `${slice.pct}%`, background: color }} />
      </div>
    </div>
  );
}

function Donut({ slices, color }: { slices: Slice[]; color: string }) {
  const total = slices.reduce((s, x) => s + x.pct, 0) || 100;
  const pal = [color, ...PALETTE.filter((c) => c !== color)];
  const R = 42;
  const C = 2 * Math.PI * R;
  let offset = 0;
  const arcs = slices.map((s, i) => {
    const dash = (s.pct / total) * C;
    const a = { color: pal[i % pal.length], dash, gap: C - dash, off: offset, ...s };
    offset -= dash;
    return a;
  });
  return (
    <div className="mt-4 flex items-center gap-6">
      <svg viewBox="0 0 100 100" width="120" height="120" className="shrink-0 -rotate-90">
        <circle cx="50" cy="50" r={R} fill="none" stroke="#eef2f7" strokeWidth="13" />
        {arcs.map((a, i) => (
          <circle key={i} cx="50" cy="50" r={R} fill="none" stroke={a.color} strokeWidth="13" strokeDasharray={`${a.dash} ${a.gap}`} strokeDashoffset={a.off} />
        ))}
      </svg>
      <ul className="min-w-0 flex-1 space-y-2">
        {arcs.map((a, i) => (
          <li key={i} className="flex items-center justify-between gap-2 text-sm">
            <span className="flex min-w-0 items-center gap-2">
              <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: a.color }} />
              <span className="truncate text-slate-600">{a.label}</span>
            </span>
            <span className="font-semibold tabular-nums text-slate-900">{a.pct}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NavChart({ months, endNav, color }: { months: number; endNav: number; color: string }) {
  const n = Math.max(2, Math.min(30, months + 1));
  const start = 10;
  const pts = Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    const base = start + (endNav - start) * t;
    const wave = i === 0 || i === n - 1 ? 0 : Math.sin(i * 0.9) * Math.abs(endNav - start) * 0.05;
    return Math.max(9.4, base + wave);
  });
  pts[0] = start;
  pts[n - 1] = endNav;

  const W = 640;
  const Hh = 200;
  const padL = 34;
  const padB = 22;
  const padT = 12;
  const innerW = W - padL - 10;
  const innerH = Hh - padT - padB;
  const min = Math.min(...pts, 9.8) * 0.99;
  const max = Math.max(...pts) * 1.02;
  const x = (i: number) => padL + (i / (n - 1)) * innerW;
  const y = (v: number) => padT + innerH - ((v - min) / (max - min || 1)) * innerH;
  const line = pts.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const area = `${line} L ${x(n - 1)} ${padT + innerH} L ${padL} ${padT + innerH} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${Hh}`} width="100%" className="mt-4">
      {[0, 0.5, 1].map((g) => {
        const v = min + (max - min) * g;
        return (
          <g key={g}>
            <line x1={padL} x2={W - 10} y1={y(v)} y2={y(v)} stroke="#eef2f7" strokeWidth={1} />
            <text x={padL - 6} y={y(v) + 3} textAnchor="end" fontSize="10" fill="#94a3b8" className="tabular-nums">
              {v.toFixed(1)}
            </text>
          </g>
        );
      })}
      <path d={area} fill={color} fillOpacity={0.12} />
      <path d={line} fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={x(n - 1)} cy={y(pts[n - 1])} r={4} fill={color} stroke="#fff" strokeWidth={2} />
      <text x={padL} y={Hh - 6} fontSize="10" fill="#94a3b8">Launch</text>
      <text x={W - 10} y={Hh - 6} fontSize="10" fill="#94a3b8" textAnchor="end">Now</text>
    </svg>
  );
}
