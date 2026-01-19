import { NextResponse } from "next/server";

export async function GET() {
  const testOrderId = "cmkl13p0z0001b2vkxzxy9igo";

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/send-ticket?orderId=${testOrderId}`
  );

  const data = await res.json();
  return NextResponse.json(data);
}
