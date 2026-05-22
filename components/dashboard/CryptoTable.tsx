"use client";

import {
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";

import CoinRow from "./CoinRow";
import CryptoTableSkeleton from "./CryptoTableSkeleton";

import { Coin } from "@/types/coin";
import { mapCoinGeckoToCoin } from "@/lib/coinMapper";
import { useLivePrices } from "@/hooks/useLivePrices";

type Props = {
  filter: string;
};

type CoinWithTrend =
  Coin & {
    trend?:
      | "up"
      | "down"
      | "same";
  };

export default function CryptoTable({
  filter,
}: Props) {

  const [coins, setCoins] = useState<CoinWithTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const previousPrices = useRef<Record<string, number>>({});

  useEffect(() => {
    async function load() {
      try {
        setError("");
        const res = await fetch("/api/prices/live");
        if (!res.ok) throw new Error("Failed loading prices");
        const data: any[] = await res.json();
        const mapped: Coin[] = data.map((coin: any) => mapCoinGeckoToCoin(coin));
        mapped.forEach((coin: Coin) => {
          previousPrices.current[coin.id] = coin.price;
        });
        setCoins(mapped);
      } catch (err) {
        console.log(err);
        setError("Unable to load market data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleLiveUpdate = useCallback((data: any[]) => {
    console.log("LIVE UPDATE RECEIVED:", data.length, "coins");

    const mapped: Coin[] = data.map((coin: any) => mapCoinGeckoToCoin(coin));

    const withTrend: CoinWithTrend[] = mapped.map((coin: Coin): CoinWithTrend => {
      const prev = previousPrices.current[coin.id];

      const trend: "up" | "down" | "same" =
        prev === undefined
          ? "same"
          : coin.price > prev
          ? "up"
          : coin.price < prev
          ? "down"
          : "same";

      previousPrices.current[coin.id] = coin.price;

      return { ...coin, trend };
    });

    setCoins(withTrend);
  }, []);

  useLivePrices(handleLiveUpdate);

  const filteredCoins = coins.filter((coin) => {
    if (filter === "All") return true;
    return coin.symbol === filter || coin.pair === filter;
  });

  if (loading) return <CryptoTableSkeleton />;

  if (error) {
    return (
      <div className="mt-10 rounded-2xl border border-red-500/30 p-6 text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-5 text-xs text-cyan-400">
        <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
        Live WebSocket updates
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="text-xs text-muted-foreground border-b">
            <th className="pb-5 text-left font-normal">Name</th>
            <th className="pb-5 text-left font-normal">Last Price</th>
            <th className="pb-5 text-left font-normal">24h Change</th>
            <th className="pb-5 text-left font-normal">Chart</th>
            <th className="pb-5 text-right font-normal">24h Volume</th>
          </tr>
        </thead>
        <tbody>
          {filteredCoins.map((coin) => (
            <CoinRow key={coin.id} coin={coin} />
          ))}
        </tbody>
      </table>
    </div>
  );
}