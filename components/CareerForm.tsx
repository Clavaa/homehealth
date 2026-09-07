"use client";

import { useState } from "react";
import { site } from "@/site.config";

/**
 * Caregiver application form. Posts to /api/lead with a role tag so hiring
 * leads never mix into the family funnel. Deliberately short — the goal is a
 * phone call, not a résumé.
 */
export function CareerForm({ role = "Caregiver / Home Health Aide" }: { role?: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setStatus("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "job-application",
          role,
          name: data.get("name"),
          phone: data.get("phone"),
          zip: data.get("zip"),
          experience: data.get("experience"),
          website: data.get("website"), // honeypot
        }),
      });
      if (!res.ok) throw new Error("bad status");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-[var(--radius-card)] rounded-bl-[var(--radius-corner)] bg-sand p-8 sm:p-10">
        <h3 className="text-2xl text-juniper">Got it — talk soon.</h3>
        <p className="mt-3 text-ink/80">
          Thanks for applying. Our scheduler will call you, usually the same
          business day. Want to skip the wait? Call{" "}
          <a href={site.phoneHref} className="font-semibold text-juniper underline">
            {site.phone}
          </a>{" "}
          and say you&rsquo;re applying.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="relative rounded-[var(--radius-card)] rounded-bl-[var(--radius-corner)] bg-sand p-8 sm:p-10"
    >
      <h3 className="text-2xl text-juniper sm:text-3xl">Apply in two minutes</h3>
      <p className="mt-2 text-[15px] text-ink/70">
        No résumé needed to start — we&rsquo;ll call you the same business day.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="cf-name" className="text-sm font-semibold text-ink/80">
            Your name
          </label>
          <input
            id="cf-name"
            name="name"
            required
            autoComplete="name"
            className="mt-1.5 w-full rounded-2xl border-2 border-transparent bg-white px-4 py-3 text-[16px] outline-none transition-colors focus:border-juniper"
          />
        </div>
        <div>
          <label htmlFor="cf-phone" className="text-sm font-semibold text-ink/80">
            Phone number
          </label>
          <input
            id="cf-phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            inputMode="tel"
            className="mt-1.5 w-full rounded-2xl border-2 border-transparent bg-white px-4 py-3 text-[16px] outline-none transition-colors focus:border-juniper"
          />
        </div>
        <div>
          <label htmlFor="cf-zip" className="text-sm font-semibold text-ink/80">
            ZIP code
          </label>
          <input
            id="cf-zip"
            name="zip"
            required
            autoComplete="postal-code"
            inputMode="numeric"
            pattern="\d{5}"
            title="5-digit ZIP code"
            className="mt-1.5 w-full rounded-2xl border-2 border-transparent bg-white px-4 py-3 text-[16px] outline-none transition-colors focus:border-juniper"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="cf-exp" className="text-sm font-semibold text-ink/80">
            Caregiving experience
          </label>
          <select
            id="cf-exp"
            name="experience"
            className="mt-1.5 w-full rounded-2xl border-2 border-transparent bg-white px-4 py-3 text-[16px] outline-none transition-colors focus:border-juniper"
          >
            <option value="none-yet">None yet — willing to learn</option>
            <option value="family">I've cared for a family member</option>
            <option value="professional">Professional caregiving experience</option>
            <option value="cna-hha">I'm a CNA or certified HHA</option>
          </select>
        </div>
      </div>

      {/* Honeypot — hidden from people, tempting to bots */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label>
          Leave this field empty
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-6 w-full rounded-full bg-clay px-8 py-4 text-[17px] font-semibold text-white transition-colors hover:bg-clay-deep disabled:opacity-60 sm:w-auto"
      >
        {status === "sending" ? "Sending…" : "Start my application"}
      </button>

      {status === "error" && (
        <p className="mt-3 text-[15px] font-medium text-clay-deep" role="alert">
          Something went wrong on our end. Please call{" "}
          <a href={site.phoneHref} className="underline">
            {site.phone}
          </a>{" "}
          and say you&rsquo;re applying.
        </p>
      )}

      <p className="mt-4 text-[13px] leading-relaxed text-ink/60">
        Confidential — your application goes only to our hiring team.
      </p>
    </form>
  );
}
