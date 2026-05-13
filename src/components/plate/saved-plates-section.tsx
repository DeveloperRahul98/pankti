"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Bookmark, Trash2, ArrowRight } from "lucide-react";
import { useSavedPlates, type SavedPlate } from "@/lib/saved-plates";
import { usePlate } from "@/lib/plate-store";
import { formatINR } from "@/lib/utils";
import { getMenuItem } from "@/data/menu";
import { toast } from "sonner";

function plateSubtotal(p: SavedPlate) {
  return p.lines.reduce((s, l) => s + (getMenuItem(l.itemId)?.price ?? 0) * l.qty, 0);
}

export function SavedPlatesSection() {
  const router = useRouter();
  const plates = useSavedPlates((s) => s.plates);
  const remove = useSavedPlates((s) => s.remove);
  const loadFromEncoded = usePlate((s) => s.loadFromEncoded);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || plates.length === 0) return null;

  const onLoad = (p: SavedPlate) => {
    loadFromEncoded(p.lines, p.guests);
    toast.success(`Loaded "${p.name}"`);
    router.push("/menu");
  };

  return (
    <section className="mx-auto max-w-7xl px-5 lg:px-8 pt-20">
      <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-primary mb-3 inline-flex items-center gap-1.5">
            <Bookmark className="h-3.5 w-3.5" />
            Your saved plates
          </div>
          <h2 className="font-display text-3xl md:text-4xl tracking-tight">
            Pick up where you left off
          </h2>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {plates.map((p, i) => {
          const subtotal = plateSubtotal(p);
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group lift relative rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-5"
            >
              <button
                type="button"
                onClick={() => {
                  remove(p.id);
                  toast("Removed");
                }}
                className="absolute top-3 right-3 h-7 w-7 inline-flex items-center justify-center rounded-full text-fg-subtle hover:text-[var(--danger)] hover:bg-[var(--bg)]"
                aria-label="Remove"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              <div className="font-display text-xl pr-7 truncate">{p.name}</div>
              <div className="text-xs text-fg-subtle mt-1 tabular-nums">
                {p.lines.length} dishes · {p.guests} guests
              </div>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
                    Per plate
                  </div>
                  <div className="font-display text-2xl text-primary tabular-nums">
                    {formatINR(subtotal)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onLoad(p)}
                  className="inline-flex items-center gap-1 rounded-full bg-primary text-primary-fg px-3.5 py-1.5 text-xs font-bold hover:bg-[var(--primary-hover)] transition-colors"
                >
                  Open
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
