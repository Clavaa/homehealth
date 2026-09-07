import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/site.config";
import { pageMeta } from "@/lib/seo";
import { ServiceAreaModule } from "@/components/ServiceAreaModule";
import { MidPageCTA } from "@/components/MidPageCTA";
import { RecruitBand } from "@/components/RecruitBand";

export const metadata: Metadata = pageMeta({
  title: `Service Areas in ${site.county}, ${site.stateAbbr}`,
  description: `Towns and neighborhoods where ${site.name} provides home care across ${site.county}, ${site.stateAbbr} — with local caregivers who live nearby.`,
  path: "/service-areas",
});

export default function ServiceAreasPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="text-sm font-semibold uppercase tracking-wider text-clay">
          Service areas
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl leading-[1.1] text-juniper sm:text-5xl">
          Local care, close to <em className="hero-italic">home</em>
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-ink/80">
          We serve {site.county} and the communities around it. Local matters
          in this work: short commutes mean reliable caregivers, and a
          supervisor who can be at your door when something needs eyes on it.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {site.towns.map((t, i) => (
            <Link
              key={t.slug}
              href={`/service-areas/${t.slug}`}
              className={`group rounded-[var(--radius-card)] bg-white p-6 shadow-sm ring-1 ring-mist transition-shadow hover:shadow-md ${
                i === 0 ? "rounded-tl-[var(--radius-corner)]" : ""
              }`}
            >
              <h2 className="text-xl text-juniper group-hover:underline group-hover:underline-offset-4">
                Home care in {t.name}
              </h2>
              <p className="mt-2 text-[15px] text-ink/70">
                Caregivers, rates, and how to start in {t.name},{" "}
                {site.stateAbbr} &rarr;
              </p>
            </Link>
          ))}
        </div>
      </section>

      <ServiceAreaModule />

      <div className="py-16 sm:py-20">
        <MidPageCTA />
      </div>

      <RecruitBand />
    </>
  );
}
