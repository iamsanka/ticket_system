import { prisma } from "@/lib/prisma";
import BookingForm from "./BookingForm";
import Image from "next/image";

// Format date like "24th April 2026"
function formatEventDate(dateInput: Date | string) {
  const date = new Date(dateInput);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();

  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";

  return `${day}${suffix} ${month} ${year}`;
}

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
    <main className="p-6 flex flex-col items-center justify-center">
      <Image
        src="/cover.jpeg"
        alt="Event Poster"
        width={800}
        height={500}
        className="rounded-lg shadow-lg mb-8 object-cover"
      />

      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
        <p className="text-lg text-gray-700 mb-4">
          <strong>Date:</strong> {formatEventDate(event.date)}
          <br />
          <strong>Venue:</strong> {event.venue}
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-black text-lg shadow-md mb-10">
          <h2 className="text-2xl font-bold text-center mb-6">
            🎟️ Ticket Prices
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2 text-center">
                👨 Adult Tickets
              </h3>
              <div className="flex justify-between px-4">
                <p>Taprobane Lounge</p>
                <p>€{event.adultLoungePrice / 100}</p>
              </div>
              <div className="flex justify-between px-4">
                <p>Standard</p>
                <p>€{event.adultStandardPrice / 100}</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-center">
                🧒 Child Tickets
              </h3>
              <div className="flex justify-between px-4">
                <p>Taprobane Lounge</p>
                <p>€{event.childLoungePrice / 100}</p>
              </div>
              <div className="flex justify-between px-4">
                <p>Standard</p>
                <p>€{event.childStandardPrice / 100}</p>
              </div>
            </div>
          </div>
        </div>

        <BookingForm eventId={event.id} />
      </div>
    </main>
  );
}
