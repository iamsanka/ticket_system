import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { generateQr } from "@/lib/generateQr";

export default async function EdenredPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;

  if (!orderId) return notFound();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      totalAmount: true,
      event: {
        select: {
          title: true,
          date: true,
        },
      },
    },
  });

  if (!order) return notFound();

  const totalEuro = (order.totalAmount / 100).toFixed(2);
  const eventTitle = order.event.title;
  const eventDate = new Date(order.event.date).toLocaleDateString("fi-FI");

  const edenredUrl = process.env.EDENRED_PAYMENT_URL;
  if (!edenredUrl) throw new Error("Missing EDENRED_PAYMENT_URL in .env");

  const qrBuffer = await generateQr(edenredUrl);
  const qrBase64 = `data:image/png;base64,${qrBuffer.toString("base64")}`;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-center">
          Complete Your Payment
        </h1>

        {/* Total Amount */}
        <div className="bg-gray-800 border border-gray-700 p-4 rounded text-lg font-semibold text-center">
          Total to Pay: <span className="text-yellow-400">€{totalEuro}</span>
        </div>

        {/* Event Info */}
        <div className="text-center text-sm text-gray-400">
          <p>{eventTitle}</p>
          <p>{eventDate}</p>
        </div>

        {/* Step 1 */}
        <div className="bg-gray-800 p-4 rounded-lg space-y-3">
          <h2 className="font-semibold text-lg">
            Step 1: Scan to open Edenred
          </h2>
          <p className="text-sm text-gray-300">
            Scan the QR code below with your phone camera to open Edenred. If
            the app is installed, it may open automatically.
          </p>
          <div className="flex justify-center">
            <img
              src={qrBase64}
              alt="Edenred QR"
              className="w-48 h-48 border rounded"
            />
          </div>
          <p className="text-sm text-gray-300">
            Or open Edenred manually and search for{" "}
            <strong className="text-white">Taprobane Entertainment</strong>.
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-gray-800 p-4 rounded-lg space-y-3">
          <h2 className="font-semibold text-lg">
            Step 2: Send Screenshot via WhatsApp
          </h2>
          <a
            href="https://wa.me/358442363616"
            className="block bg-green-600 text-white p-3 rounded text-center font-semibold"
          >
            Send to WhatsApp (+358 44 236 3616)
          </a>
          <a
            href="https://wa.me/358442363618"
            className="block bg-green-600 text-white p-3 rounded text-center font-semibold"
          >
            Send to WhatsApp (+358 44 236 3618)
          </a>
        </div>

        {/* Step 3 */}
        <div className="bg-gray-800 p-4 rounded-lg space-y-3">
          <h2 className="font-semibold text-lg">Step 3: Continue</h2>
          <p className="text-sm text-gray-300">
            After sending the screenshot, click continue. We will verify your
            payment and send your tickets.
          </p>
          <a
            href="/thank-you"
            className="block bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-3 rounded text-center"
          >
            Continue
          </a>
        </div>
      </div>
    </div>
  );
}
