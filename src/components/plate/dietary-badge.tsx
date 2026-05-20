"use client";
import { Leaf, Flame } from "lucide-react";
import { type DietarySummary } from "@/lib/plate-store";
import { cn } from "@/lib/utils";

const HEAT_LABEL: Record<NonNullable<DietarySummary["heatLabel"]>, string> = {
  mild: "Mild heat",
  medium: "Medium heat",
  hot: "Hot",
  fiery: "Fiery",
  varied: "Mixed heat",
};

// Compact one-line dietary summary placed just below the balance meter.
// Auto-computed from the items currently in the plate; nothing to configure.
export function DietaryBadge({ summary }: { summary: DietarySummary }) {
  if (summary.composition === "empty") return null;

  return (
    <div className="px-4 py-1.5 border-b border-[var(--border)] flex flex-wrap items-center gap-x-2 gap-y-1 text-[10.5px]">
      {summary.composition === "all-veg" ? (
        <Badge color="success">
          <Dot color="success" />
          All-veg menu · {summary.vegCount} dishes
        </Badge>
      ) : summary.composition === "all-non-veg" ? (
        <Badge color="danger">
          <Dot color="danger" />
          All non-veg · {summary.nonVegCount} dishes
        </Badge>
      ) : (
        <>
          <Badge color="success">
            <Dot color="success" />
            {summary.vegCount} veg
          </Badge>
          <Badge color="danger">
            <Dot color="danger" />
            {summary.nonVegCount} non-veg
          </Badge>
        </>
      )}

      {summary.jainSafeCount > 0 && (
        <Badge color="accent">
          <Leaf className="h-2.5 w-2.5" />
          {summary.jainSafeCount} Jain-safe
        </Badge>
      )}

      {summary.heatLabel && (
        <Badge color="primary">
          <Flame className="h-2.5 w-2.5" />
          {HEAT_LABEL[summary.heatLabel]}
        </Badge>
      )}
    </div>
  );
}

function Badge({
  color,
  children,
}: {
  color: "success" | "danger" | "primary" | "accent";
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 font-medium tabular-nums",
        color === "success" &&
          "bg-[color-mix(in_srgb,var(--success)_14%,transparent)] text-[var(--success)]",
        color === "danger" &&
          "bg-[color-mix(in_srgb,var(--danger)_14%,transparent)] text-[var(--danger)]",
        color === "primary" &&
          "bg-[color-mix(in_srgb,var(--primary)_14%,transparent)] text-primary",
        color === "accent" &&
          "bg-[color-mix(in_srgb,var(--accent)_18%,transparent)] text-[var(--accent)]",
      )}
    >
      {children}
    </span>
  );
}

function Dot({ color }: { color: "success" | "danger" }) {
  return (
    <span
      className={cn(
        "inline-block h-1.5 w-1.5 rounded-full",
        color === "success" && "bg-[var(--success)]",
        color === "danger" && "bg-[var(--danger)]",
      )}
    />
  );
}
