type CoinStatsProps = {
  marketCap?: number;
  volume24h?: number;
  circulatingSupply?: number;
};

export default function CoinStats({
  marketCap = 0,
  volume24h = 0,
  circulatingSupply = 0,
}: CoinStatsProps) {
  const formatNumber = (
    value: number
  ) => {
    return value.toLocaleString(
      "en-US",
      {
        maximumFractionDigits: 0,
      }
    );
  };

  return (
    <div
      className="
      grid
      grid-cols-1
      md:grid-cols-3
      gap-6
      mt-10
      "
    >
      <div
        className="
        border
        border-border/50
        rounded-2xl
        p-6
        "
      >
        <p
          className="
          text-sm
          text-muted-foreground
          mb-2
          "
        >
          Market Cap
        </p>

        <h3
          className="
          text-2xl
          font-bold
          "
        >
          $
          {formatNumber(
            marketCap
          )}
        </h3>
      </div>

      <div
        className="
        border
        border-border/50
        rounded-2xl
        p-6
        "
      >
        <p
          className="
          text-sm
          text-muted-foreground
          mb-2
          "
        >
          24h Volume
        </p>

        <h3
          className="
          text-2xl
          font-bold
          "
        >
          $
          {formatNumber(
            volume24h
          )}
        </h3>
      </div>

      <div
        className="
        border
        border-border/50
        rounded-2xl
        p-6
        "
      >
        <p
          className="
          text-sm
          text-muted-foreground
          mb-2
          "
        >
          Circulating Supply
        </p>

        <h3
          className="
          text-2xl
          font-bold
          "
        >
          {formatNumber(
            circulatingSupply
          )}
        </h3>
      </div>
    </div>
  );
}