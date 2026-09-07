import Link from "next/link";
import { site } from "@/site.config";
import { Logo } from "@/components/Logo";
import { MobileMenu } from "@/components/MobileMenu";

const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/service-areas", label: "Service areas" },
  { href: "/how-to-pay", label: "How to pay" },
  { href: "/about", label: "About" },
];

/**
 * Utility bar (caregiver-recruiting link lives here and only here, per the
 * Style Bible) + main nav.
 *
 * Layout rules that keep this from squishing:
 *  - Exactly five top-level items; everything else overflows to the footer.
 *  - The phone gets the quiet "utility" treatment (icon + text link), not a
 *    wide outlined pill — and the number only appears at xl. At lg it is an
 *    icon-only link so nothing wraps at 1024px.
 *  - One clay CTA pill ("Book a free assessment") is the single loud element.
 *  - Below lg: hamburger menu (MobileMenu) + compact phone icon button.
 */
export function Header() {
  return (
    <header className="relative z-40">
      {/* Utility bar */}
      <div className="bg-juniper text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2 text-sm sm:px-6">
          <p className="hidden sm:block">
            A person answers, 24/7 — {site.county} owned &amp; operated
          </p>
          <p className="sm:hidden">A person answers, 24/7</p>
          <Link
            href="/careers"
            className="shrink-0 font-medium text-white/85 underline-offset-4 hover:text-white hover:underline"
          >
            Caregivers: join our team
          </Link>
        </div>
      </div>

      {/* Main bar */}
      <div className="relative border-b border-mist bg-oat/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <Link href="/" aria-label={`${site.name} — home`} className="flex shrink-0 items-center">
            <Logo />
          </Link>

          <nav
            aria-label="Main"
            className="hidden items-center gap-5 whitespace-nowrap text-[15px] font-medium lg:flex xl:gap-7 xl:text-[16px]"
          >
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="text-ink/80 hover:text-juniper">
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Desktop utilities: quiet phone link + the one clay CTA */}
          <div className="hidden shrink-0 items-center gap-4 lg:flex">
            <a
              href={site.phoneHref}
              aria-label={`Call us at ${site.phone}`}
              className="inline-flex items-center gap-2 whitespace-nowrap text-[15px] font-semibold text-juniper underline-offset-4 hover:underline"
            >
              <PhoneIcon />
              <span className="hidden xl:inline">{site.phone}</span>
            </a>
            <Link
              href="/#assessment"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-clay px-5 py-2.5 text-[15px] font-medium text-white transition-colors hover:bg-clay-deep"
            >
              Book a free assessment
            </Link>
          </div>

          {/* Mobile utilities: compact phone icon + hamburger */}
          <div className="flex shrink-0 items-center gap-2.5 lg:hidden">
            <a
              href={site.phoneHref}
              aria-label={`Call us at ${site.phone}`}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-juniper text-juniper transition-colors hover:bg-juniper hover:text-white"
            >
              <PhoneIcon />
            </a>
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}

function PhoneIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
