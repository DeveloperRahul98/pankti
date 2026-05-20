# Pankti — Product Requirements Document

*Last updated: 2026-05-20 (Phase 1 feature-complete)*

---

## 1. What is Pankti?

**Pankti is a website for a catering business in Hyderabad.**

It lets a customer build the exact food plate they want for an event — a wedding, pooja, birthday, or office function — and send the order details directly to the caterer. The customer picks dishes one by one, sees the price update live, names their guest count, and submits the plate. The caterer receives all of it and prepares for the day.

The name *Pankti* (पंक्ति) comes from the Hindi word for **the traditional row of guests seated to share a meal** — the spirit of community around food. It's a fitting name for what the business does.

---

## 2. Who is this for?

### Primary user: The host
The person planning the event — usually a parent, a couple, or an office manager. They are:
- Booking food for **20 to 500 guests**
- Looking for **high-quality, traditional Indian catering**, not fast food
- Often **not very tech-savvy** but comfortable using WhatsApp and Google
- Wants to **see what they're ordering** before they commit
- Wants to **know the price upfront** without back-and-forth calls
- Cares about **trust** — they want to know the caterer is legitimate

### Secondary user: The caterer (admin / business owner)
Rahul, the founder. He:
- Needs to **receive enquiries with full plate details**
- Wants new customers to find him **without expensive marketing**
- Manages a small kitchen team
- Cooks for several functions a week

---

## 3. The problem we are solving

### Before Pankti
Most catering bookings in India start with a phone call:
1. Customer asks for a menu
2. Caterer reads it out
3. Customer says "I want this, this, this..."
4. Caterer scribbles it down
5. Customer asks the price
6. Caterer estimates a number
7. They go back and forth on changes
8. Mistakes happen, expectations differ, the day becomes stressful

### After Pankti
1. Customer opens the website
2. Picks an occasion (wedding, pooja, etc.)
3. Browses real photos of every dish
4. Adds dishes to a "plate" — sees the per-plate price grow
5. Enters guest count — sees the total cost
6. Sends an enquiry with name, phone, event date, address
7. Caterer calls or WhatsApps back to confirm

The plate is now **a clear, written record** — no miscommunication.

---

## 4. Core features

### 4.1 Build-your-own plate
The heart of the product. The customer:
- Browses all available dishes
- Filters by veg / non-veg, cuisine (South / North), Jain-friendly, or max price per item
- Searches by dish name
- Adds dishes one by one with a "+" button
- Sees a side panel that updates live with:
  - The list of chosen dishes
  - Per-plate price (sum of items)
  - Total cost (per-plate × guest count)

### 4.2 Signature plates
Four pre-curated plate templates designed by the caterer:
- **Wedding Feast** — the grand traditional spread
- **Pooja Bhojan** — pure vegetarian, Jain-friendly
- **Birthday Special** — a crowd-pleaser
- **Corporate Lunch** — light and timely

A customer can load any signature plate as a starting point, then customise.

### 4.3 Plate balance meter
Shows the customer how complete their plate is — Starter, Rice, Curry, Bread, Sweet. Like a chef quietly guiding them: *"You've got a starter and a main, but no sweet yet."*

### 4.4 Chef's suggestion
When a customer adds biryani, the app suggests Mirchi Bajji ("balances the heat"). When they add paneer butter masala, it suggests butter naan. Subtle, contextual recommendations.

### 4.5 Save plates
A customer can save a plate they've built ("Mom's 60th") and come back later. They can compare two saved plates side by side before deciding.

### 4.6 Shareable plate links + QR codes
Any plate can be encoded into a short URL (`/plate/<token>`) and shared. Opening the link shows a read-only summary plus two buttons: *Customise this plate* (loads it into the visitor's own builder) and *Enquire on WhatsApp*. The same link is auto-attached to the WhatsApp message when a customer submits an enquiry, so the caterer receives the exact plate one tap away.

A **QR code** pointing at the same URL appears on:
- The share-plate page itself (so a host can show their phone to a guest who scans it)
- The downloaded PDF quote (so a printed quote can be re-opened by phone camera)
- The saved WhatsApp PNG image (so a forwarded image is camera-actionable)

### 4.7 Budget mode
The customer can set a target **per-plate budget**. As they add dishes, the effective per-plate number turns green (under), saffron (within 10% over) or red (clearly over). If they go red, the panel suggests which dish to drop to come back in range — one-tap removal. The budget tracks the **all-in** number once extras / GST / delivery are involved, so it never lies.

### 4.8 Extras & rentals
Everything beyond food, in one collapsible section:
- **Drinking water** (₹10 / guest)
- **Serving style** — mutually exclusive: *Disposable plates* (₹15 / guest) vs *Reusable steel crockery* (₹25 / guest, we bring and wash)
- **Furniture rental** — tables (₹100), chairs (₹20), table cloths (₹5)
- **Service staff** — servers / waiters (₹500 each per event, with a "suggested N" link based on 1 per 25 guests)

### 4.9 Delivery & setup
A standalone collapsible row at the same level as Extras — every event has to answer "where is this going?" Three zones: *Pick up* (free), *Within Hyderabad* (₹500), *Outer Hyderabad* (quote on call). Header shows the current selection as a chip.

### 4.10 Full pricing ledger + GST + effective per plate
The plate panel shows a small itemised ledger:
- Food (per-plate × guests)
- Extras & rentals
- Delivery & setup
- Loyalty discount (if applied — see 4.13)
- GST (5%) — configurable; set `GST_RATE` to 0 for sub-threshold caterers
- **Estimated total** in saffron
- **Effective / plate** — the all-in number divided by guests, side-by-side with the total

The same breakdown appears in the PDF quote and the saved image — no surprises off-screen.

### 4.11 Market-reference anchor
Under the ledger, a small line shows the local market range for the customer's occasion type (e.g. *"Hyderabad weddings typically run ₹500–₹800 per plate"*). If the customer's effective per-plate sits **below** the low end of that range, the line turns green with a **Great value** badge — an anti-objection signal at the moment the customer is comparing the total against their budget.

### 4.12 Dietary summary badge
Auto-computed strip below the balance bar showing the menu mix at a glance:
- Veg count + Non-veg count (or a single "All-veg menu" pill when applicable)
- Jain-safe count (when ≥ 1)
- Overall heat level (*Mild · Medium · Hot · Fiery · Mixed heat*)

The same one-line summary lands in the WhatsApp message and the PDF quote so the caterer can plan portions and seasoning without a follow-up call.

### 4.13 Exit-intent loyalty discount
If the customer has built a plate of ≥ 2 dishes and signals they're about to leave (mouse leaves through the top of the viewport on desktop; tab/app switch on mobile), a saffron modal slides in offering **5% off** if they submit their enquiry today. Accepting:
- Adds a green "Loyalty discount (5%)" line to the ledger, PDF, and image
- Shows a "✦ 5% loyalty discount locked in" chip on the enquiry success screen
- The caterer honours it on call-back

Modal fires at most once per browser session.

### 4.14 Wedding bundle (multi-event quotes)
Indian weddings have 3–5 functions. The host can tag any saved plate with a wedding event type (Engagement / Haldi / Mehendi / Sangeet / Wedding day / Reception / Other) and an event date. Once ≥ 2 plates are tagged, a **Wedding bundle** section appears on the home page with all events in date order, a combined estimate across the whole celebration, and a **single** *"Send full bundle on WhatsApp"* CTA that packages every event (with dates, guest counts and share-plate links) into one message.

### 4.15 Send enquiry
A short form: name, phone, event date, occasion, venue, notes for the chef (spice level, allergies, special requests). Submitted enquiry is stored locally on the customer's device (for now — backend planned). After submit, the customer gets three deliverables:
- **Send on WhatsApp** — opens a faithful **preview modal** of the outgoing chat message first (with Copy and Open in WhatsApp), so the customer sees exactly what the caterer will receive before sending
- **Save as image** — a tall WhatsApp-shaped PNG with the dish list, full ledger and QR; opens the native share sheet on phones
- **Menu card** — a guest-facing A5 PDF (no prices, no QR) for printing and placing on event tables

### 4.16 Full menu brochure
A "Download full menu" button on the menu page generates an A4 PDF brochure of the **entire** Pankti catalog — all dishes, organised by course, with prices, descriptions and badges (Jain-safe / Spicy). Useful for sharing the menu on WhatsApp with a relative who doesn't want to open the website, or for printing for the kitchen.

### 4.17 Trust & compliance footer strip
A card at the bottom of every page surfaces compliance signals tender committees and corporate buyers check first:
- FSSAI registration number
- GSTIN
- ISO 22000 / HACCP certifications
- Years in business (calculated live from `establishedYear`)
- Payment options (UPI / NEFT / cheque / GST invoices) and a note that hygiene audits are welcome at the kitchen

FSSAI and GSTIN are also repeated in the very bottom credit row so they're visible no matter how briefly the footer is scrolled.

### 4.18 Other touches that build trust
- **Live availability** — *"Next 2 weekends booked · Mid-June onwards open"*
- **Recent enquiry social proof** — small toasts: *"Sneha M. sent a plate for 220 guests · 4 min ago"*
- **Festival banner** at the top — *"Diwali menu now live"*
- **Recipe of the week** — a story about one dish, in Pankti's voice
- **Festival calendar** — upcoming festivals with suggested plates
- **Photo gallery** — past events
- **Testimonials** with names + occasions
- **About page** with founder story, team, and signature
- **Floating WhatsApp button** — bottom-right, always one tap from a chat

---

## 5. What the customer never has to do

The product is designed so a customer **never has to**:
- Sign up or create an account
- Pay for anything online (catering is paid in person, by agreement)
- Wait for a page to load (the site is static and fast)
- Worry about losing their plate (it's saved on their device automatically)
- Speak English perfectly (descriptions are short and friendly)

---

## 6. Business goals

| Goal | How Pankti supports it |
|---|---|
| **Get more enquiries** | Anyone with a phone can submit a plate in 3 minutes |
| **Reduce time on the phone** | The plate is already built when the customer calls |
| **Win premium clients** | The site looks high-end, signaling quality |
| **Be discoverable** | SEO-friendly (one URL per page, real text, fast loads) |
| **Convert curious visitors** | Trust signals everywhere — testimonials, awards, photos |
| **Build a brand** | Consistent saffron-on-charcoal premium look, distinct voice |

---

## 7. Non-goals (for now)

These were considered and **deferred** to keep the product focused:
- Online payments (catering is invoice-based)
- Customer login / account creation
- Real-time chat with the caterer (WhatsApp does this better)
- Multi-vendor marketplace (Pankti is one business)
- Mobile apps (the website is mobile-friendly)
- Multiple languages (English only for v1)
- Live order tracking (this is catering, not delivery)

---

## 8. Success looks like

For the **customer**:
- They can find Pankti through a Google search
- They can build a plate, send an enquiry, and download a quote in under 5 minutes
- They feel like they're dealing with a serious, premium business

For the **caterer**:
- New enquiries arrive ready-to-discuss
- Customers come in pre-educated about the menu
- The website does the heavy lifting of explaining the business

---

## 9. The roadmap

### Phase 1 — Static MVP (current)
- Everything described above, working end-to-end
- Data stored statically in code, enquiries saved on customer's device

### Phase 2 — Backend
- A real database (Supabase) for the menu and enquiries
- An admin dashboard for the caterer to:
  - Add or remove dishes
  - Update prices seasonally
  - See all enquiries in one place
  - Mark dates as unavailable
- Email and WhatsApp notifications on new enquiry

### Phase 3 — Growth features
- Customer reviews after each event
- Repeat-customer perks
- Real-time availability calendar
- Telugu / Hindi language toggle
