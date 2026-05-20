import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { SITE, NAV_LINKS, COMPLIANCE } from "@/lib/site";
import { Phone, Mail, MapPin, AtSign, MessageCircle } from "lucide-react";
import { ComplianceStrip } from "@/components/shared/compliance-strip";

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-[var(--border)] bg-[var(--bg-elev)]">
      <div className="absolute inset-x-0 top-0 divider-saffron" />
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        {/* Compliance & trust strip — surfaces FSSAI, GSTIN, certs first */}
        <ComplianceStrip />

        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-md text-sm text-fg-muted leading-relaxed">
              {SITE.description}
            </p>
            <div className="mt-5 flex gap-2">
              <a
                href={`https://wa.me/${SITE.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-fg px-4 py-2 text-sm font-semibold hover:bg-[var(--primary-hover)] transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
              <a
                href={`tel:${SITE.phoneRaw}`}
                className="btn-ghost inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
              >
                <Phone className="h-4 w-4" />
                Call
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display text-lg">Explore</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-fg-muted hover:text-primary transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg">Reach us</h4>
            <ul className="mt-4 space-y-3 text-sm text-fg-muted">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <span>
                  {SITE.address}
                  <br />
                  {SITE.city}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-primary" />
                <a href={`tel:${SITE.phoneRaw}`} className="hover:text-fg">
                  {SITE.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-primary" />
                <a href={`mailto:${SITE.email}`} className="hover:text-fg">
                  {SITE.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <AtSign className="h-4 w-4 text-primary" />
                <span>{SITE.instagram}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-[var(--border)] pt-6 text-xs text-fg-subtle">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p>© {new Date().getFullYear()} Pankti Catering. Crafted with care.</p>
            <p>{SITE.hours}</p>
          </div>
          <p className="text-[10px] tabular-nums">
            FSSAI No. <span className="text-fg-muted">{COMPLIANCE.fssaiNumber}</span>{" "}
            · GSTIN <span className="text-fg-muted">{COMPLIANCE.gstin}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
