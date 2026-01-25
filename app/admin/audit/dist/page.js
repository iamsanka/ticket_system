"use strict";
exports.__esModule = true;
function AuditPage() {
    return (React.createElement("main", { className: "min-h-screen bg-black text-white p-6" },
        React.createElement("div", { className: "max-w-4xl mx-auto" },
            React.createElement("h1", { className: "text-3xl font-bold mb-6" }, "Audit Dashboard"),
            React.createElement("p", { className: "text-gray-300 mb-4" },
                "This is the audit view. Only users with the ",
                React.createElement("strong", null, "AUDIT"),
                " ",
                "role can access this page."),
            React.createElement("div", { className: "mt-8 p-6 bg-gray-900 rounded-lg border border-gray-700" },
                React.createElement("h2", { className: "text-xl font-semibold mb-4" }, "Ticket Sales Overview"),
                React.createElement("p", { className: "text-gray-400" }, "We will add charts, summaries, and detailed logs here soon.")))));
}
exports["default"] = AuditPage;
