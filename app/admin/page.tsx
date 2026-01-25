"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function StaffDashboard() {
  const router = useRouter();

  function logout() {
    // Clear session cookie
    document.cookie = "admin_session=; Max-Age=0; path=/;";

    // Optional: show toast (if you use a toast system)
    // toast.success("Logged out successfully");

    // Redirect to login
    router.push("/admin/login");
  }

  // Scroll to top on load (optional UX polish)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-10">Staff Dashboard</h1>

      <div className="flex flex-col gap-4 w-full max-w-sm">
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

        <button
          onClick={() => router.push("/admin/orders")}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg text-xl font-semibold"
        >
          Order Management
        </button>

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
