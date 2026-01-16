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

    // 1. Create order in DB
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

    // 2. Create Stripe Checkout Session
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
