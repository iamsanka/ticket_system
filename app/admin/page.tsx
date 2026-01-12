"use client";

import { useRouter } from "next/navigation";

export default function StaffHome() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-10">Staff Panel</h1>

      <button
        onClick={() => router.push("/admin/checkin")}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-xl font-semibold"
      >
        Scan Tickets
      </button>
    </main>
  );
}
