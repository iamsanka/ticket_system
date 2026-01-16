import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { TicketCategory, TicketTier } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      eventId,
      adultLounge = 0,
      adultStandard = 0,
      childLounge = 0,
      childStandard = 0,
      name,
      email,
      contactNo = "",
    } = body;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const totalAmount =
      adultLounge * event.adultLoungePrice +
      adultStandard * event.adultStandardPrice +
      childLounge * event.childLoungePrice +
      childStandard * event.childStandardPrice;

    // 1. Create order
    const order = await prisma.order.create({
      data: {
        eventId,
        adultLounge,
        adultStandard,
        childLounge,
        childStandard,
        totalAmount,
        email,
        name,
        contactNo,
      },
    });

    // 2. Generate ticket categories and tiers for this order only
    const categories: TicketCategory[] = [
      ...Array(adultLounge).fill(TicketCategory.ADULT),
      ...Array(adultStandard).fill(TicketCategory.ADULT),
      ...Array(childLounge).fill(TicketCategory.CHILD),
      ...Array(childStandard).fill(TicketCategory.CHILD),
    ];

    const tiers: TicketTier[] = [
      ...Array(adultLounge).fill(TicketTier.LOUNGE),
      ...Array(adultStandard).fill(TicketTier.STANDARD),
      ...Array(childLounge).fill(TicketTier.LOUNGE),
      ...Array(childStandard).fill(TicketTier.STANDARD),
    ];

    const totalQuantity = categories.length;

    // 3. Count existing tickets for this event
    const existingCount = await prisma.ticket.count({
      where: { order: { eventId } },
    });

    const prefix = event.title
      .toUpperCase()
      .replace(/[^A-Z]/g, "")
      .slice(0, 20);

    const ticketsToCreate = [];

    for (let i = 0; i < totalQuantity; i++) {
      const counter = existingCount + i + 1;
      const ticketCode = `${prefix}-${String(counter).padStart(4, "0")}`;

      ticketsToCreate.push({
        orderId: order.id,
        category: categories[i],
        tier: tiers[i],
        ticketCode,
        qrCode: `${order.id}-${categories[i]}-${tiers[i]}-${ticketCode}`,
      });
    }

    await prisma.ticket.createMany({ data: ticketsToCreate });

    // 4. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: event.title,
            },
            unit_amount: totalAmount,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?orderId=${order.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
      metadata: {
        orderId: order.id,
      },
    });

    return NextResponse.json({ sessionUrl: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
