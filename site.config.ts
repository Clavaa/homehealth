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
  // TODO: real call-tracked local phone number
  phone: "(414) 555-0100",
  phoneHref: "tel:+14145550100", // TODO: keep in sync with phone
  // TODO: confirm this inbox exists before launch
  email: "care@juniperathome.com",
  // TODO: where /api/lead delivers (can differ from public email)
  leadInbox: "care@juniperathome.com",

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
