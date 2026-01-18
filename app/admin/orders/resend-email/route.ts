import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// import { sendTicketsEmail } from "@/lib/email"; // <- your existing email logic

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        tickets: true,
        event: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // TODO: plug in your real email sending logic here
    // await sendTicketsEmail(order);

    await prisma.order.update({
      where: { id: orderId },
      data: {
        ticketSent: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Resend email error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
