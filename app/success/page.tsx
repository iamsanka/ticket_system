"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (!orderId) return;

    // Poll every 2 seconds until webhook marks order as paid
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/order?orderId=${orderId}`);
        const data = await res.json();

        if (!res.ok) {
          setStatus("error");
          clearInterval(interval);
          return;
        }

        setOrder(data.order);

        // Webhook has confirmed payment
        if (data.order.paid) {
          setStatus("success");
          clearInterval(interval);
        }
      } catch (err) {
        console.error(err);
        setStatus("error");
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [orderId]);

  // ─────────────────────────────────────────────
  // INVALID REQUEST
  // ─────────────────────────────────────────────
  if (!orderId) {
    return (
      <main className="p-10 max-w-2xl mx-auto text-black">
        <h1 className="text-2xl font-bold">Invalid Request</h1>
        <p>No order ID was provided.</p>
      </main>
    );
  }

  // ─────────────────────────────────────────────
  // LOADING STATE (waiting for webhook)
  // ─────────────────────────────────────────────
  if (status === "loading" || !order) {
    return (
      <main className="p-10 max-w-2xl mx-auto text-black">
        <h1 className="text-2xl font-bold">Processing your payment…</h1>
        <p>Please wait while we confirm your payment with Stripe.</p>
      </main>
    );
  }

  // ─────────────────────────────────────────────
  // ERROR STATE
  // ─────────────────────────────────────────────
  if (status === "error") {
    return (
      <main className="p-10 max-w-2xl mx-auto text-black">
        <h1 className="text-2xl font-bold">Payment Not Confirmed</h1>
        <p>Your payment could not be verified. Please try again.</p>

        <a
          href={`/event/${order?.eventId}`}
          className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded"
        >
          Retry Payment
        </a>
      </main>
    );
  }

  // ─────────────────────────────────────────────
  // SUCCESS STATE (webhook confirmed payment)
  // ─────────────────────────────────────────────
  return (
    <main className="p-10 max-w-2xl mx-auto text-black">
      <h1 className="text-3xl font-bold mb-4">Payment Successful</h1>

      <p className="mb-6">
        Thank you, <strong>{order.name}</strong>. Your booking for{" "}
        <strong>{order.event.title}</strong> is confirmed.
      </p>

      <div className="border p-4 rounded bg-gray-100 space-y-1">
        <p>
          <strong>Event:</strong> {order.event.title}
        </p>
        <p>
          <strong>Date:</strong>{" "}
          {new Date(order.event.date).toLocaleDateString()}
        </p>
        <p>
          <strong>Venue:</strong> {order.event.venue}
        </p>

        <hr className="my-2" />

        <p>
          <strong>Adult Lounge:</strong> {order.adultLounge}
        </p>
        <p>
          <strong>Adult Standard:</strong> {order.adultStandard}
        </p>
        <p>
          <strong>Child Lounge:</strong> {order.childLounge}
        </p>
        <p>
          <strong>Child Standard:</strong> {order.childStandard}
        </p>

        <hr className="my-2" />

        <p>
          <strong>Total Paid:</strong> €{order.totalAmount / 100}
        </p>
      </div>

      {/* ───────────────────────────────────────────── */}
      {/* TICKET CODES SECTION */}
      {/* ───────────────────────────────────────────── */}
      {order.tickets && order.tickets.length > 0 && (
        <div className="border p-4 rounded bg-gray-100 space-y-2 mt-6">
          <h2 className="text-xl font-semibold mb-2">Your Tickets</h2>

          {order.tickets.map((ticket: any, index: number) => (
            <div key={index} className="p-2 border rounded bg-white">
              <p>
                <strong>Category:</strong> {ticket.category}
              </p>
              <p>
                <strong>Tier:</strong> {ticket.tier}
              </p>
              <p>
                <strong>Ticket Code:</strong> {ticket.ticketCode}
              </p>
            </div>
          ))}
        </div>
      )}

      <p className="mt-6 text-green-600 font-semibold">
        Your ticket has been emailed to {order.email}
      </p>
    </main>
  );
}
