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
  /**
   * Towns we serve. `localNote` and `caregiverNote` are the unique-content
   * slots that stop these from being doorway pages — real local substance and
   * a real, permissioned caregiver. Both optional: a town without them renders
   * a shorter page rather than a templated one. NEVER invent a caregiver.
   */
  towns: [
    { name: "Wauwatosa", slug: "wauwatosa-wi" },
    { name: "West Allis", slug: "west-allis-wi" },
    { name: "Greenfield", slug: "greenfield-wi" },
    { name: "Oak Creek", slug: "oak-creek-wi" },
    { name: "Franklin", slug: "franklin-wi" },
    { name: "Shorewood", slug: "shorewood-wi" },
    { name: "Whitefish Bay", slug: "whitefish-bay-wi" },
    { name: "Glendale", slug: "glendale-wi" },
    { name: "Cudahy", slug: "cudahy-wi" },
    { name: "South Milwaukee", slug: "south-milwaukee-wi" },
  ] as { name: string; slug: string; localNote?: string; caregiverNote?: string }[],
  // ── Rates (published transparency is the differentiator) ─────
  // TODO: replace every rate with your real published range.
  /**
   * Published rates — the site's whole differentiator, and EMPTY until real
   * ones exist. Copy that quotes a range is written to fall back to "shared
   * at your free assessment" rather than print "$XX", which read as broken on
   * fourteen pages. Set hourlyMin and hourlyMax and every range returns.
   */
  rates: {
    hourlyMin: null as string | null,
    hourlyMax: null as string | null,
    weeklyExampleMornings: null as string | null,
    weeklyExampleDaily: null as string | null,
    weeklyExample247: null as string | null,
    minimumShiftHours: null as string | null,
  },

  // ── Careers ──────────────────────────────────────────────────
  /**
   * Caregiver pay. Null until real: payMin/payMax feed JobPosting structured
   * data, and shipping "XX.00" as a salary is an error Google reports rather
   * than merely a typo.
   */
  careers: {
    payRange: null as string | null,
    payMin: null as string | null,
    payMax: null as string | null,
  },

  // ── Proof (NEVER show numbers you can't back up) ─────────────
  // TODO: every stat below is a placeholder. Replace with real, current,
  // verifiable numbers — or remove the stat from the page. Do not launch
  // with placeholders visible.
  /**
   * Proof. EMPTY ON PURPOSE — every figure here was a placeholder, and an
   * invented rating or headcount is a claim a family would act on when
   * choosing care for a parent. Each tile renders only when its value is set,
   * so filling any one of these brings just that tile back.
   */
  stats: {
    googleRating: null as string | null,
    googleReviewCount: null as string | null,
    caringSinceYear: null as string | null,
    caregiverCount: null as string | null,
  },

  // TODO: replace with real, permissioned Google reviews (name, month/year,
  // exact text). These placeholders exist only to hold the layout.
  /**
   * Reviews. EMPTY ON PURPOSE. The three that lived here were written as
   * layout placeholders, not quoted from anyone — publishing them would be
   * fabricated testimony about care that never happened. Add real,
   * permissioned Google reviews (name, month/year, exact text) and the band
   * reappears on its own.
   */
  reviews: [] as { quote: string; name: string; detail: string }[],
} as const;

/** "$32–$38/hr" when both ends are set, otherwise null. */
export function hourlyRange(): string | null {
  return site.rates.hourlyMin && site.rates.hourlyMax
    ? `${site.rates.hourlyMin}–${site.rates.hourlyMax}/hr`
    : null;
}

/** The stock sentence used wherever a rate would otherwise appear. */
export const RATE_TBD = "shared at your free assessment";

export type SiteConfig = typeof site;
