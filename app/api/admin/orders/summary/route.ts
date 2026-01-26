import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // 1. ALL tickets = paid tickets (tickets only exist after payment)
    const tickets = await prisma.ticket.findMany({
      select: {
        category: true,
        tier: true,
      },
    });

    // 2. Unpaid quantities from Order table
    const unpaidOrders = await prisma.order.findMany({
      where: {
        paid: false,
      },
      select: {
        adultLounge: true,
        adultStandard: true,
        childLounge: true,
        childStandard: true,
      },
    });

    const summary = {
      adultLounge: { paid: 0, unpaid: 0 },
      adultStandard: { paid: 0, unpaid: 0 },
      childLounge: { paid: 0, unpaid: 0 },
      childStandard: { paid: 0, unpaid: 0 },
    };

    // PAID = count tickets
    for (const t of tickets) {
      if (t.category === "ADULT" && t.tier === "LOUNGE") {
        summary.adultLounge.paid += 1;
      }
      if (t.category === "ADULT" && t.tier === "STANDARD") {
        summary.adultStandard.paid += 1;
      }
      if (t.category === "CHILD" && t.tier === "LOUNGE") {
        summary.childLounge.paid += 1;
      }
      if (t.category === "CHILD" && t.tier === "STANDARD") {
        summary.childStandard.paid += 1;
      }
    }

    // UNPAID = quantities from unpaid orders
    for (const order of unpaidOrders) {
      summary.adultLounge.unpaid += order.adultLounge || 0;
      summary.adultStandard.unpaid += order.adultStandard || 0;
      summary.childLounge.unpaid += order.childLounge || 0;
      summary.childStandard.unpaid += order.childStandard || 0;
    }

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Admin summary error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
