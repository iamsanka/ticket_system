import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function HomePage() {
  const event = await prisma.event.findFirst({
    orderBy: { date: "asc" },
  });

  if (!event) {
    return (
      <main className="p-10">
        <h1 className="text-2xl font-bold">No events available</h1>
      </main>
    );
  }

  return (
    <main className="p-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{event.title}</h1>

      <p className="text-gray-700 mb-4">
        {new Date(event.date).toLocaleDateString()} — {event.venue}
      </p>

      <div className="bg-gray-100 p-4 rounded mb-6 space-y-2">
        <h2 className="text-xl font-semibold mb-2">Ticket Prices</h2>
        <p>
          <strong>Adult Lounge:</strong> €{event.adultLoungePrice / 100}
        </p>
        <p>
          <strong>Adult Standard:</strong> €{event.adultStandardPrice / 100}
        </p>
        <p>
          <strong>Child Lounge:</strong> €{event.childLoungePrice / 100}
        </p>
        <p>
          <strong>Child Standard:</strong> €{event.childStandardPrice / 100}
        </p>
      </div>

      <Link
        href={`/event/${event.id}`}
        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Book Tickets
      </Link>
    </main>
  );
}
