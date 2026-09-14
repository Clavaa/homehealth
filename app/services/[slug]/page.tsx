import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { site } from "@/site.config";
import { relatedServices, services, getService } from "@/lib/services";
import { Photo } from "@/components/Photo";
import { MidPageCTA } from "@/components/MidPageCTA";
import { ServiceAreaModule } from "@/components/ServiceAreaModule";
import { RecruitBand } from "@/components/RecruitBand";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Pill } from "@/components/Pill";
import { RelatedLinks } from "@/components/RelatedLinks";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const service = getService((await params).slug);
  if (!service) return {};
  const title = `${service.name} in ${site.metro}, ${site.stateAbbr}`;
  const url = `${site.domain}/services/${service.slug}`;
  return {
    title,
    description: service.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${site.name}`,
      description: service.metaDescription,
      url,
      siteName: site.name,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary",
      title: `${title} | ${site.name}`,
      description: service.metaDescription,
    },
  };
}

/** Renders the H1 with its single Fraunces-italic clay word. */
function ServiceH1({ h1, italicWord }: { h1: string; italicWord: string }) {
  const [before, after] = h1.split("{italic}");
  return (
    <h1 className="mt-3 max-w-3xl text-4xl leading-[1.1] text-juniper sm:text-5xl">
      {before}
      <em className="hero-italic">{italicWord}</em>
      {after}
    </h1>
  );
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const service = getService((await params).slug);
  if (!service) notFound();

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    serviceType: service.name,
    description: service.metaDescription,
    url: `${site.domain}/services/${service.slug}`,
    provider: { "@id": `${site.domain}/#organization` },
    areaServed: {
      "@type": "AdministrativeArea",
      name: `${site.county}, ${site.stateAbbr}`,
    },
  };

  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: service.name },
        ]}
      />

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-clay">
            {site.metro} · {site.county}
          </p>
          <ServiceH1 h1={service.h1} italicWord={service.italicWord} />
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/80">
            {service.lead}
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
          slug={`service-${service.slug}`}
          priority
          sizes="(min-width: 1024px) 45vw, 100vw"
          label={`${service.name} photo`}
          intent={`Caregiver in juniper polo and client together, mid-moment that says "${service.name.toLowerCase()}" — warm window light, lived-in home, never posed`}
          bigCorner="tr"
          className="aspect-[4/3] w-full"
        />
      </section>

      {/* What's included */}
      <section className="bg-sage">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
          <h2 className="text-3xl text-juniper">What&rsquo;s included</h2>
          <ul className="mt-8 grid gap-x-10 gap-y-4 md:grid-cols-2">
            {service.included.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[16px] text-ink/85">
                <CheckIcon />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* When families choose this */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <h2 className="text-3xl text-juniper">
            When families choose {service.name.toLowerCase()}
          </h2>
          <div className="space-y-5 text-[17px] leading-relaxed text-ink/85">
            {service.whenChosen.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Mid-page CTA */}
      <MidPageCTA
        heading={`Wondering if ${service.name.toLowerCase()} is the right fit?`}
        body="Book a free in-home assessment. A care manager visits, listens, and writes up a plan — and tells you honestly if a different kind of help would serve you better."
      />

      {/* What a visit looks like */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <h2 className="text-3xl text-juniper">What a visit looks like</h2>
        <p className="mt-3 max-w-2xl text-ink/75">
          Names changed, rhythm real — this is an ordinary{" "}
          {service.name.toLowerCase()} visit with our team.
        </p>
        <ol className="mt-10 space-y-0">
          {service.visit.map((step, i) => (
            <li key={i} className="relative flex gap-6 pb-8 last:pb-0">
              {/* timeline rule */}
              {i < service.visit.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute left-[44px] top-10 h-full w-px bg-juniper/20 sm:left-[52px]"
                />
              )}
              <span className="z-10 flex h-[52px] min-w-[88px] shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-sand px-4 font-[family-name:var(--font-display)] text-[15px] font-semibold text-juniper sm:min-w-[104px]">
                {step.time}
              </span>
              <p className="pt-3 text-[16px] leading-relaxed text-ink/85">
                {step.moment}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Closer band */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="rounded-[var(--radius-card)] rounded-tr-[var(--radius-corner)] bg-sand px-8 py-10 text-center sm:px-16">
          <p className="mx-auto max-w-2xl font-[family-name:var(--font-display)] text-2xl leading-snug text-juniper sm:text-3xl">
            {service.closer}
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {site.phone && site.phoneHref ? (
              <Pill href={site.phoneHref} variant="juniper" size="lg">
                Call {site.phone}
              </Pill>
            ) : (
              <Pill href="/#assessment" variant="juniper" size="lg">
                Book a free care assessment
              </Pill>
            )}
            <Link
              href="/pricing"
              className="text-[16px] font-semibold text-juniper underline underline-offset-4"
            >
              See what it costs
            </Link>
          </div>
        </div>
      </section>

      <RelatedLinks
        heading="Families weighing this also look at"
        links={[
          ...relatedServices(service.slug).map((r) => ({
            href: `/services/${r.slug}`,
            label: r.name,
            note: r.short,
          })),
          {
            href: "/pricing",
            label: "What this costs",
            note: "Our published rates and what a quote includes.",
          },
          {
            href: `/how-to-pay/${site.state.toLowerCase().replace(/ /g, "-")}`,
            label: `Paying for it in ${site.state}`,
            note: "The Medicaid programs that cover care at home.",
          },
          {
            href: "/services",
            label: "Compare every service",
            note: "All nine, side by side.",
          },
        ]}
      />

      <ServiceAreaModule />
      <RecruitBand />
    </>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="mt-1 h-5 w-5 shrink-0 text-juniper"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" className="opacity-25" />
      <path d="M8 12.5l2.5 2.5L16 9.5" />
    </svg>
  );
}
