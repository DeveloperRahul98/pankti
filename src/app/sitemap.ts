import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const LAST_MOD = new Date();

const ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/menu", priority: 0.9, changeFrequency: "weekly" },
  { path: "/signature-plates", priority: 0.8, changeFrequency: "monthly" },
  { path: "/compare", priority: 0.5, changeFrequency: "monthly" },
  { path: "/gallery", priority: 0.7, changeFrequency: "monthly" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: LAST_MOD,
    priority,
    changeFrequency,
  }));
}
