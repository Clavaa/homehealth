import countiesJson from "@/data/counties.json";
import { states, type StateInfo } from "@/lib/states";

/**
 * Nationwide county dataset (3,144 county-equivalents, population-sorted per
 * state) + slug logic for /home-care/[state]/[county].
 *
 * Slug rules:
 *  - kebab-case; apostrophes and periods dropped ("St. Clair" → st-clair,
 *    "Prince George's" → prince-georges), accents folded (Doña Ana → dona-ana)
 *  - generic suffixes stripped (" County", " Parish", Alaska's borough/census-
 *    area forms, Connecticut's " Planning Region", Virginia-style " city")
 *  - EXCEPT when stripping would be ambiguous within the state (Baltimore
 *    city vs Baltimore County, St. Louis, Richmond, Fairfax, Franklin,
 *    Roanoke…) — then the full name stays in the slug for both.
 */

export const stateAbbr: Record<string, string> = {
  Alabama: "AL", Alaska: "AK", Arizona: "AZ", Arkansas: "AR", California: "CA",
  Colorado: "CO", Connecticut: "CT", Delaware: "DE", "District of Columbia": "DC",
  Florida: "FL", Georgia: "GA", Hawaii: "HI", Idaho: "ID", Illinois: "IL",
  Indiana: "IN", Iowa: "IA", Kansas: "KS", Kentucky: "KY", Louisiana: "LA",
  Maine: "ME", Maryland: "MD", Massachusetts: "MA", Michigan: "MI",
  Minnesota: "MN", Mississippi: "MS", Missouri: "MO", Montana: "MT",
  Nebraska: "NE", Nevada: "NV", "New Hampshire": "NH", "New Jersey": "NJ",
  "New Mexico": "NM", "New York": "NY", "North Carolina": "NC",
  "North Dakota": "ND", Ohio: "OH", Oklahoma: "OK", Oregon: "OR",
  Pennsylvania: "PA", "Rhode Island": "RI", "South Carolina": "SC",
  "South Dakota": "SD", Tennessee: "TN", Texas: "TX", Utah: "UT",
  Vermont: "VT", Virginia: "VA", Washington: "WA", "West Virginia": "WV",
  Wisconsin: "WI", Wyoming: "WY",
};

export interface County {
  /** Full display name, e.g. "Jefferson County", "Orleans Parish" */
  name: string;
  /** URL segment within the state, e.g. "jefferson" */
  slug: string;
  pop: number;
  fips: string;
  /** State display name */
  state: string;
  /** State URL segment (matches lib/states slugs) */
  stateSlug: string;
  /** Two-letter state abbreviation */
  st: string;
}

function kebab(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[’'.]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const STRIP_SUFFIXES = [
  " County",
  " Parish",
  " Census Area",
  " City and Borough",
  " Borough",
  " Municipality",
  " Planning Region",
  " city", // lowercase = census "independent city" designation (VA, MD, MO, NV)
];

function coreName(name: string): string {
  for (const suf of STRIP_SUFFIXES) {
    if (name.endsWith(suf) && name.length > suf.length) {
      return name.slice(0, -suf.length);
    }
  }
  return name;
}

const stateSlugByName = new Map(states.map((s) => [s.name, s.slug]));

function buildCounties(): County[] {
  const all: County[] = [];
  const raw = countiesJson as Record<string, { county: string; pop: number; fips: string }[]>;
  for (const [stateName, rows] of Object.entries(raw)) {
    const stateSlug = stateSlugByName.get(stateName) ?? kebab(stateName);
    const st = stateAbbr[stateName] ?? "";
    // Count how many entries share a stripped core slug within this state —
    // any collision keeps the full name in the slug for every member.
    const coreCounts = new Map<string, number>();
    for (const r of rows) {
      const c = kebab(coreName(r.county));
      coreCounts.set(c, (coreCounts.get(c) ?? 0) + 1);
    }
    for (const r of rows) {
      const core = kebab(coreName(r.county));
      const slug = (coreCounts.get(core) ?? 0) > 1 ? kebab(r.county) : core;
      all.push({ name: r.county, slug, pop: r.pop, fips: r.fips, state: stateName, stateSlug, st });
    }
  }
  return all;
}

export const counties: County[] = buildCounties();

const byState = new Map<string, County[]>();
for (const c of counties) {
  const list = byState.get(c.stateSlug);
  if (list) list.push(c);
  else byState.set(c.stateSlug, [c]);
}

/** Counties for a state slug, population-sorted (largest first). */
export function countiesForState(stateSlug: string): County[] {
  return byState.get(stateSlug) ?? [];
}

export function getCounty(stateSlug: string, countySlug: string): County | undefined {
  return countiesForState(stateSlug).find((c) => c.slug === countySlug);
}

/**
 * 5–8 sibling counties to cross-link: the population neighbors on either side
 * of this county in the state's sorted list (adjacency data isn't in the
 * dataset; similar-size counties are the most useful comparison anyway).
 */
export function neighborCounties(county: County, max = 7): County[] {
  const list = countiesForState(county.stateSlug);
  const i = list.findIndex((c) => c.fips === county.fips);
  if (i === -1) return list.slice(0, max);
  const out: County[] = [];
  for (let d = 1; out.length < max && (i - d >= 0 || i + d < list.length); d++) {
    if (i - d >= 0) out.push(list[i - d]);
    if (out.length < max && i + d < list.length) out.push(list[i + d]);
  }
  return out;
}

/** "about 665,000" / "about 1.1 million" / "about 4,300" style rounding. */
export function formatPop(n: number): string {
  if (n >= 1_000_000) {
    const m = Math.round(n / 100_000) / 10;
    return `about ${m % 1 === 0 ? m.toFixed(0) : m} million`;
  }
  if (n >= 10_000) return `about ${(Math.round(n / 1000) * 1000).toLocaleString("en-US")}`;
  if (n >= 1_000) return `about ${(Math.round(n / 100) * 100).toLocaleString("en-US")}`;
  return `about ${Math.max(10, Math.round(n / 10) * 10).toLocaleString("en-US")}`;
}

export function getStateInfoForCounty(county: County): StateInfo | undefined {
  return states.find((s) => s.slug === county.stateSlug);
}
