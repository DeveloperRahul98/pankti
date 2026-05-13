"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { ACTIVE_BANNER } from "@/data/festivals";

const KEY = "pankti.banner.dismissed";

export function FestivalBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!ACTIVE_BANNER) return;
    const dismissed = sessionStorage.getItem(`${KEY}.${ACTIVE_BANNER.id}`);
    if (!dismissed) setShow(true);
  }, []);

  if (!ACTIVE_BANNER) return null;
  const f = ACTIVE_BANNER;

  const dismiss = () => {
    sessionStorage.setItem(`${KEY}.${f.id}`, "1");
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden bg-primary text-primary-fg"
        >
          <div className="mx-auto max-w-7xl px-5 lg:px-8 py-2.5 flex items-center justify-center gap-3 text-sm font-medium">
            <Sparkles className="h-4 w-4 shrink-0" />
            <span className="truncate">
              <strong>{f.name} menu</strong> · {f.menu}
            </span>
            {f.suggestedPlateId && (
              <Link
                href={`/signature-plates#${f.suggestedPlateId}`}
                className="hidden sm:inline underline underline-offset-2 hover:no-underline shrink-0"
              >
                See plate →
              </Link>
            )}
            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss"
              className="ml-auto h-6 w-6 inline-flex items-center justify-center rounded-full hover:bg-black/10 shrink-0"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
