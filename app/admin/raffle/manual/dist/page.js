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
function ManualRaffleAdminPage() {
    var router = navigation_1.useRouter();
    var _a = react_1.useState(""), firstCode = _a[0], setFirstCode = _a[1];
    var _b = react_1.useState(""), secondCode = _b[0], setSecondCode = _b[1];
    var _c = react_1.useState(""), thirdCode = _c[0], setThirdCode = _c[1];
    var _d = react_1.useState(false), enabled = _d[0], setEnabled = _d[1];
    var _e = react_1.useState(true), loading = _e[0], setLoading = _e[1];
    var _f = react_1.useState(false), saving = _f[0], setSaving = _f[1];
    react_1.useEffect(function () {
        function loadConfig() {
            return __awaiter(this, void 0, void 0, function () {
                var res, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, fetch("/api/admin/raffle/manual", {
                                cache: "no-store"
                            })];
                        case 1:
                            res = _a.sent();
                            return [4 /*yield*/, res.json()];
                        case 2:
                            data = _a.sent();
                            if (data) {
                                setFirstCode(data.firstCode || "");
                                setSecondCode(data.secondCode || "");
                                setThirdCode(data.thirdCode || "");
                                setEnabled(data.enabled || false);
                            }
                            setLoading(false);
                            return [2 /*return*/];
                    }
                });
            });
        }
        loadConfig();
    }, []);
    function handleSave() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setSaving(true);
                        return [4 /*yield*/, fetch("/api/admin/raffle/manual", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    firstCode: firstCode,
                                    secondCode: secondCode,
                                    thirdCode: thirdCode,
                                    enabled: enabled
                                })
                            })];
                    case 1:
                        _a.sent();
                        setSaving(false);
                        return [2 /*return*/];
                }
            });
        });
    }
    if (loading) {
        return React.createElement("div", { className: "p-6" }, "Loading raffle settings\u2026");
    }
    return (React.createElement("div", { className: "p-6 max-w-xl mx-auto space-y-6" },
        React.createElement("h1", { className: "text-3xl font-bold" }, "Manual Raffle Settings"),
        React.createElement("div", { className: "space-y-2" },
            React.createElement("label", { className: "font-semibold" }, "1st Place Ticket Code"),
            React.createElement("input", { className: "border px-3 py-2 w-full rounded", value: firstCode, onChange: function (e) { return setFirstCode(e.target.value); }, placeholder: "Enter ticket code" })),
        React.createElement("div", { className: "space-y-2" },
            React.createElement("label", { className: "font-semibold" }, "2nd Place Ticket Code"),
            React.createElement("input", { className: "border px-3 py-2 w-full rounded", value: secondCode, onChange: function (e) { return setSecondCode(e.target.value); }, placeholder: "Enter ticket code" })),
        React.createElement("div", { className: "space-y-2" },
            React.createElement("label", { className: "font-semibold" }, "3rd Place Ticket Code"),
            React.createElement("input", { className: "border px-3 py-2 w-full rounded", value: thirdCode, onChange: function (e) { return setThirdCode(e.target.value); }, placeholder: "Enter ticket code" })),
        React.createElement("div", { className: "flex items-center gap-3" },
            React.createElement("input", { type: "checkbox", checked: enabled, onChange: function (e) { return setEnabled(e.target.checked); } }),
            React.createElement("span", { className: "font-semibold" }, "Enable public raffle screen")),
        React.createElement("div", { className: "flex flex-col gap-4" },
            React.createElement("button", { onClick: handleSave, disabled: saving, className: "px-6 py-3 bg-blue-600 text-white rounded font-semibold" }, saving ? "Saving…" : "Save Settings"),
            React.createElement("button", { onClick: function () { return router.push("/admin/raffle"); }, className: "px-6 py-3 bg-gray-600 text-white rounded font-semibold" }, "Back to Raffle Menu"))));
}
exports["default"] = ManualRaffleAdminPage;
