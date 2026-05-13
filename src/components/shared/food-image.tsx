"use client";
import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils";

// Drop-in replacement for next/image that shows a graceful, on-brand
// "no image" placeholder if the source fails to load (404, blocked, etc).
export function FoodImage({
  className,
  alt,
  ...rest
}: ImageProps & { className?: string }) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center bg-[var(--bg-elev)] text-fg-subtle border border-dashed border-[var(--border-strong)]",
          className,
        )}
        role="img"
        aria-label={`${alt} — image unavailable`}
      >
        <UtensilsCrossed className="h-7 w-7 mb-2 opacity-60" />
        <span className="text-xs font-medium tracking-wide px-3 text-center">
          Photography coming soon
        </span>
      </div>
    );
  }

  return (
    <Image
      {...rest}
      alt={alt}
      className={className}
      onError={() => setErrored(true)}
    />
  );
}
