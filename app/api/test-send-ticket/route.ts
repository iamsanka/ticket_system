import { NextResponse } from "next/server";

export async function GET() {
  const testOrderId = "cmkkytc7k0001b2hwk6ojwg1v";

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/send-ticket?orderId=${testOrderId}`
  );

  const data = await res.json();
  return NextResponse.json(data);
}
