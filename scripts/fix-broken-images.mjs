// Replace specific broken food images that turned out to be off-topic
// (empty jars, clothing, etc).

import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");

// Each entry: target path → array of source URLs to try.
const FIXES = [
  {
    out: "public/menu/double-ka-meetha.jpg",
    sources: [
      // Try Foodish dessert (random but always food) — fetch a few to pick a good one
      "https://foodish-api.com/images/dessert/dessert4.jpg",
      "https://foodish-api.com/images/dessert/dessert1.jpg",
      // Fallback to a known Indian sweet Unsplash photo
      "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&q=85&auto=format&fit=crop",
    ],
  },
  {
    out: "public/menu/gulab-jamun.jpg",
    sources: [
      "https://foodish-api.com/images/dessert/dessert8.jpg",
      "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&q=85&auto=format&fit=crop",
    ],
  },
  {
    out: "public/menu/kheer.jpg",
    sources: [
      "https://foodish-api.com/images/dessert/dessert20.jpg",
      "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=85&auto=format&fit=crop",
    ],
  },
  {
    out: "public/menu/rasmalai.jpg",
    sources: [
      "https://foodish-api.com/images/dessert/dessert15.jpg",
      "https://images.unsplash.com/photo-1604152135912-04a022e23696?w=800&q=85&auto=format&fit=crop",
    ],
  },
  // Gallery slot that was showing clothes
  {
    out: "public/scene/g6.jpg",
    sources: [
      "https://foodish-api.com/images/biryani/biryani30.jpg",
      "https://foodish-api.com/images/butter-chicken/butter-chicken10.jpg",
      "https://images.unsplash.com/photo-1631452180539-96aca7d48617?w=900&q=85&auto=format&fit=crop",
    ],
  },
  // Other gallery slots — refresh with food-specific photos to be safe
  {
    out: "public/scene/g3.jpg",
    sources: [
      "https://foodish-api.com/images/dessert/dessert6.jpg",
      "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=900&q=85&auto=format&fit=crop",
    ],
  },
  {
    out: "public/scene/g8.jpg",
    sources: [
      "https://foodish-api.com/images/dessert/dessert18.jpg",
      "https://images.unsplash.com/photo-1604152135912-04a022e23696?w=900&q=85&auto=format&fit=crop",
    ],
  },
];

async function download(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return Buffer.from(await r.arrayBuffer());
}

for (const { out, sources } of FIXES) {
  const target = path.join(ROOT, out);
  let saved = false;
  for (const src of sources) {
    process.stdout.write(`• ${out.padEnd(36)} trying ${src.slice(0, 50)}... `);
    try {
      const buf = await download(src);
      if (buf.length < 1500) throw new Error("file too small");
      await fs.writeFile(target, buf);
      console.log(`OK (${(buf.length / 1024).toFixed(0)}kb)`);
      saved = true;
      break;
    } catch (e) {
      console.log(`FAIL ${e.message}`);
    }
  }
  if (!saved) console.log(`  ⚠️  all sources failed for ${out}`);
}
