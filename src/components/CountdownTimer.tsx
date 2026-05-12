"use client";

import { m, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 45,
    seconds: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#1C1C1E] text-white py-3 px-6 rounded-2xl flex items-center justify-between shadow-xl">
      <div className="flex items-center gap-3">
        <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
        <span className="text-sm font-bold uppercase tracking-wider">Flash Sale</span>
      </div>
      <div className="flex items-center gap-1.5 font-mono font-bold text-lg">
        <FlipDigit value={timeLeft.hours} />
        <span>:</span>
        <FlipDigit value={timeLeft.minutes} />
        <span>:</span>
        <FlipDigit value={timeLeft.seconds} />
      </div>
    </div>
  );
}

function FlipDigit({ value }: { value: number }) {
  const displayValue = value.toString().padStart(2, "0");
  
  return (
    <div className="flex gap-0.5">
      {displayValue.split("").map((digit, idx) => (
        <div key={idx} className="relative h-7 w-5 overflow-hidden flex items-center justify-center">
          <AnimatePresence mode="popLayout">
            <m.span
              key={digit}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ type: "spring" as const, stiffness: 300, damping: 30 }}
              className="absolute"
            >
              {digit}
            </m.span>
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
