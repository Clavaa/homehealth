import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { site } from "@/site.config";
import { CareerForm } from "@/components/CareerForm";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Pill } from "@/components/Pill";

export const metadata: Metadata = pageMeta({
  title: `Home Health Aide Job in ${site.metro}, ${site.stateAbbr}`,
  description: `Home health aide / caregiver role in ${site.county}, ${site.stateAbbr}: ${
    site.careers.payRange ? `${site.careers.payRange}, ` : ""
  }W-2 employment, paid training, schedules that respect your life.`,
  path: "/careers/home-health-aide",
});

const duties = [
  "Companionship — conversation, meals together, activities your client enjoys",
  "Personal care: bathing, dressing, grooming, toileting, done with dignity",
  "Light housekeeping, laundry, and meal preparation",
  "Medication reminders and simple care notes after each visit",
  "Steadying help with walking and transfers, and fall-risk awareness",
  "Rides and company for errands and appointments (mileage reimbursed)",
];

const requirements = [
  "A caring, reliable presence — references who'll vouch for it",
  "Ability to pass a background check",
  "A valid driver's license and dependable transportation",
  "Physical ability to assist clients safely (training provided)",
  "Experience or certification (CNA/HHA) welcome — not required to start",
];

export default function HhaRolePage() {
  const jobPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: "Home Health Aide / Caregiver",
    description:
      `Provide companion and personal care to older adults in their homes across ${site.county}, ${site.stateAbbr}. Duties include companionship, bathing and dressing assistance, meal preparation, light housekeeping, medication reminders, and transportation. W-2 employment with paid training and flexible scheduling.`,
    // TODO: refresh datePosted when the posting is (re)published for real.
    datePosted: new Date().toISOString().slice(0, 10),
    employmentType: ["FULL_TIME", "PART_TIME"],
    hiringOrganization: {
      "@type": "Organization",
      name: site.name,
      sameAs: site.domain,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: site.metro,
        addressRegion: site.stateAbbr,
        addressCountry: "US",
      },
    },
    ...(site.careers.payMin && site.careers.payMax
      ? {
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: "USD",
            value: {
              "@type": "QuantitativeValue",
              minValue: site.careers.payMin,
              maxValue: site.careers.payMax,
              unitText: "HOUR",
            },
          },
        }
      : {}),
    directApply: true,
  };

  return (
    <>
      <JsonLd data={jobPostingJsonLd} />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Careers", href: "/careers" },
          { name: "Home health aide" },
        ]}
      />

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <p className="text-sm font-semibold uppercase tracking-wider text-clay">
          Open role · {site.metro}, {site.stateAbbr}
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl leading-[1.1] text-juniper sm:text-5xl">
          Home health aide —{" "}
          <em className="hero-italic">
            {site.careers.payRange ?? "join our team"}
          </em>
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-ink/80">
          Part-time and full-time, W-2, paid training. You&rsquo;ll help older
          adults stay safely in their own homes — and be treated like the
          professional you are while you do it.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Pill href="#apply" variant="juniper" size="lg">
            Apply in two minutes
          </Pill>
          {site.phone && site.phoneHref && (
            <Pill href={site.phoneHref} variant="juniperOutline" size="lg">
              {site.phone}
            </Pill>
          )}
        </div>
      </section>

      <section className="bg-sage">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h2 className="text-2xl text-juniper sm:text-3xl">
                What you&rsquo;ll do
              </h2>
              <ul className="mt-5 space-y-3">
                {duties.map((d) => (
                  <li key={d} className="flex items-start gap-3 text-[16px] text-ink/85">
                    <Dot />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl text-juniper sm:text-3xl">
                What we&rsquo;re looking for
              </h2>
              <ul className="mt-5 space-y-3">
                {requirements.map((r) => (
                  <li key={r} className="flex items-start gap-3 text-[16px] text-ink/85">
                    <Dot />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 rounded-[var(--radius-card)] bg-white/80 p-6">
                <h3 className="text-lg font-semibold text-juniper">
                  Pay &amp; schedule
                </h3>
                <p className="mt-2 text-[16px] text-ink/85">
                  {site.careers.payRange ? (
                    <>
                      <strong>{site.careers.payRange}</strong> based on
                      experience and shift type.
                    </>
                  ) : (
                    <>
                      Pay is based on experience and shift type, and we state
                      the number on the first call — not after an interview.
                    </>
                  )}{" "}
                  Mornings, days, overnights, and weekends available — tell us
                  what fits your life.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="apply" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid items-start gap-8 lg:grid-cols-[1.4fr_1fr]">
          <CareerForm role="Home Health Aide" />
          {site.phone && site.phoneHref ? (
            <div className="rounded-[var(--radius-card)] bg-white p-8 shadow-sm ring-1 ring-mist">
              <h3 className="text-xl text-juniper">Prefer to just call?</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink/80">
                Call{" "}
                <a href={site.phoneHref} className="font-semibold text-juniper underline">
                  {site.phone}
                </a>{" "}
                and say you&rsquo;re applying — a real person from the
                scheduling team will talk you through it.
              </p>
            </div>
          ) : (
            <div className="rounded-[var(--radius-card)] bg-white p-8 shadow-sm ring-1 ring-mist">
              <h3 className="text-xl text-juniper">What happens next</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink/80">
                Send the form and a real person from the scheduling team reads
                it — usually the same business day. No portal, no automated
                rejection email, no six-stage process.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function Dot() {
  return (
    <span aria-hidden="true" className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-juniper" />
  );
}
