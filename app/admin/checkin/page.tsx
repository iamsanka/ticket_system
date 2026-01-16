import { prisma } from "@/lib/prisma";

export default async function CheckinPage() {
  const tickets = await prisma.ticket.findMany({
    include: {
      order: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">All Tickets</h1>

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="p-3 text-left">Category</th>
            <th className="p-3 text-left">Tier</th>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Used</th>
            <th className="p-3 text-left">Used At</th>
          </tr>
        </thead>

        <tbody>
          {tickets.map((t) => (
            <tr key={t.id} className="border-b">
              <td className="p-3">{t.category}</td>
              <td className="p-3">{t.tier}</td>
              <td className="p-3">{t.order.name}</td>
              <td className="p-3">{t.order.email}</td>
              <td className="p-3">
                {t.usedAt ? (
                  <span className="text-green-600 font-semibold">Yes</span>
                ) : (
                  <span className="text-red-600 font-semibold">No</span>
                )}
              </td>
              <td className="p-3">
                {t.usedAt ? new Date(t.usedAt).toLocaleString() : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
