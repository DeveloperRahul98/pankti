"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Package, Check, Users2 } from "lucide-react";
import {
  usePlate,
  RENTALS,
  rentalsTotal,
  suggestedServers,
} from "@/lib/plate-store";
import { formatINR, cn } from "@/lib/utils";
import { InfoTip } from "@/components/shared/info-tip";

export function PlateExtras() {
  const rentals = usePlate((s) => s.rentals);
  const setRentals = usePlate((s) => s.setRentals);
  const guests = usePlate((s) => s.guests);

  const addOns = rentalsTotal(rentals, guests);
  const hasAny =
    rentals.water ||
    rentals.disposables ||
    rentals.crockery ||
    rentals.tables > 0 ||
    rentals.chairs > 0 ||
    rentals.tableCloths > 0 ||
    rentals.servers > 0 ||
    rentals.deliveryZone !== "none";

  const [open, setOpen] = useState(hasAny);

  type ServingKey = "disposables" | "crockery";
  const servingRows: {
    key: ServingKey;
    price: number;
    label: string;
    sub: string;
  }[] = [
    {
      key: "disposables",
      price: RENTALS.disposables.perGuest,
      label: RENTALS.disposables.label,
      sub: RENTALS.disposables.sub,
    },
    {
      key: "crockery",
      price: RENTALS.crockery.perGuest,
      label: RENTALS.crockery.label,
      sub: RENTALS.crockery.sub,
    },
  ];

  const suggested = suggestedServers(guests);

  return (
    <div className="border-t border-[var(--border)]">
      {/* Toggle button + InfoTip kept as siblings (not nested) — nesting a
          button inside a button is invalid HTML and triggers a Next.js
          hydration error. */}
      <div className="flex items-stretch">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex-1 flex items-center justify-between gap-2 pl-5 pr-2 py-2.5 text-xs"
        >
          <span className="inline-flex items-center gap-2 text-fg-muted min-w-0">
            <Package className="h-3 w-3 text-primary shrink-0" />
            <span className="truncate">Extras &amp; rentals</span>
            {addOns > 0 && (
              <span className="text-primary font-semibold tabular-nums shrink-0">
                +{formatINR(addOns)}
              </span>
            )}
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
            title="Service add-ons"
            label="About extras and rentals"
            size={12}
          >
            Need water, crockery, tables, chairs or delivery? Add them here and
            the total below will update automatically. Per-guest items scale
            with the guest count; tables and chairs are per unit.
          </InfoTip>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="extras-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-3 space-y-3.5">
              {/* Water */}
              <div>
                <div className="text-[10px] uppercase tracking-wider text-fg-subtle mb-1.5">
                  Drinking water
                </div>
                <button
                  type="button"
                  onClick={() => setRentals({ water: !rentals.water })}
                  className={cn(
                    "w-full min-h-[40px] flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left transition-colors active:scale-[.99]",
                    rentals.water
                      ? "border-primary bg-[color-mix(in_srgb,var(--primary)_12%,transparent)]"
                      : "border-[var(--border)] hover:border-[var(--border-strong)]",
                  )}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <span
                      className={cn(
                        "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                        rentals.water
                          ? "bg-primary border-primary"
                          : "border-[var(--border-strong)]",
                      )}
                    >
                      {rentals.water && (
                        <Check className="h-3 w-3 text-primary-fg" />
                      )}
                    </span>
                    <span className="text-xs text-fg truncate">
                      {RENTALS.water.label}
                    </span>
                  </span>
                  <span className="text-[11px] text-fg-muted tabular-nums shrink-0">
                    ₹{RENTALS.water.perGuest}/guest
                  </span>
                </button>
              </div>

              {/* Serving style — disposables vs steel crockery (mutually exclusive) */}
              <div>
                <div className="text-[10px] uppercase tracking-wider text-fg-subtle mb-1.5 flex items-center gap-1.5">
                  <span>Serving style</span>
                  <InfoTip
                    title="Disposables vs Steel crockery"
                    label="About serving styles"
                    size={11}
                  >
                    <strong className="text-fg">Disposables</strong> — paper /
                    plastic plates, cups and spoons. One-time use, quick
                    cleanup, lighter on the budget. Common for office lunches
                    and casual functions.
                    <br />
                    <br />
                    <strong className="text-fg">Reusable steel crockery</strong>{" "}
                    — stainless steel plates, glasses and serving spoons that
                    we bring to the venue, set up, and take back to wash. Looks
                    premium, no throwaway waste. Standard for weddings and
                    poojas.
                    <br />
                    <br />
                    Pick one — selecting the other clears the first.
                  </InfoTip>
                </div>
                <div className="space-y-1">
                  {servingRows.map((row) => {
                    const active = rentals[row.key];
                    return (
                      <button
                        key={row.key}
                        type="button"
                        onClick={() => setRentals({ [row.key]: !active })}
                        className={cn(
                          "w-full min-h-[44px] flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left transition-colors active:scale-[.99]",
                          active
                            ? "border-primary bg-[color-mix(in_srgb,var(--primary)_12%,transparent)]"
                            : "border-[var(--border)] hover:border-[var(--border-strong)]",
                        )}
                      >
                        <span className="flex items-center gap-2 min-w-0">
                          <span
                            className={cn(
                              "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                              active
                                ? "bg-primary border-primary"
                                : "border-[var(--border-strong)]",
                            )}
                          >
                            {active && (
                              <Check className="h-3 w-3 text-primary-fg" />
                            )}
                          </span>
                          <span className="min-w-0">
                            <span className="block text-xs text-fg truncate">
                              {row.label}
                            </span>
                            <span className="block text-[10px] text-fg-subtle truncate">
                              {row.sub}
                            </span>
                          </span>
                        </span>
                        <span className="text-[11px] text-fg-muted tabular-nums shrink-0">
                          ₹{row.price}/guest
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tables, chairs & cloths — vertical layout in each cell so
                  the input gets the full width and labels never truncate. */}
              <div>
                <div className="text-[10px] uppercase tracking-wider text-fg-subtle mb-1.5">
                  Furniture rental
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      {
                        key: "tables" as const,
                        label: "Tables",
                        price: RENTALS.tableUnit.price,
                      },
                      {
                        key: "chairs" as const,
                        label: "Chairs",
                        price: RENTALS.chairUnit.price,
                      },
                      {
                        key: "tableCloths" as const,
                        label: "Table Cloths",
                        price: RENTALS.tableClothUnit.price,
                      },
                    ]
                  ).map((row) => (
                    <label
                      key={row.key}
                      className="flex flex-col gap-1.5 rounded-lg border border-[var(--border)] px-2 py-2"
                    >
                      <span className="text-xs text-fg leading-tight">
                        {row.label}
                        <span className="block text-[10px] text-fg-subtle tabular-nums">
                          ₹{row.price} each
                        </span>
                      </span>
                      <input
                        type="number"
                        inputMode="numeric"
                        min={0}
                        value={rentals[row.key] || ""}
                        onChange={(e) =>
                          setRentals({
                            [row.key]: Number(e.target.value) || 0,
                          })
                        }
                        placeholder="0"
                        className="!w-full !text-center text-sm tabular-nums no-spinner !py-1.5"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Service staff */}
              <div>
                <div className="text-[10px] uppercase tracking-wider text-fg-subtle mb-1.5 inline-flex items-center gap-1">
                  <Users2 className="h-3 w-3" /> Service staff
                  <InfoTip
                    title="Servers / waiters"
                    label="About service staff"
                    size={11}
                  >
                    Trained servers who set up the buffet, serve food from
                    counters, refill items, clear plates, and pack down at the
                    end. We charge ₹{RENTALS.serverUnit.price} per server per
                    event. As a rule of thumb, plan for{" "}
                    <strong className="text-fg">
                      1 server per {RENTALS.serverUnit.guestsPerServer} guests
                    </strong>
                    .
                  </InfoTip>
                </div>
                <label className="min-h-[48px] flex items-center justify-between gap-2 rounded-lg border border-[var(--border)] px-3 py-2">
                  <span className="text-xs text-fg min-w-0">
                    Servers / waiters
                    <span className="block text-[10px] text-fg-subtle tabular-nums">
                      ₹{RENTALS.serverUnit.price} per server · suggested{" "}
                      <button
                        type="button"
                        onClick={() => setRentals({ servers: suggested })}
                        className="text-primary font-semibold hover:underline"
                      >
                        {suggested}
                      </button>{" "}
                      for {guests} guests
                    </span>
                  </span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={rentals.servers || ""}
                    onChange={(e) =>
                      setRentals({ servers: Number(e.target.value) || 0 })
                    }
                    placeholder="0"
                    className="!py-1.5 !w-14 !text-right text-sm tabular-nums"
                  />
                </label>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
