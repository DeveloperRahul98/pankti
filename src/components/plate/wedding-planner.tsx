"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Calendar, Users, Sparkles } from "lucide-react";
import {
  useSavedPlates,
  WEDDING_EVENTS,
  sortPlatesForBundle,
  type SavedPlate,
} from "@/lib/saved-plates";
import { encodePlate } from "@/lib/plate-encode";
import { getMenuItem } from "@/data/menu";
import { formatINR } from "@/lib/utils";
import { SITE_URL } from "@/lib/site";
import { WhatsAppPreview } from "@/components/shared/whatsapp-preview";

function plateSubtotal(p: SavedPlate) {
  return p.lines.reduce(
    (s, l) => s + (getMenuItem(l.itemId)?.price ?? 0) * l.qty,
    0,
  );
}

// Multi-event wedding bundle — only appears once the user has tagged ≥ 2
// saved plates with an event type. Shows the full bill across all events
// and packages them into a single WhatsApp message for the caterer.
export function WeddingPlanner() {
  const plates = useSavedPlates((s) => s.plates);
  const [mounted, setMounted] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewText, setPreviewText] = useState("");
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const tagged = plates.filter((p) => p.eventType);
  if (tagged.length < 2) return null;

  const sorted = sortPlatesForBundle(tagged);
  const bundleTotal = sorted.reduce(
    (acc, p) => acc + plateSubtotal(p) * p.guests,
    0,
  );
  const totalGuests = sorted.reduce((acc, p) => acc + p.guests, 0);
  const eventCount = sorted.length;

  const buildBundleMessage = () => {
    const origin =
      typeof window !== "undefined" ? window.location.origin : SITE_URL;
    const lines: string[] = [
      `Hi Pankti, I'd like a *wedding bundle quote* covering ${eventCount} events:`,
      "",
    ];
    for (const p of sorted) {
      const evt =
        WEDDING_EVENTS.find((e) => e.id === p.eventType)?.label ?? "Event";
      const date = p.eventDate
        ? new Date(p.eventDate).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "date TBC";
      const perPlate = plateSubtotal(p);
      const total = perPlate * p.guests;
      const link = `${origin}/plate/${encodePlate(p.lines, p.guests)}`;
      lines.push(
        `• *${evt}* (${date}) — ${p.guests} guests, ${formatINR(total)} est.`,
      );
      lines.push(`  ${link}`);
    }
    lines.push("");
    lines.push(
      `*Combined estimate:* ${formatINR(bundleTotal)} for ${totalGuests} total guests across ${eventCount} events.`,
    );
    lines.push("");
    lines.push("Please call me back to discuss.");
    return lines.join("\n");
  };

  const onSendBundle = () => {
    setPreviewText(buildBundleMessage());
    setPreviewOpen(true);
  };

  return (
    <section className="mx-auto max-w-7xl px-5 lg:px-8 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5 }}
        className="rounded-3xl border border-primary/30 bg-[color-mix(in_srgb,var(--primary)_6%,transparent)] overflow-hidden"
      >
        <div className="grid lg:grid-cols-[1fr_320px] gap-0">
          {/* Left: event list */}
          <div className="p-6 md:p-8">
            <div className="text-xs uppercase tracking-[0.18em] text-primary mb-3 inline-flex items-center gap-1.5">
              <Heart className="h-3.5 w-3.5" />
              Wedding bundle
            </div>
            <h2 className="font-display text-3xl md:text-4xl tracking-tight">
              Plan the whole celebration at once
            </h2>
            <p className="mt-2 text-sm text-fg-muted max-w-md">
              You&apos;ve tagged{" "}
              <span className="text-fg font-semibold">{eventCount} events</span>{" "}
              for this wedding. Send them as a single quote — we&apos;ll come
              back to you with one combined plan, not five separate calls.
            </p>

            <div className="mt-6 space-y-2.5">
              {sorted.map((p) => {
                const evt = WEDDING_EVENTS.find((e) => e.id === p.eventType);
                const perPlate = plateSubtotal(p);
                const total = perPlate * p.guests;
                return (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 rounded-xl bg-[var(--bg-elev)] border border-[var(--border)] px-4 py-3"
                  >
                    <div className="h-9 w-9 shrink-0 rounded-full bg-[color-mix(in_srgb,var(--primary)_16%,transparent)] text-primary inline-flex items-center justify-center">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-sm truncate">
                        {evt?.label ?? "Event"}{" "}
                        <span className="text-fg-subtle font-normal">
                          · {p.name}
                        </span>
                      </div>
                      <div className="text-[11px] text-fg-muted tabular-nums flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                        {p.eventDate && (
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-2.5 w-2.5" />
                            {new Date(p.eventDate).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1">
                          <Users className="h-2.5 w-2.5" />
                          {p.guests} guests
                        </span>
                        <span>·</span>
                        <span>{p.lines.length} dishes</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
                        Estimated
                      </div>
                      <div className="font-display text-base text-primary tabular-nums leading-tight">
                        {formatINR(total)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: combined total + send CTA */}
          <div className="bg-[var(--bg)] border-t lg:border-t-0 lg:border-l border-[var(--border)] p-6 md:p-8 flex flex-col justify-between gap-6">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
                Combined estimate
              </div>
              <div className="font-display text-4xl md:text-5xl text-primary tabular-nums leading-none mt-2">
                {formatINR(bundleTotal)}
              </div>
              <div className="mt-2 text-xs text-fg-muted tabular-nums">
                {totalGuests} guests across {eventCount} events
              </div>
              <ul className="mt-5 space-y-1.5 text-[11px] text-fg-muted">
                <li className="flex items-start gap-1.5">
                  <span className="text-primary">✓</span>
                  <span>One quote, one call-back, one team</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-primary">✓</span>
                  <span>Bundle discount on multi-event bookings</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-primary">✓</span>
                  <span>Coordinated menus across days</span>
                </li>
              </ul>
            </div>
            <button
              type="button"
              onClick={onSendBundle}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-fg px-5 py-3 text-sm font-bold hover:bg-[var(--primary-hover)] transition-colors active:scale-[.99]"
            >
              <MessageCircle className="h-4 w-4" />
              Send full bundle on WhatsApp
            </button>
            <p className="text-[10px] text-fg-subtle text-center -mt-3">
              You&apos;ll see a preview of the WhatsApp message before
              anything is sent.
            </p>
          </div>
        </div>
      </motion.div>

      <WhatsAppPreview
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        message={previewText}
        title="Pankti Catering"
      />
    </section>
  );
}
