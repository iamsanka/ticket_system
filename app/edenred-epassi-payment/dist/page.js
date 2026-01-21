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
var navigation_1 = require("next/navigation");
var generateQr_1 = require("@/lib/generateQr");
function EdenredPage(_a) {
    var searchParams = _a.searchParams;
    return __awaiter(this, void 0, void 0, function () {
        var orderId, order, totalEuro, eventTitle, eventDate, edenredUrl, qrBuffer, qrBase64;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, searchParams];
                case 1:
                    orderId = (_b.sent()).orderId;
                    if (!orderId)
                        return [2 /*return*/, navigation_1.notFound()];
                    return [4 /*yield*/, prisma_1.prisma.order.findUnique({
                            where: { id: orderId },
                            select: {
                                totalAmount: true,
                                event: {
                                    select: {
                                        title: true,
                                        date: true
                                    }
                                }
                            }
                        })];
                case 2:
                    order = _b.sent();
                    if (!order)
                        return [2 /*return*/, navigation_1.notFound()];
                    totalEuro = (order.totalAmount / 100).toFixed(2);
                    eventTitle = order.event.title;
                    eventDate = new Date(order.event.date).toLocaleDateString("fi-FI");
                    edenredUrl = process.env.EDENRED_PAYMENT_URL;
                    if (!edenredUrl)
                        throw new Error("Missing EDENRED_PAYMENT_URL in .env");
                    return [4 /*yield*/, generateQr_1.generateQr(edenredUrl)];
                case 3:
                    qrBuffer = _b.sent();
                    qrBase64 = "data:image/png;base64," + qrBuffer.toString("base64");
                    return [2 /*return*/, (React.createElement("div", { className: "min-h-screen bg-gray-900 text-white p-6" },
                            React.createElement("div", { className: "max-w-xl mx-auto space-y-8" },
                                React.createElement("h1", { className: "text-2xl font-bold text-center" }, "Complete Your Payment"),
                                React.createElement("div", { className: "bg-gray-800 border border-gray-700 p-4 rounded text-lg font-semibold text-center" },
                                    "Total to Pay: ",
                                    React.createElement("span", { className: "text-yellow-400" },
                                        "\u20AC",
                                        totalEuro)),
                                React.createElement("div", { className: "text-center text-sm text-gray-400" },
                                    React.createElement("p", null, eventTitle),
                                    React.createElement("p", null, eventDate)),
                                React.createElement("div", { className: "bg-gray-800 p-4 rounded-lg space-y-3" },
                                    React.createElement("h2", { className: "font-semibold text-lg" }, "Step 1: Scan to open Edenred"),
                                    React.createElement("p", { className: "text-sm text-gray-300" }, "Scan the QR code below with your phone camera to open Edenred. If the app is installed, it may open automatically."),
                                    React.createElement("div", { className: "flex justify-center" },
                                        React.createElement("img", { src: qrBase64, alt: "Edenred QR", className: "w-48 h-48 border rounded" })),
                                    React.createElement("p", { className: "text-sm text-gray-300" },
                                        "Or open Edenred manually and search for",
                                        " ",
                                        React.createElement("strong", { className: "text-white" }, "Taprobane Entertainment"),
                                        ".")),
                                React.createElement("div", { className: "bg-gray-800 p-4 rounded-lg space-y-3" },
                                    React.createElement("h2", { className: "font-semibold text-lg" }, "Step 2: Send Screenshot via WhatsApp"),
                                    React.createElement("a", { href: "https://wa.me/358442363616", className: "block bg-green-600 text-white p-3 rounded text-center font-semibold" }, "Send to WhatsApp (+358 44 236 3616)"),
                                    React.createElement("a", { href: "https://wa.me/358442363618", className: "block bg-green-600 text-white p-3 rounded text-center font-semibold" }, "Send to WhatsApp (+358 44 236 3618)")),
                                React.createElement("div", { className: "bg-gray-800 p-4 rounded-lg space-y-3" },
                                    React.createElement("h2", { className: "font-semibold text-lg" }, "Step 3: Continue"),
                                    React.createElement("p", { className: "text-sm text-gray-300" }, "After sending the screenshot, click continue. We will verify your payment and send your tickets."),
                                    React.createElement("a", { href: "/thank-you", className: "block bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-3 rounded text-center" }, "Continue")))))];
            }
        });
    });
}
exports["default"] = EdenredPage;
