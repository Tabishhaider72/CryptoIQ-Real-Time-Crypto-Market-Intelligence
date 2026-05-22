"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

import Sparkline from "./Sparkline";
import { Coin } from "@/types/coin";

type CoinRowProps = {
  coin: Coin & {
    trend?: "up" | "down" | "same";
  };
};

export default function CoinRow({
  coin,
}: CoinRowProps) {

  const router =
    useRouter();

  const handleNavigate =
    () => {

      router.push(
        `/dashboard/coin/${coin.id}`
      );

    };

  const positive =
    coin.change24h >= 0;

  return (

<tr
onClick={
handleNavigate
}

className="
border-b
border-border/50
hover:bg-muted/20
cursor-pointer
transition-all
duration-300
"
>

{/* Name */}

<td
className="
py-6
pr-4
"
>

<div
className="
flex
items-center
gap-4
"
>

<div
className="
relative
h-11
w-11
rounded-full
overflow-hidden
bg-black
flex
items-center
justify-center
"
>

<Image
src={
coin.icon
}
alt={
coin.name
}
fill
sizes="44px"
className="
object-cover
p-2
"
/>

</div>

<div>

<div
className="
font-medium
"
>

{coin.symbol}/
{coin.pair}

</div>

<p
className="
text-sm
text-muted-foreground
"
>

{coin.name}

</p>

</div>

</div>

</td>


{/* Price */}

<td
className="
py-6
"
>

<div
className="
flex
items-center
gap-2
font-medium
"
>

<span
className={`
transition-all
duration-500

${
coin.trend==="up"
?"text-green-400 animate-pulse"

:coin.trend==="down"
?"text-red-400 animate-pulse"

:""
}
`}
>

$

{coin.price.toLocaleString(
undefined,
{
minimumFractionDigits:2,
maximumFractionDigits:6,
}
)}

</span>


{coin.trend==="up" && (

<span
className="
text-green-400
animate-bounce
text-sm
"
>

↑

</span>

)}


{coin.trend==="down" && (

<span
className="
text-red-400
animate-bounce
text-sm
"
>

↓

</span>

)}


<span
className="
h-2
w-2
rounded-full
bg-cyan-400
animate-pulse
"
/>

</div>


{coin.previousPrice && (

<p
className="
text-xs
text-muted-foreground
mt-1
"
>

≈$

{coin.previousPrice.toLocaleString(
undefined,
{
minimumFractionDigits:2,
maximumFractionDigits:6,
}
)}

</p>

)}

</td>


{/* Change */}

<td
className={`
py-6
font-medium

${
positive
? "text-cyan-400"
: "text-pink-400"
}
`}
>

{positive ? "+" : ""}

{coin.change24h}%

</td>


{/* Chart */}

<td
className="
py-6
"
>

<Sparkline
data={
coin.sparkline
}
/>

</td>


{/* Volume */}

<td
className="
py-6
text-right
"
>

<div
className="
font-medium
"
>

{
coin.volume24h.toLocaleString()
}

</div>

<p
className="
text-xs
text-muted-foreground
mt-1
"
>

volume

</p>

</td>

</tr>

  );

}