"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.GET = void 0;
var server_1 = require("next/server");
var prisma_1 = require("@/lib/prisma");
function GET(req) {
    return __awaiter(this, void 0, void 0, function () {
        var searchParams, from, to, pastWinners, pastWinnerTicketCodes, excludedTickets, excludedOrderIds, baseWhere, tickets, groups_1, orderGroups, shuffled, winners, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    searchParams = new URL(req.url).searchParams;
                    from = searchParams.get("from");
                    to = searchParams.get("to");
                    return [4 /*yield*/, prisma_1.prisma.randomRaffleResult.findMany()];
                case 1:
                    pastWinners = _a.sent();
                    pastWinnerTicketCodes = __spreadArrays(pastWinners.map(function (w) { return w.firstTicket; }), pastWinners.map(function (w) { return w.secondTicket; }), pastWinners.map(function (w) { return w.thirdTicket; })).filter(Boolean);
                    return [4 /*yield*/, prisma_1.prisma.ticket.findMany({
                            where: { ticketCode: { "in": pastWinnerTicketCodes } },
                            select: { orderId: true }
                        })];
                case 2:
                    excludedTickets = _a.sent();
                    excludedOrderIds = excludedTickets.map(function (t) { return t.orderId; });
                    baseWhere = {
                        orderId: { notIn: excludedOrderIds }
                    };
                    tickets = void 0;
                    if (!(from && to)) return [3 /*break*/, 4];
                    return [4 /*yield*/, prisma_1.prisma.ticket.findMany({
                            where: __assign(__assign({}, baseWhere), { order: {
                                    createdAt: {
                                        gte: new Date(from),
                                        lte: new Date(to)
                                    }
                                } }),
                            include: {
                                order: {
                                    include: {
                                        event: true
                                    }
                                }
                            }
                        })];
                case 3:
                    tickets = _a.sent();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, prisma_1.prisma.ticket.findMany({
                        where: baseWhere,
                        include: {
                            order: {
                                include: {
                                    event: true
                                }
                            }
                        }
                    })];
                case 5:
                    tickets = _a.sent();
                    _a.label = 6;
                case 6:
                    if (!tickets || tickets.length === 0) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: "No eligible tickets found." }, { status: 404 })];
                    }
                    groups_1 = {};
                    tickets.forEach(function (t) {
                        if (!groups_1[t.orderId])
                            groups_1[t.orderId] = [];
                        groups_1[t.orderId].push(t);
                    });
                    orderGroups = Object.values(groups_1);
                    if (orderGroups.length < 3) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Not enough unique eligible orders to pick 3 winners." }, { status: 400 })];
                    }
                    shuffled = orderGroups.sort(function () { return Math.random() - 0.5; });
                    winners = shuffled.slice(0, 3).map(function (group) {
                        return group[Math.floor(Math.random() * group.length)];
                    });
                    return [2 /*return*/, server_1.NextResponse.json({
                            tickets: tickets,
                            winners: winners,
                            excludedOrderIds: excludedOrderIds,
                            count: tickets.length,
                            uniqueOrders: orderGroups.length,
                            dateRangeUsed: !!(from && to)
                        })];
                case 7:
                    err_1 = _a.sent();
                    console.error("Random raffle error:", err_1);
                    return [2 /*return*/, server_1.NextResponse.json({ error: "Server error while generating random winners." }, { status: 500 })];
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.GET = GET;
