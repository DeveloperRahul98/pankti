"use client";
import { FoodImage } from "@/components/shared/food-image";
import Link from "next/link";
import { motion } from "framer-motion";
import { SIGNATURE_PLATES } from "@/data/signature-plates";
import { getMenuItem } from "@/data/menu";
import { sceneImage, formatINR } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

function plateBasePrice(itemIds: string[]) {
  return itemIds.reduce((sum, id) => sum + (getMenuItem(id)?.price ?? 0), 0);
}

export function SignaturePlatesSection() {
  return (
    <section className="mx-auto max-w-7xl px-5 lg:px-8 py-14 sm:py-20 md:py-28">
      <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-primary mb-3">
            Curated by us
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl tracking-tight">
            Signature plates
          </h2>
          <p className="mt-3 max-w-xl text-fg-muted">
            Four plates we&apos;ve perfected through hundreds of functions. Pick
            one as-is, or tweak it to taste.
          </p>
        </div>
        <Link
          href="/signature-plates"
          className="btn-ghost inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
        >
          View all
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {SIGNATURE_PLATES.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: i * 0.06 }}
          >
            <Link
              href={`/signature-plates#${p.id}`}
              className="group lift block relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg-elev)] aspect-[4/3] md:aspect-[16/10]"
            >
              <FoodImage
                src={sceneImage(p.image)}
                alt={p.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

              {p.highlight && (
                <div className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-full bg-primary text-primary-fg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
                  Most loved
                </div>
              )}

              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <div className="text-xs uppercase tracking-wider text-white/70 mb-1.5">
                  {p.occasion}
                </div>
                <h3 className="font-display text-3xl">{p.name}</h3>
                <p className="mt-1 text-sm text-white/80 line-clamp-2">
                  {p.tagline}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-white/60">from</span>{" "}
                    <span className="font-display text-xl text-primary">
                      {formatINR(plateBasePrice(p.itemIds))}
                    </span>
                    <span className="text-white/60"> / plate</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm text-primary font-semibold">
                    Customise
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
