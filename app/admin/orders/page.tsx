"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OrderManagement() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [ticketCode, setTicketCode] = useState("");
  const [receiptNote, setReceiptNote] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    setLoading(true);

    try {
      const res = await fetch("/api/admin/orders/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactNo: phone,
          ticketCode,
        }),
      });

      if (!res.ok) {
        console.error("Search failed:", await res.text());
        setOrders([]);
        setLoading(false);
        return;
      }

      const data = await res.json();

      // Ensure each order has a "paid" field for UI state
      const normalized = (data.orders || []).map((o: any) => ({
        ...o,
        paid: o.paid ?? false,
      }));

      setOrders(normalized);
    } catch (err) {
      console.error("Search error:", err);
    }

    setLoading(false);
  }

  async function markAsPaid(orderId: string) {
    try {
      const res = await fetch("/api/admin/orders/mark-paid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, note: receiptNote }),
      });

      if (!res.ok) {
        alert("Failed to mark as paid.");
        return;
      }

      // Update UI immediately
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, paid: true } : o)),
      );
    } catch (err) {
      console.error("Mark-paid error:", err);
      alert("Failed to mark as paid.");
    }
  }

  async function resendEmail(orderId: string) {
    try {
      const res = await fetch("/api/admin/orders/resend-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      if (!res.ok) {
        alert("Failed to resend email.");
        return;
      }

      alert("Email resent!");
    } catch (err) {
      console.error("Resend email error:", err);
      alert("Failed to resend email.");
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center p-6">
      <div className="w-full max-w-xl">
        {/* 🔙 Back to Dashboard */}
        <button
          onClick={() => router.push("/admin")}
          className="mb-6 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold mb-8 text-center">
          Order Management
        </h1>

        {/* 🔍 Search Orders */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Search Orders</h2>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="e.g. 0401234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-gray-800 text-white px-4 py-2 rounded"
            />
            <input
              type="text"
              placeholder="e.g. SSAN-005200001"
              value={ticketCode}
              onChange={(e) => setTicketCode(e.target.value)}
              className="bg-gray-800 text-white px-4 py-2 rounded"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        {/* 🧾 Edenred Receipt Note */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Edenred Receipt Note</h2>
          <p className="text-sm text-gray-300 mb-2">
            When marking an order as paid via Edenred, you can store a note
            here.
          </p>
          <input
            type="text"
            placeholder="Edenred receipt reference or note"
            value={receiptNote}
            onChange={(e) => setReceiptNote(e.target.value)}
            className="bg-gray-800 text-white px-4 py-2 rounded w-full"
          />
        </div>

        {/* 📦 Search Results */}
        {orders.length > 0 ? (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Results</h2>
            <div className="flex flex-col gap-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-gray-800 p-4 rounded border border-gray-700 flex flex-col gap-2"
                >
                  <p>
                    <strong>Name:</strong> {order.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {order.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {order.contactNo}
                  </p>
                  <p>
                    <strong>Tickets:</strong> {order.tickets.length}
                  </p>

                  <div className="flex gap-4 mt-2">
                    {order.paid ? (
                      <button
                        disabled
                        className="bg-gray-600 text-white px-4 py-2 rounded text-sm font-medium cursor-not-allowed"
                      >
                        Already marked
                      </button>
                    ) : (
                      <button
                        onClick={() => markAsPaid(order.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium"
                      >
                        Mark as Paid
                      </button>
                    )}

                    <button
                      onClick={() => resendEmail(order.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium"
                    >
                      Resend Email
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-400">No orders found yet.</p>
        )}
      </div>
    </main>
  );
}
