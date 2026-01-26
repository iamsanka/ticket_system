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
var qr_scanner_1 = require("qr-scanner");
var navigation_1 = require("next/navigation");
function ScannerClient(_a) {
    var role = _a.role;
    var videoRef = react_1.useRef(null);
    var scannerRef = react_1.useRef(null);
    var _b = react_1.useState(null), result = _b[0], setResult = _b[1];
    var _c = react_1.useState(false), loading = _c[0], setLoading = _c[1];
    var router = navigation_1.useRouter();
    function validate(qrCode) {
        return __awaiter(this, void 0, void 0, function () {
            var res, json, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!scannerRef.current)
                            return [2 /*return*/];
                        scannerRef.current.stop();
                        setLoading(true);
                        setResult(null);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, fetch("/api/validate-ticket", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ qrCode: qrCode })
                            })];
                    case 2:
                        res = _a.sent();
                        return [4 /*yield*/, res.json()];
                    case 3:
                        json = _a.sent();
                        setResult(json);
                        return [3 /*break*/, 5];
                    case 4:
                        err_1 = _a.sent();
                        setResult({ valid: false, reason: "Network error" });
                        return [3 /*break*/, 5];
                    case 5:
                        setLoading(false);
                        setTimeout(function () {
                            var _a;
                            setResult(null);
                            (_a = scannerRef.current) === null || _a === void 0 ? void 0 : _a.start();
                        }, 3000);
                        return [2 /*return*/];
                }
            });
        });
    }
    react_1.useEffect(function () {
        if (!videoRef.current)
            return;
        var scanner = new qr_scanner_1["default"](videoRef.current, function (qrResult) {
            validate(qrResult.data);
        }, {
            highlightScanRegion: true,
            highlightCodeOutline: true
        });
        scanner.start();
        scannerRef.current = scanner;
        return function () {
            scanner.stop();
        };
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
    return (React.createElement("main", { className: "p-6 max-w-xl mx-auto" },
        role === "ADMIN" && (React.createElement("button", { onClick: function () { return router.push("/admin"); }, className: "mb-4 px-4 py-2 bg-yellow-400 text-black font-semibold rounded hover:bg-yellow-300 transition" }, "\u2190 Back to Admin")),
        React.createElement("h1", { className: "text-3xl font-bold mb-6" }, "QR Scanner"),
        role && (React.createElement("p", { className: "text-sm text-gray-500 mb-4 text-center" },
            "Logged in as ",
            React.createElement("strong", null, role))),
        React.createElement("video", { ref: videoRef, className: "w-full max-w-sm mx-auto rounded shadow mb-6" }),
        loading && React.createElement("p", { className: "text-gray-600 font-medium" }, "Validating\u2026"),
        result && (React.createElement("div", { className: "mt-4 p-4 rounded border " + (result.valid
                ? "border-green-500 bg-green-50"
                : "border-red-500 bg-red-50") }, result.valid ? (React.createElement(React.Fragment, null,
            React.createElement("p", { className: "text-green-700 font-bold text-xl mb-2" }, "Ticket Valid"),
            React.createElement("p", null,
                React.createElement("strong", null, "Category:"),
                " ",
                result.category),
            React.createElement("p", null,
                React.createElement("strong", null, "Tier:"),
                " ",
                result.tier),
            React.createElement("p", null,
                React.createElement("strong", null, "Name:"),
                " ",
                result.name),
            React.createElement("p", null,
                React.createElement("strong", null, "Email:"),
                " ",
                result.email),
            React.createElement("p", null,
                React.createElement("strong", null, "Event:"),
                " ",
                result.event))) : (React.createElement(React.Fragment, null,
            React.createElement("p", { className: "text-red-700 font-bold text-xl mb-2" }, "Ticket Invalid"),
            React.createElement("p", null, result.reason))))),
        role === "STAFF" && (React.createElement("button", { onClick: logout, className: "mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xl font-semibold" }, "Logout"))));
}
exports["default"] = ScannerClient;
