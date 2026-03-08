"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ManualRaffleAdminPage() {
  const router = useRouter();

  const [firstCode, setFirstCode] = useState("");
  const [secondCode, setSecondCode] = useState("");
  const [thirdCode, setThirdCode] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadConfig() {
      const res = await fetch("/api/admin/raffle/manual", {
        cache: "no-store",
      });
      const data = await res.json();

      if (data) {
        setFirstCode(data.firstCode || "");
        setSecondCode(data.secondCode || "");
        setThirdCode(data.thirdCode || "");
        setEnabled(data.enabled || false);
      }

      setLoading(false);
    }

    loadConfig();
  }, []);

  async function handleSave() {
    setSaving(true);

    await fetch("/api/admin/raffle/manual", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstCode,
        secondCode,
        thirdCode,
        enabled,
      }),
    });

    setSaving(false);
  }

  if (loading) {
    return <div className="p-6">Loading raffle settings…</div>;
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Manual Raffle Settings</h1>

      <div className="space-y-2">
        <label className="font-semibold">1st Place Ticket Code</label>
        <input
          className="border px-3 py-2 w-full rounded"
          value={firstCode}
          onChange={(e) => setFirstCode(e.target.value)}
          placeholder="Enter ticket code"
        />
      </div>

      <div className="space-y-2">
        <label className="font-semibold">2nd Place Ticket Code</label>
        <input
          className="border px-3 py-2 w-full rounded"
          value={secondCode}
          onChange={(e) => setSecondCode(e.target.value)}
          placeholder="Enter ticket code"
        />
      </div>

      <div className="space-y-2">
        <label className="font-semibold">3rd Place Ticket Code</label>
        <input
          className="border px-3 py-2 w-full rounded"
          value={thirdCode}
          onChange={(e) => setThirdCode(e.target.value)}
          placeholder="Enter ticket code"
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
        />
        <span className="font-semibold">Enable public raffle screen</span>
      </div>

      {/* ⭐ Buttons with spacing */}
      <div className="flex flex-col gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-blue-600 text-white rounded font-semibold"
        >
          {saving ? "Saving…" : "Save Settings"}
        </button>

        <button
          onClick={() => router.push("/admin/raffle")}
          className="px-6 py-3 bg-gray-600 text-white rounded font-semibold"
        >
          Back to Raffle Menu
        </button>
      </div>
    </div>
  );
}
