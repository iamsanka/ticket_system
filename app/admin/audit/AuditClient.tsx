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
    };

    const countedOrders = new Set<string>();

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

      // ✅ Only count serviceFee once per order
      const orderId = t.order.id;
      if (!countedOrders.has(orderId)) {
        countedOrders.add(orderId);

        if (t.order.paymentMethod === "edenred") {
          result.edenredFees += t.order.serviceFee / 100;
        }
        if (t.order.paymentMethod === "epassi") {
          result.epassiFees += t.order.serviceFee / 100;
        }
      }
    }

    return result;
  }, [tickets]);

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Audit Dashboard</h1>

      {/* Role-based buttons */}
      {role === "ADMIN" && (
        <button
          onClick={() => router.push("/admin")}
          className="mb-6 px-4 py-2 bg-yellow-400 text-black font-semibold rounded hover:bg-yellow-300 transition"
        >
          ← Back to Dashboard
        </button>
      )}

      {role === "AUDIT" && (
        <button
          onClick={logout}
          className="mb-6 px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      )}

      {/* Ticket Sales Overview */}
      <section className="bg-gray-900 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Ticket Sales Overview</h2>

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

      {/* Payment Fees */}
      <section className="bg-gray-900 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Payment Fees</h2>
        <p>Edenred Fees Total: {summary.edenredFees.toFixed(2)} €</p>
        <p>ePassi Fees Total: {summary.epassiFees.toFixed(2)} €</p>
      </section>
    </main>
  );
}
