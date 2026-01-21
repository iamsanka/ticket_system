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
exports.CheckoutForm = void 0;
var react_1 = require("react");
var react_stripe_js_1 = require("@stripe/react-stripe-js");
var navigation_1 = require("next/navigation");
function CheckoutForm(_a) {
    var _this = this;
    var amount = _a.amount, onSuccess = _a.onSuccess;
    var stripe = react_stripe_js_1.useStripe();
    var elements = react_stripe_js_1.useElements();
    var router = navigation_1.useRouter();
    var _b = react_1.useState(false), loading = _b[0], setLoading = _b[1];
    var _c = react_1.useState(null), errorMessage = _c[0], setErrorMessage = _c[1];
    var handleSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var _a, error, paymentIntent;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    e.preventDefault();
                    if (!stripe || !elements)
                        return [2 /*return*/];
                    setLoading(true);
                    setErrorMessage(null);
                    return [4 /*yield*/, stripe.confirmPayment({
                            elements: elements,
                            confirmParams: { return_url: undefined },
                            redirect: "if_required"
                        })];
                case 1:
                    _a = _b.sent(), error = _a.error, paymentIntent = _a.paymentIntent;
                    if (error) {
                        setErrorMessage(error.message || "Payment failed");
                        setLoading(false);
                        return [2 /*return*/];
                    }
                    if ((paymentIntent === null || paymentIntent === void 0 ? void 0 : paymentIntent.status) === "succeeded") {
                        // Redirect to thank-you page
                        router.push("/thank-you");
                        return [2 /*return*/];
                    }
                    setLoading(false);
                    return [2 /*return*/];
            }
        });
    }); };
    return (React.createElement("form", { onSubmit: handleSubmit, style: {
            maxWidth: 500,
            margin: "0 auto",
            padding: 24,
            borderRadius: 12,
            background: "#111",
            color: "#f5f5f5",
            boxShadow: "0 10px 30px rgba(0,0,0,0.4)"
        } },
        React.createElement("h2", { style: { marginBottom: 16 } }, "Complete your payment"),
        React.createElement("p", { style: { marginBottom: 16 } },
            "Total: ",
            React.createElement("strong", null,
                (amount / 100).toFixed(2),
                " \u20AC")),
        React.createElement("div", { style: { marginBottom: 16 } },
            React.createElement(react_stripe_js_1.PaymentElement, null)),
        errorMessage && (React.createElement("p", { style: { color: "#f87171", marginBottom: 12 } }, errorMessage)),
        React.createElement("button", { type: "submit", disabled: !stripe || loading, style: {
                width: "100%",
                padding: "10px 16px",
                borderRadius: 8,
                border: "none",
                background: "linear-gradient(135deg, #d4af37, #b8860b)",
                color: "#000",
                fontWeight: 600,
                cursor: loading ? "wait" : "pointer"
            } }, loading ? "Processing..." : "Pay now")));
}
exports.CheckoutForm = CheckoutForm;
