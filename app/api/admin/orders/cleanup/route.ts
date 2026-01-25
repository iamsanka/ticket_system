import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const THIRTY_MINUTES = 30 * 60 * 1000;
    const FIVE_DAYS = 5 * 24 * 60 * 60 * 1000;

    // 1️⃣ STRIPE CLEANUP (30 minutes)
    const stripeOrders = await prisma.order.findMany({
      where: {
        paid: false,
        paymentMethod: "stripe",
        createdAt: {
          lt: new Date(Date.now() - THIRTY_MINUTES),
        },
      },
      include: { tickets: true },
    });

    const stripeDeletable = stripeOrders
      .filter((o) => o.tickets.length === 0)
      .map((o) => o.id);

    if (stripeDeletable.length > 0) {
      await prisma.order.deleteMany({
        where: { id: { in: stripeDeletable } },
      });
    }

    // 2️⃣ EDENRED + EPASSI CLEANUP (5 days)
    const voucherOrders = await prisma.order.findMany({
      where: {
        paid: false,
        paymentMethod: { in: ["edenred", "epassi"] },
        createdAt: {
          lt: new Date(Date.now() - FIVE_DAYS),
        },
      },
      include: { tickets: true },
    });

    const voucherDeletable = voucherOrders
      .filter((o) => o.tickets.length === 0)
      .map((o) => o.id);

    if (voucherDeletable.length > 0) {
      await prisma.order.deleteMany({
        where: { id: { in: voucherDeletable } },
      });
    }

    return NextResponse.json({
      ok: true,
      deletedStripe: stripeDeletable.length,
      deletedVoucher: voucherDeletable.length,
    });
  } catch (error) {
    console.error("Cleanup error:", error);
    return NextResponse.json(
      { ok: false, error: "Cleanup failed" },
      { status: 500 }
    );
  }
}
