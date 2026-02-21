import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
//export const preferredRegion = "undefined";
export const bodyParser = false;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature error:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // 1. PAYMENT INTENT SUCCEEDED (Card/Klarna)
  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object as Stripe.PaymentIntent;
    const orderId = intent.metadata?.orderId;

    if (orderId) {
      console.log("payment_intent.succeeded for order:", orderId);

      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { event: true },
      });

      // Idempotency guard: skip if already paid or missing
      if (!order || order.paid) {
        console.log("Skipping duplicate or missing order:", orderId);
        return NextResponse.json({ received: true });
      }

      await prisma.order.update({
        where: { id: orderId },
        data: { paid: true },
      });

      // Build tickets if none exist
      const existingTickets = await prisma.ticket.count({
        where: { orderId },
      });

      if (existingTickets === 0) {
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

      // Trigger ticket email
      await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/send-ticket?orderId=${orderId}`
      );
    }
  }

  // 2. PAYMENT FAILED
  if (event.type === "payment_intent.payment_failed") {
    const intent = event.data.object as Stripe.PaymentIntent;
    const orderId = intent.metadata?.orderId;

    if (orderId) {
      console.log("payment_intent.payment_failed for order:", orderId);

      await prisma.order.update({
        where: { id: orderId },
        data: { paid: false },
      });
    }
  }

  return NextResponse.json({ received: true });
}
