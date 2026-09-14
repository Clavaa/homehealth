import { site } from "@/site.config";

/**
 * Juniper review band. Renders only when site.config holds real, permissioned
 * quotes — it is empty by default, and the placeholders that once lived here
 * were removed rather than published. Stars are butter (Style Bible).
 */
export function ReviewStrip() {
  // No real reviews yet — show nothing rather than a heading over an empty
  // grid, and never the placeholders that used to sit here.
  if (site.reviews.length === 0) return null;

  return (
    <section className="bg-juniper text-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <h2 className="text-3xl text-white sm:text-4xl">
          What families tell us
        </h2>
        <p className="mt-3 max-w-xl text-white/75">
          Shared with each family&rsquo;s permission.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {site.reviews.map((r, i) => (
            <figure
              key={i}
              className={`flex flex-col rounded-[var(--radius-card)] bg-white/10 p-7 ${
                i === 1 ? "rounded-bl-[var(--radius-corner)]" : ""
              }`}
            >
              <Stars />
              <blockquote className="mt-4 flex-1 text-[16px] leading-relaxed text-white/95">
                {r.quote}
              </blockquote>
              <figcaption className="mt-5 border-t border-white/15 pt-4 text-sm">
                <span className="font-semibold text-white">{r.name}</span>
                <span className="block text-white/65">{r.detail}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stars() {
  return (
    <div className="flex gap-1 text-butter" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-4.5 w-4.5" fill="currentColor">
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}
