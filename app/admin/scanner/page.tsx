"use client";

import { useState } from "react";

export default function ScannerPage() {
  const [qrCode, setQrCode] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function validateTicket() {
    if (!qrCode) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/validate-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrCode }),
      });

      const json = await res.json();
      setResult(json);
    } catch (err) {
      setResult({ valid: false, reason: "Network error" });
    }

    setLoading(false);
  }

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">QR Scanner</h1>

      <div className="flex gap-2 mb-4">
        <input
          value={qrCode}
          onChange={(e) => setQrCode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && validateTicket()}
          placeholder="Scan or enter QR code"
          className="border p-3 flex-1 rounded"
        />
        <button
          onClick={validateTicket}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Check
        </button>
      </div>

      {loading && <p className="text-gray-600 font-medium">Validating…</p>}

      {result && (
        <div
          className={`mt-4 p-4 rounded border ${
            result.valid
              ? "border-green-500 bg-green-50"
              : "border-red-500 bg-red-50"
          }`}
        >
          {result.valid ? (
            <>
              <p className="text-green-700 font-bold text-xl mb-2">
                Ticket Valid
              </p>
              <p>
                <strong>Category:</strong> {result.category}
              </p>
              <p>
                <strong>Tier:</strong> {result.tier}
              </p>
              <p>
                <strong>Name:</strong> {result.name}
              </p>
              <p>
                <strong>Email:</strong> {result.email}
              </p>
              <p>
                <strong>Event:</strong> {result.event}
              </p>
            </>
          ) : (
            <>
              <p className="text-red-700 font-bold text-xl mb-2">
                Ticket Invalid
              </p>
              <p>{result.reason}</p>
            </>
          )}
        </div>
      )}
    </main>
  );
}
