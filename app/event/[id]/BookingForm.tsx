"use client";

import { useState, useEffect } from "react";

export default function BookingForm({ eventId }: { eventId: string }) {
  const [loading, setLoading] = useState(false);
  const [availability, setAvailability] = useState<{
    adultLoungeRemaining: number;
  } | null>(null);

  useEffect(() => {
    fetch("/api/ticket-availability")
      .then((res) => res.json())
      .then((data) => setAvailability(data));
  }, []);

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
      paymentMethod: form.get("paymentMethod"),
    };

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    // Edenred / ePassi redirect
    if (data.redirectUrl) {
      window.location.href = data.redirectUrl;
      return;
    }

    // Stripe flow
    if (!data.sessionUrl) {
      alert(data.error || "Checkout failed");
      setLoading(false);
      return;
    }

    window.location.href = data.sessionUrl;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <div>
        <label className="block text-left font-medium mb-1">Name</label>
        <input name="name" required className="border p-2 w-full text-black" />
      </div>

      <div>
        <label className="block text-left font-medium mb-1">Email</label>
        <input
          name="email"
          type="email"
          required
          className="border p-2 w-full text-black"
        />
      </div>

      <div>
        <label className="block text-left font-medium mb-1">
          Contact Number
        </label>
        <input
          name="contact"
          required
          className="border p-2 w-full text-black"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Adult Lounge with limit */}
        <div>
          <label className="block text-left font-medium mb-1">
            Adult Lounge
          </label>
          {availability?.adultLoungeRemaining === 0 && (
            <p className="text-red-600 text-sm font-semibold">Sold Out</p>
          )}
          <input
            name="adultLounge"
            type="number"
            min={0}
            max={availability?.adultLoungeRemaining ?? 10}
            defaultValue={0}
            disabled={availability?.adultLoungeRemaining === 0}
            className={`border p-2 w-full text-black ${
              availability?.adultLoungeRemaining === 0
                ? "bg-gray-200 cursor-not-allowed"
                : ""
            }`}
          />
        </div>

        <div>
          <label className="block text-left font-medium mb-1">
            Adult Standard
          </label>
          <input
            name="adultStandard"
            type="number"
            min={0}
            defaultValue={0}
            className="border p-2 w-full text-black"
          />
        </div>

        <div>
          <label className="block text-left font-medium mb-1">
            Child Lounge
          </label>
          <input
            name="childLounge"
            type="number"
            min={0}
            defaultValue={0}
            className="border p-2 w-full text-black"
          />
        </div>

        <div>
          <label className="block text-left font-medium mb-1">
            Child Standard
          </label>
          <input
            name="childStandard"
            type="number"
            min={0}
            defaultValue={0}
            className="border p-2 w-full text-black"
          />
        </div>
      </div>

      {/* Payment Method */}
      <div>
        <label className="block text-left font-medium mb-1">
          Payment Method
        </label>
        <select
          name="paymentMethod"
          required
          className="border p-2 w-full text-black"
        >
          <option value="stripe">Card (Stripe)</option>
          <option value="edenred">Edenred Pay</option>
          {/**<option value="epassi">ePassi</option>**/}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
}
