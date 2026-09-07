import Link from "next/link";
import { site } from "@/site.config";
import { services } from "@/lib/services";
import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="bg-ink text-white/80">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo reversed />
            <p className="mt-3 max-w-xs text-[15px] leading-relaxed">
              Home care from a local team in {site.county}, {site.stateAbbr}.
              A person answers our phone, day and night.
            </p>
            <a
              href={site.phoneHref}
              className="mt-4 inline-block text-lg font-semibold text-butter hover:text-white"
            >
              {site.phone}
            </a>
            <p className="mt-1 text-sm">
              <a href={`mailto:${site.email}`} className="hover:text-white">
                {site.email}
              </a>
            </p>
          </div>

          <nav aria-label="Services">
            <p className="text-sm font-semibold uppercase tracking-wider text-white/50">
              Services
            </p>
            <ul className="mt-3 space-y-2 text-[15px]">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="hover:text-white">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Families">
            <p className="text-sm font-semibold uppercase tracking-wider text-white/50">
              For families
            </p>
            <ul className="mt-3 space-y-2 text-[15px]">
              <li>
                <Link href="/pricing" className="hover:text-white">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/how-to-pay" className="hover:text-white">
                  How to pay for home care
                </Link>
              </li>
              <li>
                <Link
                  href={`/how-to-pay/${site.state.toLowerCase().replace(/ /g, "-")}`}
                  className="hover:text-white"
                >
                  Paying for care in {site.state}
                </Link>
              </li>
              <li>
                <Link href="/home-care" className="hover:text-white">
                  Home care by state &amp; county
                </Link>
              </li>
              <li>
                <Link href="/service-areas" className="hover:text-white">
                  Towns we serve
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/about/leadership" className="hover:text-white">
                  Our leadership
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Caregivers">
            <p className="text-sm font-semibold uppercase tracking-wider text-white/50">
              For caregivers
            </p>
            <ul className="mt-3 space-y-2 text-[15px]">
              <li>
                <Link href="/careers" className="hover:text-white">
                  Caregiver &amp; HHA jobs
                </Link>
              </li>
              <li>
                <Link href="/careers/home-health-aide" className="hover:text-white">
                  Home health aide role
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-12 border-t border-white/15 pt-6 text-sm text-white/50">
          <p>
            &copy; {new Date().getFullYear()} {site.name}. Serving{" "}
            {site.county} and nearby communities.
          </p>
          <p className="mt-2 max-w-2xl leading-relaxed">
            We provide non-medical home care. We are not a hospice, hospital, or
            skilled-nursing provider, and nothing on this site is medical
            advice.
          </p>
        </div>
      </div>
      {/* Spacer so the sticky mobile call bar never covers footer content */}
      <div className="h-20 lg:hidden" aria-hidden="true" />
    </footer>
  );
}
