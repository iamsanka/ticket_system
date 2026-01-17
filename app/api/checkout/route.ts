import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

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
      paymentMethod = "stripe",
    } = body;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // ⭐ Adult Lounge Limit Check (100 max)
    if (adultLounge > 0) {
      const existingAdultLounge = await prisma.ticket.count({
        where: {
          order: { eventId },
          category: "ADULT",
          tier: "LOUNGE",
        },
      });

      if (existingAdultLounge + adultLounge > 100) {
        return NextResponse.json(
          {
            error: "Adult Lounge tickets are sold out",
            remaining: Math.max(0, 100 - existingAdultLounge),
          },
          { status: 400 }
        );
      }
    }

    const totalAmount =
      adultLounge * event.adultLoungePrice +
      adultStandard * event.adultStandardPrice +
      childLounge * event.childLoungePrice +
      childStandard * event.childStandardPrice;

    // ⭐ Create Order
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
        paymentMethod, // NEW
      },
    });

    // ⭐ Build ticket categories & tiers (STRING enums)
    const categories = [
      ...Array(adultLounge).fill("ADULT"),
      ...Array(adultStandard).fill("ADULT"),
      ...Array(childLounge).fill("CHILD"),
      ...Array(childStandard).fill("CHILD"),
    ];

    const tiers = [
      ...Array(adultLounge).fill("LOUNGE"),
      ...Array(adultStandard).fill("STANDARD"),
      ...Array(childLounge).fill("LOUNGE"),
      ...Array(childStandard).fill("STANDARD"),
    ];

    const totalQuantity = categories.length;

    // ⭐ Generate ticket codes with unique increment (global)
    const prefix = "00520";

    const lastTicket = await prisma.ticket.findFirst({
      orderBy: { ticketCode: "desc" },
    });

    let startNumber = 1;

    if (lastTicket?.ticketCode) {
      const lastIncrement = parseInt(lastTicket.ticketCode.slice(-4));
      startNumber = lastIncrement + 1;
    }

    const ticketsToCreate = [];

    for (let i = 0; i < totalQuantity; i++) {
      const paddedIncrement = String(startNumber + i).padStart(4, "0");
      const ticketCode = `SSAN-${prefix}${paddedIncrement}`;

      ticketsToCreate.push({
        orderId: order.id,
        category: categories[i],
        tier: tiers[i],
        ticketCode,
        qrCode: `${order.id}-${categories[i]}-${tiers[i]}-${ticketCode}`,
      });
    }

    await prisma.ticket.createMany({ data: ticketsToCreate });

    // ⭐ Handle Edenred Pay
    if (paymentMethod === "edenred") {
      return NextResponse.json({
        redirectUrl:
          "https://myedenred.fi/affiliate-payment/YOUR-EDENRED-LINK-HERE",
        message: "Please complete your payment using Edenred Pay.",
        orderId: order.id,
      });
    }

    // ⭐ Handle ePassi
    /**if (paymentMethod === "epassi") {
      return NextResponse.json({
        redirectUrl: "https://YOUR-EPASSI-PAYMENT-LINK-HERE",
        message: "Please complete your payment using ePassi.",
        orderId: order.id,
      });
    }**/

    // ⭐ Stripe Checkout Session (default)
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
