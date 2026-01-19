import { NextResponse } from "next/server";

export async function GET() {
  const testOrderId = "cmkkz3rxi0004b2sgz3r3yjaj";

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/send-ticket?orderId=${testOrderId}`
  );

  const data = await res.json();
  return NextResponse.json(data);
}
