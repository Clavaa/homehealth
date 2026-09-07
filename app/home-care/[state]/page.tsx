import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { site } from "@/site.config";
import { states, getState } from "@/lib/states";
import { countiesForState, formatPop } from "@/lib/counties";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Pill } from "@/components/Pill";

export const dynamicParams = false;

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
  const count = countiesForState(st.slug).length;
  const title = `Home Care in ${st.name} by County`;
  const description = `Home care in ${st.name}: typical costs around ${st.hourlyCost}, Medicaid programs that pay for care at home, and a local guide for each of ${count} counties.`;
  const url = `${site.domain}/home-care/${st.slug}`;
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

export default async function StateCountyIndexPage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const st = getState((await params).state);
  if (!st) notFound();
  const list = countiesForState(st.slug);
  const isHomeState = st.name === site.state;

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Home care", href: "/home-care" },
          { name: st.name },
        ]}
      />

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <p className="text-sm font-semibold uppercase tracking-wider text-clay">
          Home care · {st.name}
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl leading-[1.1] text-juniper sm:text-5xl">
          Home care in {st.name}, county by{" "}
          <em className="hero-italic">county</em>
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-ink/80">
          Agency home care in {st.name} typically runs around{" "}
          <strong className="text-juniper">{st.hourlyCost}</strong>, and the
          state&rsquo;s Medicaid {st.programs.length === 1 ? "program" : "programs"}{" "}
          — {st.programs.join(", ")} — can pay for care at home for people who
          qualify. Pick your county below for local framing, costs, and FAQs.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Pill href={`/how-to-pay/${st.slug}`} variant="juniper">
            How to pay in {st.name}
          </Pill>
          <Pill href="/pricing" variant="juniperOutline">
            Our published rates
          </Pill>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <h2 className="text-2xl text-juniper sm:text-3xl">
          Every {st.name} county
        </h2>
        <ul className="mt-6 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => (
            <li key={c.fips}>
              <Link
                href={`/home-care/${c.stateSlug}/${c.slug}`}
                className="flex items-baseline justify-between gap-3 rounded-2xl border border-juniper/15 bg-white/60 px-4 py-3 transition-colors hover:border-juniper hover:bg-white"
              >
                <span className="font-medium text-juniper">{c.name}</span>
                <span className="shrink-0 text-sm text-ink/55">
                  {formatPop(c.pop).replace("about ", "~")}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {isHomeState && (
        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <div className="rounded-[var(--radius-card)] rounded-bl-[var(--radius-corner)] bg-sand px-8 py-10 sm:px-12">
            <h2 className="max-w-2xl text-2xl text-juniper sm:text-3xl">
              We provide care in {site.county}, {site.stateAbbr}
            </h2>
            <p className="mt-3 max-w-2xl text-ink/80">
              If your family is in the {site.metro} area, we&rsquo;d love to
              help directly — and the first in-home assessment is always free.
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
    </>
  );
}
