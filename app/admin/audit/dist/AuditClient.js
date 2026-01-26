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
            epassiFees: 0,
            paymentTotals: {
                stripe: 0,
                klarna: 0,
                edenred: 0,
                epassi: 0
            }
        };
        var orderTotals = {};
        var serviceFees = {};
        var paymentMethods = {};
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
            var orderId = t.order.id;
            orderTotals[orderId] = (orderTotals[orderId] || 0) + price;
            paymentMethods[orderId] = t.order.paymentMethod || "";
            if (!(orderId in serviceFees)) {
                serviceFees[orderId] = t.order.serviceFee || 0;
            }
        }
        for (var orderId in orderTotals) {
            var method = paymentMethods[orderId];
            var amount = orderTotals[orderId];
            if (method === "stripe")
                result.paymentTotals.stripe += amount;
            if (method === "klarna")
                result.paymentTotals.klarna += amount;
            if (method === "edenred")
                result.paymentTotals.edenred += amount;
            if (method === "epassi")
                result.paymentTotals.epassi += amount;
            var fee = serviceFees[orderId] / 100;
            if (method === "edenred")
                result.edenredFees += fee;
            if (method === "epassi")
                result.epassiFees += fee;
        }
        return result;
    }, [tickets]);
    return (React.createElement("main", { className: "min-h-screen bg-black text-white p-8" },
        React.createElement("h2", { className: "text-xl font-semibold mb-4" }, "Ticket Sales Overview"),
        React.createElement("section", { className: "bg-gray-900 p-6 rounded-lg shadow-lg mb-8" },
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
        React.createElement("section", { className: "bg-gray-900 p-6 rounded-lg shadow-lg mb-8" },
            React.createElement("h2", { className: "text-xl font-semibold mb-4" }, "Service Charges"),
            React.createElement("p", null,
                "Edenred Fees Total: ",
                summary.edenredFees.toFixed(2),
                " \u20AC"),
            React.createElement("p", null,
                "ePassi Fees Total: ",
                summary.epassiFees.toFixed(2),
                " \u20AC")),
        React.createElement("section", { className: "bg-gray-900 p-6 rounded-lg shadow-lg" },
            React.createElement("h2", { className: "text-xl font-semibold mb-4" }, "Payment Breakdown (without service charges)"),
            React.createElement("table", { className: "w-full text-left" },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", { className: "pb-2" }, "Method"),
                        React.createElement("th", { className: "pb-2" }, "Total Paid (\u20AC)"))),
                React.createElement("tbody", null,
                    React.createElement("tr", null,
                        React.createElement("td", null, "Stripe"),
                        React.createElement("td", null, summary.paymentTotals.stripe.toFixed(2))),
                    React.createElement("tr", null,
                        React.createElement("td", null, "Klarna"),
                        React.createElement("td", null, summary.paymentTotals.klarna.toFixed(2))),
                    React.createElement("tr", null,
                        React.createElement("td", null, "Edenred"),
                        React.createElement("td", null, summary.paymentTotals.edenred.toFixed(2))),
                    React.createElement("tr", null,
                        React.createElement("td", null, "ePassi"),
                        React.createElement("td", null, summary.paymentTotals.epassi.toFixed(2)))))),
        role === "AUDIT" && (React.createElement("div", { className: "mt-12 flex justify-center" },
            React.createElement("button", { onClick: logout, className: "px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition" }, "Logout")))));
}
exports["default"] = AuditClient;
