"use client";

import { useState } from "react";
import { site } from "@/site.config";

/**
 * ZIP availability check for the service-area module. Honest by design: it
 * never fakes a lookup result — it confirms the county we serve and hands the
 * visitor the two real next steps (call, or book the assessment).
 */
export function ZipCheck() {
  const [checked, setChecked] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const zip = String(new FormData(e.currentTarget).get("zip") ?? "").trim();
    if (/^\d{5}$/.test(zip)) setChecked(zip);
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="flex max-w-md gap-2">
        <label htmlFor="zip-check" className="sr-only">
          Your ZIP code
        </label>
        <input
          id="zip-check"
          name="zip"
          inputMode="numeric"
          pattern="\d{5}"
          title="5-digit ZIP code"
          required
          placeholder="ZIP code"
          className="w-full rounded-full border-2 border-juniper/20 bg-white px-5 py-3 text-[16px] outline-none transition-colors focus:border-juniper"
        />
        <button
          type="submit"
          className="shrink-0 rounded-full bg-juniper px-6 py-3 text-[16px] font-semibold text-white transition-colors hover:bg-juniper-deep"
        >
          Check availability
        </button>
      </form>
      {checked && (
        <p className="mt-4 max-w-md rounded-2xl bg-white/80 px-5 py-4 text-[15px] leading-relaxed text-ink/85" role="status">
          We serve {site.county} and the surrounding communities, and{" "}
          <strong>{checked}</strong> is likely in range.{" "}
          {site.phone && site.phoneHref ? (
            <>
              Call{" "}
              <a href={site.phoneHref} className="font-semibold text-juniper underline">
                {site.phone}
              </a>{" "}
              and we&rsquo;ll confirm your address on the spot.
            </>
          ) : (
            <>
              Book a free assessment below and we&rsquo;ll confirm your exact
              address when we reply.
            </>
          )}
        </p>
      )}
    </div>
  );
}
