import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const saved = await prisma.randomRaffleResult.create({
      data: {
        eventName: body.eventName,

        firstTicket: body.firstTicket,
        firstName: body.firstName,
        firstEmail: body.firstEmail,
        firstContact: body.firstContact,

        secondTicket: body.secondTicket,
        secondName: body.secondName,
        secondEmail: body.secondEmail,
        secondContact: body.secondContact,

        thirdTicket: body.thirdTicket,
        thirdName: body.thirdName,
        thirdEmail: body.thirdEmail,
        thirdContact: body.thirdContact,

        usedDateRange: body.usedDateRange,
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null
      }
    });

    return NextResponse.json({ success: true, saved });
  } catch (err) {
    console.error("Random raffle save error:", err);
    return NextResponse.json(
      { error: "Failed to save random raffle result" },
      { status: 500 }
    );
  }
}
