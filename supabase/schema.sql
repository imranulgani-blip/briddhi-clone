-- Briddhi Investor Portal — database schema
-- Run this in the Supabase SQL editor (Dashboard → SQL → New query → Run).
-- Safe to re-run: everything is IF NOT EXISTS / idempotent.
--
-- NOTE: RLS is left permissive for this demo (mock investor-picker login, no Supabase Auth).
-- This is NOT production-safe. For production, enable RLS and add per-investor policies.

-- ---------------------------------------------------------------------------
-- Reference tables
-- ---------------------------------------------------------------------------

create table if not exists investors (
  id            text primary key,               -- e.g. 'BFT001'
  name          text not null,
  phone         text,
  age           int,
  gender        text,
  primary_risk  text,                            -- most-common risk profile across their orders
  source        text,
  created_at    timestamptz not null default now()
);

create table if not exists funds (
  id             serial primary key,
  name           text not null unique,           -- canonical fund name
  amc            text not null,                   -- asset management company
  -- NAV-ready columns: null today (not in source data), populate later to light up
  -- current value / gain-loss / XIRR / units across the whole portal automatically.
  asset_class    text,                            -- equity | debt | cash | commodity (null = N/A)
  sector         text,
  market_segment text,
  current_nav    numeric(18,4),                   -- null = N/A
  nav_date       date
);

-- ---------------------------------------------------------------------------
-- Transactions (the real Excel ledger)
-- ---------------------------------------------------------------------------

create table if not exists transactions (
  id            bigserial primary key,
  investor_id   text not null references investors(id) on delete cascade,
  fund_id       int  not null references funds(id) on delete restrict,
  txn_date      date not null,
  type          text not null,                    -- LUMPSUM | SIP
  amount        numeric(18,2) not null,
  -- NAV-ready: unit price at purchase (null = N/A). units = amount / unit_price.
  -- Populate these + funds.current_nav to light up units/market value/gain/XIRR.
  unit_price    numeric(18,4),
  units         numeric(18,4),
  risk_profile  text,
  source        text,
  -- natural key so re-seeding is idempotent
  ext_key       text unique
);

create index if not exists idx_txn_investor on transactions(investor_id);
create index if not exists idx_txn_fund on transactions(fund_id);
create index if not exists idx_txn_date on transactions(txn_date);

-- ---------------------------------------------------------------------------
-- Goals (FR-DASH-06) — user-created, progress = invested / target
-- ---------------------------------------------------------------------------

create table if not exists goals (
  id            bigserial primary key,
  investor_id   text not null references investors(id) on delete cascade,
  name          text not null,
  target_amount numeric(18,2) not null,
  target_date   date,
  created_at    timestamptz not null default now()
);

create index if not exists idx_goals_investor on goals(investor_id);

-- ---------------------------------------------------------------------------
-- Notifications (FR-NOTIF-01)
-- ---------------------------------------------------------------------------

create table if not exists notifications (
  id            bigserial primary key,
  investor_id   text not null references investors(id) on delete cascade,
  category      text not null,                    -- order_placed | payment | allotment | sip | redemption | nudge
  title         text not null,
  body          text,
  channel       text not null default 'push',     -- push | sms | email
  status        text not null default 'sent',     -- sent | delivered | failed
  created_at    timestamptz not null default now(),
  read_at       timestamptz,
  ext_key       text unique                        -- idempotent re-seed
);

create index if not exists idx_notif_investor on notifications(investor_id);

-- ---------------------------------------------------------------------------
-- Notification preferences (FR-NOTIF-02)
-- ---------------------------------------------------------------------------

create table if not exists notification_preferences (
  investor_id    text primary key references investors(id) on delete cascade,
  push           boolean not null default true,
  sms            boolean not null default true,
  email          boolean not null default true,
  goal_nudges    boolean not null default true,
  sip_reminders  boolean not null default true,
  curated_lists  boolean not null default false,
  updated_at     timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Permissive access for the demo (anon + service role can read/write).
-- Remove/replace with real policies for production.
-- ---------------------------------------------------------------------------

alter table investors                enable row level security;
alter table funds                    enable row level security;
alter table transactions             enable row level security;
alter table goals                    enable row level security;
alter table notifications            enable row level security;
alter table notification_preferences enable row level security;

do $$
declare t text;
begin
  foreach t in array array[
    'investors','funds','transactions','goals','notifications','notification_preferences'
  ]
  loop
    execute format('drop policy if exists "demo_all_%1$s" on %1$s;', t);
    execute format(
      'create policy "demo_all_%1$s" on %1$s for all to anon, authenticated using (true) with check (true);',
      t
    );
  end loop;
end $$;
