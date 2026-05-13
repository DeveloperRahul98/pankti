export function OrnamentalDivider({ className }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center gap-3 text-primary/70 ${className ?? ""}`}
      aria-hidden="true"
    >
      <span className="h-px w-12 bg-current opacity-40" />
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="3" fill="currentColor" />
        <circle
          cx="11"
          cy="11"
          r="8"
          stroke="currentColor"
          strokeWidth="0.8"
          opacity="0.6"
        />
        <path
          d="M11 1 L11 4 M11 18 L11 21 M1 11 L4 11 M18 11 L21 11"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>
      <span className="h-px w-12 bg-current opacity-40" />
    </div>
  );
}
