"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Types
type Ticket = {
  id: string;
  category: "ADULT" | "CHILD";
  tier: "LOUNGE" | "STANDARD";
  usedAt: string | null;
};

type Event = {
  id: string;
  title: string;
  date: string;
  venue: string;
};

type OrderType = {
  id: string;
  name: string | null;
  email: string;
  contactNo: string | null;
  tickets: Ticket[];
  event: Event;
};

export default function UpgradePage() {
  const router = useRouter();
  const [ticketCode, setTicketCode] = useState("");
  const [order, setOrder] = useState<OrderType | null>(null);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function searchOrder() {
    setLoading(true);
    const res = await fetch(
      `/api/admin/upgrade/search?ticketCode=${ticketCode}`,
    );
    const data = await res.json();
    setOrder(data.order || null);
    setLoading(false);
  }

  async function upgradeOrder() {
    if (!order) return;

    const res = await fetch("/api/admin/upgrade", {
      method: "POST",
      body: JSON.stringify({ orderId: order.id }),
    });

    const data = await res.json();
    alert(data.message);

    setOrder(null);
    setTicketCode("");
    setShowConfirm(false);
  }

  return (
    <main className="p-8 text-white bg-black min-h-screen">
      {/* Back Button */}
      <button
        onClick={() => router.push("/admin")}
        className="mb-6 px-4 py-2 bg-yellow-400 text-black font-semibold rounded hover:bg-yellow-300 transition"
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-3xl font-bold mb-6">Upgrade Ticket</h1>

      {/* Search Input */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Enter Ticket Code"
          value={ticketCode}
          onChange={(e) => setTicketCode(e.target.value)}
          className="p-3 rounded text-black bg-white w-64 border border-gray-300"
        />
        <button
          onClick={searchOrder}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
        >
          Search
        </button>
      </div>

      {loading && <p>Searching…</p>}

      {order && (
        <div className="bg-gray-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Order Found</h2>

          <p>
            <strong>Name:</strong> {order.name}
          </p>
          <p>
            <strong>Email:</strong> {order.email}
          </p>
          <p>
            <strong>Tickets:</strong> {order.tickets.length}
          </p>

          <button
            onClick={() => setShowConfirm(true)}
            className="mt-4 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded text-black font-semibold"
          >
            Upgrade Order
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-white text-black p-6 rounded-lg w-80 shadow-xl">
            <h3 className="text-lg font-bold mb-4">Are you sure?</h3>
            <p className="mb-6">
              This will cancel the old tickets and generate new Lounge tickets.
            </p>

            <div className="flex justify-between">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                No
              </button>

              <button
                onClick={upgradeOrder}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Yes, Upgrade
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
