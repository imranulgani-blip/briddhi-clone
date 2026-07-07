"use client";

import { useEffect, useState } from "react";
import { usePortal } from "../lib/PortalContext";
import { useFetch } from "../lib/useFetch";

interface Prefs {
  investor_id: string;
  push: boolean;
  sms: boolean;
  email: boolean;
  goal_nudges: boolean;
  sip_reminders: boolean;
  curated_lists: boolean;
}

const CHANNELS: { key: keyof Prefs; label: string; desc: string }[] = [
  { key: "push", label: "Push notifications", desc: "Order, allotment and SIP alerts in-app." },
  { key: "email", label: "Email", desc: "Transactional confirmations and statements." },
  { key: "sms", label: "SMS", desc: "Critical transactional alerts only." },
];
const ENGAGEMENT: { key: keyof Prefs; label: string; desc: string }[] = [
  { key: "goal_nudges", label: "Goal milestones", desc: "Nudge me when I hit a goal milestone." },
  { key: "sip_reminders", label: "SIP reminders", desc: "Remind me before a SIP instalment is due." },
  { key: "curated_lists", label: "New curated lists", desc: "Tell me about new fund lists and ideas." },
];

export default function SettingsPage() {
  const { investor } = usePortal();
  const url = investor ? `/api/notifications/preferences?investorId=${investor.id}` : null;
  const { data, loading, error } = useFetch<{ preferences: Prefs }>(url);
  const [prefs, setPrefs] = useState<Prefs | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data?.preferences) setPrefs(data.preferences);
  }, [data]);

  if (!investor) return null;

  const toggle = async (key: keyof Prefs) => {
    if (!prefs) return;
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
    setSaved(false);
    await fetch("/api/notifications/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ investorId: investor.id, [key]: next[key] }),
    });
    setSaved(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-ink-400">Manage how Briddhi notifies you. {saved && <span className="text-neon-400">Saved ✓</span>}</p>
      </div>

      {error && <div className="surface border-amber-500/40 p-6 text-amber-200">{error}</div>}
      {loading && <div className="text-ink-400">Loading preferences…</div>}

      {prefs && (
        <>
          <Section title="Delivery channels" items={CHANNELS} prefs={prefs} onToggle={toggle} />
          <Section title="Engagement nudges" items={ENGAGEMENT} prefs={prefs} onToggle={toggle} />
        </>
      )}
    </div>
  );
}

function Section({
  title,
  items,
  prefs,
  onToggle,
}: {
  title: string;
  items: { key: keyof Prefs; label: string; desc: string }[];
  prefs: Prefs;
  onToggle: (k: keyof Prefs) => void;
}) {
  return (
    <div className="surface divide-y divide-ink-700/40">
      <div className="px-5 py-3 text-sm font-semibold text-ink-100">{title}</div>
      {items.map((it) => (
        <div key={String(it.key)} className="flex items-center justify-between gap-4 px-5 py-4">
          <div>
            <div className="text-sm font-medium text-ink-100">{it.label}</div>
            <div className="text-xs text-ink-400">{it.desc}</div>
          </div>
          <button
            role="switch"
            aria-checked={Boolean(prefs[it.key])}
            onClick={() => onToggle(it.key)}
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
              prefs[it.key] ? "bg-neon-400" : "bg-ink-600"
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                prefs[it.key] ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      ))}
    </div>
  );
}
