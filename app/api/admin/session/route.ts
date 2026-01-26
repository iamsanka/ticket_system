import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const cookie = (req as any).cookies.get("admin_session")?.value;

  if (!cookie) {
    return NextResponse.json({ user: null });
  }

  try {
    const session = JSON.parse(cookie);
    return NextResponse.json({ user: session });
  } catch {
    return NextResponse.json({ user: null });
  }
}
