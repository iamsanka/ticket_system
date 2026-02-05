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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.sendTicketEmail = void 0;
var nodemailer_1 = require("nodemailer");
var generateInvoiceImage_1 = require("./generateInvoiceImage");
var invoiceImageToPdf_1 = require("./invoiceImageToPdf");
function sendTicketEmail(_a) {
    var to = _a.to, tickets = _a.tickets, order = _a.order, _b = _a.upgraded, upgraded = _b === void 0 ? false : _b;
    return __awaiter(this, void 0, void 0, function () {
        var transporter, ticketAttachments, invoiceImageBuffer, invoicePdfBuffer, formattedDate, emailHtml;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    transporter = nodemailer_1["default"].createTransport({
                        host: process.env.SMTP_HOST,
                        port: Number(process.env.SMTP_PORT),
                        secure: false,
                        auth: {
                            user: process.env.SMTP_USER,
                            pass: process.env.SMTP_PASS
                        }
                    });
                    ticketAttachments = tickets.map(function (t) {
                        var base64Data = t.image.split(",")[1] || "";
                        return {
                            filename: (t.code || "ticket") + ".png",
                            content: Buffer.from(base64Data, "base64")
                        };
                    });
                    return [4 /*yield*/, generateInvoiceImage_1.generateInvoiceImage(order, tickets)];
                case 1:
                    invoiceImageBuffer = _c.sent();
                    return [4 /*yield*/, invoiceImageToPdf_1.invoiceImageToPdf(invoiceImageBuffer)];
                case 2:
                    invoicePdfBuffer = _c.sent();
                    formattedDate = new Date(order.event.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                    });
                    emailHtml = "\n    <div style=\"font-family: Arial, sans-serif; color: #333; line-height: 1.6; padding: 20px; max-width: 600px; margin: auto;\">\n\n      <h2 style=\"color: #0055A5; margin-bottom: 10px;\">\uD83C\uDF9F\uFE0F Your Tickets Are Ready</h2>\n\n      <p style=\"font-size: 16px;\">Hi " + (order.name || "Guest") + ",</p>\n\n      " + (upgraded
                        ? "\n        <p style=\"font-size: 16px; color: #b30000;\">\n          \u26A0\uFE0F Your previous tickets have been cancelled and are no longer valid.\n        </p>\n      "
                        : "") + "\n\n      <p style=\"font-size: 16px;\">\n        Thank you for booking with <strong>Taprobane Entertainment</strong>.\n      </p>\n\n      <p style=\"font-size: 16px;\">\n        You are confirmed for:\n      </p>\n\n      <div style=\"background: #F3F7FB; padding: 15px 20px; border-left: 4px solid #0055A5; margin-bottom: 20px;\">\n        <p style=\"margin: 0; font-size: 18px; font-weight: bold;\">" + order.event.title + "</p>\n        <p style=\"margin: 5px 0 0 0; font-size: 15px;\">\n          \uD83D\uDCC5 <strong>" + formattedDate + "</strong><br>\n          \uD83D\uDCCD <strong>" + order.event.venue + "</strong>\n        </p>\n      </div>\n\n      <p style=\"font-size: 16px;\">Your tickets are attached below as image files.</p>\n      <p style=\"font-size: 16px;\">A PDF invoice is also attached for your records.</p>\n\n      <h3 style=\"margin-top: 25px; color: #0055A5;\">Ticket Details</h3>\n\n      <ul style=\"padding-left: 20px; font-size: 15px;\">\n        " + tickets
                        .map(function (t) {
                        return "<li><strong>" + t.code + "</strong> \u2014 " + t.category + " / " + t.tier + "</li>";
                    })
                        .join("") + "\n      </ul>\n\n      <p style=\"margin-top: 30px; font-size: 15px;\">\n        If you have any questions or need assistance, simply reply to this email.\n      </p>\n\n      <p style=\"margin-top: 40px; font-size: 13px; color: #777;\">\n        Powered by <strong>Taprobane Entertainment Oy</strong>\n      </p>\n    </div>\n  ";
                    return [4 /*yield*/, transporter.sendMail({
                            from: process.env.SMTP_FROM,
                            to: to,
                            subject: "Your Tickets & Invoice for " + order.event.title,
                            html: emailHtml,
                            attachments: __spreadArrays(ticketAttachments, [
                                {
                                    filename: "invoice-" + order.id + ".pdf",
                                    content: invoicePdfBuffer
                                },
                            ])
                        })];
                case 3:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.sendTicketEmail = sendTicketEmail;
