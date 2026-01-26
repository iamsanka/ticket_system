"use client";

import { useState, useEffect } from "react";

type User = {
  id: string;
  email: string;
  name?: string | null;
  role: "ADMIN" | "STAFF" | "AUDIT";
};

export default function AdminUsersPage() {
  const [form, setForm] = useState({
    email: "",
    name: "",
    password: "",
    role: "STAFF",
  });

  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchUsers() {
    const res = await fetch("/api/admin/users/list");
    const data = await res.json();
    setUsers(data.users || []);
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/admin/users/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(data.error || "Failed to create user");
      return;
    }

    alert("User created successfully");
    setForm({ email: "", name: "", password: "", role: "STAFF" });
    fetchUsers();
  }

  async function handleDelete(id: string) {
    const confirm = window.confirm(
      "Are you sure you want to delete this user?",
    );
    if (!confirm) return;

    const res = await fetch("/api/admin/users/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to delete user");
      return;
    }

    alert("User deleted");
    fetchUsers();
  }

  const filtered = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <button
        onClick={() => (window.location.href = "/admin")}
        className="mb-4 px-4 py-2 bg-yellow-400 text-black font-semibold rounded hover:bg-yellow-300 transition"
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-2xl font-bold mb-6">User Management</h1>

      {/* CREATE USER */}
      <form
        onSubmit={handleCreate}
        className="space-y-4 mb-8 border p-4 rounded bg-white text-black"
      >
        <h2 className="text-lg font-semibold mb-2">Create User</h2>

        {/* EMAIL PREFIX INPUT */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Email (prefix only)
          </label>
          <div className="flex items-center border rounded p-2 bg-white">
            <input
              type="text"
              placeholder="e.g. admin"
              value={form.email.replace("@taprobane.fi", "")}
              onChange={(e) => {
                const prefix = e.target.value.replace("@taprobane.fi", "");
                setForm({ ...form, email: `${prefix}@taprobane.fi` });
              }}
              className="flex-1 outline-none"
              required
            />
            <span className="ml-2 text-gray-600">@taprobane.fi</span>
          </div>
        </div>

        <input
          type="text"
          placeholder="Name (optional)"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 w-full rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="border p-2 w-full rounded"
          required
        />

        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="border p-2 w-full rounded"
        >
          <option value="ADMIN">Admin</option>
          <option value="AUDIT">Audit</option>
          <option value="STAFF">Staff</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition"
        >
          {loading ? "Creating…" : "Create User"}
        </button>
      </form>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search by email or role"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 border p-2 w-full rounded text-black"
      />

      {/* USER LIST */}
      <h2 className="text-lg font-semibold mb-2">Existing Users</h2>

      {filtered.length === 0 ? (
        <p className="text-gray-500">No matching users.</p>
      ) : (
        <ul className="space-y-2">
          {filtered.map((u) => (
            <li
              key={u.id}
              className="border p-3 rounded bg-white text-black flex justify-between items-center"
            >
              <div>
                <p>
                  <strong>{u.email}</strong> {u.name ? `(${u.name})` : ""}
                </p>
                <p>Role: {u.role}</p>
              </div>
              <button
                onClick={() => handleDelete(u.id)}
                className="text-red-600 hover:text-red-800 font-semibold"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
