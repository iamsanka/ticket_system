"use server";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateTicketQR } from "@/lib/generateQr";
import { generateBrandedTicket } from "@/lib/generateTicketImage";
import { sendTicketEmail } from "@/lib/sendTicketEmail";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { event: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.ticketUrl === "sent") {
      return NextResponse.json({ message: "Ticket already sent" });
    }

    // Generate QR code (JSON only)
    const qr = await generateTicketQR({
      orderId: order.id,
    });

    // Generate branded ticket PNG
    const ticketImage = await generateBrandedTicket({
      qrPng: qr,
      event: order.event.title,
      name: order.name ?? "",
      people: (order.adultQuantity ?? 0) + (order.childQuantity ?? 0),
      date: order.event.date.toDateString(),
      venue: order.event.venue,
    });

    // Send email with branded ticket
    await sendTicketEmail({
      to: order.email,
      name: order.name ?? "",
      ticketPng: ticketImage,
      eventTitle: order.event.title,
    });

    // Mark as sent
    await prisma.order.update({
      where: { id: order.id },
      data: { ticketUrl: "sent" },
    });

    return NextResponse.json({ message: "Ticket sent successfully" });
  } catch (error) {
    console.error("SEND-TICKET ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
