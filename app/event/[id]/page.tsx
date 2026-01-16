import { prisma } from "@/lib/prisma";
import BookingForm from "./BookingForm";

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // ✅ REQUIRED in Next.js 16 with Turbopack

  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event) return <div>Event not found</div>;

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">{event.title}</h1>
      <p className="mt-2 text-gray-700">
        {new Date(event.date).toLocaleDateString()} — {event.venue}
      </p>

      <div className="mt-4 space-y-1">
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

      <div className="mt-10">
        <BookingForm eventId={event.id} />
      </div>
    </main>
  );
}
