/**
 * The date the site's content was last meaningfully revised.
 *
 * Deliberately a hand-maintained constant rather than `new Date()`. Every
 * sitemap entry previously carried the build timestamp, which meant all 3,275
 * URLs claimed to have changed the instant of each deploy — including a deploy
 * that only touched CSS. Google treats a lastmod that moves on every crawl as
 * noise and stops using it, which throws away the one signal that actually
 * helps here: the county pages genuinely do change when the CMS and Census
 * data behind them is rebuilt.
 *
 * Bump this when content really changes — new county data, rewritten copy,
 * new pages. Leave it alone for styling and infrastructure work.
 */
export const CONTENT_REVISED = "2026-09-14";

/** As a Date, for Next's MetadataRoute.Sitemap which expects one. */
export const contentRevisedDate = new Date(CONTENT_REVISED);
