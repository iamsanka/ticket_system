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
exports.POST = exports.bodyParser = exports.dynamic = exports.runtime = void 0;
var server_1 = require("next/server");
var stripe_1 = require("stripe");
var prisma_1 = require("@/lib/prisma");
exports.runtime = "nodejs";
exports.dynamic = "force-dynamic";
//export const preferredRegion = "undefined";
exports.bodyParser = false;
var stripe = new stripe_1["default"](process.env.STRIPE_SECRET_KEY);
function POST(req) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        function pushTickets(count, category, tier) {
            for (var i = 0; i < count; i++) {
                ticketsToCreate_1.push({
                    orderId: orderId_1,
                    category: category,
                    tier: tier,
                    ticketCode: "" + category[0] + tier[0] + "-" + Math.floor(100000 + Math.random() * 900000),
                    qrCode: "QR-" + Math.floor(Math.random() * 1000000)
                });
            }
        }
        var body, sig, event, intent, orderId_1, order, existingTickets, ticketsToCreate_1, intent, orderId;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, req.text()];
                case 1:
                    body = _c.sent();
                    sig = req.headers.get("stripe-signature");
                    try {
                        event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
                    }
                    catch (err) {
                        console.error("Webhook signature error:", err.message);
                        return [2 /*return*/, new server_1.NextResponse("Webhook Error: " + err.message, { status: 400 })];
                    }
                    if (!(event.type === "payment_intent.succeeded")) return [3 /*break*/, 8];
                    intent = event.data.object;
                    orderId_1 = (_a = intent.metadata) === null || _a === void 0 ? void 0 : _a.orderId;
                    if (!orderId_1) return [3 /*break*/, 8];
                    console.log("payment_intent.succeeded for order:", orderId_1);
                    return [4 /*yield*/, prisma_1.prisma.order.findUnique({
                            where: { id: orderId_1 },
                            include: { event: true }
                        })];
                case 2:
                    order = _c.sent();
                    // Idempotency guard: skip if already paid or missing
                    if (!order || order.paid) {
                        console.log("Skipping duplicate or missing order:", orderId_1);
                        return [2 /*return*/, server_1.NextResponse.json({ received: true })];
                    }
                    return [4 /*yield*/, prisma_1.prisma.order.update({
                            where: { id: orderId_1 },
                            data: { paid: true }
                        })];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, prisma_1.prisma.ticket.count({
                            where: { orderId: orderId_1 }
                        })];
                case 4:
                    existingTickets = _c.sent();
                    if (!(existingTickets === 0)) return [3 /*break*/, 6];
                    ticketsToCreate_1 = [];
                    pushTickets(order.adultLounge, "ADULT", "LOUNGE");
                    pushTickets(order.adultStandard, "ADULT", "STANDARD");
                    pushTickets(order.childLounge, "CHILD", "LOUNGE");
                    pushTickets(order.childStandard, "CHILD", "STANDARD");
                    if (!(ticketsToCreate_1.length > 0)) return [3 /*break*/, 6];
                    return [4 /*yield*/, prisma_1.prisma.ticket.createMany({ data: ticketsToCreate_1 })];
                case 5:
                    _c.sent();
                    _c.label = 6;
                case 6: 
                // Trigger ticket email
                return [4 /*yield*/, fetch(process.env.NEXT_PUBLIC_URL + "/api/send-ticket?orderId=" + orderId_1)];
                case 7:
                    // Trigger ticket email
                    _c.sent();
                    _c.label = 8;
                case 8:
                    if (!(event.type === "payment_intent.payment_failed")) return [3 /*break*/, 10];
                    intent = event.data.object;
                    orderId = (_b = intent.metadata) === null || _b === void 0 ? void 0 : _b.orderId;
                    if (!orderId) return [3 /*break*/, 10];
                    console.log("payment_intent.payment_failed for order:", orderId);
                    return [4 /*yield*/, prisma_1.prisma.order.update({
                            where: { id: orderId },
                            data: { paid: false }
                        })];
                case 9:
                    _c.sent();
                    _c.label = 10;
                case 10: return [2 /*return*/, server_1.NextResponse.json({ received: true })];
            }
        });
    });
}
exports.POST = POST;
