"use client";
import { FoodImage } from "@/components/shared/food-image";
import { motion } from "framer-motion";
import { Plus, Minus, Flame, Leaf } from "lucide-react";
import { dishImage, formatINR, cn } from "@/lib/utils";
import type { MenuItem } from "@/data/menu";
import { usePlate } from "@/lib/plate-store";
import { DishGlossaryTip } from "@/components/menu/dish-glossary-tip";

function SpiceMeter({ level }: { level: 0 | 1 | 2 | 3 }) {
  if (!level) return null;
  return (
    <span className="inline-flex items-center gap-0.5 text-[10px] text-fg-subtle">
      {Array.from({ length: 3 }).map((_, i) => (
        <Flame
          key={i}
          className={cn(
            "h-3 w-3",
            i < level ? "text-primary" : "text-fg-subtle/40",
          )}
        />
      ))}
    </span>
  );
}

export function MenuItemCard({ item }: { item: MenuItem }) {
  const qty = usePlate(
    (s) => s.lines.find((l) => l.itemId === item.id)?.qty ?? 0,
  );
  const add = usePlate((s) => s.add);
  const setQty = usePlate((s) => s.setQty);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className="group lift shine relative flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <FoodImage
          src={dishImage(item.id)}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute top-2.5 left-2.5 flex gap-1.5">
          <span
            className={cn(
              "inline-flex h-5 w-5 items-center justify-center rounded-sm border-2",
              item.veg
                ? "border-[#3a9d4a] bg-white/95"
                : "border-[#c0392b] bg-white/95",
            )}
            aria-label={item.veg ? "Vegetarian" : "Non-vegetarian"}
          >
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                item.veg ? "bg-[#3a9d4a]" : "bg-[#c0392b]",
              )}
            />
          </span>
          {item.jainSafe && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--accent)]/85 text-white text-[10px] font-semibold px-2 py-0.5">
              <Leaf className="h-2.5 w-2.5" />
              Jain
            </span>
          )}
        </div>
        <div className="absolute top-2.5 right-2.5">
          <DishGlossaryTip dishId={item.id} />
        </div>
      </div>

      <div className="flex flex-col flex-1 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg leading-tight">{item.name}</h3>
          <div className="text-right shrink-0">
            <div className="font-semibold text-primary tabular-nums">
              {formatINR(item.price)}
            </div>
            <div className="text-[10px] text-fg-subtle">per plate</div>
          </div>
        </div>
        <p className="mt-1.5 text-sm text-fg-muted leading-snug line-clamp-2 flex-1">
          {item.description}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <SpiceMeter level={item.spice ?? 0} />
          {qty === 0 ? (
            <button
              type="button"
              onClick={() => add(item.id)}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-fg px-3.5 py-1.5 text-sm font-semibold hover:bg-[var(--primary-hover)] transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Add
            </button>
          ) : (
            <div className="inline-flex items-center gap-1 rounded-full bg-primary text-primary-fg overflow-hidden">
              <button
                type="button"
                onClick={() => setQty(item.id, qty - 1)}
                className="h-8 w-8 inline-flex items-center justify-center hover:bg-[var(--primary-hover)]"
                aria-label="Decrease"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="text-sm font-bold w-5 text-center tabular-nums">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty(item.id, qty + 1)}
                className="h-8 w-8 inline-flex items-center justify-center hover:bg-[var(--primary-hover)]"
                aria-label="Increase"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
