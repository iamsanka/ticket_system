import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const config = await prisma.ManualRaffleConfig.findFirst();
  return NextResponse.json(config || null);
}

export async function POST(req: Request) {
  const { firstCode, secondCode, thirdCode, enabled } = await req.json();

  const config = await prisma.ManualRaffleConfig.upsert({
    where: { id: "manual-singleton" },
    update: { firstCode, secondCode, thirdCode, enabled },
    create: {
      id: "manual-singleton",
      firstCode,
      secondCode,
      thirdCode,
      enabled: !!enabled,
    },
  });

  return NextResponse.json(config);
}
