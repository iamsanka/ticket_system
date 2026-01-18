import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  // Validate password
  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  // Create response
  const response = NextResponse.json({ success: true });

  // Set admin session cookie
  response.cookies.set("admin_session_v2", "true", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production", // allow cookie on localhost
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 1 day
  });

  return response;
}
