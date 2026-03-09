"use client";

import { useRouter } from "next/navigation";

export default function AdminRaffleMenu() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center p-10">
      <h1 className="text-4xl font-bold mb-10">Raffle Draw</h1>

      <div className="flex flex-col gap-6 w-full max-w-sm">
        {/* Manual Raffle */}
        <button
          onClick={() => router.push("/admin/raffle/manual")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 rounded-lg text-xl font-semibold"
        >
          Raffle Management
        </button>

        {/* Manual Reveal Page */}
        <button
          onClick={() => router.push("/raffle/manual")}
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-4 rounded-lg text-xl font-semibold"
        >
          Manual Raffle Draw
        </button>

        {/* ⭐ NEW — Random Raffle Page */}
        <button
          onClick={() => router.push("/raffle/random")}
          className="bg-yellow-600 hover:bg-yellow-700 text-black px-6 py-4 rounded-lg text-xl font-semibold"
        >
          Random Raffle Draw
        </button>

        {/* Back */}
        <button
          onClick={() => router.push("/admin")}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-4 rounded-lg text-xl font-semibold mt-4"
        >
          Back to Dashboard
        </button>
      </div>
    </main>
  );
}
