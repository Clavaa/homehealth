import type { Metadata } from "next";
import Link from "next/link";
import { site, hourlyRange, RATE_TBD } from "@/site.config";
import { pageMeta } from "@/lib/seo";
import { PricingPersonas } from "@/components/PricingPersonas";
import { MidPageCTA } from "@/components/MidPageCTA";
import { RecruitBand } from "@/components/RecruitBand";
import { Pill } from "@/components/Pill";

export const metadata: Metadata = pageMeta({
  title: `Home Care Pricing in ${site.metro}, ${site.stateAbbr}`,
  description: `What home care costs in ${site.county}: ${
    hourlyRange() ? `our real hourly rates (${hourlyRange()})` : "how our pricing works"
  }, what's included, and every way families pay. No contracts.`,
  path: "/pricing",
});

const included = [
  {
    title: "Scheduling & backup",
    body: "If your caregiver is sick, we staff the shift — you never wake up to a no-show and a scramble.",
  },
  {
    title: "Supervision",
    body: "A care manager builds the plan, checks in at home, and adjusts as needs change. You always have one person to call.",
  },
  {
    title: "Insurance & payroll",
    body: "Our caregivers are employees — insured, bonded, background-checked, with taxes handled. Nothing lands on you.",
  },
  {
    title: "No contracts",
    body: "Change the schedule, pause, or stop anytime. Care should earn its keep every single week.",
  },
];

const faqs = [
  {
    q: "Why do agencies hide their prices — and you don't?",
    a: "Most agencies want your phone number before they'll say a number. We'd rather you arrive knowing the range, so the first call is about your mom, not a sales script.",
  },
  {
    q: "What makes the rate vary?",
    a: `Level of care and schedule. Companion visits sit near the lower end; hands-on personal care, overnights, and short shifts sit higher. After a free assessment we quote one flat rate in writing${
      hourlyRange() ? ` — the range on this page (${hourlyRange()}) is what that quote lands inside.` : ", with no obligation to accept it."
    }`,
  },
  {
    q: "Is there a minimum?",
    a: site.rates.minimumShiftHours
      ? `Yes — visits start at ${site.rates.minimumShiftHours} hours, long enough for a caregiver to do real good rather than rush in and out.`
      : "Yes — we set a visit minimum so a caregiver can do real good rather than rush in and out. We'll confirm it at your free assessment.",
  },
  {
    q: "Does insurance or Medicaid pay for any of this?",
    a: "Often, yes — long-term care insurance, VA benefits, and Medicaid programs all pay for home care for families who qualify. We help with all three.",
  },
];

export default function PricingPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="text-sm font-semibold uppercase tracking-wider text-clay">
          Pricing
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl leading-[1.1] text-juniper sm:text-5xl">
          {hourlyRange() ? (
            <>
              Real rates, in <em className="hero-italic">writing</em> — before
              you ever talk to us
            </>
          ) : (
            <>
              One flat rate, in <em className="hero-italic">writing</em> — and
              no sales call to get it
            </>
          )}
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-ink/80">
          {hourlyRange() ? (
            <>
              Home care in {site.county} with our team runs{" "}
              <strong className="text-juniper">{hourlyRange()}</strong>,
              depending on the level of care and schedule. That&rsquo;s the
              whole answer — no sales call required to hear it.
            </>
          ) : (
            <>
              Home care in {site.county} is priced by the hour, and what you
              pay depends on the level of care and the schedule. We quote one
              flat rate in writing after a free in-home assessment — and
              you&rsquo;re under no obligation to take it.
            </>
          )}
        </p>
      </section>

      <PricingPersonas showLink={false} />

      {/* What every rate includes */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <h2 className="text-3xl text-juniper sm:text-4xl">
          Every rate includes the parts you can&rsquo;t see
        </h2>
        <p className="mt-4 max-w-2xl text-ink/80">
          An hourly rate from an agency buys more than the hours. Here&rsquo;s
          what&rsquo;s inside ours — and why it costs more than hiring a
          caregiver off a classifieds site.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {included.map((item, i) => (
            <div
              key={item.title}
              className={`rounded-[var(--radius-card)] bg-white p-7 shadow-sm ring-1 ring-mist ${
                i === 3 ? "rounded-br-[var(--radius-corner)]" : ""
              }`}
            >
              <h3 className="text-xl text-juniper">{item.title}</h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-ink/75">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-sage">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <h2 className="text-3xl text-juniper sm:text-4xl">
            Honest answers about cost
          </h2>
          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            {faqs.map((f) => (
              <div key={f.q}>
                <h3 className="text-lg font-semibold text-juniper">{f.q}</h3>
                <p className="mt-2 text-[16px] leading-relaxed text-ink/85">
                  {f.a}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-12 rounded-[var(--radius-card)] bg-white/80 p-7 sm:flex sm:items-center sm:justify-between">
            <p className="max-w-xl text-[16px] text-ink/85">
              <strong className="text-juniper">
                Worried about affording care?
              </strong>{" "}
              Many families pay less than they fear — Medicaid programs, VA
              benefits, and long-term care insurance all help.
            </p>
            <Pill href="/how-to-pay" variant="juniper" size="lg" className="mt-4 shrink-0 sm:mt-0">
              See ways to pay
            </Pill>
          </div>
        </div>
      </section>

      <div className="py-16 sm:py-20">
        <MidPageCTA
          heading="Get your exact quote, free"
          body="A care manager visits, listens, and hands you a flat rate in writing — with no contract attached and no pressure to start."
        />
      </div>

      <RecruitBand />
    </>
  );
}
