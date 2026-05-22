"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

type CoinStats = {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  total_volume: number;
  market_cap: number;
  sparkline_in_7d?: { price: number[] };
};

function calcVolatility(prices: number[]): number {
  if (!prices || prices.length < 2) return 0;
  const returns = prices.slice(1).map((p, i) => Math.log(p / prices[i]));
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
  return parseFloat((Math.sqrt(variance) * 100).toFixed(4));
}

function calcCorrelation(a: number[], b: number[]): number {
  const n = Math.min(a.length, b.length);
  if (n < 2) return 0;
  const ax = a.slice(0, n);
  const bx = b.slice(0, n);
  const meanA = ax.reduce((s, v) => s + v, 0) / n;
  const meanB = bx.reduce((s, v) => s + v, 0) / n;
  const num = ax.reduce((s, v, i) => s + (v - meanA) * (bx[i] - meanB), 0);
  const denA = Math.sqrt(ax.reduce((s, v) => s + Math.pow(v - meanA, 2), 0));
  const denB = Math.sqrt(bx.reduce((s, v) => s + Math.pow(v - meanB, 2), 0));
  return denA * denB === 0 ? 0 : parseFloat((num / (denA * denB)).toFixed(2));
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-background px-4 py-3 shadow-lg">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-sm font-semibold text-foreground">{payload[0].value}%</p>
    </div>
  );
};

export default function AnalyticsPage() {
  const [coins, setCoins] = useState<CoinStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/prices/live");
        if (res.ok) setCoins(await res.json());
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const volatilityData = coins
    .map((c) => ({
      symbol: c.symbol.toUpperCase(),
      volatility: calcVolatility(c.sparkline_in_7d?.price ?? []),
    }))
    .sort((a, b) => b.volatility - a.volatility);

  const topMovers = [...coins]
    .sort((a, b) => Math.abs(b.price_change_percentage_24h) - Math.abs(a.price_change_percentage_24h))
    .slice(0, 5);

  const top5 = coins.slice(0, 5);
  const correlationMatrix = top5.map((a) =>
    top5.map((b) =>
      calcCorrelation(a.sparkline_in_7d?.price ?? [], b.sparkline_in_7d?.price ?? [])
    )
  );

  const totalMarketCap = coins.reduce((s, c) => s + c.market_cap, 0);
  const avgChange = coins.reduce((s, c) => s + c.price_change_percentage_24h, 0) / (coins.length || 1);
  const avgPositive = avgChange >= 0;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="h-4 w-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
          Loading analytics...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <section className="space-y-14">

        {/* Header */}
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
            Market Intelligence
          </p>
          <h1 className="text-5xl md:text-6xl font-medium">Analytics</h1>
        </div>

        {/* Market Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-border p-6">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
              Total Market Cap
            </p>
            <p className="text-3xl font-semibold tracking-tight">
              ${(totalMarketCap / 1e9).toFixed(2)}
              <span className="text-lg text-muted-foreground ml-1">B</span>
            </p>
          </div>
          <div className="rounded-2xl border border-border p-6">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
              Coins Tracked
            </p>
            <p className="text-3xl font-semibold tracking-tight">
              {coins.length}
              <span className="text-lg text-muted-foreground ml-2">assets</span>
            </p>
          </div>
          <div className="rounded-2xl border border-border p-6">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
              Avg 24h Change
            </p>
            <p className={`text-3xl font-semibold tracking-tight ${avgPositive ? "text-cyan-400" : "text-pink-400"}`}>
              {avgPositive ? "+" : ""}{avgChange.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Volatility Chart */}
        <div className="rounded-2xl border border-border p-6 md:p-8">
          <div className="mb-8">
            <h2 className="text-xl font-medium">7-Day Volatility</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Standard deviation of log returns — higher = more volatile
            </p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={volatilityData} barSize={36} barCategoryGap="30%">
              <XAxis
                dataKey="symbol"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
                width={40}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Bar dataKey="volatility" radius={[8, 8, 0, 0]}>
                {volatilityData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={i === 0 ? "#f472b6" : i === 1 ? "#fb923c" : "#22d3ee"}
                    opacity={i > 1 ? 0.85 - i * 0.04 : 1}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Movers */}
        <div className="rounded-2xl border border-border p-6 md:p-8">
          <div className="mb-8">
            <h2 className="text-xl font-medium">Top Movers</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Largest price movements in the last 24 hours
            </p>
          </div>
          <div className="space-y-5">
            {topMovers.map((coin, idx) => {
              const positive = coin.price_change_percentage_24h >= 0;
              const pct = coin.price_change_percentage_24h;
              const absMax = Math.abs(topMovers[0].price_change_percentage_24h);
              const width = `${Math.abs((pct / absMax) * 100)}%`;
              return (
                <div key={coin.id} className="flex items-center gap-5">
                  <span className="text-xs text-muted-foreground w-5 text-right">
                    {idx + 1}
                  </span>
                  <span className="w-14 text-sm font-medium">
                    {coin.symbol.toUpperCase()}
                  </span>
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        positive ? "bg-cyan-400" : "bg-pink-400"
                      }`}
                      style={{ width }}
                    />
                  </div>
                  <span className={`w-16 text-right text-sm font-semibold tabular-nums ${
                    positive ? "text-cyan-400" : "text-pink-400"
                  }`}>
                    {positive ? "+" : ""}{pct.toFixed(2)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Correlation Heatmap */}
        <div className="rounded-2xl border border-border p-6 md:p-8">
          <div className="mb-8">
            <h2 className="text-xl font-medium">Correlation Heatmap</h2>
            <p className="text-sm text-muted-foreground mt-1">
              7-day price correlation between top 5 coins.{" "}
              <span className="text-cyan-400">Cyan = positive</span>,{" "}
              <span className="text-pink-400">pink = inverse</span>
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="text-xs w-full">
              <thead>
                <tr>
                  <th className="w-16 pb-4" />
                  {top5.map((c) => (
                    <th key={c.id} className="pb-4 px-2 font-medium text-muted-foreground text-center">
                      {c.symbol.toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="space-y-2">
                {top5.map((rowCoin, i) => (
                  <tr key={rowCoin.id}>
                    <td className="pr-4 py-1.5 font-medium text-muted-foreground text-right text-xs">
                      {rowCoin.symbol.toUpperCase()}
                    </td>
                    {correlationMatrix[i].map((val, j) => {
                      const intensity = Math.abs(val);
                      return (
                        <td key={j} className="px-1.5 py-1.5 text-center">
                          <div
                            className="w-16 h-10 rounded-xl flex items-center justify-center text-xs font-semibold tabular-nums mx-auto"
                            style={{
                              backgroundColor:
                                i === j
                                  ? "hsl(var(--border))"
                                  : val > 0
                                  ? `rgba(34,211,238,${intensity * 0.65})`
                                  : `rgba(244,114,182,${intensity * 0.65})`,
                              color: intensity > 0.5 || i === j ? "inherit" : "hsl(var(--muted-foreground))",
                            }}
                          >
                            {val.toFixed(2)}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </section>
    </DashboardLayout>
  );
}