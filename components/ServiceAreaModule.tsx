import Link from "next/link";
import { site } from "@/site.config";
import { ZipCheck } from "@/components/ZipCheck";

/** Sage service-area band: town chips (each a town page) + ZIP availability. */
export function ServiceAreaModule() {
  return (
    <section className="bg-sage">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-juniper/70">
              Where we work
            </p>
            <h2 className="mt-2 text-3xl text-juniper sm:text-4xl">
              Caregivers across {site.county}
            </h2>
            <p className="mt-4 max-w-lg text-ink/80">
              We&rsquo;re a local team, and we stay local on purpose — close
              enough that a supervisor can be at your door, and your
              caregiver&rsquo;s commute never becomes your problem.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {site.towns.map((t) => (
                <Link
                  key={t.slug}
                  href={`/service-areas/${t.slug}`}
                  className="rounded-full border-2 border-juniper/25 bg-white/70 px-4 py-2 text-[15px] font-medium text-juniper transition-colors hover:border-juniper hover:bg-white"
                >
                  {t.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="lg:pt-12">
            <h3 className="text-xl text-juniper">Is your address in range?</h3>
            <p className="mb-4 mt-2 text-[15px] text-ink/75">
              Enter your ZIP and we&rsquo;ll tell you right away.
            </p>
            <ZipCheck />
          </div>
        </div>
      </div>
    </section>
  );
}
