"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UtensilsCrossed, ChevronUp, X } from "lucide-react";
import { usePlate, platePricePerPlate } from "@/lib/plate-store";
import { formatINR } from "@/lib/utils";
import { PlatePanel } from "@/components/plate/plate-panel";

export function PlateBarMobile() {
  const lines = usePlate((s) => s.lines);
  const guests = usePlate((s) => s.guests);
  const perPlate = platePricePerPlate(lines);
  const total = perPlate * guests;
  const count = lines.reduce((a, l) => a + l.qty, 0);
  const [open, setOpen] = useState(false);

  if (count === 0) return null;

  return (
    <>
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 px-3 pb-3 pointer-events-none">
        <motion.button
          type="button"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
          onClick={() => setOpen(true)}
          className="pointer-events-auto w-full flex items-center justify-between gap-3 rounded-2xl bg-primary text-primary-fg px-4 py-3 shadow-xl shadow-black/40"
        >
          <span className="inline-flex items-center gap-2.5">
            <UtensilsCrossed className="h-5 w-5" />
            <span className="text-sm font-bold">
              {count} {count === 1 ? "item" : "items"}
            </span>
            <span className="text-xs opacity-80">·</span>
            <span className="text-sm font-bold tabular-nums">
              {formatINR(perPlate)}/plate
            </span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
            View plate
            <ChevronUp className="h-4 w-4" />
          </span>
        </motion.button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              className="absolute inset-x-0 bottom-0 max-h-[92vh] bg-[var(--bg)] rounded-t-3xl border-t border-[var(--border-strong)] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
                <div>
                  <div className="font-display text-2xl">Your plate</div>
                  <div className="text-xs text-fg-muted tabular-nums">
                    {count} items · est. {formatINR(total)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-[var(--border-strong)]"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-3">
                <PlatePanel className="!border-0 !bg-transparent" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
