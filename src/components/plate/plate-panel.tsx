"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, Users, Send, Bookmark, Wallet, AlertCircle, CheckCircle2, BadgeCheck } from "lucide-react";
import { useEffect, useState } from "react";
import {
  usePlate,
  getPlateItems,
  computePlateTotals,
  computeDietarySummary,
  MARKET_REFERENCE,
  GST_RATE,
  EXIT_DISCOUNT_RATE,
} from "@/lib/plate-store";
import { OCCASIONS } from "@/data/occasions";
import { formatINR, cn } from "@/lib/utils";
import { InfoTip } from "@/components/shared/info-tip";
import { EnquiryDialog } from "@/components/plate/enquiry-dialog";
import { PlateBalanceMeter } from "@/components/plate/plate-balance-meter";
import { AutoSuggest } from "@/components/plate/auto-suggest";
import { PlateExtras } from "@/components/plate/plate-extras";
import { DeliveryPicker } from "@/components/plate/delivery-picker";
import { DietaryBadge } from "@/components/plate/dietary-badge";
import { useSavedPlates } from "@/lib/saved-plates";
import { toast } from "sonner";
import { EmptyThali } from "@/components/plate/empty-thali";

export function PlatePanel({ className }: { className?: string }) {
  const lines = usePlate((s) => s.lines);
  const guests = usePlate((s) => s.guests);
  const setGuests = usePlate((s) => s.setGuests);
  const setQty = usePlate((s) => s.setQty);
  const clear = usePlate((s) => s.clear);
  const budget = usePlate((s) => s.budgetPerPlate);
  const setBudget = usePlate((s) => s.setBudgetPerPlate);
  const rentals = usePlate((s) => s.rentals);
  const occasionId = usePlate((s) => s.occasionId);
  const discountApplied = usePlate((s) => s.discountApplied);
  const items = getPlateItems(lines);
  const dietary = computeDietarySummary(lines);
  const t = computePlateTotals(lines, guests, rentals, discountApplied);
  const {
    perPlate,
    foodTotal,
    extrasTotal,
    deliveryTotal,
    subtotal,
    discount,
    gst,
    grandTotal,
    effectivePerPlate,
  } = t;
  const hasExtras = extrasTotal > 0 || deliveryTotal > 0 || discountApplied;
  const [enquireOpen, setEnquireOpen] = useState(false);

  // Listen for external "open enquiry" signals (e.g. the exit-intent dialog
  // asks us to pop the enquiry form after applying the loyalty discount).
  useEffect(() => {
    const handler = () => setEnquireOpen(true);
    window.addEventListener("pankti:open-enquiry", handler);
    return () => window.removeEventListener("pankti:open-enquiry", handler);
  }, []);

  // Budget tracks the *effective* per-plate when extras/delivery exist (so the
  // customer is comparing against the real cost they'll pay) and food per-plate
  // otherwise.
  const budgetTarget = hasExtras ? effectivePerPlate : perPlate;
  const budgetStatus: "none" | "under" | "near" | "over" =
    budget === null || perPlate === 0
      ? "none"
      : budgetTarget <= budget
        ? "under"
        : budgetTarget <= budget * 1.1
          ? "near"
          : "over";

  // When over budget, find the priciest item to drop as a one-tap suggestion.
  const overBy =
    budget && budgetTarget > budget ? Math.round(budgetTarget - budget) : 0;
  const dropSuggestion =
    budgetStatus === "over" && items.length > 0
      ? [...items].sort((a, b) => b.item.price * b.qty - a.item.price * a.qty)[0]
      : null;

  // Market-reference anchor — shows "Hyderabad weddings: ₹500-800/plate" so
  // the customer can see they're getting value.
  const occLookup =
    OCCASIONS.find((o) => o.id === occasionId)?.id ?? "default";
  const marketRef =
    MARKET_REFERENCE[occLookup] ?? MARKET_REFERENCE.default;
  const showMarketHint = items.length > 0 && effectivePerPlate > 0;
  const isGoodValue =
    showMarketHint && effectivePerPlate < marketRef.low;
  const isInRange =
    showMarketHint &&
    effectivePerPlate >= marketRef.low &&
    effectivePerPlate <= marketRef.high;

  const save = useSavedPlates((s) => s.save);
  const [savingName, setSavingName] = useState<string | null>(null);

  const onQuickSave = () => {
    const name = savingName ?? `Plate · ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`;
    save(name, lines, guests);
    toast.success("Saved", {
      description: "Find it on the homepage.",
    });
  };

  return (
    <aside
      className={cn(
        // On desktop the panel is a sticky sidebar — cap its height so it
        // scrolls internally. On mobile it lives inside the bottom-sheet
        // (which is the scroll surface) — let it grow naturally so we don't
        // end up with two nested scroll areas fighting each other.
        "flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] lg:max-h-[calc(100vh-104px)]",
        className,
      )}
    >
      {/* Header — one tight row to maximise space for the items below */}
      <div className="flex items-center justify-between gap-2 px-4 py-2 border-b border-[var(--border)] shrink-0">
        <div className="min-w-0 flex items-baseline gap-2">
          <div className="font-display text-base leading-none">Your plate</div>
          <div className="text-[11px] text-fg-subtle tabular-nums truncate">
            {items.length} {items.length === 1 ? "item" : "items"} ·{" "}
            {items.reduce((a, i) => a + i.qty, 0)} servings
          </div>
        </div>
        {items.length > 0 && (
          <div className="flex items-center gap-0.5 shrink-0">
            <button
              type="button"
              onClick={onQuickSave}
              title="Save this plate"
              className="inline-flex items-center justify-center h-7 w-7 rounded-full text-fg-subtle hover:text-primary hover:bg-[var(--bg)]"
              aria-label="Save plate"
            >
              <Bookmark className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={clear}
              title="Clear plate"
              className="inline-flex items-center justify-center h-7 w-7 rounded-full text-fg-subtle hover:text-[var(--danger)] hover:bg-[var(--bg)]"
              aria-label="Clear plate"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Compact balance meter */}
      <div className="shrink-0">
        <PlateBalanceMeter items={items} />
      </div>

      {/* Dietary summary — veg/non-veg/Jain/heat at a glance */}
      <div className="shrink-0">
        <DietaryBadge summary={dietary} />
      </div>

      {/* Scroll area: items + chef suggestion + preferences + extras share
          a single scroll container so the totals/CTA below always stay locked
          at the bottom of the panel — on desktop. On mobile the bottom sheet
          is the scroll surface, so we drop the internal overflow there. */}
      <div className="flex-1 min-h-0 lg:overflow-y-auto lg:scrollbar-thin">
        <div className="px-2 py-1.5">
          {items.length === 0 ? (
            <EmptyThali />
          ) : (
            <AnimatePresence initial={false}>
              {items.map(({ item, qty }) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg hover:bg-[var(--bg)]"
                >
                  <div className="min-w-0 flex-1">
                    <div
                      className="text-sm font-medium truncate"
                      title={item.name}
                    >
                      {item.name}
                    </div>
                    <div className="text-[11px] text-fg-subtle tabular-nums">
                      {formatINR(item.price)} × {qty}
                    </div>
                  </div>
                  <div className="inline-flex items-center rounded-full bg-[var(--bg)] border border-[var(--border-strong)]">
                    <button
                      type="button"
                      onClick={() => setQty(item.id, qty - 1)}
                      className="h-6 w-6 inline-flex items-center justify-center text-fg-muted hover:text-primary"
                      aria-label="Decrease"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-xs font-bold w-4 text-center tabular-nums">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQty(item.id, qty + 1)}
                      className="h-6 w-6 inline-flex items-center justify-center text-fg-muted hover:text-primary"
                      aria-label="Increase"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="text-xs font-semibold tabular-nums w-14 text-right shrink-0">
                    {formatINR(item.price * qty)}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Chef suggestion — compact single line */}
        <AutoSuggest />

        {/* Extras & rentals — collapsed by default */}
        {items.length > 0 && <PlateExtras />}

        {/* Delivery & setup — own section, always visible when there's a plate */}
        {items.length > 0 && <DeliveryPicker />}
      </div>

      {/* Totals + CTA — always visible at the bottom */}
      <div className="px-4 py-2.5 border-t border-[var(--border)] space-y-2 shrink-0">
        {/* Guests + Budget — two compact rows; inputs flex into the cell so
            long numbers (4-5 digits) are always fully visible. */}
        <div className="grid grid-cols-2 gap-2">
          <label className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-2.5 py-1.5">
            <span className="inline-flex items-center gap-1 text-xs text-fg-muted shrink-0">
              <Users className="h-3.5 w-3.5 text-primary" />
              Guests
            </span>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value) || 1)}
              className="!py-0.5 !px-0 flex-1 min-w-0 !text-right text-sm tabular-nums no-spinner !border-0 !bg-transparent"
            />
          </label>
          <label className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-2.5 py-1.5">
            <span className="inline-flex items-center gap-1 text-xs text-fg-muted shrink-0">
              <Wallet className="h-3.5 w-3.5 text-primary" />
              Budget
              <InfoTip title="Plan within your budget" label="About the budget feature" size={11}>
                Set a per-plate target (e.g. ₹400). The{" "}
                <span className="text-fg font-semibold">Effective</span> per
                plate below — food + extras + delivery + GST, divided by
                guests — turns{" "}
                <span className="text-[var(--success)] font-semibold">green</span>{" "}
                when you&apos;re under,{" "}
                <span className="text-primary font-semibold">saffron</span>{" "}
                when within 10% over,{" "}
                <span className="text-[var(--danger)] font-semibold">red</span>{" "}
                when over — with a one-tap suggestion of which dish to drop.
                Leave blank to skip.
              </InfoTip>
            </span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              placeholder="₹"
              value={budget ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                setBudget(v === "" ? null : Number(v));
              }}
              className="!py-0.5 !px-0 flex-1 min-w-0 !text-right text-sm tabular-nums no-spinner !border-0 !bg-transparent"
            />
          </label>
        </div>

        {/* Budget status hint */}
        <AnimatePresence initial={false}>
          {budgetStatus !== "none" && (
            <motion.div
              key={budgetStatus}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className={cn(
                "flex items-start gap-2 rounded-lg px-2.5 py-2 text-[11px] leading-snug",
                budgetStatus === "under" &&
                  "bg-[color-mix(in_srgb,var(--success)_18%,transparent)] text-[var(--success)]",
                budgetStatus === "near" &&
                  "bg-[color-mix(in_srgb,var(--primary)_18%,transparent)] text-primary",
                budgetStatus === "over" &&
                  "bg-[color-mix(in_srgb,var(--danger)_18%,transparent)] text-[var(--danger)]",
              )}
            >
              {budgetStatus === "under" ? (
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                {budgetStatus === "under" && (
                  <span>
                    On budget — ₹{Math.max(0, Math.round((budget ?? 0) - budgetTarget))} of headroom per plate{" "}
                    <span className="opacity-70">
                      ({hasExtras ? "all-in" : "food only"})
                    </span>
                    .
                  </span>
                )}
                {budgetStatus === "near" && (
                  <span>
                    Just over by {formatINR(overBy)} / plate — within 10%, easy to trim.
                  </span>
                )}
                {budgetStatus === "over" && dropSuggestion && (
                  <div className="flex items-center justify-between gap-2">
                    <span>
                      Over by {formatINR(overBy)} / plate. Drop{" "}
                      <span className="font-semibold">{dropSuggestion.item.name}</span>{" "}
                      to save{" "}
                      {formatINR(dropSuggestion.item.price * dropSuggestion.qty)}.
                    </span>
                    <button
                      type="button"
                      onClick={() => setQty(dropSuggestion.item.id, 0)}
                      className="shrink-0 rounded-full border border-current/40 px-2 py-0.5 text-[10px] font-semibold hover:bg-current/10"
                    >
                      Drop
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ledger — itemised breakdown, only when there's a plate */}
        {items.length > 0 && (
          <div className="rounded-lg bg-[var(--bg)] border border-[var(--border)] px-2.5 py-2 space-y-1 text-[11px] leading-tight">
            <Row
              label={`Food (₹${formatINR(perPlate).replace("₹", "")} × ${guests})`}
              value={formatINR(foodTotal)}
            />
            {extrasTotal > 0 && (
              <Row label="Extras & rentals" value={formatINR(extrasTotal)} />
            )}
            {deliveryTotal > 0 && (
              <Row label="Delivery & setup" value={formatINR(deliveryTotal)} />
            )}
            {rentals.deliveryZone === "outer" && (
              <Row label="Delivery (outer)" value="On call" muted />
            )}
            {discountApplied && discount > 0 && (
              <Row
                label={`Loyalty discount (${Math.round(EXIT_DISCOUNT_RATE * 100)}%)`}
                value={`− ${formatINR(discount)}`}
                accent="success"
              />
            )}
            <Row
              label={`GST (${Math.round(GST_RATE * 100)}%) on ${formatINR(subtotal - discount)}`}
              value={formatINR(gst)}
              muted
              tip="Government tax on catering — included in the final amount."
            />
            <div className="border-t border-[var(--border)] my-1" />
            {/* Grand total + effective per plate side by side */}
            <div className="flex items-end justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[9px] uppercase tracking-wider text-fg-subtle">
                  Effective / plate
                </div>
                <div
                  className={cn(
                    "font-semibold tabular-nums text-sm leading-tight",
                    budgetStatus === "under" && "text-[var(--success)]",
                    budgetStatus === "near" && "text-primary",
                    budgetStatus === "over" && "text-[var(--danger)]",
                    budgetStatus === "none" && "text-fg",
                  )}
                >
                  {formatINR(Math.round(effectivePerPlate))}
                  {budget !== null && (
                    <span className="text-[9px] text-fg-subtle font-normal ml-1">
                      / {formatINR(budget)}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[9px] uppercase tracking-wider text-fg-subtle">
                  Estimated total
                </div>
                <div className="font-display text-xl text-primary tabular-nums leading-none mt-0.5">
                  {formatINR(grandTotal)}
                </div>
              </div>
            </div>
            {/* Market reference */}
            {showMarketHint && (isGoodValue || isInRange) && (
              <div
                className={cn(
                  "mt-1.5 flex items-center gap-1 rounded-md px-1.5 py-1 text-[10px] leading-snug",
                  isGoodValue
                    ? "bg-[color-mix(in_srgb,var(--success)_14%,transparent)] text-[var(--success)]"
                    : "text-fg-subtle",
                )}
              >
                {isGoodValue && <BadgeCheck className="h-3 w-3 shrink-0" />}
                <span className="truncate">
                  {isGoodValue && <strong>Great value · </strong>}
                  Hyderabad {marketRef.label}: ₹{marketRef.low}–₹
                  {marketRef.high}/plate.
                </span>
              </div>
            )}
          </div>
        )}

        <button
          type="button"
          disabled={items.length === 0}
          onClick={() => setEnquireOpen(true)}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-fg py-2 text-sm font-semibold hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send className="h-3.5 w-3.5" />
          Send enquiry
        </button>
      </div>

      <EnquiryDialog open={enquireOpen} onOpenChange={setEnquireOpen} />
    </aside>
  );
}

// Small row helper for the ledger card — keeps each line aligned, with
// optional muted styling, success accent, or an info tooltip on the label.
function Row({
  label,
  value,
  muted,
  accent,
  tip,
}: {
  label: string;
  value: string;
  muted?: boolean;
  accent?: "success";
  tip?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2 tabular-nums">
      <span
        className={cn(
          "inline-flex items-center gap-1",
          muted ? "text-fg-muted" : "text-fg",
          accent === "success" && "text-[var(--success)]",
        )}
      >
        {label}
        {tip && (
          <InfoTip label={label} size={10}>
            {tip}
          </InfoTip>
        )}
      </span>
      <span
        className={cn(
          "font-semibold",
          muted ? "text-fg-muted" : "text-fg",
          accent === "success" && "text-[var(--success)]",
        )}
      >
        {value}
      </span>
    </div>
  );
}
