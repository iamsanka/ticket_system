import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // ✔ correct import

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const from = searchParams.get("from");
    const to = searchParams.get("to");

    let tickets;

    // ✔ If date range is enabled
    if (from && to) {
      tickets = await prisma.ticket.findMany({
        where: {
          order: {
            createdAt: {
              gte: new Date(from),
              lte: new Date(to),
            },
          },
        },
        include: {
          order: {
            include: {
              event: true,
            },
          },
        },
      });
    } else {
      // ✔ No date range → return all tickets
      tickets = await prisma.ticket.findMany({
        include: {
          order: {
            include: {
              event: true,
            },
          },
        },
      });
    }

    if (!tickets || tickets.length === 0) {
      return NextResponse.json({ error: "No tickets found." }, { status: 404 });
    }

    // ✔ Group tickets by orderId
    const groups: Record<string, any[]> = {};
    tickets.forEach((t: any) => {
      if (!groups[t.orderId]) groups[t.orderId] = [];
      groups[t.orderId].push(t);
    });

    const orderGroups = Object.values(groups);

    if (orderGroups.length < 3) {
      return NextResponse.json(
        { error: "Not enough unique orders to pick 3 winners." },
        { status: 400 }
      );
    }

    // ✔ Shuffle order groups
    const shuffled = orderGroups.sort(() => Math.random() - 0.5);

    // ✔ Pick 1 ticket from each of the first 3 groups
    const winners = shuffled.slice(0, 3).map((group: any[]) => {
      return group[Math.floor(Math.random() * group.length)];
    });

    return NextResponse.json({
      tickets,
      winners,
      count: tickets.length,
      uniqueOrders: orderGroups.length,
      dateRangeUsed: !!(from && to),
    });
  } catch (err) {
    console.error("Random raffle error:", err);
    return NextResponse.json(
      { error: "Server error while generating random winners." },
      { status: 500 }
    );
  }
}
