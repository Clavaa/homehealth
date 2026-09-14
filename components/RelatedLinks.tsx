import Link from "next/link";

/**
 * A labelled row of contextual links.
 *
 * Exists because /pricing, /careers and /about were carrying zero outbound
 * links of their own — everything on them came from the header and footer, so
 * they absorbed link equity and passed none on, and a reader who finished them
 * had nowhere to go. Footer links are not a substitute: they are identical on
 * every page, so they tell a crawler nothing about which pages are related to
 * which.
 */

export interface RelatedLink {
  href: string;
  label: string;
  /** One line on why this is the sensible next page. */
  note?: string;
}

export function RelatedLinks({
  heading,
  links,
  tone = "light",
}: {
  heading: string;
  links: RelatedLink[];
  tone?: "light" | "sand";
}) {
  if (links.length === 0) return null;
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
      <div
        className={`rounded-[var(--radius-card)] rounded-tl-[var(--radius-corner)] p-8 sm:p-10 ${
          tone === "sand" ? "bg-sand" : "bg-white ring-1 ring-mist"
        }`}
      >
        <h2 className="text-2xl text-juniper sm:text-3xl">{heading}</h2>
        <ul className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-[16px] font-semibold text-juniper underline underline-offset-4 hover:text-juniper-deep"
              >
                {l.label}
              </Link>
              {l.note && (
                <p className="mt-1 text-[14px] leading-relaxed text-ink/70">{l.note}</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Compact pill row, for long lists where each item needs no explanation. */
export function LinkPills({
  heading,
  links,
}: {
  heading: string;
  links: { href: string; label: string }[];
}) {
  if (links.length === 0) return null;
  return (
    <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wider text-juniper/70">{heading}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-full border border-juniper/20 px-3.5 py-1.5 text-sm font-medium text-juniper/80 hover:border-juniper hover:text-juniper"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
