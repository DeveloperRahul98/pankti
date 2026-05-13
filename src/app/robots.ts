import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    // Update to your real production URL when deployed.
    sitemap: "https://pankti.local/sitemap.xml",
  };
}
