"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Info } from "lucide-react";

type Pos = { top: number; left: number };

export function InfoTip({
  title,
  children,
  label = "More info",
  size = 14,
}: {
  title?: string;
  children: React.ReactNode;
  label?: string;
  size?: number;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<Pos | null>(null);
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  const place = () => {
    const rect = btnRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({
      top: rect.bottom + 6,
      left: rect.left + rect.width / 2,
    });
  };

  useEffect(() => {
    if (!open) return;
    place();
    const handler = () => place();
    window.addEventListener("scroll", handler, true);
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("scroll", handler, true);
      window.removeEventListener("resize", handler);
    };
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        aria-label={label}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className="inline-flex items-center justify-center rounded-full text-fg-subtle hover:text-primary transition-colors"
        style={{ width: size + 4, height: size + 4 }}
      >
        <Info style={{ width: size, height: size }} />
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && pos && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.95 }}
                transition={{ duration: 0.18 }}
                style={{
                  position: "fixed",
                  top: pos.top,
                  left: pos.left,
                  transform: "translateX(-50%)",
                  maxWidth: "min(280px, calc(100vw - 24px))",
                }}
                className="z-50 rounded-xl bg-[var(--bg)] border border-[var(--border-strong)] p-3.5 shadow-xl shadow-black/40 pointer-events-none"
              >
                {title && (
                  <div className="font-display text-sm text-fg mb-1.5">
                    {title}
                  </div>
                )}
                <div className="text-xs text-fg-muted leading-relaxed">
                  {children}
                </div>
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 bg-[var(--bg)] border-l border-t border-[var(--border-strong)]" />
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
