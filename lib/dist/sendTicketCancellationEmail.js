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
exports.sendTicketCancellationEmail = void 0;
var nodemailer_1 = require("nodemailer");
function sendTicketCancellationEmail(_a) {
    var _b, _c, _d;
    var to = _a.to, order = _a.order, tickets = _a.tickets;
    return __awaiter(this, void 0, void 0, function () {
        var transporter, ticketListHtml, html;
        return __generator(this, function (_e) {
            switch (_e.label) {
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
                    ticketListHtml = tickets
                        .map(function (t) { return "\n        <li>\n          <strong>" + t.ticketCode + "</strong> \u2014 " + t.category + " / " + t.tier + "\n        </li>\n      "; })
                        .join("");
                    html = "\n    <div style=\"font-family: Arial; padding: 20px;\">\n      <h2>Your Tickets Have Been Cancelled</h2>\n\n      <p>Hello " + (order.name || "Customer") + ",</p>\n\n      <p>Your tickets for the event <strong>" + ((_b = order.event) === null || _b === void 0 ? void 0 : _b.title) + "</strong> have been cancelled and are no longer valid.</p>\n\n      <p><strong>Cancelled Tickets:</strong></p>\n      <ul>\n        " + ticketListHtml + "\n      </ul>\n\n      <p>If this was a mistake or you need assistance, please contact our support team.</p>\n\n      <br/>\n      <p><strong>Order ID:</strong> " + order.id + "</p>\n      <p><strong>Event:</strong> " + ((_c = order.event) === null || _c === void 0 ? void 0 : _c.title) + "</p>\n      <p><strong>Date:</strong> " + new Date((_d = order.event) === null || _d === void 0 ? void 0 : _d.date).toDateString() + "</p>\n\n      <br/>\n      <p>Regards,<br/>Event Team</p>\n    </div>\n  ";
                    return [4 /*yield*/, transporter.sendMail({
                            from: process.env.SMTP_FROM,
                            to: to,
                            subject: "Your Tickets Have Been Cancelled",
                            html: html
                        })];
                case 1:
                    _e.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.sendTicketCancellationEmail = sendTicketCancellationEmail;
