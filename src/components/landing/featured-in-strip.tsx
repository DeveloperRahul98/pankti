"use client";
import { motion } from "framer-motion";
import { FEATURED_IN, AWARDS } from "@/data/featured-in";
import { Award } from "lucide-react";

export function FeaturedInStrip() {
  return (
    <section className="border-y border-[var(--border)] bg-[var(--bg-elev)]/40">
      <div className="mx-auto max-w-7xl px-5 lg:px-8 py-10">
        <div className="text-center text-[10px] uppercase tracking-[0.3em] text-fg-subtle">
          Featured in
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {FEATURED_IN.map((p, i) => (
            <motion.span
              key={p.name}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="font-display text-lg md:text-xl text-fg-muted opacity-80 hover:opacity-100 hover:text-fg transition-opacity"
            >
              {p.name}
              {p.year && (
                <span className="ml-1.5 text-[10px] uppercase tracking-wider text-fg-subtle align-middle">
                  &apos;{String(p.year).slice(2)}
                </span>
              )}
            </motion.span>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
          {AWARDS.map((a) => (
            <div
              key={a.label}
              className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3"
            >
              <Award className="h-5 w-5 text-primary shrink-0" />
              <div className="min-w-0">
                <div className="text-sm font-semibold">{a.label}</div>
                <div className="text-xs text-fg-subtle truncate">{a.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
