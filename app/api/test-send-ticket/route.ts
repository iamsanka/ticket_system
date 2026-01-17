import { NextResponse } from "next/server";

export async function GET() {
  const testOrderId = "cmkihi4890001jv04n9ezju9u";

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/send-ticket?orderId=${testOrderId}`
  );

  const data = await res.json();
  return NextResponse.json(data);
}
