import { NextResponse } from "next/server";

export async function GET() {
  const testOrderId = "cmkg0gowo0001b2o4dkh1m7pj";

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/send-ticket?orderId=${testOrderId}`
  );

  const data = await res.json();
  return NextResponse.json(data);
}
