"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";

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

type Position = {
  id: string;
  coinId: string;
  symbol: string;
  name: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
  currentValue: number;
  costBasis: number;
  pnl: number;
  pnlPercent: number;
};

type Portfolio = {
  positions: Position[];
  totalValue: number;
  totalCost: number;
  totalPnl: number;
  totalPnlPercent: number;
};

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [coinId, setCoinId] = useState("bitcoin");
  const [quantity, setQuantity] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function loadPortfolio() {
    const res = await fetch("/api/portfolio");
    if (res.ok) {
      const data = await res.json();
      setPortfolio(data);
    }
    setLoading(false);
  }

  useEffect(() => { loadPortfolio(); }, []);

  async function handleAdd() {
    if (!quantity || !buyPrice) return;
    setSubmitting(true);
    await fetch("/api/portfolio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coinId, quantity: Number(quantity), buyPrice: Number(buyPrice) }),
    });
    setQuantity("");
    setBuyPrice("");
    await loadPortfolio();
    setSubmitting(false);
  }

  async function handleDelete(id: string) {
    await fetch("/api/portfolio", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await loadPortfolio();
  }

  const totalPnlPositive = (portfolio?.totalPnl ?? 0) >= 0;

  return (
    <DashboardLayout>
      <section className="space-y-10">
        <h1 className="text-5xl md:text-6xl font-medium">Portfolio</h1>

        {/* Summary Cards */}
        {portfolio && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Value", value: `$${portfolio.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
              { label: "Total Cost", value: `$${portfolio.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
              { label: "Total P&L", value: `${totalPnlPositive ? "+" : ""}$${portfolio.totalPnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, color: totalPnlPositive ? "text-cyan-400" : "text-pink-400" },
              { label: "Return", value: `${totalPnlPositive ? "+" : ""}${portfolio.totalPnlPercent.toFixed(2)}%`, color: totalPnlPositive ? "text-cyan-400" : "text-pink-400" },
            ].map((card) => (
              <div key={card.label} className="rounded-2xl border border-border p-5">
                <p className="text-xs text-muted-foreground mb-2">{card.label}</p>
                <p className={`text-2xl font-semibold ${card.color ?? ""}`}>{card.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Add Position */}
        <div className="rounded-2xl border border-border p-6 space-y-4">
          <h2 className="text-lg font-medium">Add Position</h2>
          <div className="flex flex-wrap gap-3">
            <select
              value={coinId}
              onChange={(e) => setCoinId(e.target.value)}
              className="h-11 rounded-xl border border-border bg-background px-4 text-sm outline-none"
            >
              {COINS.map((c) => (
                <option key={c.id} value={c.id}>{c.symbol}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="h-11 rounded-xl border border-border bg-background px-4 text-sm outline-none w-36"
            />
            <input
              type="number"
              placeholder="Buy Price (USD)"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              className="h-11 rounded-xl border border-border bg-background px-4 text-sm outline-none w-44"
            />
            <button
              onClick={handleAdd}
              disabled={submitting}
              className="h-11 px-6 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              {submitting ? "Adding..." : "Add"}
            </button>
          </div>
        </div>

        {/* Positions Table */}
        <div className="border-t pt-8">
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : !portfolio?.positions.length ? (
            <p className="text-muted-foreground">No positions yet. Add your first one above.</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-xs text-muted-foreground border-b">
                  <th className="pb-4 text-left font-normal">Coin</th>
                  <th className="pb-4 text-right font-normal">Qty</th>
                  <th className="pb-4 text-right font-normal">Buy Price</th>
                  <th className="pb-4 text-right font-normal">Current</th>
                  <th className="pb-4 text-right font-normal">Value</th>
                  <th className="pb-4 text-right font-normal">P&L</th>
                  <th className="pb-4 text-right font-normal">Return</th>
                  <th className="pb-4 text-right font-normal"></th>
                </tr>
              </thead>
              <tbody>
                {portfolio.positions.map((pos) => {
                  const positive = pos.pnl >= 0;
                  return (
                    <tr key={pos.id} className="border-b border-border/50 text-sm">
                      <td className="py-5">
                        <div className="font-medium">{pos.symbol}/USDT</div>
                        <div className="text-xs text-muted-foreground">{pos.name}</div>
                      </td>
                      <td className="py-5 text-right">{pos.quantity}</td>
                      <td className="py-5 text-right">${pos.buyPrice.toLocaleString()}</td>
                      <td className="py-5 text-right">${pos.currentPrice.toLocaleString()}</td>
                      <td className="py-5 text-right">${pos.currentValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                      <td className={`py-5 text-right font-medium ${positive ? "text-cyan-400" : "text-pink-400"}`}>
                        {positive ? "+" : ""}${pos.pnl.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </td>
                      <td className={`py-5 text-right font-medium ${positive ? "text-cyan-400" : "text-pink-400"}`}>
                        {positive ? "+" : ""}{pos.pnlPercent.toFixed(2)}%
                      </td>
                      <td className="py-5 text-right">
                        <button
                          onClick={() => handleDelete(pos.id)}
                          className="text-xs text-muted-foreground hover:text-pink-400 transition"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </DashboardLayout>
  );
}