import { NextResponse } from "next/server";

export async function GET() {
  const testOrderId = "cmkgl90jo0001jr04aehus0mx";

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/send-ticket?orderId=${testOrderId}`
  );

  const data = await res.json();
  return NextResponse.json(data);
}
