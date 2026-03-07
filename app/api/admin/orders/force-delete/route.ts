import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendTicketCancellationEmail } from "@/lib/sendTicketCancellationEmail";

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "Missing orderId" },
        { status: 400 }
      );
    }

    // Load order + event + tickets BEFORE deleting
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { event: true, tickets: true },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    const tickets = order.tickets;

    // Delete tickets
    await prisma.ticket.deleteMany({
      where: { orderId },
    });

    // Delete order
    await prisma.order.delete({
      where: { id: orderId },
    });

    // Send cancellation email with ticket details
    await sendTicketCancellationEmail({
      to: order.email,
      order,
      tickets,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Force delete order error:", error);
    return NextResponse.json(
      { error: "Failed to force delete order", details: error.message },
      { status: 500 }
    );
  }
}
