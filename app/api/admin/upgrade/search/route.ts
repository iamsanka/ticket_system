import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ticketCode = searchParams.get("ticketCode");

  if (!ticketCode) {
    return NextResponse.json({ error: "Missing ticketCode" }, { status: 400 });
  }

  const ticket = await prisma.ticket.findUnique({
    where: { ticketCode },
    include: {
      order: {
        include: {
          tickets: true,
          event: true,
        },
      },
    },
  });

  if (!ticket) {
    return NextResponse.json({ order: null });
  }

  return NextResponse.json({ order: ticket.order });
}
