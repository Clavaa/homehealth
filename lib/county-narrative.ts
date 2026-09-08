import { site } from "@/site.config";
import { borderingCounties, formatPop, type County } from "@/lib/counties";
import type { StateInfo } from "@/lib/states";
import {
  ageRank,
  areaNoun,
  bedsPer1k65,
  commas,
  costMath,
  density,
  dollars,
  getFacts,
  nationalStats,
  oneIn,
  rankPrefix,
  roughly,
  standing,
  stateStats,
  type CountyFacts,
} from "@/lib/county-facts";

/**
 * Turns a county's real numbers into the prose for its page.
 *
 * The rule this module exists to enforce: a sentence is only produced when the
 * figure behind it is present for THAT county. Nothing is templated over
 * missing data, so a county with thin coverage renders fewer sections rather
 * than a paragraph of hedged filler. Which sections appear — and which angle
 * the lead takes — is decided by the data itself, so a dense urban county and
 * a 900-person rural one do not read like the same page with the name swapped.
 */

export interface Section {
  heading: string;
  paragraphs: string[];
}

/* ── the lead ─────────────────────────────────────────────────────────────
 * Chosen by what is genuinely notable about this county: an unusual share of
 * older residents, its rank in the state, how rural it is, or car access.
 */
export function leadParagraph(c: County, f: CountyFacts): string {
  const rank = ageRank(c);
  const d = density(f);
  // Where a sentence relates a share to a headcount, both must come from the
  // same survey — so prefer SVI's total over the newer standalone estimate.
  const pop = formatPop(f.popTotal ?? c.pop);

  // Distinctly old for its state — the most useful thing we can say.
  if (rank && f.pct65 && rank.age <= 8 && rank.total >= 20) {
    return `${c.name} is the ${rankPrefix(rank.age)}oldest ${areaNoun(c.state).one} in ${c.state}: ${f.pct65}% of the ${pop.replace(/^about /, "")} people who live here are 65 or older${
      f.pop65 ? `, about ${roughly(f.pop65)} residents` : ""
    }. That shapes everything about care here — the demand for it, the wait for it, and how far families drive to find it.`;
  }

  if (f.pct65 && f.pct65 >= 25) {
    const ratio = oneIn(f.pct65);
    return `${ratio ? `${ratio.charAt(0).toUpperCase() + ratio.slice(1)} residents of ${c.name} is 65 or older` : `${f.pct65}% of ${c.name} is 65 or older`}${
      f.pop65 ? ` — about ${roughly(f.pop65)} people` : ""
    }. In ${areaNoun(c.state).one === "county" ? "a county" : `a ${areaNoun(c.state).one}`} that age-heavy, the question is rarely whether a family will need help at home. It is when, and who.`;
  }

  if (d === "rural" && f.pop65) {
    return `${c.name} is home to ${pop} people, ${roughly(f.pop65)} of them 65 or older, spread across ${areaNoun(c.state).one === "county" ? "a county" : `a ${areaNoun(c.state).one}`} that is ${f.pctRural}% rural. Distance is the quiet problem here: the adult child two towns over, the appointment an hour each way, the caregiver who has to drive it.`;
  }

  if (d === "urban" && f.pctNoVehicle && f.pctNoVehicle >= 20) {
    return `${pop.charAt(0).toUpperCase() + pop.slice(1)} people live in ${c.name}, and ${f.pctNoVehicle}% of households here have no car. For an older adult, that turns an ordinary week — the pharmacy, the cardiologist, the grocery store — into a logistics problem long before anyone calls it a care problem.`;
  }

  if (f.pop65 && f.pct65) {
    const ratio = oneIn(f.pct65);
    return `Of the ${pop.replace(/^about /, "")} people in ${c.name}, about ${roughly(f.pop65)} are 65 or older${
      ratio ? ` — ${ratio} residents` : ` (${f.pct65}%)`
    }. Most of them intend to stay in their own homes, and most of the care that makes that possible happens quietly, in living rooms, without anyone calling it "long-term care."`;
  }

  return `${pop.charAt(0).toUpperCase() + pop.slice(1)} people call ${c.name} home. In a county this size, most long-term care doesn't happen in a facility — it happens in kitchens and living rooms.`;
}

/* ── what care costs here, against what people here earn ────────────────── */
export function costSection(c: County, f: CountyFacts, st: StateInfo): Section | null {
  const m = costMath(f, st);
  if (!m) return null;

  const paragraphs: string[] = [
    `${c.state}'s going rate for agency home care is around ${st.hourlyCost}. Twenty hours a week — four hours a day, five days a week, the most common schedule families start with — comes to roughly ${dollars(m.monthly20)} a month, or ${dollars(m.annual20)} a year.`,
  ];

  if (m.shareOfIncome && f.medianIncome) {
    const share = m.shareOfIncome;
    const framing =
      share >= 100
        ? `That is more than the entire median household income in ${c.name} (${dollars(f.medianIncome)}). Almost no family here pays for that schedule out of earnings alone — it comes from savings, home equity, a long-term care policy, or Medicaid.`
        : share >= 60
          ? `Median household income in ${c.name} is ${dollars(f.medianIncome)}, so that schedule would consume about ${share}% of a typical household's entire income. This is the number that sends most families looking for help paying, and it is why the programs below matter more than any brochure.`
          : `Median household income in ${c.name} is ${dollars(f.medianIncome)} — that schedule runs about ${share}% of it. Manageable for some households here, and still worth checking whether a program can carry part of it.`;
    paragraphs.push(framing);
  }

  if (f.pctPoverty150 && f.pctPoverty150 >= 25) {
    paragraphs.push(
      `${f.pctPoverty150}% of people in ${c.name} live below 150% of the federal poverty line — a share high enough that a real portion of local families will qualify for ${c.state}'s Medicaid programs rather than pay privately. If money is the obstacle, start with eligibility, not with rates.`,
    );
  }

  return { heading: `What home care costs in ${c.name}`, paragraphs };
}

/* ── who actually provides care here ─────────────────────────────────────
 * IMPORTANT accuracy note that doubles as useful content: the CMS counts are
 * MEDICARE-CERTIFIED HOME HEALTH agencies (skilled, intermittent, doctor-
 * ordered). That is a different product from the hourly non-medical care most
 * families are shopping for. Saying so plainly is both honest and the single
 * most useful thing on the page for a confused reader.
 */
export function supplySection(c: County, f: CountyFacts): Section | null {
  if (f.hhAgencies === undefined) return null;
  const paragraphs: string[] = [];
  const stStats = stateStats(c.st);

  if (f.hhAgencies === 0) {
    paragraphs.push(
      `No Medicare-certified home health agency lists a service area covering ${c.name}. That does not mean no one will come — non-medical home care agencies aren't in this federal count, and neighboring-county agencies often travel. It does mean that if a doctor orders skilled home health after a hospital stay, arranging it here takes more phone calls than it would an hour away.`,
    );
  } else {
    const one = f.hhAgencies === 1;
    const rated =
      f.hhStar && f.hhRated
        ? ` ${f.hhRated === 1 ? "One carries" : `${commas(f.hhRated)} of them carry`} a CMS quality star rating, averaging ${f.hhStar} out of 5.`
        : "";
    const aide = f.hhAideAgencies
      ? ` ${f.hhAideAgencies === 1 ? "One reports" : `${commas(f.hhAideAgencies)} report`} offering home health aide services.`
      : "";
    paragraphs.push(
      `${commas(f.hhAgencies)} Medicare-certified home health ${one ? "agency serves" : "agencies serve"} ZIP codes in ${c.name}.${rated}${aide}`,
    );

    // Compare quality to the real state average, not to a per-capita ratio —
    // star ratings are built to be comparable; agency counts are not.
    if (f.hhStar && f.hhRated && f.hhRated >= 3 && stStats.hhStar) {
      const how = standing(f.hhStar, stStats.hhStar);
      if (how === "above") {
        paragraphs.push(
          `That is above the ${c.state} average of ${stStats.hhStar} — the agencies working here rate better than the state's typical. Worth knowing, because it means the local floor is higher than average, not that any single agency is a safe bet.`,
        );
      } else if (how === "below") {
        paragraphs.push(
          `That is below the ${c.state} average of ${stStats.hhStar}${
            nationalStats.hhStar ? `, and below the national average of ${nationalStats.hhStar}` : ""
          }. It does not mean good care isn't available here — it means the spread matters, and looking up a specific agency on Medicare's Care Compare before you sign is worth the ten minutes.`,
        );
      }
    }

    if (f.hhNonprofit && f.hhAgencies >= 4) {
      const pct = Math.round((f.hhNonprofit / f.hhAgencies) * 100);
      if (pct >= 40) {
        paragraphs.push(
          `Unusually for the industry, ${pct}% of the agencies here are non-profit — often hospital- or county-affiliated. They tend to be steadier on staffing and slower to answer.`,
        );
      }
    }

    paragraphs.push(
      `One distinction worth getting straight before you call anyone: those are Medicare-certified **home health** agencies — skilled, doctor-ordered, intermittent care, usually a nurse or therapist visiting for a few weeks after a hospital stay. That is not the same as the hourly, non-medical help most families are actually looking for: bathing, dressing, meals, driving, company. Medicare pays for the first. It does not pay for the second.`,
    );
  }

  return { heading: `Who provides care in ${c.name}`, paragraphs };
}

/* ── the facility alternative, with this county's real numbers ──────────── */
export function facilitySection(c: County, f: CountyFacts): Section | null {
  const paragraphs: string[] = [];

  if (!f.nursingHomes) {
    const alt = borderingCounties(c)
      .map((n) => ({ n, nf: getFacts(n.fips) }))
      .filter((x) => (x.nf.nursingHomes ?? 0) > 0)
      .sort((a, b) => (b.nf.nursingHomes ?? 0) - (a.nf.nursingHomes ?? 0))[0];

    paragraphs.push(
      `There is no Medicare- or Medicaid-certified nursing home in ${c.name}.${
        alt
          ? ` The closest certified facilities are just over the line in ${alt.n.name}${alt.n.st !== c.st ? `, ${alt.n.st}` : ""}, which has ${alt.nf.nursingHomes}.`
          : ""
      }`,
    );
    paragraphs.push(
      `That changes the arithmetic. In ${areaNoun(c.state).one === "county" ? "a county" : `a ${areaNoun(c.state).one}`} with no facility, "moving Mom somewhere" means moving her out of the community she has lived in — away from her church, her neighbors, and the daughter who checks on her on the way home from work. Care at home here isn't only the preference. It is often the only option that keeps a family in the same place.`,
    );
    return { heading: `The alternative, locally`, paragraphs };
  }

  const beds = f.nursingBeds ? ` holding ${commas(f.nursingBeds)} certified beds` : "";
  const star = f.nursingStar ? `, averaging ${f.nursingStar} out of 5 on CMS's overall rating` : "";
  paragraphs.push(
    `${c.name} has ${f.nursingHomes} certified nursing ${f.nursingHomes === 1 ? "home" : "homes"}${beds}${star}.${
      f.nursingResidents ? ` About ${commas(f.nursingResidents)} people live in them on an average day.` : ""
    }`,
  );

  const nhAvg = stateStats(c.st).nursingStar;
  if (f.nursingStar && f.nursingHomes >= 3 && nhAvg) {
    const how = standing(f.nursingStar, nhAvg);
    if (how === "below") {
      paragraphs.push(
        `An average of ${f.nursingStar} stars is below the ${c.state} average of ${nhAvg}, and it is worth knowing before a discharge planner hands you a list on a Friday afternoon. Look up any facility on Medicare's Care Compare by name — the overall star hides a lot, and the staffing rating is the one that best predicts what a Tuesday actually looks like.`,
      );
    } else if (how === "above") {
      paragraphs.push(
        `An average of ${f.nursingStar} stars is above the ${c.state} average of ${nhAvg}. If a facility does turn out to be the right answer for your family, the options here are better than most ${areaNoun(c.state).many} in the state.`,
      );
    }
  }

  const per1k = bedsPer1k65(f);
  if (per1k !== undefined && f.pop65 && f.pop65 > 2000) {
    if (per1k <= 15) {
      paragraphs.push(
        `Still, that is only about ${per1k} beds for every 1,000 residents over 65 — tight capacity. When beds are scarce, the "we'll figure it out if something happens" plan tends to fail at exactly the wrong moment. Knowing what home care would cost and who provides it, before a fall, is the cheapest planning a family can do.`,
      );
    } else if (per1k >= 60) {
      paragraphs.push(
        `That is about ${per1k} beds per 1,000 residents over 65 — well above typical, so ${c.name} is ${areaNoun(c.state).one === "county" ? "a county" : `a ${areaNoun(c.state).one}`} where families get pushed toward facility care early, often before it is necessary. It is worth pricing out what staying home would actually take before agreeing to a move.`,
      );
    }
  }

  return { heading: `The alternative, locally`, paragraphs };
}

/* ── FAQs, using this county's own figures ──────────────────────────────── */
export function countyFaqs(
  c: County,
  f: CountyFacts,
  st: StateInfo,
  served: boolean,
): { q: string; a: string }[] {
  const m = costMath(f, st);
  const aboveFloor = st.trainingHours > 75;
  const licensedBy = st.licensed
    ? st.licensure.replace(/^Yes\s*—\s*/, "").replace(/\s*\(.*\)$/, "")
    : null;

  const faqs: { q: string; a: string }[] = [
    {
      q: `How much does home care cost in ${c.name}, ${c.st}?`,
      a: `Agency home care in ${c.state} runs around ${st.hourlyCost} for private pay.${
        m ? ` At 20 hours a week that is about ${dollars(m.monthly20)} a month.` : ""
      }${
        m?.shareOfIncome && f.medianIncome
          ? ` For context, median household income in ${c.name} is ${dollars(f.medianIncome)}.`
          : ""
      } Rates move with the level of care and the schedule — short daily visits cost more per hour than long shifts.`,
    },
    {
      q: `Does Medicare pay for home care in ${c.name}?`,
      a: `Medicare pays for skilled home health — a nurse or therapist, doctor-ordered, for a limited stretch, usually after a hospital stay.${
        f.hhAgencies ? ` ${commas(f.hhAgencies)} Medicare-certified ${f.hhAgencies === 1 ? "agency serves" : "agencies serve"} ${c.name}.` : ""
      } Medicare does not pay for the hourly, non-medical help most families want — bathing, dressing, meals, driving, company. For that, the money comes from private pay, long-term care insurance, VA benefits, or ${c.state} Medicaid.`,
    },
    {
      q: `Does Medicaid pay for home care in ${c.name}?`,
      a: `Yes — for people who qualify. ${c.state} runs ${st.programs.length === 1 ? "a Medicaid program" : "Medicaid programs"} that pay${st.programs.length === 1 ? "s" : ""} for care at home instead of a nursing home: ${st.programs.join(", ")}. Income, asset, and care-need rules apply, and approval usually takes weeks to months, so apply before you need it.${
        f.pctPoverty150 && f.pctPoverty150 >= 25
          ? ` With ${f.pctPoverty150}% of ${c.name} below 150% of the poverty line, a meaningful share of local families do qualify.`
          : ""
      }`,
    },
    {
      q: `How are caregivers trained and vetted in ${c.state}?`,
      a: `Certified home health aides in ${c.state} complete at least ${st.trainingHours} hours of training${aboveFloor ? " — above the 75-hour federal minimum" : ", the federal minimum"}. ${
        licensedBy
          ? `The state licenses home care agencies through the ${licensedBy}, so ask to see an agency's license before you hire.`
          : `${c.state} does not license non-medical home care agencies, so the vetting falls to you: ask about background checks, insurance and bonding, and who supervises the caregivers.`
      }`,
    },
  ];

  if (f.nursingHomes === undefined || f.nursingHomes === 0) {
    faqs.push({
      q: `Are there nursing homes in ${c.name}?`,
      a: `No — there is no certified nursing home in ${c.name}. Families here who need facility care have to look to a neighboring ${areaNoun(c.state).one}, which is part of why home care matters more in places like this than the brochures suggest.`,
    });
  } else if (f.nursingStar) {
    faqs.push({
      q: `Is home care better than a nursing home in ${c.name}?`,
      a: `It depends on the level of care needed, not on which one sounds nicer. ${c.name}'s ${f.nursingHomes} certified ${f.nursingHomes === 1 ? "facility averages" : "facilities average"} ${f.nursingStar} out of 5 stars on CMS ratings${
        stateStats(c.st).nursingStar ? `, against a ${c.state} average of ${stateStats(c.st).nursingStar}` : ""
      }. Round-the-clock skilled nursing is something a facility does that home care cannot. But for help with bathing, meals, medication reminders, and company, care at home usually costs less and keeps someone in their own bed — and most people, asked plainly, say that is what they want.`,
    });
  }

  faqs.push(
    served
      ? {
          q: `Does ${site.name} provide caregivers in ${c.name}?`,
          a: `Yes — ${c.name} is our home county. Our caregivers live and work here, our rates are published on our pricing page rather than quoted over the phone, and the first in-home assessment is free.`,
        }
      : {
          q: `Does ${site.name} provide caregivers in ${c.name}?`,
          a: `Not directly — our own caregivers serve the ${site.metro} area of ${site.state}. This page is a free guide for ${c.name} families: what care really costs here, who provides it, and which programs can help pay.${
            site.phone ? " If you want to talk any of it through, a person answers our phone." : ""
          }`,
        },
  );

  return faqs;
}

/** How to vet an agency, tuned to whether this state licenses them at all. */
export function vettingPoints(c: County, f: CountyFacts, st: StateInfo): { title: string; body: string }[] {
  const licensedBy = st.licensed
    ? st.licensure.replace(/^Yes\s*—\s*/, "").replace(/\s*\(.*\)$/, "")
    : null;
  const points: { title: string; body: string }[] = [];

  points.push(
    licensedBy
      ? {
          title: "Ask for the license",
          body: `${c.state} licenses home care agencies through the ${licensedBy}. A legitimate agency shows its license without hesitating. One that changes the subject has told you something.`,
        }
      : {
          title: "Vet twice as hard",
          body: `${c.state} does not license non-medical home care agencies, which means anyone can hang a shingle. Ask who runs background checks, whether caregivers are W-2 employees or contractors, whether the agency carries liability and workers' comp, and who supervises the caregiver you'd get.`,
        },
  );

  points.push({
    title: "Ask what the rate covers",
    body: `Around ${st.hourlyCost} is typical in ${c.state}. A real agency's rate covers a trained, background-checked, insured caregiver plus supervision and backup staffing when your regular person is sick. A rate well under the local range usually means one of those is missing.`,
  });

  points.push(
    f.hhAgencies && f.hhAgencies >= 25
      ? {
          title: "Don't confuse a fast answer with a good one",
          body: `With ${commas(f.hhAgencies)} certified agencies serving ${c.name}, someone will always pick up. Ask specifically: can you staff the exact hours I need, with the same caregiver, starting when? Vague answers there predict vague service later.`,
        }
      : {
          title: "Start the clock early",
          body: `${c.name} is served by ${f.hhAgencies ? `${f.hhAgencies} certified ${f.hhAgencies === 1 ? "agency" : "agencies"}` : "few certified agencies"}, so the honest answer to "when can you start?" is often two to three weeks. If you're planning around a discharge date, call before the discharge, not after.`,
        },
  );

  points.push({
    title: "Ask about Medicaid now, not later",
    body: `If money is going to be the constraint, ask about ${st.programs[0].replace(/\s*\(.*\)$/, "")} at the first call. Approval takes weeks to months, and private pay is what bridges the gap — so the sooner the application starts, the smaller that bridge is.`,
  });

  return points;
}
