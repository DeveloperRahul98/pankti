// One-time / re-runnable script to fetch real food images.
// Strategy: search TheMealDB by dish name + aliases. Fall back to a curated
// Unsplash photo per course. Saves to /public/menu/{id}.jpg and writes
// src/data/dish-images.json with id -> "/menu/{id}.jpg" mappings.

import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "menu");
const MAP_OUT = path.join(ROOT, "src", "data", "dish-images.json");

// Map of dish id -> search terms to try in TheMealDB (in order).
// We try several aliases because TheMealDB's coverage is partial.
const SEARCHES = {
  "paneer-tikka": ["Paneer Tikka", "Tandoori Chicken"],
  "gobi-65": ["Gobi 65", "Cauliflower"],
  "chicken-65": ["Chicken 65", "Tandoori Chicken"],
  "mirchi-bajji": ["Pakora", "Bhajia"],
  "hara-bhara-kebab": ["Hara Bhara Kebab", "Aloo Tikki", "Spinach"],
  "tomato-shorba": ["Tomato Soup", "Shorba"],
  "rasam": ["Rasam", "Tom yum"],
  "hyderabadi-veg-biryani": ["Vegetable Biryani", "Lamb Biryani"],
  "chicken-dum-biryani": ["Chicken Biryani", "Lamb Biryani"],
  "jeera-rice": ["Cumin Rice", "Jeera Rice"],
  "curd-rice": ["Curd Rice", "Yogurt Rice"],
  "butter-naan": ["Naan", "Butter Naan"],
  "tandoori-roti": ["Roti", "Naan"],
  "pulka": ["Chapati", "Roti"],
  "paneer-butter-masala": ["Paneer Butter Masala", "Butter Chicken", "Paneer"],
  "kadai-paneer": ["Kadai Paneer", "Paneer"],
  "gutti-vankaya": ["Bombay Potato", "Brinjal", "Aubergine"],
  "chicken-curry": ["Chicken Curry", "Chicken Tikka Masala"],
  "mutton-rogan-josh": ["Rogan Josh", "Mutton Curry"],
  "aloo-jeera": ["Aloo Gobi", "Potato"],
  "dal-makhani": ["Dal Makhani", "Dal", "Lentil"],
  "pappu": ["Tomato Dal", "Dal", "Lentil"],
  "dal-tadka": ["Dal", "Lentil"],
  "raita": ["Raita", "Yogurt"],
  "papad": ["Papad", "Poppadom"],
  "pickle": ["Mango", "Pickle"],
  "salad": ["Kachumber", "Salad"],
  "gulab-jamun": ["Gulab Jamun", "Jamun"],
  "double-ka-meetha": ["Bread Pudding", "Shahi Tukda"],
  "kheer": ["Kheer", "Rice Pudding"],
  "rasmalai": ["Rasmalai", "Ras Malai"],
  "buttermilk": ["Lassi", "Buttermilk"],
  "mango-lassi": ["Mango Lassi", "Lassi", "Mango"],
  "filter-coffee": ["Coffee", "Masala Chai"],
};

// Course-based fallback if no MealDB result. Unsplash CDN URLs (stable, real food photos).
// Per-dish overrides for cases where MealDB returns the wrong thing.
const URL_OVERRIDES = {
  "gulab-jamun":       "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&q=80",
  "rasmalai":          "https://images.unsplash.com/photo-1604152135912-04a022e23696?w=800&q=80",
  "double-ka-meetha":  "https://images.unsplash.com/photo-1622428051717-dcd8412959de?w=800&q=80",
  "kheer":             "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80",
};

const FALLBACK_BY_COURSE = {
  starters: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
  soups:    "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80",
  rice:     "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80",
  breads:   "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
  curries:  "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80",
  dals:     "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80",
  sides:    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80",
  sweets:   "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80",
  beverages:"https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&q=80",
};

// Need course info — duplicated from menu.ts so this script stays self-contained.
const COURSES = {
  "paneer-tikka": "starters", "gobi-65": "starters", "chicken-65": "starters",
  "mirchi-bajji": "starters", "hara-bhara-kebab": "starters",
  "tomato-shorba": "soups", "rasam": "soups",
  "hyderabadi-veg-biryani": "rice", "chicken-dum-biryani": "rice",
  "jeera-rice": "rice", "curd-rice": "rice",
  "butter-naan": "breads", "tandoori-roti": "breads", "pulka": "breads",
  "paneer-butter-masala": "curries", "kadai-paneer": "curries",
  "gutti-vankaya": "curries", "chicken-curry": "curries",
  "mutton-rogan-josh": "curries", "aloo-jeera": "curries",
  "dal-makhani": "dals", "pappu": "dals", "dal-tadka": "dals",
  "raita": "sides", "papad": "sides", "pickle": "sides", "salad": "sides",
  "gulab-jamun": "sweets", "double-ka-meetha": "sweets",
  "kheer": "sweets", "rasmalai": "sweets",
  "buttermilk": "beverages", "mango-lassi": "beverages", "filter-coffee": "beverages",
};

const MEALDB = "https://www.themealdb.com/api/json/v1/1";

async function findOnMealDb(searchTerms) {
  for (const term of searchTerms) {
    try {
      const r = await fetch(`${MEALDB}/search.php?s=${encodeURIComponent(term)}`);
      const data = await r.json();
      const meal = data.meals?.[0];
      if (meal?.strMealThumb) return meal.strMealThumb;
    } catch (e) {
      console.warn(`  search "${term}" failed:`, e.message);
    }
  }
  return null;
}

async function download(url, outPath) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`);
  const buf = Buffer.from(await r.arrayBuffer());
  await fs.writeFile(outPath, buf);
  return buf.length;
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.mkdir(path.dirname(MAP_OUT), { recursive: true });

  const map = {};
  const ids = Object.keys(SEARCHES);
  let mealDbHits = 0, fallbackHits = 0, failed = 0;

  for (const id of ids) {
    process.stdout.write(`• ${id.padEnd(28)} `);
    let url, source;
    if (URL_OVERRIDES[id]) {
      url = URL_OVERRIDES[id];
      source = "override";
    } else {
      url = await findOnMealDb(SEARCHES[id]);
      source = "mealdb";
      if (!url) {
        url = FALLBACK_BY_COURSE[COURSES[id]];
        source = "unsplash";
      }
    }
    const outPath = path.join(OUT_DIR, `${id}.jpg`);
    try {
      const bytes = await download(url, outPath);
      map[id] = `/menu/${id}.jpg`;
      if (source === "mealdb") mealDbHits++; else fallbackHits++;
      console.log(`${source}  ${(bytes / 1024).toFixed(0)}kb`);
    } catch (e) {
      console.log(`FAILED — ${e.message}`);
      failed++;
    }
  }

  await fs.writeFile(MAP_OUT, JSON.stringify(map, null, 2) + "\n");
  console.log(
    `\nDone. ${mealDbHits} from TheMealDB · ${fallbackHits} Unsplash fallback · ${failed} failed. Map → ${path.relative(ROOT, MAP_OUT)}`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
