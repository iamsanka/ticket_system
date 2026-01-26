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
var navigation_1 = require("next/navigation");
var AuditClient_1 = require("./AuditClient");
function AuditDashboard() {
    var router = navigation_1.useRouter();
    var _a = react_1.useState(null), role = _a[0], setRole = _a[1];
    var _b = react_1.useState(null), tickets = _b[0], setTickets = _b[1];
    var _c = react_1.useState(null), filtered = _c[0], setFiltered = _c[1];
    var _d = react_1.useState(true), loading = _d[0], setLoading = _d[1];
    var _e = react_1.useState(""), fromDate = _e[0], setFromDate = _e[1];
    var _f = react_1.useState(""), toDate = _f[0], setToDate = _f[1];
    react_1.useEffect(function () {
        function load() {
            var _a;
            return __awaiter(this, void 0, void 0, function () {
                var sessionRes, sessionData, userRole, orderRes, text, orderData, allTickets, err_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 5, 6, 7]);
                            return [4 /*yield*/, fetch("/api/admin/session")];
                        case 1:
                            sessionRes = _b.sent();
                            return [4 /*yield*/, sessionRes.json()];
                        case 2:
                            sessionData = _b.sent();
                            userRole = ((_a = sessionData.user) === null || _a === void 0 ? void 0 : _a.role) || null;
                            setRole(userRole);
                            if (!userRole) {
                                setLoading(false);
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, fetch("/api/admin/orders")];
                        case 3:
                            orderRes = _b.sent();
                            return [4 /*yield*/, orderRes.text()];
                        case 4:
                            text = _b.sent();
                            orderData = void 0;
                            try {
                                orderData = JSON.parse(text);
                            }
                            catch (_c) {
                                console.error("JSON parse failed");
                                setLoading(false);
                                return [2 /*return*/];
                            }
                            if (!orderData.orders) {
                                console.error("No orders found");
                                setLoading(false);
                                return [2 /*return*/];
                            }
                            allTickets = orderData.orders.flatMap(function (order) {
                                return order.tickets.map(function (ticket) { return (__assign(__assign({}, ticket), { order: order })); });
                            });
                            setTickets(allTickets);
                            setFiltered(allTickets);
                            return [3 /*break*/, 7];
                        case 5:
                            err_1 = _b.sent();
                            console.error("Audit load error:", err_1);
                            return [3 /*break*/, 7];
                        case 6:
                            setLoading(false);
                            return [7 /*endfinally*/];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        }
        load();
    }, []);
    react_1.useEffect(function () {
        if (!tickets)
            return;
        var from = fromDate ? new Date(fromDate) : null;
        var to = toDate ? new Date(toDate) : null;
        var filteredTickets = tickets.filter(function (t) {
            var created = new Date(t.order.createdAt);
            if (from && created < from)
                return false;
            if (to && created > to)
                return false;
            return true;
        });
        setFiltered(filteredTickets);
    }, [fromDate, toDate, tickets]);
    function logout() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("/api/auth/logout", { method: "POST" })];
                    case 1:
                        _a.sent();
                        router.push("/admin/login");
                        return [2 /*return*/];
                }
            });
        });
    }
    if (loading || role === null || tickets === null || filtered === null) {
        return (React.createElement("main", { className: "min-h-screen bg-black text-white flex items-center justify-center" },
            React.createElement("p", { className: "text-xl" }, "Loading audit view\u2026")));
    }
    if (role !== "ADMIN" && role !== "AUDIT") {
        return (React.createElement("main", { className: "min-h-screen bg-black text-white flex items-center justify-center" },
            React.createElement("p", { className: "text-xl" }, "Access denied.")));
    }
    return (React.createElement("main", { className: "min-h-screen bg-black text-white p-8" },
        role === "ADMIN" && (React.createElement("button", { onClick: function () { return router.push("/admin"); }, className: "mb-6 px-4 py-2 bg-yellow-400 text-black font-semibold rounded hover:bg-yellow-300 transition" }, "\u2190 Back to Dashboard")),
        React.createElement("h1", { className: "text-3xl font-bold mb-6" }, "Audit Dashboard"),
        React.createElement("form", { onSubmit: function (e) { return e.preventDefault(); }, className: "flex flex-wrap gap-4 mb-6 items-center" },
            React.createElement("label", { className: "text-white font-medium" }, "From:"),
            React.createElement("input", { type: "date", value: fromDate, onChange: function (e) { return setFromDate(e.target.value); }, className: "p-2 rounded bg-white text-black border border-gray-300" }),
            React.createElement("label", { className: "text-white font-medium" }, "To:"),
            React.createElement("input", { type: "date", value: toDate, onChange: function (e) { return setToDate(e.target.value); }, className: "p-2 rounded bg-white text-black border border-gray-300" }),
            React.createElement("button", { type: "submit", className: "px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition" }, "Search")),
        React.createElement(AuditClient_1["default"], { tickets: filtered, role: role, logout: logout })));
}
exports["default"] = AuditDashboard;
