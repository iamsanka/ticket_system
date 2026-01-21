"use strict";
exports.__esModule = true;
exports.metadata = exports.fetchCache = exports.dynamic = void 0;
var google_1 = require("next/font/google");
require("./globals.css");
var Footer_1 = require("@/components/Footer");
exports.dynamic = "force-dynamic";
exports.fetchCache = "force-no-store";
var geistSans = google_1.Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"]
});
var geistMono = google_1.Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"]
});
exports.metadata = {
    title: "Taprobane Tickets",
    description: "Premium ticketing for Taprobane events"
};
function RootLayout(_a) {
    var children = _a.children;
    return (React.createElement("html", { lang: "en" },
        React.createElement("body", { className: geistSans.variable + " " + geistMono.variable + " antialiased bg-white text-black" },
            children,
            React.createElement(Footer_1["default"], null))));
}
exports["default"] = RootLayout;
