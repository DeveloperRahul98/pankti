"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Flame, StickyNote } from "lucide-react";
import { usePlate, SPICE_LABELS, type SpicePref } from "@/lib/plate-store";
import { cn } from "@/lib/utils";

const LEVELS: SpicePref[] = [0, 1, 2, 3];

// Compact, collapsed-by-default preferences section combining
// spice picker + notes. Saves vertical space in the plate panel.
export function PlatePreferences() {
  const spicePref = usePlate((s) => s.spicePref);
  const setSpicePref = usePlate((s) => s.setSpicePref);
  const notes = usePlate((s) => s.notes);
  const setNotes = usePlate((s) => s.setNotes);

  const [open, setOpen] = useState(notes.length > 0);

  return (
    <div className="border-t border-[var(--border)]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-2.5 text-xs"
      >
        <span className="inline-flex items-center gap-2 text-fg-muted">
          <span className="inline-flex items-center gap-1">
            <Flame className="h-3 w-3 text-primary" />
            <span className="text-primary font-semibold">
              {SPICE_LABELS[spicePref]}
            </span>
          </span>
          <span className="text-fg-subtle">·</span>
          <span className="inline-flex items-center gap-1">
            <StickyNote className="h-3 w-3 text-primary" />
            <span>
              {notes.length > 0
                ? `Note (${notes.length})`
                : "Add note for chef"}
            </span>
          </span>
        </span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-fg-subtle transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="prefs-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-3 space-y-3">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-fg-subtle mb-1.5">
                  Spice preference
                </div>
                <div className="grid grid-cols-4 gap-1 rounded-full bg-[var(--bg)] border border-[var(--border)] p-0.5">
                  {LEVELS.map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSpicePref(lvl)}
                      className={cn(
                        "py-1.5 rounded-full text-[10px] font-semibold transition-colors",
                        spicePref === lvl
                          ? "bg-primary text-primary-fg"
                          : "text-fg-muted hover:text-fg",
                      )}
                    >
                      {SPICE_LABELS[lvl]}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-fg-subtle mb-1.5">
                  Notes for the chef
                </div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value.slice(0, 280))}
                  placeholder="Allergies, timing, special requests..."
                  rows={2}
                  className="!text-xs !py-2 resize-none"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
