"use client";

import { useState } from "react";

export default function BookingForm({ eventId }: { eventId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.target as HTMLFormElement);

    const payload = {
      eventId,
      name: form.get("name"),
      email: form.get("email"),
      contactNo: form.get("contact"),
      adultLounge: Number(form.get("adultLounge")),
      adultStandard: Number(form.get("adultStandard")),
      childLounge: Number(form.get("childLounge")),
      childStandard: Number(form.get("childStandard")),
    };

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!data.sessionUrl) {
      alert("Checkout failed");
      setLoading(false);
      return;
    }

    // ⭐ Redirect user to Stripe Checkout
    window.location.href = data.sessionUrl;
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>Adult Lounge</label>
          <input
            name="adultLounge"
            type="number"
            min={0}
            defaultValue={0}
            className="border p-2 w-full text-black"
          />
        </div>

        <div>
          <label>Adult Standard</label>
          <input
            name="adultStandard"
            type="number"
            min={0}
            defaultValue={0}
            className="border p-2 w-full text-black"
          />
        </div>

        <div>
          <label>Child Lounge</label>
          <input
            name="childLounge"
            type="number"
            min={0}
            defaultValue={0}
            className="border p-2 w-full text-black"
          />
        </div>

        <div>
          <label>Child Standard</label>
          <input
            name="childStandard"
            type="number"
            min={0}
            defaultValue={0}
            className="border p-2 w-full text-black"
          />
        </div>
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
