import { NextResponse } from "next/server";

export async function GET() {
  const testOrderId = "cmkgv22ju0007b28445l3u9ce";

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/send-ticket?orderId=${testOrderId}`
  );

  const data = await res.json();
  return NextResponse.json(data);
}
