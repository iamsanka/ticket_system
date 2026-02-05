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
var navigation_1 = require("next/navigation");
var react_1 = require("react");
function AdminDashboard() {
    var router = navigation_1.useRouter();
    var _a = react_1.useState(null), role = _a[0], setRole = _a[1];
    react_1.useEffect(function () {
        function load() {
            var _a;
            return __awaiter(this, void 0, void 0, function () {
                var res, data;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, fetch("/api/admin/session")];
                        case 1:
                            res = _b.sent();
                            return [4 /*yield*/, res.json()];
                        case 2:
                            data = _b.sent();
                            setRole(((_a = data.user) === null || _a === void 0 ? void 0 : _a.role) || null);
                            return [2 /*return*/];
                    }
                });
            });
        }
        load();
    }, []);
    function logout() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("/api/auth/logout", { method: "POST" })];
                    case 1:
                        _a.sent();
                        router.push("/admin/login");
                        return [2 /*return*/];
                }
            });
        });
    }
    if (role === null) {
        return (React.createElement("main", { className: "min-h-screen bg-black text-white flex items-center justify-center" },
            React.createElement("p", { className: "text-xl" }, "Loading dashboard\u2026")));
    }
    return (React.createElement("main", { className: "min-h-screen bg-black text-white flex flex-col items-center justify-center p-6" },
        React.createElement("h1", { className: "text-4xl font-bold mb-10" },
            role === "ADMIN" && "Admin Dashboard",
            role === "AUDIT" && "Audit Dashboard",
            role === "STAFF" && "Staff Dashboard"),
        React.createElement("div", { className: "flex flex-col gap-4 w-full max-w-sm" },
            (role === "STAFF" || role === "ADMIN") && (React.createElement(React.Fragment, null,
                React.createElement("button", { onClick: function () { return router.push("/admin/checkin"); }, className: "bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-xl font-semibold" }, "Check-In Panel"),
                React.createElement("button", { onClick: function () { return router.push("/admin/scanner"); }, className: "bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-xl font-semibold" }, "Open QR Scanner"))),
            role === "ADMIN" && (React.createElement(React.Fragment, null,
                React.createElement("button", { onClick: function () { return router.push("/admin/orders"); }, className: "bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg text-xl font-semibold" }, "Order Management"),
                React.createElement("button", { onClick: function () { return router.push("/admin/audit"); }, className: "bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg text-xl font-semibold" }, "Audit Dashboard"),
                React.createElement("button", { onClick: function () { return router.push("/admin/users"); }, className: "bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-lg text-xl font-semibold" }, "Manage Users"),
                React.createElement("button", { onClick: function () { return router.push("/admin/upgrade"); }, className: "bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg text-xl font-semibold" }, "Upgrade Ticket"))),
            role === "AUDIT" && (React.createElement("button", { onClick: function () { return router.push("/admin/audit"); }, className: "bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg text-xl font-semibold" }, "Audit Dashboard")),
            React.createElement("button", { onClick: logout, className: "bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg text-xl font-semibold mt-6" }, "Logout"))));
}
exports["default"] = AdminDashboard;
