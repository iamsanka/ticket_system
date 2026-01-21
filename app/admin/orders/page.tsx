"use client";

import { useState } from "react";

export default function AdminOrdersPage() {
  const [form, setForm] = useState({
    contactNo: "",
    email: "",
    ticketCode: "",
    paid: "",
    note: "",
  });

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ------------------------------------
  // SUMMARY CALCULATOR
  // ------------------------------------
  function getSummary() {
    const summary = {
      adultLounge: { paid: 0, unpaid: 0 },
      adultStandard: { paid: 0, unpaid: 0 },
      childLounge: { paid: 0, unpaid: 0 },
      childStandard: { paid: 0, unpaid: 0 },
    };

    for (const order of orders) {
      for (const t of order.tickets) {
        const isPaid = order.paid ? "paid" : "unpaid";
        const category = t.category?.toLowerCase();
        const tier = t.tier?.toLowerCase();

        if (category.includes("adult") && tier.includes("lounge")) {
          summary.adultLounge[isPaid]++;
        }
        if (category.includes("adult") && tier.includes("standard")) {
          summary.adultStandard[isPaid]++;
        }
        if (category.includes("child") && tier.includes("lounge")) {
          summary.childLounge[isPaid]++;
        }
        if (category.includes("child") && tier.includes("standard")) {
          summary.childStandard[isPaid]++;
        }
      }
    }

    return summary;
  }

  const summary = getSummary();

  // ------------------------------------
  // SEARCH
  // ------------------------------------
  async function handleSearch(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/admin/orders/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setOrders(data.orders || []);
    setLoading(false);
  }

  // ------------------------------------
  // MARK AS PAID
  // ------------------------------------
  async function markAsPaid(orderId: string) {
    try {
      const res = await fetch("/api/admin/orders/mark-paid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, receiptNote: form.note }),
      });

      const data = await res.json();
      console.log("MarkPaid response:", data);

      if (data.ok) {
        alert(data.message || "Order marked as paid and email sent");

        const refreshed = await fetch("/api/admin/orders/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        const updated = await refreshed.json();
        setOrders(updated.orders || []);
      } else {
        alert(data.error || "Failed to mark as paid");
      }
    } catch (err) {
      console.error("MarkPaid exception:", err);
      alert("Unexpected error while marking as paid");
    }
  }

  // ------------------------------------
  // RESEND EMAIL
  // ------------------------------------
  async function resendEmail(orderId: string) {
    const res = await fetch("/api/admin/orders/resend-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    });

    const data = await res.json();
    if (data.success) {
      alert("Email resent successfully");
    } else {
      alert(data.error || "Failed to resend email");
    }
  }

  return (
    <main className="p-6 max-w-xl mx-auto">
      <button
        onClick={() => (window.location.href = "/admin")}
        className="mb-4 px-4 py-2 bg-yellow-400 text-black font-semibold rounded hover:bg-yellow-300 transition"
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-2xl font-bold mb-6">Order Management</h1>

      {/* ------------------------------------
          SUMMARY TABLE
      ------------------------------------ */}
      <div className="mb-6 border p-4 rounded bg-white text-black">
        <h2 className="text-lg font-semibold mb-3">Ticket Summary</h2>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b p-2">Category</th>
              <th className="border-b p-2">Paid</th>
              <th className="border-b p-2">Unpaid</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border-b">Adult Lounge</td>
              <td className="p-2 border-b">{summary.adultLounge.paid}</td>
              <td className="p-2 border-b">{summary.adultLounge.unpaid}</td>
            </tr>
            <tr>
              <td className="p-2 border-b">Adult Standard</td>
              <td className="p-2 border-b">{summary.adultStandard.paid}</td>
              <td className="p-2 border-b">{summary.adultStandard.unpaid}</td>
            </tr>
            <tr>
              <td className="p-2 border-b">Kids Lounge</td>
              <td className="p-2 border-b">{summary.childLounge.paid}</td>
              <td className="p-2 border-b">{summary.childLounge.unpaid}</td>
            </tr>
            <tr>
              <td className="p-2 border-b">Kids Standard</td>
              <td className="p-2 border-b">{summary.childStandard.paid}</td>
              <td className="p-2 border-b">{summary.childStandard.unpaid}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ------------------------------------
          SEARCH FORM
      ------------------------------------ */}
      <form onSubmit={handleSearch} className="space-y-4 mb-8">
        <h2 className="text-lg font-semibold mb-2">Search Orders</h2>

        <input
          type="text"
          placeholder="Phone (e.g. 0401234567)"
          value={form.contactNo}
          onChange={(e) => setForm({ ...form, contactNo: e.target.value })}
          className="border p-2 w-full rounded text-black"
        />

        <input
          type="email"
          placeholder="Email (e.g. test@example.com)"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border p-2 w-full rounded text-black"
        />

        <input
          type="text"
          placeholder="Ticket Code (e.g. SSAN-005200001)"
          value={form.ticketCode}
          onChange={(e) => setForm({ ...form, ticketCode: e.target.value })}
          className="border p-2 w-full rounded text-black"
        />

        <select
          value={form.paid}
          onChange={(e) => setForm({ ...form, paid: e.target.value })}
          className="border p-2 w-full rounded text-black"
        >
          <option value="">All</option>
          <option value="true">Paid</option>
          <option value="false">Unpaid</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition"
        >
          {loading ? "Searching…" : "Search"}
        </button>
      </form>

      {/* ------------------------------------
          NOTE FILTER
      ------------------------------------ */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Edenred Receipt Note</h2>
        <input
          type="text"
          placeholder="Edenred/ePassi reference or note"
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          className="border p-2 w-full rounded text-black"
        />
      </div>

      {/* ------------------------------------
          RESULTS
      ------------------------------------ */}
      <h2 className="text-lg font-semibold mb-2">Results</h2>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found yet.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => {
            const adultLounge = order.tickets.filter(
              (t: any) =>
                t.category?.toLowerCase().includes("adult") &&
                t.tier?.toLowerCase().includes("lounge"),
            ).length;

            const adultStandard = order.tickets.filter(
              (t: any) =>
                t.category?.toLowerCase().includes("adult") &&
                t.tier?.toLowerCase().includes("standard"),
            ).length;

            const childLounge = order.tickets.filter(
              (t: any) =>
                t.category?.toLowerCase().includes("child") &&
                t.tier?.toLowerCase().includes("lounge"),
            ).length;

            const childStandard = order.tickets.filter(
              (t: any) =>
                t.category?.toLowerCase().includes("child") &&
                t.tier?.toLowerCase().includes("standard"),
            ).length;

            return (
              <li
                key={order.id}
                className="border p-4 rounded bg-white text-black"
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
                  <strong>Paid:</strong> {order.paid ? "TRUE" : "FALSE"}
                </p>
                <p>
                  <strong>Note:</strong> {order.receiptNote || "—"}
                </p>

                <div className="mt-3 space-y-1">
                  <p>
                    <strong>Adults:</strong> Lounge: {adultLounge}, Standard:{" "}
                    {adultStandard}
                  </p>
                  <p>
                    <strong>Children:</strong> Lounge: {childLounge}, Standard:{" "}
                    {childStandard}
                  </p>
                </div>

                <div className="flex gap-3 mt-4">
                  {order.paid ? (
                    <button
                      disabled
                      className="bg-gray-400 text-gray-700 px-4 py-2 rounded cursor-not-allowed"
                    >
                      Already Paid
                    </button>
                  ) : (
                    <button
                      onClick={() => markAsPaid(order.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    >
                      Mark as Paid
                    </button>
                  )}

                  <button
                    onClick={() => resendEmail(order.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    Resend Email
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
