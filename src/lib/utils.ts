import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(n: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

// PDF-safe variant that returns just "₹" + number, so jsPDF with a Unicode font
// can render it cleanly.
export function formatINRPlain(n: number): string {
  return "₹" + n.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

import dishImages from "@/data/dish-images.json";

// Resolve an image for a menu dish id. Local image is preferred; falls back
// to a generic placeholder if not yet fetched.
export function dishImage(id: string): string {
  return (dishImages as Record<string, string>)[id] ?? "/scene/hero.jpg";
}

export function sceneImage(name: string): string {
  return `/scene/${name}.jpg`;
}

export function hashSeed(s: string): number {
  return Math.abs([...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 7));
}
