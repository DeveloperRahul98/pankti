"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Truck } from "lucide-react";
import { usePlate, RENTALS, type DeliveryZone } from "@/lib/plate-store";
import { formatINR, cn } from "@/lib/utils";
import { InfoTip } from "@/components/shared/info-tip";

const ZONES: DeliveryZone[] = ["none", "city", "outer"];

const SHORT_LABEL: Record<DeliveryZone, string> = {
  none: "Pick up",
  city: "Within Hyderabad",
  outer: "Outer Hyderabad",
};

// Delivery is event-wide (food + rentals together) — every event has to
// answer "where is this going?" so this picker lives at the same level as
// the totals, not buried inside "Extras". Collapsed by default so it doesn't
// dominate the panel; the header chip shows the current choice at a glance.
export function DeliveryPicker() {
  const rentals = usePlate((s) => s.rentals);
  const setRentals = usePlate((s) => s.setRentals);
  const [open, setOpen] = useState(false);

  const currentZone = rentals.deliveryZone;
  const currentChip =
    currentZone === "outer"
      ? "On call"
      : currentZone === "none"
        ? "Free"
        : formatINR(RENTALS.delivery[currentZone].price);

  return (
    <div className="border-t border-[var(--border)]">
      {/* Toggle button + InfoTip kept as siblings — nesting a <button>
          inside a <button> is invalid HTML (triggers a hydration error). */}
      <div className="flex items-stretch">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex-1 flex items-center justify-between gap-2 pl-5 pr-2 py-2.5 text-xs"
        >
          <span className="inline-flex items-center gap-2 text-fg-muted min-w-0">
            <Truck className="h-3 w-3 text-primary shrink-0" />
            <span className="shrink-0">Delivery</span>
            <span className="text-primary font-semibold truncate">
              {SHORT_LABEL[currentZone]}
            </span>
            <span className="text-fg-subtle tabular-nums shrink-0">
              · {currentChip}
            </span>
          </span>
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 text-fg-subtle transition-transform shrink-0",
              open && "rotate-180",
            )}
          />
        </button>
        <div className="flex items-center pr-4">
          <InfoTip
            title="Delivery & setup"
            label="About delivery"
            size={11}
          >
            One charge for the whole event — we drive the food (and any rented
            tables, chairs or crockery) out to your venue and set up. The
            amount depends on distance, not on what&apos;s in the truck. Pick
            up from our kitchen yourself to save the fee.
          </InfoTip>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="delivery-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-3 space-y-1">
              {ZONES.map((zone) => {
                const d = RENTALS.delivery[zone];
                const active = rentals.deliveryZone === zone;
                return (
                  <button
                    key={zone}
                    type="button"
                    onClick={() => {
                      setRentals({ deliveryZone: zone });
                      setOpen(false);
                    }}
                    className={cn(
                      "w-full min-h-[40px] flex items-center justify-between gap-2 rounded-lg border px-3 py-1.5 text-left transition-colors active:scale-[.99]",
                      active
                        ? "border-primary bg-[color-mix(in_srgb,var(--primary)_12%,transparent)]"
                        : "border-[var(--border)] hover:border-[var(--border-strong)]",
                    )}
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <span
                        className={cn(
                          "inline-flex h-3.5 w-3.5 shrink-0 rounded-full border-2",
                          active
                            ? "border-primary bg-primary"
                            : "border-[var(--border-strong)]",
                        )}
                      />
                      <span className="text-xs text-fg truncate">
                        {d.label}
                      </span>
                    </span>
                    <span className="text-[11px] text-fg-muted tabular-nums shrink-0">
                      {zone === "outer"
                        ? "On call"
                        : zone === "none"
                          ? "Free"
                          : formatINR(d.price)}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
