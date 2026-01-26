"use client";
"use strict";
exports.__esModule = true;
var navigation_1 = require("next/navigation");
var react_1 = require("react");
function AuditClient(_a) {
    var tickets = _a.tickets, role = _a.role, logout = _a.logout;
    var router = navigation_1.useRouter();
    var summary = react_1.useMemo(function () {
        var result = {
            ADULT_LOUNGE: { count: 0, total: 0 },
            ADULT_STANDARD: { count: 0, total: 0 },
            CHILD_LOUNGE: { count: 0, total: 0 },
            CHILD_STANDARD: { count: 0, total: 0 },
            grandTotal: 0,
            edenredFees: 0,
            epassiFees: 0
        };
        var countedOrders = new Set();
        for (var _i = 0, tickets_1 = tickets; _i < tickets_1.length; _i++) {
            var t = tickets_1[_i];
            var key = t.category + "_" + t.tier;
            if (!result[key])
                continue;
            result[key].count += 1;
            var event = t.order.event;
            var price = 0;
            if (key === "ADULT_LOUNGE")
                price = event.adultLoungePrice / 100;
            if (key === "ADULT_STANDARD")
                price = event.adultStandardPrice / 100;
            if (key === "CHILD_LOUNGE")
                price = event.childLoungePrice / 100;
            if (key === "CHILD_STANDARD")
                price = event.childStandardPrice / 100;
            result[key].total += price;
            result.grandTotal += price;
            // ✅ Only count serviceFee once per order
            var orderId = t.order.id;
            if (!countedOrders.has(orderId)) {
                countedOrders.add(orderId);
                if (t.order.paymentMethod === "edenred") {
                    result.edenredFees += t.order.serviceFee / 100;
                }
                if (t.order.paymentMethod === "epassi") {
                    result.epassiFees += t.order.serviceFee / 100;
                }
            }
        }
        return result;
    }, [tickets]);
    return (React.createElement("main", { className: "min-h-screen bg-black text-white p-8" },
        React.createElement("h1", { className: "text-3xl font-bold mb-6" }, "Audit Dashboard"),
        role === "ADMIN" && (React.createElement("button", { onClick: function () { return router.push("/admin"); }, className: "mb-6 px-4 py-2 bg-yellow-400 text-black font-semibold rounded hover:bg-yellow-300 transition" }, "\u2190 Back to Dashboard")),
        role === "AUDIT" && (React.createElement("button", { onClick: logout, className: "mb-6 px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition" }, "Logout")),
        React.createElement("section", { className: "bg-gray-900 p-6 rounded-lg shadow-lg mb-8" },
            React.createElement("h2", { className: "text-xl font-semibold mb-4" }, "Ticket Sales Overview"),
            React.createElement("table", { className: "w-full text-left" },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", { className: "pb-2" }, "Category"),
                        React.createElement("th", { className: "pb-2" }, "Tickets Sold"),
                        React.createElement("th", { className: "pb-2" }, "Total Amount (\u20AC)"))),
                React.createElement("tbody", null,
                    React.createElement("tr", null,
                        React.createElement("td", null, "Adult Taprobane LOUNGE"),
                        React.createElement("td", null, summary.ADULT_LOUNGE.count),
                        React.createElement("td", null, summary.ADULT_LOUNGE.total.toFixed(2))),
                    React.createElement("tr", null,
                        React.createElement("td", null, "Adult Taprobane STANDARD"),
                        React.createElement("td", null, summary.ADULT_STANDARD.count),
                        React.createElement("td", null, summary.ADULT_STANDARD.total.toFixed(2))),
                    React.createElement("tr", null,
                        React.createElement("td", null, "Child Taprobane LOUNGE"),
                        React.createElement("td", null, summary.CHILD_LOUNGE.count),
                        React.createElement("td", null, summary.CHILD_LOUNGE.total.toFixed(2))),
                    React.createElement("tr", null,
                        React.createElement("td", null, "Child Taprobane STANDARD"),
                        React.createElement("td", null, summary.CHILD_STANDARD.count),
                        React.createElement("td", null, summary.CHILD_STANDARD.total.toFixed(2))))),
            React.createElement("p", { className: "mt-4 text-lg font-bold" },
                "Grand Total: ",
                summary.grandTotal.toFixed(2),
                " \u20AC")),
        React.createElement("section", { className: "bg-gray-900 p-6 rounded-lg shadow-lg" },
            React.createElement("h2", { className: "text-xl font-semibold mb-4" }, "Payment Fees"),
            React.createElement("p", null,
                "Edenred Fees Total: ",
                summary.edenredFees.toFixed(2),
                " \u20AC"),
            React.createElement("p", null,
                "ePassi Fees Total: ",
                summary.epassiFees.toFixed(2),
                " \u20AC"))));
}
exports["default"] = AuditClient;
