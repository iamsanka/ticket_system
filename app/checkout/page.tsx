import { StripeProvider } from "@/app/component/StripeProvider";
import { CheckoutForm } from "@/app/component/CheckoutForm";

console.log("🔥 USING CHECKOUT PAGE VERSION FIXED");

interface CheckoutParams {
  searchParams: Promise<Record<string, string>>;
}

async function fetchOrder(orderId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/order?orderId=${orderId}`,
    { cache: "no-store" },
  );

  if (!res.ok) throw new Error("Order not found");
  const data = await res.json();
  return data.order;
}

async function fetchClientSecret(order: any) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({
      eventId: order.eventId,
      name: order.name,
      email: order.email,
      contactNo: order.contactNo,
      adultLounge: order.adultLounge,
      adultStandard: order.adultStandard,
      childLounge: order.childLounge,
      childStandard: order.childStandard,
      paymentMethod: "stripe",
    }),
  });

  if (!res.ok) throw new Error("Failed to create PaymentIntent");
  const data = await res.json();
  return data.clientSecret;
}

export default async function CheckoutPage({ searchParams }: CheckoutParams) {
  const params = await searchParams;
  const orderId = params.orderId;

  if (!orderId) {
    return <div style={{ color: "white", padding: 40 }}>Missing orderId</div>;
  }

  // 1. Load order
  const order = await fetchOrder(orderId);

  // 2. Create PaymentIntent using order details
  const clientSecret = await fetchClientSecret(order);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050505",
        padding: "40px 16px",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h1
          style={{
            color: "#f5f5f5",
            marginBottom: 24,
            textAlign: "center",
          }}
        >
          Checkout
        </h1>

        <StripeProvider clientSecret={clientSecret}>
          <CheckoutForm amount={order.totalAmount} />
        </StripeProvider>
      </div>
    </div>
  );
}
