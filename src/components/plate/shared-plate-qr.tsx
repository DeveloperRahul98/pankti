"use client";
import { useEffect, useState } from "react";
import { QrCode } from "lucide-react";
import { qrDataUrl } from "@/lib/qr";

export function SharedPlateQr({ token }: { token: string }) {
  const [src, setSrc] = useState<string | null>(null);
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    const full = `${window.location.origin}/plate/${token}`;
    setUrl(full);
    qrDataUrl(full, 320).then(setSrc).catch(() => setSrc(null));
  }, [token]);

  return (
    <div className="mt-6 glass-card p-5 flex items-center gap-5">
      <div className="shrink-0 rounded-xl bg-white p-2">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="QR code for this plate" width={120} height={120} />
        ) : (
          <div className="h-[120px] w-[120px] grid place-items-center text-fg-subtle">
            <QrCode className="h-8 w-8" />
          </div>
        )}
      </div>
      <div className="min-w-0">
        <div className="text-xs uppercase tracking-[0.18em] text-primary mb-1.5">
          Scan to open on your phone
        </div>
        <div className="text-sm text-fg-muted">
          Point your camera at the code — the plate opens instantly. Useful for handing a printed quote to family or guests.
        </div>
        {url && (
          <div className="mt-2 text-[11px] text-fg-subtle truncate" title={url}>
            {url}
          </div>
        )}
      </div>
    </div>
  );
}
