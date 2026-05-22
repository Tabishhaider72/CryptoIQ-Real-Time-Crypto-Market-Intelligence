"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAlertListener } from "@/hooks/useAlertListener";

const COINS = [
  { id: "bitcoin", symbol: "BTC" },
  { id: "ethereum", symbol: "ETH" },
  { id: "solana", symbol: "SOL" },
  { id: "ripple", symbol: "XRP" },
  { id: "dogecoin", symbol: "DOGE" },
  { id: "cardano", symbol: "ADA" },
  { id: "litecoin", symbol: "LTC" },
  { id: "tron", symbol: "TRX" },
  { id: "chainlink", symbol: "LINK" },
  { id: "avalanche-2", symbol: "AVAX" },
];

type Alert = {
  id: string;
  coinId: string;
  condition: string;
  target: number;
  active: boolean;
  createdAt: string;
  coin: { symbol: string; name: string };
};

export default function AlertsPage() {
  useAlertListener();

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [coinId, setCoinId] = useState("bitcoin");
  const [condition, setCondition] = useState("above");
  const [target, setTarget] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "triggered">("all");

  async function loadAlerts() {
    const res = await fetch("/api/alerts");
    if (res.ok) setAlerts(await res.json());
    setLoading(false);
  }

  useEffect(() => { loadAlerts(); }, []);

  async function handleCreate() {
    if (!target) return;
    setSubmitting(true);
    await fetch("/api/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coinId, condition, target: Number(target) }),
    });
    setTarget("");
    await loadAlerts();
    setSubmitting(false);
  }

  async function handleDelete(id: string) {
    await fetch("/api/alerts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await loadAlerts();
  }

  const filtered = alerts.filter((a) => {
    if (filter === "active") return a.active;
    if (filter === "triggered") return !a.active;
    return true;
  });

  const activeCount = alerts.filter((a) => a.active).length;
  const triggeredCount = alerts.filter((a) => !a.active).length;

  return (
    <DashboardLayout>
      <section className="space-y-14">

        {/* Header */}
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
            Notifications
          </p>
          <h1 className="text-5xl md:text-6xl font-medium">Price Alerts</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Alerts", value: alerts.length },
            { label: "Active", value: activeCount, color: "text-cyan-400" },
            { label: "Triggered", value: triggeredCount, color: "text-pink-400" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-border p-5">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                {s.label}
              </p>
              <p className={`text-3xl font-semibold tracking-tight ${s.color ?? ""}`}>
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Create Alert */}
        <div className="rounded-2xl border border-border p-6 md:p-8">
          <h2 className="text-xl font-medium mb-2">Create Alert</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Get notified instantly when a coin crosses your target price.
          </p>
          <div className="flex flex-wrap gap-3">
            <select
              value={coinId}
              onChange={(e) => setCoinId(e.target.value)}
              className="h-11 rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-cyan-400 transition"
            >
              {COINS.map((c) => (
                <option key={c.id} value={c.id}>{c.symbol}</option>
              ))}
            </select>

            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="h-11 rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-cyan-400 transition"
            >
              <option value="above">Above</option>
              <option value="below">Below</option>
            </select>

            <input
              type="number"
              placeholder="Target price (USD)"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="h-11 rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-cyan-400 transition w-48"
            />

            <button
              onClick={handleCreate}
              disabled={submitting || !target}
              className="h-11 px-6 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90 transition disabled:opacity-40"
            >
              {submitting ? "Creating..." : "Set Alert"}
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          {(["all", "active", "triggered"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-medium capitalize transition ${
                filter === f
                  ? "bg-foreground text-background"
                  : "border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Alerts List */}
        {loading ? (
          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="h-4 w-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
            Loading alerts...
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-border p-10 text-center">
            <p className="text-muted-foreground text-sm">
              {filter === "all"
                ? "No alerts yet. Create your first one above."
                : `No ${filter} alerts.`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((alert) => {
              const positive = alert.condition === "above";
              return (
                <div
                  key={alert.id}
                  className="flex items-center justify-between rounded-2xl border border-border px-6 py-5 hover:bg-muted/10 transition"
                >
                  <div className="flex items-center gap-6">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        alert.active ? "bg-cyan-400 animate-pulse" : "bg-muted-foreground"
                      }`}
                    />
                    <div>
                      <p className="font-medium text-sm">
                        {alert.coin.symbol.toUpperCase()}/USDT
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {alert.coin.name}
                      </p>
                    </div>
                    <div className={`text-sm font-medium px-3 py-1 rounded-full text-xs ${
                      positive
                        ? "bg-cyan-400/10 text-cyan-400"
                        : "bg-pink-400/10 text-pink-400"
                    }`}>
                      {alert.condition} ${alert.target.toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                      alert.active
                        ? "bg-cyan-400/10 text-cyan-400"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {alert.active ? "Active" : "Triggered"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(alert.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleDelete(alert.id)}
                      className="text-xs text-muted-foreground hover:text-pink-400 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}