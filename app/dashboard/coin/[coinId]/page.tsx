import Image from "next/image";

import CoinDetailsClient
from "@/components/dashboard/CoinDetailsClient";

export const dynamic =
  "force-dynamic";

interface Props {
  params: Promise<{
    coinId: string;
  }>;
}

interface HistoryResponse {
  history: number[];
}

interface CoinResponse {
  name: string;

  symbol: string;

  image: {
    large: string;
  };

  market_data: {
    current_price: {
      usd: number;
    };

    market_cap: {
      usd: number;
    };

    total_volume: {
      usd: number;
    };

    circulating_supply:
      number;

    price_change_percentage_24h:
      number;
  };
}

export default async function CoinPage({
  params,
}: Props) {

  const { coinId } =
    await params;

  let historyData:
    HistoryResponse = {
      history: [],
    };

  let coin:
    CoinResponse | null =
      null;

  try {

    const historyRes =
      await fetch(
        `${
          process.env
            .NEXTAUTH_URL ||

          "http://localhost:3000"
        }/api/prices/history/${coinId}`,
        {
          cache:
            "no-store",
        }
      );

    if (
      historyRes.ok
    ) {

      historyData =
        await historyRes.json();

    }

  } catch (
    err
  ) {

    console.log(
      "history error:",
      err
    );

  }


  try {

    const coinRes =
      await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}?x_cg_demo_api_key=${process.env.COINGECKO_API_KEY}`,
        {
          cache:
            "no-store",
        }
      );

    if (
      coinRes.ok
    ) {

      coin =
        await coinRes.json();

    }

  } catch (
    err
  ) {

    console.log(
      "coin error:",
      err
    );

  }


  if (
    !coin
  ) {

    return (

      <div
        className="
        p-10
        text-red-500
        "
      >

        Unable to load
        coin data

      </div>

    );

  }


  const positive =

    coin.market_data
      .price_change_percentage_24h >=
    0;


  return (

<main
className="
min-h-screen
px-6
py-10
md:px-10
"
>

<div
className="
max-w-6xl
mx-auto
"
>

<div
className="
flex
items-center
gap-4
mb-8
"
>

<div
className="
relative
h-16
w-16
"
>

<Image
src={
coin.image.large
}
alt={
coin.name
}
fill
className="
object-contain
"
/>

</div>


<div>

<h1
className="
text-5xl
font-bold
"
>

{
coin.symbol
.toUpperCase()
}

</h1>

<p
className="
text-muted-foreground
"
>

{
coin.name
}

</p>

</div>

</div>


<div
className="
flex
items-baseline
gap-4
mb-8
"
>

<h2
className="
text-5xl
font-bold
"
>

$

{
coin
.market_data
.current_price
.usd
.toLocaleString()
}

</h2>

<span
className={`
text-2xl
font-semibold
${
positive
? "text-cyan-400"
: "text-pink-400"
}
`}
>

{
positive
? "+"
: ""
}

{
coin.market_data
.price_change_percentage_24h
.toFixed(2)
}
%

</span>

</div>


<CoinDetailsClient
history={
historyData.history
}
marketCap={
coin.market_data
.market_cap.usd
}
volume24h={
coin.market_data
.total_volume.usd
}
circulatingSupply={
coin.market_data
.circulating_supply
}
/>

</div>

</main>

);

}