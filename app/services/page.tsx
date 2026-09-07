import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/site.config";
import { pageMeta } from "@/lib/seo";
import { services } from "@/lib/services";
import { MidPageCTA } from "@/components/MidPageCTA";
import { RecruitBand } from "@/components/RecruitBand";

export const metadata: Metadata = pageMeta({
  title: `Home Care Services in ${site.metro}, ${site.stateAbbr}`,
  description: `Nine kinds of help at home in ${site.county}: companion, personal, dementia, 24-hour, live-in, overnight, respite, post-hospital and veterans care.`,
  path: "/services",
});

export default function ServicesIndexPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="text-sm font-semibold uppercase tracking-wider text-clay">
          Services
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl text-juniper sm:text-5xl">
          Nine kinds of help, one calm <em className="hero-italic">plan</em>
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-ink/80">
          You don&rsquo;t need to know which service you need — that&rsquo;s
          our job. Read what fits, or just tell us what&rsquo;s going on and
          we&rsquo;ll shape the plan with you.
        </p>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className={`group flex flex-col rounded-[var(--radius-card)] bg-white p-7 shadow-sm ring-1 ring-mist transition-shadow hover:shadow-md ${
                i === 0 ? "rounded-tl-[var(--radius-corner)]" : ""
              }`}
            >
              <h2 className="text-xl text-juniper group-hover:underline group-hover:underline-offset-4">
                {s.name}
              </h2>
              <p className="mt-2.5 flex-1 text-[15px] leading-relaxed text-ink/75">
                {s.short}
              </p>
              <span className="mt-4 text-[15px] font-semibold text-juniper">
                Read more &rarr;
              </span>
            </Link>
          ))}
        </div>
      </section>
      <div className="pb-16 sm:pb-20">
        <MidPageCTA />
      </div>
      <RecruitBand />
    </>
  );
}
