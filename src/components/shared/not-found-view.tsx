import Link from "next/link";
import { ArrowRight, Home, UtensilsCrossed } from "lucide-react";

export function NotFoundView() {
  return (
    <div className="mx-auto max-w-3xl px-5 lg:px-8 py-24 md:py-32 text-center">
      <div className="font-display text-7xl md:text-9xl text-primary/30 leading-none">
        404
      </div>
      <h1 className="mt-2 font-display text-4xl md:text-5xl tracking-tight">
        This plate&apos;s empty.
      </h1>
      <p className="mt-4 text-fg-muted max-w-md mx-auto">
        We couldn&apos;t find what you were looking for. The page may have
        moved, or the link might be off — head back and start fresh.
      </p>
      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-fg px-5 py-3 text-sm font-semibold hover:bg-[var(--primary-hover)] transition-colors"
        >
          <Home className="h-4 w-4" />
          Home
        </Link>
        <Link
          href="/menu"
          className="btn-ghost inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold"
        >
          <UtensilsCrossed className="h-4 w-4" />
          Build a plate
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
