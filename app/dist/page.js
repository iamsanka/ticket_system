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
var prisma_1 = require("@/lib/prisma");
var link_1 = require("next/link");
var image_1 = require("next/image");
// Format date like "24th April 2026"
function formatEventDate(dateInput) {
    var date = new Date(dateInput);
    var day = date.getDate();
    var month = date.toLocaleString("en-US", { month: "long" });
    var year = date.getFullYear();
    var suffix = day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
            ? "nd"
            : day % 10 === 3 && day !== 13
                ? "rd"
                : "th";
    return "" + day + suffix + " " + month + " " + year;
}
function HomePage() {
    return __awaiter(this, void 0, void 0, function () {
        var event;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma_1.prisma.event.findFirst({
                        orderBy: { date: "asc" }
                    })];
                case 1:
                    event = _a.sent();
                    if (!event) {
                        return [2 /*return*/, (React.createElement("main", { className: "p-10" },
                                React.createElement("h1", { className: "text-2xl font-bold" }, "No events available")))];
                    }
                    return [2 /*return*/, (React.createElement("main", { className: "p-10" },
                            React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-10 items-start" },
                                React.createElement("div", null,
                                    React.createElement("h1", { className: "text-4xl font-bold mb-2" }, event.title),
                                    React.createElement("p", { className: "text-lg text-gray-700 mb-4 leading-relaxed" },
                                        React.createElement("strong", null, "Date:"),
                                        " ",
                                        formatEventDate(event.date),
                                        React.createElement("br", null),
                                        React.createElement("strong", null, "Venue:"),
                                        " ",
                                        event.venue),
                                    React.createElement("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-6 text-black text-lg shadow-md" },
                                        React.createElement("h2", { className: "text-2xl font-bold text-center mb-6" }, "Ticket Prices"),
                                        React.createElement("div", { className: "space-y-6" },
                                            React.createElement("div", null,
                                                React.createElement("h3", { className: "text-xl font-semibold mb-2 text-center" }, "Adult Tickets"),
                                                React.createElement("div", { className: "flex justify-between px-4 opacity-50" },
                                                    React.createElement("p", null, "Taprobane Lounge"),
                                                    React.createElement("p", { className: "font-bold text-red-600" }, "Sold Out")),
                                                React.createElement("div", { className: "flex justify-between px-4" },
                                                    React.createElement("p", null, "Standard"),
                                                    React.createElement("p", null,
                                                        React.createElement("span", { className: "line-through text-red-600 mr-2" }, "\u20AC50"),
                                                        React.createElement("span", { className: "font-bold text-green-700" },
                                                            "\u20AC",
                                                            event.adultStandardPrice / 100)))),
                                            React.createElement("div", null,
                                                React.createElement("h3", { className: "text-xl font-semibold mb-2 text-center" }, "Child Tickets"),
                                                React.createElement("div", { className: "flex justify-between px-4 opacity-50" },
                                                    React.createElement("p", null, "Taprobane Lounge"),
                                                    React.createElement("p", { className: "font-bold text-red-600" }, "Sold Out")),
                                                React.createElement("div", { className: "flex justify-between px-4" },
                                                    React.createElement("p", null, "Standard"),
                                                    React.createElement("p", null,
                                                        React.createElement("span", { className: "line-through text-red-600 mr-2" }, "\u20AC30"),
                                                        React.createElement("span", { className: "font-bold text-green-700" },
                                                            "\u20AC",
                                                            event.childStandardPrice / 100)))))),
                                    React.createElement("div", { className: "mt-8" },
                                        React.createElement(link_1["default"], { href: "/event/" + event.id, className: "inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition text-lg font-semibold" }, "Buy Tickets"))),
                                React.createElement("div", { className: "flex justify-center" },
                                    React.createElement(image_1["default"], { src: "/news.jpeg", alt: "Event visual", width: 500, height: 500, className: "rounded-lg shadow-lg object-cover" })))))];
            }
        });
    });
}
exports["default"] = HomePage;
