import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({
        status: "error",
        message: "Missing orderId",
      });
    }
    console.log("API RECEIVED ORDER ID:", orderId);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { event: true },
    });

    if (!order) {
      return NextResponse.json({
        status: "invalid",
        message: "Ticket not found",
      });
    }

    // Already checked in
    if (order.usedAt) {
      return NextResponse.json({
        status: "used",
        message: "Ticket already checked in",
        name: order.name,
        event: order.event.title,
        usedAt: order.usedAt,
      });
    }
    console.log("ORDER FOUND:", !!order);

    // Mark as used
    await prisma.order.update({
      where: { id: orderId },
      data: { usedAt: new Date() },
    });

    return NextResponse.json({
      status: "success",
      message: "Ticket valid",
      name: order.name,
      event: order.event.title,
    });
  } catch (err) {
    console.error("CHECK-IN ERROR:", err);
    return NextResponse.json({
      status: "error",
      message: "Server error",
    });

  }
}
