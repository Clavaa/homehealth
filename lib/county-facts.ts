import factsJson from "@/data/county-facts.json";
import stateStatsJson from "@/data/state-stats.json";
import { counties, countiesForState, type County } from "@/lib/counties";
import type { StateInfo } from "@/lib/states";

/**
 * Real per-county facts, keyed by 5-digit FIPS. Built by
 * `scripts/build-county-data.py` from four public datasets — see that file for
 * provenance. Nothing here is estimated or interpolated: a field is either a
 * published figure for that county or it is absent.
 *
 * Every number rendered on a county page comes from this module, and every
 * sentence built from one is gated on the field actually being present, so a
 * county with thin data shows less copy rather than invented copy.
 */
export interface CountyFacts {
  /**
   * Total population on the SAME ACS 2018–2022 basis as every other field
   * here. `County.pop` is a later Census estimate; use this one whenever a
   * sentence states a percentage and a count of the same population, or the
   * arithmetic will not reconcile for small counties.
   */
  popTotal?: number;
  /** Residents aged 65+ (ACS 2018–2022 via CDC/ATSDR SVI 2022). */
  pop65?: number;
  /** Percent of residents aged 65+. */
  pct65?: number;
  /** Civilian non-institutionalized residents with a disability. */
  disabled?: number;
  pctDisabled?: number;
  /** Percent of people below 150% of the federal poverty line. */
  pctPoverty150?: number;
  /** Percent of households with no vehicle available. */
  pctNoVehicle?: number;
  households?: number;
  /** Median household income (County Health Rankings 2024). */
  medianIncome?: number;
  /** Percent of residents living in a rural area. */
  pctRural?: number;
  /** Medicare-certified home health agencies serving ZIPs in this county. */
  hhAgencies?: number;
  /** …of which report offering home health aide services. */
  hhAideAgencies?: number;
  /** …of which are non-profit. */
  hhNonprofit?: number;
  /** Average CMS quality-of-patient-care star rating among rated agencies. */
  hhStar?: number;
  /** How many of the serving agencies carry a star rating. */
  hhRated?: number;
  /** Medicare/Medicaid-certified nursing homes located in the county. */
  nursingHomes?: number;
  nursingBeds?: number;
  nursingResidents?: number;
  /** Average CMS overall 5-star rating across those facilities. */
  nursingStar?: number;
}

const factsByFips = factsJson as Record<string, CountyFacts>;

export function getFacts(fips: string): CountyFacts {
  return factsByFips[fips] ?? {};
}

/* ── ranks within the state ───────────────────────────────────────────────
 * "The 3rd-oldest county in Wisconsin" is a real, checkable claim and it is
 * different for all 3,144 pages. Ranks are computed once at module load.
 */

interface Rank {
  /** 1 = highest share of residents 65+ in the state. */
  age: number;
  /** How many counties the state has, for "3rd of 72" phrasing. */
  total: number;
}

const rankByFips = new Map<string, Rank>();
{
  const byState = new Map<string, County[]>();
  for (const c of counties) {
    const list = byState.get(c.stateSlug);
    if (list) list.push(c);
    else byState.set(c.stateSlug, [c]);
  }
  for (const list of byState.values()) {
    const sorted = [...list].sort(
      (a, b) => (getFacts(b.fips).pct65 ?? -1) - (getFacts(a.fips).pct65 ?? -1),
    );
    sorted.forEach((c, i) => {
      rankByFips.set(c.fips, { age: i + 1, total: list.length });
    });
  }
}

export function ageRank(county: County): Rank | undefined {
  return rankByFips.get(county.fips);
}

const ORDINALS = ["", "", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth"];

/**
 * Rank as a prefix for a superlative: rank 1 is "the oldest", not "the
 * first-oldest". Returns the prefix only, so callers write
 * `the ${rankPrefix(n)}oldest county`.
 */
export function rankPrefix(n: number): string {
  if (n <= 1) return "";
  if (n < ORDINALS.length) return ORDINALS[n] + "-";
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]) + "-";
}

/** Plain ordinal, for places where no superlative follows. */
export function ordinal(n: number): string {
  if (n === 1) return "first";
  if (n < ORDINALS.length && ORDINALS[n]) return ORDINALS[n];
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/* ── derived, still-honest measures ─────────────────────────────────────── */

/** Nursing-home beds per 1,000 residents 65+ — local facility capacity. */
export function bedsPer1k65(f: CountyFacts): number | undefined {
  if (!f.nursingBeds || !f.pop65) return undefined;
  return Math.round((f.nursingBeds / f.pop65) * 1000);
}

/**
 * Deliberately NOT provided: agencies per capita. It looks like a measure of
 * local supply and isn't — it mostly reflects how broadly agencies in a given
 * state declare their service areas. By that metric Manhattan reads as a
 * "thin market" and rural Martin County, TX as the richest in the country,
 * which is the opposite of the truth. Comparisons here are made against real
 * state averages instead (see `stateStats`).
 */

export interface StateStats {
  /** Mean CMS quality star across every rated home health agency in the state. */
  hhStar?: number;
  hhRated?: number;
  /** Mean CMS overall star across every certified nursing home in the state. */
  nursingStar?: number;
  nursingCount?: number;
}

const statsByState = stateStatsJson as Record<string, StateStats>;

/** State-level averages, computed from the provider rows themselves. */
export function stateStats(stateAbbr: string): StateStats {
  return statsByState[stateAbbr] ?? {};
}

/** National averages, for context when a state's own sample is thin. */
export const nationalStats: StateStats = statsByState["US"] ?? {};

/** How a star rating compares to its state — only called when both exist. */
export type Standing = "above" | "below" | "typical";

export function standing(value: number, average: number, margin = 0.3): Standing {
  if (value >= average + margin) return "above";
  if (value <= average - margin) return "below";
  return "typical";
}

/** Parses "$36/hr" from the state dataset into 36. */
export function hourlyRateNumber(st: StateInfo): number | undefined {
  const m = st.hourlyCost.match(/\$?\s*([\d.]+)/);
  if (!m) return undefined;
  const n = parseFloat(m[1]);
  return Number.isFinite(n) ? n : undefined;
}

export interface CostMath {
  hourly: number;
  /** 20 hrs/week — the most common agency schedule — for a year. */
  annual20: number;
  /** 4 hrs/day, 5 days a week, for a month. */
  monthly20: number;
  /** That annual cost as a share of the county's median household income. */
  shareOfIncome?: number;
}

/**
 * Cost framing built from the state's published median hourly rate. We never
 * claim a county-specific rate — the honest statement is "the state going rate,
 * against this county's median income."
 */
export function costMath(f: CountyFacts, st: StateInfo): CostMath | undefined {
  const hourly = hourlyRateNumber(st);
  if (!hourly) return undefined;
  const annual20 = Math.round((hourly * 20 * 52) / 100) * 100;
  const monthly20 = Math.round((hourly * 20 * 52) / 12 / 100) * 100;
  const shareOfIncome = f.medianIncome
    ? Math.round((annual20 / f.medianIncome) * 100)
    : undefined;
  return { hourly, annual20, monthly20, shareOfIncome };
}

/* ── formatting ─────────────────────────────────────────────────────────── */

/**
 * A count as prose reads better rounded ("about 132,000") than exact next to
 * an already-rounded population. The stat band still shows the exact figure.
 */
export function roughly(n: number): string {
  if (n >= 100_000) return commas(Math.round(n / 1000) * 1000);
  if (n >= 10_000) return commas(Math.round(n / 100) * 100);
  if (n >= 1_000) return commas(Math.round(n / 10) * 10);
  return commas(n);
}

export function commas(n: number): string {
  return n.toLocaleString("en-US");
}

export function dollars(n: number): string {
  return "$" + n.toLocaleString("en-US");
}

/** "one in seven" for 14.1%, "one in three" for 31.5% — reads better aloud. */
export function oneIn(pct: number): string | undefined {
  if (pct <= 0 || pct > 60) return undefined;
  const n = Math.round(100 / pct);
  const words: Record<number, string> = {
    2: "two", 3: "three", 4: "four", 5: "five", 6: "six", 7: "seven",
    8: "eight", 9: "nine", 10: "ten", 11: "eleven", 12: "twelve",
  };
  if (!words[n]) return undefined;
  return `one in ${words[n]}`;
}

/** How rural the county is, in words — drives which local angle we tell. */
export type Density = "urban" | "mixed" | "rural";

export function density(f: CountyFacts): Density | undefined {
  if (f.pctRural === undefined) return undefined;
  if (f.pctRural < 15) return "urban";
  if (f.pctRural < 60) return "mixed";
  return "rural";
}

/**
 * What a state calls its county-equivalents. Louisiana has parishes, Alaska
 * boroughs and census areas, Connecticut planning regions since 2022 — calling
 * those "counties" in body copy is the kind of small wrongness a local reader
 * notices immediately.
 */
export function areaNoun(state: string): { one: string; many: string } {
  switch (state) {
    case "Louisiana":
      return { one: "parish", many: "parishes" };
    case "Alaska":
      return { one: "borough or census area", many: "boroughs and census areas" };
    case "Connecticut":
      return { one: "planning region", many: "planning regions" };
    default:
      return { one: "county", many: "counties" };
  }
}

/** Counties where the site's own caregivers actually work. */
export function isServed(county: County, homeCounty: string, homeState: string): boolean {
  return county.name === homeCounty && county.state === homeState;
}
