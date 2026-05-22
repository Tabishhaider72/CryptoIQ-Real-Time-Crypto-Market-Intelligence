import "dotenv/config";

import axios from "axios";
import redis from "./redis";

const baseURL =
  process.env.COINGECKO_API_URL;

if (!baseURL) {
  throw new Error(
    "COINGECKO_API_URL missing"
  );
}

const api =
  axios.create({
    baseURL,

    timeout:
      15000,

    headers: {
      "x-cg-demo-api-key":
        process.env.COINGECKO_API_KEY,
    },
  });

const COINS = [
  "bitcoin",
  "ethereum",
  "solana",
  "ripple",
  "dogecoin",
  "cardano",
  "litecoin",
  "tron",
  "chainlink",
  "avalanche-2",
];

export async function getLivePrices() {
  try {

    console.log(
      "Fetching prices..."
    );

    if (
      redis?.status ===
      "ready"
    ) {

      const cache =
        await redis.get(
          "prices"
        );

      if (cache) {

        console.log(
          "Using Redis cache"
        );

        return JSON.parse(
          cache
        );
      }
    }

    const { data } =
      await api.get(
        "/coins/markets",
        {
          params: {
            vs_currency:
              "usd",

            ids:
              COINS.join(","),

            sparkline:
              true,

            price_change_percentage:
              "24h",
          },
        }
      );

    if (
      redis?.status ===
      "ready"
    ) {

      await redis.set(
        "prices",
        JSON.stringify(
          data
        ),
        "EX",
        10
      );
    }

    console.log(
      "Fetched:",
      data.length,
      "coins"
    );

    return data;

  } catch (
    err: any
  ) {

    console.log(
      "CoinGecko error:",
      err?.message
    );

    if (
      err?.response
    ) {

      console.log(
        "status:",
        err.response.status
      );
    }

    return [];
  }
}