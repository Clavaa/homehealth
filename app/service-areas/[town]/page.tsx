import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { site, hourlyRange } from "@/site.config";
import { services } from "@/lib/services";
import { Photo } from "@/components/Photo";
import { MidPageCTA } from "@/components/MidPageCTA";
import { RelatedLinks } from "@/components/RelatedLinks";
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
        <Photo
          slug={`town-${town.slug}`}
          priority
          sizes="(min-width: 1024px) 45vw, 100vw"
          label={`${town.name} photo`}
          intent={`A caregiver and client on a real ${town.name} front porch or neighborhood sidewalk, warm light — recognizably local, not stock`}
          bigCorner="tr"
          className="aspect-[4/3] w-full"
        />
      </section>

      {/* Unique local content. Each town's real copy lives in
          site.config towns[].localNote / caregiverNote; a town with neither
          renders nothing here rather than shipping the brief itself, which is
          what used to happen. These two cards are what make a town page more
          than a name swap, so filling them is the difference between a local
          page and a doorway page. */}
      {(town.localNote || town.caregiverNote) && (
        <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
          <div className="grid gap-6 md:grid-cols-2">
            {town.localNote && (
              <div className="rounded-[var(--radius-card)] rounded-tl-[var(--radius-corner)] bg-sand p-8">
                <h2 className="text-2xl text-juniper">
                  Why {town.name} families call us
                </h2>
                <p className="mt-3 text-[16px] leading-relaxed text-ink/85">
                  {town.localNote}
                </p>
              </div>
            )}
            {town.caregiverNote && (
              <div className="rounded-[var(--radius-card)] bg-white p-8 shadow-sm ring-1 ring-mist">
                <h2 className="text-2xl text-juniper">
                  A caregiver you might meet
                </h2>
                <p className="mt-3 text-[16px] leading-relaxed text-ink/85">
                  {town.caregiverNote}
                </p>
              </div>
            )}
          </div>
        </section>
      )}

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
            Rates in {town.name} are the same as everywhere we work
            {hourlyRange() ? `: ${hourlyRange()} depending on care level and schedule` : ", quoted in writing after a free assessment"}.{" "}
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

      <RelatedLinks
        heading={`More for ${town.name} families`}
        tone="sand"
        links={[
          {
            href: `/home-care/${site.state.toLowerCase().replace(/ /g, "-")}/${site.county
              .replace(/ County$/, "")
              .toLowerCase()
              .replace(/ /g, "-")}`,
            label: `Home care in ${site.county}`,
            note: `Local costs, Medicaid programs, and how many agencies serve the county.`,
          },
          {
            href: `/how-to-pay/${site.state.toLowerCase().replace(/ /g, "-")}`,
            label: `Paying for care in ${site.state}`,
            note: "Which programs pay, who qualifies, and how long approval takes.",
          },
          {
            href: "/pricing",
            label: "What care costs",
            note: `The same rates apply in ${town.name} as everywhere we work.`,
          },
          {
            href: "/services",
            label: "Every kind of care",
            note: "Companion through 24-hour, and how to tell which you need.",
          },
          {
            href: `/home-care/${site.state.toLowerCase().replace(/ /g, "-")}`,
            label: `Across ${site.state}`,
            note: "County-by-county costs and programs statewide.",
          },
          {
            href: "/careers",
            label: `Caregiver jobs in ${town.name}`,
            note: "We hire from the same neighbourhoods we serve.",
          },
        ]}
      />

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
