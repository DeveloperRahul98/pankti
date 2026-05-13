import { SITE } from "@/lib/site";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Clock,
  AtSign,
} from "lucide-react";

export function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 lg:px-8 py-12 md:py-16">
      <div className="mb-10">
        <div className="text-xs uppercase tracking-[0.18em] text-primary mb-3">
          Reach us
        </div>
        <h1 className="font-display text-5xl md:text-6xl tracking-tight">
          Let&apos;s plan your feast.
        </h1>
        <p className="mt-3 max-w-xl text-fg-muted">
          The fastest way is WhatsApp — we usually reply within the hour. Call
          us for last-minute bookings.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <a
          href={`https://wa.me/${SITE.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group glass-card p-6 hover:border-primary transition-colors flex items-start gap-4"
        >
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/12 text-primary shrink-0">
            <MessageCircle className="h-5 w-5" />
          </span>
          <div>
            <div className="font-display text-xl">WhatsApp</div>
            <div className="text-sm text-fg-muted mt-1">{SITE.phone}</div>
            <div className="mt-2 text-xs text-primary font-semibold">
              Tap to chat →
            </div>
          </div>
        </a>

        <a
          href={`tel:${SITE.phoneRaw}`}
          className="group glass-card p-6 hover:border-primary transition-colors flex items-start gap-4"
        >
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/12 text-primary shrink-0">
            <Phone className="h-5 w-5" />
          </span>
          <div>
            <div className="font-display text-xl">Call us</div>
            <div className="text-sm text-fg-muted mt-1">{SITE.phone}</div>
            <div className="mt-2 text-xs text-primary font-semibold">
              Tap to call →
            </div>
          </div>
        </a>

        <a
          href={`mailto:${SITE.email}`}
          className="group glass-card p-6 hover:border-primary transition-colors flex items-start gap-4"
        >
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/12 text-primary shrink-0">
            <Mail className="h-5 w-5" />
          </span>
          <div>
            <div className="font-display text-xl">Email</div>
            <div className="text-sm text-fg-muted mt-1 break-all">
              {SITE.email}
            </div>
          </div>
        </a>

        <div className="glass-card p-6 flex items-start gap-4">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/12 text-primary shrink-0">
            <MapPin className="h-5 w-5" />
          </span>
          <div>
            <div className="font-display text-xl">Kitchen address</div>
            <div className="text-sm text-fg-muted mt-1">
              {SITE.address}
              <br />
              {SITE.city}
            </div>
          </div>
        </div>

        <div className="glass-card p-6 flex items-start gap-4">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/12 text-primary shrink-0">
            <Clock className="h-5 w-5" />
          </span>
          <div>
            <div className="font-display text-xl">Hours</div>
            <div className="text-sm text-fg-muted mt-1">{SITE.hours}</div>
          </div>
        </div>

        <div className="glass-card p-6 flex items-start gap-4">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/12 text-primary shrink-0">
            <AtSign className="h-5 w-5" />
          </span>
          <div>
            <div className="font-display text-xl">Instagram</div>
            <div className="text-sm text-fg-muted mt-1">{SITE.instagram}</div>
          </div>
        </div>
      </div>

      <div className="mt-10 rounded-3xl overflow-hidden border border-[var(--border)] aspect-[16/9] bg-[var(--bg-elev)]">
        <iframe
          title="Pankti kitchen location"
          src={`https://www.google.com/maps?q=${encodeURIComponent(
            `${SITE.address}, Hyderabad`,
          )}&output=embed`}
          className="w-full h-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}
