"use client";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export function FounderNote() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7 }}
      className="relative mt-20 mx-auto max-w-3xl"
    >
      <div className="glass-card relative overflow-hidden p-8 md:p-12">
        <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-primary/12 blur-3xl" />
        <Quote className="h-9 w-9 text-primary/40 mb-5" />
        <p className="font-display text-2xl md:text-3xl leading-snug text-fg">
          My grandmother said the difference between food and a feast is the
          number of people you make happy with it. I&apos;ve never forgotten that.
          Every plate we send out is for someone&apos;s most important day —
          we treat it that way.
        </p>
        <div className="mt-8 flex items-end justify-between flex-wrap gap-4">
          <div>
            {/* Hand-written-style signature */}
            <svg
              width="140"
              height="56"
              viewBox="0 0 140 56"
              className="text-primary"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 38 C 14 18, 24 8, 30 18 C 32 24, 26 32, 22 34 C 28 30, 38 28, 42 36 C 44 40, 38 44, 36 40 C 38 32, 48 28, 54 32" />
              <path d="M58 24 C 64 18, 72 22, 70 30 C 68 36, 62 36, 62 30 C 64 22, 74 18, 82 26" />
              <path d="M88 22 C 92 28, 92 36, 98 36 C 104 34, 108 26, 112 30 C 114 34, 122 26, 130 30" />
              <path d="M28 50 L 100 50" opacity="0.3" />
            </svg>
            <div className="mt-2 font-display text-base">Rahul</div>
            <div className="text-xs text-fg-subtle uppercase tracking-wider">
              Founder · Pankti
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
