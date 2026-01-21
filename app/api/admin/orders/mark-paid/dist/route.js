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
var generateQr_1 = require("@/lib/generateQr");
var generateTicketImage_1 = require("@/lib/generateTicketImage");
var sendTicketEmails_1 = require("@/lib/sendTicketEmails");
var crypto_1 = require("crypto");
function POST(req) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function () {
        var _d, orderId, receiptNote, order_1, ticketsToCreate_1, pushTickets, _e, ticketImages, _i, _f, ticket, qrBuffer, qrBase64, ticketImage, error_1;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    _g.trys.push([0, 14, , 15]);
                    return [4 /*yield*/, req.json()];
                case 1:
                    _d = _g.sent(), orderId = _d.orderId, receiptNote = _d.receiptNote;
                    if (!orderId) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: "orderId is required" }, { status: 400 })];
                    }
                    return [4 /*yield*/, prisma_1.prisma.order.findUnique({
                            where: { id: orderId },
                            include: {
                                event: true,
                                tickets: true
                            }
                        })];
                case 2:
                    order_1 = _g.sent();
                    if (!order_1) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Order not found" }, { status: 404 })];
                    }
                    // Mark order as paid
                    return [4 /*yield*/, prisma_1.prisma.order.update({
                            where: { id: orderId },
                            data: {
                                paid: true,
                                status: "PAID",
                                receiptNote: receiptNote || null
                            }
                        })];
                case 3:
                    // Mark order as paid
                    _g.sent();
                    if (!(!order_1.tickets || order_1.tickets.length === 0)) return [3 /*break*/, 6];
                    ticketsToCreate_1 = [];
                    pushTickets = function (count, category, tier) {
                        for (var i = 0; i < count; i++) {
                            var code = "" + category[0] + tier[0] + "-" + Math.floor(100000 + Math.random() * 900000);
                            ticketsToCreate_1.push({
                                id: crypto_1.randomUUID(),
                                orderId: order_1.id,
                                category: category,
                                tier: tier,
                                ticketCode: code,
                                qrCode: code
                            });
                        }
                    };
                    pushTickets(order_1.adultLounge, "ADULT", "LOUNGE");
                    pushTickets(order_1.adultStandard, "ADULT", "STANDARD");
                    pushTickets(order_1.childLounge, "CHILD", "LOUNGE");
                    pushTickets(order_1.childStandard, "CHILD", "STANDARD");
                    return [4 /*yield*/, prisma_1.prisma.ticket.createMany({
                            data: ticketsToCreate_1
                        })];
                case 4:
                    _g.sent();
                    // Reload tickets
                    _e = order_1;
                    return [4 /*yield*/, prisma_1.prisma.ticket.findMany({
                            where: { orderId: orderId }
                        })];
                case 5:
                    // Reload tickets
                    _e.tickets = _g.sent();
                    _g.label = 6;
                case 6:
                    ticketImages = [];
                    _i = 0, _f = order_1.tickets;
                    _g.label = 7;
                case 7:
                    if (!(_i < _f.length)) return [3 /*break*/, 11];
                    ticket = _f[_i];
                    return [4 /*yield*/, generateQr_1.generateQr(ticket.qrCode)];
                case 8:
                    qrBuffer = _g.sent();
                    qrBase64 = qrBuffer.toString("base64");
                    return [4 /*yield*/, generateTicketImage_1.generateBrandedTicket({
                            qrPng: qrBase64,
                            event: order_1.event.title,
                            name: (_a = order_1.name) !== null && _a !== void 0 ? _a : "Guest",
                            date: order_1.event.date.toISOString().split("T")[0],
                            venue: order_1.event.venue,
                            category: ticket.category,
                            tier: ticket.tier,
                            ticketCode: (_b = ticket.ticketCode) !== null && _b !== void 0 ? _b : ""
                        })];
                case 9:
                    ticketImage = _g.sent();
                    ticketImages.push({
                        category: ticket.category,
                        tier: ticket.tier,
                        code: (_c = ticket.ticketCode) !== null && _c !== void 0 ? _c : "",
                        image: ticketImage
                    });
                    _g.label = 10;
                case 10:
                    _i++;
                    return [3 /*break*/, 7];
                case 11: 
                // ----------------------------------------------------
                // 3. Send ticket email
                // ----------------------------------------------------
                return [4 /*yield*/, sendTicketEmails_1.sendTicketEmail({
                        to: order_1.email,
                        tickets: ticketImages,
                        order: order_1
                    })];
                case 12:
                    // ----------------------------------------------------
                    // 3. Send ticket email
                    // ----------------------------------------------------
                    _g.sent();
                    // ----------------------------------------------------
                    // 4. Mark as sent
                    // ----------------------------------------------------
                    return [4 /*yield*/, prisma_1.prisma.order.update({
                            where: { id: orderId },
                            data: { ticketSent: true }
                        })];
                case 13:
                    // ----------------------------------------------------
                    // 4. Mark as sent
                    // ----------------------------------------------------
                    _g.sent();
                    return [2 /*return*/, server_1.NextResponse.json({
                            ok: true,
                            message: "Order marked as paid, tickets generated, and email sent"
                        })];
                case 14:
                    error_1 = _g.sent();
                    console.error("Mark paid error:", error_1);
                    return [2 /*return*/, server_1.NextResponse.json({ error: "Internal server error" }, { status: 500 })];
                case 15: return [2 /*return*/];
            }
        });
    });
}
exports.POST = POST;
