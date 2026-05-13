import { FoodImage } from "@/components/shared/food-image";
import Link from "next/link";
import { SIGNATURE_PLATES } from "@/data/signature-plates";
import { getMenuItem } from "@/data/menu";
import { sceneImage, formatINR } from "@/lib/utils";
import { ArrowRight, Check } from "lucide-react";
import { LoadPlateButton } from "@/components/plate/load-plate-button";

function basePrice(itemIds: string[]) {
  return itemIds.reduce((s, id) => s + (getMenuItem(id)?.price ?? 0), 0);
}

export function SignaturePlatesPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 lg:px-8 py-12 md:py-16">
      <div className="mb-10">
        <div className="text-xs uppercase tracking-[0.18em] text-primary mb-3">
          Curated by us
        </div>
        <h1 className="font-display text-5xl md:text-6xl tracking-tight">
          Signature plates
        </h1>
        <p className="mt-3 max-w-2xl text-fg-muted">
          Four plates we&apos;ve perfected through hundreds of functions. Load
          any of them and customise on the menu page.
        </p>
      </div>

      <div className="space-y-20">
        {SIGNATURE_PLATES.map((p) => (
          <section key={p.id} id={p.id} className="scroll-mt-24">
            <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-start">
              <div className="relative aspect-[4/5] md:aspect-[4/5] rounded-3xl overflow-hidden border border-[var(--border)]">
                <FoodImage
                  src={sceneImage(p.image)}
                  alt={p.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                {p.highlight && (
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-full bg-primary text-primary-fg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
                    Most loved
                  </div>
                )}
              </div>

              <div>
                <div className="text-xs uppercase tracking-wider text-fg-subtle">
                  {p.occasion}
                </div>
                <h2 className="font-display text-4xl md:text-5xl mt-1 tracking-tight">
                  {p.name}
                </h2>
                <p className="mt-2 text-primary font-display text-xl italic">
                  {p.tagline}
                </p>
                <p className="mt-4 text-fg-muted leading-relaxed">
                  {p.description}
                </p>

                <ul className="mt-6 grid grid-cols-1 gap-1.5">
                  {p.itemIds.map((id) => {
                    const item = getMenuItem(id);
                    if (!item) return null;
                    return (
                      <li
                        key={id}
                        className="flex items-center gap-2.5 text-sm"
                      >
                        <Check className="h-4 w-4 text-primary shrink-0" />
                        <span>{item.name}</span>
                        <span className="ml-auto text-fg-subtle text-xs tabular-nums">
                          {formatINR(item.price)}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-6 flex items-end justify-between pb-2 border-b border-[var(--border)]">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-fg-subtle">
                      Starts at
                    </div>
                    <div className="font-display text-3xl text-primary tabular-nums">
                      {formatINR(basePrice(p.itemIds))}
                    </div>
                  </div>
                  <div className="text-xs text-fg-subtle">per plate</div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  <LoadPlateButton itemIds={p.itemIds} plateName={p.name} />
                  <Link
                    href="/menu"
                    className="btn-ghost inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
                  >
                    Browse menu
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
