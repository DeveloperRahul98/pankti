import { FoodImage } from "@/components/shared/food-image";
import Link from "next/link";
import { sceneImage } from "@/lib/utils";
import { ArrowRight, Flame, Leaf, Sparkles, Heart } from "lucide-react";
import { TeamSection } from "@/components/landing/team-section";
import { FounderNote } from "@/components/about/founder-note";

const VALUES = [
  {
    icon: Flame,
    title: "Cooked, not assembled",
    body: "Every dish is fired the same morning. No reheated trays, no day-old curries — that's our rule.",
  },
  {
    icon: Leaf,
    title: "Sourced with care",
    body: "Daily-market vegetables, dairy from a single farm, spices ground in-house. You can taste the difference.",
  },
  {
    icon: Sparkles,
    title: "Served like a feast",
    body: "Banana leaves, copper pots, live counters when you want them — we set a table that earns photos.",
  },
  {
    icon: Heart,
    title: "Family recipes",
    body: "Twelve years of weddings, poojas and birthdays. Three generations of recipes. One kitchen.",
  },
];

export function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 lg:px-8 py-12 md:py-16">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-primary mb-3">
            Our story
          </div>
          <h1 className="font-display text-5xl md:text-6xl tracking-tight leading-[1.02]">
            A kitchen that <span className="text-primary italic">remembers</span>.
          </h1>
          <p className="mt-5 text-lg text-fg-muted leading-relaxed">
            Pankti began as a single biryani pot at a neighbourhood wedding.
            Twelve years on, we cook for hundreds of functions a year — but the
            standard hasn&apos;t shifted: serve every guest like they&apos;re
            family.
          </p>
          <p className="mt-4 text-fg-muted leading-relaxed">
            The name <em>Pankti</em> (पंक्ति) is the traditional row of guests
            seated to share a meal. That&apos;s what we still build for —
            community, around a plate.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary text-primary-fg px-5 py-3 text-sm font-semibold hover:bg-[var(--primary-hover)] transition-colors"
          >
            Talk to us
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="relative aspect-square rounded-3xl overflow-hidden border border-[var(--border)]">
          <FoodImage
            src={sceneImage("about")}
            alt="Our kitchen"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>
      </div>

      <div className="mt-20">
        <h2 className="font-display text-3xl md:text-4xl mb-8 tracking-tight">
          What we believe
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {VALUES.map((v) => (
            <div key={v.title} className="glass-card lift p-6">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/12 text-primary mb-4">
                <v.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-xl">{v.title}</h3>
              <p className="mt-2 text-sm text-fg-muted leading-relaxed">
                {v.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      <FounderNote />
      <TeamSection />
    </div>
  );
}
