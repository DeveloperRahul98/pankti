"use client";
import { FoodImage } from "@/components/shared/food-image";
import { GALLERY } from "@/data/gallery";
import { sceneImage } from "@/lib/utils";
import { useLightbox } from "@/lib/lightbox-store";
import { Expand } from "lucide-react";

const aspectClass = {
  tall: "row-span-2",
  wide: "col-span-2",
  square: "",
} as const;

export function GalleryGrid() {
  const openAt = useLightbox((s) => s.openAt);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[140px] md:auto-rows-[200px]">
      {GALLERY.map((g, i) => (
        <button
          type="button"
          key={g.id}
          onClick={() => openAt(GALLERY, i)}
          aria-label={`Open ${g.caption}`}
          className={`group relative overflow-hidden rounded-2xl border border-[var(--border)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${aspectClass[g.aspect]}`}
        >
          <FoodImage
            src={sceneImage(g.id)}
            alt={g.caption}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
          />
          <figcaption className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/30 to-transparent text-left">
            <div className="text-xs md:text-sm text-white font-medium">
              {g.caption}
            </div>
          </figcaption>
          <span className="absolute top-2.5 right-2.5 h-8 w-8 inline-flex items-center justify-center rounded-full bg-black/55 backdrop-blur text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <Expand className="h-3.5 w-3.5" />
          </span>
        </button>
      ))}
    </div>
  );
}
