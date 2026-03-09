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
var confetti_1 = require("@/lib/confetti");
function RandomRafflePage() {
    var _this = this;
    var _a, _b, _c, _d, _e, _f;
    var router = navigation_1.useRouter();
    var _g = react_1.useState([]), tickets = _g[0], setTickets = _g[1];
    var _h = react_1.useState([]), winners = _h[0], setWinners = _h[1];
    var _j = react_1.useState(0), step = _j[0], setStep = _j[1];
    var _k = react_1.useState(false), animating = _k[0], setAnimating = _k[1];
    var _l = react_1.useState(""), fakeCode = _l[0], setFakeCode = _l[1];
    var _m = react_1.useState(false), showThird = _m[0], setShowThird = _m[1];
    var _o = react_1.useState(false), showSecond = _o[0], setShowSecond = _o[1];
    var _p = react_1.useState(false), showFirst = _p[0], setShowFirst = _p[1];
    var _q = react_1.useState(false), showResults = _q[0], setShowResults = _q[1];
    var _r = react_1.useState(false), useDateRange = _r[0], setUseDateRange = _r[1];
    var _s = react_1.useState(""), fromDate = _s[0], setFromDate = _s[1];
    var _t = react_1.useState(""), toDate = _t[0], setToDate = _t[1];
    function loadTickets() {
        return __awaiter(this, void 0, void 0, function () {
            var url, res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "/api/raffle/random";
                        if (useDateRange && fromDate && toDate) {
                            url += "?from=" + fromDate + "&to=" + toDate;
                        }
                        return [4 /*yield*/, fetch(url, { cache: "no-store" })];
                    case 1:
                        res = _a.sent();
                        return [4 /*yield*/, res.json()];
                    case 2:
                        data = _a.sent();
                        if (data.error) {
                            alert(data.error);
                            return [2 /*return*/, null];
                        }
                        setTickets(data.tickets || []);
                        setWinners(data.winners || []);
                        return [2 /*return*/, data.tickets];
                }
            });
        });
    }
    function startReveal() {
        return __awaiter(this, void 0, void 0, function () {
            var loaded, interval;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(step === 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, loadTickets()];
                    case 1:
                        loaded = _a.sent();
                        if (!loaded || loaded.length === 0) {
                            alert("No tickets available for this draw.");
                            return [2 /*return*/];
                        }
                        _a.label = 2;
                    case 2:
                        if (step === 1)
                            setShowThird(false);
                        if (step === 2)
                            setShowSecond(false);
                        setAnimating(true);
                        interval = setInterval(function () {
                            setFakeCode("XX-" + Math.floor(100000 + Math.random() * 900000));
                        }, 80);
                        setTimeout(function () {
                            clearInterval(interval);
                            setAnimating(false);
                            if (step === 0) {
                                setShowThird(true);
                                confetti_1.confettiSide();
                            }
                            if (step === 1) {
                                setShowSecond(true);
                                confetti_1.confettiSide();
                            }
                            if (step === 2) {
                                setShowFirst(true);
                                confetti_1.confettiBurst();
                            }
                            setStep(function (prev) { return prev + 1; });
                        }, 7000);
                        return [2 /*return*/];
                }
            });
        });
    }
    function renderWinner(place, winner) {
        if (!winner)
            return null;
        return (React.createElement("div", { className: "fade-in spotlight border-4 border-yellow-400 p-8 rounded-2xl bg-black bg-opacity-60 w-full max-w-[420px] shadow-xl space-y-6" },
            React.createElement("h2", { className: "text-5xl font-extrabold text-yellow-400 text-center tracking-wide" }, place),
            React.createElement("div", { className: "text-center" },
                React.createElement("div", { className: "text-lg text-gray-300 uppercase tracking-wide" }, "Ticket Number"),
                React.createElement("div", { className: "text-4xl font-mono font-bold text-white mt-1" }, winner.ticketCode)),
            React.createElement("div", { className: "h-[1px] bg-gray-700 w-full" }),
            React.createElement("div", { className: "space-y-3 text-xl" },
                React.createElement("div", { className: "flex justify-between gap-4" },
                    React.createElement("span", { className: "text-gray-400" }, "Name:"),
                    React.createElement("span", { className: "text-white font-medium text-right max-w-[220px] break-words" }, winner.order.name)),
                React.createElement("div", { className: "flex justify-between gap-4" },
                    React.createElement("span", { className: "text-gray-400" }, "Email:"),
                    React.createElement("span", { className: "text-white font-medium text-right max-w-[220px] break-words" }, winner.order.email)),
                React.createElement("div", { className: "flex justify-between gap-4" },
                    React.createElement("span", { className: "text-gray-400" }, "Contact:"),
                    React.createElement("span", { className: "text-white font-medium text-right max-w-[220px] break-words" }, winner.order.contactNo)),
                React.createElement("div", { className: "flex justify-between gap-4" },
                    React.createElement("span", { className: "text-gray-400" }, "Event:"),
                    React.createElement("span", { className: "text-white font-medium text-right max-w-[220px] break-words" }, winner.order.event.title)),
                React.createElement("div", { className: "flex justify-between gap-4" },
                    React.createElement("span", { className: "text-gray-400" }, "Venue:"),
                    React.createElement("span", { className: "text-white font-medium text-right max-w-[220px] break-words" }, winner.order.event.venue)))));
    }
    function renderAnimation(place) {
        return (React.createElement("div", { className: "text-center space-y-6 animate-pulse" },
            React.createElement("h2", { className: "text-5xl font-bold text-yellow-400" }, place),
            React.createElement("div", { className: "text-6xl font-mono text-white" }, fakeCode),
            React.createElement("div", { className: "text-xl text-gray-400" }, "Drawing winner\u2026")));
    }
    return (React.createElement("div", { className: "min-h-screen flex flex-col items-center bg-black text-white overflow-hidden relative pb-40" },
        React.createElement("button", { onClick: function () { return router.push("/admin/raffle"); }, className: "fixed top-6 left-6 px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-lg text-xl font-semibold z-50" }, "\u2190 Back"),
        React.createElement("h1", { className: "text-6xl font-extrabold text-yellow-400 mt-10 mb-10" }, "Raffle Draw"),
        React.createElement("div", { className: "p-6 rounded-xl mb-10 space-y-4 shadow-lg transition-all duration-300 \n        " + (useDateRange ? "bg-white border-4 border-yellow-400" : "bg-white border border-gray-300") },
            React.createElement("label", { className: "flex items-center gap-3 text-xl text-black" },
                React.createElement("input", { type: "checkbox", checked: useDateRange, onChange: function (e) { return setUseDateRange(e.target.checked); } }),
                "Enable Date Range"),
            useDateRange && (React.createElement("div", { className: "flex gap-4 animate-fadeIn" },
                React.createElement("div", { className: "flex flex-col" },
                    React.createElement("label", { className: "text-sm text-gray-700" }, "From"),
                    React.createElement("input", { type: "date", value: fromDate, onChange: function (e) { return setFromDate(e.target.value); }, className: "px-3 py-2 rounded border border-gray-400 bg-white text-black focus:ring-2 focus:ring-yellow-400" })),
                React.createElement("div", { className: "flex flex-col" },
                    React.createElement("label", { className: "text-sm text-gray-700" }, "To"),
                    React.createElement("input", { type: "date", value: toDate, onChange: function (e) { return setToDate(e.target.value); }, className: "px-3 py-2 rounded border border-gray-400 bg-white text-black focus:ring-2 focus:ring-yellow-400" }))))),
        React.createElement("style", { jsx: true }, "\n        .fade-in {\n          animation: fadeIn 0.6s ease-out forwards;\n        }\n\n        @keyframes fadeIn {\n          from {\n            opacity: 0;\n            transform: translateY(20px) scale(0.98);\n          }\n          to {\n            opacity: 1;\n            transform: translateY(0) scale(1);\n          }\n        }\n\n        .spotlight {\n          position: relative;\n        }\n\n        .spotlight::before {\n          content: \"\";\n          position: absolute;\n          top: -40px;\n          left: 50%;\n          transform: translateX(-50%);\n          width: 260px;\n          height: 260px;\n          background: radial-gradient(\n            circle,\n            rgba(255, 255, 200, 0.25),\n            transparent 70%\n          );\n          z-index: -1;\n          filter: blur(20px);\n        }\n\n        .animate-fadeIn {\n          animation: fadeIn 0.4s ease-out;\n        }\n      "),
        showResults && (React.createElement("div", { className: "fade-in w-full flex flex-wrap justify-center items-start gap-10 mt-10 px-10" },
            React.createElement("div", null, renderWinner("3rd Place", (_a = winners[2]) !== null && _a !== void 0 ? _a : null)),
            React.createElement("div", null, renderWinner("1st Place", (_b = winners[0]) !== null && _b !== void 0 ? _b : null)),
            React.createElement("div", null, renderWinner("2nd Place", (_c = winners[1]) !== null && _c !== void 0 ? _c : null)))),
        !showResults && (React.createElement(React.Fragment, null,
            showThird && step === 1 && (React.createElement("div", { className: "flex flex-col items-center mb-24" }, renderWinner("3rd Place", (_d = winners[2]) !== null && _d !== void 0 ? _d : null))),
            showSecond && step === 2 && (React.createElement("div", { className: "flex flex-col items-center mb-24" }, renderWinner("2nd Place", (_e = winners[1]) !== null && _e !== void 0 ? _e : null))),
            showFirst && step === 3 && (React.createElement("div", { className: "flex flex-col items-center mb-24" }, renderWinner("1st Place", (_f = winners[0]) !== null && _f !== void 0 ? _f : null))),
            animating && (React.createElement("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none w-[400px]" }, renderAnimation(step === 0
                ? "3rd Place"
                : step === 1
                    ? "2nd Place"
                    : "1st Place"))))),
        !animating && !showResults && step === 3 && (React.createElement("button", { onClick: function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
                return __generator(this, function (_1) {
                    switch (_1.label) {
                        case 0:
                            setShowResults(true);
                            confetti_1.confettiRain();
                            return [4 /*yield*/, fetch("/api/raffle/random/save", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                        eventName: (_d = (_c = (_b = (_a = winners[0]) === null || _a === void 0 ? void 0 : _a.order) === null || _b === void 0 ? void 0 : _b.event) === null || _c === void 0 ? void 0 : _c.title) !== null && _d !== void 0 ? _d : null,
                                        firstTicket: (_e = winners[0]) === null || _e === void 0 ? void 0 : _e.ticketCode,
                                        firstName: (_g = (_f = winners[0]) === null || _f === void 0 ? void 0 : _f.order) === null || _g === void 0 ? void 0 : _g.name,
                                        firstEmail: (_j = (_h = winners[0]) === null || _h === void 0 ? void 0 : _h.order) === null || _j === void 0 ? void 0 : _j.email,
                                        firstContact: (_l = (_k = winners[0]) === null || _k === void 0 ? void 0 : _k.order) === null || _l === void 0 ? void 0 : _l.contactNo,
                                        secondTicket: (_m = winners[1]) === null || _m === void 0 ? void 0 : _m.ticketCode,
                                        secondName: (_p = (_o = winners[1]) === null || _o === void 0 ? void 0 : _o.order) === null || _p === void 0 ? void 0 : _p.name,
                                        secondEmail: (_r = (_q = winners[1]) === null || _q === void 0 ? void 0 : _q.order) === null || _r === void 0 ? void 0 : _r.email,
                                        secondContact: (_t = (_s = winners[1]) === null || _s === void 0 ? void 0 : _s.order) === null || _t === void 0 ? void 0 : _t.contactNo,
                                        thirdTicket: (_u = winners[2]) === null || _u === void 0 ? void 0 : _u.ticketCode,
                                        thirdName: (_w = (_v = winners[2]) === null || _v === void 0 ? void 0 : _v.order) === null || _w === void 0 ? void 0 : _w.name,
                                        thirdEmail: (_y = (_x = winners[2]) === null || _x === void 0 ? void 0 : _x.order) === null || _y === void 0 ? void 0 : _y.email,
                                        thirdContact: (_0 = (_z = winners[2]) === null || _z === void 0 ? void 0 : _z.order) === null || _0 === void 0 ? void 0 : _0.contactNo,
                                        usedDateRange: useDateRange,
                                        startDate: useDateRange ? fromDate : null,
                                        endDate: useDateRange ? toDate : null
                                    })
                                })];
                        case 1:
                            _1.sent();
                            return [2 /*return*/];
                    }
                });
            }); }, className: "px-10 py-6 bg-green-400 text-black text-3xl font-bold rounded-xl hover:bg-green-300 mt-10" }, "Show Results")),
        !animating && !showResults && step < 3 && (React.createElement("button", { onClick: startReveal, className: "px-10 py-6 bg-yellow-400 text-black text-3xl font-bold rounded-xl hover:bg-yellow-300 mt-10" }, "Reveal Next Winner"))));
}
exports["default"] = RandomRafflePage;
