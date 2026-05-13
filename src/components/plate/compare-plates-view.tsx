"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSavedPlates, type SavedPlate } from "@/lib/saved-plates";
import { getMenuItem } from "@/data/menu";
import { formatINR } from "@/lib/utils";
import { Check } from "lucide-react";

function subtotal(p: SavedPlate) {
  return p.lines.reduce((s, l) => s + (getMenuItem(l.itemId)?.price ?? 0) * l.qty, 0);
}

export function ComparePlatesView() {
  const plates = useSavedPlates((s) => s.plates);
  const [a, setA] = useState<string>("");
  const [b, setB] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (plates.length >= 2) {
      setA(plates[0].id);
      setB(plates[1].id);
    } else if (plates.length === 1) {
      setA(plates[0].id);
    }
  }, [plates]);

  if (!mounted) return null;

  if (plates.length < 2) {
    return (
      <div className="glass-card p-10 text-center">
        <div className="font-display text-2xl">Save two plates to compare</div>
        <p className="mt-2 text-fg-muted max-w-md mx-auto">
          Build a plate on the menu, hit <strong>Save this plate</strong>,
          then come back here.
        </p>
        <Link
          href="/menu"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary text-primary-fg px-5 py-2.5 text-sm font-semibold"
        >
          Build a plate
        </Link>
      </div>
    );
  }

  const A = plates.find((p) => p.id === a);
  const B = plates.find((p) => p.id === b);

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-3">
        <select value={a} onChange={(e) => setA(e.target.value)}>
          {plates.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <select value={b} onChange={(e) => setB(e.target.value)}>
          {plates.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {[A, B].map(
          (p, idx) =>
            p && (
              <article
                key={`${p.id}-${idx}`}
                className="glass-card p-6 flex flex-col"
              >
                <div className="font-display text-2xl">{p.name}</div>
                <div className="text-xs text-fg-subtle mt-1">
                  {p.lines.length} dishes · {p.guests} guests
                </div>

                <ul className="mt-5 space-y-1.5 text-sm flex-1">
                  {p.lines.map((l) => {
                    const item = getMenuItem(l.itemId);
                    if (!item) return null;
                    const other = (idx === 0 ? B : A)?.lines.find(
                      (x) => x.itemId === l.itemId,
                    );
                    return (
                      <li
                        key={l.itemId}
                        className="flex items-center justify-between gap-2"
                      >
                        <span className="inline-flex items-center gap-1.5 min-w-0">
                          <Check
                            className={`h-3.5 w-3.5 shrink-0 ${
                              other ? "text-fg-subtle" : "text-primary"
                            }`}
                          />
                          <span className="truncate">{item.name}</span>
                          {!other && (
                            <span className="text-[10px] text-primary uppercase tracking-wider">
                              unique
                            </span>
                          )}
                        </span>
                        <span className="text-fg-subtle tabular-nums">
                          ×{l.qty}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-6 pt-4 border-t border-[var(--border)] flex items-end justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
                      Per plate
                    </div>
                    <div className="font-display text-2xl text-primary tabular-nums">
                      {formatINR(subtotal(p))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
                      Total · {p.guests} guests
                    </div>
                    <div className="font-semibold tabular-nums">
                      {formatINR(subtotal(p) * p.guests)}
                    </div>
                  </div>
                </div>
              </article>
            ),
        )}
      </div>
    </div>
  );
}
