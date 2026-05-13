"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Download, Check } from "lucide-react";
import { toast } from "sonner";
import { usePlate, getPlateItems, platePricePerPlate } from "@/lib/plate-store";
import { encodePlate } from "@/lib/plate-encode";
import { generateQuotePdf } from "@/lib/pdf-quote";
// encodePlate kept for WhatsApp deep link below
import { formatINR } from "@/lib/utils";
import { SITE } from "@/lib/site";
import { OCCASIONS } from "@/data/occasions";
import { DateInput } from "@/components/ui/date-input";

export function EnquiryDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const lines = usePlate((s) => s.lines);
  const guests = usePlate((s) => s.guests);
  const occasionId = usePlate((s) => s.occasionId);
  const spicePref = usePlate((s) => s.spicePref);
  const plateNotes = usePlate((s) => s.notes);
  const items = getPlateItems(lines);
  const perPlate = platePricePerPlate(lines);
  const total = perPlate * guests;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [occasion, setOccasion] = useState(
    OCCASIONS.find((o) => o.id === occasionId)?.label ?? "",
  );
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [sent, setSent] = useState(false);

  // Pre-fill enquiry notes from plate notes when dialog opens
  useEffect(() => {
    if (!open) return;
    const SPICE_NAMES = ["Mild", "Medium", "Hot", "Fiery"];
    const prefix = `Spice preference: ${SPICE_NAMES[spicePref]}.`;
    const merged = plateNotes ? `${prefix}\n${plateNotes}` : prefix;
    setNotes((current) => (current ? current : merged));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Lock body scroll while dialog is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const meta = {
    name,
    phone,
    eventDate,
    occasion,
    guests,
  };

  const onSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please tell us your name");
      return;
    }
    // Accept Indian phone shapes — 10 digits, optionally with +91 prefix and any spacing.
    const phoneDigits = phone.replace(/\D/g, "");
    const phoneOk =
      /^[6-9]\d{9}$/.test(phoneDigits) ||
      /^91[6-9]\d{9}$/.test(phoneDigits);
    if (!phoneOk) {
      toast.error("Please enter a valid Indian phone number", {
        description: "10 digits, with or without +91.",
      });
      return;
    }
    // For v1: save to localStorage so admin/future-backend can pick up.
    const enquiry = {
      ...meta,
      address,
      notes,
      lines,
      perPlate,
      total,
      submittedAt: new Date().toISOString(),
    };
    const list = JSON.parse(
      localStorage.getItem("pankti.enquiries") || "[]",
    );
    list.push(enquiry);
    localStorage.setItem("pankti.enquiries", JSON.stringify(list));
    setSent(true);
    toast.success("Enquiry sent! We'll be in touch within the hour.");
  };

  const onDownload = async () => {
    if (lines.length === 0) return;
    try {
      await generateQuotePdf(lines, meta);
      toast.success("Quote PDF downloaded");
    } catch {
      toast.error("Could not generate PDF — please try again");
    }
  };

  const onWhatsApp = () => {
    const token = encodePlate(lines, guests);
    const url = `${window.location.origin}/plate/${token}`;
    const text = encodeURIComponent(
      `Hi Pankti, I'd like to enquire for ${occasion || "an event"} on ${eventDate || "[date]"} for ${guests} guests.\n\nPlate: ${url}\n\nEstimated: ${formatINR(total)}\n\n— ${name || "[name]"}`,
    );
    window.open(`https://wa.me/${SITE.whatsapp}?text=${text}`, "_blank");
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-6"
          onClick={() => onOpenChange(false)}
        >
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="relative w-full md:max-w-2xl max-h-[92vh] bg-[var(--bg)] md:rounded-3xl rounded-t-3xl border border-[var(--border-strong)] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="absolute top-4 right-4 h-9 w-9 inline-flex items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--bg)] z-10"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="px-5 pt-5 pb-4 md:px-7 md:pt-6 md:pb-5 border-b border-[var(--border)] shrink-0">
              <div className="text-[10px] uppercase tracking-[0.18em] text-primary mb-1.5">
                Final step
              </div>
              <h2 className="font-display text-2xl md:text-3xl tracking-tight">
                Tell us about your event
              </h2>
              <p className="mt-1.5 text-xs text-fg-muted">
                {items.length} items · {guests} guests ·{" "}
                <span className="text-primary font-semibold">
                  {formatINR(total)}
                </span>{" "}
                estimated
              </p>
            </div>

            {!sent ? (
              <form
                onSubmit={onSend}
                className="px-5 py-4 md:px-7 md:py-5 space-y-3 overflow-y-auto"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-fg-muted">
                      Your name *
                    </label>
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full name"
                      className="mt-1 !py-2 !text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-fg-muted">
                      Phone *
                    </label>
                    <input
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                      className="mt-1 !py-2 !text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="event-date"
                      className="text-xs font-medium text-fg-muted"
                    >
                      Event date
                    </label>
                    <DateInput
                      id="event-date"
                      value={eventDate}
                      onChange={setEventDate}
                      minDate={new Date()}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-fg-muted">
                      Occasion
                    </label>
                    <select
                      value={occasion}
                      onChange={(e) => setOccasion(e.target.value)}
                      className="mt-1 !py-2 !text-sm"
                    >
                      <option value="">Select…</option>
                      {OCCASIONS.map((o) => (
                        <option key={o.id} value={o.label}>
                          {o.label}
                        </option>
                      ))}
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-fg-muted">
                    Venue / address
                  </label>
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Area, landmark, city"
                    className="mt-1 !py-2 !text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-fg-muted">
                    Notes (allergies, preferences, timing)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Anything we should know?"
                    className="mt-1 !py-2 !text-sm resize-none"
                  />
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-fg px-5 py-2.5 text-sm font-semibold hover:bg-[var(--primary-hover)] transition-colors"
                  >
                    <Send className="h-4 w-4" />
                    Send enquiry
                  </button>
                  <button
                    type="button"
                    onClick={onDownload}
                    className="btn-ghost inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
                  >
                    <Download className="h-4 w-4" />
                    Download PDF
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-6 md:p-10 text-center">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[var(--success)]/15 text-[var(--success)] mb-5">
                  <Check className="h-7 w-7" />
                </div>
                <h3 className="font-display text-2xl">Enquiry received</h3>
                <p className="mt-2 text-sm text-fg-muted max-w-md mx-auto">
                  We&apos;ve saved your plate. To get the fastest response, also
                  send it to us on WhatsApp — one tap.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={onWhatsApp}
                    className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-fg px-5 py-2.5 text-sm font-semibold"
                  >
                    Send on WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={onDownload}
                    className="btn-ghost inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
                  >
                    <Download className="h-4 w-4" />
                    Download PDF
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSent(false);
                    onOpenChange(false);
                  }}
                  className="mt-5 text-xs text-fg-subtle hover:text-fg"
                >
                  Close
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
