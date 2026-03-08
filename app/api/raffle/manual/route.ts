import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  // Load raffle configuration
  const config = await prisma.manualRaffleConfig.findFirst();

  // If no config or raffle disabled → return disabled
  if (!config || !config.enabled) {
    return NextResponse.json({ enabled: false });
  }

  // Collect ticket codes
  const codes = [
    { place: "first", code: config.firstCode },
    { place: "second", code: config.secondCode },
    { place: "third", code: config.thirdCode },
  ].filter((c) => c.code);

  // Fetch matching tickets
  const tickets = await prisma.ticket.findMany({
    where: {
      ticketCode: { in: codes.map((c) => c.code!) },
    },
    include: {
      order: {
        include: {
          event: true,
        },
      },
    },
  });

  // Map ticketCode → ticket
  const byCode = new Map<string, any>(
    tickets.map((t: any) => [t.ticketCode as string, t])
  );

  return NextResponse.json({
    enabled: true,
    winners: {
      first: byCode.get(config.firstCode || "") || null,
      second: byCode.get(config.secondCode || "") || null,
      third: byCode.get(config.thirdCode || "") || null,
    },
  });
}
