"use client";
"use strict";
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
var navigation_1 = require("next/navigation");
function TicketManagementPage() {
    var router = navigation_1.useRouter();
    var _a = react_1.useState(""), query = _a[0], setQuery = _a[1];
    var _b = react_1.useState(false), loading = _b[0], setLoading = _b[1];
    var _c = react_1.useState([]), results = _c[0], setResults = _c[1];
    function handleSearch(e) {
        return __awaiter(this, void 0, void 0, function () {
            var res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        e.preventDefault();
                        if (!query.trim())
                            return [2 /*return*/];
                        setLoading(true);
                        return [4 /*yield*/, fetch("/api/admin/orders/search?q=" + encodeURIComponent(query))];
                    case 1:
                        res = _a.sent();
                        return [4 /*yield*/, res.json()];
                    case 2:
                        data = _a.sent();
                        setResults(data.orders || []);
                        setLoading(false);
                        return [2 /*return*/];
                }
            });
        });
    }
    function deleteOrder(orderId) {
        return __awaiter(this, void 0, void 0, function () {
            var confirmed, res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        confirmed = confirm("⚠️ This will permanently delete the order AND all its tickets.\n\nAre you sure?");
                        if (!confirmed)
                            return [2 /*return*/];
                        return [4 /*yield*/, fetch("/api/admin/orders/force-delete", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ orderId: orderId })
                            })];
                    case 1:
                        res = _a.sent();
                        if (!res.ok) return [3 /*break*/, 2];
                        setResults(function (prev) { return prev.filter(function (o) { return o.id !== orderId; }); });
                        alert("Order and all tickets deleted successfully.");
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, res.json()];
                    case 3:
                        data = _a.sent();
                        alert("Failed to delete order: " + data.error);
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    return (React.createElement("main", { className: "min-h-screen bg-black text-white p-6" },
        React.createElement("h1", { className: "text-3xl font-bold mb-6" }, "Ticket Management"),
        React.createElement("button", { onClick: function () { return router.push("/admin"); }, className: "mb-6 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded" }, "\u2190 Back to Dashboard"),
        React.createElement("form", { onSubmit: handleSearch, className: "flex gap-2 mb-6 max-w-xl" },
            React.createElement("input", { className: "flex-1 p-3 rounded bg-gray-800 border border-gray-700 text-white", placeholder: "Search by ticket code, email, or phone\u2026", value: query, onChange: function (e) { return setQuery(e.target.value); } }),
            React.createElement("button", { type: "submit", className: "bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded font-semibold" }, "Search")),
        React.createElement("button", { onClick: function () { return router.push("/admin/tickets/create"); }, className: "bg-green-600 hover:bg-green-700 px-6 py-3 rounded font-semibold mb-10" }, "Create New Tickets"),
        loading && React.createElement("p", { className: "text-lg" }, "Searching\u2026"),
        !loading && results.length === 0 && query && (React.createElement("p", { className: "text-gray-400" }, "No results found.")),
        React.createElement("div", { className: "space-y-6" }, results.map(function (order) {
            var _a;
            return (React.createElement("div", { key: order.id, className: "border border-gray-700 p-5 rounded-lg bg-gray-900" },
                React.createElement("div", { className: "flex justify-between items-start" },
                    React.createElement("div", null,
                        React.createElement("p", { className: "text-xl font-bold" }, order.name || "Guest"),
                        React.createElement("p", null, order.email),
                        order.contactNo && React.createElement("p", null, order.contactNo),
                        React.createElement("p", { className: "text-sm text-gray-400 mt-1" },
                            "Order ID: ",
                            order.id),
                        React.createElement("p", { className: "text-sm text-gray-400" },
                            "Event: ", (_a = order.event) === null || _a === void 0 ? void 0 :
                            _a.title)),
                    React.createElement("button", { onClick: function () { return deleteOrder(order.id); }, className: "bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold" }, "Force Delete")),
                React.createElement("div", { className: "mt-4" },
                    React.createElement("h3", { className: "text-lg font-semibold mb-2" }, "Tickets"),
                    React.createElement("ul", { className: "space-y-1 text-sm" }, order.tickets.map(function (t) { return (React.createElement("li", { key: t.id, className: "text-gray-300" },
                        React.createElement("strong", null, t.ticketCode),
                        " \u2014 ",
                        t.category,
                        " / ",
                        t.tier,
                        t.usedAt && (React.createElement("span", { className: "text-green-400 ml-2" }, "(Used)")))); })))));
        }))));
}
exports["default"] = TicketManagementPage;
