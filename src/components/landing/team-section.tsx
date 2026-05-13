"use client";
import { motion } from "framer-motion";
import { TEAM } from "@/data/team";
import { OrnamentalDivider } from "@/components/shared/ornamental-divider";

// Initials avatars (no photos shipped). Premium look without needing real headshots.
function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
  return (
    <div className="relative h-16 w-16 rounded-full bg-gradient-to-br from-primary to-[var(--primary-hover)] text-primary-fg font-display text-xl flex items-center justify-center shrink-0">
      <span>{initials}</span>
      <span className="absolute -inset-0.5 rounded-full border border-primary/40" />
    </div>
  );
}

export function TeamSection() {
  return (
    <section className="mx-auto max-w-6xl px-5 lg:px-8 py-20 md:py-24">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <OrnamentalDivider className="mb-5" />
        <div className="text-xs uppercase tracking-[0.18em] text-primary mb-3">
          The hands on the stove
        </div>
        <h2 className="font-display text-4xl md:text-5xl tracking-tight">
          People you&apos;ll meet
        </h2>
        <p className="mt-3 text-fg-muted">
          A small team, all in one kitchen. We&apos;ve cooked together for years.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {TEAM.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.07 }}
            className="glass-card lift p-6 flex gap-5"
          >
            <Avatar name={m.name} />
            <div className="min-w-0">
              <div className="font-display text-xl">{m.name}</div>
              <div className="text-xs text-fg-subtle uppercase tracking-wider mt-0.5">
                {m.role} · {m.yearsWithPankti} yrs
              </div>
              <p className="mt-3 text-sm text-fg-muted leading-relaxed italic">
                &ldquo;{m.quote}&rdquo;
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
