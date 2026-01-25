"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok || !data.role) {
      setError(data.error || "Login failed");
      return;
    }

    // ⭐ Redirect based on Prisma enum roles
    if (data.role === "ADMIN") {
      router.push("/admin");
    } else if (data.role === "STAFF") {
      router.push("/admin/scanner");
    } else if (data.role === "AUDIT") {
      router.push("/admin/audit");
    } else {
      setError("Unknown role");
    }
  }

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
