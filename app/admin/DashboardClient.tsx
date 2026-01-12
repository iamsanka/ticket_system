"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Event = {
  id: string;
  title: string;
  date: string;
};

type Order = {
  id: string;
  name: string;
  email: string;
  adultQuantity: number;
  childQuantity: number;
  usedAt: string | null;
};

export default function DashboardClient({ events }: { events: Event[] }) {
  const router = useRouter();
  const [selectedEvent, setSelectedEvent] = useState<string>(
    events[0]?.id ?? ""
  );
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadOrders() {
      if (!selectedEvent) return;
      setLoading(true);
      const res = await fetch(`/api/admin/orders?eventId=${selectedEvent}`);
      const data = await res.json();
      setOrders(data.orders || []);
      setLoading(false);
    }

    loadOrders();
  }, [selectedEvent]);

  const checkInCount = orders.filter((o) => o.usedAt !== null).length;

  async function resendTicket(orderId: string) {
    await fetch(`/api/send-ticket?orderId=${orderId}`);
    alert("Ticket resent");
  }

  async function manualCheckIn(orderId: string) {
    await fetch(`/api/validate-ticket`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    });
    alert("Checked in manually");
  }

  return (
    <main className="p-6 text-white bg-black min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Staff Dashboard</h1>

      {/* Event Selector */}
      <div className="mb-6">
        <label className="block mb-2">Select Event</label>
        <select
          className="text-black p-2 rounded"
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
        >
          {events.map((ev) => (
            <option key={ev.id} value={ev.id}>
              {ev.title} — {new Date(ev.date).toDateString()}
            </option>
          ))}
        </select>
      </div>

      {/* Live Stats */}
      <div className="mb-6">
        <p className="text-xl">
          <strong>Total Attendees:</strong> {orders.length}
        </p>
        <p className="text-xl text-green-400">
          <strong>Checked In:</strong> {checkInCount}
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 mb-10">
        <button
          onClick={() => router.push("/admin")}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
        >
          Check-In Panel
        </button>

        <button
          onClick={() => router.push("/admin/checkin")}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          Open QR Scanner
        </button>
      </div>

      {/* Attendee List */}
      <h2 className="text-2xl font-bold mb-4">Attendees</h2>

      {loading ? (
        <p>Loading attendees…</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border border-gray-700 p-4 rounded flex justify-between"
            >
              <div>
                <p>
                  <strong>{order.name}</strong>
                </p>
                <p>{order.email}</p>
                <p>People: {order.adultQuantity + order.childQuantity}</p>
                <p>
                  Status:{" "}
                  {order.usedAt ? (
                    <span className="text-green-400">Checked In</span>
                  ) : (
                    <span className="text-yellow-400">Not Checked In</span>
                  )}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => resendTicket(order.id)}
                  className="bg-purple-600 px-3 py-1 rounded"
                >
                  Resend Ticket
                </button>

                <button
                  onClick={() => manualCheckIn(order.id)}
                  className="bg-green-600 px-3 py-1 rounded"
                >
                  Manual Check‑In
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
