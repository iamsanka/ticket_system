"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Winner = {
  ticketCode: string;
  order: {
    name: string | null;
    email: string | null;
    contactNo: string | null;
    event: {
      title: string;
      venue: string;
      date: string;
    };
  };
};

type WinnersResponse = {
  enabled: boolean;
  winners?: {
    first: Winner | null;
    second: Winner | null;
    third: Winner | null;
  };
};

export default function ManualRafflePublicPage() {
  const router = useRouter();

  const [data, setData] = useState<WinnersResponse | null>(null);
  const [step, setStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [fakeCode, setFakeCode] = useState("");

  const [showThird, setShowThird] = useState(false);
  const [showSecond, setShowSecond] = useState(false);
  const [showFirst, setShowFirst] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/raffle/manual", { cache: "no-store" });
      const json = await res.json();
      setData(json);
    }
    load();
  }, []);

  function startReveal() {
    if (step === 1) setShowThird(false);
    if (step === 2) setShowSecond(false);

    setAnimating(true);

    const interval = setInterval(() => {
      setFakeCode("XX-" + Math.floor(100000 + Math.random() * 900000));
    }, 80);

    setTimeout(() => {
      clearInterval(interval);
      setAnimating(false);

      if (step === 0) setShowThird(true);
      if (step === 1) setShowSecond(true);
      if (step === 2) setShowFirst(true);

      setStep((prev) => prev + 1);
    }, 7000);
  }

  if (!data) return <div className="p-6 text-white">Loading…</div>;
  if (!data.enabled)
    return <div className="p-6 text-red-500 text-3xl">Raffle not enabled</div>;

  const { winners } = data;

  function renderWinner(place: string, winner: Winner | null) {
    if (!winner) return null;

    return (
      <div className="border-4 border-yellow-400 p-8 rounded-xl text-center space-y-4 bg-black bg-opacity-60 w-full max-w-[380px]">
        <h2 className="text-5xl font-bold uppercase text-yellow-400">
          {place}
        </h2>
        <div className="text-4xl font-mono text-white">
          Ticket: {winner.ticketCode}
        </div>
        <div className="text-3xl text-white">Name: {winner.order.name}</div>
        <div className="text-2xl text-gray-300">
          Email: {winner.order.email}
        </div>
        <div className="text-2xl text-gray-300">
          Contact: {winner.order.contactNo}
        </div>
        <div className="text-2xl text-gray-300">
          Event: {winner.order.event.title}
        </div>
        <div className="text-2xl text-gray-300">
          Venue: {winner.order.event.venue}
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
      {/* ⭐ FIXED BACK BUTTON (top-left) */}
      <button
        onClick={() => router.push("/admin/raffle")}
        className="fixed top-6 left-6 px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-lg text-xl font-semibold z-50"
      >
        ← Back
      </button>

      <h1 className="text-6xl font-extrabold text-yellow-400 mt-10 mb-16">
        Raffle Draw
      </h1>

      {showResults && (
        <div className="w-full flex flex-wrap justify-center items-start gap-10 mt-20 px-10">
          <div>{renderWinner("3rd Place", winners?.third ?? null)}</div>
          <div>{renderWinner("1st Place", winners?.first ?? null)}</div>
          <div>{renderWinner("2nd Place", winners?.second ?? null)}</div>
        </div>
      )}

      {!showResults && (
        <>
          {showThird && step === 1 && (
            <div className="flex flex-col items-center mb-24">
              {renderWinner("3rd Place", winners?.third ?? null)}
            </div>
          )}

          {showSecond && step === 2 && (
            <div className="flex flex-col items-center mb-24">
              {renderWinner("2nd Place", winners?.second ?? null)}
            </div>
          )}

          {showFirst && step === 3 && (
            <div className="flex flex-col items-center mb-24">
              {renderWinner("1st Place", winners?.first ?? null)}
            </div>
          )}

          {animating && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none w-[400px]">
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

      {!animating && !showResults && step < 3 && (
        <button
          onClick={startReveal}
          className="px-10 py-6 bg-yellow-400 text-black text-3xl font-bold rounded-xl hover:bg-yellow-300 mt-10"
        >
          Reveal Next Winner
        </button>
      )}

      {!animating && step === 3 && !showResults && (
        <button
          onClick={() => setShowResults(true)}
          className="px-10 py-6 bg-green-400 text-black text-3xl font-bold rounded-xl hover:bg-green-300 mt-10"
        >
          Show Results
        </button>
      )}
    </div>
  );
}
