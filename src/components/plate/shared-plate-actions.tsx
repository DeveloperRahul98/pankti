"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Edit3, MessageCircle } from "lucide-react";
import { usePlate } from "@/lib/plate-store";
import { decodePlate } from "@/lib/plate-encode";
import { SITE } from "@/lib/site";

export function SharedPlateActions({ token }: { token: string }) {
  const router = useRouter();
  const loadFromEncoded = usePlate((s) => s.loadFromEncoded);

  const onCustomise = () => {
    const decoded = decodePlate(token);
    if (!decoded) return;
    loadFromEncoded(decoded.lines, decoded.guests);
    toast.success("Loaded into your plate — edit anything you like");
    router.push("/menu");
  };

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <button
        type="button"
        onClick={onCustomise}
        className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-fg px-5 py-3 text-sm font-semibold hover:bg-[var(--primary-hover)] transition-colors"
      >
        <Edit3 className="h-4 w-4" />
        Customise this plate
      </button>
      <a
        href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
          `Hi Pankti, I'd like to enquire about this plate: ${typeof window !== "undefined" ? window.location.href : ""}`,
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-ghost inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold"
      >
        <MessageCircle className="h-4 w-4" />
        Enquire on WhatsApp
      </a>
    </div>
  );
}
