"use client";
import { motion } from "framer-motion";
import { Sparkles, UtensilsCrossed, Send } from "lucide-react";
import { OrnamentalDivider } from "@/components/shared/ornamental-divider";

const STEPS = [
  {
    icon: Sparkles,
    title: "Pick the occasion",
    description:
      "Tell us if it's a wedding, pooja, birthday or office event — we tailor suggestions.",
  },
  {
    icon: UtensilsCrossed,
    title: "Build your plate",
    description:
      "Hand-pick dishes course by course. See the per-plate price update live.",
  },
  {
    icon: Send,
    title: "Send the enquiry",
    description:
      "We confirm availability, lock the date, and prepare the feast on your day.",
  },
];

export function HowItWorks() {
  return (
    <section className="relative">
      <div className="absolute inset-x-0 top-0 divider-saffron" />
      <div className="mx-auto max-w-7xl px-5 lg:px-8 py-14 sm:py-20 md:py-28">
        <div className="text-center max-w-2xl mx-auto">
          <OrnamentalDivider className="mb-5" />
          <div className="text-xs uppercase tracking-[0.18em] text-primary mb-3">
            How it works
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl tracking-tight">
            Three steps to your feast
          </h2>
        </div>

        <div className="mt-10 sm:mt-14 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 relative">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative glass-card lift p-7"
            >
              <div className="font-display text-7xl text-primary/15 absolute top-3 right-5 leading-none">
                {i + 1}
              </div>
              <div className="relative">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/12 text-primary mb-5">
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-2xl">{s.title}</h3>
                <p className="mt-2 text-sm text-fg-muted leading-relaxed">
                  {s.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
