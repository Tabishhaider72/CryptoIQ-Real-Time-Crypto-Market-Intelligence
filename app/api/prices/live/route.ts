import { NextResponse } from "next/server";
import { getLivePrices } from "@/lib/coingecko";

export async function GET() {
  try {
    const prices =
      await getLivePrices();

    return NextResponse.json(
      prices
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed fetching prices",
      },
      {
        status: 500,
      }
    );
  }
}