export type Coin = {
  id: string;

  name: string;

  symbol: string;

  pair: string;

  icon: string;

  image?: string;

  price: number;

  previousPrice?: number;

  change24h: number;

  volume24h: number;

  sparkline: number[];

  marketCap?: number;

  circulatingSupply?: number;

  rank?: number;

  lastUpdated?: string;

  trend?:
    | "up"
    | "down"
    | "same";
};