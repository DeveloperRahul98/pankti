"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { sceneImage } from "@/lib/utils";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { HeroGreeting } from "@/components/shared/greeting";
import { SaffronParticles } from "@/components/shared/saffron-particles";

const STATS = [
  { k: 50, suffix: "+", v: "Functions served" },
  { k: 34, suffix: "+", v: "Dishes on menu" },
  { k: 4.9, suffix: "", v: "Guest rating", decimal: true },
  { k: 5, suffix: " yrs", v: "In the kitchen" },
] as const;

export function Hero() {
  return (
    <section className="relative overflow-hidden hero-glow">
      <div
        className="absolute inset-0 -z-10 opacity-90 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(14,14,15,0.82) 0%, rgba(14,14,15,0.55) 45%, var(--bg) 100%), url(${sceneImage("hero")})`,
        }}
      />

      <SaffronParticles count={14} />

      {/* ornamental saffron rings, top-right */}
      <svg
        className="absolute -top-10 -right-10 md:right-10 md:top-10 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 opacity-[0.07] text-primary pointer-events-none"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        aria-hidden="true"
      >
        <circle cx="50" cy="50" r="48" />
        <circle cx="50" cy="50" r="36" />
        <circle cx="50" cy="50" r="24" />
        <circle cx="50" cy="50" r="12" />
      </svg>

      <div className="mx-auto max-w-7xl px-5 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-16 md:pt-16 md:pb-20 relative">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex flex-wrap items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--bg-elev)]/70 backdrop-blur px-3 py-1.5 text-xs font-medium tracking-wide text-fg-muted max-w-full"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <HeroGreeting />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 font-display text-[2.25rem] leading-[1.02] sm:text-5xl md:text-6xl lg:text-7xl lg:leading-[0.98] tracking-tight max-w-4xl"
        >
          A plate, made
          <br />
          for{" "}
          <span className="relative inline-block">
            <span className="text-primary italic relative z-10">
              your moment
            </span>
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -bottom-1 left-0 right-0 h-[5px] bg-primary/30 origin-left"
              style={{ borderRadius: 4 }}
            />
          </span>
          .
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-4 sm:mt-5 max-w-2xl text-sm sm:text-base md:text-lg text-fg-muted leading-relaxed"
        >
          Hand-pick from authentic South & North Indian dishes. Build the exact
          plate your guests will remember — we&apos;ll serve it on the day.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-6 sm:mt-7 flex flex-wrap items-center gap-2.5"
        >
          <Link
            href="/menu"
            className="group relative overflow-hidden inline-flex items-center gap-2 rounded-full bg-primary text-primary-fg px-5 sm:px-6 py-3 text-sm sm:text-base font-semibold hover:bg-[var(--primary-hover)] transition-colors"
          >
            <span className="relative z-10 inline-flex items-center gap-2">
              Build your plate
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
            <span className="absolute inset-0 bg-white/15 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </Link>
          <Link
            href="/signature-plates"
            className="btn-ghost inline-flex items-center gap-2 rounded-full px-5 sm:px-6 py-3 text-sm sm:text-base font-semibold"
          >
            See signature plates
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-8 sm:mt-10 grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-5 sm:gap-6 max-w-3xl"
        >
          {STATS.map((s) => (
            <div key={s.v}>
              <div className="font-display text-3xl sm:text-4xl text-primary leading-none">
                {"decimal" in s && s.decimal ? (
                  s.k.toFixed(1)
                ) : (
                  <AnimatedCounter value={s.k} suffix={s.suffix} />
                )}
                {"decimal" in s && s.decimal ? s.suffix : null}
              </div>
              <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-fg-subtle mt-2">
                {s.v}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
