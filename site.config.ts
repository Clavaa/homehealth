/**
 * Single source of truth for everything brand-, location-, and number-specific.
 * Every value marked TODO is a placeholder — replace before launch.
 * NOTHING on the site displays a number that is not defined here, so nothing
 * can be "accidentally true." Fill these in with real, verifiable values.
 */

export const site = {
  // Final brand name
  name: "Juniper at Home",
  // Final production domain (no trailing slash)
  domain: "https://juniperathome.com",
  /**
   * Phone is INTENTIONALLY OFF until a real call-tracked local number exists.
   * Publishing a placeholder number is worse than publishing none: it invites
   * calls that reach nobody. Every phone affordance on the site — header link,
   * sticky call bar, hero CTA, "a person answers 24/7" copy — is gated on this
   * being non-null, so setting it restores all of them at once.
   *
   * To turn calling back on: set both fields and keep them in sync, e.g.
   *   phone: "(414) 555-0100",
   *   phoneHref: "tel:+14145550100",
   */
  phone: null as string | null,
  phoneHref: null as string | null,

  // Public-facing address shown in copy. TODO: confirm before launch.
  email: "care@juniperathome.com",

  /**
   * Where /api/lead delivers, and who it sends AS.
   *
   * INTERIM: both point at the Offendersearch support mailbox, because that is
   * the SendGrid account whose key this deployment uses and SendGrid will only
   * send from a verified sender. Flip both to a juniperathome.com address once
   * that domain is verified in its own SendGrid account — no other code change
   * is needed. Env vars override without a redeploy.
   */
  leadInbox: process.env.LEAD_INBOX || "support@offendersearch.app",
  leadFrom: process.env.LEAD_FROM || "support@offendersearch.app",

  // ── Geography ────────────────────────────────────────────────
  // TODO: real home metro + county + state
  metro: "Milwaukee", // TODO
  county: "Milwaukee County", // TODO
  state: "Wisconsin", // TODO
  stateAbbr: "WI", // TODO

  // TODO: replace with the 10 real towns you serve (slug = URL segment).
  // Each town page ships with unique-content TODO slots — fill them per town.
  towns: [
    { name: "Wauwatosa", slug: "wauwatosa-wi" }, // TODO placeholder town
    { name: "West Allis", slug: "west-allis-wi" }, // TODO placeholder town
    { name: "Greenfield", slug: "greenfield-wi" }, // TODO placeholder town
    { name: "Oak Creek", slug: "oak-creek-wi" }, // TODO placeholder town
    { name: "Franklin", slug: "franklin-wi" }, // TODO placeholder town
    { name: "Shorewood", slug: "shorewood-wi" }, // TODO placeholder town
    { name: "Whitefish Bay", slug: "whitefish-bay-wi" }, // TODO placeholder town
    { name: "Glendale", slug: "glendale-wi" }, // TODO placeholder town
    { name: "Cudahy", slug: "cudahy-wi" }, // TODO placeholder town
    { name: "South Milwaukee", slug: "south-milwaukee-wi" }, // TODO placeholder town
  ],

  // ── Rates (published transparency is the differentiator) ─────
  // TODO: replace every rate with your real published range.
  rates: {
    hourlyMin: "$XX", // TODO real minimum hourly rate, e.g. "$32"
    hourlyMax: "$XX", // TODO real maximum hourly rate, e.g. "$38"
    weeklyExampleMornings: "$XXX", // TODO e.g. 4 hrs × 3 days at your rate
    weeklyExampleDaily: "$X,XXX", // TODO e.g. 6 hrs × 7 days at your rate
    weeklyExample247: "$X,XXX", // TODO real weekly 24/7 or live-in figure
    minimumShiftHours: "X", // TODO real shift minimum, e.g. "3"
  },

  // ── Careers ──────────────────────────────────────────────────
  careers: {
    // TODO: real published caregiver pay range
    payRange: "$XX–$XX/hr",
    payMin: "XX.00", // TODO numeric, feeds JobPosting schema, e.g. "16.00"
    payMax: "XX.00", // TODO numeric, feeds JobPosting schema, e.g. "20.00"
  },

  // ── Proof (NEVER show numbers you can't back up) ─────────────
  // TODO: every stat below is a placeholder. Replace with real, current,
  // verifiable numbers — or remove the stat from the page. Do not launch
  // with placeholders visible.
  stats: {
    googleRating: "X.X", // TODO real Google rating, e.g. "4.9"
    googleReviewCount: "XXX", // TODO real review count
    caringSinceYear: "20XX", // TODO real founding year
    caregiverCount: "XX+", // TODO real caregiver headcount
  },

  // TODO: replace with real, permissioned Google reviews (name, month/year,
  // exact text). These placeholders exist only to hold the layout.
  reviews: [
    {
      quote:
        "TODO: real review — placeholder: “Mom actually looks forward to Tuesdays now. Her caregiver remembers how she takes her coffee.”",
      name: "TODO Reviewer name",
      detail: "TODO e.g. Daughter of a client · Month 20XX · Google",
    },
    {
      quote:
        "TODO: real review — placeholder: “After Dad's discharge we were lost. They had someone at the house within two days and called us every week.”",
      name: "TODO Reviewer name",
      detail: "TODO e.g. Son of a client · Month 20XX · Google",
    },
    {
      quote:
        "TODO: real review — placeholder: “I live out of state. Their check-in notes after every visit are the only reason I sleep.”",
      name: "TODO Reviewer name",
      detail: "TODO e.g. Daughter of a client · Month 20XX · Google",
    },
  ],
} as const;

export type SiteConfig = typeof site;
