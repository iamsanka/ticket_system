import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { qrCode, orderId } = await req.json();

  // ─────────────────────────────────────────────
  // 1. MANUAL CHECK-IN BY ORDER ID
  // ─────────────────────────────────────────────
  if (orderId) {
    await prisma.ticket.updateMany({
      where: { orderId },
      data: { usedAt: new Date() },
    });

    return NextResponse.json({ valid: true, manual: true });
  }

  // ─────────────────────────────────────────────
  // 2. QR VALIDATION
  // ─────────────────────────────────────────────
  if (!qrCode) {
    return NextResponse.json(
      { valid: false, reason: "Missing QR code" },
      { status: 400 }
    );
  }

  // Scanner may send:
  //  - raw string: "<orderId>-ADULT-LOUNGE-SSAN-005200001"
  //  - JSON: {"qrCode": "<orderId>-ADULT-LOUNGE-SSAN-005200001"}
  let raw = qrCode as string;

  try {
    const parsed = JSON.parse(qrCode);
    if (parsed && typeof parsed.qrCode === "string") {
      raw = parsed.qrCode;
    }
  } catch {
    // Not JSON — use as-is
  }

  const parts = raw.trim().split("-");
  // Ticket code is always the last two segments: "SSAN-0052xxxx"
  const ticketCode = parts.slice(-2).join("-").trim();

  console.log("QR RAW:", qrCode);
  console.log("PARSED RAW:", raw);
  console.log("PARTS:", parts);
  console.log("EXTRACTED ticketCode:", ticketCode);

  if (!ticketCode) {
    return NextResponse.json(
      { valid: false, reason: "Invalid QR format" },
      { status: 400 }
    );
  }

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
