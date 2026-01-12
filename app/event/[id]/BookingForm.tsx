"use client";

import { useState } from "react";

export default function BookingForm({ eventId }: { eventId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.target as HTMLFormElement);

    const res = await fetch("/api/checkout", {
      method: "POST",
      body: JSON.stringify({
        eventId,
        name: form.get("name"),
        email: form.get("email"),
        contact: form.get("contact"),
        adults: Number(form.get("adults")),
        children: Number(form.get("children")),
      }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    window.location.href = data.url; // redirect to Stripe
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label>Name</label>
        <input name="name" required className="border p-2 w-full text-black" />
      </div>

      <div>
        <label>Email</label>
        <input
          name="email"
          type="email"
          required
          className="border p-2 w-full text-black"
        />
      </div>

      <div>
        <label>Contact Number</label>
        <input
          name="contact"
          required
          className="border p-2 w-full text-black"
        />
      </div>

      <div>
        <label>Adult Tickets</label>
        <input
          name="adults"
          type="number"
          min={1}
          defaultValue={1}
          className="border p-2 w-full text-black"
        />
      </div>

      <div>
        <label>Child Tickets</label>
        <input
          name="children"
          type="number"
          min={0}
          defaultValue={0}
          className="border p-2 w-full text-black"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
}
