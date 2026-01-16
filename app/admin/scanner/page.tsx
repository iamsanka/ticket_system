"use client";

import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";

export default function ScannerPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function validate(qrCode: string) {
    if (!scannerRef.current) return;

    // 🔥 Stop scanning immediately to prevent double scans
    scannerRef.current.stop();

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

    // ⏳ Cooldown before scanning again
    setTimeout(() => {
      setResult(null);
      scannerRef.current?.start(); // 🔥 Restart scanner
    }, 3000); // 3 seconds
  }

  useEffect(() => {
    if (!videoRef.current) return;

    const scanner = new QrScanner(
      videoRef.current,
      (qrResult) => {
        validate(qrResult.data);
      },
      {
        highlightScanRegion: true,
        highlightCodeOutline: true,
      }
    );

    scanner.start();
    scannerRef.current = scanner;

    return () => {
      scanner.stop();
    };
  }, []);

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">QR Scanner</h1>

      <video
        ref={videoRef}
        className="w-full max-w-sm mx-auto rounded shadow mb-6"
      />

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
