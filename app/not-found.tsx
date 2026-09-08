import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/site.config";
import { Pill } from "@/components/Pill";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: `That page isn't here — but help is. Find home care services, pricing, and payment guides from ${site.name}.`,
};

/** Converting 404 — a wrong turn still lands one step from help. */
export default function NotFound() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-clay">
          404 — page not found
        </p>
        <h1 className="mt-3 text-4xl leading-[1.1] text-juniper sm:text-5xl">
          A wrong turn, but you&rsquo;re still <em className="hero-italic">close</em>
        </h1>
        <p className="mt-5 text-lg text-ink/80">
          That page moved or never existed — but if you&rsquo;re looking into
          care for someone you love, you&rsquo;re one step from a real person
          who can help.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Pill href="/#assessment" variant="clay" size="lg">
            Book a free care assessment
          </Pill>
          {site.phone && site.phoneHref && (
            <Pill href={site.phoneHref} variant="juniperOutline" size="lg">
              {site.phone}
            </Pill>
          )}
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[15px] font-medium">
          <Link href="/" className="text-juniper underline underline-offset-4">
            Home
          </Link>
          <Link href="/services" className="text-juniper underline underline-offset-4">
            Services
          </Link>
          <Link href="/pricing" className="text-juniper underline underline-offset-4">
            Pricing
          </Link>
          <Link href="/how-to-pay" className="text-juniper underline underline-offset-4">
            How to pay
          </Link>
          <Link href="/careers" className="text-juniper underline underline-offset-4">
            Caregiver jobs
          </Link>
        </div>
      </div>
    </section>
  );
}
