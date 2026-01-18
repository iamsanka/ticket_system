"use client";

import { useState } from "react";

type Order = {
  id: string;
  email: string;
  contactNo: string | null;
  name: string | null;
  paid: boolean;
  ticketSent: boolean;
  paymentMethod: string | null;
  receiptNote: string | null;
  createdAt: string;
  event: {
    title: string;
  };
  tickets: {
    id: string;
    ticketCode: string | null;
    category: string;
    tier: string;
  }[];
};

export default function AdminDashboard() {
  const [contactNo, setContactNo] = useState("");
  const [ticketCode, setTicketCode] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [receiptNote, setReceiptNote] = useState("");

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/admin/orders/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contactNo: contactNo || undefined,
        ticketCode: ticketCode || undefined,
      }),
    });

    const data = await res.json();
    setOrders(data.orders || []);
    setLoading(false);
  }

  async function markAsPaid(orderId: string) {
    setActionLoading(orderId);
    const res = await fetch("/api/admin/orders/mark-paid", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, receiptNote }),
    });

    const data = await res.json();
    if (data.error) {
      alert(data.error);
    } else {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, paid: true, receiptNote } : o,
        ),
      );
    }
    setActionLoading(null);
  }

  async function resendEmail(orderId: string) {
    setActionLoading(orderId + "-email");
    const res = await fetch("/api/admin/orders/resend-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    });

    const data = await res.json();
    if (data.error) {
      alert(data.error);
    } else {
      alert("Email resent.");
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, ticketSent: true } : o)),
      );
    }
    setActionLoading(null);
  }

  return (
    <div className="space-y-6 text-white">
      {/* Search */}
      <form
        onSubmit={handleSearch}
        className="space-y-4 border border-gray-700 p-4 rounded bg-gray-900"
      >
        <h2 className="font-semibold text-lg">Search Orders</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Phone Number
            </label>
            <input
              value={contactNo}
              onChange={(e) => setContactNo(e.target.value)}
              className="w-full bg-gray-800 text-white border border-gray-600 rounded px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 0401234567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Ticket Code
            </label>
            <input
              value={ticketCode}
              onChange={(e) => setTicketCode(e.target.value)}
              className="w-full bg-gray-800 text-white border border-gray-600 rounded px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. SSAN-005200001"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {/* Receipt note input */}
      <div className="border border-gray-700 p-4 rounded bg-gray-900">
        <h2 className="font-semibold text-lg mb-2">Edenred Receipt Note</h2>
        <p className="text-sm text-gray-400 mb-2">
          When marking an order as paid via Edenred, you can store a note here.
        </p>
        <input
          value={receiptNote}
          onChange={(e) => setReceiptNote(e.target.value)}
          className="w-full bg-gray-800 text-white border border-gray-600 rounded px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Edenred receipt reference or note"
        />
      </div>

      {/* Results */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border border-gray-700 p-4 rounded bg-gray-900"
          >
            <div className="flex justify-between items-start gap-4">
              <div>
                <h3 className="font-semibold text-lg">
                  {order.event?.title || "Event"}
                </h3>
                <p className="text-sm text-gray-300">
                  {order.name} &lt;{order.email}&gt;
                </p>
                <p className="text-sm text-gray-300">
                  Phone: {order.contactNo || "-"}
                </p>
                <p className="text-sm text-gray-300">
                  Payment: {order.paymentMethod || "N/A"}
                </p>
                <p className="text-sm text-gray-300">
                  Paid: {order.paid ? "Yes" : "No"} | Tickets sent:{" "}
                  {order.ticketSent ? "Yes" : "No"}
                </p>
                {order.receiptNote && (
                  <p className="text-xs text-gray-400 mt-1">
                    Receipt note: {order.receiptNote}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => markAsPaid(order.id)}
                  disabled={order.paid || !!actionLoading}
                  className={`px-3 py-1 rounded text-sm ${
                    order.paid
                      ? "bg-green-300 text-green-900 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  {order.paid
                    ? "Already Paid"
                    : actionLoading === order.id
                      ? "Marking..."
                      : "Mark as Paid"}
                </button>

                <button
                  onClick={() => resendEmail(order.id)}
                  disabled={!!actionLoading}
                  className="px-3 py-1 rounded text-sm bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {actionLoading === order.id + "-email"
                    ? "Resending..."
                    : "Resend Email"}
                </button>
              </div>
            </div>

            {/* Tickets */}
            <div className="mt-3">
              <h4 className="font-semibold text-sm mb-1">Tickets</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                {order.tickets.map((t) => (
                  <li key={t.id}>
                    {t.ticketCode || "(no code)"} — {t.category} / {t.tier}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}

        {orders.length === 0 && !loading && (
          <p className="text-sm text-gray-500">No orders found yet.</p>
        )}
      </div>
    </div>
  );
}
