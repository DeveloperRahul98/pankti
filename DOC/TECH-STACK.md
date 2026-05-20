# Pankti — Technology Stack

*A plain-English explanation of every technology used in this project and why it's there.*

*Last updated: 2026-05-20 (Phase 1 feature-complete)*

---

## How to read this document

Each section follows the same shape:
- **What it is** — one sentence anyone can understand
- **Why we picked it** — what problem it solves for us
- **Where it lives in our code** — so you can find it

You don't need to be a developer to read this. If a term is jargon-y, skip to the "why" line.

---

## 1. The foundation

### Next.js 16
- **What it is**: A framework for building websites with React. Think of it as the engine that turns our code into the actual pages a customer sees.
- **Why we picked it**: It's fast, it's the most popular React framework, and it automatically makes our pages load quickly by pre-building them.
- **Where it lives**: Everywhere. It's the platform the whole project runs on.

### React 19
- **What it is**: The library we use to describe what the screen should look like.
- **Why we picked it**: Industry standard. Huge ecosystem. Comes built into Next.js.
- **Where it lives**: Every file ending in `.tsx`.

### TypeScript
- **What it is**: JavaScript with type-checking — it warns us about mistakes before our customers see them.
- **Why we picked it**: Catches bugs early. Makes the code self-documenting. Refactoring is much safer.
- **Where it lives**: Every code file. The `tsconfig.json` at the root configures it.

---

## 2. The look and feel

### Tailwind CSS 4
- **What it is**: A way to style elements by writing utility class names directly in the HTML, instead of separate CSS files.
- **Why we picked it**: Faster to write. Consistent design tokens. No "where do I find this CSS" hunting.
- **Where it lives**: All the `className="..."` strings in components, plus `src/app/globals.css` for the design tokens (colours, fonts).

### Fraunces + Inter (Google Fonts)
- **What they are**: Two typefaces. Fraunces is the serif used for headings (gives a premium, editorial feel). Inter is the clean sans-serif used for body text.
- **Why we picked them**: Fraunces has personality and tradition (suits Indian catering). Inter is highly readable on all screens.
- **Where they live**: Loaded in `src/app/layout.tsx` using Next.js's built-in `next/font/google`.

### Framer Motion
- **What it is**: A library for making smooth animations — fades, slides, scroll effects, hover states.
- **Why we picked it**: Makes the site feel premium. Easy to use. Handles complex transitions like the lightbox and the plate panel.
- **Where it lives**: Anywhere you see `motion.div` or `AnimatePresence` — hero, plate panel, signature plates, lightbox.

### Lucide React (icons)
- **What it is**: A pack of clean, consistent icons (chevrons, hearts, leaves, flames, etc.).
- **Why we picked it**: Open-source, well-designed, tree-shakeable (we only ship the icons we use).
- **Where it lives**: All `import { ... } from "lucide-react"` lines.

### Sonner (toast notifications)
- **What it is**: The small messages that pop up at the bottom of the screen ("Plate saved!", "Quote downloaded").
- **Why we picked it**: Lightweight, beautiful default styling, accessible.
- **Where it lives**: `<Toaster />` is set up in `src/app/layout.tsx`. We call `toast.success(...)` wherever we need feedback.

### next-themes
- **What it is**: A small helper that switches the site between dark and light modes and remembers the user's choice.
- **Why we picked it**: It just works. Handles the awkward "flicker between modes" problem automatically.
- **Where it lives**: `src/components/theme-provider.tsx` and the toggle button in the navbar.

---

## 3. State management

### Zustand
- **What it is**: A simple way to share data across the whole app — like "the customer's plate" or "is the gallery lightbox open".
- **Why we picked it**: Less code than Redux. Built-in support for saving to the browser's storage so the customer's plate survives page refreshes.
- **Where it lives**: `src/lib/plate-store.ts`, `src/lib/saved-plates.ts`, `src/lib/lightbox-store.ts`.

### React's built-in state (`useState`, `useEffect`)
- **What it is**: The standard tools for keeping track of "is this dialog open" or "what's in this form field".
- **Why we picked it**: It's right there. Don't need a library for small things.
- **Where it lives**: Inside individual components, like form inputs and dropdowns.

---

## 4. Data and content

### Static data files
- **What it is**: Our menu, signature plates, testimonials, festivals, and team members live as TypeScript files. No external database (yet).
- **Why we picked it**: Simple, fast, and free. Easy to edit. We can move to a real database in Phase 2 without changing the rest of the app.
- **Where it lives**: `src/data/` — `menu.ts`, `signature-plates.ts`, `gallery.ts`, `testimonials.ts`, `festivals.ts`, `team.ts`, `glossary.ts`, `pairings.ts`, `recipe-of-week.ts`, `featured-in.ts`, `occasions.ts`.

### localStorage (browser storage)
- **What it is**: Built-in browser feature that saves small bits of data on the customer's own device.
- **Why we use it**: So the customer's plate doesn't disappear when they refresh the page. Same for saved plates and submitted enquiries.
- **Where it lives**: Zustand handles it via its `persist` middleware. The keys we use start with `pankti.` (e.g., `pankti.plate.v1`, `pankti.saved-plates.v1`).

---

## 5. Images

### Local images (in `public/`)
- **What it is**: All the food photos and brand assets are stored as `.jpg` and `.svg` files in our project.
- **Why we picked this**: No external image service to depend on. Fast loading. Won't break if a third-party CDN goes down.
- **Where they live**:
  - `public/menu/` — one photo per dish
  - `public/scene/` — hero, signature plates, gallery, about
  - `public/brand/` — logo

### How we got the photos
- **TheMealDB API** — free, real Indian food images. We searched for each dish and downloaded the matching photo.
- **Foodish API** — backup source for dishes TheMealDB doesn't cover (mostly desserts).
- **Unsplash photos** — curated, hand-picked stock photos for the hero / scene shots.
- The download script is `scripts/fetch-images.mjs`. Re-run it if you want to refresh images.

### Next.js Image component (via `<FoodImage>` wrapper)
- **What it does**: Optimises images on the fly — resizes for the device, converts to modern formats, lazy-loads when off-screen.
- **Why we wrap it**: Our `<FoodImage>` component falls back to a graceful "Photography coming soon" card if any image fails to load.
- **Where it lives**: `src/components/shared/food-image.tsx`.

---

## 6. Shareable plate links

### `plate-encode.ts` + the `/plate/[token]` route
- **What it does**: Encodes the current plate (list of dish IDs + quantities + guest count) into a compact base64url token. Visiting `/plate/<token>` decodes it server-side and renders a read-only summary with "Customise this plate" and "Enquire on WhatsApp" actions.
- **Why it's stateless**: The whole plate lives in the URL — no database, no account, no expiry. Anyone with the link can open it.
- **Where it lives**: `src/lib/plate-encode.ts` (encode/decode), `src/app/plate/[token]/page.tsx` (route), `src/components/plate/shared-plate-view.tsx` (renderer), `src/components/plate/shared-plate-actions.tsx` (action buttons), `src/components/plate/shared-plate-qr.tsx` (the QR code shown on the share page). The WhatsApp deep-link in `enquiry-dialog.tsx` embeds this URL.

### `qr.ts` + the `qrcode` package
- **What it does**: Generates QR codes (PNG data-URL or SVG string) that point at the share-plate URL. Used in three places: the QR card on the share-plate page, the QR in the corner of the downloaded PDF quote, and the QR baked into the saved WhatsApp PNG image.
- **Why it matters**: A printed quote or a WhatsApp-forwarded image can be picked up by a phone camera — the recipient lands on the live plate without any typing.
- **Where it lives**: `src/lib/qr.ts`.

---

## 7. PDF & image generation

### jsPDF (used by four generators)
- **What it is**: A JavaScript library that creates PDF files directly in the customer's browser. No server needed, no external service.
- **Where it lives — four call sites**:
  - `src/lib/pdf-quote.ts` — the **branded quote PDF** (per-plate, totals, extras, GST, QR). Generated from the enquiry dialog. _Currently kept as a library function even though the customer-facing "Download PDF" button has been removed — the PDF is still produced internally for the WhatsApp-image generator (which loads its rupee font from the same code path) and can be re-surfaced later._
  - `src/lib/menu-card.ts` — the **guest-facing A5 menu card** (no prices, no QR, just dish names by course). Generated from the enquiry dialog as "Menu card".
  - `src/lib/full-menu-pdf.ts` — the **A4 catalog brochure** of the entire Pankti menu. Generated from the "Download full menu" button on the menu page.

### Canvas (used by the WhatsApp image)
- **What it is**: Native HTML `<canvas>` 2D drawing, no library. Renders a tall PNG of the plate (header, dishes, extras, totals, QR) sized for WhatsApp forwarding.
- **Where it lives**: `src/lib/plate-image.ts`.

### `whatsapp-preview.tsx`
- **What it does**: Before any WhatsApp deep-link is opened, the user sees a modal styled like a real WhatsApp chat showing the exact outgoing message bubble, with Copy / Open buttons and a clear "PREVIEW · NOT YET SENT" banner.
- **Why**: For an MVP where the placeholder phone number can't actually receive messages, this lets you (or a tender judge) verify the *content* of the message. Once the real number is set in `SITE.whatsapp`, the same modal continues to work, just with the Send button going to the live chat.
- **Where it lives**: `src/components/shared/whatsapp-preview.tsx`.

---

## 8. Project structure

```
pankti/
├── public/                  Real files served as-is (images, brand)
│   ├── menu/               One photo per dish
│   ├── scene/              Hero, signature plates, gallery
│   └── brand/              Logo
│
├── src/
│   ├── app/                One folder per route — each contains a single page.tsx
│   │   ├── page.tsx        Home page (just imports landing components)
│   │   ├── menu/page.tsx   ← Thin shells. No logic lives here.
│   │   ├── about/page.tsx
│   │   ├── compare/page.tsx
│   │   ├── plate/[token]/page.tsx  Read-only view of a shared plate
│   │   ├── ...
│   │   ├── layout.tsx      Global wrapper — fonts, navbar, footer, providers
│   │   └── globals.css     Design tokens, animations, theme variables
│   │
│   ├── components/         All UI lives here, grouped by feature
│   │   ├── landing/        Hero, occasion picker, signature plates section, etc.
│   │   ├── menu/           Menu grid, item card, filters, menu page wrapper,
│   │   │                   "Download full menu" button
│   │   ├── plate/          Plate panel, balance meter, dietary badge, extras,
│   │   │                   delivery picker, auto-suggest, enquiry dialog,
│   │   │                   exit-intent dialog, wedding planner, share-plate
│   │   │                   view / actions / QR, saved-plates section
│   │   ├── gallery/        Gallery grid, lightbox
│   │   ├── about/          Founder note
│   │   ├── contact/        Contact page wrapper
│   │   ├── signature-plates/  Signature plates page wrapper
│   │   └── shared/         Navbar, footer, logo, theme toggle, scroll-to-top,
│   │                       WhatsApp bubble + preview modal, preloader,
│   │                       social-proof toast, compliance strip, info-tip, etc.
│   │
│   ├── data/               Static content (menu, plates, festivals, team, etc.)
│   │
│   └── lib/                Shared helpers — small, reusable, no JSX
│       ├── site.ts         Business info, SITE_URL, COMPLIANCE config
│       ├── utils.ts        Format helpers (formatINR, sceneImage, etc.)
│       ├── plate-store.ts  Plate state, rentals/GST/discount model,
│       │                   dietary summary, market reference, totals helper
│       ├── saved-plates.ts Saved plates + wedding-bundle event tagging
│       ├── lightbox-store.ts   Gallery lightbox state
│       ├── plate-encode.ts Share-link encoding (base64url of plate + guests)
│       ├── qr.ts           QR code generation (PNG / SVG)
│       ├── pdf-quote.ts    Branded quote PDF (per-plate, extras, GST, QR)
│       ├── plate-image.ts  WhatsApp-shaped PNG of the plate
│       ├── menu-card.ts    Guest-facing A5 menu card PDF
│       └── full-menu-pdf.ts  A4 catalog brochure of the full menu
│
├── scripts/                One-time scripts (image fetching)
├── .env.example            Documents NEXT_PUBLIC_SITE_URL for deploy
└── DOC/                    Documentation (this folder)
```

**The golden rule**: a file in `app/` only **imports and renders** a component. All the JSX, helpers, constants, and data composition live inside `components/` or `lib/`.

---

## 9. How the site is built and served

### Static prerendering
Next.js builds every page into an HTML file at build time. When a customer visits, they get instant HTML, then the interactive parts (the plate builder, the lightbox) load on top.

This means:
- **Fast first load** — under a second on most connections
- **Cheap to host** — no server doing work for every request
- **Works on any host** — Vercel, Netlify, even GitHub Pages

### Build commands

```bash
npm run dev      # Run locally for development
npm run build    # Create the production build
npm run start    # Serve the production build
npm run lint     # Check code style
```

### What happens on `npm run build`
1. TypeScript checks every file for errors
2. Tailwind generates the final CSS from used classes
3. Next.js bundles JavaScript and pre-renders every page
4. Images get optimised for different device sizes
5. The result lands in `.next/` ready to deploy

---

## 10. Things we deliberately did NOT use

We made choices to keep the project simple. We did **not** add:

- **A database** — static data is enough for v1
- **A backend API** — same reason; enquiries are saved client-side for now
- **User authentication** — no logins needed; customers stay anonymous
- **Redux** — Zustand is simpler for our scale
- **A CSS-in-JS library** (styled-components, Emotion) — Tailwind is faster and more readable
- **A UI kit** (Material-UI, Chakra) — they're too generic; we built a small set of custom components instead
- **Real-time features** (WebSockets, Pusher) — WhatsApp is the live channel
- **Server actions for forms** — enquiries are stored locally; will move to Supabase in Phase 2

Each "no" is a deliberate choice to keep the codebase small and fast.

### Configuration on deploy

One environment variable controls the site's canonical URL:

```
NEXT_PUBLIC_SITE_URL=https://pankti.com   # or whatever your host is
```

Where it's used:
- `app/sitemap.ts` — every URL in the sitemap
- `app/robots.ts` — sitemap reference
- `app/layout.tsx` — `metadataBase` for OpenGraph / Twitter card / canonical tags
- `components/plate/wedding-planner.tsx` — SSR fallback when building share links

Customer-facing share links built **in the browser** (the WhatsApp message bodies, the QR-code targets, the share-plate URL) use `window.location.origin` and therefore reflect whatever host the visitor is on — they don't need this variable.

If you don't set it, sitemap and OG tags fall back to `http://localhost:3000` (functional but wrong for SEO). Set it on Vercel under Project Settings → Environment Variables (Production scope), or via your build pipeline on other hosts. See `.env.example` at the project root.

---

## 11. When to move to Phase 2

We'll add a real backend when **any one** of these becomes true:
1. The caterer wants to edit dishes/prices without a developer
2. We start losing enquiries because the customer cleared their browser
3. We want analytics on what's being ordered
4. We want to send automatic email/WhatsApp confirmations

When that happens, the plan is **Supabase** (a hosted database with auth, file storage, and edge functions all in one). The static data files already mirror what a database would look like, so migration is mostly a copy job.
