"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Scanner } from "@yudiel/react-qr-scanner";

export default function CheckInPage() {
  const router = useRouter();
  const [status, setStatus] = useState<
    "idle" | "success" | "used" | "invalid" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleScan = async (detectedCodes: any[]) => {
    if (!detectedCodes || detectedCodes.length === 0) return;

    const raw = detectedCodes[0].rawValue;
    console.log("RAW QR VALUE:", raw);

    try {
      const parsed = JSON.parse(raw);
      console.log("SENDING ORDER ID:", parsed.orderId);

      const res = await fetch("/api/validate-ticket", {
        method: "POST",
        body: JSON.stringify({ orderId: parsed.orderId }),
      });

      const json = await res.json();
      setStatus(json.status);
      setMessage(json.message);
    } catch (err) {
      console.error("PARSE ERROR:", err);
      setStatus("error");
      setMessage("Invalid QR code");
    }
  };

  return (
    <main className="p-6 text-center text-white bg-black min-h-screen relative">
      <button
        onClick={() => router.push("/admin")}
        className="absolute top-4 left-4 bg-gray-800 text-white px-4 py-2 rounded-lg"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-6">QR Check‑In</h1>

      <div className="w-full max-w-sm mx-auto overflow-hidden rounded-lg">
        <Scanner
          onScan={handleScan}
          onError={(err: unknown) => console.error("Scanner error:", err)}
          constraints={{ facingMode: "environment" }}
        />
      </div>

      <div className="mt-6 text-xl font-semibold">
        {status === "success" && <p className="text-green-400">{message}</p>}
        {status === "used" && <p className="text-yellow-400">{message}</p>}
        {status === "invalid" && <p className="text-red-400">{message}</p>}
        {status === "error" && <p className="text-red-500">{message}</p>}
      </div>
    </main>
  );
}
