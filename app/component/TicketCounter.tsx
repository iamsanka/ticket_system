"use client";

import { useState } from "react";

interface TicketCounterProps {
  label: string;
  name: string;
  max?: number;
  disabled?: boolean;
}

export function TicketCounter({
  label,
  name,
  max = 10,
  disabled = false,
}: TicketCounterProps) {
  const [count, setCount] = useState(0);

  const increment = () => {
    if (count < max) setCount(count + 1);
  };

  const decrement = () => {
    if (count > 0) setCount(count - 1);
  };

  return (
    <div className="mb-4">
      <label className="block text-left font-medium mb-1">{label}</label>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={decrement}
          disabled={disabled || count === 0}
          className={`w-10 h-10 rounded-full border flex items-center justify-center text-xl font-bold ${
            disabled || count === 0
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          –
        </button>

        <input type="hidden" name={name} value={count} />
        <div className="text-lg font-semibold w-6 text-center">{count}</div>

        <button
          type="button"
          onClick={increment}
          disabled={disabled || count >= max}
          className={`w-10 h-10 rounded-full border flex items-center justify-center text-xl font-bold ${
            disabled || count >= max
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          +
        </button>
      </div>
    </div>
  );
}
