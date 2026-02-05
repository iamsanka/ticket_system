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
function UpgradePage() {
    var router = navigation_1.useRouter();
    var _a = react_1.useState(""), ticketCode = _a[0], setTicketCode = _a[1];
    var _b = react_1.useState(null), order = _b[0], setOrder = _b[1];
    var _c = react_1.useState(false), loading = _c[0], setLoading = _c[1];
    var _d = react_1.useState(false), showConfirm = _d[0], setShowConfirm = _d[1];
    function searchOrder() {
        return __awaiter(this, void 0, void 0, function () {
            var res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setLoading(true);
                        return [4 /*yield*/, fetch("/api/admin/upgrade/search?ticketCode=" + ticketCode)];
                    case 1:
                        res = _a.sent();
                        return [4 /*yield*/, res.json()];
                    case 2:
                        data = _a.sent();
                        setOrder(data.order || null);
                        setLoading(false);
                        return [2 /*return*/];
                }
            });
        });
    }
    function upgradeOrder() {
        return __awaiter(this, void 0, void 0, function () {
            var res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!order)
                            return [2 /*return*/];
                        return [4 /*yield*/, fetch("/api/admin/upgrade", {
                                method: "POST",
                                body: JSON.stringify({ orderId: order.id })
                            })];
                    case 1:
                        res = _a.sent();
                        return [4 /*yield*/, res.json()];
                    case 2:
                        data = _a.sent();
                        alert(data.message);
                        setOrder(null);
                        setTicketCode("");
                        setShowConfirm(false);
                        return [2 /*return*/];
                }
            });
        });
    }
    return (React.createElement("main", { className: "p-8 text-white bg-black min-h-screen" },
        React.createElement("button", { onClick: function () { return router.push("/admin"); }, className: "mb-6 px-4 py-2 bg-yellow-400 text-black font-semibold rounded hover:bg-yellow-300 transition" }, "\u2190 Back to Dashboard"),
        React.createElement("h1", { className: "text-3xl font-bold mb-6" }, "Upgrade Ticket"),
        React.createElement("div", { className: "flex gap-4 mb-6" },
            React.createElement("input", { type: "text", placeholder: "Enter Ticket Code", value: ticketCode, onChange: function (e) { return setTicketCode(e.target.value); }, className: "p-3 rounded text-black bg-white w-64 border border-gray-300" }),
            React.createElement("button", { onClick: searchOrder, className: "px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white" }, "Search")),
        loading && React.createElement("p", null, "Searching\u2026"),
        order && (React.createElement("div", { className: "bg-gray-900 p-6 rounded-lg" },
            React.createElement("h2", { className: "text-xl font-semibold mb-4" }, "Order Found"),
            React.createElement("p", null,
                React.createElement("strong", null, "Name:"),
                " ",
                order.name),
            React.createElement("p", null,
                React.createElement("strong", null, "Email:"),
                " ",
                order.email),
            React.createElement("p", null,
                React.createElement("strong", null, "Tickets:"),
                " ",
                order.tickets.length),
            React.createElement("button", { onClick: function () { return setShowConfirm(true); }, className: "mt-4 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded text-black font-semibold" }, "Upgrade Order"))),
        showConfirm && (React.createElement("div", { className: "fixed inset-0 bg-black/70 flex items-center justify-center" },
            React.createElement("div", { className: "bg-white text-black p-6 rounded-lg w-80 shadow-xl" },
                React.createElement("h3", { className: "text-lg font-bold mb-4" }, "Are you sure?"),
                React.createElement("p", { className: "mb-6" }, "This will cancel the old tickets and generate new Lounge tickets."),
                React.createElement("div", { className: "flex justify-between" },
                    React.createElement("button", { onClick: function () { return setShowConfirm(false); }, className: "px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" }, "No"),
                    React.createElement("button", { onClick: upgradeOrder, className: "px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700" }, "Yes, Upgrade")))))));
}
exports["default"] = UpgradePage;
