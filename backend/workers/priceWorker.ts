import "dotenv/config";

import cron from "node-cron";
import { io as socketClient } from "socket.io-client";
import prisma from "@/lib/prisma";
import { getLivePrices } from "@/lib/coingecko";

const emitter = socketClient("http://localhost:4001", {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 2000,
});

emitter.on("connect", () => {
  console.log("worker connected to socket server");
});

emitter.on("connect_error", (err) => {
  console.log("worker socket error:", err.message);
});

cron.schedule("*/10 * * * * *", async () => {
  try {
    console.log("Fetching prices...");

    const prices = await getLivePrices();

    for (const coin of prices) {
      await prisma.coin.upsert({
        where: { id: coin.id },
        update: {},
        create: {
          id: coin.id,
          symbol: coin.symbol,
          name: coin.name,
        },
      });

      await prisma.priceSnapshot.create({
        data: {
          coinId: coin.id,
          price: coin.current_price,
          change24h: coin.price_change_percentage_24h || 0,
          volume24h: coin.total_volume || 0,
          marketCap: coin.market_cap || 0,
        },
      });

      const alerts = await prisma.alert.findMany({
        where: { coinId: coin.id, active: true },
      });

      for (const alert of alerts) {
        const current = coin.current_price;
        const triggered =
          alert.condition === "above"
            ? current > alert.target
            : current < alert.target;

        if (triggered) {
          console.log(`ALERT HIT ${coin.symbol}`);

          await prisma.alert.update({
            where: { id: alert.id },
            data: { active: false },
          });

          await prisma.alertHistory.create({
            data: {
              alertId: alert.id,
              triggeredPrice: current,
            },
          });

          emitter.emit("alert:trigger", {
            coin: coin.symbol.toUpperCase(),
            price: current,
            target: alert.target,
            condition: alert.condition,
          });
        }
      }
    }

    emitter.emit("prices:update", prices);
    console.log("updated prices");

  } catch (err) {
    console.log("WORKER ERROR:", err);
  }
});

console.log("worker started...");