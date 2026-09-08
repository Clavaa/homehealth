import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { site } from "@/site.config";
import { services } from "@/lib/services";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";
import { MidPageCTA } from "@/components/MidPageCTA";
import { RecruitBand } from "@/components/RecruitBand";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Pill } from "@/components/Pill";

/**
 * Town-page template with explicit unique-content TODO slots.
 *
 * IMPORTANT before launch: Google's health-site quality updates target
 * swap-the-city templating. Each town page must earn its place with real
 * local substance — fill every TODO slot below per town (local landmarks the
 * team actually knows, a named caregiver who lives there, real local detail),
 * or unpublish the page.
 */

export function generateStaticParams() {
  return site.towns.map((t) => ({ town: t.slug }));
}

function getTown(slug: string) {
  return site.towns.find((t) => t.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ town: string }>;
}): Promise<Metadata> {
  const town = getTown((await params).town);
  if (!town) return {};
  const title = `Home Care in ${town.name}, ${site.stateAbbr}`;
  const description = `Home care and home health aides in ${town.name}, ${site.stateAbbr}: companion, personal, dementia and overnight care from local caregivers. Free assessment.`;
  const url = `${site.domain}/service-areas/${town.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url,
      siteName: site.name,
      type: "website",
      locale: "en_US",
    },
    twitter: { card: "summary", title: `${title} | ${site.name}`, description },
  };
}

export default async function TownPage({
  params,
}: {
  params: Promise<{ town: string }>;
}) {
  const town = getTown((await params).town);
  if (!town) notFound();

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeHealthCareService",
    "@id": `${site.domain}/service-areas/${town.slug}/#localbusiness`,
    name: `${site.name} — ${town.name}`,
    url: `${site.domain}/service-areas/${town.slug}`,
    ...(site.phone ? { telephone: site.phone } : {}),
    parentOrganization: { "@id": `${site.domain}/#organization` },
    areaServed: {
      "@type": "City",
      name: town.name,
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: `${site.county}, ${site.stateAbbr}`,
      },
    },
  };

  return (
    <>
      <JsonLd data={localBusinessJsonLd} />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Service areas", href: "/service-areas" },
          { name: town.name },
        ]}
      />

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-clay">
            {town.name}, {site.stateAbbr}
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl leading-[1.1] text-juniper sm:text-5xl">
            Home care in {town.name}, close enough to{" "}
            <em className="hero-italic">matter</em>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-ink/80">
            Companion care, personal care, and around-the-clock help for{" "}
            {town.name} families — from caregivers based right here in{" "}
            {site.county}.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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
        <PhotoPlaceholder
          label={`${town.name} photo`}
          intent={`A caregiver and client on a real ${town.name} front porch or neighborhood sidewalk, warm light — recognizably local, not stock`}
          bigCorner="tr"
          className="aspect-[4/3] w-full"
        />
      </section>

      {/* Unique local content — TODO slots (do not launch without filling) */}
      <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-[var(--radius-card)] rounded-tl-[var(--radius-corner)] bg-sand p-8">
            <h2 className="text-2xl text-juniper">
              Why {town.name} families call us
            </h2>
            <p className="mt-3 text-[16px] leading-relaxed text-ink/85">
              {/* TODO(unique-content): 2–3 sentences of REAL local substance for
                  this town — e.g. which neighborhoods our caregivers live in,
                  the senior center or church communities we know, how fast we
                  can typically staff here. No generic filler. */}
              [TODO: Write 2–3 sentences of real, local substance about{" "}
              {town.name} — neighborhoods our caregivers live in, community
              places we know, typical staffing speed here.]
            </p>
          </div>
          <div className="rounded-[var(--radius-card)] bg-white p-8 shadow-sm ring-1 ring-mist">
            <h2 className="text-2xl text-juniper">A caregiver you might meet</h2>
            <p className="mt-3 text-[16px] leading-relaxed text-ink/85">
              {/* TODO(unique-content): a short, true, permissioned profile of a
                  caregiver who actually serves this town (first name, years of
                  experience, one human detail). Never invent a person. */}
              [TODO: Add a short, true, permissioned profile of a caregiver who
              serves {town.name}. Never invent a person.]
            </p>
          </div>
        </div>
      </section>

      {/* Services available locally */}
      <section className="bg-sage">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
          <h2 className="text-3xl text-juniper sm:text-4xl">
            Every service, available in {town.name}
          </h2>
          <div className="mt-8 flex flex-wrap gap-2.5">
            {services.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="rounded-full border-2 border-juniper/25 bg-white/70 px-4 py-2 text-[15px] font-medium text-juniper transition-colors hover:border-juniper hover:bg-white"
              >
                {s.name}
              </Link>
            ))}
          </div>
          <p className="mt-6 max-w-2xl text-[15px] text-ink/75">
            Rates in {town.name} are the same published rates as everywhere we
            work: {site.rates.hourlyMin}–{site.rates.hourlyMax}/hr depending on
            care level and schedule.{" "}
            <Link href="/pricing" className="font-semibold text-juniper underline underline-offset-2">
              See pricing
            </Link>
            .
          </p>
        </div>
      </section>

      <div className="py-16 sm:py-20">
        <MidPageCTA
          heading={`Start with a free assessment in ${town.name}`}
          body="A care manager comes to the house, listens, and writes up a plan — free, and yours to keep whether or not you hire us."
        />
      </div>

      {/* Nearby towns */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-juniper/70">
          Nearby communities
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {site.towns
            .filter((t) => t.slug !== town.slug)
            .map((t) => (
              <Link
                key={t.slug}
                href={`/service-areas/${t.slug}`}
                className="rounded-full border border-juniper/20 px-3.5 py-1.5 text-sm font-medium text-juniper/80 hover:border-juniper hover:text-juniper"
              >
                {t.name}
              </Link>
            ))}
        </div>
      </section>

      <RecruitBand />
    </>
  );
}
