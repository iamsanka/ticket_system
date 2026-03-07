"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TicketManagementPage() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    const res = await fetch(
      `/api/admin/orders/search?q=${encodeURIComponent(query)}`,
    );
    const data = await res.json();
    setResults(data.orders || []);
    setLoading(false);
  }

  async function deleteOrder(orderId: string) {
    const confirmed = confirm(
      "⚠️ This will permanently delete the order AND all its tickets.\n\nAre you sure?",
    );

    if (!confirmed) return;

    const res = await fetch("/api/admin/orders/force-delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    });

    if (res.ok) {
      setResults((prev) => prev.filter((o) => o.id !== orderId));
      alert("Order and all tickets deleted successfully.");
    } else {
      const data = await res.json();
      alert("Failed to delete order: " + data.error);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Ticket Management</h1>

      {/* Back to Dashboard Button */}
      <button
        onClick={() => router.push("/admin")}
        className="mb-6 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
      >
        ← Back to Dashboard
      </button>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6 max-w-xl">
        <input
          className="flex-1 p-3 rounded bg-gray-800 border border-gray-700 text-white"
          placeholder="Search by ticket code, email, or phone…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded font-semibold"
        >
          Search
        </button>
      </form>

      {/* Create New Tickets */}
      <button
        onClick={() => router.push("/admin/tickets/create")}
        className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded font-semibold mb-10"
      >
        Create New Tickets
      </button>

      {/* Results */}
      {loading && <p className="text-lg">Searching…</p>}

      {!loading && results.length === 0 && query && (
        <p className="text-gray-400">No results found.</p>
      )}

      <div className="space-y-6">
        {results.map((order) => (
          <div
            key={order.id}
            className="border border-gray-700 p-5 rounded-lg bg-gray-900"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xl font-bold">{order.name || "Guest"}</p>
                <p>{order.email}</p>
                {order.contactNo && <p>{order.contactNo}</p>}
                <p className="text-sm text-gray-400 mt-1">
                  Order ID: {order.id}
                </p>
                <p className="text-sm text-gray-400">
                  Event: {order.event?.title}
                </p>
              </div>

              <button
                onClick={() => deleteOrder(order.id)}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold"
              >
                Force Delete
              </button>
            </div>

            {/* Ticket List */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Tickets</h3>
              <ul className="space-y-1 text-sm">
                {order.tickets.map((t: any) => (
                  <li key={t.id} className="text-gray-300">
                    <strong>{t.ticketCode}</strong> — {t.category} / {t.tier}
                    {t.usedAt && (
                      <span className="text-green-400 ml-2">(Used)</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
