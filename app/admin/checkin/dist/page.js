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
function CheckinPage() {
    var _a, _b, _c;
    var _d = react_1.useState(""), ticketCode = _d[0], setTicketCode = _d[1];
    var _e = react_1.useState(null), ticket = _e[0], setTicket = _e[1];
    var _f = react_1.useState([]), allTickets = _f[0], setAllTickets = _f[1];
    var _g = react_1.useState(false), loading = _g[0], setLoading = _g[1];
    // LOAD ALL TICKETS ON PAGE LOAD
    react_1.useEffect(function () {
        function loadAll() {
            return __awaiter(this, void 0, void 0, function () {
                var res, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, fetch("/api/admin/checkin/search", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ ticketCode: "" })
                            })];
                        case 1:
                            res = _a.sent();
                            return [4 /*yield*/, res.json()];
                        case 2:
                            data = _a.sent();
                            setAllTickets(data.allTickets || []);
                            return [2 /*return*/];
                    }
                });
            });
        }
        loadAll();
    }, []);
    // SUMMARY CALCULATOR
    function getSummary() {
        var _a, _b;
        var summary = {
            adultLounge: { used: 0, unused: 0 },
            adultStandard: { used: 0, unused: 0 },
            childLounge: { used: 0, unused: 0 },
            childStandard: { used: 0, unused: 0 }
        };
        for (var _i = 0, allTickets_1 = allTickets; _i < allTickets_1.length; _i++) {
            var t = allTickets_1[_i];
            var isUsed = t.usedAt ? "used" : "unused";
            var category = (_a = t.category) === null || _a === void 0 ? void 0 : _a.toLowerCase();
            var tier = (_b = t.tier) === null || _b === void 0 ? void 0 : _b.toLowerCase();
            if (category.includes("adult") && tier.includes("lounge")) {
                summary.adultLounge[isUsed]++;
            }
            if (category.includes("adult") && tier.includes("standard")) {
                summary.adultStandard[isUsed]++;
            }
            if (category.includes("child") && tier.includes("lounge")) {
                summary.childLounge[isUsed]++;
            }
            if (category.includes("child") && tier.includes("standard")) {
                summary.childStandard[isUsed]++;
            }
        }
        return summary;
    }
    var summary = getSummary();
    // SEARCH TICKET BY CODE
    function handleSearch(e) {
        return __awaiter(this, void 0, void 0, function () {
            var res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (e)
                            e.preventDefault();
                        setLoading(true);
                        return [4 /*yield*/, fetch("/api/admin/checkin/search", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ ticketCode: ticketCode })
                            })];
                    case 1:
                        res = _a.sent();
                        return [4 /*yield*/, res.json()];
                    case 2:
                        data = _a.sent();
                        setTicket(data.ticket || null);
                        setAllTickets(data.allTickets || []);
                        setLoading(false);
                        return [2 /*return*/];
                }
            });
        });
    }
    // CHECK IN TICKET
    function handleCheckin() {
        return __awaiter(this, void 0, void 0, function () {
            var res, data, refreshed, updated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!ticket)
                            return [2 /*return*/];
                        return [4 /*yield*/, fetch("/api/admin/checkin/mark-used", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ ticketId: ticket.id })
                            })];
                    case 1:
                        res = _a.sent();
                        return [4 /*yield*/, res.json()];
                    case 2:
                        data = _a.sent();
                        if (!data.success) return [3 /*break*/, 5];
                        alert("Ticket checked in successfully");
                        return [4 /*yield*/, fetch("/api/admin/checkin/search", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ ticketCode: ticketCode })
                            })];
                    case 3:
                        refreshed = _a.sent();
                        return [4 /*yield*/, refreshed.json()];
                    case 4:
                        updated = _a.sent();
                        setTicket(updated.ticket || null);
                        setAllTickets(updated.allTickets || []);
                        return [3 /*break*/, 6];
                    case 5:
                        alert(data.error || "Failed to check in");
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    }
    return (React.createElement("main", { className: "p-6 max-w-3xl mx-auto" },
        React.createElement("button", { onClick: function () { return (window.location.href = "/admin"); }, className: "mb-4 px-4 py-2 bg-yellow-400 text-black font-semibold rounded hover:bg-yellow-300 transition" }, "\u2190 Back to Dashboard"),
        React.createElement("h1", { className: "text-2xl font-bold mb-6" }, "All Tickets"),
        React.createElement("div", { className: "mb-6 border p-4 rounded bg-white text-black" },
            React.createElement("h2", { className: "text-lg font-semibold mb-3" }, "Check-In Summary"),
            React.createElement("table", { className: "w-full text-left border-collapse" },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", { className: "border-b p-2" }, "Category"),
                        React.createElement("th", { className: "border-b p-2" }, "Checked In"),
                        React.createElement("th", { className: "border-b p-2" }, "Not Yet"))),
                React.createElement("tbody", null,
                    React.createElement("tr", null,
                        React.createElement("td", { className: "p-2 border-b" }, "Adult Lounge"),
                        React.createElement("td", { className: "p-2 border-b" }, summary.adultLounge.used),
                        React.createElement("td", { className: "p-2 border-b" }, summary.adultLounge.unused)),
                    React.createElement("tr", null,
                        React.createElement("td", { className: "p-2 border-b" }, "Adult Standard"),
                        React.createElement("td", { className: "p-2 border-b" }, summary.adultStandard.used),
                        React.createElement("td", { className: "p-2 border-b" }, summary.adultStandard.unused)),
                    React.createElement("tr", null,
                        React.createElement("td", { className: "p-2 border-b" }, "Kids Lounge"),
                        React.createElement("td", { className: "p-2 border-b" }, summary.childLounge.used),
                        React.createElement("td", { className: "p-2 border-b" }, summary.childLounge.unused)),
                    React.createElement("tr", null,
                        React.createElement("td", { className: "p-2 border-b" }, "Kids Standard"),
                        React.createElement("td", { className: "p-2 border-b" }, summary.childStandard.used),
                        React.createElement("td", { className: "p-2 border-b" }, summary.childStandard.unused))))),
        React.createElement("form", { onSubmit: handleSearch, className: "mb-6 space-y-4" },
            React.createElement("input", { type: "text", placeholder: "Enter Ticket Code", value: ticketCode, onChange: function (e) { return setTicketCode(e.target.value); }, className: "border p-2 w-full rounded text-black" }),
            React.createElement("button", { type: "submit", disabled: loading, className: "bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition" }, loading ? "Searching…" : "Search")),
        ticket ? (React.createElement("div", { className: "border p-4 rounded bg-white text-black mb-6" },
            React.createElement("p", null,
                React.createElement("strong", null, "Name:"),
                " ",
                ((_a = ticket.order) === null || _a === void 0 ? void 0 : _a.name) || "—"),
            React.createElement("p", null,
                React.createElement("strong", null, "Email:"),
                " ",
                ((_b = ticket.order) === null || _b === void 0 ? void 0 : _b.email) || "—"),
            React.createElement("p", null,
                React.createElement("strong", null, "Contact No:"),
                " ",
                ((_c = ticket.order) === null || _c === void 0 ? void 0 : _c.contactNo) || "—"),
            React.createElement("p", null,
                React.createElement("strong", null, "Category:"),
                " ",
                ticket.category),
            React.createElement("p", null,
                React.createElement("strong", null, "Tier:"),
                " ",
                ticket.tier),
            React.createElement("p", null,
                React.createElement("strong", null, "Used:"),
                " ",
                ticket.usedAt ? "Yes" : "No"),
            React.createElement("p", null,
                React.createElement("strong", null, "Used At:"),
                " ",
                ticket.usedAt ? new Date(ticket.usedAt).toLocaleString() : "—"),
            React.createElement("div", { className: "mt-4" }, ticket.usedAt ? (React.createElement("button", { disabled: true, className: "bg-gray-400 text-gray-700 px-4 py-2 rounded cursor-not-allowed" }, "Already Checked In")) : (React.createElement("button", { onClick: handleCheckin, className: "bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded" }, "Check In"))))) : (React.createElement("p", { className: "text-gray-500" }, "No ticket found yet."))));
}
exports["default"] = CheckinPage;
