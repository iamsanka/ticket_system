"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { confettiBurst, confettiSide, confettiRain } from "@/lib/confetti";

type Ticket = {
  ticketCode: string;
  orderId: string;
  order: {
    name: string | null;
    email: string | null;
    contactNo: string | null;
    createdAt: string;
    event: {
      title: string;
      venue: string;
      date: string;
    };
  };
};

export default function RandomRafflePage() {
  const router = useRouter();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [winners, setWinners] = useState<Ticket[]>([]);

  const [step, setStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [fakeCode, setFakeCode] = useState("");

  const [showThird, setShowThird] = useState(false);
  const [showSecond, setShowSecond] = useState(false);
  const [showFirst, setShowFirst] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const [useDateRange, setUseDateRange] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  async function loadTickets() {
    let url = "/api/raffle/random";

    if (useDateRange && fromDate && toDate) {
      url += `?from=${fromDate}&to=${toDate}`;
    }

    const res = await fetch(url, { cache: "no-store" });
    const data = await res.json();

    if (data.error) {
      alert(data.error);
      return null;
    }

    setTickets(data.tickets || []);
    setWinners(data.winners || []);

    return data.tickets;
  }

  async function startReveal() {
    if (step === 0) {
      const loaded = await loadTickets();
      if (!loaded || loaded.length === 0) {
        alert("No tickets available for this draw.");
        return;
      }
    }

    if (step === 1) setShowThird(false);
    if (step === 2) setShowSecond(false);

    setAnimating(true);

    const interval = setInterval(() => {
      setFakeCode("XX-" + Math.floor(100000 + Math.random() * 900000));
    }, 80);

    setTimeout(() => {
      clearInterval(interval);
      setAnimating(false);

      if (step === 0) {
        setShowThird(true);
        confettiSide();
      }

      if (step === 1) {
        setShowSecond(true);
        confettiSide();
      }

      if (step === 2) {
        setShowFirst(true);
        confettiBurst();
      }

      setStep((prev) => prev + 1);
    }, 7000);
  }

  function renderWinner(place: string, winner: Ticket | null) {
    if (!winner) return null;

    return (
      <div className="fade-in spotlight border-4 border-yellow-400 p-8 rounded-2xl bg-black bg-opacity-60 w-full max-w-105 shadow-xl space-y-6">
        <h2 className="text-5xl font-extrabold text-yellow-400 text-center tracking-wide">
          {place}
        </h2>

        <div className="text-center">
          <div className="text-lg text-gray-300 uppercase tracking-wide">
            Ticket Number
          </div>
          <div className="text-4xl font-mono font-bold text-white mt-1">
            {winner.ticketCode}
          </div>
        </div>

        <div className="h-px bg-gray-700 w-full" />

        <div className="space-y-3 text-xl">
          <div className="flex justify-between gap-4">
            <span className="text-gray-400">Name:</span>
            <span className="text-white font-medium text-right max-w-55 wrap-break-word">
              {winner.order.name}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-gray-400">Email:</span>
            <span className="text-white font-medium text-right max-w-55 wrap-break-word">
              {winner.order.email}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-gray-400">Contact:</span>
            <span className="text-white font-medium text-right max-w-55 wrap-break-word">
              {winner.order.contactNo}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-gray-400">Event:</span>
            <span className="text-white font-medium text-right max-w-55 wrap-break-word">
              {winner.order.event.title}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-gray-400">Venue:</span>
            <span className="text-white font-medium text-right max-w-55 wrap-break-word">
              {winner.order.event.venue}
            </span>
          </div>
        </div>
      </div>
    );
  }

  function renderAnimation(place: string) {
    return (
      <div className="text-center space-y-6 animate-pulse">
        <h2 className="text-5xl font-bold text-yellow-400">{place}</h2>
        <div className="text-6xl font-mono text-white">{fakeCode}</div>
        <div className="text-xl text-gray-400">Drawing winner…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-black text-white overflow-hidden relative pb-40">
      <button
        onClick={() => router.push("/admin/raffle")}
        className="fixed top-6 left-6 px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-lg text-xl font-semibold z-50"
      >
        ← Back
      </button>

      <h1 className="text-6xl font-extrabold text-yellow-400 mt-10 mb-10">
        Raffle Draw
      </h1>

      <div
        className={`p-6 rounded-xl mb-10 space-y-4 shadow-lg transition-all duration-300 
        ${useDateRange ? "bg-white border-4 border-yellow-400" : "bg-white border border-gray-300"}`}
      >
        <label className="flex items-center gap-3 text-xl text-black">
          <input
            type="checkbox"
            checked={useDateRange}
            onChange={(e) => setUseDateRange(e.target.checked)}
          />
          Enable Date Range
        </label>

        {useDateRange && (
          <div className="flex gap-4 animate-fadeIn">
            <div className="flex flex-col">
              <label className="text-sm text-gray-700">From</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="px-3 py-2 rounded border border-gray-400 bg-white text-black focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-gray-700">To</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="px-3 py-2 rounded border border-gray-400 bg-white text-black focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .spotlight {
          position: relative;
        }

        .spotlight::before {
          content: "";
          position: absolute;
          top: -40px;
          left: 50%;
          transform: translateX(-50%);
          width: 260px;
          height: 260px;
          background: radial-gradient(
            circle,
            rgba(255, 255, 200, 0.25),
            transparent 70%
          );
          z-index: -1;
          filter: blur(20px);
        }

        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>

      {showResults && (
        <div className="fade-in w-full flex flex-wrap justify-center items-start gap-10 mt-10 px-10">
          <div>{renderWinner("3rd Place", winners[2] ?? null)}</div>
          <div>{renderWinner("1st Place", winners[0] ?? null)}</div>
          <div>{renderWinner("2nd Place", winners[1] ?? null)}</div>
        </div>
      )}

      {!showResults && (
        <>
          {showThird && step === 1 && (
            <div className="flex flex-col items-center mb-24">
              {renderWinner("3rd Place", winners[2] ?? null)}
            </div>
          )}

          {showSecond && step === 2 && (
            <div className="flex flex-col items-center mb-24">
              {renderWinner("2nd Place", winners[1] ?? null)}
            </div>
          )}

          {showFirst && step === 3 && (
            <div className="flex flex-col items-center mb-24">
              {renderWinner("1st Place", winners[0] ?? null)}
            </div>
          )}

          {animating && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none w-100">
              {renderAnimation(
                step === 0
                  ? "3rd Place"
                  : step === 1
                    ? "2nd Place"
                    : "1st Place",
              )}
            </div>
          )}
        </>
      )}

      {!animating && !showResults && step === 3 && (
        <button
          onClick={async () => {
            setShowResults(true);
            confettiRain();

            await fetch("/api/raffle/random/save", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                eventName: winners[0]?.order?.event?.title ?? null,

                firstTicket: winners[0]?.ticketCode,
                firstName: winners[0]?.order?.name,
                firstEmail: winners[0]?.order?.email,
                firstContact: winners[0]?.order?.contactNo,

                secondTicket: winners[1]?.ticketCode,
                secondName: winners[1]?.order?.name,
                secondEmail: winners[1]?.order?.email,
                secondContact: winners[1]?.order?.contactNo,

                thirdTicket: winners[2]?.ticketCode,
                thirdName: winners[2]?.order?.name,
                thirdEmail: winners[2]?.order?.email,
                thirdContact: winners[2]?.order?.contactNo,

                usedDateRange: useDateRange,
                startDate: useDateRange ? fromDate : null,
                endDate: useDateRange ? toDate : null,
              }),
            });
          }}
          className="px-10 py-6 bg-green-400 text-black text-3xl font-bold rounded-xl hover:bg-green-300 mt-10"
        >
          Show Results
        </button>
      )}

      {!animating && !showResults && step < 3 && (
        <button
          onClick={startReveal}
          className="px-10 py-6 bg-yellow-400 text-black text-3xl font-bold rounded-xl hover:bg-yellow-300 mt-10"
        >
          Reveal Next Winner
        </button>
      )}
    </div>
  );
}
