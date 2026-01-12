import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("eventId");
  const search = searchParams.get("search") || "";

  if (!eventId) {
    return NextResponse.json(
      { error: "Missing eventId" },
      { status: 400 }
    );
  }

  const orders = await prisma.order.findMany({
    where: {
      eventId,
      contactNo: search
        ? { contains: search, mode: "insensitive" }
        : undefined,
    },
    orderBy: { createdAt: "asc" },

    // Only return fields the UI actually uses
    select: {
      id: true,
      name: true,
      email: true,
      contactNo: true,
      adultQuantity: true,
      childQuantity: true,
      usedAt: true,
    },
  });

  return NextResponse.json({ orders });
}
