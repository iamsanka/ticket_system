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
exports.POST = void 0;
var server_1 = require("next/server");
var prisma_1 = require("@/lib/prisma");
var sendTicketEmails_1 = require("@/lib/sendTicketEmails");
var generateQr_1 = require("@/lib/generateQr");
var generateTicketImage_1 = require("@/lib/generateTicketImage");
// ⭐ Generate ticket codes in the SAME format as your normal purchase flow
function generateTicketCode(category, tier) {
    var prefix = category === "ADULT" && tier === "STANDARD"
        ? "AS"
        : category === "ADULT" && tier === "LOUNGE"
            ? "AL"
            : category === "CHILD" && tier === "STANDARD"
                ? "CS"
                : "CL";
    var random = Math.floor(100000 + Math.random() * 900000);
    return prefix + "-" + random;
}
function POST(req) {
    return __awaiter(this, void 0, void 0, function () {
        var orderId, oldOrder, newOrder, formattedTickets, _i, _a, t, qrBuffer, qrBase64, ticketImage;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, req.json()];
                case 1:
                    orderId = (_b.sent()).orderId;
                    return [4 /*yield*/, prisma_1.prisma.order.findUnique({
                            where: { id: orderId },
                            include: { tickets: true, event: true }
                        })];
                case 2:
                    oldOrder = _b.sent();
                    if (!oldOrder) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Order not found" }, { status: 404 })];
                    }
                    // Delete old tickets
                    return [4 /*yield*/, prisma_1.prisma.ticket.deleteMany({
                            where: { orderId: orderId }
                        })];
                case 3:
                    // Delete old tickets
                    _b.sent();
                    // Delete old order
                    return [4 /*yield*/, prisma_1.prisma.order["delete"]({
                            where: { id: orderId }
                        })];
                case 4:
                    // Delete old order
                    _b.sent();
                    return [4 /*yield*/, prisma_1.prisma.order.create({
                            data: {
                                eventId: oldOrder.eventId,
                                name: oldOrder.name,
                                email: oldOrder.email,
                                contactNo: oldOrder.contactNo,
                                // ⭐ Preserve original values
                                paymentMethod: oldOrder.paymentMethod,
                                totalAmount: oldOrder.totalAmount,
                                serviceFee: oldOrder.serviceFee,
                                receiptUrl: oldOrder.receiptUrl,
                                paid: oldOrder.paid,
                                status: oldOrder.status,
                                ticketSent: oldOrder.ticketSent,
                                // ⭐ Only change this
                                receiptNote: "manual upgrade",
                                // ⭐ Update ticket counts
                                adultLounge: oldOrder.adultLounge + oldOrder.adultStandard,
                                adultStandard: 0,
                                childLounge: oldOrder.childLounge + oldOrder.childStandard,
                                childStandard: 0,
                                tickets: {
                                    create: oldOrder.tickets.map(function (t) {
                                        var code = generateTicketCode(t.category, "LOUNGE");
                                        return {
                                            category: t.category,
                                            tier: "LOUNGE",
                                            // ⭐ QR code must match ticket code
                                            qrCode: code,
                                            ticketCode: code
                                        };
                                    })
                                }
                            },
                            include: { tickets: true, event: true }
                        })];
                case 5:
                    newOrder = _b.sent();
                    formattedTickets = [];
                    _i = 0, _a = newOrder.tickets;
                    _b.label = 6;
                case 6:
                    if (!(_i < _a.length)) return [3 /*break*/, 10];
                    t = _a[_i];
                    return [4 /*yield*/, generateQr_1.generateQr(t.qrCode)];
                case 7:
                    qrBuffer = _b.sent();
                    qrBase64 = qrBuffer.toString("base64");
                    return [4 /*yield*/, generateTicketImage_1.generateBrandedTicket({
                            qrPng: qrBase64,
                            event: newOrder.event.title,
                            name: newOrder.name || "Guest",
                            date: newOrder.event.date.toString(),
                            venue: newOrder.event.venue,
                            category: t.category,
                            tier: t.tier,
                            ticketCode: t.ticketCode
                        })];
                case 8:
                    ticketImage = _b.sent();
                    formattedTickets.push({
                        category: t.category,
                        tier: t.tier,
                        code: t.ticketCode,
                        image: ticketImage
                    });
                    _b.label = 9;
                case 9:
                    _i++;
                    return [3 /*break*/, 6];
                case 10: 
                // Send upgraded email
                return [4 /*yield*/, sendTicketEmails_1.sendTicketEmail({
                        to: newOrder.email,
                        tickets: formattedTickets,
                        order: newOrder,
                        upgraded: true
                    })];
                case 11:
                    // Send upgraded email
                    _b.sent();
                    return [2 /*return*/, server_1.NextResponse.json({ message: "Order upgraded successfully" })];
            }
        });
    });
}
exports.POST = POST;
