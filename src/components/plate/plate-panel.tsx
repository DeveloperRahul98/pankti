"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, Users, Send, Bookmark } from "lucide-react";
import { useState } from "react";
import { usePlate, getPlateItems, platePricePerPlate } from "@/lib/plate-store";
import { formatINR, cn } from "@/lib/utils";
import { EnquiryDialog } from "@/components/plate/enquiry-dialog";
import { PlateBalanceMeter } from "@/components/plate/plate-balance-meter";
import { AutoSuggest } from "@/components/plate/auto-suggest";
import { PlatePreferences } from "@/components/plate/plate-preferences";
import { useSavedPlates } from "@/lib/saved-plates";
import { toast } from "sonner";
import { EmptyThali } from "@/components/plate/empty-thali";

export function PlatePanel({ className }: { className?: string }) {
  const lines = usePlate((s) => s.lines);
  const guests = usePlate((s) => s.guests);
  const setGuests = usePlate((s) => s.setGuests);
  const setQty = usePlate((s) => s.setQty);
  const clear = usePlate((s) => s.clear);
  const items = getPlateItems(lines);
  const perPlate = platePricePerPlate(lines);
  const total = perPlate * guests;
  const [enquireOpen, setEnquireOpen] = useState(false);

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
        "flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] max-h-[calc(100vh-104px)]",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)] shrink-0">
        <div>
          <div className="font-display text-lg leading-tight">Your plate</div>
          <div className="text-[11px] text-fg-muted">
            {items.length} {items.length === 1 ? "item" : "items"} ·{" "}
            {items.reduce((a, i) => a + i.qty, 0)} servings
          </div>
        </div>
        {items.length > 0 && (
          <div className="flex items-center gap-1">
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

      {/* Items list — gets the bulk of the height */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin px-2 py-1.5">
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
      <div className="shrink-0">
        <AutoSuggest />
      </div>

      {/* Preferences — collapsed by default */}
      {items.length > 0 && (
        <div className="shrink-0">
          <PlatePreferences />
        </div>
      )}

      {/* Totals + CTA — always visible */}
      <div className="px-5 py-3 border-t border-[var(--border)] space-y-2 shrink-0">
        <label className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 text-xs text-fg-muted">
            <Users className="h-3.5 w-3.5 text-primary" />
            Guests
          </span>
          <input
            type="number"
            min={1}
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value) || 1)}
            className="!py-1 !w-20 !text-right text-xs tabular-nums"
          />
        </label>

        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[var(--border)]">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
              Per plate
            </div>
            <div className="font-semibold tabular-nums mt-0.5">
              {formatINR(perPlate)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
              Total
            </div>
            <div className="font-display text-2xl text-primary tabular-nums leading-none mt-1">
              {formatINR(total)}
            </div>
          </div>
        </div>

        <button
          type="button"
          disabled={items.length === 0}
          onClick={() => setEnquireOpen(true)}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-fg py-2.5 text-sm font-semibold hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-1"
        >
          <Send className="h-4 w-4" />
          Send enquiry
        </button>
      </div>

      <EnquiryDialog open={enquireOpen} onOpenChange={setEnquireOpen} />
    </aside>
  );
}
