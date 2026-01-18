"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

export default function EdenredQR({
  link,
  onClose,
}: {
  link: string;
  onClose: () => void;
}) {
  const [qr, setQr] = useState("");

  useEffect(() => {
    QRCode.toDataURL(link).then(setQr);
  }, [link]);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg text-center max-w-sm">
        <h2 className="text-xl font-semibold mb-4">Scan to Pay with Edenred</h2>

        <img src={qr} alt="QR Code" className="mx-auto w-48 h-48" />

        <p className="text-gray-600 mt-3">
          Scan this QR code with your phone to continue the payment in the
          Edenred app.
        </p>

        <button
          onClick={onClose}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}
