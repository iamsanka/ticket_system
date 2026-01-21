"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Event = {
  id: string;
  title: string;
  date: string;
};

type TicketSummary = {
  usedAt: string | null;
};

type Order = {
  id: string;
  name: string | null;
  email: string;
  contactNo: string | null;
  adultLounge: number;
  adultStandard: number;
  childLounge: number;
  childStandard: number;
  tickets: TicketSummary[];
};

export default function DashboardClient({ events }: { events: Event[] }) {
  const router = useRouter();
  const [selectedEvent, setSelectedEvent] = useState<string>(
    events[0]?.id ?? "",
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

  const totalAttendees = orders.reduce((sum, o) => {
    return (
      sum + o.adultLounge + o.adultStandard + o.childLounge + o.childStandard
    );
  }, 0);

  const checkedInTickets = orders.reduce((sum, o) => {
    return sum + o.tickets.filter((t) => t.usedAt !== null).length;
  }, 0);

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
      <div className="mb-6 space-y-1">
        <p className="text-xl">
          <strong>Total Orders:</strong> {orders.length}
        </p>
        <p className="text-xl">
          <strong>Total Attendees (tickets):</strong> {totalAttendees}
        </p>
        <p className="text-xl text-green-400">
          <strong>Tickets Checked In:</strong> {checkedInTickets}
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
      <h2 className="text-2xl font-bold mb-4">Orders</h2>

      {loading ? (
        <p>Loading attendees…</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const peopleCount =
              order.adultLounge +
              order.adultStandard +
              order.childLounge +
              order.childStandard;

            const ticketsCheckedIn = order.tickets.filter(
              (t) => t.usedAt !== null,
            ).length;

            const isFullyCheckedIn =
              peopleCount > 0 && ticketsCheckedIn >= peopleCount;

            return (
              <div
                key={order.id}
                className="border border-gray-700 p-4 rounded flex justify-between"
              >
                <div>
                  <p>
                    <strong>{order.name || "Guest"}</strong>
                  </p>
                  <p>{order.email}</p>
                  {order.contactNo && <p>{order.contactNo}</p>}
                  <p>People: {peopleCount}</p>
                  <p>
                    Status:{" "}
                    {isFullyCheckedIn ? (
                      <span className="text-green-400">Fully Checked In</span>
                    ) : ticketsCheckedIn > 0 ? (
                      <span className="text-yellow-400">
                        Partially Checked In ({ticketsCheckedIn}/{peopleCount})
                      </span>
                    ) : (
                      <span className="text-red-400">Not Checked In</span>
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
            );
          })}
        </div>
      )}
    </main>
  );
}
