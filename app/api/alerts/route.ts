import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const alerts = await prisma.alert.findMany({
    where: { userId: user.id },
    include: { coin: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(alerts);
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

  const { coinId, condition, target } = await req.json();
  if (!coinId || !condition || !target) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  await prisma.coin.upsert({
    where: { id: coinId },
    update: {},
    create: { id: coinId, symbol: coinId, name: coinId },
  });

  const alert = await prisma.alert.create({
    data: { userId: user.id, coinId, condition, target: Number(target) },
  });

  return NextResponse.json(alert, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();
  await prisma.alert.delete({ where: { id } });
  return NextResponse.json({ success: true });
}