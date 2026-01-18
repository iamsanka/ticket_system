import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Order } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { contactNo, ticketCode } = await req.json();

    if (!contactNo && !ticketCode) {
      return NextResponse.json(
        { error: "Provide contactNo or ticketCode" },
        { status: 400 }
      );
    }

    let orders: Order[] = [];

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
      // 1) Find the ticket by ticketCode (not unique in schema)
      const ticket = await prisma.ticket.findFirst({
        where: { ticketCode },
      });

      if (ticket) {
        // 2) Load the related order via orderId
        const order = await prisma.order.findUnique({
          where: { id: ticket.orderId },
          include: {
            tickets: true,
            event: true,
          },
        });

        if (order) {
          orders = [order];
        }
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
