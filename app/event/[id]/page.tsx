import { prisma } from "@/lib/prisma";
import BookingForm from "./BookingForm";

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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

      <div className="mt-4">
        <p>Adult: €{event.priceAdult / 100}</p>
        <p>Child: €{event.priceChild / 100}</p>
      </div>

      <div className="mt-10">
        <BookingForm eventId={event.id} />
      </div>
    </main>
  );
}
