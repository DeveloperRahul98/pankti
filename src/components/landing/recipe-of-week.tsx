"use client";
import { FoodImage } from "@/components/shared/food-image";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { RECIPE_OF_WEEK } from "@/data/recipe-of-week";
import { getMenuItem } from "@/data/menu";
import { dishImage } from "@/lib/utils";

export function RecipeOfWeek() {
  const item = getMenuItem(RECIPE_OF_WEEK.dishId);
  if (!item) return null;

  return (
    <section className="mx-auto max-w-6xl px-5 lg:px-8 py-20 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="grid md:grid-cols-2 gap-8 md:gap-12 items-center"
      >
        <div className="relative aspect-square rounded-3xl overflow-hidden border border-[var(--border)]">
          <FoodImage
            src={dishImage(item.id)}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-fg px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
            <Calendar className="h-3 w-3" />
            Recipe of the week
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-primary mb-3">
            {item.name}
          </div>
          <h2 className="font-display text-4xl md:text-5xl tracking-tight leading-[1.05]">
            {RECIPE_OF_WEEK.storyTitle}
          </h2>
          <p className="mt-5 text-fg-muted leading-relaxed">
            {RECIPE_OF_WEEK.story}
          </p>
          <p className="mt-4 text-sm text-primary italic font-display">
            {RECIPE_OF_WEEK.servingNote}
          </p>
        </div>
      </motion.div>
    </section>
  );
}
