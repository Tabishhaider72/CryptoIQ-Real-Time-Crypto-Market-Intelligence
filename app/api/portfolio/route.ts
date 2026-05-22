import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getLivePrices } from "@/lib/coingecko";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const positions = await prisma.portfolioPosition.findMany({
    where: { userId: user.id },
    include: { coin: true },
    orderBy: { createdAt: "desc" },
  });

  const prices = await getLivePrices();
  const priceMap: Record<string, number> = {};
  prices.forEach((p: any) => { priceMap[p.id] = p.current_price; });

  const enriched = positions.map((pos) => {
    const currentPrice = priceMap[pos.coinId] ?? 0;
    const currentValue = currentPrice * pos.quantity;
    const costBasis = pos.buyPrice * pos.quantity;
    const pnl = currentValue - costBasis;
    const pnlPercent = costBasis > 0 ? (pnl / costBasis) * 100 : 0;

    return {
      id: pos.id,
      coinId: pos.coinId,
      symbol: pos.coin.symbol.toUpperCase(),
      name: pos.coin.name,
      quantity: pos.quantity,
      buyPrice: pos.buyPrice,
      currentPrice,
      currentValue,
      costBasis,
      pnl,
      pnlPercent,
    };
  });

  const totalValue = enriched.reduce((sum, p) => sum + p.currentValue, 0);
  const totalCost = enriched.reduce((sum, p) => sum + p.costBasis, 0);
  const totalPnl = totalValue - totalCost;
  const totalPnlPercent = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0;

  return NextResponse.json({ positions: enriched, totalValue, totalCost, totalPnl, totalPnlPercent });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { coinId, quantity, buyPrice } = await req.json();
  if (!coinId || !quantity || !buyPrice) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // ensure coin exists
  await prisma.coin.upsert({
    where: { id: coinId },
    update: {},
    create: { id: coinId, symbol: coinId, name: coinId },
  });

  const position = await prisma.portfolioPosition.create({
    data: { userId: user.id, coinId, quantity: Number(quantity), buyPrice: Number(buyPrice) },
  });

  return NextResponse.json(position, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();
  await prisma.portfolioPosition.delete({ where: { id } });
  return NextResponse.json({ success: true });
}