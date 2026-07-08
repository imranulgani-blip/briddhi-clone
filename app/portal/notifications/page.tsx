"use client";

import { usePortal } from "../lib/PortalContext";
import { useFetch } from "../lib/useFetch";
import { fmtDate } from "../lib/format";

interface Notif {
  id: number;
  category: string;
  title: string;
  body: string | null;
  channel: string;
  status: string;
  created_at: string;
  read_at: string | null;
}

const CATEGORY_META: Record<string, { label: string; color: string }> = {
  order_placed: { label: "Order", color: "text-sky-700 border-sky-200 bg-sky-50" },
  payment: { label: "Payment", color: "text-emerald-700 border-emerald-200 bg-emerald-50" },
  allotment: { label: "Allotment", color: "text-violet-700 border-violet-200 bg-violet-50" },
  sip: { label: "SIP", color: "text-amber-700 border-amber-200 bg-amber-50 bg-amber-50" },
  redemption: { label: "Redemption", color: "text-rose-700 border-rose-200 bg-rose-50" },
  nudge: { label: "Nudge", color: "text-teal-700 border-teal-200 bg-teal-50" },
};

const CHANNEL_ICON: Record<string, string> = { push: "🔔", email: "✉", sms: "💬" };

export default function NotificationsPage() {
  const { investor } = usePortal();
  const url = investor ? `/api/notifications?investorId=${investor.id}` : null;
  const { data, loading, error, reload } = useFetch<{ notifications: Notif[] }>(url);

  if (!investor) return null;
  const notifs = data?.notifications ?? [];
  const unread = notifs.filter((n) => !n.read_at).length;

  const markAllRead = async () => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAllRead: true, investorId: investor.id }),
    });
    reload();
  };
  const toggleRead = async (n: Notif) => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: n.id, read: !n.read_at ? true : false }),
    });
    reload();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-sm text-slate-500">
            Transactional alerts &amp; nudges. {unread > 0 ? `${unread} unread.` : "All caught up."}
          </p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-800 hover:bg-slate-100">
            Mark all read
          </button>
        )}
      </div>

      {error && <div className="lcard border-amber-200 bg-amber-50 p-6 text-amber-700">{error}</div>}
      {loading && <div className="text-slate-500">Loading…</div>}

      <div className="lcard divide-y divide-slate-100">
        {notifs.map((n) => {
          const meta = CATEGORY_META[n.category] ?? { label: n.category, color: "text-slate-600 border-slate-200" };
          return (
            <button
              key={n.id}
              onClick={() => toggleRead(n)}
              className={`flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-slate-50 ${
                n.read_at ? "opacity-60" : ""
              }`}
            >
              {!n.read_at && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#F5821E]" />}
              {n.read_at && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-transparent" />}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide ${meta.color}`}>
                    {meta.label}
                  </span>
                  <span className="text-xs text-slate-400" title={n.channel}>
                    {CHANNEL_ICON[n.channel] ?? ""} {n.channel}
                  </span>
                  <span className="ml-auto text-xs text-slate-400">{fmtDate(n.created_at)}</span>
                </div>
                <div className="mt-1 text-sm font-medium text-slate-900">{n.title}</div>
                {n.body && <div className="mt-0.5 text-xs text-slate-500">{n.body}</div>}
              </div>
            </button>
          );
        })}
        {!loading && notifs.length === 0 && <div className="px-4 py-8 text-center text-sm text-slate-500">No notifications.</div>}
      </div>
    </div>
  );
}
