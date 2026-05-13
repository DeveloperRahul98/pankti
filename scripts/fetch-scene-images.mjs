// Fetch hero / signature / gallery / about photos to /public/scene/
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "public", "scene");

const SCENES = {
  // hero — wide
  hero: "https://images.unsplash.com/photo-1631452180539-96aca7d48617?w=1800&q=85&auto=format&fit=crop",
  // signature plates (4)
  "sig-wedding":  "https://images.unsplash.com/photo-1631452180539-96aca7d48617?w=1000&q=85&auto=format&fit=crop",
  "sig-pooja":    "https://images.unsplash.com/photo-1567337710282-00832b415979?w=1000&q=85&auto=format&fit=crop",
  "sig-birthday": "https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?w=1000&q=85&auto=format&fit=crop",
  "sig-corporate":"https://images.unsplash.com/photo-1542367592-8849eb950fd8?w=1000&q=85&auto=format&fit=crop",
  // gallery (8)
  "g1": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=85&auto=format&fit=crop",
  "g2": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=900&q=85&auto=format&fit=crop",
  "g3": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=900&q=85&auto=format&fit=crop",
  "g4": "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=900&q=85&auto=format&fit=crop",
  "g5": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900&q=85&auto=format&fit=crop",
  "g6": "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=900&q=85&auto=format&fit=crop",
  "g7": "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=900&q=85&auto=format&fit=crop",
  "g8": "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=900&q=85&auto=format&fit=crop",
  // about
  "about": "https://images.unsplash.com/photo-1542010589005-d1eacc3918f2?w=1200&q=85&auto=format&fit=crop",
};

async function download(url, outPath) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const buf = Buffer.from(await r.arrayBuffer());
  await fs.writeFile(outPath, buf);
  return buf.length;
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  for (const [name, url] of Object.entries(SCENES)) {
    process.stdout.write(`• ${name.padEnd(14)} `);
    try {
      const bytes = await download(url, path.join(OUT, `${name}.jpg`));
      console.log(`${(bytes / 1024).toFixed(0)}kb`);
    } catch (e) {
      console.log(`FAILED — ${e.message}`);
    }
  }
}
main();
