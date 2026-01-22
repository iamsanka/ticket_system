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
var StripeProvider_1 = require("@/app/component/StripeProvider");
var CheckoutForm_1 = require("@/app/component/CheckoutForm");
console.log("USING CHECKOUT PAGE VERSION FIXED");
function fetchOrder(orderId) {
    return __awaiter(this, void 0, void 0, function () {
        var res, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(process.env.NEXT_PUBLIC_URL + "/api/order?orderId=" + orderId, { cache: "no-store" })];
                case 1:
                    res = _a.sent();
                    if (!res.ok)
                        throw new Error("Order not found");
                    return [4 /*yield*/, res.json()];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, data.order];
            }
        });
    });
}
function fetchClientSecret(order) {
    return __awaiter(this, void 0, void 0, function () {
        var res, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(process.env.NEXT_PUBLIC_URL + "/api/checkout", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        cache: "no-store",
                        body: JSON.stringify({
                            eventId: order.eventId,
                            name: order.name,
                            email: order.email,
                            contactNo: order.contactNo,
                            adultLounge: order.adultLounge,
                            adultStandard: order.adultStandard,
                            childLounge: order.childLounge,
                            childStandard: order.childStandard,
                            paymentMethod: "stripe"
                        })
                    })];
                case 1:
                    res = _a.sent();
                    if (!res.ok)
                        throw new Error("Failed to create PaymentIntent");
                    return [4 /*yield*/, res.json()];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, data.clientSecret];
            }
        });
    });
}
function CheckoutPage(_a) {
    var searchParams = _a.searchParams;
    return __awaiter(this, void 0, void 0, function () {
        var params, orderId, order, clientSecret;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, searchParams];
                case 1:
                    params = _b.sent();
                    orderId = params.orderId;
                    if (!orderId) {
                        return [2 /*return*/, React.createElement("div", { style: { color: "white", padding: 40 } }, "Missing orderId")];
                    }
                    return [4 /*yield*/, fetchOrder(orderId)];
                case 2:
                    order = _b.sent();
                    return [4 /*yield*/, fetchClientSecret(order)];
                case 3:
                    clientSecret = _b.sent();
                    return [2 /*return*/, (React.createElement("div", { style: {
                                minHeight: "100vh",
                                background: "#050505",
                                padding: "40px 16px"
                            } },
                            React.createElement("div", { style: { maxWidth: 900, margin: "0 auto" } },
                                React.createElement("h1", { style: {
                                        color: "#f5f5f5",
                                        marginBottom: 24,
                                        textAlign: "center"
                                    } }, "Checkout"),
                                React.createElement(StripeProvider_1.StripeProvider, { clientSecret: clientSecret },
                                    React.createElement(CheckoutForm_1.CheckoutForm, { amount: order.totalAmount })))))];
            }
        });
    });
}
exports["default"] = CheckoutPage;
