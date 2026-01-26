"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuditClient from "./AuditClient";

export default function AuditDashboard() {
  const router = useRouter();

  const [role, setRole] = useState<string | null>(null);
  const [tickets, setTickets] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // 1. Load session role
        const sessionRes = await fetch("/api/admin/session");
        const sessionData = await sessionRes.json();
        const userRole = sessionData.user?.role || null;
        setRole(userRole);

        if (!userRole) {
          setLoading(false);
          return;
        }

        // 2. Load orders with embedded tickets
        const orderRes = await fetch("/api/admin/orders");
        const text = await orderRes.text();
        console.log("RAW /api/admin/orders RESPONSE:", text);

        let orderData: any;
        try {
          orderData = JSON.parse(text);
        } catch {
          console.error("JSON parse failed — response was not JSON");
          setLoading(false);
          return;
        }

        if (!orderData.orders) {
          console.error("No orders field in response");
          setLoading(false);
          return;
        }

        // 3. Flatten ONLY actual tickets from the tickets table
        const allTickets = orderData.orders.flatMap((order: any) =>
          order.tickets.map((ticket: any) => ({
            ...ticket,
            order, // attach parent order for event + payment info
          })),
        );

        setTickets(allTickets);
      } catch (err) {
        console.error("Audit load error:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  if (loading || role === null || tickets === null) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-xl">Loading audit view…</p>
      </main>
    );
  }

  // Role gate: only ADMIN + AUDIT should see this page
  if (role !== "ADMIN" && role !== "AUDIT") {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-xl">Access denied.</p>
      </main>
    );
  }

  return <AuditClient tickets={tickets} role={role} logout={logout} />;
}
