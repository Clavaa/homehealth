import { site } from "@/site.config";
import { Pill } from "@/components/Pill";

/**
 * Mid-page assessment CTA for service, town, and payment pages.
 * One clay pill per viewport; the phone is the secondary path.
 */
export function MidPageCTA({
  heading = "Not sure where to start? That's normal.",
  body,
}: {
  heading?: string;
  body?: string;
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="rounded-[var(--radius-card)] rounded-bl-[var(--radius-corner)] bg-sand px-8 py-10 sm:px-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <h2 className="text-2xl text-juniper sm:text-3xl">{heading}</h2>
            <p className="mt-3 text-ink/80">
              {body ??
                `A free in-home assessment is how every family starts. A care manager visits, listens, and writes up a plan — no cost, no pressure, no obligation.`}
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row md:flex-col">
            <Pill href="/#assessment" variant="clay" size="lg">
              Book a free care assessment
            </Pill>
            {site.phone && site.phoneHref && (
              <Pill href={site.phoneHref} variant="juniperOutline" size="lg">
                {site.phone}
              </Pill>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
