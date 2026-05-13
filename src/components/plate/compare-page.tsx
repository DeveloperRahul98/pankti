import { Suspense } from "react";
import { ComparePlatesView } from "@/components/plate/compare-plates-view";

export function ComparePage() {
  return (
    <div className="mx-auto max-w-6xl px-5 lg:px-8 py-10 md:py-14">
      <div className="mb-8">
        <div className="text-xs uppercase tracking-[0.18em] text-primary mb-3">
          Side-by-side
        </div>
        <h1 className="font-display text-4xl md:text-5xl tracking-tight">
          Compare plates
        </h1>
        <p className="mt-3 text-fg-muted max-w-xl">
          Pick any two of your saved plates to see them next to each other —
          handy when you&apos;re torn between two ideas.
        </p>
      </div>
      <Suspense fallback={null}>
        <ComparePlatesView />
      </Suspense>
    </div>
  );
}
