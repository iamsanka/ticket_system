import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      select: {
        paid: true,
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

    for (const order of orders) {
      const key = order.paid ? "paid" : "unpaid";

      summary.adultLounge[key] += order.adultLounge || 0;
      summary.adultStandard[key] += order.adultStandard || 0;
      summary.childLounge[key] += order.childLounge || 0;
      summary.childStandard[key] += order.childStandard || 0;
    }

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Admin summary error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
