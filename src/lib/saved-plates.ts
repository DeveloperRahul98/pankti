"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PlateLine } from "@/lib/plate-store";

export type SavedPlate = {
  id: string;
  name: string;
  lines: PlateLine[];
  guests: number;
  savedAt: string;
};

type SavedPlatesState = {
  plates: SavedPlate[];
  save: (name: string, lines: PlateLine[], guests: number) => SavedPlate;
  remove: (id: string) => void;
  clear: () => void;
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
    }),
    { name: "pankti.saved-plates.v1" },
  ),
);
