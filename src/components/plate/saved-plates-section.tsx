"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Bookmark, Trash2, ArrowRight, Tag, Calendar, X } from "lucide-react";
import {
  useSavedPlates,
  WEDDING_EVENTS,
  type SavedPlate,
  type WeddingEventId,
} from "@/lib/saved-plates";
import { usePlate } from "@/lib/plate-store";
import { formatINR, cn } from "@/lib/utils";
import { getMenuItem } from "@/data/menu";
import { toast } from "sonner";
import { WeddingPlanner } from "@/components/plate/wedding-planner";

function plateSubtotal(p: SavedPlate) {
  return p.lines.reduce((s, l) => s + (getMenuItem(l.itemId)?.price ?? 0) * l.qty, 0);
}

export function SavedPlatesSection() {
  const router = useRouter();
  const plates = useSavedPlates((s) => s.plates);
  const remove = useSavedPlates((s) => s.remove);
  const setEventMeta = useSavedPlates((s) => s.setEventMeta);
  const loadFromEncoded = usePlate((s) => s.loadFromEncoded);
  const [mounted, setMounted] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  useEffect(() => setMounted(true), []);

  if (!mounted || plates.length === 0) return null;

  const onLoad = (p: SavedPlate) => {
    loadFromEncoded(p.lines, p.guests);
    toast.success(`Loaded "${p.name}"`);
    router.push("/menu");
  };

  return (
    <>
      {/* Wedding bundle planner appears when ≥ 2 plates have event tags */}
      <WeddingPlanner />

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
            <p className="mt-2 text-sm text-fg-muted max-w-md">
              Planning a wedding? Tag each plate with the event (sangeet,
              haldi, reception…) and we&apos;ll bundle them into one enquiry
              for the whole celebration.
            </p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {plates.map((p, i) => {
            const subtotal = plateSubtotal(p);
            const eventLabel = p.eventType
              ? WEDDING_EVENTS.find((e) => e.id === p.eventType)?.label
              : null;
            const isEditing = editingId === p.id;
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
                <div className="font-display text-xl pr-7 truncate">
                  {p.name}
                </div>
                <div className="text-xs text-fg-subtle mt-1 tabular-nums">
                  {p.lines.length} dishes · {p.guests} guests
                </div>

                {/* Event-type chip + edit affordance */}
                {!isEditing && (
                  <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                    {eventLabel ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[color-mix(in_srgb,var(--primary)_14%,transparent)] text-primary px-2 py-0.5 text-[10px] font-semibold">
                        <Tag className="h-2.5 w-2.5" />
                        {eventLabel}
                      </span>
                    ) : null}
                    {p.eventDate ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[var(--bg)] text-fg-muted px-2 py-0.5 text-[10px] tabular-nums">
                        <Calendar className="h-2.5 w-2.5" />
                        {new Date(p.eventDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => setEditingId(p.id)}
                      className="text-[10px] text-fg-subtle hover:text-primary font-semibold underline-offset-2 hover:underline"
                    >
                      {eventLabel ? "Edit event" : "+ Tag for wedding bundle"}
                    </button>
                  </div>
                )}

                {/* Inline edit form */}
                {isEditing && (
                  <div className="mt-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] p-2.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider text-fg-subtle">
                        Tag for wedding bundle
                      </span>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="text-fg-subtle hover:text-fg"
                        aria-label="Close"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {WEDDING_EVENTS.map((evt) => {
                        const active = p.eventType === evt.id;
                        return (
                          <button
                            key={evt.id}
                            type="button"
                            onClick={() =>
                              setEventMeta(p.id, {
                                eventType: active
                                  ? null
                                  : (evt.id as WeddingEventId),
                              })
                            }
                            className={cn(
                              "rounded-md border px-2 py-1 text-[10.5px] font-medium transition-colors",
                              active
                                ? "border-primary bg-[color-mix(in_srgb,var(--primary)_16%,transparent)] text-primary"
                                : "border-[var(--border)] text-fg-muted hover:border-[var(--border-strong)]",
                            )}
                          >
                            {evt.label}
                          </button>
                        );
                      })}
                    </div>
                    <label className="flex items-center gap-2 text-[11px] text-fg-muted">
                      <Calendar className="h-3 w-3 text-primary" />
                      <span className="shrink-0">Date</span>
                      <input
                        type="date"
                        value={p.eventDate ?? ""}
                        onChange={(e) =>
                          setEventMeta(p.id, {
                            eventDate: e.target.value || null,
                          })
                        }
                        className="!py-1 !px-2 flex-1 min-w-0 text-xs"
                      />
                    </label>
                  </div>
                )}

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
    </>
  );
}
