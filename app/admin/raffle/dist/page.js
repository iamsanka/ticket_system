"use client";
"use strict";
exports.__esModule = true;
var navigation_1 = require("next/navigation");
function AdminRaffleMenu() {
    var router = navigation_1.useRouter();
    return (React.createElement("main", { className: "min-h-screen bg-black text-white flex flex-col items-center p-10" },
        React.createElement("h1", { className: "text-4xl font-bold mb-10" }, "Raffle Draw"),
        React.createElement("div", { className: "flex flex-col gap-6 w-full max-w-sm" },
            React.createElement("button", { onClick: function () { return router.push("/admin/raffle/manual"); }, className: "bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 rounded-lg text-xl font-semibold" }, "Raffle Management"),
            React.createElement("button", { onClick: function () { return router.push("/raffle/manual"); }, className: "bg-teal-600 hover:bg-teal-700 text-white px-6 py-4 rounded-lg text-xl font-semibold" }, "Manual Raffle Draw"),
            React.createElement("button", { onClick: function () { return router.push("/raffle/random"); }, className: "bg-yellow-600 hover:bg-yellow-700 text-black px-6 py-4 rounded-lg text-xl font-semibold" }, "Random Raffle Draw"),
            React.createElement("button", { onClick: function () { return router.push("/admin"); }, className: "bg-gray-600 hover:bg-gray-700 text-white px-6 py-4 rounded-lg text-xl font-semibold mt-4" }, "Back to Dashboard"))));
}
exports["default"] = AdminRaffleMenu;
