import { site } from "@/site.config";

/**
 * Mobile-only sticky bottom bar. This audience calls (senior-care call leads
 * convert ~41% vs ~1.7% for forms — Style Bible CRO spine), so the call
 * button carries the primary weight when there IS a number. Until then the
 * bar degrades to a single full-width assessment CTA — a dead call button
 * would cost more than it earns. Juniper, not clay: the page's single clay
 * accent belongs to the content, not a persistent overlay.
 */
export function StickyCallBar() {
  if (!site.phone || !site.phoneHref) {
    return (
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-mist bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto max-w-xl">
          <a
            href="/#assessment"
            className="flex items-center justify-center whitespace-nowrap rounded-full bg-juniper px-4 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-juniper-deep"
          >
            Book a free assessment
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-mist bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-xl items-center gap-3">
        <a
          href={site.phoneHref}
          className="flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-juniper px-3 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-juniper-deep"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          Call {site.phone}
        </a>
        <a
          href="/#assessment"
          className="flex items-center justify-center whitespace-nowrap rounded-full border-2 border-juniper px-3.5 py-[10px] text-[14px] font-semibold text-juniper transition-colors hover:bg-juniper hover:text-white"
        >
          Free assessment
        </a>
      </div>
    </div>
  );
}
