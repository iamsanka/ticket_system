"use client";
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
exports.__esModule = true;
var react_1 = require("react");
var navigation_1 = require("next/navigation");
function CreateTicketsPage() {
    var router = navigation_1.useRouter();
    var _a = react_1.useState([]), events = _a[0], setEvents = _a[1];
    var _b = react_1.useState(true), loadingEvents = _b[0], setLoadingEvents = _b[1];
    var _c = react_1.useState({
        eventId: "",
        name: "",
        email: "",
        contactNo: "",
        adultLounge: 0,
        adultStandard: 0,
        childLounge: 0,
        childStandard: 0,
        totalAmount: 0
    }), form = _c[0], setForm = _c[1];
    var _d = react_1.useState(false), submitting = _d[0], setSubmitting = _d[1];
    react_1.useEffect(function () {
        function loadEvents() {
            var _a;
            return __awaiter(this, void 0, void 0, function () {
                var res, data;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, fetch("/api/admin/events")];
                        case 1:
                            res = _b.sent();
                            return [4 /*yield*/, res.json()];
                        case 2:
                            data = _b.sent();
                            setEvents(data.events || []);
                            setLoadingEvents(false);
                            if (((_a = data.events) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                                setForm(function (f) { return (__assign(__assign({}, f), { eventId: data.events[0].id })); });
                            }
                            return [2 /*return*/];
                    }
                });
            });
        }
        loadEvents();
    }, []);
    function updateField(field, value) {
        setForm(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[field] = value, _a)));
        });
    }
    function handleSubmit(e) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        e.preventDefault();
                        setSubmitting(true);
                        return [4 /*yield*/, fetch("/api/admin/orders/create", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(form)
                            })];
                    case 1:
                        res = _a.sent();
                        setSubmitting(false);
                        if (res.ok) {
                            alert("Tickets created and email sent!");
                            router.push("/admin/tickets");
                        }
                        else {
                            alert("Failed to create tickets.");
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    return (React.createElement("main", { className: "min-h-screen bg-black text-white p-6" },
        React.createElement("h1", { className: "text-3xl font-bold mb-6" }, "Create New Tickets"),
        React.createElement("button", { onClick: function () { return router.push("/admin/tickets"); }, className: "mb-6 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded" }, "\u2190 Back to Ticket Management"),
        loadingEvents ? (React.createElement("p", null, "Loading events\u2026")) : (React.createElement("form", { onSubmit: handleSubmit, className: "max-w-xl space-y-4 bg-gray-900 p-6 rounded-lg border border-gray-700" },
            React.createElement("div", null,
                React.createElement("label", { className: "block mb-1" }, "Event"),
                React.createElement("select", { className: "w-full p-2 rounded bg-gray-800 border border-gray-700", value: form.eventId, onChange: function (e) { return updateField("eventId", e.target.value); } }, events.map(function (ev) { return (React.createElement("option", { key: ev.id, value: ev.id },
                    ev.title,
                    " \u2014 ",
                    new Date(ev.date).toDateString())); }))),
            React.createElement("div", null,
                React.createElement("label", { className: "block mb-1" }, "Customer Name"),
                React.createElement("input", { className: "w-full p-2 rounded bg-gray-800 border border-gray-700", value: form.name, onChange: function (e) { return updateField("name", e.target.value); }, required: true })),
            React.createElement("div", null,
                React.createElement("label", { className: "block mb-1" }, "Email"),
                React.createElement("input", { type: "email", className: "w-full p-2 rounded bg-gray-800 border border-gray-700", value: form.email, onChange: function (e) { return updateField("email", e.target.value); }, required: true })),
            React.createElement("div", null,
                React.createElement("label", { className: "block mb-1" }, "Contact Number"),
                React.createElement("input", { className: "w-full p-2 rounded bg-gray-800 border border-gray-700", value: form.contactNo, onChange: function (e) { return updateField("contactNo", e.target.value); } })),
            React.createElement("h2", { className: "text-xl font-semibold mt-6" }, "Ticket Quantities"),
            React.createElement("div", { className: "grid grid-cols-2 gap-4" },
                React.createElement("div", null,
                    React.createElement("label", { className: "block mb-1" }, "Adult Lounge"),
                    React.createElement("input", { type: "number", min: 0, className: "w-full p-2 rounded bg-gray-800 border border-gray-700", value: form.adultLounge, onChange: function (e) {
                            return updateField("adultLounge", Number(e.target.value));
                        } })),
                React.createElement("div", null,
                    React.createElement("label", { className: "block mb-1" }, "Adult Standard"),
                    React.createElement("input", { type: "number", min: 0, className: "w-full p-2 rounded bg-gray-800 border border-gray-700", value: form.adultStandard, onChange: function (e) {
                            return updateField("adultStandard", Number(e.target.value));
                        } })),
                React.createElement("div", null,
                    React.createElement("label", { className: "block mb-1" }, "Child Lounge"),
                    React.createElement("input", { type: "number", min: 0, className: "w-full p-2 rounded bg-gray-800 border border-gray-700", value: form.childLounge, onChange: function (e) {
                            return updateField("childLounge", Number(e.target.value));
                        } })),
                React.createElement("div", null,
                    React.createElement("label", { className: "block mb-1" }, "Child Standard"),
                    React.createElement("input", { type: "number", min: 0, className: "w-full p-2 rounded bg-gray-800 border border-gray-700", value: form.childStandard, onChange: function (e) {
                            return updateField("childStandard", Number(e.target.value));
                        } }))),
            React.createElement("div", null,
                React.createElement("label", { className: "block mb-1" }, "Total Amount (\u20AC)"),
                React.createElement("input", { type: "number", min: 0, className: "w-full p-2 rounded bg-gray-800 border border-gray-700", value: form.totalAmount, onChange: function (e) {
                        return updateField("totalAmount", Number(e.target.value));
                    }, required: true })),
            React.createElement("button", { type: "submit", disabled: submitting, className: "w-full bg-green-600 hover:bg-green-700 px-4 py-3 rounded font-semibold mt-6 disabled:opacity-50" }, submitting ? "Creating…" : "Create Tickets & Send Email")))));
}
exports["default"] = CreateTicketsPage;
