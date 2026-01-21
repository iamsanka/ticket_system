"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TicketCounter } from "@/app/component/TicketCounter";

export default function BookingForm({ eventId }: { eventId: string }) {
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [availability, setAvailability] = useState<{
    adultLoungeRemaining: number;
  } | null>(null);

  const router = useRouter();

  useEffect(() => {
    fetch("/api/ticket-availability")
      .then((res) => res.json())
      .then((data) => setAvailability(data));
  }, []);

  // Email validation function
  function validateEmail(email: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  async function handlePayment(method: "stripe" | "edenred" | "epassi") {
    const form = document.getElementById("booking-form") as HTMLFormElement;
    const formData = new FormData(form);

    const email = String(formData.get("email") || "");

    // Validate email before submitting
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setEmailError("");
    setLoading(true);

    const payload = {
      eventId,
      name: formData.get("name"),
      email,
      contactNo: formData.get("contact"),
      adultLounge: Number(formData.get("adultLounge")),
      adultStandard: Number(formData.get("adultStandard")),
      childLounge: Number(formData.get("childLounge")),
      childStandard: Number(formData.get("childStandard")),
      paymentMethod: method,
    };

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (method === "stripe" && data.clientSecret && data.orderId) {
      router.push(`/checkout?orderId=${data.orderId}`);
      return;
    }

    if ((method === "edenred" || method === "epassi") && data.orderId) {
      router.push(`/edenred-epassi-payment?orderId=${data.orderId}`);
      return;
    }

    alert(data.error || "Checkout failed");
    setLoading(false);
  }

  return (
    <form id="booking-form" className="space-y-6 max-w-md mx-auto px-4">
      {/* Name */}
      <div>
        <label className="block text-left font-medium mb-1">Name</label>
        <input
          name="name"
          required
          className="border p-2 w-full text-black rounded"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-left font-medium mb-1">Email</label>
        <input
          name="email"
          type="email"
          required
          className={`border p-2 w-full text-black rounded ${
            emailError ? "border-red-500" : ""
          }`}
          onChange={(e) => {
            const value = e.target.value;
            if (!validateEmail(value)) {
              setEmailError("Invalid email format.");
            } else {
              setEmailError("");
            }
          }}
        />
        {emailError && (
          <p className="text-red-600 text-sm mt-1">{emailError}</p>
        )}
      </div>

      {/* Contact */}
      <div>
        <label className="block text-left font-medium mb-1">
          Contact Number
        </label>
        <input
          name="contact"
          required
          className="border p-2 w-full text-black rounded"
        />
      </div>

      {/* Adults */}
      <div className="border p-4 rounded-md">
        <h3 className="font-semibold text-lg mb-3">Adults</h3>
        <TicketCounter
          label="Taprobane Lounge"
          name="adultLounge"
          max={availability?.adultLoungeRemaining ?? 10}
          disabled={availability?.adultLoungeRemaining === 0}
        />
        {availability?.adultLoungeRemaining === 0 && (
          <p className="text-sm text-red-600 mt-1">Adult Lounge is sold out.</p>
        )}
        <TicketCounter label="Standard" name="adultStandard" />
      </div>

      {/* Kids */}
      <div className="border p-4 rounded-md">
        <h3 className="font-semibold text-lg mb-3">Kids</h3>
        <TicketCounter label="Taprobane Lounge" name="childLounge" />
        <TicketCounter label="Standard" name="childStandard" />
      </div>

      {/* Payment Method */}
      <div>
        <label className="block text-left font-medium mb-2">
          Payment Method
        </label>
        <div className="space-y-3">
          {/* Card / Klarna */}
          <button
            type="button"
            onClick={() => handlePayment("stripe")}
            disabled={loading}
            className={`w-full border p-3 rounded flex items-center justify-center gap-3 transition-all ${
              loading ? "opacity-50 cursor-wait" : "hover:bg-blue-50"
            }`}
          >
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
            <span className="font-semibold">Card / MobilePay / Klarna</span>
          </button>

          {/* Edenred */}
          <button
            type="button"
            onClick={() => handlePayment("edenred")}
            disabled={loading}
            className={`w-full border p-3 rounded flex items-center justify-center transition-all ${
              loading ? "opacity-50 cursor-wait" : "hover:bg-red-50"
            }`}
          >
            {/* SVG omitted for brevity */}
            Edenred
          </button>

          {/* ePassi */}
          <button
            type="button"
            onClick={() => handlePayment("epassi")}
            disabled={loading}
            className={`w-full border p-3 rounded flex items-center justify-center transition-all ${
              loading ? "opacity-50 cursor-wait" : "hover:bg-purple-50"
            }`}
          >
            {/* SVG omitted for brevity */}
            ePassi
          </button>
        </div>

        <p className="text-sm text-yellow-700 bg-yellow-100 p-2 rounded mt-3">
          Edenred and ePassi require their mobile apps. If you are on a
          computer, a QR code will appear so you can continue on your phone.
        </p>
      </div>
    </form>
  );
}
