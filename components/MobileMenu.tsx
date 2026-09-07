"use client";

import { useState } from "react";
import Link from "next/link";
import { site } from "@/site.config";

const links = [
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/service-areas", label: "Service areas" },
  { href: "/how-to-pay", label: "How to pay" },
  { href: "/about", label: "About" },
];

/**
 * Mobile navigation (below lg): a hamburger button that opens a full-width
 * panel with the five top-level links, the clay CTA, and the phone number.
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-juniper text-juniper transition-colors hover:bg-juniper hover:text-white"
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>

      {open && (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-full z-50 border-b border-mist bg-oat shadow-lg"
        >
          <nav aria-label="Mobile" className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
            <ul>
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-mist py-3.5 text-lg font-medium text-ink/85 hover:text-juniper"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-3 py-5">
              <Link
                href="/#assessment"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center rounded-full bg-clay px-6 py-3 text-[16px] font-medium text-white transition-colors hover:bg-clay-deep"
              >
                Book a free assessment
              </Link>
              <a
                href={site.phoneHref}
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-juniper px-6 py-3 text-[16px] font-semibold text-juniper transition-colors hover:bg-juniper hover:text-white"
              >
                Call {site.phone}
              </a>
              <Link
                href="/careers"
                onClick={() => setOpen(false)}
                className="mt-1 text-center text-[15px] font-medium text-juniper/80 underline underline-offset-4 hover:text-juniper"
              >
                Caregivers: join our team
              </Link>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}

function MenuIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
