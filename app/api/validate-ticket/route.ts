// FILE: app/api/validate-ticket/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { qrCode, orderId } = await req.json();

  // Manual check-in
  if (orderId) {
    await prisma.ticket.updateMany({
      where: { orderId },
      data: { usedAt: new Date() },
    });

    return NextResponse.json({ valid: true, manual: true });
  }

  if (!qrCode) {
    return NextResponse.json(
      { valid: false, reason: "Missing QR code" },
      { status: 400 }
    );
  }

  // 🔥 FIX: Normalize QR input (scanner sometimes sends JSON)
  let raw = qrCode;

  try {
    const parsed = JSON.parse(qrCode);
    if (parsed.qrCode) {
      raw = parsed.qrCode;
    }
  } catch {
    // Not JSON — use as-is
  }

  // 🔥 FIX: Extract ticketCode safely
  const parts = raw.trim().split("-");
  const ticketCode = parts.slice(-2).join("-").trim();

  console.log("QR RAW:", qrCode);
  console.log("PARSED RAW:", raw);
  console.log("PARTS:", parts);
  console.log("EXTRACTED ticketCode:", ticketCode);

  // Prisma lookup
  const ticket = await prisma.ticket.findFirst({
    where: { ticketCode },
    include: { order: { include: { event: true } } },
  });

  if (!ticket) {
    return NextResponse.json(
      { valid: false, reason: "Ticket not found" },
      { status: 404 }
    );
  }

  if (ticket.usedAt) {
    return NextResponse.json({
      valid: false,
      reason: "Ticket already used",
      usedAt: ticket.usedAt,
    });
  }

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
  });
}
