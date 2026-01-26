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
function AdminUsersPage() {
    var _a = react_1.useState({
        email: "",
        name: "",
        password: "",
        role: "STAFF"
    }), form = _a[0], setForm = _a[1];
    var _b = react_1.useState([]), users = _b[0], setUsers = _b[1];
    var _c = react_1.useState(""), search = _c[0], setSearch = _c[1];
    var _d = react_1.useState(false), loading = _d[0], setLoading = _d[1];
    function fetchUsers() {
        return __awaiter(this, void 0, void 0, function () {
            var res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("/api/admin/users/list")];
                    case 1:
                        res = _a.sent();
                        return [4 /*yield*/, res.json()];
                    case 2:
                        data = _a.sent();
                        setUsers(data.users || []);
                        return [2 /*return*/];
                }
            });
        });
    }
    react_1.useEffect(function () {
        fetchUsers();
    }, []);
    function handleCreate(e) {
        return __awaiter(this, void 0, void 0, function () {
            var res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        e.preventDefault();
                        setLoading(true);
                        return [4 /*yield*/, fetch("/api/admin/users/create", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(form)
                            })];
                    case 1:
                        res = _a.sent();
                        return [4 /*yield*/, res.json()];
                    case 2:
                        data = _a.sent();
                        setLoading(false);
                        if (!res.ok) {
                            alert(data.error || "Failed to create user");
                            return [2 /*return*/];
                        }
                        alert("User created successfully");
                        setForm({ email: "", name: "", password: "", role: "STAFF" });
                        fetchUsers();
                        return [2 /*return*/];
                }
            });
        });
    }
    function handleDelete(id) {
        return __awaiter(this, void 0, void 0, function () {
            var confirm, res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        confirm = window.confirm("Are you sure you want to delete this user?");
                        if (!confirm)
                            return [2 /*return*/];
                        return [4 /*yield*/, fetch("/api/admin/users/delete", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ id: id })
                            })];
                    case 1:
                        res = _a.sent();
                        return [4 /*yield*/, res.json()];
                    case 2:
                        data = _a.sent();
                        if (!res.ok) {
                            alert(data.error || "Failed to delete user");
                            return [2 /*return*/];
                        }
                        alert("User deleted");
                        fetchUsers();
                        return [2 /*return*/];
                }
            });
        });
    }
    var filtered = users.filter(function (u) {
        return u.email.toLowerCase().includes(search.toLowerCase()) ||
            u.role.toLowerCase().includes(search.toLowerCase());
    });
    return (React.createElement("main", { className: "p-6 max-w-2xl mx-auto" },
        React.createElement("button", { onClick: function () { return (window.location.href = "/admin"); }, className: "mb-4 px-4 py-2 bg-yellow-400 text-black font-semibold rounded hover:bg-yellow-300 transition" }, "\u2190 Back to Dashboard"),
        React.createElement("h1", { className: "text-2xl font-bold mb-6" }, "User Management"),
        React.createElement("form", { onSubmit: handleCreate, className: "space-y-4 mb-8 border p-4 rounded bg-white text-black" },
            React.createElement("h2", { className: "text-lg font-semibold mb-2" }, "Create User"),
            React.createElement("div", null,
                React.createElement("label", { className: "block text-sm font-medium mb-1" }, "Email (prefix only)"),
                React.createElement("div", { className: "flex items-center border rounded p-2 bg-white" },
                    React.createElement("input", { type: "text", placeholder: "e.g. admin", value: form.email.replace("@taprobane.fi", ""), onChange: function (e) {
                            var prefix = e.target.value.replace("@taprobane.fi", "");
                            setForm(__assign(__assign({}, form), { email: prefix + "@taprobane.fi" }));
                        }, className: "flex-1 outline-none", required: true }),
                    React.createElement("span", { className: "ml-2 text-gray-600" }, "@taprobane.fi"))),
            React.createElement("input", { type: "text", placeholder: "Name (optional)", value: form.name, onChange: function (e) { return setForm(__assign(__assign({}, form), { name: e.target.value })); }, className: "border p-2 w-full rounded" }),
            React.createElement("input", { type: "password", placeholder: "Password", value: form.password, onChange: function (e) { return setForm(__assign(__assign({}, form), { password: e.target.value })); }, className: "border p-2 w-full rounded", required: true }),
            React.createElement("select", { value: form.role, onChange: function (e) { return setForm(__assign(__assign({}, form), { role: e.target.value })); }, className: "border p-2 w-full rounded" },
                React.createElement("option", { value: "ADMIN" }, "Admin"),
                React.createElement("option", { value: "AUDIT" }, "Audit"),
                React.createElement("option", { value: "STAFF" }, "Staff")),
            React.createElement("button", { type: "submit", disabled: loading, className: "bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition" }, loading ? "Creating…" : "Create User")),
        React.createElement("input", { type: "text", placeholder: "Search by email or role", value: search, onChange: function (e) { return setSearch(e.target.value); }, className: "mb-4 border p-2 w-full rounded text-black" }),
        React.createElement("h2", { className: "text-lg font-semibold mb-2" }, "Existing Users"),
        filtered.length === 0 ? (React.createElement("p", { className: "text-gray-500" }, "No matching users.")) : (React.createElement("ul", { className: "space-y-2" }, filtered.map(function (u) { return (React.createElement("li", { key: u.id, className: "border p-3 rounded bg-white text-black flex justify-between items-center" },
            React.createElement("div", null,
                React.createElement("p", null,
                    React.createElement("strong", null, u.email),
                    " ",
                    u.name ? "(" + u.name + ")" : ""),
                React.createElement("p", null,
                    "Role: ",
                    u.role)),
            React.createElement("button", { onClick: function () { return handleDelete(u.id); }, className: "text-red-600 hover:text-red-800 font-semibold" }, "Delete"))); })))));
}
exports["default"] = AdminUsersPage;
