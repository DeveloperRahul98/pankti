import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={cn("h-8 w-8", className)}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="lm-grad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#F0B357" />
          <stop offset="100%" stopColor="#E8A33D" />
        </radialGradient>
      </defs>
      <circle
        cx="32"
        cy="32"
        r="28"
        fill="none"
        stroke="url(#lm-grad)"
        strokeWidth="2.4"
      />
      <circle
        cx="32"
        cy="32"
        r="19"
        fill="none"
        stroke="url(#lm-grad)"
        strokeWidth="1.4"
        opacity="0.55"
      />
      <path
        d="M20 26 L44 26 M20 33 L44 33 M20 40 L44 40"
        stroke="url(#lm-grad)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle cx="32" cy="14" r="2.6" fill="#F0B357" />
    </svg>
  );
}

export function Logo({
  className,
  withWordmark = true,
}: {
  className?: string;
  withWordmark?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2.5 group select-none",
        className,
      )}
      aria-label="Pankti home"
    >
      <LogoMark className="h-9 w-9 transition-transform group-hover:rotate-[8deg] duration-300" />
      {withWordmark && (
        <span className="font-display text-2xl tracking-tight leading-none wordmark-draw">
          Pankti
          <span className="text-primary">.</span>
        </span>
      )}
    </Link>
  );
}
