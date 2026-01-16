import { NextResponse } from "next/server";

export async function GET() {
  const testOrderId = "cmkgm4ife0006b28w0936p5bd";

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/send-ticket?orderId=${testOrderId}`
  );

  const data = await res.json();
  return NextResponse.json(data);
}
