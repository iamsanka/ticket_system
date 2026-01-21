import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { ticketId } = await req.json();

    if (!ticketId) {
      return NextResponse.json(
        { error: "ticketId is required" },
        { status: 400 }
      );
    }

    // Update the ticket as checked in
    const updated = await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        usedAt: new Date(), // ✔ correct field from your schema
      },
    });

    return NextResponse.json({
      success: true,
      ticket: updated,
    });
  } catch (error) {
    console.error("Check-in update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
