import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.json();

  const { eventId, name, email, contact, adults, children } = body;

  const event = await prisma.event.findUnique({ where: { id: eventId } });

  if (!event) {
    return Response.json({ error: "Event not found" }, { status: 404 });
  }

  const total =
    adults * event.priceAdult +
    children * event.priceChild;

  // Save booking in DB
  const order = await prisma.order.create({
    data: {
        eventId,
        name,
        email,
        contactNo: contact,
        adultQuantity: adults,
        childQuantity: children,
        quantity: adults + children,
        totalAmount: total,
        stripeIntent: "",
    },
    });


  // Create Stripe session
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_URL}/success?orderId=${order.id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/event/${eventId}`,
    line_items: [
        {
        price_data: {
            currency: "eur",
            product_data: { name: event.title },
            unit_amount: total,
        },
        quantity: 1,
        },
    ],
    metadata: {
        orderId: order.id,
    },
    });


  return Response.json({ url: session.url });
}
