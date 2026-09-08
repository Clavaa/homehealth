"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { site } from "@/site.config";

/**
 * The sand assessment card: "Tell us what's going on."
 * Radio triage self-sorts job-seekers out of the family funnel — choosing
 * "I'd like to work as a caregiver" routes straight to /careers.
 * PHI-light on purpose: name, phone, ZIP, situation. No diagnoses, no
 * conditions, no free-text health details.
 */

type Situation = "parent-or-spouse" | "myself" | "caregiver-job";

export function AssessmentForm({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [situation, setSituation] = useState<Situation>("parent-or-spouse");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (situation === "caregiver-job") {
      router.push("/careers");
      return;
    }
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "care-assessment",
          situation,
          name: data.get("name"),
          phone: data.get("phone"),
          zip: data.get("zip"),
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
      <div
        id="assessment"
        className="rounded-[var(--radius-card)] rounded-tr-[var(--radius-corner)] bg-sand p-8 sm:p-10"
      >
        <h3 className="text-2xl text-juniper">Thank you — we&rsquo;re on it.</h3>
        <p className="mt-3 text-ink/80">
          Someone from our {site.metro} team will call you shortly — usually
          within minutes during the day.{" "}
          {site.phone && site.phoneHref ? (
            <>
              If it&rsquo;s urgent, call us right now at{" "}
              <a href={site.phoneHref} className="font-semibold text-juniper underline">
                {site.phone}
              </a>
              .
            </>
          ) : (
            <>
              If it&rsquo;s urgent, email{" "}
              <a href={`mailto:${site.email}`} className="font-semibold text-juniper underline">
                {site.email}
              </a>
              .
            </>
          )}
        </p>
      </div>
    );
  }

  return (
    <form
      id="assessment"
      onSubmit={onSubmit}
      className={`relative rounded-[var(--radius-card)] rounded-tr-[var(--radius-corner)] bg-sand ${compact ? "p-6 sm:p-8" : "p-8 sm:p-10"}`}
    >
      <h3 className="text-2xl text-juniper sm:text-3xl">
        Tell us what&rsquo;s going on
      </h3>
      <p className="mt-2 text-[15px] text-ink/70">
        Two minutes, no obligation. We&rsquo;ll call you back with a plan.
      </p>

      <fieldset className="mt-6">
        <legend className="text-sm font-semibold text-ink/80">
          Who needs care?
        </legend>
        <div className="mt-3 space-y-2.5">
          {(
            [
              ["parent-or-spouse", "I'm looking for care for a parent or spouse"],
              ["myself", "I'm looking for care for myself"],
              ["caregiver-job", "I'd like to work as a caregiver"],
            ] as [Situation, string][]
          ).map(([value, label]) => (
            <label
              key={value}
              className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 bg-white/70 px-4 py-3 text-[15px] font-medium transition-colors ${
                situation === value
                  ? "border-juniper text-juniper"
                  : "border-transparent text-ink/80 hover:border-juniper/30"
              }`}
            >
              <input
                type="radio"
                name="situation"
                value={value}
                checked={situation === value}
                onChange={() => setSituation(value)}
                className="h-4 w-4 accent-[#1E4D45]"
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      {situation === "caregiver-job" ? (
        <p className="mt-5 rounded-2xl bg-white/70 px-4 py-3 text-[15px] text-ink/80">
          Wonderful — we&rsquo;re always looking for good people. We&rsquo;ll
          take you to our caregiver jobs page.
        </p>
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="af-name" className="text-sm font-semibold text-ink/80">
              Your name
            </label>
            <input
              id="af-name"
              name="name"
              required
              autoComplete="name"
              className="mt-1.5 w-full rounded-2xl border-2 border-transparent bg-white px-4 py-3 text-[16px] outline-none transition-colors focus:border-juniper"
            />
          </div>
          <div>
            <label htmlFor="af-phone" className="text-sm font-semibold text-ink/80">
              Phone number
            </label>
            <input
              id="af-phone"
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              inputMode="tel"
              className="mt-1.5 w-full rounded-2xl border-2 border-transparent bg-white px-4 py-3 text-[16px] outline-none transition-colors focus:border-juniper"
            />
          </div>
          <div>
            <label htmlFor="af-zip" className="text-sm font-semibold text-ink/80">
              ZIP code
            </label>
            <input
              id="af-zip"
              name="zip"
              required
              autoComplete="postal-code"
              inputMode="numeric"
              pattern="\d{5}"
              title="5-digit ZIP code"
              className="mt-1.5 w-full rounded-2xl border-2 border-transparent bg-white px-4 py-3 text-[16px] outline-none transition-colors focus:border-juniper"
            />
          </div>
        </div>
      )}

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
        {situation === "caregiver-job"
          ? "See open caregiver roles"
          : status === "sending"
            ? "Sending…"
            : "Get my free care plan"}
      </button>

      {status === "error" && (
        <p className="mt-3 text-[15px] font-medium text-clay-deep" role="alert">
          Something went wrong on our end. Please email{" "}
          <a href={`mailto:${site.email}`} className="underline">
            {site.email}
          </a>{" "}
          and we&rsquo;ll pick it up from there.
        </p>
      )}

      {situation !== "caregiver-job" && (
        <p className="mt-4 text-[13px] leading-relaxed text-ink/60">
          Confidential — your details go only to our local care team, and we
          never share them.{" "}
          {site.phone && site.phoneHref && (
            <>
              Prefer to talk?{" "}
              <a href={site.phoneHref} className="font-medium text-juniper underline">
                {site.phone}
              </a>
            </>
          )}
        </p>
      )}
    </form>
  );
}
