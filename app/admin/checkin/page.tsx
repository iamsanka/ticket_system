"use client";

import { useState, useEffect } from "react";

export default function CheckinPage() {
  const [ticketCode, setTicketCode] = useState("");
  const [ticket, setTicket] = useState<any>(null);
  const [allTickets, setAllTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // LOAD ALL TICKETS ON PAGE LOAD
  useEffect(() => {
    async function loadAll() {
      const res = await fetch("/api/admin/checkin/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketCode: "" }), // empty → load all
      });

      const data = await res.json();
      setAllTickets(data.allTickets || []);
    }

    loadAll();
  }, []);

  // SUMMARY CALCULATOR
  function getSummary() {
    const summary = {
      adultLounge: { used: 0, unused: 0 },
      adultStandard: { used: 0, unused: 0 },
      childLounge: { used: 0, unused: 0 },
      childStandard: { used: 0, unused: 0 },
    };

    for (const t of allTickets) {
      const isUsed = t.usedAt ? "used" : "unused";
      const category = t.category?.toLowerCase();
      const tier = t.tier?.toLowerCase();

      if (category.includes("adult") && tier.includes("lounge")) {
        summary.adultLounge[isUsed]++;
      }
      if (category.includes("adult") && tier.includes("standard")) {
        summary.adultStandard[isUsed]++;
      }
      if (category.includes("child") && tier.includes("lounge")) {
        summary.childLounge[isUsed]++;
      }
      if (category.includes("child") && tier.includes("standard")) {
        summary.childStandard[isUsed]++;
      }
    }

    return summary;
  }

  const summary = getSummary();

  // SEARCH TICKET BY CODE
  async function handleSearch(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/admin/checkin/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticketCode }),
    });

    const data = await res.json();
    setTicket(data.ticket || null);
    setAllTickets(data.allTickets || []);
    setLoading(false);
  }

  // CHECK IN TICKET
  async function handleCheckin() {
    if (!ticket) return;

    const res = await fetch("/api/admin/checkin/mark-used", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticketId: ticket.id }),
    });

    const data = await res.json();
    if (data.success) {
      alert("Ticket checked in successfully");

      const refreshed = await fetch("/api/admin/checkin/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketCode }),
      });

      const updated = await refreshed.json();
      setTicket(updated.ticket || null);
      setAllTickets(updated.allTickets || []);
    } else {
      alert(data.error || "Failed to check in");
    }
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      {/* BACK BUTTON */}
      <button
        onClick={() => (window.location.href = "/admin")}
        className="mb-4 px-4 py-2 bg-yellow-400 text-black font-semibold rounded hover:bg-yellow-300 transition"
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-2xl font-bold mb-6">All Tickets</h1>

      {/* SUMMARY TABLE */}
      <div className="mb-6 border p-4 rounded bg-white text-black">
        <h2 className="text-lg font-semibold mb-3">Check-In Summary</h2>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b p-2">Category</th>
              <th className="border-b p-2">Checked In</th>
              <th className="border-b p-2">Not Yet</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border-b">Adult Lounge</td>
              <td className="p-2 border-b">{summary.adultLounge.used}</td>
              <td className="p-2 border-b">{summary.adultLounge.unused}</td>
            </tr>
            <tr>
              <td className="p-2 border-b">Adult Standard</td>
              <td className="p-2 border-b">{summary.adultStandard.used}</td>
              <td className="p-2 border-b">{summary.adultStandard.unused}</td>
            </tr>
            <tr>
              <td className="p-2 border-b">Kids Lounge</td>
              <td className="p-2 border-b">{summary.childLounge.used}</td>
              <td className="p-2 border-b">{summary.childLounge.unused}</td>
            </tr>
            <tr>
              <td className="p-2 border-b">Kids Standard</td>
              <td className="p-2 border-b">{summary.childStandard.used}</td>
              <td className="p-2 border-b">{summary.childStandard.unused}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* SEARCH FORM */}
      <form onSubmit={handleSearch} className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Enter Ticket Code"
          value={ticketCode}
          onChange={(e) => setTicketCode(e.target.value)}
          className="border p-2 w-full rounded text-black"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition"
        >
          {loading ? "Searching…" : "Search"}
        </button>
      </form>

      {/* TICKET RESULT */}
      {ticket ? (
        <div className="border p-4 rounded bg-white text-black mb-6">
          <p>
            <strong>Name:</strong> {ticket.order?.name || "—"}
          </p>
          <p>
            <strong>Email:</strong> {ticket.order?.email || "—"}
          </p>
          <p>
            <strong>Contact No:</strong> {ticket.order?.contactNo || "—"}
          </p>
          <p>
            <strong>Category:</strong> {ticket.category}
          </p>
          <p>
            <strong>Tier:</strong> {ticket.tier}
          </p>
          <p>
            <strong>Used:</strong> {ticket.usedAt ? "Yes" : "No"}
          </p>
          <p>
            <strong>Used At:</strong>{" "}
            {ticket.usedAt ? new Date(ticket.usedAt).toLocaleString() : "—"}
          </p>

          <div className="mt-4">
            {ticket.usedAt ? (
              <button
                disabled
                className="bg-gray-400 text-gray-700 px-4 py-2 rounded cursor-not-allowed"
              >
                Already Checked In
              </button>
            ) : (
              <button
                onClick={handleCheckin}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Check In
              </button>
            )}
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No ticket found yet.</p>
      )}
    </main>
  );
}
