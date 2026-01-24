import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const THIRTY_MINUTES = 30 * 60 * 1000;

    // 1️⃣ Find unpaid STRIPE orders older than 30 minutes with NO tickets
    const oldOrders = await prisma.order.findMany({
      where: {
        paid: false,
        paymentMethod: "stripe", // only card/klarna
        createdAt: {
          lt: new Date(Date.now() - THIRTY_MINUTES),
        },
      },
      include: {
        tickets: true,
      },
    });

    // Filter out orders that already have tickets
    const deletableOrders = oldOrders.filter((o) => o.tickets.length === 0);

    if (deletableOrders.length === 0) {
      return NextResponse.json({ ok: true, deleted: 0 });
    }

    const orderIds = deletableOrders.map((o) => o.id);

    // 2️⃣ Delete the orders (no tickets exist, so safe)
    const result = await prisma.order.deleteMany({
      where: {
        id: { in: orderIds },
      },
    });

    return NextResponse.json({
      ok: true,
      deleted: result.count,
    });
  } catch (error) {
    console.error("Cleanup error:", error);
    return NextResponse.json(
      { ok: false, error: "Cleanup failed" },
      { status: 500 }
    );
  }
}
