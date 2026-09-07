import Link from "next/link";
import { site } from "@/site.config";
import { states } from "@/lib/states";
import { countiesForState } from "@/lib/counties";
import { pageMeta } from "@/lib/seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Pill } from "@/components/Pill";

export const metadata = pageMeta({
  title: "Home Care by State & County",
  description:
    "Home care guides for all 50 states and every U.S. county: what care costs where you live, the Medicaid programs that pay for it, and how to vet an agency.",
  path: "/home-care",
});

export default function HomeCareIndexPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Home care" }]} />

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <p className="text-sm font-semibold uppercase tracking-wider text-clay">
          Home care guides
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl leading-[1.1] text-juniper sm:text-5xl">
          Home care where <em className="hero-italic">you</em> live
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-ink/80">
          Costs, Medicaid programs, and caregiver-training rules change at
          every state line — and the practical questions change county by
          county. Pick a state to see its real numbers and browse every county
          guide.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Pill href="/how-to-pay" variant="juniper">
            Every way families pay
          </Pill>
          <Pill href="/pricing" variant="juniperOutline">
            Our published rates
          </Pill>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <h2 className="text-2xl text-juniper sm:text-3xl">Browse by state</h2>
        <ul className="mt-6 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {states.map((s) => {
            const count = countiesForState(s.slug).length;
            return (
              <li key={s.slug}>
                <Link
                  href={`/home-care/${s.slug}`}
                  className="flex items-baseline justify-between gap-3 rounded-2xl border border-juniper/15 bg-white/60 px-4 py-3 transition-colors hover:border-juniper hover:bg-white"
                >
                  <span className="font-medium text-juniper">{s.name}</span>
                  <span className="shrink-0 text-sm text-ink/55">
                    {count} {count === 1 ? "county" : "counties"} · {s.hourlyCost}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <p className="mt-8 max-w-2xl text-[15px] leading-relaxed text-ink/70">
          We provide care in the {site.metro}, {site.stateAbbr} area. Everywhere
          else, these pages are a free guide — and a person still answers our
          phone, 24/7, if you want to talk your options through:{" "}
          <a href={site.phoneHref} className="font-semibold text-juniper underline underline-offset-2">
            {site.phone}
          </a>
          .
        </p>
      </section>
    </>
  );
}
