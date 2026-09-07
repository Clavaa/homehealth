import type { Metadata } from "next";
import { site } from "@/site.config";

/**
 * One place that stamps every page with the full SEO kit:
 * title, description, canonical, OpenGraph, and Twitter metadata.
 *
 * Convention: canonical URLs have NO trailing slash (matching Next's default
 * trailingSlash:false), except the homepage which is `${domain}/`.
 */
export function pageMeta(opts: {
  /** Page title. Runs through the layout template (`… | Juniper at Home`) unless absolute. */
  title: string;
  /** Set when the title already includes the brand (or must stay under 60 chars). */
  absolute?: boolean;
  description: string;
  /** Path starting with "/". "/" = homepage. */
  path: string;
}): Metadata {
  const url = opts.path === "/" ? `${site.domain}/` : `${site.domain}${opts.path}`;
  const ogTitle = opts.absolute ? opts.title : `${opts.title} | ${site.name}`;
  return {
    title: opts.absolute ? { absolute: opts.title } : opts.title,
    description: opts.description,
    alternates: { canonical: url },
    openGraph: {
      title: ogTitle,
      description: opts.description,
      url,
      siteName: site.name,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary",
      title: ogTitle,
      description: opts.description,
    },
  };
}
