export default function AuditPage() {
  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Audit Dashboard</h1>

        <p className="text-gray-300 mb-4">
          This is the audit view. Only users with the <strong>AUDIT</strong>{" "}
          role can access this page.
        </p>

        <div className="mt-8 p-6 bg-gray-900 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Ticket Sales Overview</h2>
          <p className="text-gray-400">
            We will add charts, summaries, and detailed logs here soon.
          </p>
        </div>
      </div>
    </main>
  );
}
