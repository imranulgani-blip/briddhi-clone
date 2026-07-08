import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CornerNotes from "./components/CornerNotes";
import "./globals.css";

export const metadata: Metadata = {
  title: "Briddhi Studio — Tools for smarter investing in Bangladesh",
  description:
    "Compare mutual funds, run SIP and lumpsum projections, discover your risk profile, and learn the vocabulary of investing.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen antialiased">
        <CornerNotes />
        <Header />
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
        <Footer />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#0f1626",
              color: "#eef0f6",
              border: "1px solid rgba(60, 73, 112, 0.35)",
            },
          }}
        />
      </body>
    </html>
  );
}
