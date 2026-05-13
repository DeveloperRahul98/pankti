"use client";
import { useEffect, useRef, useState } from "react";
import { Leaf, Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type Filters = {
  veg: "all" | "veg" | "nonveg";
  jain: boolean;
  cuisine: "all" | "south" | "north";
  search: string;
  maxPrice: number; // 0 = no cap
};

export function MenuFilters({
  filters,
  setFilters,
}: {
  filters: Filters;
  setFilters: (f: Filters) => void;
}) {
  return (
    <div className="sticky top-[68px] z-30 -mx-5 lg:mx-0 px-5 lg:px-0 py-2.5 bg-[var(--bg)]/90 backdrop-blur-md border-b border-[var(--border)]">
      <div className="flex flex-wrap items-center gap-2">
        {/* Search — full row on mobile, compact on desktop */}
        <div className="relative basis-full lg:basis-auto lg:w-56 shrink-0">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-fg-subtle pointer-events-none" />
          <input
            type="search"
            placeholder="Search dishes..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="!py-1.5 !pl-8 !pr-2.5 !text-xs"
          />
        </div>
        <div className="contents">

        {/* Veg / Non-veg */}
        <SegmentedGroup
          options={[
            { v: "all", label: "All" },
            { v: "veg", label: "Veg" },
            { v: "nonveg", label: "Non-veg" },
          ]}
          value={filters.veg}
          onChange={(v) => setFilters({ ...filters, veg: v as Filters["veg"] })}
        />

        {/* Cuisine */}
        <SegmentedGroup
          options={[
            { v: "all", label: "All" },
            { v: "south", label: "South" },
            { v: "north", label: "North" },
          ]}
          value={filters.cuisine}
          onChange={(v) =>
            setFilters({ ...filters, cuisine: v as Filters["cuisine"] })
          }
        />

        {/* Jain */}
        <button
          type="button"
          onClick={() => setFilters({ ...filters, jain: !filters.jain })}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border transition-colors",
            filters.jain
              ? "bg-[var(--accent)] text-white border-transparent"
              : "bg-[var(--bg-elev)] border-[var(--border-strong)] text-fg-muted hover:text-fg",
          )}
        >
          <Leaf className="h-3 w-3" />
          Jain
        </button>

        {/* Price popover */}
        <PricePopover
          value={filters.maxPrice}
          onChange={(maxPrice) => setFilters({ ...filters, maxPrice })}
        />
        </div>
      </div>
    </div>
  );
}

function SegmentedGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { v: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex rounded-full bg-[var(--bg-elev)] border border-[var(--border-strong)] p-0.5">
      {options.map((o) => (
        <button
          key={o.v}
          type="button"
          onClick={() => onChange(o.v)}
          className={cn(
            "px-3 py-1 text-xs font-semibold rounded-full transition-colors",
            value === o.v
              ? "bg-primary text-primary-fg"
              : "text-fg-muted hover:text-fg",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function PricePopover({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isFiltered = value > 0;

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border transition-colors",
          isFiltered
            ? "bg-primary/15 border-primary/40 text-primary"
            : "bg-[var(--bg-elev)] border-[var(--border-strong)] text-fg-muted hover:text-fg",
        )}
      >
        <SlidersHorizontal className="h-3 w-3" />
        Price · {isFiltered ? `≤ ₹${value}` : "Any"}
        {isFiltered && (
          <X
            className="h-3 w-3 ml-0.5 hover:opacity-70"
            onClick={(e) => {
              e.stopPropagation();
              onChange(0);
            }}
          />
        )}
      </button>

      {open && (
        <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 w-64 max-w-[calc(100vw-2.5rem)] rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-elev)] p-4 shadow-xl shadow-black/30 z-20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-wider text-fg-subtle">
              Max price per item
            </span>
            <span className="text-xs font-semibold text-primary tabular-nums">
              {value === 0 ? "Any" : `₹${value}`}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={250}
            step={10}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full accent-[var(--primary)] !p-0 !bg-transparent !border-0"
          />
          <div className="mt-1.5 flex justify-between text-[10px] text-fg-subtle tabular-nums">
            <span>Any</span>
            <span>₹50</span>
            <span>₹150</span>
            <span>₹250</span>
          </div>
          <div className="mt-3 grid grid-cols-4 gap-1.5">
            {[0, 50, 100, 200].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => onChange(v)}
                className={cn(
                  "py-1 rounded-full text-[10px] font-semibold transition-colors border",
                  value === v
                    ? "bg-primary text-primary-fg border-transparent"
                    : "border-[var(--border)] text-fg-muted hover:text-fg hover:border-primary/40",
                )}
              >
                {v === 0 ? "Any" : `≤₹${v}`}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
