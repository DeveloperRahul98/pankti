"use client";
import { Check, X } from "lucide-react";
import type { MenuItem, Course } from "@/data/menu";
import { cn } from "@/lib/utils";

const ESSENTIAL_COURSES: { id: Course; label: string }[] = [
  { id: "starters", label: "Starter" },
  { id: "rice", label: "Rice" },
  { id: "curries", label: "Curry" },
  { id: "breads", label: "Bread" },
  { id: "sweets", label: "Sweet" },
];

export function PlateBalanceMeter({
  items,
}: {
  items: { item: MenuItem; qty: number }[];
}) {
  if (items.length === 0) return null;

  const present = new Set(items.map((x) => x.item.course));
  const hits = ESSENTIAL_COURSES.filter((c) => present.has(c.id)).length;
  const score = Math.round((hits / ESSENTIAL_COURSES.length) * 100);

  return (
    <div className="px-5 py-2.5 border-b border-[var(--border)]">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] uppercase tracking-wider text-fg-subtle">
          Balance · {score}%
        </span>
        <div className="flex flex-wrap items-center gap-1">
          {ESSENTIAL_COURSES.map((c) => {
            const has = present.has(c.id);
            return (
              <span
                key={c.id}
                title={c.label}
                className={cn(
                  "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-medium",
                  has
                    ? "bg-[var(--success)]/15 text-[var(--success)]"
                    : "bg-[var(--border)] text-fg-subtle",
                )}
              >
                {has ? (
                  <Check className="h-2.5 w-2.5" />
                ) : (
                  <X className="h-2.5 w-2.5" />
                )}
                {c.label}
              </span>
            );
          })}
        </div>
      </div>
      <div className="h-1 rounded-full bg-[var(--bg)] overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            score >= 80
              ? "bg-[var(--success)]"
              : score >= 50
                ? "bg-primary"
                : "bg-[var(--danger)]/80",
          )}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
