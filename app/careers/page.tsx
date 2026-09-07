import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { site } from "@/site.config";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";
import { CareerForm } from "@/components/CareerForm";
import { Pill } from "@/components/Pill";

export const metadata: Metadata = pageMeta({
  title: `Caregiver & HHA Jobs in ${site.metro}, ${site.stateAbbr}`,
  description: `Caregiver and home health aide jobs in ${site.county}: ${site.careers.payRange}, schedules that respect your life, and an office that answers when you call.`,
  path: "/careers",
});

const benefits = [
  {
    title: `${site.careers.payRange}, stated up front`,
    body: "You just read our pay range on a public webpage. That's how we treat people — no 'competitive pay' mystery, no surprises at the interview.",
  },
  {
    title: "Schedules that respect your life",
    body: "Mornings only, school hours, overnights, weekends — tell us what works and we build around it. No guilt-trip calls on your day off.",
  },
  {
    title: "Clients close to home",
    body: "We staff by neighborhood, so you're not burning an hour and a tank of gas between visits.",
  },
  {
    title: "Paid training, real support",
    body: "Paid orientation and ongoing training, plus a supervisor who picks up the phone — you're never alone with a hard situation.",
  },
  {
    title: "W-2 employment",
    body: "You're an employee, not a gig worker: payroll taxes handled, workers' comp, and pay that arrives on time, every time.",
  },
  {
    title: "Work that means something",
    body: "You'll know your clients by name and they'll know yours. Most of our team came from facilities — and stayed for this.",
  },
];

export default function CareersPage() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-clay">
            Careers
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl leading-[1.1] text-juniper sm:text-5xl">
            Caregiver &amp; HHA jobs in {site.metro} —{" "}
            <em className="hero-italic">{site.careers.payRange}</em>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-ink/80">
            Yes, the pay range is right there in the headline. If you&rsquo;re
            good at caring for people, we&rsquo;d like to meet you — experience
            helps, but heart trains well too.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Pill href="#apply" variant="juniper" size="lg">
              Apply in two minutes
            </Pill>
            <Pill href={site.phoneHref} variant="juniperOutline" size="lg">
              {site.phone}
            </Pill>
          </div>
        </div>
        <PhotoPlaceholder
          label="Careers hero photo"
          intent="Two caregivers in juniper polos laughing together by a car between visits — real team warmth, daylight, no stock smiles"
          bigCorner="bl"
          className="aspect-[4/3] w-full"
        />
      </section>

      {/* Benefits */}
      <section className="bg-sage">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <h2 className="max-w-2xl text-3xl text-juniper sm:text-4xl">
            What working here is actually like
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b, i) => (
              <div
                key={b.title}
                className={`rounded-[var(--radius-card)] bg-white p-7 shadow-sm ${
                  i === 0 ? "rounded-tl-[var(--radius-corner)]" : ""
                }`}
              >
                <h3 className="text-lg font-semibold text-juniper">{b.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink/75">
                  {b.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open roles */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <h2 className="text-3xl text-juniper sm:text-4xl">Open roles</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <Link
            href="/careers/home-health-aide"
            className="group rounded-[var(--radius-card)] rounded-br-[var(--radius-corner)] bg-white p-8 shadow-sm ring-1 ring-mist transition-shadow hover:shadow-md"
          >
            <p className="text-sm font-semibold uppercase tracking-wider text-juniper/60">
              {site.metro} · Part-time &amp; full-time
            </p>
            <h3 className="mt-2 text-2xl text-juniper group-hover:underline group-hover:underline-offset-4">
              Home health aide / caregiver
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-ink/75">
              Companion and personal care for older adults in their homes
              across {site.county}. {site.careers.payRange}.
            </p>
            <span className="mt-4 inline-block text-[15px] font-semibold text-juniper">
              Read the full role &rarr;
            </span>
          </Link>
          <div className="rounded-[var(--radius-card)] bg-sand p-8">
            <h3 className="text-2xl text-juniper">Don&rsquo;t see your fit?</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-ink/80">
              We hire for heart first. If you&rsquo;ve cared for a family
              member, worked in a facility, or just know this is your kind of
              work — apply anyway and tell us on the phone.
            </p>
          </div>
        </div>
      </section>

      {/* Application */}
      <section id="apply" className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="grid items-start gap-8 lg:grid-cols-[1.4fr_1fr]">
          <CareerForm />
          <div className="rounded-[var(--radius-card)] bg-white p-8 shadow-sm ring-1 ring-mist">
            <h3 className="text-xl text-juniper">How hiring works</h3>
            <ol className="mt-4 space-y-4 text-[15px] leading-relaxed text-ink/80">
              <li className="flex gap-3">
                <StepDot n={1} />
                <span>Apply here or call — we phone-screen the same business day.</span>
              </li>
              <li className="flex gap-3">
                <StepDot n={2} />
                <span>Meet us in person; bring your questions, we&rsquo;ll bring ours.</span>
              </li>
              <li className="flex gap-3">
                <StepDot n={3} />
                <span>Background check and paid orientation.</span>
              </li>
              <li className="flex gap-3">
                <StepDot n={4} />
                <span>Your first client — matched to your neighborhood and schedule.</span>
              </li>
            </ol>
          </div>
        </div>
      </section>
    </>
  );
}

function StepDot({ n }: { n: number }) {
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-juniper text-sm font-semibold text-white">
      {n}
    </span>
  );
}
