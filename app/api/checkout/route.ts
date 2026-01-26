import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

function noCacheJson(data: any, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}

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
      return noCacheJson({ error: "Missing required fields" }, 400);
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return noCacheJson({ error: "Event not found" }, 404);
    }

    // 1. Calculate subtotal
    const subtotal =
      adultLounge * event.adultLoungePrice +
      adultStandard * event.adultStandardPrice +
      childLounge * event.childLoungePrice +
      childStandard * event.childStandardPrice;

    if (subtotal < 50) {
      return noCacheJson(
        {
          error:
            "Minimum charge is €0.50. Please select at least one ticket.",
        },
        400
      );
    }

    // Adult Lounge seat limit check (max 100)
    if (adultLounge > 0) {
      const currentLoungeCount = await prisma.ticket.count({
        where: {
          category: "ADULT",
          tier: "LOUNGE",
        },
      });

      if (currentLoungeCount + adultLounge > 100) {
        return noCacheJson(
          {
            error: `Only ${Math.max(
              0,
              100 - currentLoungeCount
            )} Adult Lounge seats remaining.`,
          },
          400
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

    // ---------------------------------------------------------
    // MANUAL PAYMENT FLOW (Edenred / ePassi)
    // ---------------------------------------------------------
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

      return noCacheJson({ orderId: order.id });
    }

    // ---------------------------------------------------------
    // STRIPE FLOW — FIXED TO PREVENT DUPLICATE ORDERS
    // ---------------------------------------------------------

    // 1. Check if an unpaid Stripe order already exists for this user/event
    const existingOrder = await prisma.order.findFirst({
      where: {
        eventId,
        email,
        paymentMethod: "stripe",
        paid: false,
      },
    });

    if (existingOrder) {
      console.log("Reusing existing Stripe order:", existingOrder.id);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: subtotal,
        currency: "eur",
        metadata: { orderId: existingOrder.id },
        receipt_email: email,
      });

      return noCacheJson({
        clientSecret: paymentIntent.client_secret,
        orderId: existingOrder.id,
      });
    }

    // 2. Create a NEW order only if none exists
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

    const orderId = order.id;

    // 3. Create a fresh PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: subtotal,
      currency: "eur",
      metadata: { orderId },
      receipt_email: email,
    });

    return noCacheJson({
      clientSecret: paymentIntent.client_secret,
      orderId,
    });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return noCacheJson(
      { error: error.message || "Checkout failed" },
      500
    );
  }
}
