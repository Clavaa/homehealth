/**
 * Whether this deployment is allowed to be indexed by search engines.
 *
 * Default is NO, deliberately. Until site.config.ts holds real values, every
 * page publishes a placeholder phone number, "$XX" rates, an "X.X" Google
 * rating and three invented reviews. None of that should ever be crawlable
 * under a brand name — and a Vercel preview URL is as crawlable as anything
 * else once someone links to it.
 *
 * To go live: set NEXT_PUBLIC_INDEXABLE=true in the Vercel *production*
 * environment only, after the placeholders are replaced and the real domain
 * is attached. Preview and development deployments then stay noindex on their
 * own, with no further thought required.
 */
export const isIndexable = process.env.NEXT_PUBLIC_INDEXABLE === "true";

/**
 * The origin this deployment should present as canonical.
 *
 * Falls back to the configured production domain. On a preview deploy that
 * domain doesn't serve this build, but previews are noindex, so the canonical
 * is inert there; set NEXT_PUBLIC_SITE_URL if you ever need a preview to
 * self-canonicalise.
 */
export function siteOrigin(fallback: string): string {
  const override = process.env.NEXT_PUBLIC_SITE_URL;
  if (override) return override.replace(/\/+$/, "");
  return fallback;
}
