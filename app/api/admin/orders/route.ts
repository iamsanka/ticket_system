import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("eventId");
  const search = searchParams.get("search") || "";

  // eventId is optional: if present → filter, if not → all events
  const where: any = {};

  if (eventId) {
    where.eventId = eventId;
  }

  if (search) {
    where.contactNo = { contains: search, mode: "insensitive" };
  }

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      contactNo: true,
      adultLounge: true,
      adultStandard: true,
      childLounge: true,
      childStandard: true,
      paymentMethod: true,
      serviceFee: true,
      paid: true,
      event: {
        select: {
          id: true,
          title: true,
          date: true,
          venue: true,
          adultLoungePrice: true,
          adultStandardPrice: true,
          childLoungePrice: true,
          childStandardPrice: true,
          createdAt: true,
        },
      },
      tickets: {
        select: {
          id: true,
          category: true, // ADULT / CHILD
          tier: true,     // LOUNGE / STANDARD
          usedAt: true,
        },
      },
    },
  });

  return NextResponse.json({ orders });
}
