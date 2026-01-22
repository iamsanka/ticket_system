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
exports.GET = void 0;
var server_1 = require("next/server");
var prisma_1 = require("@/lib/prisma");
var generateQr_1 = require("@/lib/generateQr");
var generateTicketImage_1 = require("@/lib/generateTicketImage");
var sendTicketEmails_1 = require("@/lib/sendTicketEmails");
function GET(req) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function () {
        var searchParams, orderId, order, ticketImages, _i, _d, ticket, qrBuffer, qrBase64, ticketImage;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    searchParams = new URL(req.url).searchParams;
                    orderId = searchParams.get("orderId");
                    if (!orderId) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Missing orderId" }, { status: 400 })];
                    }
                    return [4 /*yield*/, prisma_1.prisma.order.findUnique({
                            where: { id: orderId },
                            include: { event: true, tickets: true }
                        })];
                case 1:
                    order = _e.sent();
                    if (!order) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Order not found" }, { status: 404 })];
                    }
                    if (order.ticketSent) {
                        return [2 /*return*/, server_1.NextResponse.json({ message: "Tickets already sent" })];
                    }
                    if (!order.tickets || order.tickets.length === 0) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: "No tickets exist for this order" }, { status: 400 })];
                    }
                    ticketImages = [];
                    _i = 0, _d = order.tickets;
                    _e.label = 2;
                case 2:
                    if (!(_i < _d.length)) return [3 /*break*/, 6];
                    ticket = _d[_i];
                    return [4 /*yield*/, generateQr_1.generateQr(ticket.qrCode)];
                case 3:
                    qrBuffer = _e.sent();
                    qrBase64 = qrBuffer.toString("base64");
                    return [4 /*yield*/, generateTicketImage_1.generateBrandedTicket({
                            qrPng: qrBase64,
                            event: order.event.title,
                            name: (_a = order.name) !== null && _a !== void 0 ? _a : "Guest",
                            date: order.event.date.toISOString().split("T")[0],
                            venue: order.event.venue,
                            category: ticket.category,
                            tier: ticket.tier,
                            ticketCode: (_b = ticket.ticketCode) !== null && _b !== void 0 ? _b : ""
                        })];
                case 4:
                    ticketImage = _e.sent();
                    ticketImages.push({
                        category: ticket.category,
                        tier: ticket.tier,
                        code: (_c = ticket.ticketCode) !== null && _c !== void 0 ? _c : "",
                        image: ticketImage
                    });
                    _e.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 2];
                case 6: return [4 /*yield*/, sendTicketEmails_1.sendTicketEmail({
                        to: order.email,
                        tickets: ticketImages,
                        order: order
                    })];
                case 7:
                    _e.sent();
                    return [4 /*yield*/, prisma_1.prisma.order.update({
                            where: { id: orderId },
                            data: { ticketSent: true }
                        })];
                case 8:
                    _e.sent();
                    return [2 /*return*/, server_1.NextResponse.json({ message: "Tickets emailed successfully" })];
            }
        });
    });
}
exports.GET = GET;
