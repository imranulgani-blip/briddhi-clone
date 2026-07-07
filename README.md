# Briddhi Studio

A dark-mode fintech toolkit for Bangladeshi mutual-fund investors. Static client-side tools **plus** a full-stack Supabase-backed **Investor Portal**.

## What's inside

| Route              | Purpose                                                                                             |
| ------------------ | --------------------------------------------------------------------------------------------------- |
| `/`                | Hero, live-feel market snapshot, top performers, tool grid                                          |
| `/funds`           | Sortable, filterable comparison table for 8 funds (search, Shariah/traditional, risk, fund type)    |
| `/calculator/sip`  | Systematic Investment Plan projector — sliders for monthly amount, years, expected return + chart   |
| `/calculator/lumpsum` | One-time-investment projector — sliders for principal, years, return + compound-growth chart      |
| `/risk-quiz`       | 5-question interactive quiz → Conservative / Balanced / Growth-Seeker profile + matching funds     |
| `/glossary`        | 16-term investing glossary with A–Z jump index, search, and worked examples                         |
| `/portal`          | **Investor Portal** — consolidated multi-AMC dashboard, statements/PDF, notifications (Supabase-backed) |

## Investor Portal (backend + database)

The portal is a real full-stack feature: a **Supabase (Postgres)** database, a **Next.js Route
Handler API** (`app/api/*`), and a **React frontend** (`app/portal/*`). It implements the Investor
Portfolio Dashboard (FR-DASH-01…09), Notifications (FR-NOTIF-01/02) and Statements/Reports
(FR-STMT-01/02).

Data is loaded from the real ledger in `Financial data/investor.ods` (~28 investors, 71 orders, 6
AMCs). The dataset contains only purchase transactions, so **invested-side metrics are exact** and
**NAV-dependent metrics (current value, gain/loss, XIRR, units) show "N/A"** with an explanation. The
schema is **NAV-ready**: populate `funds.current_nav` + per-order `transactions.unit_price` and those
fields light up automatically — no code changes.

### One-time setup

1. Create a free project at [supabase.com](https://supabase.com). From **Project Settings → API**,
   copy the Project URL, `anon` key, and `service_role` key.
2. Copy `.env.local.example` → `.env.local` and fill in:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   ```
3. In the Supabase dashboard, open **SQL Editor**, paste the contents of `supabase/schema.sql`, and
   run it (creates all tables; demo-permissive RLS).
4. Seed the database from the Excel:
   ```bash
   node scripts/seed.mjs
   ```
   It prints a summary (e.g. `BFT001 invested (expect ৳740,380)`).
5. *(Optional)* Populate **indicative** NAVs so current-value / gain / XIRR / market-value fill in
   (otherwise those show "N/A"):
   ```bash
   node scripts/seed-navs.mjs
   ```
   These are demo NAVs, not live market data — clearly labelled as such on the statement.
6. `npm run dev` → open [http://localhost:3000/portal](http://localhost:3000/portal), pick an
   investor (try **BFT001 — Imranul Gani Fira**, 10 funds across 6 AMCs), and explore. The
   **Statements** tab generates an EKUSH-style branded PDF.

> **Security note:** RLS is left permissive for this demo (mock investor-picker login, no auth). Not
> production-safe — a real deployment needs Supabase Auth + per-investor RLS policies.

## Design

- **Dark by default.** Deep-ink background with subtle radial gradients. Neon-green (#4ade80) accent, mono numerics.
- **No CSS framework beyond Tailwind.** Bootstrap, Swiper, and 32 MB of vendor bundles were removed in the redesign.
- **Custom charts.** All charts are hand-rolled SVG — no ApexCharts/Chart.js.
- **Motion.** framer-motion for section entry animations and quiz question transitions.

## Getting started

```bash
cd C:\Repo\briddhi-clone
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or 3001 if 3000 is busy).

## File layout

```
app/
  layout.tsx                        · dark shell + Header/Footer
  globals.css                       · Tailwind + custom surface / range / table styles
  page.tsx                          · Home
  funds/page.tsx                    · Comparison table
  calculator/sip/page.tsx           · SIP calculator
  calculator/lumpsum/page.tsx       · Lumpsum calculator
  risk-quiz/page.tsx                · Interactive quiz
  glossary/page.tsx                 · A–Z glossary
  components/
    Header.tsx  Footer.tsx
    Sparkline.tsx                   · Row/card sparkline (deterministic seed)
    GrowthChart.tsx                 · Multi-series line chart for calculators
    Slider.tsx                      · Labeled range slider
  data/
    funds.ts                        · 8 static funds + bdt/pct helpers
    glossary.ts                     · 16 terms
    quiz.ts                         · 5 questions + classifier
```

## Notes

All figures — fund NAVs, returns, AUMs, ticker snapshots — are static and simulated for demo. No backend is called from anywhere. All state is client-side (`useState` / `useMemo`).

This is not financial advice.
