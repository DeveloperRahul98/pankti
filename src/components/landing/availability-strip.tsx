"use client";
import { motion } from "framer-motion";
import { CalendarCheck, Clock } from "lucide-react";

export function AvailabilityStrip() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6 }}
      className="mx-auto max-w-7xl px-5 lg:px-8 -mt-10 md:-mt-14 relative z-10"
    >
      <div className="glass-card flex flex-col sm:flex-row items-stretch divide-y sm:divide-y-0 sm:divide-x divide-[var(--border)] overflow-hidden">
        <Cell
          icon={<CalendarCheck className="h-4 w-4 text-primary" />}
          k="Next 2 weekends"
          v="Fully booked"
          dot="amber"
        />
        <Cell
          icon={<CalendarCheck className="h-4 w-4 text-primary" />}
          k="Open from"
          v="Mid-June onwards"
          dot="green"
        />
        <Cell
          icon={<Clock className="h-4 w-4 text-primary" />}
          k="We reply within"
          v="under an hour"
          dot="green"
        />
        <Cell
          icon={<CalendarCheck className="h-4 w-4 text-primary" />}
          k="Wedding dates 2026"
          v="Filling — book early"
          dot="amber"
        />
      </div>
    </motion.div>
  );
}

function Cell({
  icon,
  k,
  v,
  dot,
}: {
  icon: React.ReactNode;
  k: string;
  v: string;
  dot: "green" | "amber";
}) {
  return (
    <div className="flex-1 px-5 py-4 flex items-center gap-3">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/12">
        {icon}
      </span>
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
          {k}
        </div>
        <div className="flex items-center gap-1.5 text-sm font-semibold">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              dot === "green" ? "bg-[var(--success)]" : "bg-primary"
            } animate-pulse`}
          />
          {v}
        </div>
      </div>
    </div>
  );
}
