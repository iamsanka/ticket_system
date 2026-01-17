import { NextResponse } from "next/server";

export async function GET() {
  const testOrderId = "cmki68o8f0007l504a42sa48d";

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/send-ticket?orderId=${testOrderId}`
  );

  const data = await res.json();
  return NextResponse.json(data);
}
