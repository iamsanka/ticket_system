import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { ticketCode } = await req.json();

    // If no ticketCode → load ALL tickets
    if (!ticketCode || ticketCode.trim() === "") {
      const allTickets = await prisma.ticket.findMany({
        include: { order: true },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json({
        ticket: null,
        allTickets,
      });
    }

    // Otherwise search for a specific ticket
    const ticket = await prisma.ticket.findFirst({
      where: { ticketCode },
      include: { order: true },
    });

    const allTickets = await prisma.ticket.findMany({
      include: { order: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      ticket,
      allTickets,
    });
  } catch (error) {
    console.error("Checkin search error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
