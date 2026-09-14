import Link from "next/link";
import { site } from "@/site.config";
import { pageMeta } from "@/lib/seo";
import { services } from "@/lib/services";
import { Pill } from "@/components/Pill";
import { Photo } from "@/components/Photo";
import { AssessmentForm } from "@/components/AssessmentForm";
import { PricingPersonas } from "@/components/PricingPersonas";
import { ReviewStrip } from "@/components/ReviewStrip";
import { ServiceAreaModule } from "@/components/ServiceAreaModule";
import { RecruitBand } from "@/components/RecruitBand";

export const metadata = pageMeta({
  title: `Home Care in ${site.metro}, ${site.stateAbbr} | ${site.name}`,
  absolute: true,
  description: `Home care in ${site.county}, ${site.stateAbbr} from a local team: companion, personal, dementia, 24-hour and overnight care. Real published rates. Free assessment.`,
  path: "/",
});

export default function HomePage() {
  return (
    <>
      {/* ── Hero: split on oat ─────────────────────────────────── */}
      <section className="relative">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-24 pt-12 sm:px-6 sm:pt-16 lg:grid-cols-[1.1fr_1fr] lg:gap-14 lg:pb-32">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-clay">
              Home care in {site.metro}
            </p>
            <h1 className="mt-3 text-[40px] leading-[1.08] text-juniper sm:text-[56px] sm:leading-[64px]">
              Help at home, from people who feel like{" "}
              <em className="hero-italic">family</em>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-ink/80">
              Companion care, personal care, and around-the-clock help across{" "}
              {site.county} — from local caregivers who show up on time and
              stay a while.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Pill href="/#assessment" variant="clay" size="lg">
                Book a free care assessment
              </Pill>
              {/* The phone number IS the label — this audience calls. */}
              {site.phone && site.phoneHref && (
                <Pill href={site.phoneHref} variant="juniperOutline" size="lg">
                  {site.phone}
                </Pill>
              )}
            </div>
            {site.phone && (
              <p className="mt-4 text-[15px] text-ink/60">
                A person answers, 24/7 — nights, weekends, holidays.
              </p>
            )}
          </div>

          <Photo
            slug="home-hero"
            priority
            sizes="(min-width: 1024px) 42vw, 100vw"
            label="Hero photo"
            intent="A caregiver in a juniper polo and an older client laughing together over a jigsaw puzzle at a kitchen table, warm window light, lived-in home"
            bigCorner="br"
            className="aspect-[4/5] w-full max-w-md justify-self-center lg:max-w-none"
          />
        </div>

        {/* Floating stats card. Each tile renders only when site.config
            actually holds that figure — the placeholders that used to fill
            them were claims a family would act on. "Local" is the one tile
            that is true today, so the card survives with just that. */}
        <div className="absolute inset-x-4 -bottom-16 sm:inset-x-6 lg:inset-x-0">
          <div className="mx-auto max-w-4xl rounded-[var(--radius-card)] bg-white p-6 shadow-[0_16px_40px_-16px_rgba(34,48,44,0.25)] sm:p-8">
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 text-center">
              {site.stats.googleRating && (
                <div>
                  <p className="font-[family-name:var(--font-display)] text-2xl font-semibold text-juniper sm:text-3xl">
                    {site.stats.googleRating}
                    <span className="text-butter">★</span>
                  </p>
                  <p className="mt-1 text-sm text-ink/60">
                    Google rating
                    {site.stats.googleReviewCount
                      ? ` · ${site.stats.googleReviewCount} reviews`
                      : ""}
                  </p>
                </div>
              )}
              {site.stats.caringSinceYear && (
                <div>
                  <p className="font-[family-name:var(--font-display)] text-2xl font-semibold text-juniper sm:text-3xl">
                    {site.stats.caringSinceYear}
                  </p>
                  <p className="mt-1 text-sm text-ink/60">Caring since</p>
                </div>
              )}
              {site.stats.caregiverCount && (
                <div>
                  <p className="font-[family-name:var(--font-display)] text-2xl font-semibold text-juniper sm:text-3xl">
                    {site.stats.caregiverCount}
                  </p>
                  <p className="mt-1 text-sm text-ink/60">
                    Caregivers, all background-checked
                  </p>
                </div>
              )}
              <div>
                <p className="font-[family-name:var(--font-display)] text-2xl font-semibold text-juniper sm:text-3xl">
                  Local
                </p>
                <p className="mt-1 text-sm text-ink/60">
                  {site.county} owned &amp; operated
                </p>
              </div>
              <div>
                <p className="font-[family-name:var(--font-display)] text-2xl font-semibold text-juniper sm:text-3xl">
                  Free
                </p>
                <p className="mt-1 text-sm text-ink/60">
                  In-home assessment, no obligation
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services grid ──────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-32 sm:px-6 sm:pb-20 sm:pt-36">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-juniper/70">
            What we do
          </p>
          <h2 className="mt-2 text-3xl text-juniper sm:text-4xl">
            Whatever home needs, we cover it
          </h2>
          <p className="mt-4 text-ink/80">
            Start small or start big — care plans flex as things change, and
            you&rsquo;re never locked into anything.
          </p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className={`group flex flex-col rounded-[var(--radius-card)] bg-white p-7 shadow-sm ring-1 ring-mist transition-shadow hover:shadow-md ${
                i === 0
                  ? "rounded-tl-[var(--radius-corner)]"
                  : i === services.length - 1
                    ? "rounded-br-[var(--radius-corner)]"
                    : ""
              }`}
            >
              <h3 className="text-xl text-juniper group-hover:underline group-hover:underline-offset-4">
                {s.name}
              </h3>
              <p className="mt-2.5 flex-1 text-[15px] leading-relaxed text-ink/75">
                {s.short}
              </p>
              <span className="mt-4 text-[15px] font-semibold text-juniper">
                About {s.name.toLowerCase().replace(" & alzheimer's care", " care")} &rarr;
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Assessment card + call card ────────────────────────── */}
      <section className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="grid items-start gap-8 lg:grid-cols-[1.4fr_1fr]">
          <AssessmentForm />
          <div className="rounded-[var(--radius-card)] bg-white p-8 shadow-sm ring-1 ring-mist">
            <h3 className="text-2xl text-juniper">
              Rather just talk it through?
            </h3>
            <p className="mt-3 text-ink/80">
              Tell us what happened this week — the fall, the diagnosis, the
              discharge — and we&rsquo;ll tell you honestly what would help.
            </p>
            <a
              href={site.phone && site.phoneHref ? site.phoneHref : `mailto:${site.email}`}
              className="mt-5 inline-flex items-center justify-center rounded-full border-2 border-juniper px-7 py-3.5 text-lg font-semibold text-juniper transition-colors hover:bg-juniper hover:text-white"
            >
              {site.phone ?? site.email}
            </a>
            {site.phone && (
              <p className="mt-3 text-[14px] text-ink/60">
                A person answers, 24/7. No phone trees, no callbacks-in-3-days.
              </p>
            )}
            <div className="mt-6 border-t border-mist pt-5">
              <Photo
                slug="care-team"
                sizes="(min-width: 1024px) 45vw, 100vw"
                label="Care team photo"
                intent="Our care coordinator on the phone at a warm, tidy desk, smiling mid-conversation — approachable, not corporate"
                bigCorner="none"
                className="aspect-[16/9]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Published pricing personas (sage) ──────────────────── */}
      <PricingPersonas />

      {/* ── Reviews (juniper band) ─────────────────────────────── */}
      <ReviewStrip />

      {/* ── Service area (sage) ────────────────────────────────── */}
      <ServiceAreaModule />

      {/* ── Recruiting band (juniper, above footer) ────────────── */}
      <RecruitBand />
    </>
  );
}
