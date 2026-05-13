"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const KEY = "pankti.preloader.seen";

export function Preloader() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = sessionStorage.getItem(KEY);
    if (seen) return;
    setShow(true);
    const t = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem(KEY, "1");
    }, 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-[var(--bg)]"
        >
          <div className="relative flex flex-col items-center">
            {/* mandala rings */}
            <svg
              width="240"
              height="240"
              viewBox="0 0 240 240"
              className="text-primary"
            >
              {[110, 88, 66, 44].map((r, i) => (
                <motion.circle
                  key={r}
                  cx="120"
                  cy="120"
                  r={r}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={i === 0 ? 1 : 0.7}
                  strokeDasharray={r * 2 * Math.PI}
                  initial={{ strokeDashoffset: r * 2 * Math.PI }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 1.2, delay: i * 0.12, ease: "easeOut" }}
                  opacity={1 - i * 0.18}
                />
              ))}
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i / 12) * Math.PI * 2;
                const x1 = 120 + Math.cos(angle) * 28;
                const y1 = 120 + Math.sin(angle) * 28;
                const x2 = 120 + Math.cos(angle) * 40;
                const y2 = 120 + Math.sin(angle) * 40;
                return (
                  <motion.line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 + i * 0.04 }}
                  />
                );
              })}
              {/* glowing center diya */}
              <motion.circle
                cx="120"
                cy="120"
                r="14"
                fill="currentColor"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 180 }}
              />
              <motion.path
                d="M120 100 Q117 108 120 116 Q123 108 120 100"
                fill="#F0B357"
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: [0, 1, 0.85, 1], scaleY: [0, 1.1, 0.95, 1] }}
                transition={{ delay: 0.8, duration: 1.4 }}
              />
            </svg>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="mt-6 font-display text-3xl tracking-tight"
            >
              Pankti
              <span className="text-primary">.</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.6 }}
              className="mt-1 text-xs uppercase tracking-[0.3em] text-fg-subtle"
            >
              Setting the table
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
