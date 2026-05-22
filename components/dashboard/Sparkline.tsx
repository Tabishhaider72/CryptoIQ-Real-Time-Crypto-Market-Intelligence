"use client";

import { LineChart, Line } from "recharts";

type SparklineProps = {
  data?: number[];
};

export default function Sparkline({
  data = [12, 18, 10, 22, 17, 28, 20, 32],
}: SparklineProps) {
  const chartData = data.map((value, index) => ({
    index,
    value,
  }));

  return (
    <div className="w-[120px] h-[40px] min-w-[120px]">
      <LineChart
        width={120}
        height={40}
        data={chartData}
        margin={{ top: 2, right: 2, bottom: 2, left: 2 }}
      >
        <Line
          type="monotone"
          dataKey="value"
          stroke="currentColor"
          strokeWidth={1.5}
          dot={false}
          activeDot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </div>
  );
}