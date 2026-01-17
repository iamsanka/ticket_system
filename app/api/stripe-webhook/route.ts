import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const preferredRegion = "auto";
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

  // ─────────────────────────────────────────────
  // 1. CHECKOUT SESSION COMPLETED (Stripe Checkout)
  // ─────────────────────────────────────────────
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      console.log("✔ checkout.session.completed for order:", orderId);

      await prisma.order.update({
        where: { id: orderId },
        data: { paid: true },
      });

      // Trigger ticket email
      await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/send-ticket?orderId=${orderId}`
      );
    }
  }

  // ─────────────────────────────────────────────
  // 2. PAYMENT INTENT SUCCEEDED (Card payments)
  // ─────────────────────────────────────────────
  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object as Stripe.PaymentIntent;
    const orderId = intent.metadata?.orderId;

    if (orderId) {
      console.log("✔ payment_intent.succeeded for order:", orderId);

      await prisma.order.update({
        where: { id: orderId },
        data: { paid: true },
      });

      // Trigger ticket email
      await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/send-ticket?orderId=${orderId}`
      );
    }
  }

  // ─────────────────────────────────────────────
  // 3. PAYMENT FAILED
  // ─────────────────────────────────────────────
  if (event.type === "payment_intent.payment_failed") {
    const intent = event.data.object as Stripe.PaymentIntent;
    const orderId = intent.metadata?.orderId;

    if (orderId) {
      console.log("❌ payment_intent.payment_failed for order:", orderId);

      await prisma.order.update({
        where: { id: orderId },
        data: { paid: false },
      });
    }
  }

  return NextResponse.json({ received: true });
}
