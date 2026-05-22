import { NextResponse } from "next/server";
import { getLivePrices } from "@/lib/coingecko";

export async function GET() {
  try {
    const data = await getLivePrices();

    return NextResponse.json(data);

  } catch (error: any) {
    console.log("FULL ERROR:", error);

    return NextResponse.json(
      {
        message: error.message,
        response: error?.response?.data,
        stack: error?.stack,
      },
      { status: 500 }
    );
  }
}