"use client";

import { useEffect, useState } from "react";

export default function SuccessPage({
  searchParams,
}: {
  searchParams: { orderId?: string };
}) {
  const orderId = searchParams.orderId;
  const [status, setStatus] = useState<"loading" | "done" | "error">("loading");
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (!orderId) return;

    async function processTicket() {
      try {
        // 1. Fetch order details from API
        const orderRes = await fetch(`/api/order?orderId=${orderId}`);
        const orderJson = await orderRes.json();

        if (!orderRes.ok) {
          setStatus("error");
          return;
        }

        setOrder(orderJson.order);

        // 2. Trigger ticket email sending
        await fetch(`/api/send-ticket?orderId=${orderId}`);

        setStatus("done");
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    }

    processTicket();
  }, [orderId]);

  if (!orderId) {
    return (
      <main className="p-10 max-w-2xl mx-auto text-black">
        <h1 className="text-2xl font-bold">Invalid Request</h1>
        <p>No order ID was provided.</p>
      </main>
    );
  }

  if (status === "loading" || !order) {
    return (
      <main className="p-10 max-w-2xl mx-auto text-black">
        <h1 className="text-2xl font-bold">Processing your ticket…</h1>
        <p>Please wait a moment.</p>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="p-10 max-w-2xl mx-auto text-black">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p>Please contact support.</p>
      </main>
    );
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
          <strong>Date:</strong> {order.event.date}
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
