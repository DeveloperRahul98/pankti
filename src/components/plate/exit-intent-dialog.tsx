"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { usePlate, EXIT_DISCOUNT_RATE } from "@/lib/plate-store";

const SESSION_KEY = "pankti.exitIntent.dismissed";

// "Wait — here's a discount" prompt fired when the user signals they're
// about to leave. Triggers:
//  - desktop: mouse leaves the viewport upward (proven exit-intent signal)
//  - mobile: page becomes hidden (tab switch / app switch / back gesture)
// One shot per session, only if the user has actually built something
// (≥ 2 dishes — otherwise the offer feels pushy).
export function ExitIntentDialog() {
  const lines = usePlate((s) => s.lines);
  const setDiscountApplied = usePlate((s) => s.setDiscountApplied);
  const discountApplied = usePlate((s) => s.discountApplied);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (lines.length < 2) return; // don't pester first-touch users
    if (discountApplied) return; // already accepted earlier this session
    if (sessionStorage.getItem(SESSION_KEY) === "1") return;

    // Wait a bit before arming the listeners so the trigger doesn't fire
    // immediately on landing.
    const armDelay = setTimeout(() => {
      const onMouseLeave = (e: MouseEvent) => {
        // Mouse leaving from the top of the viewport = intent to close
        // tab / hit address bar / switch tabs. Ignore exits to the sides
        // (they're usually accidental).
        if (e.clientY <= 4) fire();
      };
      const onVisibility = () => {
        if (document.visibilityState === "hidden") fire();
      };
      const fire = () => {
        if (sessionStorage.getItem(SESSION_KEY) === "1") return;
        setOpen(true);
        sessionStorage.setItem(SESSION_KEY, "1");
        document.removeEventListener("mouseleave", onMouseLeave);
        document.removeEventListener("visibilitychange", onVisibility);
      };
      document.addEventListener("mouseleave", onMouseLeave);
      document.addEventListener("visibilitychange", onVisibility);
      return () => {
        document.removeEventListener("mouseleave", onMouseLeave);
        document.removeEventListener("visibilitychange", onVisibility);
      };
    }, 6000);

    return () => clearTimeout(armDelay);
  }, [lines.length, discountApplied]);

  const onAccept = () => {
    setDiscountApplied(true);
    setOpen(false);
    // Tell whichever PlatePanel is mounted (desktop sidebar or mobile sheet)
    // to pop its enquiry dialog so the customer can finish in one step.
    window.dispatchEvent(new CustomEvent("pankti:open-enquiry"));
  };

  const onDismiss = () => setOpen(false);

  if (!mounted) return null;

  const pct = Math.round(EXIT_DISCOUNT_RATE * 100);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] bg-black/75 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-6"
          onClick={onDismiss}
        >
          <motion.div
            initial={{ y: 60, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="relative w-full md:max-w-md bg-[var(--bg)] md:rounded-3xl rounded-t-3xl border border-[var(--border-strong)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onDismiss}
              className="absolute top-3 right-3 h-9 w-9 inline-flex items-center justify-center rounded-full text-fg-subtle hover:text-fg"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Saffron header */}
            <div className="px-6 pt-7 pb-5 text-center bg-[color-mix(in_srgb,var(--primary)_10%,transparent)]">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-fg mb-3">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-primary mb-1.5">
                Wait — before you go
              </div>
              <h3 className="font-display text-2xl md:text-3xl tracking-tight">
                Here&apos;s {pct}% off
              </h3>
              <p className="mt-2 text-sm text-fg-muted">
                Send your enquiry today and we&apos;ll apply a{" "}
                <span className="text-primary font-semibold">{pct}% loyalty discount</span>{" "}
                to your final invoice. Your plate is already saved — one tap and
                you&apos;re done.
              </p>
            </div>

            <div className="px-6 py-5 space-y-2.5">
              <button
                type="button"
                onClick={onAccept}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-fg py-3 text-sm font-semibold hover:bg-[var(--primary-hover)] transition-colors active:scale-[.99]"
              >
                Apply {pct}% &amp; send enquiry
              </button>
              <button
                type="button"
                onClick={onDismiss}
                className="w-full inline-flex items-center justify-center rounded-full text-fg-subtle hover:text-fg text-xs font-medium py-2"
              >
                No thanks, I&apos;ll come back
              </button>
              <p className="text-[10px] text-fg-subtle text-center mt-2">
                Limited to one offer per visit. Caterer will confirm the
                discount on call-back.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
