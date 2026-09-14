import type { MetadataRoute } from "next";
import { site } from "@/site.config";
import { states } from "@/lib/states";
import { countiesForState } from "@/lib/counties";
import { contentRevisedDate } from "@/lib/content-date";

/**
 * Sharded sitemaps for the county-guide section — one sitemap per state
 * (served at /home-care/sitemap/<state-slug>.xml), each carrying the state
 * index page plus every county page. robots.ts lists all shards.
 */
export function generateSitemaps(): { id: string }[] {
  return states.map((s) => ({ id: s.slug }));
}

export default function sitemap({ id }: { id: string }): MetadataRoute.Sitemap {
  const base = site.domain;
  // Stable across deploys — see lib/content-date.
  const now = contentRevisedDate;
  const stateEntry = {
    url: `${base}/home-care/${id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  };
  return [
    stateEntry,
    ...countiesForState(id).map((c) => ({
      url: `${base}/home-care/${c.stateSlug}/${c.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
