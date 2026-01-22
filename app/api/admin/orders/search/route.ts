import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const {
      contactNo,
      email,
      ticketCode,
      status,
      paid,
      note,
      page = 1,
      pageSize = 10,
    } = await req.json();

    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);

    const where: any = {};

    // TICKET CODE SEARCH (Overrides all other filters)
    if (ticketCode?.trim()) {
      const ticket = await prisma.ticket.findFirst({
        where: { ticketCode: ticketCode.trim() },
      });

      if (ticket) {
        const order = await prisma.order.findUnique({
          where: { id: ticket.orderId },
          include: {
            tickets: true,
            event: true,
          },
        });

        return NextResponse.json({
          orders: order ? [order] : [],
          total: order ? 1 : 0,
          page: 1,
          totalPages: 1,
        });
      }

      return NextResponse.json({
        orders: [],
        total: 0,
        page: 1,
        totalPages: 1,
      });
    }

    // CONTACT NUMBER SEARCH
    if (contactNo?.trim()) {
      where.contactNo = {
        contains: contactNo.trim(),
        mode: "insensitive",
      };
    }

    // EMAIL SEARCH
    if (email?.trim()) {
      where.email = {
        contains: email.trim(),
        mode: "insensitive",
      };
    }

    // STATUS FILTER
    if (status && status !== "ALL") {
      where.status = status;
    }

    // PAID FILTER
    if (paid === "true") {
      where.paid = true;
    } else if (paid === "false") {
      where.paid = false;
    }

    // NOTE SEARCH
    if (note?.trim()) {
      where.receiptNote = {
        contains: note.trim(),
        mode: "insensitive",
      };
    }

    // MAIN ORDER SEARCH
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          tickets: true,
          event: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      orders,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("Admin search error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
