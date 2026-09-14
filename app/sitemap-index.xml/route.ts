import { site } from "@/site.config";
import { states } from "@/lib/states";
import { CONTENT_REVISED } from "@/lib/content-date";

/**
 * A real <sitemapindex>, so the whole site can be submitted to Search Console
 * as one URL instead of fifty-two.
 *
 * Next's sitemap.ts emits a plain <urlset>, and generateSitemaps() emits the
 * per-state shards as separate files with nothing tying them together — they
 * were discoverable only because robots.txt listed all 52 individually. That
 * works for crawlers but is miserable to operate: every shard has to be
 * submitted and monitored on its own.
 */
export const dynamic = "force-static";

export function GET() {
  const entries = [
    `${site.domain}/sitemap.xml`,
    ...states.map((s) => `${site.domain}/home-care/sitemap/${s.slug}.xml`),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (loc) =>
      `  <sitemap>\n    <loc>${loc}</loc>\n    <lastmod>${CONTENT_REVISED}</lastmod>\n  </sitemap>`,
  )
  .join("\n")}
</sitemapindex>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
