import type { Metadata } from "next";
import { PortalProvider } from "./lib/PortalContext";
import Shell from "./components/Shell";

export const metadata: Metadata = {
  title: "Investor Portal — Briddhi",
  description: "Consolidated multi-AMC portfolio dashboard, statements, and notifications.",
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalProvider>
      <Shell>{children}</Shell>
    </PortalProvider>
  );
}
