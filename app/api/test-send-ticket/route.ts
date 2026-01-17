import { NextResponse } from "next/server";

export async function GET() {
  const testOrderId = "cmkivn9ob0001kw04clw1uisa";

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/send-ticket?orderId=${testOrderId}`
  );

  const data = await res.json();
  return NextResponse.json(data);
}
