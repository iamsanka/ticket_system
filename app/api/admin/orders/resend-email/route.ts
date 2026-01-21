import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateQr } from "@/lib/generateQr";
import { generateBrandedTicket } from "@/lib/generateTicketImage";
import { sendTicketEmail } from "@/lib/sendTicketEmails";

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

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

    if (!order.tickets || order.tickets.length === 0) {
      return NextResponse.json(
        { error: "No tickets exist for this order" },
        { status: 400 }
      );
    }

    // ----------------------------------------------------
    // Generate ticket images (same logic as send-ticket)
    // ----------------------------------------------------
    const ticketImages: {
      category: string;
      tier: string;
      code: string;
      image: string;
    }[] = [];

    for (const ticket of order.tickets) {
      // Generate QR
      const qrBuffer = await generateQr(ticket.qrCode);
      const qrBase64 = qrBuffer.toString("base64");

      // Generate branded ticket PNG
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

    // ----------------------------------------------------
    // Send email with attachments
    // ----------------------------------------------------
    await sendTicketEmail({
      to: order.email,
      tickets: ticketImages,
      order,
    });

    // ----------------------------------------------------
    // Mark as sent
    // ----------------------------------------------------
    await prisma.order.update({
      where: { id: orderId },
      data: { ticketSent: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Resend email error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
