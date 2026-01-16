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

  // ✅ Use existing tickets created during checkout
  const ticketsToSend = order.tickets;

  const ticketImages: {
    category: string;
    tier: string;
    code: string;
    image: string;
  }[] = [];

  for (const ticket of ticketsToSend) {
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
      ticketCode: ticket.ticketCode ?? "",
    });

    ticketImages.push({
      category: ticket.category,
      tier: ticket.tier,
      code: ticket.ticketCode ?? "",
      image: ticketImage,
    });
  }

  await sendTicketEmail({
    to: order.email,
    tickets: ticketImages,
    order,
  });

  await prisma.order.update({
    where: { id: orderId },
    data: { ticketSent: true },
  });

  return NextResponse.json({ message: "Tickets emailed successfully" });
}
