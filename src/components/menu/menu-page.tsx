import { Suspense } from "react";
import { MenuGrid } from "@/components/menu/menu-grid";
import { PlatePanel } from "@/components/plate/plate-panel";
import { PlateBarMobile } from "@/components/plate/plate-bar-mobile";

export function MenuPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 lg:px-8 py-10">
      <header className="mb-8">
        <div className="text-xs uppercase tracking-[0.18em] text-primary mb-3">
          Build your plate
        </div>
        <h1 className="font-display text-5xl md:text-6xl tracking-tight">
          The menu
        </h1>
        <p className="mt-3 max-w-xl text-fg-muted">
          Tap <span className="text-primary font-semibold">Add</span> on any
          dish — your plate fills up on the right, with a live per-plate price.
        </p>
      </header>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8 lg:gap-10 items-start">
        <Suspense
          fallback={
            <div className="py-24 text-center text-fg-muted">Loading menu…</div>
          }
        >
          <MenuGrid />
        </Suspense>

        <div className="hidden lg:block sticky top-[88px] self-start">
          <PlatePanel />
        </div>
      </div>

      <PlateBarMobile />
    </div>
  );
}
