import { NextResponse } from "next/server";

export async function GET() {
  const testOrderId = "cmki5g7mn0001b2zgu0i0joca";

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/send-ticket?orderId=${testOrderId}`
  );

  const data = await res.json();
  return NextResponse.json(data);
}
