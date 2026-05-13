"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { SITE } from "@/lib/site";
import { MessageCircle, ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="mx-auto max-w-7xl px-5 lg:px-8 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="relative overflow-hidden rounded-3xl border border-[var(--border-strong)] bg-[var(--bg-elev)] p-10 md:p-16 text-center"
      >
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[var(--accent)]/15 blur-3xl" />

        <div className="relative">
          <h2 className="font-display text-4xl md:text-6xl tracking-tight">
            Ready to plan your <span className="text-primary italic">feast</span>?
          </h2>
          <p className="mt-5 max-w-xl mx-auto text-fg-muted text-lg">
            Build a plate in minutes, or just send us a quick WhatsApp. We
            usually reply within the hour.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-fg px-6 py-3.5 text-base font-semibold hover:bg-[var(--primary-hover)] transition-colors"
            >
              Start building
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={`https://wa.me/${SITE.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-base font-semibold"
            >
              <MessageCircle className="h-4 w-4" />
              Message on WhatsApp
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
