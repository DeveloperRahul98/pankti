"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UtensilsCrossed } from "lucide-react";
import { usePlate } from "@/lib/plate-store";

export function LoadPlateButton({
  itemIds,
  plateName,
}: {
  itemIds: string[];
  plateName: string;
}) {
  const router = useRouter();
  const loadFromEncoded = usePlate((s) => s.loadFromEncoded);
  const guests = usePlate((s) => s.guests);

  const onClick = () => {
    const lines = itemIds.map((id) => ({ itemId: id, qty: 1 }));
    loadFromEncoded(lines, guests || 50);
    toast.success(`Loaded "${plateName}"`, {
      description: "Customise freely on the menu.",
    });
    router.push("/menu");
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-fg px-5 py-2.5 text-sm font-semibold hover:bg-[var(--primary-hover)] transition-colors"
    >
      <UtensilsCrossed className="h-4 w-4" />
      Load this plate
    </button>
  );
}
