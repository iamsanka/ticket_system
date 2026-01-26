"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";

export default function AuditClient({
  tickets,
  role,
  logout,
}: {
  tickets: any[];
  role: string;
  logout: () => void;
}) {
  const router = useRouter();

  const summary = useMemo(() => {
    const result = {
      ADULT_LOUNGE: { count: 0, total: 0 },
      ADULT_STANDARD: { count: 0, total: 0 },
      CHILD_LOUNGE: { count: 0, total: 0 },
      CHILD_STANDARD: { count: 0, total: 0 },
      grandTotal: 0,
      edenredFees: 0,
      epassiFees: 0,
      paymentTotals: {
        stripe: 0,
        klarna: 0,
        edenred: 0,
        epassi: 0,
      },
    };

    const orderTotals: Record<string, number> = {};
    const serviceFees: Record<string, number> = {};
    const paymentMethods: Record<string, string> = {};

    for (const t of tickets) {
      const key = `${t.category}_${t.tier}` as
        | "ADULT_LOUNGE"
        | "ADULT_STANDARD"
        | "CHILD_LOUNGE"
        | "CHILD_STANDARD";

      if (!result[key]) continue;

      result[key].count += 1;

      const event = t.order.event;
      let price = 0;
      if (key === "ADULT_LOUNGE") price = event.adultLoungePrice / 100;
      if (key === "ADULT_STANDARD") price = event.adultStandardPrice / 100;
      if (key === "CHILD_LOUNGE") price = event.childLoungePrice / 100;
      if (key === "CHILD_STANDARD") price = event.childStandardPrice / 100;

      result[key].total += price;
      result.grandTotal += price;

      const orderId = t.order.id;
      orderTotals[orderId] = (orderTotals[orderId] || 0) + price;
      paymentMethods[orderId] = t.order.paymentMethod || "";

      if (!(orderId in serviceFees)) {
        serviceFees[orderId] = t.order.serviceFee || 0;
      }
    }

    for (const orderId in orderTotals) {
      const method = paymentMethods[orderId];
      const amount = orderTotals[orderId];

      if (method === "stripe") result.paymentTotals.stripe += amount;
      if (method === "klarna") result.paymentTotals.klarna += amount;
      if (method === "edenred") result.paymentTotals.edenred += amount;
      if (method === "epassi") result.paymentTotals.epassi += amount;

      const fee = serviceFees[orderId] / 100;
      if (method === "edenred") result.edenredFees += fee;
      if (method === "epassi") result.epassiFees += fee;
    }

    return result;
  }, [tickets]);

  return (
    <main className="min-h-screen bg-black text-white p-8">
      {/** 
      {role === "ADMIN" && (
        <button
          onClick={() => router.push("/admin")}
          className="mb-6 px-4 py-2 bg-yellow-400 text-black font-semibold rounded hover:bg-yellow-300 transition"
        >
          ← Back to Dashboard
        </button>
      )}
      */}

      <h2 className="text-xl font-semibold mb-4">Ticket Sales Overview</h2>
      <section className="bg-gray-900 p-6 rounded-lg shadow-lg mb-8">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="pb-2">Category</th>
              <th className="pb-2">Tickets Sold</th>
              <th className="pb-2">Total Amount (€)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Adult Taprobane LOUNGE</td>
              <td>{summary.ADULT_LOUNGE.count}</td>
              <td>{summary.ADULT_LOUNGE.total.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Adult Taprobane STANDARD</td>
              <td>{summary.ADULT_STANDARD.count}</td>
              <td>{summary.ADULT_STANDARD.total.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Child Taprobane LOUNGE</td>
              <td>{summary.CHILD_LOUNGE.count}</td>
              <td>{summary.CHILD_LOUNGE.total.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Child Taprobane STANDARD</td>
              <td>{summary.CHILD_STANDARD.count}</td>
              <td>{summary.CHILD_STANDARD.total.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <p className="mt-4 text-lg font-bold">
          Grand Total: {summary.grandTotal.toFixed(2)} €
        </p>
      </section>

      <section className="bg-gray-900 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Service Charges</h2>
        <p>Edenred Fees Total: {summary.edenredFees.toFixed(2)} €</p>
        <p>ePassi Fees Total: {summary.epassiFees.toFixed(2)} €</p>
      </section>

      <section className="bg-gray-900 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          Payment Breakdown (without service charges)
        </h2>

        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="pb-2">Method</th>
              <th className="pb-2">Total Paid (€)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Stripe</td>
              <td>{summary.paymentTotals.stripe.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Klarna</td>
              <td>{summary.paymentTotals.klarna.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Edenred</td>
              <td>{summary.paymentTotals.edenred.toFixed(2)}</td>
            </tr>
            <tr>
              <td>ePassi</td>
              <td>{summary.paymentTotals.epassi.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </section>

      {role === "AUDIT" && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      )}
    </main>
  );
}
