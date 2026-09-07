import type { MetadataRoute } from "next";
import { site } from "@/site.config";
import { services } from "@/lib/services";
import { states } from "@/lib/states";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.domain;
  const now = new Date();

  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    ...services.map((s) => ({
      url: `${base}/services/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    { url: `${base}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/how-to-pay`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    // County-guide section index (state + county pages live in the sharded
    // sitemaps at /home-care/sitemap/<state>.xml).
    { url: `${base}/home-care`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    ...states.map((s) => ({
      url: `${base}/how-to-pay/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: `${base}/service-areas`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    ...site.towns.map((t) => ({
      url: `${base}/service-areas/${t.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/about/leadership`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/careers`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/careers/home-health-aide`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
  ];
}
