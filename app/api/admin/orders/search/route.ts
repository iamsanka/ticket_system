import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { contactNo, ticketCode } = await req.json();

    if (!contactNo && !ticketCode) {
      return NextResponse.json(
        { error: "Provide contactNo or ticketCode" },
        { status: 400 }
      );
    }

    let orders = [];

    if (contactNo) {
      orders = await prisma.order.findMany({
        where: {
          contactNo: {
            contains: contactNo,
            mode: "insensitive",
          },
        },
        include: {
          tickets: true,
          event: true,
        },
        orderBy: { createdAt: "desc" },
      });
    } else if (ticketCode) {
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

      if (ticket?.order) {
        orders = [ticket.order];
      }
    }

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Admin search error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
