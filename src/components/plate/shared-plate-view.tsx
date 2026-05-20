import { notFound } from "next/navigation";
import { decodePlate } from "@/lib/plate-encode";
import { getMenuItem, type MenuItem } from "@/data/menu";
import { formatINR } from "@/lib/utils";
import { SharedPlateActions } from "@/components/plate/shared-plate-actions";
import { SharedPlateQr } from "@/components/plate/shared-plate-qr";

export function SharedPlateView({ token }: { token: string }) {
  const decoded = decodePlate(token);
  if (!decoded) notFound();

  const items = decoded.lines
    .map((l) => {
      const item = getMenuItem(l.itemId);
      return item ? { item, qty: l.qty } : null;
    })
    .filter((x): x is { item: MenuItem; qty: number } => x !== null);

  const perPlate = items.reduce(
    (a, { item, qty }) => a + item.price * qty,
    0,
  );
  const total = perPlate * decoded.guests;

  return (
    <div className="mx-auto max-w-3xl px-5 lg:px-8 py-12">
      <div className="text-xs uppercase tracking-[0.18em] text-primary mb-3">
        A plate shared with you
      </div>
      <h1 className="font-display text-4xl md:text-5xl tracking-tight">
        Custom Pankti plate
      </h1>
      <p className="mt-3 text-fg-muted">
        Designed for{" "}
        <span className="text-fg font-semibold">{decoded.guests} guests</span>.
        Estimated total{" "}
        <span className="text-primary font-semibold">{formatINR(total)}</span>.
      </p>

      <div className="mt-8 glass-card overflow-hidden">
        <div className="divide-y divide-[var(--border)]">
          {items.map(({ item, qty }) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 px-5 py-3.5"
            >
              <div className="min-w-0">
                <div className="font-medium">{item.name}</div>
                <div className="text-xs text-fg-subtle">
                  {item.veg ? "Veg" : "Non-veg"} ·{" "}
                  {item.cuisine === "south"
                    ? "South Indian"
                    : item.cuisine === "north"
                      ? "North Indian"
                      : "Common"}
                </div>
              </div>
              <div className="text-right shrink-0 tabular-nums">
                <div className="text-sm text-fg-muted">
                  {formatINR(item.price)} × {qty}
                </div>
                <div className="font-semibold">
                  {formatINR(item.price * qty)}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="px-5 py-4 bg-[var(--bg)] flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-fg-subtle">
              Estimated total
            </div>
            <div className="font-display text-3xl text-primary tabular-nums">
              {formatINR(total)}
            </div>
          </div>
          <div className="text-xs text-fg-subtle text-right">
            {decoded.guests} guests
            <br />
            {formatINR(perPlate)} / plate
          </div>
        </div>
      </div>

      <SharedPlateActions token={token} />
      <SharedPlateQr token={token} />
    </div>
  );
}
