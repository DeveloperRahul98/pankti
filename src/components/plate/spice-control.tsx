"use client";
import { Flame } from "lucide-react";
import { usePlate, SPICE_LABELS, type SpicePref } from "@/lib/plate-store";
import { cn } from "@/lib/utils";

const LEVELS: SpicePref[] = [0, 1, 2, 3];

export function SpiceControl() {
  const spicePref = usePlate((s) => s.spicePref);
  const setSpicePref = usePlate((s) => s.setSpicePref);

  return (
    <div className="px-5 pt-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase tracking-wider text-fg-subtle inline-flex items-center gap-1.5">
          <Flame className="h-3 w-3 text-primary" />
          Spice preference
        </span>
        <span className="text-[10px] font-semibold text-primary">
          {SPICE_LABELS[spicePref]}
        </span>
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
            aria-pressed={spicePref === lvl}
          >
            {SPICE_LABELS[lvl]}
          </button>
        ))}
      </div>
    </div>
  );
}
