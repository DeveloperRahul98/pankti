"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { SITE } from "@/lib/site";

const KEY = "pankti.wa.bubble.shown";

// Official WhatsApp logo glyph
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16.001 3.2C8.93 3.2 3.2 8.93 3.2 16c0 2.27.6 4.49 1.74 6.44L3.2 28.8l6.51-1.71A12.74 12.74 0 0 0 16 28.8c7.07 0 12.8-5.73 12.8-12.8S23.07 3.2 16 3.2zm0 23.36a10.5 10.5 0 0 1-5.36-1.47l-.38-.23-3.86 1.01 1.03-3.77-.25-.39A10.55 10.55 0 1 1 26.56 16c0 5.83-4.73 10.56-10.56 10.56zm5.78-7.92c-.32-.16-1.88-.93-2.17-1.04-.29-.11-.51-.16-.72.16-.21.32-.83 1.04-1.02 1.26-.19.21-.37.24-.69.08-.32-.16-1.34-.49-2.56-1.58-.95-.85-1.59-1.9-1.77-2.22-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.73-.99-2.37-.26-.62-.53-.54-.72-.55l-.62-.01c-.21 0-.56.08-.85.4-.29.32-1.11 1.09-1.11 2.66s1.14 3.08 1.3 3.29c.16.21 2.24 3.42 5.43 4.79.76.33 1.35.52 1.81.67.76.24 1.45.21 2 .13.61-.09 1.88-.77 2.14-1.51.26-.74.26-1.38.18-1.51-.08-.13-.29-.21-.61-.37z" />
    </svg>
  );
}

export function WhatsAppBubble() {
  const [openTip, setOpenTip] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(KEY)) return;
    const t = setTimeout(() => {
      setOpenTip(true);
      sessionStorage.setItem(KEY, "1");
    }, 8000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!openTip) return;
    const hide = setTimeout(() => setOpenTip(false), 12000);
    return () => clearTimeout(hide);
  }, [openTip]);

  const greeting = encodeURIComponent(
    "Hi Pankti — I'm exploring catering options. Could you help?",
  );

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 lg:bottom-6 lg:right-6 z-30 flex flex-col items-end gap-2">
      <AnimatePresence>
        {openTip && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            className="relative max-w-[240px] sm:max-w-[260px] rounded-2xl rounded-br-sm bg-[var(--bg-elev)] border border-[var(--border-strong)] p-3.5 pr-8 shadow-xl shadow-black/30"
          >
            <button
              type="button"
              onClick={() => setOpenTip(false)}
              className="absolute top-1.5 right-1.5 h-5 w-5 inline-flex items-center justify-center rounded-full text-fg-subtle hover:text-fg"
              aria-label="Close"
            >
              <X className="h-3 w-3" />
            </button>
            <p className="text-sm leading-snug">
              <span className="font-semibold">Need help picking?</span>
              <br />
              <span className="text-fg-muted">
                I&apos;m Rahul, founder. Tap to chat — I usually reply within
                the hour.
              </span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <a
        href={`https://wa.me/${SITE.whatsapp}?text=${greeting}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="group relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-black/40 hover:scale-105 active:scale-95 transition-transform"
      >
        <span className="absolute inset-0 rounded-full ring-4 ring-[#25D366]/30 animate-ping opacity-60" />
        <WhatsAppIcon className="h-7 w-7 relative" />
      </a>
    </div>
  );
}
