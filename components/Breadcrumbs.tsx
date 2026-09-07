import Link from "next/link";
import { site } from "@/site.config";
import { JsonLd } from "@/components/JsonLd";

export interface Crumb {
  name: string;
  /** Omit for the current page (rendered as plain text, no link). */
  href?: string;
}

/**
 * Visible breadcrumb trail + matching BreadcrumbList JSON-LD.
 * Pass the full trail starting at Home; the last crumb is the current page.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      ...(c.href
        ? { item: c.href === "/" ? `${site.domain}/` : `${site.domain}${c.href}` }
        : {}),
    })),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <nav aria-label="Breadcrumb" className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink/60">
          {items.map((c, i) => (
            <li key={`${c.name}-${i}`} className="flex items-center gap-2">
              {i > 0 && (
                <span aria-hidden="true" className="text-ink/30">
                  /
                </span>
              )}
              {c.href ? (
                <Link href={c.href} className="hover:text-juniper hover:underline underline-offset-4">
                  {c.name}
                </Link>
              ) : (
                <span aria-current="page" className="font-medium text-ink/80">
                  {c.name}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
