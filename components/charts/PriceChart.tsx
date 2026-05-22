"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type PriceChartProps = {
  data: Array<{
    time: string;
    price: number;
  }>;
  timeframe?: "1D" | "7D" | "1M" | "1Y";
};

export default function PriceChart({
  data,
  timeframe = "1D",
}: PriceChartProps) {
  return (
    <div className="w-full h-80 mt-8">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.1)"
          />
          <XAxis
            dataKey="time"
            stroke="rgba(255,255,255,0.5)"
            style={{
              fontSize: "0.75rem",
            }}
          />
          <YAxis
            stroke="rgba(255,255,255,0.5)"
            style={{
              fontSize: "0.75rem",
            }}
            tickFormatter={(value) =>
              `$${value.toLocaleString()}`
            }
          />
          <Tooltip
            contentStyle={{
              backgroundColor:
                "rgba(0,0,0,0.8)",
              border:
                "1px solid rgba(255,255,255,0.2)",
              borderRadius: "8px",
              color: "#fff",
            }}
            formatter={(value) => [
              `$${typeof value === "number" ? value.toLocaleString() : value}`,
              "Price",
            ]}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#00d9ff"
            strokeWidth={2}
            dot={false}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
