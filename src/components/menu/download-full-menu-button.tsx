"use client";
import { useState } from "react";
import { Download, FileText } from "lucide-react";
import { toast } from "sonner";
import { generateFullMenuPdf } from "@/lib/full-menu-pdf";

// Downloads the entire Pankti catalog as a branded A4 PDF brochure —
// useful for sharing the menu on WhatsApp with a relative who doesn't
// want to open the website, or for printing on the kitchen wall.
export function DownloadFullMenuButton() {
  const [busy, setBusy] = useState(false);

  const onClick = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await generateFullMenuPdf();
      toast.success("Full menu downloaded", {
        description: "A4 PDF brochure ready to share or print.",
      });
    } catch {
      toast.error("Could not generate the menu — please try again");
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className="btn-ghost inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold disabled:opacity-50"
      title="Download the full menu as an A4 PDF brochure"
    >
      {busy ? (
        <FileText className="h-3.5 w-3.5 animate-pulse" />
      ) : (
        <Download className="h-3.5 w-3.5" />
      )}
      {busy ? "Preparing…" : "Download full menu"}
    </button>
  );
}
