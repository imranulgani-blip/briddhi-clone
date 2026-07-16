import type { Metadata } from "next";
import { PortalProvider } from "./lib/PortalContext";
import Shell from "./components/Shell";
import { LightHeader } from "../components/LightChrome";

export const metadata: Metadata = {
  title: "Investor Portal — Briddhi",
  description: "Consolidated multi-AMC portfolio dashboard, statements, and notifications.",
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F7F8FB] text-slate-900" style={{ colorScheme: "light" }}>
      <PortalProvider>
        <LightHeader />
        <Shell>{children}</Shell>
      </PortalProvider>
    </div>
  );
}
