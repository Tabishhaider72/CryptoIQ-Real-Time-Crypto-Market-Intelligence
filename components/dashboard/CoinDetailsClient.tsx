"use client";

import { useState } from "react";
import CoinStats from "./CoinStats";
import PriceChart from "../charts/PriceChart";

type Timeframe =
  | "1D"
  | "7D"
  | "1M"
  | "1Y";

export default function CoinDetailsClient({
  history,
  marketCap,
  volume24h,
  circulatingSupply,
}: {
  history: any[];
  marketCap: number;
  volume24h: number;
  circulatingSupply: number;
}) {
  const [
    timeframe,
    setTimeframe,
  ] =
    useState<Timeframe>("1D");

  const chartData =
    history.map(
      (
        item: {
          timestamp: number;
          price: number;
        }
      ) => ({
        time:
          new Date(
            item.timestamp
          ).toLocaleTimeString(
            [],
            {
              hour: "2-digit",
              minute:
                "2-digit",
            }
          ),

        price:
          item.price,
      })
    );

  return (
    <>
      <CoinStats
        marketCap={
          marketCap
        }
        volume24h={
          volume24h
        }
        circulatingSupply={
          circulatingSupply
        }
      />

      <div
        className="
        flex
        gap-3
        mt-10
        mb-6
      "
      >
        {[
          "1D",
          "7D",
          "1M",
          "1Y",
        ].map((tf) => (
          <button
            key={tf}
            onClick={() =>
              setTimeframe(
                tf as Timeframe
              )
            }
            className={`
            px-4
            py-2
            rounded-lg

            ${
              timeframe ===
              tf
                ? "bg-cyan-500 text-black"
                : "bg-muted"
            }
          `}
          >
            {tf}
          </button>
        ))}
      </div>

      <PriceChart
        data={chartData}
        timeframe={
          timeframe
        }
      />
    </>
  );
}