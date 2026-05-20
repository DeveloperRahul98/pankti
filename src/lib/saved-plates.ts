"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PlateLine } from "@/lib/plate-store";

// Indian wedding events — used to tag a saved plate so we can group them
// into a single multi-event "wedding bundle" enquiry. Ordered roughly by
// typical chronology.
export const WEDDING_EVENTS = [
  { id: "engagement", label: "Engagement" },
  { id: "haldi", label: "Haldi" },
  { id: "mehendi", label: "Mehendi" },
  { id: "sangeet", label: "Sangeet" },
  { id: "wedding", label: "Wedding day" },
  { id: "reception", label: "Reception" },
  { id: "other", label: "Other" },
] as const;

export type WeddingEventId = (typeof WEDDING_EVENTS)[number]["id"];

export type SavedPlate = {
  id: string;
  name: string;
  lines: PlateLine[];
  guests: number;
  savedAt: string;
  // Optional — only set when the user explicitly tags the plate for a
  // wedding bundle. Backward compatible with v1 saved plates.
  eventType?: WeddingEventId;
  eventDate?: string; // ISO date string (YYYY-MM-DD)
};

type SavedPlatesState = {
  plates: SavedPlate[];
  save: (name: string, lines: PlateLine[], guests: number) => SavedPlate;
  remove: (id: string) => void;
  clear: () => void;
  setEventMeta: (
    id: string,
    meta: { eventType?: WeddingEventId | null; eventDate?: string | null },
  ) => void;
};

export const useSavedPlates = create<SavedPlatesState>()(
  persist(
    (set, get) => ({
      plates: [],
      save: (name, lines, guests) => {
        const plate: SavedPlate = {
          id: `plate-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          name: name.trim() || "Untitled plate",
          lines,
          guests,
          savedAt: new Date().toISOString(),
        };
        set({ plates: [plate, ...get().plates].slice(0, 12) });
        return plate;
      },
      remove: (id) =>
        set((s) => ({ plates: s.plates.filter((p) => p.id !== id) })),
      clear: () => set({ plates: [] }),
      setEventMeta: (id, meta) =>
        set((s) => ({
          plates: s.plates.map((p) => {
            if (p.id !== id) return p;
            const next = { ...p };
            if (meta.eventType !== undefined) {
              if (meta.eventType === null) delete next.eventType;
              else next.eventType = meta.eventType;
            }
            if (meta.eventDate !== undefined) {
              if (meta.eventDate === null || meta.eventDate === "")
                delete next.eventDate;
              else next.eventDate = meta.eventDate;
            }
            return next;
          }),
        })),
    }),
    { name: "pankti.saved-plates.v1" },
  ),
);

// Sort plates by event date (ascending), then by saved-at (descending) for
// untagged plates. Used by the wedding planner view.
export function sortPlatesForBundle(plates: SavedPlate[]): SavedPlate[] {
  return [...plates].sort((a, b) => {
    if (a.eventDate && b.eventDate)
      return a.eventDate.localeCompare(b.eventDate);
    if (a.eventDate) return -1;
    if (b.eventDate) return 1;
    return b.savedAt.localeCompare(a.savedAt);
  });
}
