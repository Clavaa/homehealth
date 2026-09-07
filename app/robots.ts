import type { MetadataRoute } from "next";
import { site } from "@/site.config";
import { states } from "@/lib/states";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: [
      `${site.domain}/sitemap.xml`,
      // County-guide shards: one sitemap per state.
      ...states.map((s) => `${site.domain}/home-care/sitemap/${s.slug}.xml`),
    ],
  };
}
