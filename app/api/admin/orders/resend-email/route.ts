import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
import { generateQr } from "@/lib/generateQr";
import { generateBrandedTicket } from "@/lib/generateTicketImage";
import { sendTicketEmail } from "@/lib/sendTicketEmails";

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        event: true,
        tickets: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 🔥 EXACT SAME LOGIC AS PAYMENT EMAIL
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

    // Send email with branded ticket images
    await sendTicketEmail({
      to: order.email,
      tickets: ticketImages,
      order,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Resend email error:", err);
    return NextResponse.json({ error: "Failed to resend email" }, { status: 500 });
  }
}
