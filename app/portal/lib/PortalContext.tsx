"use client";

import { createContext, useContext, useEffect, useState } from "react";

export interface SessionInvestor {
  id: string;
  name: string;
}

interface PortalCtx {
  investor: SessionInvestor | null;
  ready: boolean;
  signIn: (inv: SessionInvestor) => void;
  signOut: () => void;
}

const Ctx = createContext<PortalCtx>({
  investor: null,
  ready: false,
  signIn: () => {},
  signOut: () => {},
});

const KEY = "briddhi.portal.investor";

export function PortalProvider({ children }: { children: React.ReactNode }) {
  const [investor, setInvestor] = useState<SessionInvestor | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setInvestor(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const signIn = (inv: SessionInvestor) => {
    localStorage.setItem(KEY, JSON.stringify(inv));
    setInvestor(inv);
  };
  const signOut = () => {
    localStorage.removeItem(KEY);
    setInvestor(null);
  };

  return <Ctx.Provider value={{ investor, ready, signIn, signOut }}>{children}</Ctx.Provider>;
}

export function usePortal() {
  return useContext(Ctx);
}
