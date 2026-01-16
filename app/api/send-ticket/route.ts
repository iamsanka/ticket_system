// FILE: app/api/send-ticket/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateQr } from "@/lib/generateQr";
import { generateBrandedTicket } from "@/lib/generateTicketImage";
import { sendTicketEmail } from "@/lib/sendTicketEmails";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");

  if (!orderId) {
    return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { event: true, tickets: true },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.ticketSent) {
    return NextResponse.json({ message: "Tickets already sent" });
  }

  const prefix = order.event.title
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .slice(0, 20);

  let counter = 1;

  const ticketsToCreate: {
    orderId: string;
    category: "ADULT" | "CHILD";
    tier: "LOUNGE" | "STANDARD";
    qrCode: string;
    ticketCode: string;
  }[] = [];

  const pushTickets = (
    count: number,
    category: "ADULT" | "CHILD",
    tier: "LOUNGE" | "STANDARD"
  ) => {
    for (let i = 0; i < count; i++) {
      const ticketCode = `${prefix}-${String(counter).padStart(3, "0")}`;
      const qrPayload = `${orderId}-${category}-${tier}-${ticketCode}`;

      ticketsToCreate.push({
        orderId,
        category,
        tier,
        qrCode: qrPayload,
        ticketCode,
      });

      counter++;
    }
  };

  pushTickets(order.adultLounge, "ADULT", "LOUNGE");
  pushTickets(order.adultStandard, "ADULT", "STANDARD");
  pushTickets(order.childLounge, "CHILD", "LOUNGE");
  pushTickets(order.childStandard, "CHILD", "STANDARD");

  await prisma.ticket.createMany({ data: ticketsToCreate });

  await prisma.order.update({
    where: { id: orderId },
    data: { ticketSent: true },
  });

  // ─────────────────────────────────────────────
  // Generate ticket images and send email
  // ─────────────────────────────────────────────

  const ticketImages = [];

  for (const ticket of ticketsToCreate) {
    const qrBuffer = await generateQr(ticket.qrCode);
    const qrBase64 = qrBuffer.toString("base64");

    const ticketImage = await generateBrandedTicket({
      qrPng: qrBase64,
      event: order.event.title,
      name: order.name ?? "Guest",
      date: new Date(order.event.date).toLocaleDateString(),
      venue: order.event.venue,
      category: ticket.category,
      tier: ticket.tier,
      ticketCode: ticket.ticketCode,
    });

    ticketImages.push({
      category: ticket.category,
      tier: ticket.tier,
      code: ticket.ticketCode,
      image: ticketImage,
    });
  }

  await sendTicketEmail({
    to: order.email,
    tickets: ticketImages,
    order,
  });

  return NextResponse.json({ message: "Tickets generated and emailed" });
}
