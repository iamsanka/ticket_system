"use client";

import { FormEvent, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";

export function CheckoutForm({
  amount,
  onSuccess,
}: {
  amount: number;
  onSuccess?: (paymentIntentId: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: undefined },
      redirect: "if_required",
    });

    if (error) {
      setErrorMessage(error.message || "Payment failed");
      setLoading(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      // Redirect to thank-you page
      router.push("/thank-you");
      return;
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: 500,
        margin: "0 auto",
        padding: 24,
        borderRadius: 12,
        background: "#111",
        color: "#f5f5f5",
        boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
      }}
    >
      <h2 style={{ marginBottom: 16 }}>Complete your payment</h2>
      <p style={{ marginBottom: 16 }}>
        Total: <strong>{(amount / 100).toFixed(2)} €</strong>
      </p>

      <div style={{ marginBottom: 16 }}>
        <PaymentElement />
      </div>

      {errorMessage && (
        <p style={{ color: "#f87171", marginBottom: 12 }}>{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        style={{
          width: "100%",
          padding: "10px 16px",
          borderRadius: 8,
          border: "none",
          background: "linear-gradient(135deg, #d4af37, #b8860b)",
          color: "#000",
          fontWeight: 600,
          cursor: loading ? "wait" : "pointer",
        }}
      >
        {loading ? "Processing..." : "Pay now"}
      </button>
    </form>
  );
}
