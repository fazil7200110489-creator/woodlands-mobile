"use client";

import { useEffect, useState } from "react";
import { m, AnimatePresence } from "framer-motion";

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 500);
          }, 200);
          return 100;
        }
        return prev + 1;
      });
    }, 15);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <m.div
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10001] bg-white flex flex-col items-center justify-center gap-8"
        >
          <div className="relative flex flex-col items-center">
            <m.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-[120px] font-bold text-secondary leading-none select-none"
            >
              {count}
            </m.div>

            <div className="absolute inset-0 flex items-center justify-center">
              <m.h2
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-bold text-[#1C1C1E] tracking-widest uppercase"
              >
                Woodlands
              </m.h2>
            </div>
          </div>

          <div className="w-48 h-1 bg-secondary rounded-full overflow-hidden">
            <m.div
              initial={{ width: 0 }}
              animate={{ width: `${count}%` }}
              className="h-full bg-primary"
            />
          </div>

          <m.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]"
          >
            Premium Pickup
          </m.p>
        </m.div>
      )}
    </AnimatePresence>
  );
}
