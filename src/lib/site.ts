// Canonical public URL of the site. Used by sitemap, robots, OpenGraph
// metadata, and as the SSR fallback for share-link builders.
//
// In dev: defaults to http://localhost:3000.
// In prod: set NEXT_PUBLIC_SITE_URL to your real host (e.g. https://pankti.com)
//   - Vercel: dashboard → project → Environment Variables → add
//     NEXT_PUBLIC_SITE_URL = https://pankti.com (Production scope)
//   - Other hosts: set the env var in your build pipeline
//   - Locally for testing: create .env.local with NEXT_PUBLIC_SITE_URL=...
//
// User-facing share links (the WhatsApp message, the QR code on the PDF,
// etc.) use window.location.origin so they always reflect the host the
// visitor is browsing — those don't need this constant.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export const SITE = {
  name: "Pankti",
  tagline: "Build your plate. Set your feast.",
  description:
    "Premium catering for weddings, pooja, corporate events and house functions. Build your own plate from authentic South & North Indian dishes.",
  phone: "+91 79817 889272",
  phoneRaw: "+9179817889272",
  email: "rahul@pankti.com",
  address: "Mallapur, New Narsimha Nagar Colony",
  city: "Hyderabad",
  whatsapp: "9179817889272",
  instagram: "@pankti.catering",
  hours: "Open all days · 8 AM – 10 PM",
} as const;

// Compliance & trust signals — surfaced in the footer strip and on the PDF
// quote. Tender committees check these first; investors and corporate
// clients ask for them by default. Replace placeholders with real numbers
// once registration is complete.
export const COMPLIANCE = {
  fssaiNumber: "12345678901234",
  gstin: "36ABCDE1234F1Z5",
  establishedYear: 2015,
  certifications: [
    { code: "FSSAI", label: "FSSAI registered" },
    { code: "ISO22000", label: "ISO 22000 · Food safety" },
    { code: "HACCP", label: "HACCP compliant" },
    { code: "INSURED", label: "Public liability insured" },
  ],
  bankReady: true, // true → "Accepts NEFT / UPI / cheque · GST invoice"
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/signature-plates", label: "Signature" },
  { href: "/compare", label: "Compare" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;
