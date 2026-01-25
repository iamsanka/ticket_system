import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json(
      { ok: false, error: "Invalid email or password" },
      { status: 401 }
    );
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return NextResponse.json(
      { ok: false, error: "Invalid email or password" },
      { status: 401 }
    );
  }

  // ⭐ Create the response FIRST
  const res = NextResponse.json({ ok: true, role: user.role });

  // ⭐ Set cookie on the response (NO TypeScript errors)
  res.cookies.set(
    "admin_session",
    JSON.stringify({
      id: user.id,
      role: user.role,
    }),
    {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "strict",
    }
  );

  return res;
}
