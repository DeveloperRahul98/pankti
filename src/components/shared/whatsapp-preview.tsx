"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ArrowLeft,
  Copy as CopyIcon,
  Check,
  MessageCircle,
  Phone as PhoneIcon,
  Video,
} from "lucide-react";
import { toast } from "sonner";
import { SITE } from "@/lib/site";

// A WhatsApp-styled preview of the message that *would* be sent to the
// caterer. Shown before any actual deep-link open so the user (and during
// MVP, the client / tender judge) can see exactly what the recipient gets.
//
// `target` defaults to SITE.whatsapp — once that's set to a real number,
// the "Open in WhatsApp" button works end-to-end. Until then, it's still
// a working button (opens wa.me) but the number is a placeholder.
export function WhatsAppPreview({
  open,
  onClose,
  message,
  target = SITE.whatsapp,
  title = "Pankti Catering",
}: {
  open: boolean;
  onClose: () => void;
  message: string;
  target?: string;
  title?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (open) setNow(new Date());
  }, [open]);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      toast.success("Message copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy — long-press the text instead.");
    }
  };

  const onOpenWa = () => {
    const url = `https://wa.me/${target}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const timeStr = now
    ? now.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "";

  // Render the message with basic *bold* / _italic_ support so it looks
  // like WhatsApp's own formatting.
  const renderFormatted = (text: string) =>
    text.split("\n").map((line, i) => (
      <span key={i} className="block min-h-[1.1em]">
        {renderInline(line)}
      </span>
    ));

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 60, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="relative w-full md:max-w-md bg-[#0b141a] md:rounded-3xl rounded-t-3xl border border-black/40 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: "94vh" }}
          >
            {/* Preview banner — saffron, so it's never confused with the real chat */}
            <div className="bg-primary text-primary-fg text-[11px] font-semibold py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-1.5">
              <Eye className="h-3 w-3" />
              PREVIEW · NOT YET SENT
            </div>

            {/* WhatsApp-style header (dark teal-green) */}
            <div className="bg-[#1f2c33] flex items-center gap-3 px-3 py-2.5 border-b border-black/30">
              <button
                type="button"
                onClick={onClose}
                className="h-8 w-8 inline-flex items-center justify-center rounded-full text-white/80 hover:bg-white/10"
                aria-label="Back"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div className="h-9 w-9 shrink-0 rounded-full bg-primary inline-flex items-center justify-center font-display text-primary-fg text-base">
                P
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-white text-sm font-semibold truncate">
                  {title}
                </div>
                <div className="text-[11px] text-white/60 truncate">
                  Business · typically replies within an hour
                </div>
              </div>
              <button
                type="button"
                className="h-8 w-8 inline-flex items-center justify-center text-white/70"
                aria-label="Video call"
                tabIndex={-1}
              >
                <Video className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="h-8 w-8 inline-flex items-center justify-center text-white/70"
                aria-label="Voice call"
                tabIndex={-1}
              >
                <PhoneIcon className="h-4 w-4" />
              </button>
            </div>

            {/* Chat surface — WhatsApp's dark-mode chat background */}
            <div
              className="overflow-y-auto px-3 py-4"
              style={{
                background:
                  "repeating-linear-gradient(135deg, #0b141a 0 24px, #0e171c 24px 48px)",
                maxHeight: "60vh",
              }}
            >
              <div className="text-center mb-3">
                <span className="inline-block rounded-md bg-[#1f2c33] text-white/70 text-[10px] px-2 py-0.5">
                  TODAY
                </span>
              </div>
              <div className="text-center mb-4">
                <span className="inline-block rounded-md bg-[#182229] text-white/50 text-[9px] px-2 py-1 max-w-[80%]">
                  Messages are end-to-end encrypted. No one outside of this
                  chat can read them.
                </span>
              </div>
              {/* Outgoing message bubble */}
              <div className="flex justify-end">
                <div className="relative max-w-[85%] rounded-lg bg-[#005c4b] text-white px-2.5 py-1.5 shadow-md">
                  <div className="text-[13px] leading-snug whitespace-pre-wrap break-words">
                    {renderFormatted(message)}
                  </div>
                  <div className="flex items-center justify-end gap-1 mt-0.5">
                    <span className="text-[10px] text-white/60 tabular-nums">
                      {timeStr}
                    </span>
                    <DoubleCheck />
                  </div>
                  {/* Bubble tail */}
                  <span
                    className="absolute top-0 -right-1.5 w-0 h-0"
                    style={{
                      borderTop: "8px solid #005c4b",
                      borderRight: "8px solid transparent",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Action bar */}
            <div className="bg-[#0b141a] border-t border-black/30 px-4 py-3 space-y-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onCopy}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-white/10 text-white py-2.5 text-xs font-semibold hover:bg-white/15 transition-colors active:scale-[.99]"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Copied
                    </>
                  ) : (
                    <>
                      <CopyIcon className="h-3.5 w-3.5" />
                      Copy text
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={onOpenWa}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-[#25d366] text-[#0b141a] py-2.5 text-xs font-bold hover:opacity-90 transition-opacity active:scale-[.99]"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  Open in WhatsApp
                </button>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-full text-center text-[11px] text-white/50 hover:text-white/80 py-1"
              >
                Close preview
              </button>
            </div>

            {/* Top-right close button (mobile-friendly) */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-1.5 right-2 h-7 w-7 inline-flex items-center justify-center rounded-full text-primary-fg/70 hover:bg-black/20"
              aria-label="Close"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

// Inline WhatsApp-style formatting: *bold*, _italic_. Stays as plain text
// elsewhere. Keeps the preview faithful to how the recipient sees it.
function renderInline(line: string): React.ReactNode {
  const out: React.ReactNode[] = [];
  let i = 0;
  let key = 0;
  while (i < line.length) {
    const star = line.indexOf("*", i);
    if (star === -1) {
      out.push(line.slice(i));
      break;
    }
    const close = line.indexOf("*", star + 1);
    if (close === -1) {
      out.push(line.slice(i));
      break;
    }
    if (star > i) out.push(line.slice(i, star));
    out.push(
      <strong key={`b${key++}`} className="font-semibold">
        {line.slice(star + 1, close)}
      </strong>,
    );
    i = close + 1;
  }
  return out.length ? out : line;
}

// WhatsApp's double-tick "read" indicator — small but recognisable.
function DoubleCheck() {
  return (
    <svg
      viewBox="0 0 16 11"
      className="h-3 w-3 text-[#53bdeb]"
      aria-hidden
      fill="currentColor"
    >
      <path d="M11.071.653a.5.5 0 0 1 .03.706L6.07 6.493a.5.5 0 0 1-.736.001L2.92 4.012a.5.5 0 0 1 .735-.679l2.05 2.225L10.366.683a.5.5 0 0 1 .705-.03Z" />
      <path d="M15.071.653a.5.5 0 0 1 .03.706L10.07 6.493a.5.5 0 0 1-.736.001L8.92 5.012a.5.5 0 0 1 .735-.679l.05.225L14.366.683a.5.5 0 0 1 .705-.03Z" />
    </svg>
  );
}

// Local eye icon — kept inline to avoid bumping the imports just for this.
function Eye(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
