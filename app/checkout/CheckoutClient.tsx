"use client";

import { CheckoutForm } from "@/app/component/CheckoutForm";

export function CheckoutClient({ amount }: { amount: number }) {
  return (
    <CheckoutForm
      amount={amount}
      onSuccess={(paymentIntentId: string) => {
        console.log("Payment succeeded:", paymentIntentId);
      }}
    />
  );
}
