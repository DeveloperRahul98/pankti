import type { PlateLine } from "@/lib/plate-store";

// Compact base64url encoding: lines + guests
type Encoded = { l: [string, number][]; g: number };

function toBase64Url(s: string): string {
  if (typeof window === "undefined") {
    return Buffer.from(s, "utf-8").toString("base64url");
  }
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(s: string): string {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
  if (typeof window === "undefined") {
    return Buffer.from(b64, "base64").toString("utf-8");
  }
  return atob(b64);
}

export function encodePlate(lines: PlateLine[], guests: number): string {
  const payload: Encoded = {
    l: lines.map((x) => [x.itemId, x.qty]),
    g: guests,
  };
  return toBase64Url(JSON.stringify(payload));
}

export function decodePlate(token: string): {
  lines: PlateLine[];
  guests: number;
} | null {
  try {
    const decoded = fromBase64Url(token);
    const parsed = JSON.parse(decoded) as Encoded;
    if (!Array.isArray(parsed.l) || typeof parsed.g !== "number") return null;
    return {
      lines: parsed.l.map(([itemId, qty]) => ({ itemId, qty })),
      guests: parsed.g,
    };
  } catch {
    return null;
  }
}
