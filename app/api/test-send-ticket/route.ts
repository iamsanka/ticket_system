import { NextResponse } from "next/server";

export async function GET() {
  const testOrderId = "cmkl07o8s000gb2ect0jyr6ph";

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/send-ticket?orderId=${testOrderId}`
  );

  const data = await res.json();
  return NextResponse.json(data);
}
