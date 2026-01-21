// app/edenred-epassi-payment/page.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import QRCode from "qrcode";

type PaymentMethod = "edenred" | "epassi";

export default function EdenredEpassiPaymentPage() {
  const params = useSearchParams();
  const router = useRouter();
  const orderId = params.get("orderId");

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    null,
  );
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  const EDENRED_LINK =
    "https://myedenred.fi/affiliate-payment/d0cd66d3-ee1f-4535-b8ed-a8dffa5320e7";

  const EPASSI_ANDROID_INTENT =
    "intent://epassi/#Intent;scheme=epassi;package=com.epassi.app;end;";

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ua =
        navigator.userAgent || navigator.vendor || (window as any).opera;
      setIsAndroid(/android/i.test(ua));
      setIsIOS(/iPad|iPhone|iPod/.test(ua));
    }
  }, []);

  useEffect(() => {
    if (!orderId) return;

    async function loadOrder() {
      const res = await fetch(`/api/order/${orderId}`);
      const data = await res.json();

      if (data?.order?.paymentMethod) {
        const method = data.order.paymentMethod as PaymentMethod;
        setPaymentMethod(method);

        if (method === "edenred") {
          const qr = await QRCode.toDataURL(EDENRED_LINK);
          setQrDataUrl(qr);
        }
      }
    }

    loadOrder();
  }, [orderId]);

  if (!orderId) {
    return <div style={{ padding: 40, color: "white" }}>Missing order ID</div>;
  }

  if (!paymentMethod) {
    return <div style={{ padding: 40, color: "white" }}>Loading...</div>;
  }

  const handleContinue = async () => {
    setLoading(true);

    await fetch("/api/order/set-awaiting-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    });

    router.push("/thank-you");
  };

  const handleOpenEpassi = () => {
    if (isAndroid) {
      window.location.href = EPASSI_ANDROID_INTENT;
    } else if (isIOS) {
      alert(
        "Please open the ePassi app on your iPhone, search for 'Taprobane Entertainment', and complete the payment there.",
      );
    } else {
      alert(
        "Please open the ePassi app on your phone, search for 'Taprobane Entertainment', and complete the payment there.",
      );
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050505",
        padding: "40px 16px",
        color: "white",
      }}
    >
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <h1 style={{ textAlign: "center", marginBottom: 24 }}>
          Complete Your Payment
        </h1>

        {/* EDENRED FLOW */}
        {paymentMethod === "edenred" && (
          <>
            <h3>1. Scan to open Edenred</h3>
            <p style={{ marginTop: 8, marginBottom: 12 }}>
              Scan this QR code with your phone camera. It will open the Edenred
              payment page. If the Edenred app is installed, it may open there.
            </p>

            <div
              style={{ marginTop: 12, marginBottom: 30, textAlign: "center" }}
            >
              {qrDataUrl && (
                <img
                  src={qrDataUrl}
                  alt="Edenred QR"
                  style={{ width: 240, height: 240, margin: "0 auto" }}
                />
              )}
            </div>

            <p style={{ marginBottom: 24 }}>
              If the QR does not work, you can also open Edenred and search for{" "}
              <strong>“Taprobane Entertainment”</strong> and complete the
              payment there.
            </p>
          </>
        )}

        {/* EPASSI FLOW */}
        {paymentMethod === "epassi" && (
          <>
            <h3>1. Open ePassi</h3>
            <p style={{ marginTop: 8, marginBottom: 12 }}>
              Open the ePassi app on your phone and search for{" "}
              <strong>“Taprobane Entertainment”</strong>. Use the merchant
              details below to confirm you are paying the correct account.
            </p>

            <div style={{ marginTop: 16, marginBottom: 24 }}>
              <p>
                <strong>Site-ID:</strong> 15964182
              </p>
              <p>
                <strong>MAC-key:</strong> IJJS9JI9JWR8
              </p>
            </div>

            <button
              onClick={handleOpenEpassi}
              style={{
                width: "100%",
                padding: "12px",
                background: "#5A2D82",
                color: "white",
                borderRadius: 8,
                fontWeight: 600,
                marginBottom: 24,
                cursor: "pointer",
              }}
            >
              Open ePassi App
            </button>

            <p style={{ marginBottom: 24, fontSize: 14, opacity: 0.9 }}>
              If the button does not open the app, please open the ePassi app
              manually on your phone, search for{" "}
              <strong>“Taprobane Entertainment”</strong>, and complete the
              payment there.
            </p>
          </>
        )}

        {/* WHATSAPP SECTION */}
        <h3>2. Send screenshot via WhatsApp</h3>

        <div style={{ marginTop: 16 }}>
          <a
            href="https://wa.me/358442363616?text=Hello%2C%20I%20have%20completed%20my%20payment.%20Here%20is%20my%20screenshot%20for%20verification."
            style={{
              display: "block",
              background: "#25D366",
              padding: "12px 16px",
              borderRadius: 8,
              marginBottom: 12,
              textAlign: "center",
              color: "black",
              fontWeight: 600,
            }}
          >
            Send to WhatsApp (+358 44 236 3616)
          </a>

          <a
            href="https://wa.me/358442363618?text=Hello%2C%20I%20have%20completed%20my%20payment.%20Here%20is%20my%20screenshot%20for%20verification."
            style={{
              display: "block",
              background: "#25D366",
              padding: "12px 16px",
              borderRadius: 8,
              textAlign: "center",
              color: "black",
              fontWeight: 600,
            }}
          >
            Send to WhatsApp (+358 44 236 3618)
          </a>
        </div>

        {/* CONTINUE BUTTON */}
        <h3 style={{ marginTop: 32 }}>3. Continue</h3>
        <p style={{ marginBottom: 16 }}>
          After sending your screenshot, click continue. We will verify your
          payment and send your tickets.
        </p>

        <button
          onClick={handleContinue}
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            background: "#FFD700",
            color: "black",
            borderRadius: 8,
            fontWeight: 600,
            cursor: loading ? "wait" : "pointer",
          }}
        >
          {loading ? "Processing..." : "Continue"}
        </button>
      </div>
    </div>
  );
}
