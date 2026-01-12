import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function HomePage() {
  const event = await prisma.event.findFirst({
    orderBy: { date: "asc" }, // or "desc" depending on your logic
  });

  if (!event) {
    return (
      <main className="p-10">
        <h1 className="text-2xl font-bold">No events available</h1>
      </main>
    );
  }

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">{event.title}</h1>

      <p className="mt-2 text-gray-700">
        {new Date(event.date).toLocaleDateString()} — {event.venue}
      </p>

      <div className="mt-4">
        <p>Adult: €{event.priceAdult / 100}</p>
        <p>Child: €{event.priceChild / 100}</p>
      </div>

      <Link
        href={`/event/${event.id}`}
        className="inline-block mt-6 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Book Tickets
      </Link>
    </main>
  );
}
