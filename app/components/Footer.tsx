"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const COLUMNS = [
  {
    title: "Tools",
    links: [
      { href: "/funds", label: "Compare funds" },
      { href: "/risk-quiz", label: "Risk profile quiz" },
      { href: "/glossary", label: "Investing glossary" },
      { href: "/portal", label: "Investor Portal" },
    ],
  },
  {
    title: "Learn",
    links: [
      { href: "/learn", label: "Learn to invest" },
      { href: "/learn", label: "Mutual Fund 101" },
      { href: "/learn", label: "Real Estate 101" },
      { href: "/funds", label: "Shariah-compliant funds" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/", label: "About Briddhi" },
      { href: "mailto:info@briddhi.net", label: "Contact" },
      { href: "/", label: "Privacy" },
      { href: "/", label: "Terms" },
    ],
  },
];

export default function Footer() {
  const pathname = usePathname();
  if (["/draft", "/learn", "/funds", "/pms"].some((p) => pathname.startsWith(p))) return null;
  return (
    <footer className="mt-16 border-t border-ink-700/40 bg-ink-950/60">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-neon-400 to-emerald-600 text-sm font-bold text-ink-950 shadow-glow">
                B
              </span>
              <span className="font-semibold tracking-tight">
                Briddhi<span className="text-neon-400">.</span>Studio
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-400">
              An independent research and education toolkit for Bangladeshi mutual-fund investors.
              Free, private, and unbiased.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-ink-500">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-ink-700/60 bg-ink-800/60 px-2.5 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-neon-400" />
                No account · runs in your browser
              </span>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <div className="text-xs font-semibold uppercase tracking-wider text-ink-300">{col.title}</div>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-ink-400 transition-colors hover:text-neon-400">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-xl border border-ink-700/40 bg-ink-900/40 p-4 text-xs leading-relaxed text-ink-500">
          <strong className="text-ink-400">Disclaimer:</strong> Briddhi Studio is not a broker, adviser,
          or distributor and does not sell financial products. All fund data shown is static and
          simulated for demonstration only. Mutual fund investments are subject to market risk; past
          performance does not guarantee future results. This is not investment advice — please do
          your own research or consult a licensed adviser.
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-ink-700/40 pt-6 text-sm text-ink-400 md:flex-row">
          <span>© {new Date().getFullYear()} Briddhi Studio · Tools for smarter investing</span>
          <a href="mailto:info@briddhi.net" className="hover:text-ink-200">
            info@briddhi.net
          </a>
        </div>
      </div>
    </footer>
  );
}
