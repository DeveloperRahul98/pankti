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

// GST charged on the (food + extras + delivery − discount) subtotal.
// 5% is the standard outdoor-catering rate in India. Set to 0 for sub-threshold
// caterers (turnover ≤ ₹20 lakh/year).
export const GST_RATE = 0.05;

// Exit-intent discount — applied once per visit if the customer accepts the
// "wait, here's a discount" prompt before leaving.
export const EXIT_DISCOUNT_RATE = 0.05; // 5% off subtotal

// Anchor pricing — used to reassure the customer that their plate is within
// or below typical market range. Adjust as needed.
export const MARKET_REFERENCE: Record<
  string,
  { low: number; high: number; label: string }
> = {
  wedding: { low: 500, high: 800, label: "weddings" },
  pooja: { low: 250, high: 450, label: "poojas & housewarmings" },
  birthday: { low: 250, high: 450, label: "birthdays & anniversaries" },
  corporate: { low: 250, high: 400, label: "corporate lunches" },
  default: { low: 300, high: 600, label: "events" },
};

// Rentals & service add-ons. Per-guest items scale with guest count;
// table/chair are per-unit; delivery is event-wide (handled separately).
export type DeliveryZone = "none" | "city" | "outer";

export const RENTALS = {
  water: { label: "Bottled water (500ml each)", perGuest: 10 },
  disposables: {
    label: "Disposable plates, cups & cutlery",
    sub: "One-time use · quick cleanup",
    perGuest: 15,
  },
  crockery: {
    label: "Reusable steel crockery",
    sub: "Plates, glasses & serving — we bring & take back to wash",
    perGuest: 25,
  },
  tableUnit: { label: "Banquet table", price: 100 },
  chairUnit: { label: "Chair", price: 20 },
  tableClothUnit: { label: "Table cloth", price: 5 },
  serverUnit: {
    label: "Server / waiter (per event)",
    price: 500,
    guestsPerServer: 25,
  },
  delivery: {
    none: { label: "I'll pick up from the kitchen", price: 0 },
    city: { label: "Within Hyderabad city (≤ 20 km)", price: 500 },
    outer: {
      label: "Outer Hyderabad — quote on call",
      price: 0,
    },
  },
} as const;

export type Rentals = {
  water: boolean;
  disposables: boolean;
  crockery: boolean;
  tables: number;
  chairs: number;
  tableCloths: number;
  servers: number;
  deliveryZone: DeliveryZone;
};

export const EMPTY_RENTALS: Rentals = {
  water: false,
  disposables: false,
  crockery: false,
  tables: 0,
  chairs: 0,
  tableCloths: 0,
  servers: 0,
  deliveryZone: "none",
};

type PlateState = {
  lines: PlateLine[];
  guests: number;
  occasionId: string | null;
  spicePref: SpicePref;
  notes: string;
  budgetPerPlate: number | null;
  rentals: Rentals;
  discountApplied: boolean;
  add: (itemId: string) => void;
  remove: (itemId: string) => void;
  setQty: (itemId: string, qty: number) => void;
  clear: () => void;
  setGuests: (n: number) => void;
  setOccasion: (id: string | null) => void;
  setSpicePref: (s: SpicePref) => void;
  setNotes: (n: string) => void;
  setBudgetPerPlate: (n: number | null) => void;
  setRentals: (patch: Partial<Rentals>) => void;
  setDiscountApplied: (v: boolean) => void;
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
      budgetPerPlate: null,
      rentals: EMPTY_RENTALS,
      discountApplied: false,
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
      setBudgetPerPlate: (n) =>
        set({ budgetPerPlate: n === null || n <= 0 ? null : Math.floor(n) }),
      setDiscountApplied: (v) => set({ discountApplied: !!v }),
      setRentals: (patch) =>
        set((s) => {
          // Disposables and steel crockery are mutually exclusive — turning
          // one on auto-clears the other.
          let disposables =
            patch.disposables !== undefined ? patch.disposables : s.rentals.disposables;
          let crockery =
            patch.crockery !== undefined ? patch.crockery : s.rentals.crockery;
          if (patch.disposables === true) crockery = false;
          if (patch.crockery === true) disposables = false;
          const clamp = (next: number | undefined, prev: number) =>
            next !== undefined ? Math.max(0, Math.floor(next)) : prev;
          return {
            rentals: {
              ...s.rentals,
              ...patch,
              disposables,
              crockery,
              tables: clamp(patch.tables, s.rentals.tables),
              chairs: clamp(patch.chairs, s.rentals.chairs),
              tableCloths: clamp(patch.tableCloths, s.rentals.tableCloths),
              servers: clamp(patch.servers, s.rentals.servers),
            },
          };
        }),
      loadFromEncoded: (lines, guests) =>
        set({ lines, guests: Math.max(1, guests) }),
    }),
    {
      name: "pankti.plate.v1",
      // Merge persisted state with current defaults so newly added fields
      // (like rentals.tableCloths / rentals.servers) get sensible values
      // instead of being undefined → NaN in arithmetic later.
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<PlateState>;
        const mergedRentals = {
          ...EMPTY_RENTALS,
          ...(p.rentals ?? {}),
        } as Rentals;
        // Coerce any stale delivery zone that no longer exists in the schema
        // (e.g. the old "distant" tier) back to a safe default.
        if (!(mergedRentals.deliveryZone in RENTALS.delivery)) {
          mergedRentals.deliveryZone = "none";
        }
        return {
          ...current,
          ...p,
          rentals: mergedRentals,
        } as PlateState;
      },
    },
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

// At-a-glance summary of the menu mix — surfaces vegetarian / non-veg /
// Jain-safe counts and the overall heat profile so the host (and the
// caterer reading the quote) can confirm the plate suits the guest list.
export type DietarySummary = {
  totalDishes: number;
  vegCount: number;
  nonVegCount: number;
  jainSafeCount: number;
  heatLabel: "mild" | "medium" | "hot" | "fiery" | "varied" | null;
  composition: "all-veg" | "all-non-veg" | "mixed" | "empty";
};

export function computeDietarySummary(
  lines: PlateLine[],
): DietarySummary {
  const items = getPlateItems(lines);
  if (items.length === 0) {
    return {
      totalDishes: 0,
      vegCount: 0,
      nonVegCount: 0,
      jainSafeCount: 0,
      heatLabel: null,
      composition: "empty",
    };
  }
  let veg = 0;
  let nonVeg = 0;
  let jain = 0;
  let totalSpice = 0;
  let countSpicy = 0;
  let minSpice = 4;
  let maxSpice = -1;
  for (const { item } of items) {
    if (item.veg) veg++;
    else nonVeg++;
    if (item.jainSafe) jain++;
    if (item.spice !== undefined && item.spice > 0) {
      totalSpice += item.spice;
      countSpicy++;
      if (item.spice < minSpice) minSpice = item.spice;
      if (item.spice > maxSpice) maxSpice = item.spice;
    }
  }

  let heatLabel: DietarySummary["heatLabel"] = null;
  if (countSpicy > 0) {
    const avg = totalSpice / countSpicy;
    const range = maxSpice - minSpice;
    if (range >= 2) heatLabel = "varied";
    else if (avg >= 2.5) heatLabel = "fiery";
    else if (avg >= 1.7) heatLabel = "hot";
    else if (avg >= 1) heatLabel = "medium";
    else heatLabel = "mild";
  }

  let composition: DietarySummary["composition"];
  if (veg === 0) composition = "all-non-veg";
  else if (nonVeg === 0) composition = "all-veg";
  else composition = "mixed";

  return {
    totalDishes: items.length,
    vegCount: veg,
    nonVegCount: nonVeg,
    jainSafeCount: jain,
    heatLabel,
    composition,
  };
}

// One-line text version of the summary — used in WhatsApp messages, the
// PDF quote, and anywhere we need to render it as a string.
export function formatDietarySummary(s: DietarySummary): string {
  if (s.composition === "empty") return "";
  const parts: string[] = [];
  if (s.composition === "all-veg") parts.push(`All-veg (${s.vegCount} dishes)`);
  else if (s.composition === "all-non-veg")
    parts.push(`All non-veg (${s.nonVegCount} dishes)`);
  else parts.push(`${s.vegCount} veg, ${s.nonVegCount} non-veg`);
  if (s.jainSafeCount > 0) parts.push(`${s.jainSafeCount} Jain-safe`);
  if (s.heatLabel) parts.push(`${s.heatLabel} heat`);
  return parts.join(" · ");
}

// Add-ons total — rentals & service only. Delivery is separate now, since it
// applies to the whole event (food + extras together) not just the rentals.
// Defensive: any missing field defaults to 0 so persisted state from older
// schemas doesn't poison the math with NaN.
export function rentalsTotal(rentals: Rentals, guests: number): number {
  const r = { ...EMPTY_RENTALS, ...rentals };
  let total = 0;
  if (r.water) total += RENTALS.water.perGuest * guests;
  if (r.disposables) total += RENTALS.disposables.perGuest * guests;
  if (r.crockery) total += RENTALS.crockery.perGuest * guests;
  total += r.tables * RENTALS.tableUnit.price;
  total += r.chairs * RENTALS.chairUnit.price;
  total += r.tableCloths * RENTALS.tableClothUnit.price;
  total += r.servers * RENTALS.serverUnit.price;
  return total;
}

// Delivery is event-wide. Returns 0 for "outer" because it's a "quote on call"
// — the caterer agrees the rate by phone, not pre-priced on the site.
export function deliveryCharge(rentals: Rentals): number {
  const zone =
    RENTALS.delivery[rentals.deliveryZone] ?? RENTALS.delivery.none;
  return zone.price;
}

// Single source of truth for the whole pricing model — used by the panel,
// the PDF, the image and the WhatsApp message so they never disagree.
export type PlateTotals = {
  perPlate: number;
  foodTotal: number;
  extrasTotal: number;
  deliveryTotal: number;
  subtotal: number;
  discount: number;
  taxable: number;
  gst: number;
  grandTotal: number;
  effectivePerPlate: number;
};

export function computePlateTotals(
  lines: PlateLine[],
  guests: number,
  rentals: Rentals,
  discountApplied: boolean,
): PlateTotals {
  const perPlate = platePricePerPlate(lines);
  const foodTotal = perPlate * guests;
  const extrasTotal = rentalsTotal(rentals, guests);
  const deliveryTotal = deliveryCharge(rentals);
  const subtotal = foodTotal + extrasTotal + deliveryTotal;
  const discount = discountApplied
    ? Math.round(subtotal * EXIT_DISCOUNT_RATE)
    : 0;
  const taxable = subtotal - discount;
  const gst = Math.round(taxable * GST_RATE);
  const grandTotal = taxable + gst;
  const effectivePerPlate = guests > 0 ? grandTotal / guests : 0;
  return {
    perPlate,
    foodTotal,
    extrasTotal,
    deliveryTotal,
    subtotal,
    discount,
    taxable,
    gst,
    grandTotal,
    effectivePerPlate,
  };
}

// Suggest number of servers based on guest count (1 per 25 guests, rounded up).
export function suggestedServers(guests: number): number {
  return Math.max(1, Math.ceil(guests / RENTALS.serverUnit.guestsPerServer));
}

export type RentalLine = { label: string; price: number; note?: string };

// Itemised breakdown of the rentals — used by the PDF, image, and on-screen summary.
export function rentalLines(rentals: Rentals, guests: number): RentalLine[] {
  const out: RentalLine[] = [];
  if (rentals.water) {
    out.push({
      label: RENTALS.water.label,
      price: RENTALS.water.perGuest * guests,
      note: `₹${RENTALS.water.perGuest}/guest × ${guests}`,
    });
  }
  if (rentals.disposables) {
    out.push({
      label: RENTALS.disposables.label,
      price: RENTALS.disposables.perGuest * guests,
      note: `₹${RENTALS.disposables.perGuest}/guest × ${guests}`,
    });
  }
  if (rentals.crockery) {
    out.push({
      label: RENTALS.crockery.label,
      price: RENTALS.crockery.perGuest * guests,
      note: `₹${RENTALS.crockery.perGuest}/guest × ${guests}`,
    });
  }
  if (rentals.tables > 0) {
    out.push({
      label: `${RENTALS.tableUnit.label} × ${rentals.tables}`,
      price: rentals.tables * RENTALS.tableUnit.price,
      note: `₹${RENTALS.tableUnit.price} each`,
    });
  }
  if (rentals.chairs > 0) {
    out.push({
      label: `${RENTALS.chairUnit.label} × ${rentals.chairs}`,
      price: rentals.chairs * RENTALS.chairUnit.price,
      note: `₹${RENTALS.chairUnit.price} each`,
    });
  }
  if (rentals.tableCloths > 0) {
    out.push({
      label: `${RENTALS.tableClothUnit.label} × ${rentals.tableCloths}`,
      price: rentals.tableCloths * RENTALS.tableClothUnit.price,
      note: `₹${RENTALS.tableClothUnit.price} each`,
    });
  }
  if (rentals.servers > 0) {
    out.push({
      label: `Server / waiter × ${rentals.servers}`,
      price: rentals.servers * RENTALS.serverUnit.price,
      note: `₹${RENTALS.serverUnit.price} per server`,
    });
  }
  return out;
}
