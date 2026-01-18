import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { orderId, receiptNote } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        paid: true,
        receiptNote: receiptNote || null,
      },
    });

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Mark paid error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
