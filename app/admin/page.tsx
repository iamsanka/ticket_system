"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/session");
      const data = await res.json();
      setRole(data.user?.role || null);
    }
    load();
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  if (role === null) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-xl">Loading dashboard…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-10">
        {role === "ADMIN" && "Admin Dashboard"}
        {role === "AUDIT" && "Audit Dashboard"}
        {role === "STAFF" && "Staff Dashboard"}
      </h1>

      <div className="flex flex-col gap-4 w-full max-w-sm">
        {(role === "STAFF" || role === "ADMIN") && (
          <>
            <button
              onClick={() => router.push("/admin/checkin")}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-xl font-semibold"
            >
              Check-In Panel
            </button>

            <button
              onClick={() => router.push("/admin/scanner")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-xl font-semibold"
            >
              Open QR Scanner
            </button>
          </>
        )}

        {role === "ADMIN" && (
          <>
            <button
              onClick={() => router.push("/admin/orders")}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg text-xl font-semibold"
            >
              Order Management
            </button>

            <button
              onClick={() => router.push("/admin/audit")}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg text-xl font-semibold"
            >
              Audit Dashboard
            </button>

            <button
              onClick={() => router.push("/admin/users")}
              className="bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-lg text-xl font-semibold"
            >
              Manage Users
            </button>

            {/* ⭐ NEW BUTTON — Upgrade Ticket */}
            <button
              onClick={() => router.push("/admin/upgrade")}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg text-xl font-semibold"
            >
              Upgrade Ticket
            </button>
          </>
        )}

        {role === "AUDIT" && (
          <button
            onClick={() => router.push("/admin/audit")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg text-xl font-semibold"
          >
            Audit Dashboard
          </button>
        )}

        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg text-xl font-semibold mt-6"
        >
          Logout
        </button>
      </div>
    </main>
  );
}
