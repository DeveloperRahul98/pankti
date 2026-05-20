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
    <div className="px-4 py-1.5 border-b border-[var(--border)]">
      <div className="flex items-center gap-2">
        <span className="text-[9px] uppercase tracking-wider text-fg-subtle shrink-0 tabular-nums">
          {score}%
        </span>
        <div className="h-1 flex-1 rounded-full bg-[var(--bg)] overflow-hidden">
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
        <div className="flex items-center gap-0.5 shrink-0">
          {ESSENTIAL_COURSES.map((c) => {
            const has = present.has(c.id);
            return (
              <span
                key={c.id}
                title={`${c.label}${has ? "" : " — missing"}`}
                className={cn(
                  "inline-flex h-3.5 w-3.5 items-center justify-center rounded-full",
                  has
                    ? "bg-[var(--success)]/20 text-[var(--success)]"
                    : "bg-[var(--border)] text-fg-subtle",
                )}
              >
                {has ? (
                  <Check className="h-2 w-2" />
                ) : (
                  <X className="h-2 w-2" />
                )}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
