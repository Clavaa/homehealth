import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { site } from "@/site.config";
import { states, getState } from "@/lib/states";
import { countiesForState } from "@/lib/counties";
import { MidPageCTA } from "@/components/MidPageCTA";
import { RecruitBand } from "@/components/RecruitBand";
import { Pill } from "@/components/Pill";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export function generateStaticParams() {
  return states.map((s) => ({ state: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const st = getState((await params).state);
  if (!st) return {};
  const title = `Paying for Home Care in ${st.name}`;
  const description = `What home care costs in ${st.name} (around ${st.hourlyCost}), the Medicaid programs that pay for care at home, and how caregivers are vetted.`;
  const url = `${site.domain}/how-to-pay/${st.slug}`;
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

export default async function StateHowToPayPage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const st = getState((await params).state);
  if (!st) notFound();

  const isHomeState = st.name === site.state;
  // Graceful licensure copy: the dataset marks whether the state licenses
  // non-medical home care agencies. Detail text follows "Yes — " when present.
  const licensedBy = st.licensed
    ? st.licensure.replace(/^Yes\s*—\s*/, "")
    : null;
  const aboveFederalFloor = st.trainingHours > 75;

  const stateCounties = countiesForState(st.slug);

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "How to pay", href: "/how-to-pay" },
          { name: st.name },
        ]}
      />
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <p className="text-sm font-semibold uppercase tracking-wider text-clay">
          How to pay · {st.name}
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl leading-[1.1] text-juniper sm:text-5xl">
          How to pay for home care in{" "}
          <em className="hero-italic">{st.name}</em>
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-ink/80">
          The short version: home care in {st.name} typically runs around{" "}
          <strong className="text-juniper">{st.hourlyCost}</strong> when paying
          privately — and if money is tight, {st.name} has Medicaid programs
          that pay for care at home for people who qualify.
        </p>
      </section>

      {/* Cost card */}
      <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[var(--radius-card)] rounded-tl-[var(--radius-corner)] bg-sand p-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-juniper/70">
              Typical cost
            </p>
            <p className="mt-3 font-[family-name:var(--font-display)] text-5xl font-semibold text-juniper">
              {st.hourlyCost}
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-ink/75">
              A typical hourly rate for agency home care in {st.name}. Your
              quote depends on the level of care, the schedule, and where in
              the state you live.
            </p>
          </div>

          <div className="rounded-[var(--radius-card)] bg-white p-8 shadow-sm ring-1 ring-mist lg:col-span-2">
            <p className="text-sm font-semibold uppercase tracking-wider text-juniper/70">
              What that buys
            </p>
            <p className="mt-3 text-[16px] leading-relaxed text-ink/85">
              With a real agency, the hourly rate covers more than the hours:
              a trained, background-checked caregiver, a supervisor who builds
              and adjusts the care plan, backup staffing when someone is sick,
              and insurance so nothing lands on your family. Hiring privately
              looks cheaper per hour — until you become the employer, the
              scheduler, and the backup plan.
            </p>
            <Link
              href="/pricing"
              className="mt-4 inline-block text-[15px] font-semibold text-juniper underline underline-offset-4"
            >
              See how we price care &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Medicaid programs */}
      <section className="bg-sage">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
          <h2 className="max-w-2xl text-3xl text-juniper sm:text-4xl">
            {st.name} Medicaid programs that pay for care at home
          </h2>
          <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-ink/85">
            Regular Medicaid pays for nursing homes. These programs exist so
            people can get the same kind of help <em>at home</em> instead —
            usually with limits on income and savings, and a care-need check.
            In {st.name}, the {st.programs.length === 1 ? "program is" : "programs are"}:
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {st.programs.map((p) => (
              <div
                key={p}
                className="rounded-[var(--radius-card)] bg-white/80 px-6 py-5"
              >
                <p className="text-lg font-semibold text-juniper">{p}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 max-w-2xl space-y-4 text-[16px] leading-relaxed text-ink/85">
            <p>
              How it works, simply: you (or your parent) apply through the
              state, a nurse or social worker visits to confirm care is needed,
              and if approved, the program pays an approved provider for a set
              number of care hours each week.
            </p>
            <p>
              Approval takes patience — weeks to months is normal — so if you
              think you might qualify, start the application before the need
              becomes urgent, and use private-pay care to bridge the gap if you
              can.
            </p>
          </div>
        </div>
      </section>

      {/* Licensure & training */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <h2 className="text-3xl text-juniper sm:text-4xl">
          How caregivers are trained and vetted in {st.name}
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-[var(--radius-card)] bg-white p-7 shadow-sm ring-1 ring-mist">
            <h3 className="text-xl text-juniper">Training hours</h3>
            <p className="mt-2.5 text-[16px] leading-relaxed text-ink/85">
              Every certified home health aide completes at least{" "}
              {st.trainingHours} hours of training in {st.name}
              {aboveFederalFloor
                ? " — more than the 75-hour federal minimum most states use."
                : ", the federal minimum."}{" "}
              Good agencies train past the minimum and keep training all year.
            </p>
          </div>
          <div className="rounded-[var(--radius-card)] rounded-br-[var(--radius-corner)] bg-white p-7 shadow-sm ring-1 ring-mist">
            <h3 className="text-xl text-juniper">Agency oversight</h3>
            {licensedBy ? (
              <p className="mt-2.5 text-[16px] leading-relaxed text-ink/85">
                {st.name} licenses home care agencies through the{" "}
                {licensedBy.replace(/\s*\(.*\)$/, "")}. Before hiring any
                agency, ask to see its license — a legitimate agency will show
                you without hesitation.
              </p>
            ) : (
              <p className="mt-2.5 text-[16px] leading-relaxed text-ink/85">
                {st.name} does not require a state license for non-medical home
                care agencies — which makes your own vetting matter more. Ask
                any agency about background checks, insurance and bonding, and
                who supervises the caregivers. If the answers are vague, keep
                looking.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Local vs. informational close */}
      {isHomeState ? (
        <div className="pb-16 sm:pb-20">
          <MidPageCTA
            heading={`We help ${site.state} families through this every week`}
            body={`Paying for care is half the battle. Book a free assessment and we'll walk through your real options — ${st.programs[0]}, VA benefits, insurance, and what private pay would look like.`}
          />
        </div>
      ) : (
        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20">
          <div className="rounded-[var(--radius-card)] rounded-bl-[var(--radius-corner)] bg-sand px-8 py-10 sm:px-12">
            <h2 className="max-w-2xl text-2xl text-juniper sm:text-3xl">
              We provide care in {site.county}, {site.stateAbbr}
            </h2>
            <p className="mt-3 max-w-2xl text-ink/80">
              This guide is here to help wherever you live. If your family is
              in the {site.metro} area, we&rsquo;d love to help directly — and
              our first visit is always free.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Pill href="/#assessment" variant="clay" size="lg">
                Book a free care assessment
              </Pill>
              <Pill href={site.phoneHref} variant="juniperOutline" size="lg">
                {site.phone}
              </Pill>
            </div>
          </div>
        </section>
      )}

      {/* Browse by county */}
      {stateCounties.length > 0 && (
        <section className="bg-sage">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
            <h2 className="max-w-2xl text-3xl text-juniper sm:text-4xl">
              Browse {st.name} by county
            </h2>
            <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-ink/85">
              Costs and programs are set statewide, but the practical questions
              are local. Every {st.name} county has its own guide — population
              framing, costs, Medicaid programs, and FAQs.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {stateCounties.map((c) => (
                <Link
                  key={c.fips}
                  href={`/home-care/${c.stateSlug}/${c.slug}`}
                  className="rounded-full border border-juniper/25 bg-white/70 px-3.5 py-1.5 text-sm font-medium text-juniper transition-colors hover:border-juniper hover:bg-white"
                >
                  {c.name}
                </Link>
              ))}
            </div>
            <Link
              href={`/home-care/${st.slug}`}
              className="mt-6 inline-block text-[15px] font-semibold text-juniper underline underline-offset-4 hover:text-juniper-deep"
            >
              All {st.name} county guides &rarr;
            </Link>
          </div>
        </section>
      )}

      {/* Neighbor states */}
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-juniper/70">
          Other states
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {states
            .filter((s) => s.slug !== st.slug)
            .slice(0, 12)
            .map((s) => (
              <Link
                key={s.slug}
                href={`/how-to-pay/${s.slug}`}
                className="rounded-full border border-juniper/20 px-3.5 py-1.5 text-sm font-medium text-juniper/80 hover:border-juniper hover:text-juniper"
              >
                {s.name}
              </Link>
            ))}
          <Link
            href="/how-to-pay"
            className="rounded-full border border-juniper/20 px-3.5 py-1.5 text-sm font-semibold text-juniper hover:border-juniper"
          >
            All states &rarr;
          </Link>
        </div>
      </section>

      <RecruitBand />
    </>
  );
}
