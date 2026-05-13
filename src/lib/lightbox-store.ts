"use client";
import { create } from "zustand";
import type { GalleryImage } from "@/data/gallery";

type State = {
  open: boolean;
  items: GalleryImage[];
  index: number;
  openAt: (items: GalleryImage[], index: number) => void;
  close: () => void;
  setIndex: (i: number) => void;
  next: () => void;
  prev: () => void;
};

export const useLightbox = create<State>((set, get) => ({
  open: false,
  items: [],
  index: 0,
  openAt: (items, index) => set({ open: true, items, index }),
  close: () => set({ open: false }),
  setIndex: (i) => {
    const items = get().items;
    if (!items.length) return;
    const next = ((i % items.length) + items.length) % items.length;
    set({ index: next });
  },
  next: () => get().setIndex(get().index + 1),
  prev: () => get().setIndex(get().index - 1),
}));
