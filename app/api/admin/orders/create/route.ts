import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendTicketEmail } from "@/lib/sendTicketEmails";
import { generateBrandedTicket } from "@/lib/generateTicketImage";
import { generateQr } from "@/lib/generateQr";

function generateTickets(orderId: string, counts: any) {
  const tickets: any[] = [];

  function push(
    count: number,
    category: "ADULT" | "CHILD",
    tier: "LOUNGE" | "STANDARD"
  ) {
    for (let i = 0; i < count; i++) {
      const code = `${category[0]}${tier[0]}-${Math.floor(
        100000 + Math.random() * 900000
      )}`;

      tickets.push({
        orderId,
        category,
        tier,
        ticketCode: code,
        qrCode: code, // ✅ MATCH ticketCode
      });
    }
  }

  push(counts.adultLounge, "ADULT", "LOUNGE");
  push(counts.adultStandard, "ADULT", "STANDARD");
  push(counts.childLounge, "CHILD", "LOUNGE");
  push(counts.childStandard, "CHILD", "STANDARD");

  return tickets;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name,
      email,
      contactNo,
      eventId,
      adultLounge,
      adultStandard,
      childLounge,
      childStandard,
      totalAmount,
    } = body;

    if (!name || !email || !eventId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    // Convert amount to cents
    const amountInCents = Math.round(Number(totalAmount) * 100);

    // Create order
    const order = await prisma.order.create({
      data: {
        name,
        email,
        contactNo,
        eventId,
        adultLounge,
        adultStandard,
        childLounge,
        childStandard,
        totalAmount: amountInCents,
        paid: true,
        status: "manual",
      },
    });

    // Create ticket rows
    const ticketData = generateTickets(order.id, {
      adultLounge,
      adultStandard,
      childLounge,
      childStandard,
    });

    await prisma.ticket.createMany({ data: ticketData });

    const tickets = await prisma.ticket.findMany({
      where: { orderId: order.id },
    });

    // Generate branded ticket images
    const ticketImages = await Promise.all(
      tickets.map(async (t) => {
        const qrBuffer = await generateQr(t.qrCode);
        const qrBase64 = qrBuffer.toString("base64");

        const brandedPng = await generateBrandedTicket({
          qrPng: qrBase64,
          event: event.title,
          name: order.name || "Guest",
          date: event.date.toString(),
          venue: event.venue,
          category: t.category,
          tier: t.tier,
          ticketCode: t.ticketCode!,
        });

        return {
          category: t.category,
          tier: t.tier,
          code: t.ticketCode!,
          image: brandedPng,
        };
      })
    );

    // Send email
    await sendTicketEmail({
      to: email,
      order: {
        ...order,
        event,
        tickets,
      },
      tickets: ticketImages,
    });

    return NextResponse.json({ order });
  } catch (err: any) {
    console.error("Admin ticket creation error:", err);
    return NextResponse.json(
      { error: "Internal server error", details: err.message },
      { status: 500 }
    );
  }
}
