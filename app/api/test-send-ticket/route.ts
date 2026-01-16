import { NextResponse } from "next/server";

export async function GET() {
  const testOrderId = "cmkgmm5750001l2049y0yenbs";

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/send-ticket?orderId=${testOrderId}`
  );

  const data = await res.json();
  return NextResponse.json(data);
}
