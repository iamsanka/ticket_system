import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return NextResponse.json({ users });
  } catch (err) {
    console.error("List users error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
