import { prisma } from "@/lib/prisma";
import Link from "next/link";
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
    <main className="p-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* LEFT SIDE */}
        <div>
          <h1 className="text-4xl font-bold mb-2">{event.title}</h1>

          <p className="text-lg text-gray-700 mb-4 leading-relaxed">
            <strong>Date:</strong> {formatEventDate(event.date)}
            <br />
            <strong>Venue:</strong> {event.venue}
          </p>

          {/* Ticket Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-black text-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6">
              Ticket Prices
            </h2>

            <div className="space-y-6">
              {/* Adult Section */}
              <div>
                <h3 className="text-xl font-semibold mb-2 text-center">
                  Adult Tickets
                </h3>

                <div className="flex justify-between px-4">
                  <p>Taprobane Lounge</p>
                  <p>
                    <span className="line-through text-red-600 mr-2">€90</span>
                    <span className="font-bold text-green-700">
                      €{event.adultLoungePrice / 100}
                    </span>
                  </p>
                </div>

                <div className="flex justify-between px-4">
                  <p>Standard</p>
                  <p>
                    <span className="line-through text-red-600 mr-2">€50</span>
                    <span className="font-bold text-green-700">
                      €{event.adultStandardPrice / 100}
                    </span>
                  </p>
                </div>
              </div>

              {/* Child Section */}
              <div>
                <h3 className="text-xl font-semibold mb-2 text-center">
                  Child Tickets
                </h3>

                <div className="flex justify-between px-4">
                  <p>Taprobane Lounge</p>
                  <p>
                    <span className="line-through text-red-600 mr-2">€50</span>
                    <span className="font-bold text-green-700">
                      €{event.childLoungePrice / 100}
                    </span>
                  </p>
                </div>

                <div className="flex justify-between px-4">
                  <p>Standard</p>
                  <p>
                    <span className="line-through text-red-600 mr-2">€30</span>
                    <span className="font-bold text-green-700">
                      €{event.childStandardPrice / 100}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8">
            <Link
              href={`/event/${event.id}`}
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition text-lg font-semibold"
            >
              Buy Tickets
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="flex justify-center">
          <Image
            src="/news.jpeg"
            alt="Event visual"
            width={500}
            height={500}
            className="rounded-lg shadow-lg object-cover"
          />
        </div>
      </div>
    </main>
  );
}
