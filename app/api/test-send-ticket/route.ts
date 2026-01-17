import { NextResponse } from "next/server";

export async function GET() {
  const testOrderId = "cmki4260n0001b2bg9dibhw8m";

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/send-ticket?orderId=${testOrderId}`
  );

  const data = await res.json();
  return NextResponse.json(data);
}
