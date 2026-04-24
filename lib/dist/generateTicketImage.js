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
exports.generateBrandedTicket = void 0;
var canvas_1 = require("canvas");
var path_1 = require("path");
// Register Geist font
canvas_1.registerFont(path_1["default"].join(process.cwd(), "public", "fonts", "Geist-Regular.ttf"), { family: "Geist" });
// Format date like "24th April 2026"
function formatEventDate(dateString) {
    var date = new Date(dateString);
    var day = date.getDate();
    var month = date.toLocaleString("en-US", { month: "long" });
    var year = date.getFullYear();
    var suffix = day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
            ? "nd"
            : day % 10 === 3 && day !== 13
                ? "rd"
                : "th";
    return "" + day + suffix + " " + month + " " + year;
}
function generateBrandedTicket(_a) {
    var qrPng = _a.qrPng, event = _a.event, name = _a.name, date = _a.date, venue = _a.venue, category = _a.category, tier = _a.tier, ticketCode = _a.ticketCode;
    return __awaiter(this, void 0, Promise, function () {
        var width, height, canvas, ctx, gradient, label, textWidth, textX, textY, logoPath, logo, infoY, lineHeight, formattedDate, displayTier, qrImage, qrX, qrY, qrSize, badgeX, badgeY, badgeWidth, badgeHeight, vipGradient, vipText, textWidth, textX, textY;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    width = 1000;
                    height = 600;
                    canvas = canvas_1.createCanvas(width, height);
                    ctx = canvas.getContext("2d");
                    gradient = ctx.createLinearGradient(0, 0, width, height);
                    gradient.addColorStop(0, "#0A1A2F");
                    gradient.addColorStop(1, "#1C2E4A");
                    ctx.fillStyle = gradient;
                    ctx.fillRect(0, 0, width, height);
                    // CHILD badge at top center
                    if (category === "CHILD") {
                        ctx.font = "bold 48px Geist";
                        ctx.fillStyle = "#FFFFFF";
                        label = "CHILD";
                        textWidth = ctx.measureText(label).width;
                        textX = (width - textWidth) / 2;
                        textY = 70;
                        ctx.fillText(label, textX, textY);
                    }
                    logoPath = path_1["default"].join(process.cwd(), "public", "logo.png");
                    return [4 /*yield*/, canvas_1.loadImage(logoPath)];
                case 1:
                    logo = _b.sent();
                    ctx.drawImage(logo, 40, 40, 120, 120);
                    // Event title
                    ctx.fillStyle = "#FFFFFF";
                    ctx.font = "bold 40px Geist";
                    ctx.fillText(event || "EVENT", 40, 200);
                    // Info block
                    ctx.font = "28px Geist";
                    ctx.fillStyle = "#E0E0E0";
                    infoY = 260;
                    lineHeight = 40;
                    formattedDate = formatEventDate(date);
                    displayTier = tier === "LOUNGE" ? "Taprobane Lounge" : tier;
                    ctx.fillText("\uD83D\uDC64 Name: " + (name || "Guest"), 40, infoY + lineHeight * 0);
                    ctx.fillText("\uD83D\uDCC5 Date: " + formattedDate, 40, infoY + lineHeight * 1);
                    ctx.fillText("\uD83D\uDCCD Venue: " + (venue || "N/A"), 40, infoY + lineHeight * 2);
                    ctx.fillText("\uD83D\uDDC2\uFE0F Category: " + category, 40, infoY + lineHeight * 3);
                    ctx.fillText("\uD83E\uDE91 Tier: " + displayTier, 40, infoY + lineHeight * 4);
                    ctx.fillText("\uD83D\uDD22 Code: " + ticketCode, 40, infoY + lineHeight * 5);
                    return [4 /*yield*/, canvas_1.loadImage("data:image/png;base64," + qrPng)];
                case 2:
                    qrImage = _b.sent();
                    qrX = width - 320;
                    qrY = 180;
                    qrSize = 260;
                    // QR shadow box
                    ctx.fillStyle = "#FFFFFF22";
                    ctx.fillRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20);
                    ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);
                    // QR caption
                    ctx.font = "20px Geist";
                    ctx.fillStyle = "#CCCCCC";
                    ctx.fillText("Scan at entry", qrX + 40, qrY + qrSize + 30);
                    // VIP badge for Lounge tier
                    if (tier === "LOUNGE") {
                        badgeX = width - 300;
                        badgeY = 80;
                        badgeWidth = 240;
                        badgeHeight = 60;
                        vipGradient = ctx.createLinearGradient(badgeX, badgeY, badgeX + badgeWidth, badgeY + badgeHeight);
                        vipGradient.addColorStop(0, "#D4AF37");
                        vipGradient.addColorStop(1, "#B8860B");
                        ctx.fillStyle = vipGradient;
                        ctx.beginPath();
                        ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 12);
                        ctx.fill();
                        vipText = "⭐ VIP ACCESS";
                        ctx.font = "bold 28px Geist";
                        ctx.fillStyle = "#000000";
                        textWidth = ctx.measureText(vipText).width;
                        textX = badgeX + (badgeWidth - textWidth) / 2;
                        textY = badgeY + 40;
                        ctx.fillText(vipText, textX, textY);
                    }
                    // Footer
                    ctx.font = "16px Geist";
                    ctx.fillStyle = "#888";
                    ctx.fillText("Powered by Taprobane Entertainment Oy", 40, height - 30);
                    return [2 /*return*/, canvas.toDataURL("image/png")];
            }
        });
    });
}
exports.generateBrandedTicket = generateBrandedTicket;
