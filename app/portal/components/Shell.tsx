"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { usePortal } from "../lib/PortalContext";
import { PORTAL_DEMO, DEMO_DEFAULT_INVESTOR } from "../lib/demo";

const NAV = [
  { href: "/portal/dashboard", label: "Dashboard", icon: "grid" },
  { href: "/portal/allocation", label: "Wealth Universe", icon: "pie" },
  { href: "/portal/statements", label: "Statements", icon: "doc" },
  { href: "/portal/notifications", label: "Notifications", icon: "bell" },
  { href: "/portal/settings", label: "Settings", icon: "gear" },
];

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { investor, ready, signIn, signOut } = usePortal();

  const isLogin = pathname === "/portal/login";

  useEffect(() => {
    if (!ready || investor || isLogin) return;
    // Demo mode: skip the login gate and auto-sign-in a default investor so every
    // portal screen is reachable without logging in. Otherwise, require sign-in.
    if (PORTAL_DEMO) signIn(DEMO_DEFAULT_INVESTOR);
    else router.replace("/portal/login");
  }, [ready, investor, isLogin, router, signIn]);

  if (!ready) {
    return <div className="grid min-h-[60vh] place-items-center text-slate-500">Loading…</div>;
  }
  if (isLogin) return <>{children}</>;
  if (!investor) return null;

  return (
    <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Sidebar */}
      <aside className="no-print sticky top-20 hidden h-fit w-56 shrink-0 md:block">
        <div className="lcard p-2">
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    active ? "bg-orange-50 text-[#F5821E]" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <NavIcon name={item.icon} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="lcard mt-3 p-4">
          <div className="text-xs text-slate-500">Signed in as</div>
          <div className="mt-1 truncate font-semibold text-slate-900">{investor.name}</div>
          <div className="mono text-xs text-slate-400">{investor.id}</div>
          <button
            onClick={() => {
              signOut();
              router.replace("/portal/login");
            }}
            className="mt-3 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 hover:bg-slate-100"
          >
            Switch investor
          </button>
        </div>
      </aside>

      {/* Mobile top nav */}
      <div className="no-print fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur md:hidden">
        <div className="flex justify-around">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] ${
                  active ? "text-[#F5821E]" : "text-slate-500"
                }`}
              >
                <NavIcon name={item.icon} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      <main className="min-w-0 flex-1 pb-20 md:pb-0">{children}</main>
    </div>
  );
}

function NavIcon({ name }: { name: string }) {
  const c = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "grid":
      return (
        <svg {...c}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case "doc":
      return (
        <svg {...c}>
          <path d="M7 3h7l5 5v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z" />
          <path d="M14 3v5h5" />
        </svg>
      );
    case "pie":
      return (
        <svg {...c}>
          <path d="M21 15.5A9 9 0 118.5 3v9H21z" />
          <path d="M21 12a9 9 0 00-9-9v9z" />
        </svg>
      );
    case "bell":
      return (
        <svg {...c}>
          <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.7 21a2 2 0 01-3.4 0" />
        </svg>
      );
    case "gear":
      return (
        <svg {...c}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.6 1.6 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.6 1.6 0 00-2.7.7 1.6 1.6 0 01-3.2 0 1.6 1.6 0 00-2.7-.7l-.1.1a2 2 0 11-2.8-2.8l.1-.1A1.6 1.6 0 004.6 15a1.6 1.6 0 01-1.4-1.6v-.2A1.6 1.6 0 014.6 11a1.6 1.6 0 00.7-2.7l-.1-.1a2 2 0 112.8-2.8l.1.1a1.6 1.6 0 002.7-.7A1.6 1.6 0 0112 3a1.6 1.6 0 011.6 1.4 1.6 1.6 0 002.7.7l.1-.1a2 2 0 112.8 2.8l-.1.1a1.6 1.6 0 00.7 2.7 1.6 1.6 0 011.4 1.6v.2a1.6 1.6 0 01-1.4 1.6z" />
        </svg>
      );
    default:
      return null;
  }
}
