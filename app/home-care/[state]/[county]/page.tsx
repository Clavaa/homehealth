import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { site } from "@/site.config";
import {
  counties,
  getCounty,
  neighborCounties,
  formatPop,
  getStateInfoForCounty,
  type County,
} from "@/lib/counties";
import type { StateInfo } from "@/lib/states";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { MidPageCTA } from "@/components/MidPageCTA";
import { RecruitBand } from "@/components/RecruitBand";
import { Pill } from "@/components/Pill";

export const dynamicParams = false;

export function generateStaticParams() {
  return counties.map((c) => ({ state: c.stateSlug, county: c.slug }));
}

/** First Medicaid program, minus any parenthetical, for tight meta copy. */
function shortProgram(st: StateInfo): string {
  return st.programs[0].replace(/\s*\(.*\)$/, "");
}

function isHomeCounty(c: County): boolean {
  return c.name === site.county && c.state === site.state;
}

/**
 * Meta descriptions rotate across four fact-led templates (keyed by FIPS) so
 * no two county pages read alike — each interpolates the county's population
 * and the state's real cost/program facts.
 */
function metaDescription(c: County, st: StateInfo): string {
  const variants = [
    `What home care costs in ${c.name}, ${c.st} (around ${st.hourlyCost} statewide), the ${c.state} Medicaid programs that pay for it, and how to choose an agency.`,
    `Home care guide for ${c.name}, ${c.st}: typical rates near ${st.hourlyCost}, ${shortProgram(st)} coverage, caregiver training rules, and how to start.`,
    `Paying for home care in ${c.name}, ${c.st}: ${c.state}'s going rate is around ${st.hourlyCost}. See the Medicaid programs and the questions to ask any agency.`,
    `${c.name} home care, explained: costs around ${st.hourlyCost} in ${c.state}, programs like ${shortProgram(st)}, and a checklist for vetting agencies.`,
  ];
  const pick = variants[parseInt(c.fips, 10) % variants.length];
  return pick.length <= 155 ? pick : variants[0].slice(0, 152).replace(/\s+\S*$/, "") + "…";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; county: string }>;
}): Promise<Metadata> {
  const p = await params;
  const c = getCounty(p.state, p.county);
  if (!c) return {};
  const st = getStateInfoForCounty(c);
  if (!st) return {};
  const base = `Home Care in ${c.name}, ${c.st}`;
  const withBrand = `${base} | ${site.name}`;
  const title = withBrand.length <= 62 ? withBrand : base;
  const url = `${site.domain}/home-care/${c.stateSlug}/${c.slug}`;
  const description = metaDescription(c, st);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      type: "website",
      locale: "en_US",
    },
    twitter: { card: "summary", title, description },
  };
}

/** Population framing rotates by FIPS so openings vary across pages. */
function popFraming(c: County): string {
  const pop = formatPop(c.pop);
  const variants = [
    `${pop.charAt(0).toUpperCase() + pop.slice(1)} people call ${c.name} home, and in a county that size, most long-term care doesn't happen in a facility — it happens in living rooms and kitchens.`,
    `With ${pop} residents, ${c.name} has plenty of families quietly working out the same question: how do we keep Mom or Dad safely at home?`,
    `${c.name} is home to ${pop} people — and nationally, roughly one in six Americans is 65 or older, so the "who helps Dad at home" question lands on a lot of kitchen tables here.`,
  ];
  return variants[parseInt(c.fips, 10) % variants.length];
}

export default async function CountyPage({
  params,
}: {
  params: Promise<{ state: string; county: string }>;
}) {
  const p = await params;
  const c = getCounty(p.state, p.county);
  if (!c) notFound();
  const st = getStateInfoForCounty(c);
  if (!st) notFound();

  const home = isHomeCounty(c);
  const neighbors = neighborCounties(c, 7);
  const aboveFloor = st.trainingHours > 75;
  const licensedBy = st.licensed ? st.licensure.replace(/^Yes\s*—\s*/, "").replace(/\s*\(.*\)$/, "") : null;

  const faqs: { q: string; a: string }[] = [
    {
      q: `How much does home care cost in ${c.name}, ${c.st}?`,
      a: `Agency home care in ${c.state} typically runs around ${st.hourlyCost} for private pay. Rates in ${c.name} vary with the level of care, the schedule (short daily visits cost more per hour than long shifts), and local caregiver wages.`,
    },
    {
      q: `Does Medicaid pay for home care in ${c.name}?`,
      a: `Yes — for people who qualify. ${c.state} runs ${st.programs.length === 1 ? "a Medicaid program" : "Medicaid programs"} that pay${st.programs.length === 1 ? "s" : ""} for care at home instead of a nursing home: ${st.programs.join(", ")}. Income, asset, and care-need rules apply, and approval usually takes weeks to months, so apply early.`,
    },
    {
      q: `How are home care aides trained and vetted in ${c.state}?`,
      a: `Certified home health aides in ${c.state} complete at least ${st.trainingHours} hours of training${aboveFloor ? " — above the 75-hour federal minimum" : ", the federal minimum"}. ${licensedBy ? `The state also licenses home care agencies through the ${licensedBy}, so ask to see an agency's license before you hire.` : `${c.state} does not license non-medical home care agencies, so ask any agency about background checks, insurance and bonding, and who supervises the caregivers.`}`,
    },
    home
      ? {
          q: `Does ${site.name} provide caregivers in ${c.name}?`,
          a: `Yes — ${c.name} is our home county. Our caregivers live and work here, our published rates are ${site.rates.hourlyMin}–${site.rates.hourlyMax}/hr, and the first in-home assessment is always free.`,
        }
      : {
          q: `Does ${site.name} provide caregivers in ${c.name}?`,
          a: `Our own caregivers serve the ${site.metro} area of ${site.state}. This page is a free guide for ${c.name} families: what care costs in ${c.state}, which programs help pay, and how to vet a local agency. If you'd like to talk any of it through, a person answers our phone 24/7.`,
        },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <JsonLd data={faqJsonLd} />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Home care", href: "/home-care" },
          { name: c.state, href: `/home-care/${c.stateSlug}` },
          { name: c.name },
        ]}
      />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <p className="text-sm font-semibold uppercase tracking-wider text-clay">
          Home care · {c.name}, {c.st}
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl leading-[1.1] text-juniper sm:text-5xl">
          Home care in <em className="hero-italic">{c.name}</em>
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-ink/80">{popFraming(c)}</p>
        <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-ink/75">
          {home
            ? `This is where we live and work. Below: what care really costs here, the ${c.state} programs that can pay for it, and how to reach us.`
            : `Looking for care in ${c.name}? Here's what to know — real ${c.state} costs, the programs that can pay, and how to judge any agency you interview.`}
        </p>
      </section>

      {/* Paying for care in {State} — condensed fact card */}
      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <div className="rounded-[var(--radius-card)] rounded-tl-[var(--radius-corner)] bg-sand p-8 sm:p-10">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="text-2xl text-juniper sm:text-3xl">
              Paying for care in {c.state}
            </h2>
            <Link
              href={`/how-to-pay/${c.stateSlug}`}
              className="text-[15px] font-semibold text-juniper underline underline-offset-4 hover:text-juniper-deep"
            >
              Full {c.state} guide &rarr;
            </Link>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-juniper/70">
                Typical hourly cost
              </p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-4xl font-semibold text-juniper">
                {st.hourlyCost}
              </p>
              <p className="mt-2 text-[14px] leading-relaxed text-ink/70">
                Statewide going rate for agency care, private pay.{" "}
                <Link href="/pricing" className="font-semibold text-juniper underline underline-offset-2">
                  How agency pricing works
                </Link>
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-juniper/70">
                Medicaid programs
              </p>
              <ul className="mt-2 space-y-1.5 text-[15px] font-medium text-ink/85">
                {st.programs.map((prog) => (
                  <li key={prog} className="rounded-full bg-white/70 px-3.5 py-1.5">
                    {prog}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-juniper/70">
                Aide training
              </p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-4xl font-semibold text-juniper">
                {st.trainingHours} hrs
              </p>
              <p className="mt-2 text-[14px] leading-relaxed text-ink/70">
                Minimum training for certified aides
                {aboveFloor ? " — above the 75-hour federal floor." : " (the federal minimum)."}{" "}
                {licensedBy
                  ? `Agencies are licensed by the ${licensedBy}.`
                  : `${c.st} doesn't license non-medical agencies — vet carefully.`}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Local presence vs honest guide framing */}
      {home ? (
        <div className="pb-4">
          <MidPageCTA
            heading={`Our caregivers live and work in ${c.name}`}
            body={`This is our home county. Book a free in-home assessment and a care manager will come to the house, listen, and write up a plan — yours to keep whether or not you hire us.`}
          />
        </div>
      ) : (
        <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="rounded-[var(--radius-card)] bg-white p-8 shadow-sm ring-1 ring-mist">
              <h2 className="text-2xl text-juniper sm:text-3xl">
                Choosing an agency in {c.name}: three checks
              </h2>
              <ol className="mt-5 space-y-4 text-[16px] leading-relaxed text-ink/85">
                <li>
                  <strong className="text-juniper">
                    {licensedBy ? "Ask for the license." : "Vet twice as hard."}
                  </strong>{" "}
                  {licensedBy
                    ? `${c.state} licenses home care agencies through the ${licensedBy} — a legitimate agency will show its license without hesitation.`
                    : `${c.state} doesn't require a license for non-medical home care, so the vetting is on you: ask about background checks, insurance and bonding, and who supervises caregivers.`}
                </li>
                <li>
                  <strong className="text-juniper">Ask what the rate includes.</strong>{" "}
                  Around {st.hourlyCost} is typical in {c.state}. A real agency's
                  rate covers a trained, background-checked, W-2 caregiver plus
                  supervision, backup staffing, and insurance — not just the hours.
                </li>
                <li>
                  <strong className="text-juniper">Start the Medicaid clock early.</strong>{" "}
                  If money is tight, ask about {shortProgram(st)} now — approval
                  takes weeks to months, and private pay can bridge the gap.
                </li>
              </ol>
            </div>
            <div className="flex flex-col justify-center rounded-[var(--radius-card)] rounded-br-[var(--radius-corner)] bg-juniper p-8 text-white">
              <h2 className="text-2xl text-white">Want to talk it through?</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-white/85">
                We provide care in the {site.metro}, {site.stateAbbr} area — but a
                person answers our line 24/7, and we&rsquo;re glad to help any
                family think through options in {c.name}.
              </p>
              <div className="mt-6">
                <Pill href={site.phoneHref} variant="clay" size="lg" className="w-full sm:w-auto">
                  Call {site.phone}
                </Pill>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQs */}
      <section className="bg-sage">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
          <h2 className="text-3xl text-juniper sm:text-4xl">
            {c.name} home care questions, answered
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {faqs.map((f) => (
              <div key={f.q} className="rounded-[var(--radius-card)] bg-white/80 p-6">
                <h3 className="text-lg font-semibold text-juniper">{f.q}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink/85">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Neighbor counties + deeper reading */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
        <p className="text-sm font-semibold uppercase tracking-wider text-juniper/70">
          Nearby in {c.state}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {neighbors.map((n) => (
            <Link
              key={n.fips}
              href={`/home-care/${n.stateSlug}/${n.slug}`}
              className="rounded-full border border-juniper/20 px-3.5 py-1.5 text-sm font-medium text-juniper/80 hover:border-juniper hover:text-juniper"
            >
              {n.name}
            </Link>
          ))}
          <Link
            href={`/home-care/${c.stateSlug}`}
            className="rounded-full border border-juniper/20 px-3.5 py-1.5 text-sm font-semibold text-juniper hover:border-juniper"
          >
            All {c.state} counties &rarr;
          </Link>
        </div>
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[15px] font-semibold text-juniper">
          <Link href={`/how-to-pay/${c.stateSlug}`} className="underline underline-offset-4 hover:text-juniper-deep">
            How to pay for home care in {c.state}
          </Link>
          <Link href="/pricing" className="underline underline-offset-4 hover:text-juniper-deep">
            Our published rates
          </Link>
          <Link href="/how-to-pay" className="underline underline-offset-4 hover:text-juniper-deep">
            Every way families pay
          </Link>
        </div>
      </section>

      {home && <RecruitBand />}
    </>
  );
}
