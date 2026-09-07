import { NextResponse } from "next/server";
import { site } from "@/site.config";

/**
 * Lead intake: care assessments and job applications.
 *
 * - Honeypot: bots that fill the hidden `website` field get a 200 and go
 *   nowhere (never tip them off).
 * - PHI-light by design: name, phone, ZIP, and a coarse situation/role tag.
 *   No health details are collected or forwarded — SendGrid signs no BAA,
 *   so nothing medical may pass through this route. Keep it that way.
 * - Graceful no-op: without SENDGRID_API_KEY the lead is logged server-side
 *   and the caller still gets a 200, so the site works in every environment.
 */

interface LeadPayload {
  kind?: string;
  situation?: string;
  role?: string;
  name?: string;
  phone?: string;
  zip?: string;
  experience?: string;
  website?: string; // honeypot
}

const MAX_FIELD = 200;

function clean(v: unknown): string {
  return typeof v === "string" ? v.trim().slice(0, MAX_FIELD) : "";
}

export async function POST(request: Request) {
  let body: LeadPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  // Honeypot: pretend success, deliver nothing.
  if (clean(body.website)) {
    return NextResponse.json({ ok: true });
  }

  const kind = clean(body.kind) || "care-assessment";
  const name = clean(body.name);
  const phone = clean(body.phone);
  const zip = clean(body.zip);

  if (!name || !phone || !zip) {
    return NextResponse.json(
      { ok: false, error: "Name, phone, and ZIP are required" },
      { status: 400 },
    );
  }

  const isJob = kind === "job-application";
  const subject = isJob
    ? `New caregiver application — ${name}`
    : `New care assessment request — ${name}`;

  const lines = [
    `Kind: ${kind}`,
    `Name: ${name}`,
    `Phone: ${phone}`,
    `ZIP: ${zip}`,
    isJob ? `Role: ${clean(body.role) || "Caregiver"}` : `Situation: ${clean(body.situation) || "not stated"}`,
    isJob && clean(body.experience) ? `Experience: ${clean(body.experience)}` : null,
    "",
    "Respond fast — lead-qualification odds drop 21x between 5 and 30 minutes.",
  ].filter((l): l is string => l !== null);

  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    // Graceful no-op: keep the site fully functional without the key.
    console.log(`[lead] SENDGRID_API_KEY not set — logging lead only.\n${subject}\n${lines.join("\n")}`);
    return NextResponse.json({ ok: true });
  }

  try {
    const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: site.leadInbox }] }],
        from: { email: site.email, name: site.name },
        subject,
        content: [{ type: "text/plain", value: lines.join("\n") }],
      }),
    });
    if (!res.ok) {
      console.error(`[lead] SendGrid error ${res.status}: ${await res.text()}`);
      return NextResponse.json({ ok: false, error: "Delivery failed" }, { status: 502 });
    }
  } catch (err) {
    console.error("[lead] SendGrid request failed:", err);
    return NextResponse.json({ ok: false, error: "Delivery failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
