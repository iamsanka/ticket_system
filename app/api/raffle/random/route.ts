import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const from = searchParams.get("from");
    const to = searchParams.get("to");

    // 1️⃣ Load all past winners (ticket codes)
    const pastWinners = await prisma.randomRaffleResult.findMany();

    const pastWinnerTicketCodes = [
      ...pastWinners.map((w) => w.firstTicket),
      ...pastWinners.map((w) => w.secondTicket),
      ...pastWinners.map((w) => w.thirdTicket),
    ].filter(Boolean);

    // 2️⃣ Convert ticketCodes → orderIds
    const excludedTickets = await prisma.ticket.findMany({
      where: { ticketCode: { in: pastWinnerTicketCodes } },
      select: { orderId: true },
    });

    const excludedOrderIds = excludedTickets.map((t) => t.orderId);

    // 3️⃣ Base filter: exclude past winning orders
    const baseWhere = {
      orderId: { notIn: excludedOrderIds },
    };

    let tickets;

    // 4️⃣ Apply date range if provided
    if (from && to) {
      tickets = await prisma.ticket.findMany({
        where: {
          ...baseWhere,
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
      tickets = await prisma.ticket.findMany({
        where: baseWhere,
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
      return NextResponse.json(
        { error: "No eligible tickets found." },
        { status: 404 }
      );
    }

    // 5️⃣ Group tickets by orderId
    const groups: Record<string, any[]> = {};
    tickets.forEach((t) => {
      if (!groups[t.orderId]) groups[t.orderId] = [];
      groups[t.orderId].push(t);
    });

    const orderGroups = Object.values(groups);

    if (orderGroups.length < 3) {
      return NextResponse.json(
        { error: "Not enough unique eligible orders to pick 3 winners." },
        { status: 400 }
      );
    }

    // 6️⃣ Shuffle order groups
    const shuffled = orderGroups.sort(() => Math.random() - 0.5);

    // 7️⃣ Pick 1 ticket from each of the first 3 groups
    const winners = shuffled.slice(0, 3).map((group: any[]) => {
      return group[Math.floor(Math.random() * group.length)];
    });

    return NextResponse.json({
      tickets,
      winners,
      excludedOrderIds,
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
