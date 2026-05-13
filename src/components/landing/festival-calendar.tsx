"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, ArrowRight } from "lucide-react";
import { FESTIVALS } from "@/data/festivals";

function daysUntil(iso: string) {
  return Math.round(
    (new Date(iso).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
}

export function FestivalCalendar() {
  const upcoming = FESTIVALS.filter((f) => daysUntil(f.date) >= -1)
    .sort((a, b) => +new Date(a.date) - +new Date(b.date))
    .slice(0, 4);
  if (!upcoming.length) return null;

  return (
    <section className="mx-auto max-w-6xl px-5 lg:px-8 py-20 md:py-24">
      <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-primary mb-3">
            Around the year
          </div>
          <h2 className="font-display text-4xl md:text-5xl tracking-tight">
            Festival calendar
          </h2>
          <p className="mt-3 text-fg-muted max-w-xl">
            We theme our menu around the season. Plan early for these dates.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {upcoming.map((f, i) => {
          const d = daysUntil(f.date);
          const date = new Date(f.date);
          return (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
            >
              <Link
                href={
                  f.suggestedPlateId
                    ? `/signature-plates#${f.suggestedPlateId}`
                    : "/menu"
                }
                className="group lift block rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-5 h-full"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-fg-subtle">
                    <CalendarDays className="h-3.5 w-3.5 text-primary" />
                    {date.toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-primary">
                    {d <= 0 ? "Now" : `in ${d}d`}
                  </span>
                </div>
                <div className="mt-3 font-display text-2xl">{f.name}</div>
                <div className="mt-1.5 text-sm text-fg-muted leading-snug">
                  {f.menu}
                </div>
                <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                  Plan a plate
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
