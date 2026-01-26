"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);
  console.log("LOGIN PAGE RENDERED");

  // ----------------------------------------------------
  // 1. CHECK IF USER IS ALREADY LOGGED IN
  // ----------------------------------------------------
  useEffect(() => {
    async function checkSession() {
      const res = await fetch("/api/admin/session");
      const data = await res.json();
      const role = data.user?.role;

      if (role === "ADMIN") {
        router.push("/admin");
        return;
      }
      if (role === "STAFF") {
        router.push("/admin/scanner");
        return;
      }
      if (role === "AUDIT") {
        router.push("/admin/audit");
        return;
      }

      // No session → show login form
      setChecking(false);
    }

    checkSession();
  }, [router]);

  // ----------------------------------------------------
  // 2. HANDLE LOGIN
  // ----------------------------------------------------
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Login failed");
      return;
    }

    // After login, fetch session to get role
    const sessionRes = await fetch("/api/admin/session");
    const sessionData = await sessionRes.json();
    const role = sessionData.user?.role;

    if (!role) {
      setError("Unable to load session");
      return;
    }

    // Redirect based on role
    if (role === "ADMIN") router.push("/admin");
    else if (role === "STAFF") router.push("/admin/scanner");
    else if (role === "AUDIT") router.push("/admin/audit");
    else setError("Unknown role");
  }

  // ----------------------------------------------------
  // 3. LOADING STATE WHILE CHECKING SESSION
  // ----------------------------------------------------
  if (checking) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-xl">Checking session…</p>
      </main>
    );
  }

  // ----------------------------------------------------
  // 4. LOGIN FORM
  // ----------------------------------------------------
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <form
        onSubmit={handleLogin}
        className="bg-gray-900 p-8 rounded-lg w-full max-w-sm space-y-6"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">Staff Login</h1>

        {error && <p className="text-red-400 text-center">{error}</p>}

        {/* Email Field */}
        <div className="flex flex-col">
          <label
            htmlFor="email"
            className="text-white text-sm mb-2 font-medium"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password Field */}
        <div className="flex flex-col">
          <label
            htmlFor="password"
            className="text-white text-sm mb-2 font-medium"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            className="p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 p-3 rounded-lg font-semibold text-white text-lg"
        >
          Login
        </button>
      </form>
    </main>
  );
}
