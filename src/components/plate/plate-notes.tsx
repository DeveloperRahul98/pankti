"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp, StickyNote } from "lucide-react";
import { usePlate } from "@/lib/plate-store";

export function PlateNotes() {
  const notes = usePlate((s) => s.notes);
  const setNotes = usePlate((s) => s.setNotes);
  // Start expanded only when there's already content
  const [open, setOpen] = useState(notes.length > 0);

  return (
    <div className="px-5 pt-3">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full inline-flex items-center justify-between text-[10px] uppercase tracking-wider text-fg-subtle hover:text-fg"
      >
        <span className="inline-flex items-center gap-1.5">
          <StickyNote className="h-3 w-3 text-primary" />
          Notes for the chef
          {notes.length > 0 && (
            <span className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary text-primary-fg px-1 text-[9px] font-bold">
              {notes.length}
            </span>
          )}
        </span>
        {open ? (
          <ChevronUp className="h-3 w-3" />
        ) : (
          <ChevronDown className="h-3 w-3" />
        )}
      </button>
      {open && (
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value.slice(0, 280))}
          placeholder="Allergies, timing, special requests..."
          rows={2}
          className="!text-xs !py-2 mt-2 resize-none"
        />
      )}
    </div>
  );
}
