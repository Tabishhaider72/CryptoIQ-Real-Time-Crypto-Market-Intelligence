import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      coinId: string;
    }>;
  }
) {
  try {
    const { coinId } =
      await params;

    const { data } =
      await axios.get(
        `${process.env.COINGECKO_API_URL}/coins/${coinId}/market_chart`,
        {
          params: {
            vs_currency:
              "usd",

            days: 7,

            x_cg_demo_api_key:
              process.env
                .COINGECKO_API_KEY,
          },
        }
      );

    const history =
      data.prices.map(
        (
          item: number[]
        ) => ({
          timestamp:
            item[0],

          price:
            item[1],
        })
      );

    return NextResponse.json({
      coinId,
      history,
    });

  } catch (error) {

    console.log(
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed fetching history",
      },
      {
        status: 500,
      }
    );
  }
}