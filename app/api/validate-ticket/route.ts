import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { qrCode } = await req.json();

    if (!qrCode) {
      return NextResponse.json({ error: "Missing QR code" }, { status: 400 });
    }

    // Find ticket by QR code (NOT unique → use findFirst)
    const ticket = await prisma.ticket.findFirst({
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
      return NextResponse.json({ valid: false, message: "Invalid ticket" });
    }

    return NextResponse.json({
      valid: true,
      ticket,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Server error", details: String(err) },
      { status: 500 }
    );
  }
}
