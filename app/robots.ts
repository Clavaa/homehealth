import type { MetadataRoute } from "next";
import { site } from "@/site.config";
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
    // One index that points at /sitemap.xml and all 51 per-state county
    // shards — submit this single URL to Search Console.
    sitemap: `${site.domain}/sitemap-index.xml`,
  };
}
