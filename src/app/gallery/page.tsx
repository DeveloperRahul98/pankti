import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { pageMeta } from "@/lib/page-meta";

export const metadata = pageMeta({
  title: "Gallery",
  description:
    "Photos from past Pankti events — weddings, poojas, corporate buffets and sweet counters across Hyderabad.",
  path: "/gallery",
});

export default function GalleryPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 lg:px-8 py-12 md:py-16">
      <div className="mb-10">
        <div className="text-xs uppercase tracking-[0.18em] text-primary mb-3">
          From our kitchen
        </div>
        <h1 className="font-display text-5xl md:text-6xl tracking-tight">
          Recent feasts
        </h1>
        <p className="mt-3 max-w-xl text-fg-muted">
          A glimpse of the plates we&apos;ve set down at weddings, poojas and
          parties across the city. Click any image to view large.
        </p>
      </div>
      <GalleryGrid />
    </div>
  );
}
