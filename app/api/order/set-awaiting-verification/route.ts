import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { orderId } = await req.json();

  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "AWAITING_VERIFICATION",
      paid: false,
    },
  });

  return NextResponse.json({ ok: true });
}
