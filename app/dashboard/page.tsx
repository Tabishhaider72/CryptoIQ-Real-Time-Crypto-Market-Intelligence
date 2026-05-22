"use client";

import { useState } from "react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import MarketFilters from "@/components/dashboard/MarketFilters";
import CryptoTable from "@/components/dashboard/CryptoTable";
import { useAlertListener } from "@/hooks/useAlertListener";

export default function DashboardPage() {

  useAlertListener();

  const [
    filter,
    setFilter,
  ] = useState("All");

  return (
    <DashboardLayout>

      <section
        className="
        space-y-12
      "
      >

        <div
          className="
          flex
          justify-between
          items-start
          flex-wrap
          gap-6
        "
        >

          <h1
            className="
            text-5xl
            md:text-6xl
            font-medium
          "
          >
            Markets
          </h1>

          <MarketFilters
            value={filter}
            onChange={setFilter}
          />

        </div>

        <div
          className="
          border-t
          pt-8
        "
        >
          <CryptoTable
            filter={filter}
          />
        </div>

      </section>

    </DashboardLayout>
  );
}