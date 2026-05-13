"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Plus } from "lucide-react";
import { usePlate } from "@/lib/plate-store";
import { PAIRINGS, PAIRING_REASON } from "@/data/pairings";
import { getMenuItem } from "@/data/menu";
import { formatINR } from "@/lib/utils";

// Compact single-line suggestion strip — kept small so it doesn't crowd the items list.
export function AutoSuggest() {
  const lines = usePlate((s) => s.lines);
  const add = usePlate((s) => s.add);

  const ids = new Set(lines.map((l) => l.itemId));
  let suggestion: { from: string; to: string; reason: string } | null = null;
  outer: for (const line of lines) {
    const pairs = PAIRINGS[line.itemId];
    if (!pairs) continue;
    for (const pid of pairs) {
      if (!ids.has(pid)) {
        suggestion = {
          from: line.itemId,
          to: pid,
          reason: PAIRING_REASON[pid] ?? "A chef's pick",
        };
        break outer;
      }
    }
  }

  if (!suggestion) return null;
  const item = getMenuItem(suggestion.to);
  if (!item) return null;

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={suggestion.to}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden"
      >
        <div className="mx-3 my-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/25 flex items-center gap-2.5">
          <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold truncate">
              {item.name}{" "}
              <span className="text-fg-subtle font-normal">
                · {formatINR(item.price)}
              </span>
            </div>
            <div className="text-[10px] text-fg-subtle italic truncate">
              {suggestion.reason}
            </div>
          </div>
          <button
            type="button"
            onClick={() => add(item.id)}
            className="inline-flex items-center gap-0.5 rounded-full bg-primary text-primary-fg px-2.5 py-1 text-[10px] font-bold shrink-0 hover:bg-[var(--primary-hover)] transition-colors"
            aria-label={`Add ${item.name}`}
          >
            <Plus className="h-2.5 w-2.5" />
            Add
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
