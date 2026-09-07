import { site } from "@/site.config";
import { Pill } from "@/components/Pill";

/**
 * The one recruiting moment in the consumer flow: a juniper band above the
 * footer. Outlined white pill — never clay (Style Bible rule).
 */
export function RecruitBand() {
  return (
    <section className="bg-juniper-deep text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-14 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl text-white sm:text-3xl">
            Good at caring for people?
          </h2>
          <p className="mt-2 max-w-xl text-white/75">
            We&rsquo;re hiring caregivers and home health aides across{" "}
            {site.county} — pay published, schedules that respect your life.
          </p>
        </div>
        <Pill href="/careers" variant="whiteOutline" size="lg" className="shrink-0">
          See open shifts
        </Pill>
      </div>
    </section>
  );
}
