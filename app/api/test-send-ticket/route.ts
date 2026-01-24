import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateQr } from "@/lib/generateQr";
import { generateBrandedTicket } from "@/lib/generateTicketImage";
import { sendTicketEmail } from "@/lib/sendTicketEmails";

export async function GET() {
  // Hardcoded order ID for testing
  const orderId = "cmkqv9ing0015l404ef6lb21g";

  // Load order with event + tickets
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { event: true, tickets: true },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Auto-create missing tickets based on quantities
  if (!order.tickets || order.tickets.length === 0) {
    const ticketsToCreate: any[] = [];

    function pushTickets(
      count: number,
      category: "ADULT" | "CHILD",
      tier: "LOUNGE" | "STANDARD"
    ) {
      for (let i = 0; i < count; i++) {
        ticketsToCreate.push({
          orderId,
          category,
          tier,
          ticketCode: `${category[0]}${tier[0]}-${Math.floor(
            100000 + Math.random() * 900000
          )}`,
          qrCode: `QR-${Math.floor(Math.random() * 1000000)}`,
        });
      }
    }

    pushTickets(order.adultLounge, "ADULT", "LOUNGE");
    pushTickets(order.adultStandard, "ADULT", "STANDARD");
    pushTickets(order.childLounge, "CHILD", "LOUNGE");
    pushTickets(order.childStandard, "CHILD", "STANDARD");

    if (ticketsToCreate.length > 0) {
      await prisma.ticket.createMany({ data: ticketsToCreate });
    }
  }

  // Reload order with newly created tickets
  const updatedOrder = await prisma.order.findUnique({
    where: { id: orderId },
    include: { event: true, tickets: true },
  });

  if (!updatedOrder || updatedOrder.tickets.length === 0) {
    return NextResponse.json(
      { error: "Failed to create tickets" },
      { status: 500 }
    );
  }

  // Generate ticket images
  const ticketImages: {
    category: string;
    tier: string;
    code: string;
    image: string;
  }[] = [];

  for (const ticket of updatedOrder.tickets) {
    const qrBuffer = await generateQr(ticket.qrCode);
    const qrBase64 = qrBuffer.toString("base64");

    const ticketImage = await generateBrandedTicket({
      qrPng: qrBase64,
      event: updatedOrder.event.title,
      name: updatedOrder.name ?? "Guest",
      date: updatedOrder.event.date.toISOString().split("T")[0],
      venue: updatedOrder.event.venue,
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

  // Send the email
  await sendTicketEmail({
    to: updatedOrder.email,
    tickets: ticketImages,
    order: updatedOrder,
  });

  // Mark order as sent
  await prisma.order.update({
    where: { id: orderId },
    data: { ticketSent: true },
  });

  return NextResponse.json({ message: "Test tickets generated + emailed" });
}
