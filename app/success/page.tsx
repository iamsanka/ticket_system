"use client";

import { prisma } from "@/lib/prisma";
import { generateTicketQR } from "@/lib/generateQr";
import { sendTicketEmail } from "@/lib/sendTicketEmail";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { orderId?: string };
}) {
  const orderId = searchParams.orderId;

  if (!orderId) {
    return (
      <main className="p-10 max-w-2xl mx-auto text-black">
        <h1 className="text-2xl font-bold">Invalid Request</h1>
        <p>No order ID was provided.</p>
      </main>
    );
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { event: true },
  });

  if (!order) {
    return (
      <main className="p-10 max-w-2xl mx-auto text-black">
        <h1 className="text-2xl font-bold">Order Not Found</h1>
        <p>We couldn't find your order. Please contact support.</p>
      </main>
    );
  }

  // Generate QR + send email (only if not already sent)
  if (!order.ticketUrl) {
    const qr = await generateTicketQR({
      name: order.name ?? "",
      event: order.event.title,
      people: (order.adultQuantity ?? 0) + (order.childQuantity ?? 0),
      contact: order.contactNo ?? "",
      orderId: order.id,
    });

    await sendTicketEmail({
      to: order.email,
      name: order.name ?? "",
      qrPng: qr,
      eventTitle: order.event.title,
    });

    // Optional: save QR URL or mark as sent
    await prisma.order.update({
      where: { id: order.id },
      data: { ticketUrl: "sent" },
    });
  }

  return (
    <main className="p-10 max-w-2xl mx-auto text-black">
      <h1 className="text-3xl font-bold mb-4">Payment Successful</h1>

      <p className="mb-6">
        Thank you, <strong>{order.name}</strong>. Your booking for{" "}
        <strong>{order.event.title}</strong> is confirmed.
      </p>

      <div className="border p-4 rounded bg-gray-100">
        <p>
          <strong>Event:</strong> {order.event.title}
        </p>
        <p>
          <strong>Date:</strong> {order.event.date.toDateString()}
        </p>
        <p>
          <strong>Venue:</strong> {order.event.venue}
        </p>
        <p>
          <strong>Adults:</strong> {order.adultQuantity}
        </p>
        <p>
          <strong>Children:</strong> {order.childQuantity}
        </p>
        <p>
          <strong>Total Paid:</strong> €{order.totalAmount / 100}
        </p>
      </div>

      <p className="mt-6 text-green-600 font-semibold">
        Your ticket has been emailed to {order.email}
      </p>
    </main>
  );
}
