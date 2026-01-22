"use client";
"use strict";
exports.__esModule = true;
var link_1 = require("next/link");
function ThankYouPage() {
    return (React.createElement("div", { style: {
            minHeight: "100vh",
            background: "#050505",
            padding: "40px 16px",
            color: "white"
        } },
        React.createElement("div", { style: { maxWidth: 600, margin: "0 auto", textAlign: "center" } },
            React.createElement("h1", { style: {
                    fontSize: "2rem",
                    fontWeight: "bold",
                    marginBottom: 16
                } }, "Thank You!"),
            React.createElement("p", { style: {
                    fontSize: "1.1rem",
                    opacity: 0.9,
                    marginBottom: 24
                } }, "Your payment has been received or is currently being verified."),
            React.createElement("div", { style: {
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    background: "#0f0",
                    opacity: 0.2,
                    margin: "0 auto 24px auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 60
                } }, "\u2713"),
            React.createElement("p", { style: { marginBottom: 20, lineHeight: 1.6 } },
                "If you paid using ",
                React.createElement("strong", null, "Card / MobilePay / Klarna"),
                ", your tickets will be emailed to you shortly."),
            React.createElement("p", { style: { marginBottom: 20, lineHeight: 1.6 } },
                "If you paid using ",
                React.createElement("strong", null, "Edenred"),
                " or ",
                React.createElement("strong", null, "ePassi"),
                ", our team will verify your payment. Once verified, your tickets will be sent to your email."),
            React.createElement("p", { style: { marginBottom: 32, lineHeight: 1.6 } }, "If you haven\u2019t already, please send your payment screenshot via WhatsApp so we can verify it quickly."),
            React.createElement("div", { style: { marginBottom: 32 } },
                React.createElement("a", { href: "https://wa.me/358442363616?text=Hello%2C%20I%20have%20completed%20my%20payment.%20Here%20is%20my%20screenshot.", style: {
                        display: "block",
                        background: "#25D366",
                        padding: "12px 16px",
                        borderRadius: 8,
                        marginBottom: 12,
                        textAlign: "center",
                        color: "black",
                        fontWeight: 600
                    } }, "WhatsApp: +358 44 236 3616"),
                React.createElement("a", { href: "https://wa.me/358442363618?text=Hello%2C%20I%20have%20completed%20my%20payment.%20Here%20is%20my%20screenshot.", style: {
                        display: "block",
                        background: "#25D366",
                        padding: "12px 16px",
                        borderRadius: 8,
                        textAlign: "center",
                        color: "black",
                        fontWeight: 600
                    } }, "WhatsApp: +358 44 236 3618")),
            React.createElement("p", { style: { opacity: 0.7, marginBottom: 40 } }, "Thank you for supporting Taprobane Entertainment. We look forward to seeing you at the event."),
            React.createElement(link_1["default"], { href: "/", style: {
                    display: "inline-block",
                    padding: "12px 20px",
                    background: "#FFD700",
                    color: "black",
                    borderRadius: 8,
                    fontWeight: 600
                } }, "Back to Home"))));
}
exports["default"] = ThankYouPage;
