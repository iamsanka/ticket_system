"use strict";
exports.__esModule = true;
exports.calculateServiceFee = exports.calculateVat = exports.VAT_RATE = void 0;
exports.VAT_RATE = 0.135;
function calculateVat(total) {
    var vatAmount = total * exports.VAT_RATE;
    var netAmount = total - vatAmount;
    return {
        vatAmount: vatAmount,
        netAmount: netAmount
    };
}
exports.calculateVat = calculateVat;
function calculateServiceFee(total, paymentMethod) {
    var rate = 0;
    if (paymentMethod === "edenred")
        rate = 0.05; // 5%
    if (paymentMethod === "epassi")
        rate = 0.07; // 7%
    var fee = total * rate;
    return {
        serviceFee: fee,
        serviceRate: rate
    };
}
exports.calculateServiceFee = calculateServiceFee;
