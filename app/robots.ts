import type { MetadataRoute } from "next";
import { site } from "@/site.config";
import { states } from "@/lib/states";
import { isIndexable } from "@/lib/indexable";

export default function robots(): MetadataRoute.Robots {
  // Until NEXT_PUBLIC_INDEXABLE=true, refuse every crawler outright — this
  // build still shows placeholder rates, reviews and a placeholder phone
  // number, and none of that belongs in an index. See lib/indexable.ts.
  if (!isIndexable) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

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
