"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Event = {
  id: string;
  title: string;
  date: string;
};

export default function CreateTicketsPage() {
  const router = useRouter();

  const [events, setEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  const [form, setForm] = useState({
    eventId: "",
    name: "",
    email: "",
    contactNo: "",
    adultLounge: 0,
    adultStandard: 0,
    childLounge: 0,
    childStandard: 0,
    totalAmount: 0, // <-- ADDED
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadEvents() {
      const res = await fetch("/api/admin/events");
      const data = await res.json();
      setEvents(data.events || []);
      setLoadingEvents(false);

      if (data.events?.length > 0) {
        setForm((f) => ({ ...f, eventId: data.events[0].id }));
      }
    }

    loadEvents();
  }, []);

  function updateField(field: string, value: any) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const res = await fetch("/api/admin/orders/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSubmitting(false);

    if (res.ok) {
      alert("Tickets created and email sent!");
      router.push("/admin/tickets");
    } else {
      alert("Failed to create tickets.");
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Tickets</h1>

      <button
        onClick={() => router.push("/admin/tickets")}
        className="mb-6 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
      >
        ← Back to Ticket Management
      </button>

      {loadingEvents ? (
        <p>Loading events…</p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="max-w-xl space-y-4 bg-gray-900 p-6 rounded-lg border border-gray-700"
        >
          {/* Event Selector */}
          <div>
            <label className="block mb-1">Event</label>
            <select
              className="w-full p-2 rounded bg-gray-800 border border-gray-700"
              value={form.eventId}
              onChange={(e) => updateField("eventId", e.target.value)}
            >
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.title} — {new Date(ev.date).toDateString()}
                </option>
              ))}
            </select>
          </div>

          {/* Customer Info */}
          <div>
            <label className="block mb-1">Customer Name</label>
            <input
              className="w-full p-2 rounded bg-gray-800 border border-gray-700"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              className="w-full p-2 rounded bg-gray-800 border border-gray-700"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1">Contact Number</label>
            <input
              className="w-full p-2 rounded bg-gray-800 border border-gray-700"
              value={form.contactNo}
              onChange={(e) => updateField("contactNo", e.target.value)}
            />
          </div>

          {/* Ticket Counts */}
          <h2 className="text-xl font-semibold mt-6">Ticket Quantities</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Adult Lounge</label>
              <input
                type="number"
                min={0}
                className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                value={form.adultLounge}
                onChange={(e) =>
                  updateField("adultLounge", Number(e.target.value))
                }
              />
            </div>

            <div>
              <label className="block mb-1">Adult Standard</label>
              <input
                type="number"
                min={0}
                className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                value={form.adultStandard}
                onChange={(e) =>
                  updateField("adultStandard", Number(e.target.value))
                }
              />
            </div>

            <div>
              <label className="block mb-1">Child Lounge</label>
              <input
                type="number"
                min={0}
                className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                value={form.childLounge}
                onChange={(e) =>
                  updateField("childLounge", Number(e.target.value))
                }
              />
            </div>

            <div>
              <label className="block mb-1">Child Standard</label>
              <input
                type="number"
                min={0}
                className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                value={form.childStandard}
                onChange={(e) =>
                  updateField("childStandard", Number(e.target.value))
                }
              />
            </div>
          </div>

          {/* Total Amount */}
          <div>
            <label className="block mb-1">Total Amount (€)</label>
            <input
              type="number"
              min={0}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700"
              value={form.totalAmount}
              onChange={(e) =>
                updateField("totalAmount", Number(e.target.value))
              }
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-green-600 hover:bg-green-700 px-4 py-3 rounded font-semibold mt-6 disabled:opacity-50"
          >
            {submitting ? "Creating…" : "Create Tickets & Send Email"}
          </button>
        </form>
      )}
    </main>
  );
}
