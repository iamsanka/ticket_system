import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateQr } from "@/lib/generateQr";
import { generateBrandedTicket } from "@/lib/generateTicketImage";
import { sendTicketEmail } from "@/lib/sendTicketEmails";
import { randomUUID } from "crypto";

type TicketCreateInput = {
  id: string;
  orderId: string;
  category: "ADULT" | "CHILD";
  tier: "LOUNGE" | "STANDARD";
  ticketCode: string;
  qrCode: string;
};

export async function POST(req: Request) {
  try {
    const { orderId, receiptNote } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "orderId is required" },
        { status: 400 }
      );
    }

    // Load order with event + tickets
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        event: true,
        tickets: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Mark order as paid
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paid: true,
        status: "PAID",
        receiptNote: receiptNote || null,
      },
    });

    // 1. Create tickets if missing (Edenred / ePassi flow)
    if (!order.tickets || order.tickets.length === 0) {
      const ticketsToCreate: TicketCreateInput[] = [];

      const pushTickets = (
        count: number,
        category: "ADULT" | "CHILD",
        tier: "LOUNGE" | "STANDARD"
      ) => {
        for (let i = 0; i < count; i++) {
          const code = `${category[0]}${tier[0]}-${Math.floor(
            100000 + Math.random() * 900000
          )}`;

          ticketsToCreate.push({
            id: randomUUID(),
            orderId: order.id,
            category,
            tier,
            ticketCode: code,
            qrCode: code,
          });
        }
      };

      pushTickets(order.adultLounge, "ADULT", "LOUNGE");
      pushTickets(order.adultStandard, "ADULT", "STANDARD");
      pushTickets(order.childLounge, "CHILD", "LOUNGE");
      pushTickets(order.childStandard, "CHILD", "STANDARD");

      await prisma.ticket.createMany({
        data: ticketsToCreate,
      });

      // Reload tickets
      order.tickets = await prisma.ticket.findMany({
        where: { orderId },
      });
    }

    // 2. Generate branded ticket images
    const ticketImages: {
      category: string;
      tier: string;
      code: string;
      image: string;
    }[] = [];

    for (const ticket of order.tickets) {
      const qrBuffer = await generateQr(ticket.qrCode);
      const qrBase64 = qrBuffer.toString("base64");

      const ticketImage = await generateBrandedTicket({
        qrPng: qrBase64,
        event: order.event.title,
        name: order.name ?? "Guest",
        date: order.event.date.toISOString().split("T")[0],
        venue: order.event.venue,
        category: ticket.category,
        tier: ticket.tier,
        ticketCode: ticket.ticketCode ?? "",
      });

      ticketImages.push({
        category: ticket.category,
        tier: ticket.tier,
        code: ticket.ticketCode ?? "",
        image: ticketImage,
      });
    }

    // 3. Send ticket email
    await sendTicketEmail({
      to: order.email,
      tickets: ticketImages,
      order,
    });

    // 4. Mark as sent
    await prisma.order.update({
      where: { id: orderId },
      data: { ticketSent: true },
    });

    return NextResponse.json({
      ok: true,
      message: "Order marked as paid, tickets generated, and email sent",
    });
  } catch (error) {
    console.error("Mark paid error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
