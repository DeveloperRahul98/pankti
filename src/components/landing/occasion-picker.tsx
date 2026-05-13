"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { OCCASIONS } from "@/data/occasions";
import { ArrowUpRight } from "lucide-react";

export function OccasionPicker() {
  return (
    <section className="mx-auto max-w-7xl px-5 lg:px-8 py-14 sm:py-20 md:py-28">
      <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-primary mb-3">
            Step one
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl tracking-tight">
            What&apos;s the occasion?
          </h2>
          <p className="mt-3 max-w-xl text-fg-muted">
            Tell us the function and we&apos;ll suggest a curated plate as your
            starting point. You can customise everything from there.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {OCCASIONS.map((o, i) => (
          <motion.div
            key={o.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.07 }}
          >
            <Link
              href={`/menu?occasion=${o.id}`}
              className="group lift relative block h-full rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-6 overflow-hidden"
            >
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/10 blur-2xl group-hover:bg-primary/20 transition-colors" />
              <div className="relative">
                <div className="text-4xl mb-4">{o.emoji}</div>
                <h3 className="font-display text-2xl">{o.label}</h3>
                <p className="mt-2 text-sm text-fg-muted leading-relaxed">
                  {o.description}
                </p>
                <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  Start here
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
