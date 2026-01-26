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
var stripe_1 = require("stripe");
var stripe = new stripe_1["default"](process.env.STRIPE_SECRET_KEY);
function noCacheJson(data, status) {
    if (status === void 0) { status = 200; }
    return server_1.NextResponse.json(data, {
        status: status,
        headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
            Pragma: "no-cache",
            Expires: "0"
        }
    });
}
function POST(req) {
    return __awaiter(this, void 0, void 0, function () {
        var body, eventId, name, email, contactNo, _a, adultLounge, _b, adultStandard, _c, childLounge, _d, childStandard, paymentMethod, event, subtotal, currentLoungeCount, serviceFee, totalTickets, totalAmount, order_1, existingOrder, paymentIntent_1, order, orderId, paymentIntent, error_1;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 12, , 13]);
                    return [4 /*yield*/, req.json()];
                case 1:
                    body = _e.sent();
                    eventId = body.eventId, name = body.name, email = body.email, contactNo = body.contactNo, _a = body.adultLounge, adultLounge = _a === void 0 ? 0 : _a, _b = body.adultStandard, adultStandard = _b === void 0 ? 0 : _b, _c = body.childLounge, childLounge = _c === void 0 ? 0 : _c, _d = body.childStandard, childStandard = _d === void 0 ? 0 : _d, paymentMethod = body.paymentMethod;
                    if (!eventId || !email || !name || !paymentMethod) {
                        return [2 /*return*/, noCacheJson({ error: "Missing required fields" }, 400)];
                    }
                    return [4 /*yield*/, prisma_1.prisma.event.findUnique({
                            where: { id: eventId }
                        })];
                case 2:
                    event = _e.sent();
                    if (!event) {
                        return [2 /*return*/, noCacheJson({ error: "Event not found" }, 404)];
                    }
                    subtotal = adultLounge * event.adultLoungePrice +
                        adultStandard * event.adultStandardPrice +
                        childLounge * event.childLoungePrice +
                        childStandard * event.childStandardPrice;
                    if (subtotal < 50) {
                        return [2 /*return*/, noCacheJson({
                                error: "Minimum charge is €0.50. Please select at least one ticket."
                            }, 400)];
                    }
                    if (!(adultLounge > 0)) return [3 /*break*/, 4];
                    return [4 /*yield*/, prisma_1.prisma.ticket.count({
                            where: {
                                category: "ADULT",
                                tier: "LOUNGE"
                            }
                        })];
                case 3:
                    currentLoungeCount = _e.sent();
                    if (currentLoungeCount + adultLounge > 100) {
                        return [2 /*return*/, noCacheJson({
                                error: "Only " + Math.max(0, 100 - currentLoungeCount) + " Adult Lounge seats remaining."
                            }, 400)];
                    }
                    _e.label = 4;
                case 4:
                    serviceFee = 0;
                    if (paymentMethod === "edenred") {
                        serviceFee = Math.round(subtotal * 0.05); // 5%
                    }
                    if (paymentMethod === "epassi") {
                        totalTickets = adultLounge +
                            adultStandard +
                            childLounge +
                            childStandard;
                        serviceFee = totalTickets * 500; // €5 per ticket
                    }
                    totalAmount = subtotal + serviceFee;
                    if (!(paymentMethod === "edenred" || paymentMethod === "epassi")) return [3 /*break*/, 6];
                    return [4 /*yield*/, prisma_1.prisma.order.create({
                            data: {
                                eventId: eventId,
                                name: name,
                                email: email,
                                contactNo: contactNo,
                                adultLounge: adultLounge,
                                adultStandard: adultStandard,
                                childLounge: childLounge,
                                childStandard: childStandard,
                                serviceFee: serviceFee,
                                totalAmount: totalAmount,
                                paymentMethod: paymentMethod,
                                status: "AWAITING_VERIFICATION",
                                paid: false
                            }
                        })];
                case 5:
                    order_1 = _e.sent();
                    return [2 /*return*/, noCacheJson({ orderId: order_1.id })];
                case 6: return [4 /*yield*/, prisma_1.prisma.order.findFirst({
                        where: {
                            eventId: eventId,
                            email: email,
                            paymentMethod: "stripe",
                            paid: false
                        }
                    })];
                case 7:
                    existingOrder = _e.sent();
                    if (!existingOrder) return [3 /*break*/, 9];
                    console.log("Reusing existing Stripe order:", existingOrder.id);
                    return [4 /*yield*/, stripe.paymentIntents.create({
                            amount: subtotal,
                            currency: "eur",
                            metadata: { orderId: existingOrder.id },
                            receipt_email: email
                        })];
                case 8:
                    paymentIntent_1 = _e.sent();
                    return [2 /*return*/, noCacheJson({
                            clientSecret: paymentIntent_1.client_secret,
                            orderId: existingOrder.id
                        })];
                case 9: return [4 /*yield*/, prisma_1.prisma.order.create({
                        data: {
                            eventId: eventId,
                            name: name,
                            email: email,
                            contactNo: contactNo,
                            adultLounge: adultLounge,
                            adultStandard: adultStandard,
                            childLounge: childLounge,
                            childStandard: childStandard,
                            serviceFee: 0,
                            totalAmount: subtotal,
                            paymentMethod: "stripe",
                            status: "pending",
                            paid: false
                        }
                    })];
                case 10:
                    order = _e.sent();
                    orderId = order.id;
                    return [4 /*yield*/, stripe.paymentIntents.create({
                            amount: subtotal,
                            currency: "eur",
                            metadata: { orderId: orderId },
                            receipt_email: email
                        })];
                case 11:
                    paymentIntent = _e.sent();
                    return [2 /*return*/, noCacheJson({
                            clientSecret: paymentIntent.client_secret,
                            orderId: orderId
                        })];
                case 12:
                    error_1 = _e.sent();
                    console.error("Checkout error:", error_1);
                    return [2 /*return*/, noCacheJson({ error: error_1.message || "Checkout failed" }, 500)];
                case 13: return [2 /*return*/];
            }
        });
    });
}
exports.POST = POST;
