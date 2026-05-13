"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MENU, type MenuItem } from "@/data/menu";

export type PlateLine = { itemId: string; qty: number };

export type SpicePref = 0 | 1 | 2 | 3; // 0 mild, 1 medium, 2 hot, 3 fiery
export const SPICE_LABELS: Record<SpicePref, string> = {
  0: "Mild",
  1: "Medium",
  2: "Hot",
  3: "Fiery",
};

type PlateState = {
  lines: PlateLine[];
  guests: number;
  occasionId: string | null;
  spicePref: SpicePref;
  notes: string;
  add: (itemId: string) => void;
  remove: (itemId: string) => void;
  setQty: (itemId: string, qty: number) => void;
  clear: () => void;
  setGuests: (n: number) => void;
  setOccasion: (id: string | null) => void;
  setSpicePref: (s: SpicePref) => void;
  setNotes: (n: string) => void;
  loadFromEncoded: (lines: PlateLine[], guests: number) => void;
};

export const usePlate = create<PlateState>()(
  persist(
    (set) => ({
      lines: [],
      guests: 50,
      occasionId: null,
      spicePref: 1,
      notes: "",
      add: (itemId) =>
        set((s) => {
          const existing = s.lines.find((l) => l.itemId === itemId);
          if (existing) {
            return {
              lines: s.lines.map((l) =>
                l.itemId === itemId ? { ...l, qty: l.qty + 1 } : l,
              ),
            };
          }
          return { lines: [...s.lines, { itemId, qty: 1 }] };
        }),
      remove: (itemId) =>
        set((s) => ({ lines: s.lines.filter((l) => l.itemId !== itemId) })),
      setQty: (itemId, qty) =>
        set((s) => ({
          lines:
            qty <= 0
              ? s.lines.filter((l) => l.itemId !== itemId)
              : s.lines.map((l) => (l.itemId === itemId ? { ...l, qty } : l)),
        })),
      clear: () => set({ lines: [] }),
      setGuests: (n) => set({ guests: Math.max(1, Math.floor(n)) }),
      setOccasion: (id) => set({ occasionId: id }),
      setSpicePref: (s) => set({ spicePref: s }),
      setNotes: (n) => set({ notes: n }),
      loadFromEncoded: (lines, guests) =>
        set({ lines, guests: Math.max(1, guests) }),
    }),
    { name: "pankti.plate.v1" },
  ),
);

export function getPlateItems(lines: PlateLine[]): {
  item: MenuItem;
  qty: number;
}[] {
  return lines
    .map((l) => {
      const item = MENU.find((m) => m.id === l.itemId);
      return item ? { item, qty: l.qty } : null;
    })
    .filter((x): x is { item: MenuItem; qty: number } => x !== null);
}

export function platePricePerPlate(lines: PlateLine[]): number {
  return getPlateItems(lines).reduce((sum, { item, qty }) => sum + item.price * qty, 0);
}
