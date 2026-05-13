"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Info } from "lucide-react";
import { GLOSSARY } from "@/data/glossary";
import { getMenuItem } from "@/data/menu";

type Pos = { top: number; left: number };

export function DishGlossaryTip({
  dishId,
  className,
}: {
  dishId: string;
  className?: string;
}) {
  const item = getMenuItem(dishId);
  const glossary = GLOSSARY[dishId];
  const description = item?.description;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Nothing to show
  if (!description && !glossary) return null;

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        aria-label="More about this dish"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className={
          className ??
          "h-7 w-7 inline-flex items-center justify-center rounded-full bg-black/55 backdrop-blur text-white/85 hover:text-white hover:bg-black/75 transition-colors"
        }
      >
        <Info className="h-3.5 w-3.5" />
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
                {item && (
                  <div className="font-display text-sm text-fg mb-1.5">
                    {item.name}
                  </div>
                )}
                {description && (
                  <p className="text-xs text-fg leading-relaxed">
                    {description}
                  </p>
                )}
                {glossary && glossary !== description && (
                  <>
                    <div className="mt-2.5 mb-1 text-[10px] uppercase tracking-wider text-primary">
                      Good to know
                    </div>
                    <p className="text-xs text-fg-muted leading-relaxed">
                      {glossary}
                    </p>
                  </>
                )}
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 bg-[var(--bg)] border-l border-t border-[var(--border-strong)]" />
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
