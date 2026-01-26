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
var react_1 = require("react");
var navigation_1 = require("next/navigation");
function AdminLogin() {
    var router = navigation_1.useRouter();
    var _a = react_1.useState(""), email = _a[0], setEmail = _a[1];
    var _b = react_1.useState(""), password = _b[0], setPassword = _b[1];
    var _c = react_1.useState(""), error = _c[0], setError = _c[1];
    var _d = react_1.useState(true), checking = _d[0], setChecking = _d[1];
    console.log("LOGIN PAGE RENDERED");
    // ----------------------------------------------------
    // 1. CHECK IF USER IS ALREADY LOGGED IN
    // ----------------------------------------------------
    react_1.useEffect(function () {
        function checkSession() {
            var _a;
            return __awaiter(this, void 0, void 0, function () {
                var res, data, role;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, fetch("/api/admin/session")];
                        case 1:
                            res = _b.sent();
                            return [4 /*yield*/, res.json()];
                        case 2:
                            data = _b.sent();
                            role = (_a = data.user) === null || _a === void 0 ? void 0 : _a.role;
                            if (role === "ADMIN") {
                                router.push("/admin");
                                return [2 /*return*/];
                            }
                            if (role === "STAFF") {
                                router.push("/admin/scanner");
                                return [2 /*return*/];
                            }
                            if (role === "AUDIT") {
                                router.push("/admin/audit");
                                return [2 /*return*/];
                            }
                            // No session → show login form
                            setChecking(false);
                            return [2 /*return*/];
                    }
                });
            });
        }
        checkSession();
    }, [router]);
    // ----------------------------------------------------
    // 2. HANDLE LOGIN
    // ----------------------------------------------------
    function handleLogin(e) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var res, data, sessionRes, sessionData, role;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        e.preventDefault();
                        setError("");
                        return [4 /*yield*/, fetch("/api/auth/login", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ email: email, password: password })
                            })];
                    case 1:
                        res = _b.sent();
                        return [4 /*yield*/, res.json()];
                    case 2:
                        data = _b.sent();
                        if (!res.ok) {
                            setError(data.error || "Login failed");
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, fetch("/api/admin/session")];
                    case 3:
                        sessionRes = _b.sent();
                        return [4 /*yield*/, sessionRes.json()];
                    case 4:
                        sessionData = _b.sent();
                        role = (_a = sessionData.user) === null || _a === void 0 ? void 0 : _a.role;
                        if (!role) {
                            setError("Unable to load session");
                            return [2 /*return*/];
                        }
                        // Redirect based on role
                        if (role === "ADMIN")
                            router.push("/admin");
                        else if (role === "STAFF")
                            router.push("/admin/scanner");
                        else if (role === "AUDIT")
                            router.push("/admin/audit");
                        else
                            setError("Unknown role");
                        return [2 /*return*/];
                }
            });
        });
    }
    // ----------------------------------------------------
    // 3. LOADING STATE WHILE CHECKING SESSION
    // ----------------------------------------------------
    if (checking) {
        return (React.createElement("main", { className: "min-h-screen bg-black text-white flex items-center justify-center" },
            React.createElement("p", { className: "text-xl" }, "Checking session\u2026")));
    }
    // ----------------------------------------------------
    // 4. LOGIN FORM
    // ----------------------------------------------------
    return (React.createElement("main", { className: "min-h-screen bg-black text-white flex items-center justify-center p-6" },
        React.createElement("form", { onSubmit: handleLogin, className: "bg-gray-900 p-8 rounded-lg w-full max-w-sm space-y-6" },
            React.createElement("h1", { className: "text-3xl font-bold mb-6 text-center" }, "Staff Login"),
            error && React.createElement("p", { className: "text-red-400 text-center" }, error),
            React.createElement("div", { className: "flex flex-col" },
                React.createElement("label", { htmlFor: "email", className: "text-white text-sm mb-2 font-medium" }, "Email"),
                React.createElement("input", { id: "email", type: "email", placeholder: "Enter your email", className: "p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500", value: email, onChange: function (e) { return setEmail(e.target.value); } })),
            React.createElement("div", { className: "flex flex-col" },
                React.createElement("label", { htmlFor: "password", className: "text-white text-sm mb-2 font-medium" }, "Password"),
                React.createElement("input", { id: "password", type: "password", placeholder: "Enter your password", className: "p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500", value: password, onChange: function (e) { return setPassword(e.target.value); } })),
            React.createElement("button", { type: "submit", className: "w-full bg-green-600 hover:bg-green-700 p-3 rounded-lg font-semibold text-white text-lg" }, "Login"))));
}
exports["default"] = AdminLogin;
