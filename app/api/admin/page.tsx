"use client";

import { useRouter } from "next/navigation";

export default function StaffDashboard() {
  const router = useRouter();

  function logout() {
    document.cookie = "admin_session=; Max-Age=0; path=/;";
    router.push("/admin/login");
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6">
      <div className="bg-[#111] border border-[#222] shadow-xl rounded-xl p-10 w-full max-w-md">
        <h1 className="text-4xl font-bold mb-10 text-center text-white">
          Staff Dashboard
        </h1>

        <div className="flex flex-col gap-5">
          <button
            onClick={() => router.push("/admin/checkin")}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-xl font-semibold shadow-md transition"
          >
            Check-In Panel
          </button>

          <button
            onClick={() => router.push("/admin/scanner")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-xl font-semibold shadow-md transition"
          >
            Open QR Scanner
          </button>

          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg text-xl font-semibold shadow-md transition mt-4"
          >
            Logout
          </button>
        </div>
      </div>
    </main>
  );
}
