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
exports.generateInvoiceImageForAdmin = void 0;
var canvas_1 = require("canvas");
var path_1 = require("path");
// Register Geist font
canvas_1.registerFont(path_1["default"].join(process.cwd(), "public", "fonts", "Geist-Regular.ttf"), { family: "Geist" });
function generateInvoiceImageForAdmin(order, tickets) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var total, VAT_RATE, vatAmount, netAmount, pricePerTicket, vatPerTicket, netPerTicket, width, height, canvas, ctx, grad, logoPath, logo, y, _i, tickets_1, t;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    total = Number((_a = order.totalAmount) !== null && _a !== void 0 ? _a : 0) / 100;
                    VAT_RATE = 0.135;
                    vatAmount = total * VAT_RATE;
                    netAmount = total - vatAmount;
                    pricePerTicket = total / tickets.length;
                    vatPerTicket = pricePerTicket * VAT_RATE;
                    netPerTicket = pricePerTicket - vatPerTicket;
                    width = 1200;
                    height = 1800;
                    canvas = canvas_1.createCanvas(width, height);
                    ctx = canvas.getContext("2d");
                    // Background
                    ctx.fillStyle = "#0d0d0d";
                    ctx.fillRect(0, 0, width, height);
                    grad = ctx.createLinearGradient(0, 0, width, 0);
                    grad.addColorStop(0, "#d4af37");
                    grad.addColorStop(1, "#b8860b");
                    ctx.fillStyle = grad;
                    ctx.fillRect(0, 0, width, 160);
                    logoPath = path_1["default"].join(process.cwd(), "public", "logo.png");
                    return [4 /*yield*/, canvas_1.loadImage(logoPath)];
                case 1:
                    logo = _b.sent();
                    ctx.drawImage(logo, 40, 30, 120, 120);
                    // Header text
                    ctx.fillStyle = "#000";
                    ctx.font = "bold 48px Geist";
                    ctx.fillText("Taprobane Entertainment Oy", 200, 90);
                    ctx.font = "28px Geist";
                    ctx.fillText("Receipt (Manual Order)", 200, 140);
                    // Customer
                    ctx.fillStyle = "#d4af37";
                    ctx.font = "32px Geist";
                    ctx.fillText("Customer", 40, 240);
                    ctx.fillStyle = "#f5f5f5";
                    ctx.font = "24px Geist";
                    ctx.fillText(order.name, 40, 280);
                    ctx.fillText(order.email, 40, 320);
                    ctx.fillText(order.contactNo || "", 40, 360);
                    // Event
                    ctx.fillStyle = "#1a1a1a";
                    ctx.fillRect(40, 420, width - 80, 160);
                    ctx.fillStyle = "#d4af37";
                    ctx.font = "28px Geist";
                    ctx.fillText("Event", 60, 460);
                    ctx.fillStyle = "#f5f5f5";
                    ctx.font = "24px Geist";
                    ctx.fillText(order.event.title, 60, 500);
                    ctx.fillText(order.event.venue, 60, 540);
                    ctx.fillText(new Date(order.event.date).toLocaleString("en-GB"), 60, 580);
                    y = 640;
                    ctx.fillStyle = "#222";
                    ctx.fillRect(40, y, width - 80, 60);
                    ctx.fillStyle = "#d4af37";
                    ctx.font = "24px Geist";
                    ctx.fillText("Product", 60, y + 40);
                    ctx.fillText("Qty", 500, y + 40);
                    ctx.fillText("Excl VAT", 650, y + 40);
                    ctx.fillText("VAT", 820, y + 40);
                    ctx.fillText("Total", 980, y + 40);
                    y += 80;
                    for (_i = 0, tickets_1 = tickets; _i < tickets_1.length; _i++) {
                        t = tickets_1[_i];
                        ctx.fillStyle = "#1a1a1a";
                        ctx.fillRect(40, y - 20, width - 80, 70);
                        ctx.fillStyle = "#f5f5f5";
                        ctx.font = "22px Geist";
                        ctx.fillText("Ticket " + t.category + " " + t.tier, 60, y + 20);
                        ctx.fillText("1", 500, y + 20);
                        ctx.fillText(netPerTicket.toFixed(2) + " \u20AC", 650, y + 20);
                        ctx.fillText(vatPerTicket.toFixed(2) + " \u20AC", 820, y + 20);
                        ctx.fillText(pricePerTicket.toFixed(2) + " \u20AC", 980, y + 20);
                        y += 90;
                    }
                    // Summary
                    y += 20;
                    ctx.fillStyle = "#d4af37";
                    ctx.font = "26px Geist";
                    ctx.fillText("Summary", 40, y);
                    y += 50;
                    ctx.fillStyle = "#f5f5f5";
                    ctx.font = "24px Geist";
                    ctx.fillText("Total excl. VAT: " + netAmount.toFixed(2) + " \u20AC", 40, y);
                    y += 40;
                    ctx.fillText("VAT 13.5%: " + vatAmount.toFixed(2) + " \u20AC", 40, y);
                    y += 40;
                    ctx.fillText("Service fee: 0.00 \u20AC", 40, y);
                    y += 40;
                    ctx.fillStyle = "#d4af37";
                    ctx.font = "32px Geist";
                    ctx.fillText("Total payable: " + total.toFixed(2) + " \u20AC", 40, y);
                    return [2 /*return*/, canvas.toBuffer("image/png")];
            }
        });
    });
}
exports.generateInvoiceImageForAdmin = generateInvoiceImageForAdmin;
