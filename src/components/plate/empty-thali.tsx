export function EmptyThali() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        className="text-primary/60"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="thali-g" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.04" />
          </radialGradient>
        </defs>
        {/* outer rim */}
        <circle
          cx="60"
          cy="60"
          r="54"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.7"
        />
        <circle cx="60" cy="60" r="50" fill="url(#thali-g)" />
        {/* inner rim */}
        <circle
          cx="60"
          cy="60"
          r="44"
          stroke="currentColor"
          strokeWidth="0.7"
          opacity="0.5"
          strokeDasharray="2 3"
        />
        {/* tiny bowls (empty spots) */}
        <circle cx="60" cy="34" r="9" stroke="currentColor" strokeWidth="1" opacity="0.6" />
        <circle cx="40" cy="50" r="7" stroke="currentColor" strokeWidth="1" opacity="0.6" />
        <circle cx="80" cy="50" r="7" stroke="currentColor" strokeWidth="1" opacity="0.6" />
        <circle cx="46" cy="76" r="6" stroke="currentColor" strokeWidth="1" opacity="0.6" />
        <circle cx="74" cy="76" r="6" stroke="currentColor" strokeWidth="1" opacity="0.6" />
        {/* center diya */}
        <circle cx="60" cy="60" r="3" fill="currentColor" opacity="0.5" />
      </svg>
      <div className="font-display text-xl mt-2 text-fg">Your plate awaits</div>
      <p className="mt-1.5 text-sm text-fg-subtle max-w-xs">
        Tap <span className="text-primary font-semibold">Add</span> on any dish
        and watch it fill up.
      </p>
    </div>
  );
}
