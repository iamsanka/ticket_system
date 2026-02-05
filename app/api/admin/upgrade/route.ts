import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendTicketEmail } from "@/lib/sendTicketEmails";
import { generateQr } from "@/lib/generateQr";
import { generateBrandedTicket } from "@/lib/generateTicketImage";

// ⭐ Generate ticket codes in the SAME format as your normal purchase flow
function generateTicketCode(
  category: "ADULT" | "CHILD",
  tier: "LOUNGE" | "STANDARD"
) {
  const prefix =
    category === "ADULT" && tier === "STANDARD"
      ? "AS"
      : category === "ADULT" && tier === "LOUNGE"
      ? "AL"
      : category === "CHILD" && tier === "STANDARD"
      ? "CS"
      : "CL";

  const random = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${random}`;
}

export async function POST(req: Request) {
  const { orderId } = await req.json();

  const oldOrder = await prisma.order.findUnique({
    where: { id: orderId },
    include: { tickets: true, event: true },
  });

  if (!oldOrder) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Delete old tickets
  await prisma.ticket.deleteMany({
    where: { orderId },
  });

  // Delete old order
  await prisma.order.delete({
    where: { id: orderId },
  });

  // ⭐ Create upgraded order WITHOUT overwriting any fields
  const newOrder = await prisma.order.create({
    data: {
      eventId: oldOrder.eventId,
      name: oldOrder.name,
      email: oldOrder.email,
      contactNo: oldOrder.contactNo,

      // ⭐ Preserve original values
      paymentMethod: oldOrder.paymentMethod,
      totalAmount: oldOrder.totalAmount,
      serviceFee: oldOrder.serviceFee,
      receiptUrl: oldOrder.receiptUrl,
      paid: oldOrder.paid,
      status: oldOrder.status,          // ⭐ NEW
      ticketSent: oldOrder.ticketSent,  // ⭐ NEW

      // ⭐ Only change this
      receiptNote: "manual upgrade",

      // ⭐ Update ticket counts
      adultLounge: oldOrder.adultLounge + oldOrder.adultStandard,
      adultStandard: 0,
      childLounge: oldOrder.childLounge + oldOrder.childStandard,
      childStandard: 0,

      tickets: {
        create: oldOrder.tickets.map((t) => {
          const code = generateTicketCode(t.category, "LOUNGE");

          return {
            category: t.category,
            tier: "LOUNGE",

            // ⭐ QR code must match ticket code
            qrCode: code,
            ticketCode: code,
          };
        }),
      },
    },
    include: { tickets: true, event: true },
  });

  // Generate ticket images
  const formattedTickets = [];

  for (const t of newOrder.tickets) {
    const qrBuffer = await generateQr(t.qrCode);
    const qrBase64 = qrBuffer.toString("base64");

    const ticketImage = await generateBrandedTicket({
      qrPng: qrBase64,
      event: newOrder.event.title,
      name: newOrder.name || "Guest",
      date: newOrder.event.date.toString(),
      venue: newOrder.event.venue,
      category: t.category,
      tier: t.tier,
      ticketCode: t.ticketCode!,
    });

    formattedTickets.push({
      category: t.category,
      tier: t.tier,
      code: t.ticketCode!,
      image: ticketImage,
    });
  }

  // Send upgraded email
  await sendTicketEmail({
    to: newOrder.email,
    tickets: formattedTickets,
    order: newOrder,
    upgraded: true,
  });

  return NextResponse.json({ message: "Order upgraded successfully" });
}
