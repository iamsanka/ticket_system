"use client";

import Link from "next/link";

export default function ThankYouPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050505",
        padding: "40px 16px",
        color: "white",
      }}
    >
      <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
        {/* Header */}
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            marginBottom: 16,
          }}
        >
          Thank You!
        </h1>

        <p
          style={{
            fontSize: "1.1rem",
            opacity: 0.9,
            marginBottom: 24,
          }}
        >
          Your payment has been received or is currently being verified.
        </p>

        {/* Success Icon */}
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "#0f0",
            opacity: 0.2,
            margin: "0 auto 24px auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 60,
          }}
        >
          ✓
        </div>

        {/* Message */}
        <p style={{ marginBottom: 20, lineHeight: 1.6 }}>
          If you paid using <strong>Card / MobilePay / Klarna</strong>, your
          tickets will be emailed to you shortly.
        </p>

        <p style={{ marginBottom: 20, lineHeight: 1.6 }}>
          If you paid using <strong>Edenred</strong> or <strong>ePassi</strong>,
          our team will verify your payment. Once verified, your tickets will be
          sent to your email.
        </p>

        <p style={{ marginBottom: 32, lineHeight: 1.6 }}>
          If you haven’t already, please send your payment screenshot via
          WhatsApp so we can verify it quickly.
        </p>

        {/* WhatsApp Buttons */}
        <div style={{ marginBottom: 32 }}>
          <a
            href="https://wa.me/358442363616?text=Hello%2C%20I%20have%20completed%20my%20payment.%20Here%20is%20my%20screenshot."
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
            WhatsApp: +358 44 236 3616
          </a>

          <a
            href="https://wa.me/358442363618?text=Hello%2C%20I%20have%20completed%20my%20payment.%20Here%20is%20my%20screenshot."
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
            WhatsApp: +358 44 236 3618
          </a>
        </div>

        {/* Footer */}
        <p style={{ opacity: 0.7, marginBottom: 40 }}>
          Thank you for supporting Taprobane Entertainment. We look forward to
          seeing you at the event.
        </p>

        <Link
          href="/"
          style={{
            display: "inline-block",
            padding: "12px 20px",
            background: "#FFD700",
            color: "black",
            borderRadius: 8,
            fontWeight: 600,
          }}
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
