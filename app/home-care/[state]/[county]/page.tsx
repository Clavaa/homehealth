import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { site } from "@/site.config";
import {
  counties,
  getCounty,
  neighborCounties,
  outOfStateNeighbors,
  getStateInfoForCounty,
  type County,
} from "@/lib/counties";
import type { StateInfo } from "@/lib/states";
import {
  getFacts,
  ageRank,
  rankPrefix,
  areaNoun,
  commas,
  dollars,
  costMath,
  type CountyFacts,
} from "@/lib/county-facts";
import {
  leadParagraph,
  costSection,
  supplySection,
  facilitySection,
  countyFaqs,
  vettingPoints,
} from "@/lib/county-narrative";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { MidPageCTA } from "@/components/MidPageCTA";
import { RecruitBand } from "@/components/RecruitBand";
import { Prose } from "@/components/Prose";
import { Pill } from "@/components/Pill";

export const dynamicParams = false;

export function generateStaticParams() {
  return counties.map((c) => ({ state: c.stateSlug, county: c.slug }));
}

function shortProgram(st: StateInfo): string {
  return st.programs[0].replace(/\s*\(.*\)$/, "");
}

function isHomeCounty(c: County): boolean {
  return c.name === site.county && c.state === site.state;
}

/**
 * Meta descriptions are built from the county's own figures, so they differ
 * on substance rather than by rotating a template. Each falls back a step
 * when the figure behind it is missing.
 */
function metaDescription(c: County, st: StateInfo, f: CountyFacts): string {
  const parts: string[] = [];
  if (f.pop65) parts.push(`${commas(f.pop65)} residents over 65`);
  if (f.hhAgencies) parts.push(`${f.hhAgencies} certified home health agencies`);
  if (f.nursingHomes) parts.push(`${f.nursingHomes} nursing homes`);

  const head = `Home care in ${c.name}, ${c.st}: `;
  const body =
    parts.length >= 2
      ? `${parts.slice(0, 2).join(", ")}, ${c.state} rates near ${st.hourlyCost}, and the Medicaid programs that pay.`
      : `costs near ${st.hourlyCost}, ${shortProgram(st)} coverage, and how to vet a local agency.`;
  const out = head + body;
  return out.length <= 158 ? out : out.slice(0, 155).replace(/\s+\S*$/, "") + "…";
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
  const f = getFacts(c.fips);
  const base = `Home Care in ${c.name}, ${c.st}`;
  const withBrand = `${base} | ${site.name}`;
  const title = withBrand.length <= 62 ? withBrand : base;
  const url = `${site.domain}/home-care/${c.stateSlug}/${c.slug}`;
  const description = metaDescription(c, st, f);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: site.name, type: "website", locale: "en_US" },
    twitter: { card: "summary", title, description },
  };
}

/** One figure in the stat band. */
function Stat({ value, label, note }: { value: string; label: string; note?: string }) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wider text-juniper/70">{label}</p>
      <p className="mt-2 font-[family-name:var(--font-display)] text-4xl font-semibold text-juniper">
        {value}
      </p>
      {note && <p className="mt-2 text-[14px] leading-relaxed text-ink/70">{note}</p>}
    </div>
  );
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

  const f = getFacts(c.fips);
  const home = isHomeCounty(c);
  const rank = ageRank(c);
  const money = costMath(f, st);
  const neighbors = neighborCounties(c, 7);
  const across = outOfStateNeighbors(c, 3);
  const aboveFloor = st.trainingHours > 75;
  const licensedBy = st.licensed
    ? st.licensure.replace(/^Yes\s*—\s*/, "").replace(/\s*\(.*\)$/, "")
    : null;

  const sections = [costSection(c, f, st), supplySection(c, f), facilitySection(c, f)].filter(
    (s): s is NonNullable<typeof s> => s !== null,
  );
  const faqs = countyFaqs(c, f, st, home);
  const checks = vettingPoints(c, f, st);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((q) => ({
      "@type": "Question",
      name: q.q,
      acceptedAnswer: { "@type": "Answer", text: q.a.replace(/\*\*/g, "") },
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
        <p className="mt-5 max-w-2xl text-lg text-ink/80">{leadParagraph(c, f)}</p>
        <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-ink/75">
          {home
            ? `This is where we live and work. Below: what care really costs here, who else provides it, and the ${c.state} programs that can pay for it.`
            : `Below is what we'd tell a friend in ${c.name}: what care costs here, who provides it, what the facility alternative actually looks like, and which programs pay.`}
        </p>
      </section>

      {/* This county, in numbers — all real, all county-specific */}
      {(f.pop65 || f.medianIncome || f.pctDisabled) && (
        <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
          <div className="rounded-[var(--radius-card)] rounded-tl-[var(--radius-corner)] bg-sand p-8 sm:p-10">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="text-2xl text-juniper sm:text-3xl">{c.name}, in numbers</h2>
              <Link
                href={`/how-to-pay/${c.stateSlug}`}
                className="text-[15px] font-semibold text-juniper underline underline-offset-4 hover:text-juniper-deep"
              >
                Full {c.state} guide &rarr;
              </Link>
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {f.pop65 !== undefined && f.pct65 !== undefined && (
                <Stat
                  value={commas(f.pop65)}
                  label="Residents 65+"
                  note={`${f.pct65}% of the ${areaNoun(c.state).one}${
                    rank && rank.total >= 20 && rank.age <= Math.ceil(rank.total / 4)
                      ? ` — the ${rankPrefix(rank.age)}highest share of ${c.state}'s ${rank.total} ${areaNoun(c.state).many}.`
                      : "."
                  }`}
                />
              )}
              {f.pctDisabled !== undefined && f.disabled !== undefined && (
                <Stat
                  value={`${f.pctDisabled}%`}
                  label="Live with a disability"
                  note={`About ${commas(f.disabled)} people — the population most likely to need help at home.`}
                />
              )}
              {f.medianIncome !== undefined && (
                <Stat
                  value={dollars(f.medianIncome)}
                  label="Median household income"
                  note={
                    money?.shareOfIncome
                      ? `20 hrs/week of care would run about ${money.shareOfIncome}% of it.`
                      : "What a typical household here earns in a year."
                  }
                />
              )}
              {f.hhAgencies !== undefined && (
                <Stat
                  value={commas(f.hhAgencies)}
                  label="Certified agencies"
                  note={
                    f.hhStar && f.hhRated
                      ? `Medicare-certified home health agencies serving local ZIPs; ${f.hhRated} rated, averaging ${f.hhStar}★.`
                      : "Medicare-certified home health agencies serving local ZIPs."
                  }
                />
              )}
            </div>
            <p className="mt-6 text-[13px] leading-relaxed text-ink/55">
              Sources: CDC/ATSDR Social Vulnerability Index 2022 (ACS 2018–2022), County Health
              Rankings 2024, and CMS Care Compare provider files.
            </p>
          </div>
        </section>
      )}

      {/* The written sections — which ones appear depends on this county's data */}
      {sections.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            {sections.map((s) => (
              <div key={s.heading}>
                <h2 className="text-2xl text-juniper sm:text-3xl">{s.heading}</h2>
                <div className="mt-4 space-y-4">
                  {s.paragraphs.map((para, i) => (
                    <Prose key={i} className="text-[16px] leading-relaxed text-ink/85">
                      {para}
                    </Prose>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Paying for care — state programs */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="rounded-[var(--radius-card)] bg-white p-8 shadow-sm ring-1 ring-mist sm:p-10">
          <h2 className="text-2xl text-juniper sm:text-3xl">
            The {c.state} programs that pay for care at home
          </h2>
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <ul className="flex flex-wrap gap-2">
                {st.programs.map((prog) => (
                  <li
                    key={prog}
                    className="rounded-full bg-sage px-3.5 py-1.5 text-[15px] font-medium text-juniper"
                  >
                    {prog}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-[16px] leading-relaxed text-ink/85">
                {st.programs.length === 1
                  ? `${c.state} runs one Medicaid pathway that pays for care at home instead of a nursing home. `
                  : `${c.state} runs ${st.programs.length} Medicaid pathways that pay for care at home instead of a nursing home. `}
                Each has its own income, asset, and care-need rules, and approval takes weeks to
                months — so the application is worth starting before the need becomes urgent.
              </p>
              <Link
                href={`/how-to-pay/${c.stateSlug}`}
                className="mt-4 inline-block text-[15px] font-semibold text-juniper underline underline-offset-4 hover:text-juniper-deep"
              >
                How each {c.state} program works &rarr;
              </Link>
            </div>
            <div className="rounded-[var(--radius-card)] bg-oat p-6">
              <p className="text-sm font-semibold uppercase tracking-wider text-juniper/70">
                Caregiver training in {c.st}
              </p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-4xl font-semibold text-juniper">
                {st.trainingHours} hrs
              </p>
              <p className="mt-2 text-[14px] leading-relaxed text-ink/75">
                Minimum for certified aides
                {aboveFloor ? " — above the 75-hour federal floor." : " (the federal minimum)."}{" "}
                {licensedBy
                  ? `Agencies are licensed by the ${licensedBy}.`
                  : `${c.st} does not license non-medical agencies, so vet carefully.`}
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
            body="This is our home county. Book a free in-home assessment and a care manager will come to the house, listen, and write up a plan — yours to keep whether or not you hire us."
          />
        </div>
      ) : (
        <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="rounded-[var(--radius-card)] bg-white p-8 shadow-sm ring-1 ring-mist">
              <h2 className="text-2xl text-juniper sm:text-3xl">
                Choosing an agency in {c.name}
              </h2>
              <ol className="mt-5 space-y-4 text-[16px] leading-relaxed text-ink/85">
                {checks.map((pt) => (
                  <li key={pt.title}>
                    <strong className="text-juniper">{pt.title}.</strong> {pt.body}
                  </li>
                ))}
              </ol>
            </div>
            <div className="flex flex-col justify-center rounded-[var(--radius-card)] rounded-br-[var(--radius-corner)] bg-juniper p-8 text-white">
              <h2 className="text-2xl text-white">Want to talk it through?</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-white/85">
                We provide care in the {site.metro}, {site.stateAbbr} area — but a person answers
                our line, and we&rsquo;re glad to help any family think through the options in{" "}
                {c.name}.
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
            {faqs.map((q) => (
              <div key={q.q} className="rounded-[var(--radius-card)] bg-white/80 p-6">
                <h3 className="text-lg font-semibold text-juniper">{q.q}</h3>
                <Prose className="mt-2 text-[15px] leading-relaxed text-ink/85">{q.a}</Prose>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Neighbors + deeper reading */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
        <p className="text-sm font-semibold uppercase tracking-wider text-juniper/70">
          Bordering {areaNoun(c.state).many} in {c.state}
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
            All {c.state} {areaNoun(c.state).many} &rarr;
          </Link>
        </div>

        {across.length > 0 && (
          <>
            <p className="mt-8 text-sm font-semibold uppercase tracking-wider text-juniper/70">
              Across the state line
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {across.map((n) => (
                <Link
                  key={n.fips}
                  href={`/home-care/${n.stateSlug}/${n.slug}`}
                  className="rounded-full border border-clay/30 px-3.5 py-1.5 text-sm font-medium text-clay-deep hover:border-clay"
                >
                  {n.name}, {n.st}
                </Link>
              ))}
            </div>
            <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-ink/65">
              Worth knowing if you live near the line: rules, rates, and Medicaid programs change
              at the border, and an agency an easy drive away may operate under a different set of
              them entirely.
            </p>
          </>
        )}

        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[15px] font-semibold text-juniper">
          <Link
            href={`/how-to-pay/${c.stateSlug}`}
            className="underline underline-offset-4 hover:text-juniper-deep"
          >
            How to pay for home care in {c.state}
          </Link>
          <Link href="/pricing" className="underline underline-offset-4 hover:text-juniper-deep">
            Our published rates
          </Link>
          <Link href="/services" className="underline underline-offset-4 hover:text-juniper-deep">
            What kinds of care exist
          </Link>
        </div>
      </section>

      {home && <RecruitBand />}
    </>
  );
}
