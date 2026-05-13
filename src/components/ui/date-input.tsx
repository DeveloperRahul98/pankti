"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Format: stores ISO (yyyy-mm-dd) for consistency, displays DD/MM/YYYY.
function toDisplay(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return "";
  return `${d}/${m}/${y}`;
}

function toIso(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

export function DateInput({
  value,
  onChange,
  placeholder = "DD/MM/YYYY",
  minDate,
  className,
  id,
}: {
  value: string; // yyyy-mm-dd
  onChange: (iso: string) => void;
  placeholder?: string;
  minDate?: Date;
  className?: string;
  id?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const today = new Date();
  const selected = value ? new Date(value + "T00:00:00") : null;
  const [viewMonth, setViewMonth] = useState(() => {
    const base = selected ?? today;
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  // Close on outside click / Esc
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const goPrevMonth = () =>
    setViewMonth((v) => new Date(v.getFullYear(), v.getMonth() - 1, 1));
  const goNextMonth = () =>
    setViewMonth((v) => new Date(v.getFullYear(), v.getMonth() + 1, 1));

  // Build the day grid for the current view month
  const firstOfMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
  const startDayOfWeek = firstOfMonth.getDay(); // 0 = Sun
  const daysInMonth = new Date(
    viewMonth.getFullYear(),
    viewMonth.getMonth() + 1,
    0,
  ).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startDayOfWeek; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(viewMonth.getFullYear(), viewMonth.getMonth(), d));
  }
  // Pad to multiple of 7 for tidy rendering
  while (cells.length % 7 !== 0) cells.push(null);

  const onPick = (d: Date) => {
    onChange(toIso(d));
    setOpen(false);
  };

  const isDisabled = (d: Date) => {
    if (minDate) {
      const min = new Date(
        minDate.getFullYear(),
        minDate.getMonth(),
        minDate.getDate(),
      );
      if (d < min) return true;
    }
    return false;
  };

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        id={id}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 bg-[var(--bg-elev)] border border-[var(--border-strong)] rounded-[0.6rem] px-3 py-2 text-sm text-left hover:border-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span
          className={cn(
            "tabular-nums",
            value ? "text-fg" : "text-fg-subtle/60",
          )}
        >
          {value ? toDisplay(value) : placeholder}
        </span>
        <CalendarIcon className="h-4 w-4 text-fg-subtle shrink-0" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 top-full mt-2 w-72 max-w-[calc(100vw-2.5rem)] rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-elev)] p-3 shadow-xl shadow-black/40 z-50"
            role="dialog"
          >
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={goPrevMonth}
                aria-label="Previous month"
                className="h-7 w-7 inline-flex items-center justify-center rounded-full text-fg-muted hover:text-fg hover:bg-[var(--bg)]"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="text-sm font-semibold">
                {MONTHS[viewMonth.getMonth()]} {viewMonth.getFullYear()}
              </div>
              <button
                type="button"
                onClick={goNextMonth}
                aria-label="Next month"
                className="h-7 w-7 inline-flex items-center justify-center rounded-full text-fg-muted hover:text-fg hover:bg-[var(--bg)]"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-1">
              {WEEKDAYS.map((w, i) => (
                <div
                  key={i}
                  className="text-[10px] uppercase tracking-wider text-fg-subtle text-center py-1"
                >
                  {w}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {cells.map((d, i) => {
                if (!d) return <div key={i} />;
                const isToday = isSameDay(d, today);
                const isSelected = selected && isSameDay(d, selected);
                const disabled = isDisabled(d);
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={disabled}
                    onClick={() => onPick(d)}
                    className={cn(
                      "h-8 w-full inline-flex items-center justify-center rounded-md text-xs tabular-nums transition-colors",
                      disabled && "text-fg-subtle/30 cursor-not-allowed",
                      !disabled && !isSelected && "text-fg-muted hover:bg-[var(--bg)] hover:text-fg",
                      isSelected && "bg-primary text-primary-fg font-bold",
                      !isSelected && isToday && "ring-1 ring-primary/50 text-primary",
                    )}
                  >
                    {d.getDate()}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 pt-2 border-t border-[var(--border)] flex items-center justify-between">
              <button
                type="button"
                onClick={() => onPick(today)}
                className="text-xs font-semibold text-primary hover:opacity-80"
              >
                Today
              </button>
              {value && (
                <button
                  type="button"
                  onClick={() => {
                    onChange("");
                    setOpen(false);
                  }}
                  className="text-xs text-fg-subtle hover:text-[var(--danger)]"
                >
                  Clear
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
