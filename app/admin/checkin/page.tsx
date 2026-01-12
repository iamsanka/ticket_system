"use client";

import { useEffect, useState } from "react";
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
  contactNo: string;
  adultQuantity: number;
  childQuantity: number;
  usedAt: string | null;
};

export default function CheckInPanel() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadEvents() {
      const res = await fetch("/api/admin/events");
      const data = await res.json();
      setEvents(data.events);
      setSelectedEvent(data.events[0]?.id ?? "");
    }
    loadEvents();
  }, []);

  useEffect(() => {
    async function loadOrders() {
      if (!selectedEvent) return;
      setLoading(true);

      const res = await fetch(
        `/api/admin/orders?eventId=${selectedEvent}&search=${search}`
      );

      const data = await res.json();
      setOrders(data.orders || []);
      setLoading(false);
    }

    loadOrders();
  }, [selectedEvent, search]);

  const filteredOrders = orders; // server-side filtering now

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
      {/* Back Button */}
      <button
        onClick={() => router.push("/admin")}
        className="bg-gray-800 text-white px-4 py-2 rounded-lg mb-6"
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-3xl font-bold mb-6">Check-In Panel</h1>

      {/* Event Selector */}
      <div className="mb-6">
        <label className="block mb-2">Select Event</label>
        <select
          className="bg-gray-900 text-white p-2 rounded border border-gray-600"
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
        >
          {events.map((ev) => (
            <option
              key={ev.id}
              value={ev.id}
              style={{ color: "white", backgroundColor: "#111" }}
            >
              {ev.title} — {new Date(ev.date).toDateString()}
            </option>
          ))}
        </select>
      </div>

      {/* Search Field */}
      <div className="mb-6 w-full max-w-md">
        <label className="block mb-2 text-lg font-medium">
          Search by Phone Number
        </label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Enter phone number..."
          className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Live Stats */}
      <div className="mb-6">
        <p className="text-xl">
          <strong>Total Attendees:</strong> {filteredOrders.length}
        </p>
        <p className="text-xl text-green-400">
          <strong>Checked In:</strong>{" "}
          {filteredOrders.filter((o) => o.usedAt !== null).length}
        </p>
      </div>

      {/* Attendee List */}
      <h2 className="text-2xl font-bold mb-4">Attendees</h2>

      {loading ? (
        <p>Loading attendees…</p>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="border border-gray-700 p-4 rounded flex justify-between"
            >
              <div>
                <p>
                  <strong>{order.name}</strong>
                </p>
                <p>{order.email}</p>
                <p>Phone: {order.contactNo}</p>
                <p>People: {order.adultQuantity}</p>
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
