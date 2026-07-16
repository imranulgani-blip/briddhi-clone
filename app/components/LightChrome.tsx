"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

// Shared light-mode header/footer for the new "Stable Money" design language
// (used by /draft and /learn).

export const BRAND_BLUE = "#0E50A0";
export const BRAND_ORANGE = "#F5821E";

const NAV = [
  { label: "Funds", href: "/funds" },
  { label: "Briddhi Basket", href: "/basket" },
  { label: "Learn to Invest", href: "/learn" },
  { label: "Advisors", href: "#advisors" },
  { label: "More", href: "#" },
];

export function LightHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => href.startsWith("/") && href.length > 1 && pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/draft" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/briddhi-logo.png" alt="Briddhi" className="h-7 w-auto" />
        </Link>
        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.label}
              href={n.href}
              className={`text-sm font-medium transition-colors hover:text-slate-900 ${
                isActive(n.href) ? "text-slate-900" : "text-slate-600"
              }`}
              style={isActive(n.href) ? { color: BRAND_ORANGE } : undefined}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/portal"
            className="rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5"
            style={{ background: BRAND_ORANGE }}
          >
            Log in / Sign in
          </Link>
          <button className="lg:hidden text-slate-700" onClick={() => setOpen(!open)} aria-label="Menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col px-4 py-2">
            {NAV.map((n) => (
              <Link key={n.label} href={n.href} onClick={() => setOpen(false)} className="py-2 text-sm font-medium text-slate-700">
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

export function LightFooter() {
  const cols = [
    { title: "Invest", links: ["Mutual Funds", "PMS", "Co-Invest", "Portfolio"] },
    { title: "Learn", links: ["Learn to Invest", "Mutual Fund 101", "Real Estate 101", "Glossary"] },
    { title: "Company", links: ["About", "Advisors", "Contact", "Careers"] },
  ];
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/briddhi-logo.png" alt="Briddhi" className="h-7 w-auto" />
            <p className="mt-4 max-w-xs text-sm text-slate-500">
              Institutional-grade investment tools for every investor in Bangladesh. Calm, transparent, and built to last.
            </p>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{col.title}</div>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <span className="cursor-pointer text-sm text-slate-500 hover:text-slate-900">{l}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-slate-200 pt-6 text-xs text-slate-400">
          © {new Date().getFullYear()} Briddhi · Draft design preview · Mutual fund investments are subject to market risk.
        </div>
      </div>
    </footer>
  );
}
