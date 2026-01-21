"use client";

import { ReactNode, useMemo } from "react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export function StripeProvider({
  clientSecret,
  children,
}: {
  clientSecret: string;
  children: ReactNode;
}) {
  const options: StripeElementsOptions = useMemo(
    () => ({
      clientSecret,
      appearance: {
        theme: "night",
        variables: {
          colorPrimary: "#d4af37",
        },
      },
    }),
    [clientSecret],
  );

  if (!clientSecret) return null;

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}
