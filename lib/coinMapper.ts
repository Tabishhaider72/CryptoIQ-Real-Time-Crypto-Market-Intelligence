import { Coin } from "@/types/coin";

export function mapCoinGeckoToCoin(
  coin: any
): Coin {
  return {
    id: coin.id,

    name: coin.name,

    symbol:
      coin.symbol.toUpperCase(),

    pair: "USDT",

    icon:
      coin.image,

    image:
      coin.image,

    price:
      coin.current_price,

    previousPrice:
      coin.current_price -
      (coin.price_change_24h || 0),

    change24h:
      Number(
        (
          coin.price_change_percentage_24h || 0
        ).toFixed(2)
      ),

    volume24h:
      Math.round(
        coin.total_volume || 0
      ),

    marketCap:
      coin.market_cap,

    rank:
      coin.market_cap_rank,

    circulatingSupply:
      coin.circulating_supply,

    lastUpdated:
      coin.last_updated,

    sparkline:
      coin.sparkline_in_7d?.price
        ?.slice(-30) ||
      [
        12,
        15,
        11,
        20,
        17,
        22,
        18,
      ],
  };
}