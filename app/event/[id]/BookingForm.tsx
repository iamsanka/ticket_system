"use client";

import { useState, useEffect } from "react";
import EdenredQR from "@/app/component/EdenredQR";

export default function BookingForm({ eventId }: { eventId: string }) {
  const [loading, setLoading] = useState(false);
  const [showEdenredQR, setShowEdenredQR] = useState(false);
  const [availability, setAvailability] = useState<{
    adultLoungeRemaining: number;
  } | null>(null);

  // ⭐ REAL EDENRED LINK
  const EDENRED_LINK =
    "https://myedenred.fi/affiliate-payment/d0cd66d3-ee1f-4535-b8ed-a8dffa5320e7";

  // ⭐ Detect mobile device
  function isMobileDevice() {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  // ⭐ Try to open Edenred app, fallback if not installed
  function openEdenredApp(link: string) {
    const start = Date.now();
    window.location.href = link;

    setTimeout(() => {
      if (Date.now() - start < 1500) {
        alert(
          "It looks like the Edenred app is not installed. Please install the Edenred app and try again.",
        );
      }
    }, 1200);
  }

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

    // ⭐ EDENRED FLOW
    if (data.redirectUrl && payload.paymentMethod === "edenred") {
      if (isMobileDevice()) {
        openEdenredApp(EDENRED_LINK);
      } else {
        setShowEdenredQR(true);
      }
      return;
    }

    // ⭐ STRIPE FLOW
    if (!data.sessionUrl) {
      alert(data.error || "Checkout failed");
      setLoading(false);
      return;
    }

    window.location.href = data.sessionUrl;
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
        {/* Name */}
        <div>
          <label className="block text-left font-medium mb-1">Name</label>
          <input
            name="name"
            required
            className="border p-2 w-full text-black"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-left font-medium mb-1">Email</label>
          <input
            name="email"
            type="email"
            required
            className="border p-2 w-full text-black"
          />
        </div>

        {/* Contact */}
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

        {/* Adults Section */}
        <div className="border p-4 rounded-md">
          <h3 className="font-semibold text-lg mb-3">Adults</h3>

          {/* Adult Lounge */}
          <div className="mb-4">
            <label className="block text-left font-medium mb-1">
              Taprobane Lounge
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

          {/* Adult Standard */}
          <div>
            <label className="block text-left font-medium mb-1">Standard</label>
            <input
              name="adultStandard"
              type="number"
              min={0}
              defaultValue={0}
              className="border p-2 w-full text-black"
            />
          </div>
        </div>

        {/* Kids Section */}
        <div className="border p-4 rounded-md">
          <h3 className="font-semibold text-lg mb-3">Kids</h3>

          {/* Child Lounge */}
          <div className="mb-4">
            <label className="block text-left font-medium mb-1">
              Taprobane Lounge
            </label>
            <input
              name="childLounge"
              type="number"
              min={0}
              defaultValue={0}
              className="border p-2 w-full text-black"
            />
          </div>

          {/* Child Standard */}
          <div>
            <label className="block text-left font-medium mb-1">Standard</label>
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
          </select>

          {/* ⭐ Edenred Warning */}
          {true && (
            <p className="text-sm text-yellow-700 bg-yellow-100 p-2 rounded mt-2">
              Edenred Pay requires the Edenred mobile app. If you are on a
              computer, a QR code will appear so you can continue on your phone.
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Processing..." : "Buy Tickets"}
        </button>
      </form>

      {/* ⭐ QR Popup */}
      {showEdenredQR && (
        <EdenredQR
          link={EDENRED_LINK}
          onClose={() => setShowEdenredQR(false)}
        />
      )}
    </>
  );
}
