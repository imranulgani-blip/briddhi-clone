"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/funds", label: "Funds" },
  { href: "/learn", label: "Learn to Invest" },
  { href: "/risk-quiz", label: "Risk quiz" },
  { href: "/glossary", label: "Glossary" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // These routes ship their own light-mode chrome.
  if (["/draft", "/learn", "/funds", "/pms", "/portal"].some((p) => pathname.startsWith(p))) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-ink-700/40 bg-ink-950/70 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-neon-400 to-emerald-600 text-ink-950 font-bold shadow-glow">
            B
          </span>
          <span className="font-semibold tracking-tight">
            Briddhi<span className="text-neon-400">.</span>Studio
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                isActive(item.href)
                  ? "bg-ink-700/60 text-neon-400"
                  : "text-ink-300 hover:text-ink-100 hover:bg-ink-800/60"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/portal"
            className="ml-2 rounded-lg border border-neon-400/50 bg-neon-400/10 px-3.5 py-1.5 text-sm font-semibold text-neon-400 transition-colors hover:bg-neon-400/20"
          >
            Investor Portal
          </Link>
        </nav>

        <button
          className="md:hidden text-ink-300 hover:text-ink-100"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
            ) : (
              <>
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-ink-700/40 bg-ink-950/95">
          <div className="mx-auto max-w-7xl px-4 py-3 flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2 text-sm ${
                  isActive(item.href)
                    ? "bg-ink-700/60 text-neon-400"
                    : "text-ink-300 hover:text-ink-100 hover:bg-ink-800/60"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/portal"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-lg border border-neon-400/50 bg-neon-400/10 px-3 py-2 text-sm font-semibold text-neon-400"
            >
              Investor Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
