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
function POST(req) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, contactNo, email, ticketCode, status, paid, note, _b, page, _c, pageSize, skip, take, where, ticket, order, _d, orders, total, error_1;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 7, , 8]);
                    return [4 /*yield*/, req.json()];
                case 1:
                    _a = _e.sent(), contactNo = _a.contactNo, email = _a.email, ticketCode = _a.ticketCode, status = _a.status, paid = _a.paid, note = _a.note, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.pageSize, pageSize = _c === void 0 ? 10 : _c;
                    skip = (Number(page) - 1) * Number(pageSize);
                    take = Number(pageSize);
                    where = {};
                    if (!(ticketCode === null || ticketCode === void 0 ? void 0 : ticketCode.trim())) return [3 /*break*/, 5];
                    return [4 /*yield*/, prisma_1.prisma.ticket.findFirst({
                            where: { ticketCode: ticketCode.trim() }
                        })];
                case 2:
                    ticket = _e.sent();
                    if (!ticket) return [3 /*break*/, 4];
                    return [4 /*yield*/, prisma_1.prisma.order.findUnique({
                            where: { id: ticket.orderId },
                            include: {
                                tickets: true,
                                event: true
                            }
                        })];
                case 3:
                    order = _e.sent();
                    return [2 /*return*/, server_1.NextResponse.json({
                            orders: order ? [order] : [],
                            total: order ? 1 : 0,
                            page: 1,
                            totalPages: 1
                        })];
                case 4: return [2 /*return*/, server_1.NextResponse.json({
                        orders: [],
                        total: 0,
                        page: 1,
                        totalPages: 1
                    })];
                case 5:
                    // CONTACT NUMBER SEARCH
                    if (contactNo === null || contactNo === void 0 ? void 0 : contactNo.trim()) {
                        where.contactNo = {
                            contains: contactNo.trim(),
                            mode: "insensitive"
                        };
                    }
                    // EMAIL SEARCH
                    if (email === null || email === void 0 ? void 0 : email.trim()) {
                        where.email = {
                            contains: email.trim(),
                            mode: "insensitive"
                        };
                    }
                    // STATUS FILTER
                    if (status && status !== "ALL") {
                        where.status = status;
                    }
                    // PAID FILTER
                    if (paid === "true") {
                        where.paid = true;
                    }
                    else if (paid === "false") {
                        where.paid = false;
                    }
                    // NOTE SEARCH
                    if (note === null || note === void 0 ? void 0 : note.trim()) {
                        where.receiptNote = {
                            contains: note.trim(),
                            mode: "insensitive"
                        };
                    }
                    return [4 /*yield*/, Promise.all([
                            prisma_1.prisma.order.findMany({
                                where: where,
                                include: {
                                    tickets: true,
                                    event: true
                                },
                                orderBy: { createdAt: "desc" },
                                skip: skip,
                                take: take
                            }),
                            prisma_1.prisma.order.count({ where: where }),
                        ])];
                case 6:
                    _d = _e.sent(), orders = _d[0], total = _d[1];
                    return [2 /*return*/, server_1.NextResponse.json({
                            orders: orders,
                            total: total,
                            page: Number(page),
                            totalPages: Math.ceil(total / pageSize)
                        })];
                case 7:
                    error_1 = _e.sent();
                    console.error("Admin search error:", error_1);
                    return [2 /*return*/, server_1.NextResponse.json({ error: "Internal server error" }, { status: 500 })];
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.POST = POST;
