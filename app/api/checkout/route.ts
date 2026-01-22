import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      eventId,
      name,
      email,
      contactNo,
      adultLounge = 0,
      adultStandard = 0,
      childLounge = 0,
      childStandard = 0,
      paymentMethod,
    } = body;

    if (!eventId || !email || !name || !paymentMethod) {
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

    // 1. Calculate subtotal
    const subtotal =
      adultLounge * event.adultLoungePrice +
      adultStandard * event.adultStandardPrice +
      childLounge * event.childLoungePrice +
      childStandard * event.childStandardPrice;

    if (subtotal < 50) {
      return NextResponse.json(
        {
          error:
            "Minimum charge is €0.50. Please select at least one ticket.",
        },
        { status: 400 }
      );
    }

    //Adult Lounge seat limit check (max 100)
    if (adultLounge > 0) {
      const currentLoungeCount = await prisma.ticket.count({
        where: {
          category: "ADULT",
          tier: "LOUNGE",
        },
      });

      if (currentLoungeCount + adultLounge > 100) {
        return NextResponse.json(
          {
            error: `Only ${Math.max(
              0,
              100 - currentLoungeCount
            )} Adult Lounge seats remaining.`,
          },
          { status: 400 }
        );
      }
    }

    // Calculate service fee
    let serviceFee = 0;

    if (paymentMethod === "edenred") {
      serviceFee = Math.round(subtotal * 0.05); // 5%
    }

    if (paymentMethod === "epassi") {
      const totalTickets =
        adultLounge +
        adultStandard +
        childLounge +
        childStandard;

      serviceFee = totalTickets * 500; // €5 per ticket
    }

    // Final total
    const totalAmount = subtotal + serviceFee;

    // Manual payment flow (Edenred / ePassi)
    if (paymentMethod === "edenred" || paymentMethod === "epassi") {
      const order = await prisma.order.create({
        data: {
          eventId,
          name,
          email,
          contactNo,
          adultLounge,
          adultStandard,
          childLounge,
          childStandard,
          serviceFee,
          totalAmount,
          paymentMethod,
          status: "AWAITING_VERIFICATION",
          paid: false,
        },
      });

      return NextResponse.json({ orderId: order.id });
    }

    // Stripe embedded flow (card/Klarna)

    // Prevent duplicate orders: reuse existing pending unpaid Stripe order
    const existing = await prisma.order.findFirst({
      where: {
        email,
        eventId,
        paid: false,
        status: "pending",
        paymentMethod: "stripe",
      },
    });

    let orderId: string;

    if (existing) {
      orderId = existing.id;
    } else {
      const order = await prisma.order.create({
        data: {
          eventId,
          name,
          email,
          contactNo,
          adultLounge,
          adultStandard,
          childLounge,
          childStandard,
          serviceFee: 0,
          totalAmount: subtotal,
          paymentMethod: "stripe",
          status: "pending",
          paid: false,
        },
      });
      orderId = order.id;
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: subtotal,
      currency: "eur",
      metadata: { orderId },
      receipt_email: email,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderId,
    });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Checkout failed" },
      { status: 500 }
    );
  }
}
