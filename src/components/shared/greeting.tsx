"use client";
import { useEffect, useState } from "react";

function pickGreeting(hour: number) {
  if (hour < 5) return { hi: "Working late?", sub: "We're up too." };
  if (hour < 12) return { hi: "Good morning", sub: "Planning something special?" };
  if (hour < 17) return { hi: "Good afternoon", sub: "Tell us about the function." };
  if (hour < 21) return { hi: "Good evening", sub: "What are we celebrating?" };
  return { hi: "Good night", sub: "Dreaming up tomorrow's feast?" };
}

export function HeroGreeting() {
  const [g, setG] = useState<{ hi: string; sub: string } | null>(null);

  useEffect(() => {
    setG(pickGreeting(new Date().getHours()));
  }, []);

  if (!g) {
    return (
      <span suppressHydrationWarning>Premium catering · Hyderabad</span>
    );
  }
  return (
    <span suppressHydrationWarning>
      <span className="text-fg">{g.hi}</span>
      <span className="text-fg-subtle"> · {g.sub}</span>
    </span>
  );
}
