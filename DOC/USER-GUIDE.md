# Pankti — User Guide

*Everything you need to know to plan a feast through Pankti. No prior experience needed.*

*Last updated: 2026-05-20*

---

## What is this?

**Pankti** is a website where you can design the exact food plate you want for your event, see the price live, and send the details directly to the caterer.

Whether it's a wedding for 300, a pooja for 40, a birthday for 20 or a corporate lunch for 80 — you can put together your menu without a single phone call. Once you're happy, send it. The caterer (Rahul) calls you back, usually within the hour.

You don't need to sign up. You don't need to pay anything online. You don't need an app.

---

## Quick start (under 2 minutes)

1. Open the website (`http://localhost:3000` while developing, or your live address)
2. On the homepage, click **"Build your plate"** in the hero
3. On the menu page, tap **+ Add** on dishes you like — your plate fills up on the right
4. Set how many guests are coming (default is 50)
5. Click **Send enquiry**, fill in your name, phone, and event date
6. Submit. The caterer gets in touch.

That's it. The rest of this guide is a tour of everything else you can do.

---

## The home page

When you arrive at Pankti, you'll see:

### The hero
A warm "Good morning / afternoon / evening" greeting (it changes with the time of day), a big headline, and a short pitch. Below are four numbers: how many events we've catered, how many dishes are on the menu, our guest rating, and how many years we've been doing this. The numbers count up when the page loads.

The two big buttons take you to either the menu (to start building) or the signature plates (curated options).

### Availability strip
Just under the hero, four little cards tell you:
- Which weekends are already booked
- When we're next available
- How fast we reply
- Whether wedding dates are filling up

If you see *"Next 2 weekends booked"*, you'll know to plan ahead.

### Occasion picker
Four cards: Wedding, Pooja & Housewarming, Birthday & Anniversary, Corporate Event. **Tap any one** and we'll preload the matching signature plate on the menu so you start with something sensible.

### Signature plates
Four plates we've perfected through hundreds of functions. Each shows a photo, what it's for, and the starting price per plate.

### Featured in / awards
A small strip showing press mentions and credentials (FSSAI certification, Google rating).

### How it works
Three numbered cards explaining the flow:
1. Pick the occasion
2. Build your plate
3. Send the enquiry

### Recipe of the week
A short story about one dish we're proud of. Just for reading — gives you a sense of how we cook.

### Recent feasts
A grid of photos from past events. **Click any photo** to open it full-screen in a gallery viewer (see "Gallery viewer" below).

### Testimonials
Real client quotes with their names and what we catered.

### Festival calendar
Upcoming festivals (Ugadi, Akshaya Tritiya, wedding season, Diwali). Each card shows how many days until the date and what menu we suggest.

---

## Building your plate (the menu page)

This is where most of your time will be spent. Here's everything that's on the page.

### The filters

A single row of controls at the top:
- **Search** — type a dish name to find it instantly
- **All / Veg / Non-veg** — filter by diet
- **All / South / North** — filter by cuisine
- **Jain** — toggle on to only show dishes without onion or garlic
- **Price** — opens a small popover where you can cap the price per item (preset chips: Any, ≤₹50, ≤₹100, ≤₹200, or drag the slider)

Filters apply instantly. The menu below shrinks to what matches.

### The dietary summary badge

Right below the balance bar in the plate panel, a small auto-computed strip tells you the menu mix at a glance — useful when planning for mixed crowds (corporate events, weddings with Jain or pure-veg guests, etc.):

- A **green-dot chip** with the veg count (e.g. *"● 6 veg"*) and a **red-dot chip** with the non-veg count
  - If the plate is entirely vegetarian, the two chips collapse into a single saffron-tinted **"All-veg menu · N dishes"** badge
  - Same for an all-non-veg plate
- A **leaf chip** with the Jain-safe count when ≥ 1 of the dishes is Jain-friendly (e.g. *"🌿 2 Jain-safe"*)
- A **flame chip** with the overall heat level — *Mild · Medium · Hot · Fiery · Mixed heat* — derived from the spice levels of the spicy dishes on your plate

The same mix gets included as a "_Menu mix: 6 veg, 3 non-veg, 2 Jain-safe · medium heat_" line in:
- The WhatsApp message preview
- The downloaded PDF quote (as a small saffron **MENU MIX** sub-line just above the items table)

This reassures the host that the plate fits their guest list and gives the caterer planning information up-front.

### How the menu is laid out

Dishes are grouped into nine **course sections**, each with its own heading and a small count:

1. **Starters**
2. **Soups**
3. **Rice & Biryani**
4. **Breads**
5. **Curries**
6. **Dals**
7. **Sides & Chutneys**
8. **Sweets**
9. **Beverages**

When a filter hides every dish in a course, that whole section disappears so you don't see empty headings.

### The dish cards

Every dish has:
- **A real photo**
- **Veg / non-veg dot** (green or red) in the top-left of the photo
- **Jain badge** on the top-left if applicable
- **An ⓘ icon** in the top-right — hover or tap to read the full description and learn what the dish is (helpful for unfamiliar names)
- **Name**, **price per plate**, **two-line description**
- **Spice level** shown as small flame icons (1, 2, or 3 flames)
- **+ Add button** — tap to add to your plate. After adding, the button turns into a − / quantity / + stepper.

### Your plate (the right panel)

As soon as you add a dish, the panel on the right starts filling up. It always stays visible while you scroll.

From top to bottom:
- **Header** — "Your plate · 4 items · 4 servings". Two icons: save (bookmark) and clear (trash).
- **Balance bar** — a saffron progress bar showing how complete your plate is. Below it, small pills for Starter, Rice, Curry, Bread, Sweet — green check if you have one, grey X if not.
- **Items list** — the dishes you've added, with their price and a −/+ stepper next to each. This list scrolls within its own area.
- **Chef suggests** — when a smart pairing exists ("You added biryani; pair with Mirchi Bajji"), a small saffron banner appears with a one-tap Add button.
- **Extras & rentals** — a collapsible section for everything beyond food. Click to expand and you'll see:
  - **Drinking water** — toggle bottled water at ₹10/guest.
  - **Serving style** — pick one (the two are mutually exclusive):
    - **Disposable plates, cups & cutlery** (₹15/guest) — one-time use, quick cleanup. Common for office lunches and casual functions.
    - **Reusable steel crockery** (₹25/guest) — stainless steel plates, glasses and serving spoons we bring, set up and take back to wash. No throwaway waste, looks premium. Standard for weddings and poojas.
  - **Furniture rental** — three numeric fields: **tables** (₹100 each), **chairs** (₹20 each) and **table cloths** (₹5 each).
  - **Service staff** — number of servers / waiters you'd like (₹500 per server per event). Each guest count shows a "suggested **N**" link — tap it to autofill the recommendation (1 server per 25 guests).
  - When any extra is selected, the header shows a saffron **"+ ₹X"** chip and the estimated total in the ledger card updates instantly. The same breakdown appears in the downloaded PDF and the saved image.

- **Delivery & setup** — its own section right below "Extras & rentals" (because every event has to answer "where is this going?"). Pick one of three zones:
  - **I'll pick up from the kitchen** — Free
  - **Within Hyderabad city (≤ 20 km)** — ₹500
  - **Outer Hyderabad — quote on call** — distance varies; we agree the rate on the phone (no fixed price shown)
- **Estimated total ledger** — a small itemised card at the bottom that shows: Food, Extras, Delivery, Loyalty discount (if any), Subtotal, GST (5%), and the big **Estimated total** in saffron. Beside it, an **Effective / plate** number tells you what each guest's plate actually costs once everything is rolled in. If a budget is set, the effective number is what's compared — green/saffron/red — so the budget feature reflects reality, not just the food.
- **Market reference** — below the ledger, a small line like *"Hyderabad weddings typically run ₹500–₹800 per plate"*. When you're under the local average, it lights up green with a **Great value** badge — useful reassurance when comparing quotes.
- **Guests** — type how many people are coming (default 50)
- **Budget / plate** — *optional*. Set a target per-plate price (e.g. ₹400). As you add dishes, the per-plate number shifts colour:
  - **Green** — under your target, with the headroom shown
  - **Saffron** — within 10% over (easy to trim)
  - **Red** — clearly over, with a one-tap **Drop** button that removes the priciest item to bring you closer to budget
- **Per plate / Total** — two side-by-side numbers. Per plate is the sum of your items (coloured by budget status if a budget is set, with your target shown beside it). Total is per plate × guests.
- **Send enquiry** — a big saffron button. Clicking it opens the enquiry form.

### Planning a wedding (multi-event quote)

Indian weddings are rarely one function — there's a sangeet, a haldi, sometimes a mehendi, the wedding day itself, and a reception. Pankti lets you plan all of them in one go and send the caterer **one** enquiry covering the entire celebration.

How it works:

1. **Build the menu for the first event** (say, the sangeet), set the guest count, and save the plate with a name like "Sangeet menu".
2. On the home page under **Your saved plates**, you'll see the card with a small **"+ Tag for wedding bundle"** link below the title. Click it.
3. A small tagger appears — pick the **event type** (Engagement / Haldi / Mehendi / Sangeet / Wedding day / Reception / Other) and an optional **date**. Tags save instantly.
4. Repeat for each function — go back to the menu, build a different plate, save it, tag it.
5. As soon as you have **two or more** tagged plates, a new **Wedding bundle** section appears at the top of the saved-plates area on the home page. It shows every event in chronological order with its date, guest count and per-event estimate, plus a **combined total** for the whole wedding.
6. Tap **Send full bundle on WhatsApp** — it opens WhatsApp with a pre-filled message that lists every event, its date, guest count, total, and a clickable share-plate link for each, ending with the combined estimate. The caterer gets the entire wedding plan in one message and calls you back with a single coordinated quote.

The bundle section also surfaces three trust signals — *one quote, one call-back, one team · bundle discount on multi-event bookings · coordinated menus across days*.

### Saving a plate

Click the small bookmark icon in the plate header. Your plate is saved on your device with the date as the default name (e.g., "Plate · 13 May"). You can rename it on the home page where saved plates appear.

### Clearing the plate

Click the small trash icon in the header. The plate empties immediately.

### On mobile

On a phone, the right panel doesn't appear. Instead, when you've added at least one dish, a **saffron bottom bar** sticks to the bottom of the screen showing "3 items · ₹450/plate". Tap it to slide up the full plate as a sheet covering most of the screen.

---

## The "wait, here's a discount" prompt

If you've built a plate of two or more dishes and then move to leave the page (close the tab, switch to another app on your phone, or move your cursor up toward the address bar on desktop), a friendly modal pops up offering **5% off** if you submit your enquiry today. One tap on **Apply 5% & send enquiry** locks in the discount and opens the enquiry form — your plate is already saved, so you just confirm name + phone.

You'll see "5% loyalty discount locked in for this enquiry" as a small badge on the success screen, and a "Loyalty discount" line gets added to the ledger, the PDF and the saved image. The discount confirms when the caterer calls you back.

The modal shows at most **once per visit** — closing it doesn't bring it back later in the same session. If you accept and then choose not to submit, the discount stays applied for the rest of the session.

---

## The enquiry form

When you click **Send enquiry**, a dialog slides in from the bottom (or appears centred on desktop).

**Required fields**:
- **Your name**
- **Phone**

**Helpful but optional**:
- **Event date**
- **Occasion** (drop-down — Wedding, Birthday, Corporate, etc.)
- **Venue / address**
- **Notes for the chef** — a freeform field for spice level (Mild / Medium / Hot / Fiery), allergies, timing constraints, or any special requests — anything the chef should know before cooking.

Three buttons at the bottom:
- **Send enquiry** — saves the enquiry on your device. The caterer is alerted (in Phase 2 this will email/WhatsApp them automatically).
- **Save as image** — generates a tall, WhatsApp-shaped PNG of the plate (dish list, per-plate + total, QR code, brand strip). On a phone, this opens the native share sheet so you can send it straight to a contact or a WhatsApp group; on desktop it just downloads the file. Useful because most Indian users forward screenshots/images on WhatsApp, not PDFs.
- **Menu card** — generates a print-ready, **A5 portrait menu card** with just the dish names organised by course (no prices, no customer info, no QR). Designed to be printed and placed on guest tables at your event. The header shows your occasion + date if you've filled them in, with a small *"with love · Pankti Catering"* footer. Veg / non-veg dots beside each dish so guests can scan at a glance.

### Download the full menu (as a brochure)

At the top-right of the menu page, **"Download full menu"** generates a branded A4 PDF brochure of *every dish* Pankti offers — organised by course, with prices, descriptions and veg/non-veg / Jain-safe / spicy badges. Useful for:

- Forwarding the menu on WhatsApp to a relative who doesn't want to browse the website
- Printing for the kitchen wall as a quick reference
- Attaching to an email when sending a proposal

Two-column layout, auto-paginated, with the Pankti brand strip on top and contact details on the bottom of every page. Fully offline once downloaded.

After you submit, you see a confirmation screen with a **"Send on WhatsApp"** button — one tap opens WhatsApp with a pre-filled message that includes the occasion, date, guest count, the estimated total, and a **shareable link to your exact plate** (see "Sharing a plate" below). This is the fastest way for us to respond.

---

## Sharing a plate

Every plate can be turned into a **link** that anyone can open — no app, no login.

The link looks like `…/plate/<token>` where the token is a compact encoding of the dishes and guest count. It's generated automatically when you tap **Send on WhatsApp** from the enquiry confirmation, and it's also what the caterer receives.

When someone opens a shared plate, they see:
- A read-only summary of the dishes, per-plate price and estimated total
- A **Customise this plate** button — loads it into their own builder so they can adjust freely
- An **Enquire on WhatsApp** button — opens a chat to Pankti referencing the same link

Useful when:
- You want a family member to weigh in before sending the enquiry
- The caterer wants to show a quote back to you
- You want to text a plate idea to a friend planning a similar event

---

## Signature plates page

If you don't want to build from scratch, this page shows our four curated plates in full detail.

For each plate, you'll see:
- A big photo
- The occasion it's designed for
- A tagline and full description
- The complete list of dishes with prices
- The starting per-plate price
- **Load this plate** button — clicking it loads the plate into the menu builder where you can adjust freely

---

## Compare plates

If you've saved at least two plates, the **Compare** page lets you put any two side-by-side.

Each side shows:
- The plate's name
- Number of dishes and guests
- Every dish with a ✓ — items unique to that plate are tagged "unique"
- Per-plate price and total cost

Useful when you're torn between two ideas (e.g., a vegetarian version vs. a mixed one).

---

## Gallery page

The full photo gallery — eight photos from past events. **Click any photo** to open the gallery viewer.

### The gallery viewer (lightbox)

When you click a photo, a full-screen viewer takes over. Inside, you can:

- **Mouse wheel** to zoom in (up to 4×) and out
- **Double-click** the image to toggle between fit and 2× zoom
- **Click and drag** the image to pan when zoomed in
- **Swipe left/right** (on touch screens or with mouse drag at fit) to move between images
- **← →** arrow keys to navigate
- **Escape** to close
- **+ / −** keys (or the corner buttons) to zoom
- **0** to reset zoom

At the bottom, a strip of thumbnails shows every photo. The **active photo** is bigger and has a saffron ring around it. Tap any thumbnail to jump to it. The strip auto-centres on the active photo.

The top bar shows the photo number (3 / 8), caption, zoom percentage, and zoom controls.

---

## About page

Two parts:
- **Our story** — a short paragraph about how Pankti started and what the name means
- **What we believe** — four cards on our principles
- **Founder note** — a quote from Rahul with a hand-drawn signature
- **Team** — the small kitchen team with their roles, years with us, and a quote each

---

## Contact page

Six cards, each clickable:
- **WhatsApp** — opens a chat
- **Call us** — dials directly
- **Email** — opens your email app
- **Kitchen address** — the location
- **Hours** — when we're open
- **Instagram** — our handle

Below that, an embedded Google Map of the kitchen.

---

## The footer trust strip

At the bottom of every page, a saffron-accented strip surfaces our compliance and audit signals — the things a tender committee or corporate buyer checks first:

- **FSSAI registration number** — the mandatory licence for any food business in India
- **GSTIN** — proves we're legally GST-registered and can issue compliant invoices
- **Certifications** — ISO 22000 (food safety) and HACCP compliance
- **Years in business** — calculated live from the year we were established

Below the strip, a short line spells out payment options ("UPI · NEFT · Cheque · GST invoices on request") and notes that hygiene audits at the kitchen are welcome on appointment. The FSSAI number and GSTIN are also repeated in the very bottom credits row so they're visible no matter how briefly you scroll the footer.

The actual numbers and certifications live in `src/lib/site.ts` under `COMPLIANCE` — update them once the registrations come through.

---

## Floating buttons

Wherever you are on the site, you'll see two small floating elements:

### Bottom-right
- A green **WhatsApp button** with the WhatsApp logo. Click to open a chat with a pre-filled greeting. (After about 8 seconds on your first visit, a small chat bubble pops up from it offering help — feel free to dismiss it.)
- A saffron **scroll-to-top button** above it (appears once you've scrolled down) — click to glide back to the top of the page.

### Bottom-left
- A small **social proof toast** that occasionally fades in: *"Sneha M. sent a plate for 220 guests · 4 min ago"*. It rotates through several real-feeling notifications. Disappears on its own.

### Top of the page
- A thin **saffron progress bar** at the very top edge — shows how far you've scrolled.

---

## Theme toggle

In the navbar (top right), there's a small **sun / moon icon**. Click it to switch between dark mode (default) and light mode. Your choice is remembered for next time.

---

## Festival banner

At the very top of every page, you might see a saffron strip with a current festival's name and menu theme (e.g., *"Wedding Season menu · Grand wedding feast · 12-course thaali"*). Click "See plate" to jump to the matching signature plate. You can dismiss it with the X — it won't come back during your session.

---

## Frequently asked questions

### Do I need to create an account?
No. Your plate is saved on your own device, so you can come back to it later without logging in.

### What happens to my plate if I close the browser?
It stays. We save it on your device automatically. When you come back, it's still there.

### Can I save more than one plate?
Yes — click the bookmark icon to save the current plate with a name. Your saved plates appear on the home page in a section titled "Your saved plates".

### Will my information be shared?
Only with the caterer (Rahul), and only when you click Send enquiry. We don't track you, run ads, or sell anything. The enquiry sits on your device until we add a real backend (Phase 2).

### Can I order online?
Not yet. You build the plate and send the enquiry; the caterer calls or WhatsApps to confirm. Payment is handled the traditional way — in person, by agreement, after the event.

### What if I don't know what a dish is?
Click the **ⓘ icon** in the top-right of any dish card. A small tooltip explains what the dish is in plain English.

### I'm planning for a small gathering (< 20 guests). Can you still help?
Yes — set the guest count to whatever you need, and add a note. Rahul will work with you.

### What about food allergies?
Use the **Notes for the chef** box in the plate panel, or mention it in the enquiry form. We take this seriously and confirm by phone.

### Can the caterer travel to my venue?
Within Hyderabad, yes. Outside, ask — depends on the date and distance.

---

## A typical journey, end to end

Here's what an evening looks like for a customer planning a daughter's first-birthday function for 80 guests.

1. **8:42 PM** — opens Pankti on her phone after dinner. Sees the hero, "Good evening · What are we celebrating?"
2. **8:43 PM** — taps the **Birthday & Anniversary** occasion card. Lands on the menu page with the Birthday Special plate preloaded (9 dishes).
3. **8:44 PM** — removes Mutton Rogan Josh (mixed crowd, mostly veg). Adds Hara Bhara Kebab. Sets spice preference to *Medium*.
4. **8:46 PM** — sets guest count to 80. Watches the total update to ₹40,000.
5. **8:47 PM** — adds in the notes box: "A few guests are Jain — please prepare 10 separate Jain plates."
6. **8:48 PM** — taps Send enquiry. Fills in name, phone, date (next month), occasion. Adds the venue.
7. **8:49 PM** — taps Submit. Sees confirmation. Taps **Send on WhatsApp** — opens WhatsApp with everything pre-filled. Sends.
8. **9:31 PM** — Rahul replies on WhatsApp: "Confirmed for the date. The Jain plates are no problem. Calling you tomorrow morning to finalise."

That's the product, working as intended.
