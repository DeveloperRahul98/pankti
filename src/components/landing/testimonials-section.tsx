"use client";
import { motion } from "framer-motion";
import { TESTIMONIALS } from "@/data/testimonials";
import { Quote, Star } from "lucide-react";
import { OrnamentalDivider } from "@/components/shared/ornamental-divider";

export function TestimonialsSection() {
  return (
    <section className="mx-auto max-w-7xl px-5 lg:px-8 py-14 sm:py-20 md:py-28">
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
        <OrnamentalDivider className="mb-5" />
        <div className="text-xs uppercase tracking-[0.18em] text-primary mb-3">
          Kind words
        </div>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl tracking-tight">
          The people we&apos;ve fed
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {TESTIMONIALS.map((t, i) => (
          <motion.figure
            key={t.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.07 }}
            className="relative glass-card lift p-7 md:p-8"
          >
            <Quote className="h-7 w-7 text-primary/40 mb-4" />
            <blockquote className="font-display text-xl md:text-2xl leading-snug text-fg">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-6 flex items-center justify-between">
              <div>
                <div className="font-semibold">{t.name}</div>
                <div className="text-sm text-fg-muted">{t.occasion}</div>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, k) => (
                  <Star
                    key={k}
                    className="h-4 w-4 text-primary fill-current"
                  />
                ))}
              </div>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
