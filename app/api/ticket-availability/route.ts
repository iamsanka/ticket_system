import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const adultLoungeCount = await prisma.ticket.count({
    where: {
      category: "ADULT",
      tier: "LOUNGE",
    },
  });

  return NextResponse.json({
    adultLoungeRemaining: Math.max(0, 100 - adultLoungeCount),
  });
}
