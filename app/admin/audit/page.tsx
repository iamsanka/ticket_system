"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuditClient from "./AuditClient";

export default function AuditDashboard() {
  const router = useRouter();

  const [role, setRole] = useState<string | null>(null);
  const [tickets, setTickets] = useState<any[] | null>(null);
  const [filtered, setFiltered] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const sessionRes = await fetch("/api/admin/session");
        const sessionData = await sessionRes.json();
        const userRole = sessionData.user?.role || null;
        setRole(userRole);

        if (!userRole) {
          setLoading(false);
          return;
        }

        const orderRes = await fetch("/api/admin/orders");
        const text = await orderRes.text();

        let orderData: any;
        try {
          orderData = JSON.parse(text);
        } catch {
          console.error("JSON parse failed");
          setLoading(false);
          return;
        }

        if (!orderData.orders) {
          console.error("No orders found");
          setLoading(false);
          return;
        }

        const allTickets = orderData.orders.flatMap((order: any) =>
          order.tickets.map((ticket: any) => ({
            ...ticket,
            order,
          })),
        );

        setTickets(allTickets);
        setFiltered(allTickets);
      } catch (err) {
        console.error("Audit load error:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  useEffect(() => {
    if (!tickets) return;

    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    const filteredTickets = tickets.filter((t) => {
      const created = new Date(t.order.createdAt);
      if (from && created < from) return false;
      if (to && created > to) return false;
      return true;
    });

    setFiltered(filteredTickets);
  }, [fromDate, toDate, tickets]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  if (loading || role === null || tickets === null || filtered === null) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-xl">Loading audit view…</p>
      </main>
    );
  }

  if (role !== "ADMIN" && role !== "AUDIT") {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-xl">Access denied.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      {/* ✅ Only one Back button */}
      {role === "ADMIN" && (
        <button
          onClick={() => router.push("/admin")}
          className="mb-6 px-4 py-2 bg-yellow-400 text-black font-semibold rounded hover:bg-yellow-300 transition"
        >
          ← Back to Dashboard
        </button>
      )}

      <h1 className="text-3xl font-bold mb-6">Audit Dashboard</h1>

      {/* ✅ Date Range Filter */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-wrap gap-4 mb-6 items-center"
      >
        <label className="text-white font-medium">From:</label>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="p-2 rounded bg-white text-black border border-gray-300"
        />

        <label className="text-white font-medium">To:</label>
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="p-2 rounded bg-white text-black border border-gray-300"
        />

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition"
        >
          Search
        </button>
      </form>

      {/* ✅ Pass filtered tickets */}
      <AuditClient tickets={filtered} role={role} logout={logout} />
    </main>
  );
}
