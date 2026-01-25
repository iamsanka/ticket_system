"use client";
"use strict";
exports.__esModule = true;
var navigation_1 = require("next/navigation");
var react_1 = require("react");
function StaffDashboard() {
    var router = navigation_1.useRouter();
    function logout() {
        // Clear session cookie
        document.cookie = "admin_session=; Max-Age=0; path=/;";
        // Optional: show toast (if you use a toast system)
        // toast.success("Logged out successfully");
        // Redirect to login
        router.push("/admin/login");
    }
    // Scroll to top on load (optional UX polish)
    react_1.useEffect(function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);
    return (React.createElement("main", { className: "min-h-screen bg-black text-white flex flex-col items-center justify-center p-6" },
        React.createElement("h1", { className: "text-4xl font-bold mb-10" }, "Staff Dashboard"),
        React.createElement("div", { className: "flex flex-col gap-4 w-full max-w-sm" },
            React.createElement("button", { onClick: function () { return router.push("/admin/checkin"); }, className: "bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-xl font-semibold" }, "Check-In Panel"),
            React.createElement("button", { onClick: function () { return router.push("/admin/scanner"); }, className: "bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-xl font-semibold" }, "Open QR Scanner"),
            React.createElement("button", { onClick: function () { return router.push("/admin/orders"); }, className: "bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg text-xl font-semibold" }, "Order Management"),
            React.createElement("button", { onClick: logout, className: "bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg text-xl font-semibold mt-6" }, "Logout"))));
}
exports["default"] = StaffDashboard;
