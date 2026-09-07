import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/site.config";
import { pageMeta } from "@/lib/seo";
import { states } from "@/lib/states";
import { MidPageCTA } from "@/components/MidPageCTA";
import { RecruitBand } from "@/components/RecruitBand";

export const metadata: Metadata = pageMeta({
  title: "How to Pay for Home Care",
  description:
    "The four real ways families pay for home care — private pay, Medicaid programs, VA benefits, and long-term care insurance — plus a guide for every state.",
  path: "/how-to-pay",
});

const ways = [
  {
    title: "Private pay",
    body: "Most families start here: paying the hourly rate directly, like any other household bill. It's the simplest path, and the only one with zero paperwork. Our rates are published — no surprises.",
    link: { href: "/pricing", label: "See our rates" },
  },
  {
    title: "Medicaid home & community programs",
    body: "Every state runs Medicaid programs that pay for care at home instead of a nursing home — often called HCBS waivers. Income and care-need rules apply, and the program names change at every state line. Your state's guide below names yours.",
    link: null,
  },
  {
    title: "VA benefits",
    body: "Wartime veterans and surviving spouses may qualify for Aid & Attendance — a monthly benefit that can go toward home care. Most eligible families have never heard of it. We'll help you get organized to apply.",
    link: { href: "/services/veterans-care", label: "Veterans home care" },
  },
  {
    title: "Long-term care insurance",
    body: "If your parent bought a long-term care policy years ago, it likely covers home care — but claiming it means care logs, invoices, and patience. We handle that paperwork for our clients every month.",
    link: null,
  },
];

export default function HowToPayPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="text-sm font-semibold uppercase tracking-wider text-clay">
          How to pay
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl leading-[1.1] text-juniper sm:text-5xl">
          Paying for home care, without the <em className="hero-italic">maze</em>
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-ink/80">
          There are four real ways families pay for home care. Here they are in
          plain English — then pick your state for the programs, rules, and
          costs where you live.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2">
          {ways.map((w, i) => (
            <div
              key={w.title}
              className={`flex flex-col rounded-[var(--radius-card)] bg-white p-7 shadow-sm ring-1 ring-mist ${
                i === 0 ? "rounded-tl-[var(--radius-corner)]" : ""
              }`}
            >
              <h2 className="text-xl text-juniper">{w.title}</h2>
              <p className="mt-2.5 flex-1 text-[15px] leading-relaxed text-ink/75">
                {w.body}
              </p>
              {w.link && (
                <Link
                  href={w.link.href}
                  className="mt-4 text-[15px] font-semibold text-juniper underline underline-offset-4"
                >
                  {w.link.label} &rarr;
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* State guide grid */}
      <section className="bg-sage">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <h2 className="text-3xl text-juniper sm:text-4xl">
            Pick your state
          </h2>
          <p className="mt-4 max-w-2xl text-ink/80">
            Program names, typical hourly costs, and aide-training rules are
            different in every state. Each guide covers yours in plain English.
          </p>
          <div className="mt-10 flex flex-wrap gap-2.5">
            {states.map((s) => (
              <Link
                key={s.slug}
                href={`/how-to-pay/${s.slug}`}
                className="rounded-full border-2 border-juniper/25 bg-white/70 px-4 py-2 text-[15px] font-medium text-juniper transition-colors hover:border-juniper hover:bg-white"
              >
                {s.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="py-16 sm:py-20">
        <MidPageCTA
          heading="We untangle this with families every week"
          body={`If you're near ${site.metro}, book a free assessment and bring your questions about paying for care — Medicaid, VA, insurance, all of it. We'll tell you what's realistic.`}
        />
      </div>

      <RecruitBand />
    </>
  );
}
