import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { qrCode } = await req.json();

    if (!qrCode) {
      return NextResponse.json(
        { valid: false, reason: "Missing QR code" },
        { status: 400 }
      );
    }

    // Find ticket by QR code
    const ticket = await prisma.ticket.findUnique({
      where: { qrCode },
      include: {
        order: {
          include: {
            event: true,
          },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json({
        valid: false,
        reason: "Invalid ticket",
      });
    }

    // Check if already used
    if (ticket.usedAt) {
      return NextResponse.json({
        valid: false,
        reason: "Ticket already used",
      });
    }

    // Mark ticket as used
    await prisma.ticket.update({
      where: { id: ticket.id },
      data: { usedAt: new Date() },
    });

    return NextResponse.json({
      valid: true,
      category: ticket.category,
      tier: ticket.tier,
      name: ticket.order.name,
      email: ticket.order.email,
      event: ticket.order.event.title,
      eventDate: ticket.order.event.date,
    });
  } catch (error) {
    console.error("Validate-ticket error:", error);
    return NextResponse.json(
      { valid: false, reason: "Server error" },
      { status: 500 }
    );
  }
}
