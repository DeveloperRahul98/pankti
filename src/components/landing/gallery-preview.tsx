"use client";
import { FoodImage } from "@/components/shared/food-image";
import Link from "next/link";
import { motion } from "framer-motion";
import { GALLERY } from "@/data/gallery";
import { sceneImage } from "@/lib/utils";
import { ArrowRight, Expand } from "lucide-react";
import { useLightbox } from "@/lib/lightbox-store";

const aspectMap = {
  tall: "row-span-2",
  wide: "col-span-2",
  square: "",
} as const;

export function GalleryPreview() {
  const openAt = useLightbox((s) => s.openAt);

  return (
    <section className="mx-auto max-w-7xl px-5 lg:px-8 py-14 sm:py-20 md:py-28">
      <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-primary mb-3">
            From our kitchen
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl tracking-tight">
            Recent feasts
          </h2>
        </div>
        <Link
          href="/gallery"
          className="btn-ghost inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
        >
          See gallery
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4 auto-rows-[140px] sm:auto-rows-[160px] md:auto-rows-[200px]">
        {GALLERY.slice(0, 6).map((g, i) => (
          <motion.button
            type="button"
            key={g.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.04 }}
            onClick={() => openAt(GALLERY, i)}
            aria-label={`Open ${g.caption}`}
            className={`group relative overflow-hidden rounded-xl border border-[var(--border)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${aspectMap[g.aspect]}`}
          >
            <FoodImage
              src={sceneImage(g.id)}
              alt={g.caption}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
              <div className="p-3 text-white text-xs font-medium text-left flex-1">
                {g.caption}
              </div>
              <span className="m-2.5 h-7 w-7 inline-flex items-center justify-center rounded-full bg-white/15 backdrop-blur text-white shrink-0">
                <Expand className="h-3.5 w-3.5" />
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
