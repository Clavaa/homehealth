import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { site } from "@/site.config";
import { MidPageCTA } from "@/components/MidPageCTA";
import { RecruitBand } from "@/components/RecruitBand";

export const metadata: Metadata = pageMeta({
  title: "About Our Family-First Home Care",
  description: `Who ${site.name} is: a personal-care company built around families — screened W-2 caregivers, coordinators who answer, care that is verified.`,
  path: "/about",
});

const vettingSteps = [
  {
    title: "We screen before we ever say yes",
    body: "Every caregiver passes a background check and an in-person interview before they're hired — no exceptions, no shortcuts when a shift is hard to fill. If we wouldn't send someone to our own parent, we don't send them to yours.",
  },
  {
    title: "Files stay current, always",
    body: "A credentialing team keeps every caregiver's background checks, training records, and required certifications up to date. No complete file, no shift — that rule doesn't bend.",
  },
  {
    title: "Caregivers are employees, not gig workers",
    body: "Our HHAs and PCAs are W-2 employees: insured, bonded, taxes handled, paid on time. That protects your family — and it's why good caregivers stay with us.",
  },
  {
    title: "Support that picks up the phone",
    body: "Caregivers get paid training and a supervisor who answers. A caregiver who feels backed up shows up steadier, stays longer, and cares better. Families feel the difference.",
  },
];

const values = [
  {
    title: "Family first",
    body: "The question behind every decision is the same: would this be good enough for my own mother? If the answer is no, we don't do it.",
  },
  {
    title: "Say it plainly",
    body: "Care, costs, and coverage in plain English — on this website and on the phone. If something isn't a fit, we'll tell you that too.",
  },
  {
    title: "Show up",
    body: "On time, prepared, and consistently the same faces. Reliability isn't a feature of home care — it is home care.",
  },
  {
    title: "Follow the rules, every time",
    body: "State licensure rules, Medicaid program rules, visit verification — we treat compliance as part of caring for someone, not paperwork in the way of it.",
  },
];

const reasons = [
  {
    title: "A person answers, 24/7",
    body: "Nights, weekends, holidays — you reach a person, not a phone tree. When care is in your home, questions don't keep business hours.",
  },
  {
    title: "Structure behind every visit",
    body: "An intake coordinator who listens, a care coordinator who plans, a scheduler who keeps visits steady, and a verification team confirming every visit happened. You see one caregiver; a whole team stands behind them.",
  },
  {
    title: "Medicaid and private pay, both handled",
    body: "We work with Medicaid home-care programs and with families paying directly. Either way, our team handles the paperwork side so you can focus on the person, not the process.",
  },
  {
    title: "Nothing hidden",
    body: "Our rates are published. Our leadership is listed. Our screening process is described right on this page. Companies that do things properly don't need to be vague.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="text-sm font-semibold uppercase tracking-wider text-clay">
          About us
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl leading-[1.1] text-juniper sm:text-5xl">
          Care that feels like family, from a company that runs{" "}
          <em className="hero-italic">properly</em>
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-ink/80">
          {site.name} is a personal-care company. Our home health aides and
          personal care aides help people stay safely in their own homes — and
          behind every one of them is a real organization making sure the care
          is screened, scheduled, verified, and paid for correctly.
        </p>
      </section>

      {/* ── Our story ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
          <div className="space-y-5 text-ink/80">
            <h2 className="text-3xl text-juniper sm:text-4xl">Our story</h2>
            <p>
              Home care starts the same way in almost every family: something
              happens — a fall, a diagnosis, a hospital discharge — and
              suddenly someone you love needs help at home. The help itself is
              simple and human: bathing, dressing, meals, medication reminders,
              company. Getting it to happen reliably, week after week, is not.
            </p>
            <p>
              That&rsquo;s the company we built. {site.name} pairs
              family-first caregiving with the structure of a real
              personal-care organization: branches with local managers, intake
              coordinators who answer the first call, care coordinators who
              build the plan, schedulers who keep visits steady, recruiters who
              keep hiring good people, and a compliance team that verifies
              every visit actually happened.
            </p>
            <p>
              We serve families paying privately and families whose care is
              covered by Medicaid home-care programs — same caregivers, same
              standards, same phone number that a person actually answers.
            </p>
          </div>
          <div className="rounded-[var(--radius-card)] rounded-tr-[var(--radius-corner)] bg-sand p-8">
            <h3 className="text-xl text-juniper">What we are — and aren&rsquo;t</h3>
            <ul className="mt-4 space-y-3 text-[15px] leading-relaxed text-ink/80">
              <li>
                <strong className="text-juniper">We are</strong> a non-medical
                personal-care company employing home health aides (HHAs) and
                personal care aides (PCAs).
              </li>
              <li>
                <strong className="text-juniper">We are</strong> licensed where
                we operate, and our caregivers are screened, trained W-2
                employees.
              </li>
              <li>
                <strong className="text-juniper">We are not</strong> a
                hospital, hospice, or skilled-nursing provider — and if that&rsquo;s
                what your family needs, we&rsquo;ll say so on the first call.
              </li>
            </ul>
            <Link
              href="/services"
              className="mt-5 inline-block text-[15px] font-semibold text-juniper underline underline-offset-4"
            >
              See what our caregivers do &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ── How we vet and support caregivers (sage band) ──────── */}
      <section className="bg-sage">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="max-w-2xl">
            <h2 className="text-3xl text-juniper sm:text-4xl">
              How we vet and support our caregivers
            </h2>
            <p className="mt-4 text-ink/80">
              The person who walks into your home is the whole company, as far
              as your family is concerned. So this is where we&rsquo;re
              strictest — and most generous.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {vettingSteps.map((v, i) => (
              <div
                key={v.title}
                className={`rounded-[var(--radius-card)] bg-white p-7 shadow-sm ${
                  i === 0 ? "rounded-tl-[var(--radius-corner)]" : ""
                }`}
              >
                <h3 className="text-lg font-semibold text-juniper">{v.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink/75">
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <h2 className="text-3xl text-juniper sm:text-4xl">What we stand on</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div
              key={v.title}
              className="rounded-[var(--radius-card)] bg-white p-7 shadow-sm ring-1 ring-mist"
            >
              <h3 className="text-lg font-semibold text-juniper">{v.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink/75">
                {v.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Why families choose us ─────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 className="text-3xl text-juniper sm:text-4xl">
              Why families choose us
            </h2>
            <p className="mt-4 max-w-md text-ink/80">
              Not slogans — just how the company is built. Every one of these
              is something you can check for yourself, starting with the phone
              number at the top of this page.
            </p>
            <Link
              href="/about/leadership"
              className="mt-6 inline-block text-[15px] font-semibold text-juniper underline underline-offset-4"
            >
              Meet the people responsible &rarr;
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {reasons.map((r) => (
              <div
                key={r.title}
                className="rounded-[var(--radius-card)] bg-white p-7 shadow-sm ring-1 ring-mist"
              >
                <h3 className="text-lg font-semibold text-juniper">{r.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink/75">
                  {r.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA to the assessment (the page's one clay moment) ── */}
      <div className="pb-16 sm:pb-20">
        <MidPageCTA
          heading="The best way to know us is to meet us"
          body="A free in-home assessment is how every family starts. A care coordinator visits, listens, and writes up a plan — no cost, no pressure, no obligation."
        />
      </div>

      <RecruitBand />
    </>
  );
}
