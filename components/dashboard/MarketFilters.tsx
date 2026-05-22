"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const filters = [
  "All",
  "BTC",
  "ETH",
  "USD",
  "EUR",
];

type Props = {
  value: string;
  onChange: (
    value: string
  ) => void;
};

export default function MarketFilters({
  value,
  onChange,
}: Props) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: 20,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      className="
      flex
      gap-3
      flex-wrap
      "
    >
      {filters.map(
        (item) => (
          <button
            key={item}
            onClick={() =>
              onChange(item)
            }
            className={cn(
              `
              h-12
              px-8
              rounded-full
              border
              transition
              text-sm
              font-medium
              `,
              value === item
                ? `
                  bg-foreground
                  text-background
                `
                : `
                  hover:bg-muted
                `
            )}
          >
            {item}
          </button>
        )
      )}
    </motion.div>
  );
}