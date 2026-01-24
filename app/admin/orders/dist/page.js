"use client";
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var react_1 = require("react");
function AdminOrdersPage() {
    var _a = react_1.useState({
        contactNo: "",
        email: "",
        ticketCode: "",
        paid: "",
        paymentMethod: "",
        note: ""
    }), form = _a[0], setForm = _a[1];
    var _b = react_1.useState([]), orders = _b[0], setOrders = _b[1];
    var _c = react_1.useState(false), loading = _c[0], setLoading = _c[1];
    // GLOBAL SUMMARY (all orders in DB)
    var _d = react_1.useState(null), summary = _d[0], setSummary = _d[1];
    // PAGINATION
    var _e = react_1.useState(1), page = _e[0], setPage = _e[1];
    var _f = react_1.useState(1), totalPages = _f[0], setTotalPages = _f[1];
    function fetchSummary() {
        return __awaiter(this, void 0, void 0, function () {
            var res, data, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fetch("/api/admin/orders/summary")];
                    case 1:
                        res = _a.sent();
                        return [4 /*yield*/, res.json()];
                    case 2:
                        data = _a.sent();
                        setSummary(data.summary || null);
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        console.error("Failed to fetch summary", err_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    react_1.useEffect(function () {
        fetchSummary();
    }, []);
    // SEARCH ORDERS (with pagination)
    function handleSearch(e) {
        return __awaiter(this, void 0, void 0, function () {
            var res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (e)
                            e.preventDefault();
                        setLoading(true);
                        return [4 /*yield*/, fetch("/api/admin/orders/search", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(__assign(__assign({}, form), { page: page }))
                            })];
                    case 1:
                        res = _a.sent();
                        return [4 /*yield*/, res.json()];
                    case 2:
                        data = _a.sent();
                        setOrders(data.orders || []);
                        setTotalPages(data.totalPages || 1);
                        setLoading(false);
                        return [2 /*return*/];
                }
            });
        });
    }
    // MARK AS PAID
    function markAsPaid(orderId) {
        return __awaiter(this, void 0, void 0, function () {
            var res, data, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fetch("/api/admin/orders/mark-paid", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ orderId: orderId, receiptNote: form.note })
                            })];
                    case 1:
                        res = _a.sent();
                        return [4 /*yield*/, res.json()];
                    case 2:
                        data = _a.sent();
                        if (data.ok) {
                            alert(data.message || "Order marked as paid and email sent");
                            handleSearch();
                            fetchSummary();
                        }
                        else {
                            alert(data.error || "Failed to mark as paid");
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _a.sent();
                        console.error("MarkPaid exception:", err_2);
                        alert("Unexpected error while marking as paid");
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    // RESEND EMAIL
    function resendEmail(orderId) {
        return __awaiter(this, void 0, void 0, function () {
            var res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("/api/admin/orders/resend-email", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ orderId: orderId })
                        })];
                    case 1:
                        res = _a.sent();
                        return [4 /*yield*/, res.json()];
                    case 2:
                        data = _a.sent();
                        if (data.success) {
                            alert("Email resent successfully");
                        }
                        else {
                            alert(data.error || "Failed to resend email");
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    // DELETE ORDER (UNPAID ONLY)
    function deleteOrder(orderId) {
        return __awaiter(this, void 0, void 0, function () {
            var res, data, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!confirm("Are you sure you want to delete this unpaid order?"))
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, fetch("/api/admin/orders/delete", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ orderId: orderId })
                            })];
                    case 2:
                        res = _a.sent();
                        return [4 /*yield*/, res.json()];
                    case 3:
                        data = _a.sent();
                        if (data.success) {
                            alert("Order deleted successfully");
                            handleSearch();
                            fetchSummary();
                        }
                        else {
                            alert(data.error || "Failed to delete order");
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        err_3 = _a.sent();
                        console.error("DeleteOrder exception:", err_3);
                        alert("Unexpected error while deleting order");
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    return (React.createElement("main", { className: "p-6 max-w-xl mx-auto" },
        React.createElement("button", { onClick: function () { return (window.location.href = "/admin"); }, className: "mb-4 px-4 py-2 bg-yellow-400 text-black font-semibold rounded hover:bg-yellow-300 transition" }, "\u2190 Back to Dashboard"),
        React.createElement("h1", { className: "text-2xl font-bold mb-6" }, "Order Management"),
        summary && (React.createElement("div", { className: "mb-6 border p-4 rounded bg-white text-black" },
            React.createElement("h2", { className: "text-lg font-semibold mb-3" }, "Ticket Summary"),
            React.createElement("table", { className: "w-full text-left border-collapse" },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", { className: "border-b p-2" }, "Category"),
                        React.createElement("th", { className: "border-b p-2" }, "Paid"),
                        React.createElement("th", { className: "border-b p-2" }, "Unpaid"))),
                React.createElement("tbody", null,
                    React.createElement("tr", null,
                        React.createElement("td", { className: "p-2 border-b" }, "Adult Lounge"),
                        React.createElement("td", { className: "p-2 border-b" }, summary.adultLounge.paid),
                        React.createElement("td", { className: "p-2 border-b" }, summary.adultLounge.unpaid)),
                    React.createElement("tr", null,
                        React.createElement("td", { className: "p-2 border-b" }, "Adult Standard"),
                        React.createElement("td", { className: "p-2 border-b" }, summary.adultStandard.paid),
                        React.createElement("td", { className: "p-2 border-b" }, summary.adultStandard.unpaid)),
                    React.createElement("tr", null,
                        React.createElement("td", { className: "p-2 border-b" }, "Kids Lounge"),
                        React.createElement("td", { className: "p-2 border-b" }, summary.childLounge.paid),
                        React.createElement("td", { className: "p-2 border-b" }, summary.childLounge.unpaid)),
                    React.createElement("tr", null,
                        React.createElement("td", { className: "p-2 border-b" }, "Kids Standard"),
                        React.createElement("td", { className: "p-2 border-b" }, summary.childStandard.paid),
                        React.createElement("td", { className: "p-2 border-b" }, summary.childStandard.unpaid)))))),
        React.createElement("form", { onSubmit: handleSearch, className: "space-y-4 mb-8" },
            React.createElement("h2", { className: "text-lg font-semibold mb-2" }, "Search Orders"),
            React.createElement("input", { type: "text", placeholder: "Phone (e.g. 0401234567)", value: form.contactNo, onChange: function (e) { return setForm(__assign(__assign({}, form), { contactNo: e.target.value })); }, className: "border p-2 w-full rounded text-black" }),
            React.createElement("input", { type: "email", placeholder: "Email (e.g. test@example.com)", value: form.email, onChange: function (e) { return setForm(__assign(__assign({}, form), { email: e.target.value })); }, className: "border p-2 w-full rounded text-black" }),
            React.createElement("input", { type: "text", placeholder: "Ticket Code (e.g. SSAN-005200001)", value: form.ticketCode, onChange: function (e) { return setForm(__assign(__assign({}, form), { ticketCode: e.target.value })); }, className: "border p-2 w-full rounded text-black" }),
            React.createElement("select", { value: form.paid, onChange: function (e) { return setForm(__assign(__assign({}, form), { paid: e.target.value })); }, className: "border p-2 w-full rounded text-black" },
                React.createElement("option", { value: "" }, "All"),
                React.createElement("option", { value: "true" }, "Paid"),
                React.createElement("option", { value: "false" }, "Unpaid")),
            React.createElement("select", { value: form.paymentMethod, onChange: function (e) { return setForm(__assign(__assign({}, form), { paymentMethod: e.target.value })); }, className: "border p-2 w-full rounded text-black" },
                React.createElement("option", { value: "" }, "All Payment Methods"),
                React.createElement("option", { value: "stripe" }, "Card / Klarna"),
                React.createElement("option", { value: "edenred" }, "Edenred"),
                React.createElement("option", { value: "epassi" }, "ePassi")),
            React.createElement("button", { type: "submit", disabled: loading, className: "bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition" }, loading ? "Searching…" : "Search")),
        React.createElement("div", { className: "mb-8" },
            React.createElement("h2", { className: "text-lg font-semibold mb-2" }, "Edenred Receipt Note"),
            React.createElement("input", { type: "text", placeholder: "Edenred/ePassi reference or note", value: form.note, onChange: function (e) { return setForm(__assign(__assign({}, form), { note: e.target.value })); }, className: "border p-2 w-full rounded text-black" })),
        React.createElement("h2", { className: "text-lg font-semibold mb-2" }, "Results"),
        orders.length === 0 ? (React.createElement("p", { className: "text-gray-500" }, "No orders found yet.")) : (React.createElement(React.Fragment, null,
            React.createElement("ul", { className: "space-y-4" }, orders.map(function (order) {
                var adultLounge = order.adultLounge || 0;
                var adultStandard = order.adultStandard || 0;
                var childLounge = order.childLounge || 0;
                var childStandard = order.childStandard || 0;
                return (React.createElement("li", { key: order.id, className: "border p-4 rounded bg-white text-black" },
                    React.createElement("p", null,
                        React.createElement("strong", null, "Name:"),
                        " ",
                        order.name),
                    React.createElement("p", null,
                        React.createElement("strong", null, "Email:"),
                        " ",
                        order.email),
                    React.createElement("p", null,
                        React.createElement("strong", null, "Phone:"),
                        " ",
                        order.contactNo),
                    React.createElement("p", null,
                        React.createElement("strong", null, "Paid:"),
                        " ",
                        order.paid ? "TRUE" : "FALSE"),
                    React.createElement("p", null,
                        React.createElement("strong", null, "Payment Method:"),
                        " ",
                        order.paymentMethod === "stripe"
                            ? "Card / Klarna"
                            : order.paymentMethod === "edenred"
                                ? "Edenred"
                                : order.paymentMethod === "epassi"
                                    ? "ePassi"
                                    : order.paymentMethod),
                    React.createElement("p", null,
                        React.createElement("strong", null, "Total Price:"),
                        " \u20AC",
                        (order.totalAmount / 100).toFixed(2)),
                    React.createElement("p", null,
                        React.createElement("strong", null, "Note:"),
                        " ",
                        order.receiptNote || "—"),
                    React.createElement("div", { className: "mt-3 space-y-1" },
                        React.createElement("p", null,
                            React.createElement("strong", null, "Adults:"),
                            " Lounge: ",
                            adultLounge,
                            ", Standard:",
                            " ",
                            adultStandard),
                        React.createElement("p", null,
                            React.createElement("strong", null, "Children:"),
                            " Lounge: ",
                            childLounge,
                            ", Standard: ",
                            childStandard)),
                    React.createElement("div", { className: "flex gap-3 mt-4" },
                        order.paid ? (React.createElement("button", { disabled: true, className: "bg-gray-400 text-gray-700 px-4 py-2 rounded cursor-not-allowed" }, "Already Paid")) : (React.createElement(React.Fragment, null,
                            React.createElement("button", { onClick: function () { return markAsPaid(order.id); }, className: "bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded" }, "Mark as Paid"),
                            React.createElement("button", { onClick: function () { return deleteOrder(order.id); }, className: "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded" }, "Delete Order"))),
                        React.createElement("button", { onClick: function () { return resendEmail(order.id); }, className: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded" }, "Resend Email"))));
            })),
            React.createElement("div", { className: "flex justify-between mt-6" },
                React.createElement("button", { disabled: page === 1, onClick: function () { return setPage(function (p) { return Math.max(1, p - 1); }); }, className: "px-4 py-2 bg-gray-200 rounded disabled:opacity-50" }, "\u2190 Previous"),
                React.createElement("span", { className: "px-4 py-2" },
                    "Page ",
                    page,
                    " of ",
                    totalPages),
                React.createElement("button", { disabled: page === totalPages, onClick: function () { return setPage(function (p) { return p + 1; }); }, className: "px-4 py-2 bg-gray-200 rounded disabled:opacity-50" }, "Next \u2192"))))));
}
exports["default"] = AdminOrdersPage;
