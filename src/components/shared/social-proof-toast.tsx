"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const PROOFS = [
  { name: "Sneha M.", action: "sent a plate for 220 guests", when: "4 min ago" },
  { name: "Karthik R.", action: "booked the Wedding Feast", when: "12 min ago" },
  { name: "Ananya G.", action: "saved a plate for Diwali", when: "32 min ago" },
  { name: "Rohit A.", action: "downloaded a quote for 80 guests", when: "1 hr ago" },
  { name: "Lakshmi G.", action: "enquired about Pooja Bhojan", when: "2 hr ago" },
  { name: "Vivek P.", action: "shared a plate on WhatsApp", when: "3 hr ago" },
];

export function SocialProofToast() {
  const [idx, setIdx] = useState(-1);
  const [visible, setVisible] = useState(false);
  const iRef = useRef(0);

  useEffect(() => {
    let alive = true;
    let intervalId: ReturnType<typeof setInterval> | null = null;
    let hideId: ReturnType<typeof setTimeout> | null = null;

    const cycle = () => {
      if (!alive) return;
      setIdx(iRef.current % PROOFS.length);
      setVisible(true);
      if (hideId) clearTimeout(hideId);
      hideId = setTimeout(() => {
        if (alive) setVisible(false);
      }, 5000);
      iRef.current++;
    };

    // Wait before first toast so we don't jump on the user
    const firstId = setTimeout(() => {
      cycle();
      intervalId = setInterval(cycle, 16000);
    }, 14000);

    return () => {
      alive = false;
      clearTimeout(firstId);
      if (intervalId) clearInterval(intervalId);
      if (hideId) clearTimeout(hideId);
    };
  }, []);

  const p = idx >= 0 ? PROOFS[idx] : null;

  return (
    <div className="fixed bottom-5 left-4 sm:bottom-6 sm:left-5 lg:bottom-8 lg:left-8 z-20 pointer-events-none max-w-[calc(100vw-2rem)]">
      <AnimatePresence>
        {visible && p && (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto flex items-center gap-3 max-w-[280px] rounded-2xl bg-[var(--bg-elev)]/95 backdrop-blur border border-[var(--border-strong)] px-3.5 py-2.5 shadow-xl shadow-black/30"
          >
            <CheckCircle2 className="h-5 w-5 text-[var(--success)] shrink-0" />
            <div className="min-w-0">
              <div className="text-sm leading-tight">
                <span className="font-semibold">{p.name}</span>{" "}
                <span className="text-fg-muted">{p.action}</span>
              </div>
              <div className="text-[10px] uppercase tracking-wider text-fg-subtle mt-0.5">
                {p.when}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
