/**
 * The nine services. All copy is written for the adult daughter reading on
 * her phone at 11pm — 5th–7th grade reading level, warm, concrete, unhurried.
 * `italicWord` is the one Fraunces-italic clay word in each page's H1.
 */

export interface Service {
  slug: string;
  name: string;
  /** Card copy on the home-page grid — one warm sentence. */
  short: string;
  /** H1 on the service page. Use {italic} where the clay italic word goes. */
  h1: string;
  italicWord: string;
  /** Lead paragraph under the H1. */
  lead: string;
  /** "What's included" list. */
  included: string[];
  /** "When families choose this" — short paragraphs. */
  whenChosen: string[];
  /** "What a visit looks like" — a small story told in steps. */
  visit: { time: string; moment: string }[];
  /** One-line closer above the mid-page CTA. */
  closer: string;
  metaDescription: string;
}

export const services: Service[] = [
  {
    slug: "companion-care",
    name: "Companion care",
    short: "A friendly face for conversation, meals, errands, and the parts of the day that feel long alone.",
    h1: "Companion care that feels like {italic}",
    italicWord: "company",
    lead: "Some days, the hardest part of living alone is the quiet. Companion care brings a familiar, friendly person into the week — someone to talk with, cook with, and get out of the house with. It is care for the spirit as much as anything else.",
    included: [
      "Conversation, card games, puzzles, and shared hobbies",
      "Meal planning and cooking together",
      "Light housekeeping — dishes, laundry, tidying up",
      "Rides and company for errands, appointments, and outings",
      "Medication reminders (we remind — a nurse or family manages the meds)",
      "A short note to family after every visit",
    ],
    whenChosen: [
      "Families usually call us about companion care after a quiet worry has been building for a while. Dad eats cereal for dinner because cooking for one feels pointless. Mom stopped going to church because driving at night scares her. Nothing is wrong, exactly — but the days have gotten small.",
      "Companion care is also how many families start with home care at all. It is the gentlest first step. A few visits a week, a caregiver your parent genuinely likes, and the door is open if more help is ever needed.",
    ],
    visit: [
      { time: "9:00", moment: "Maria lets herself in with the code the family set up. Coffee first — she knows how Ruth takes it." },
      { time: "9:30", moment: "They make a grocery list together and drive to the store. Ruth picks; Maria carries." },
      { time: "11:00", moment: "Lunch prep, and enough soup for two more days goes in the fridge, labeled." },
      { time: "12:30", moment: "A crossword at the kitchen table. Maria starts a load of laundry while Ruth reads the clues out loud." },
      { time: "1:00", moment: "Maria sends the family a two-line note: what they did, how Ruth seemed, what's in the fridge." },
    ],
    closer: "If your mom or dad's world has been getting smaller, a few good visits a week can open it back up.",
    metaDescription: "Companion care at home: conversation, meals, errands, and real company a few days a week. A gentle first step into home care, from a local team.",
  },
  {
    slug: "personal-care",
    name: "Personal care",
    short: "Respectful hands-on help with bathing, dressing, and mornings — dignity always comes first.",
    h1: "Personal care, with {italic} first",
    italicWord: "dignity",
    lead: "Bathing, dressing, getting to the toilet — this is the most personal help there is, and it deserves the most careful people. Our caregivers are trained to protect dignity in every small moment: knocking first, covering up, never rushing.",
    included: [
      "Bathing, showering, and grooming help",
      "Dressing and getting ready for the day",
      "Toileting and incontinence care, handled matter-of-factly and kindly",
      "Safe help moving — bed to chair, chair to walker, steadying an arm",
      "Skin checks and repositioning for comfort",
      "Meals, medication reminders, and light housekeeping around the personal care",
    ],
    whenChosen: [
      "Families choose personal care when the body needs more help than pride wants to admit. Often there has been a moment — a slip getting out of the tub, a shirt worn three days running, a parent who quietly stopped showering because it got scary in there.",
      "This is also where a professional caregiver can spare a marriage or a parent-child relationship. Being bathed by your daughter changes something between you. Being helped by a warm, trained caregiver keeps you her parent, not her patient.",
    ],
    visit: [
      { time: "8:00", moment: "Denise arrives while Frank is still in bed — mornings are the hard part, so that's when she comes." },
      { time: "8:15", moment: "Shower with the bench and grab bar. Denise stays close but lets Frank do everything he can himself." },
      { time: "8:45", moment: "Dressed, shaved, hearing aids in. Frank likes a real shirt with buttons, so that's what he wears." },
      { time: "9:15", moment: "Eggs and toast, pills with breakfast per the checklist, and the walker parked exactly where he likes it." },
      { time: "10:00", moment: "Bed made, bathroom dry and safe, and a note to Frank's son: good morning, good appetite, steady on his feet." },
    ],
    closer: "Getting help with the personal things is a hard door to walk through. We make it feel ordinary — that's the whole skill.",
    metaDescription: "Hands-on personal care at home: bathing, dressing, toileting, and safe transfers from trained caregivers who protect dignity in every small moment.",
  },
  {
    slug: "dementia-care",
    name: "Dementia & Alzheimer's care",
    short: "Calm, consistent caregivers trained for memory loss — same faces, familiar routines.",
    h1: "Dementia care built on {italic}",
    italicWord: "routine",
    lead: "Memory loss makes the familiar precious. Our dementia caregivers work in small, consistent teams — the same faces, the same routines, the same gentle answers to the same questions — because for a person with dementia, consistency is safety.",
    included: [
      "Caregivers with specific dementia training, matched for consistency",
      "Daily routines built around your parent's lifelong habits and history",
      "Redirection and reassurance instead of arguing or correcting",
      "Wandering awareness and a safer home setup",
      "Meals, personal care, and medication reminders woven into the routine",
      "Honest, regular family updates — including the hard days",
    ],
    whenChosen: [
      "Families call us at every stage. Early on, it's about safety and dignity while Mom still lives well at home: the stove, the car keys, the bills piling up. Later, it's about hands-on help through days that can be sweet one hour and stormy the next.",
      "The other person we're caring for is you. Dementia caregiving at home wears families down slowly — the repeated questions, the sundowning, the guilt. Regular, reliable relief is not a luxury. It's what lets you keep going.",
    ],
    visit: [
      { time: "10:00", moment: "Angela arrives — same caregiver, same time, three days a week. Eleanor doesn't always know her name, but her face means calm." },
      { time: "10:15", moment: "They fold warm towels together. Eleanor ran a household for fifty years; her hands still know useful work." },
      { time: "11:30", moment: "The third time Eleanor asks about her mother, Angela answers as gently as the first." },
      { time: "12:30", moment: "Lunch is the same table, same placemat, same order of things. Sameness is the point." },
      { time: "2:00", moment: "Old big-band music while Angela preps dinner. She notes for the family that mornings are getting harder — worth discussing." },
    ],
    closer: "You don't have to become a dementia expert alone. Bring in people who already are.",
    metaDescription: "In-home dementia and Alzheimer's care: consistent trained caregivers, familiar routines, wandering awareness, and honest family updates at every stage.",
  },
  {
    slug: "24-hour-care",
    name: "24-hour care",
    short: "Around-the-clock caregivers in shifts, so someone awake and alert is always there.",
    h1: "Someone there, {italic} hour",
    italicWord: "every",
    lead: "Some situations can't wait until morning — and some people can't be alone at 3am. With 24-hour care, caregivers work in shifts so someone is awake, alert, and present in the home at all times, day and night.",
    included: [
      "Caregivers in rotating shifts, awake around the clock",
      "All personal care, meals, and medication reminders, on your parent's schedule",
      "Overnight help to the bathroom and fall prevention at the riskiest hours",
      "A small consistent team, not a parade of strangers",
      "Care notes handed off shift to shift, and shared with family",
      "A care manager who supervises the whole arrangement",
    ],
    whenChosen: [
      "Families choose 24-hour care when the risk stops keeping business hours: a parent who wanders at night, falls on the way to the bathroom at 2am, or simply cannot be alone anymore after a hospital stay. It is also how many families honor a promise — no nursing home — even when needs are high.",
      "Because caregivers work in shifts and sleep at home, someone is always fully awake. That's the difference from live-in care, and for night wandering or frequent overnight needs, it matters. We'll help you figure out which fits.",
    ],
    visit: [
      { time: "7:00", moment: "Day shift arrives. Handoff at the kitchen counter: how the night went, what's on today." },
      { time: "12:00", moment: "Lunch, a walk to the mailbox, and a doctor's appointment with a caregiver who takes notes." },
      { time: "19:00", moment: "Evening shift. Dinner, pills, and the long slow wind-down that goes better when nobody rushes it." },
      { time: "23:00", moment: "Overnight caregiver is awake in the living room. Lights low, door alarms set." },
      { time: "2:30", moment: "A trip to the bathroom with a steady arm — the exact moment this whole arrangement exists for." },
    ],
    closer: "When the worry runs all night, the care should too.",
    metaDescription: "24-hour home care with awake caregivers in shifts — overnight fall prevention, wandering safety, and full care around the clock, at home.",
  },
  {
    slug: "live-in-care",
    name: "Live-in care",
    short: "One dedicated caregiver who stays in the home — deep familiarity, steadier cost than 24/7 shifts.",
    h1: "A caregiver who's truly {italic}",
    italicWord: "there",
    lead: "With live-in care, one caregiver stays in the home — cooking in your mother's kitchen, learning her rhythms, becoming a genuine presence in the house rather than a visitor. For many families it's the closest thing to having family move in.",
    included: [
      "A dedicated live-in caregiver, carefully matched, plus relief coverage",
      "Full daily care: meals, personal care, housekeeping, companionship",
      "A caregiver who sleeps in the home and can respond if needed",
      "Deep familiarity — one person who truly knows your parent",
      "Scheduled relief days covered by a consistent backup caregiver",
      "Typically steadier monthly cost than round-the-clock shifts",
    ],
    whenChosen: [
      "Live-in care fits when a parent needs someone present essentially all the time, but nights are mostly quiet. The caregiver sleeps in the home and gets proper breaks, so this works best when overnight needs are occasional — a bathroom trip, reassurance after a bad dream — rather than constant.",
      "Families also choose live-in for the relationship. One person, all week, learns everything: the early signs of a bad day, the story behind every photo in the hallway. If your parent needs frequent help through the night, ask us about 24-hour shift care instead — we'll talk you through the honest tradeoffs of both.",
    ],
    visit: [
      { time: "7:30", moment: "Grace is already in the kitchen — she lives here during the week. Oatmeal with raisins, the way Helen likes it." },
      { time: "10:00", moment: "Garden club on Thursdays. Grace drives, stays in the back, and lets Helen have her friends to herself." },
      { time: "13:00", moment: "Lunch, then Helen's nap. Grace does the laundry and takes her own break — rest is built into live-in care." },
      { time: "18:00", moment: "They cook dinner together from Helen's own recipe box, and eat together too." },
      { time: "21:30", moment: "Helen settled for the night; Grace turns in nearby, close enough to hear if she's needed." },
    ],
    closer: "Some homes need more than visits. They need a person.",
    metaDescription: "Live-in home care: one dedicated caregiver who stays in the home, learns your parent deeply, and costs steadier than round-the-clock shifts.",
  },
  {
    slug: "overnight-care",
    name: "Overnight care",
    short: "An awake caregiver through the night — for safe bathroom trips, sundowning, and your own sleep.",
    h1: "So the nights feel {italic} again",
    italicWord: "safe",
    lead: "Most falls, most wandering, and most family exhaustion happen between 10pm and 6am. Overnight care puts an awake, attentive caregiver in the home through the night — so your parent is safe, and you can finally sleep.",
    included: [
      "An awake caregiver in the home overnight, typically 8–12 hours",
      "Help to and from the bathroom — the single riskiest trip of the day",
      "Calm response to sundowning, confusion, and restless nights",
      "Evening wind-down and morning start-up routines",
      "Quiet household tasks while your parent sleeps",
      "A morning report on how the night really went",
    ],
    whenChosen: [
      "Families call about overnight care after a scare: a fall at 2am, a parent found in the kitchen at 4 confused about the decade, a wandering episode that ended with a neighbor's phone call. Nights concentrate the risk — so that's where the help goes first.",
      "Just as often, the person who needs the night off is you. If you're sleeping with one ear open — or driving over every night — a few covered nights a week is often the single change that makes the rest of caregiving sustainable.",
    ],
    visit: [
      { time: "21:00", moment: "Sam arrives for the night. Tea, the ten o'clock news, and pills from the evening checklist." },
      { time: "22:30", moment: "Walter settled in bed. Sam stays up — reading in the armchair with the hall light on." },
      { time: "1:40", moment: "Walter's up. A steady arm to the bathroom and back, no stumbling in the dark, no drama." },
      { time: "4:15", moment: "Restless spell. Sam sits with him and talks about fishing until he drifts back off." },
      { time: "6:30", moment: "Coffee going when Walter wakes. Sam texts the daughter: two wake-ups, no falls, in good spirits." },
    ],
    closer: "You can't pour from an empty cup, and you can't fill it without sleep.",
    metaDescription: "Overnight home care with an awake caregiver: safe bathroom trips, sundowning support, and real sleep for the family — night after night.",
  },
  {
    slug: "respite-care",
    name: "Respite care",
    short: "Short-term relief for family caregivers — a real break, from an afternoon to a few weeks.",
    h1: "A real break, without the {italic}",
    italicWord: "guilt",
    lead: "If you're the one caring for a parent or spouse, respite care is care for you. A trained caregiver steps in — for an afternoon, a weekend, or a few weeks — so you can rest, travel, work, or just be a daughter again for a little while.",
    included: [
      "Flexible short-term coverage, from a few hours to several weeks",
      "The same trained, background-checked caregivers as our ongoing care",
      "Your loved one's exact routine, learned and followed",
      "Personal care, meals, medications reminders, companionship — whatever the day needs",
      "Updates while you're away, as often as you want them (or a true unplugged break)",
      "An easy path to regular help if the break shows you need one",
    ],
    whenChosen: [
      "Sometimes there's an event — a wedding out of state, a surgery of your own, a work trip you can't move. Respite care means you can go, and the care at home doesn't skip a beat.",
      "And sometimes there's no event at all. There's just exhaustion. Family caregivers run on fumes for years and call it love. A standing break — every Tuesday afternoon, one weekend a month — is how you keep doing this without disappearing into it.",
    ],
    visit: [
      { time: "Fri 15:00", moment: "Carmen arrives and walks the routine with Linda before she leaves for her daughter's graduation — first trip in three years." },
      { time: "Fri 18:00", moment: "Dinner goes fine. Carmen texts Linda one photo: Dad, at the table, smiling. Linda exhales." },
      { time: "Sat", moment: "The Saturday rhythm, kept exactly: coffee on the porch, the ballgame on the radio." },
      { time: "Sun 10:00", moment: "Shower, a shave, and church on the TV — the same as every Sunday." },
      { time: "Sun 19:00", moment: "Linda comes home to a calm house, a clean kitchen, and notes on the weekend. Nothing fell apart. That's the point." },
    ],
    closer: "Taking a break isn't stepping away from your parent. It's how you make sure you can stay.",
    metaDescription: "Respite care for family caregivers: trained short-term relief from an afternoon to a few weeks, with your loved one's routine kept exactly.",
  },
  {
    slug: "post-hospital-care",
    name: "Post-hospital care",
    short: "Extra help through the fragile weeks after discharge — the ride home, meds, meals, and follow-ups.",
    h1: "Home from the hospital, {italic} this time",
    italicWord: "safely",
    lead: "The ride home from the hospital is the easy part. The next few weeks — new medications, follow-up appointments, stairs that suddenly feel steep — are when things go wrong. Post-hospital care puts a capable person in the house for exactly that window.",
    included: [
      "The discharge itself: a ride home and getting settled the first day",
      "Help following the discharge plan — reminders for new medications, wound-care appointments, therapy exercises",
      "Meals that match doctor's orders, made and cleaned up",
      "Steadying help on stairs, in the bathroom, and anywhere balance is off",
      "Watchful eyes for warning signs, reported to family right away",
      "Rides and company for every follow-up appointment",
    ],
    whenChosen: [
      "Families call us from the hospital hallway, often the day before discharge. The care team says Mom is 'ready to go home with support' — and everyone in the room quietly wonders who the support is. If you live an hour away, or work full-time, the honest answer is: nobody, yet.",
      "The first weeks home are when a recovery either takes hold or unravels — a missed medication, a fall on the way to the bathroom, a skipped follow-up. A few weeks of steady help through that window is some of the best money a family ever spends. Many families start with two or three weeks and taper off as strength returns.",
    ],
    visit: [
      { time: "Day 1", moment: "James meets Dorothy at discharge, drives her home, fills the fridge, and walks every path she'll take — bed, bathroom, kitchen — clearing the trouble spots." },
      { time: "Day 2", moment: "The new medication list goes on the fridge in large print. James builds the reminder routine around her meals." },
      { time: "Day 4", moment: "First follow-up appointment. James drives, waits, and writes down what the doctor says so the family hears it right." },
      { time: "Day 8", moment: "Dorothy wants to shower alone. James sets up the bench and stays within earshot — independence, with a net." },
      { time: "Day 14", moment: "Stronger every day. The family scales visits back to mornings only. That was always the plan." },
    ],
    closer: "Discharge papers say 'home with support.' We're the support.",
    metaDescription: "Post-hospital home care: discharge pickup, medication reminders, fall prevention, meals, and follow-up rides through the fragile first weeks home.",
  },
  {
    slug: "veterans-care",
    name: "Veterans home care",
    short: "Home care for those who served — and help understanding the VA benefits that may pay for it.",
    h1: "Care for those who {italic}",
    italicWord: "served",
    lead: "Veterans and their surviving spouses often have real help available — VA programs that can pay toward care at home — and most families have never been told. We provide the care, and we'll help you understand the benefits that may help pay for it.",
    included: [
      "All of our home care services — companion, personal, dementia, overnight, and more",
      "Plain-English guidance on VA Aid & Attendance and other VA home-care benefits",
      "Help gathering what a VA application typically needs",
      "Caregivers matched thoughtfully with veterans, including for shared history",
      "Coordination with VA appointments and providers",
      "Support for surviving spouses, who are often eligible too",
    ],
    whenChosen: [
      "Families of veterans choose us for two reasons. The first is the care itself. The second is that paying for care is confusing everywhere, and doubly so with the VA — most families have never heard of Aid & Attendance, a benefit that can add hundreds of dollars a month toward home care for a wartime veteran or surviving spouse.",
      "We are not the VA and don't decide eligibility — but we've walked this road with families before, we'll point you to the right people, and we'll help you get organized. You handled the serving. Let us help with the paperwork.",
    ],
    visit: [
      { time: "9:00", moment: "Tom arrives. He and Earl, Army both, have a running argument about the best mess-hall coffee. It's the good kind of argument." },
      { time: "9:30", moment: "Shower and dressed — Earl wears his unit cap most days, and Tom makes sure it's where he can find it." },
      { time: "11:00", moment: "They sort the VA paperwork pile into three folders: done, waiting, and 'ask the daughter.'" },
      { time: "12:30", moment: "Lunch, then Earl tells the story about Fort Benning. Tom's heard it eleven times. He'd hear it twelve." },
      { time: "14:00", moment: "Note to the family: good day, good appetite, VA folder's ready for Thursday's call." },
    ],
    closer: "If your parent served, start by asking us about VA benefits — the answer surprises most families.",
    metaDescription: "Home care for veterans and surviving spouses, plus plain-English help understanding VA Aid & Attendance and other benefits that may pay toward care.",
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}


/**
 * Which services a reader of each page most plausibly needs next. Hand-picked
 * rather than "the next three in the array" — someone reading about dementia
 * care is weighing overnight and 24-hour cover, not veterans' benefits.
 */
export const RELATED: Record<string, string[]> = {
  "companion-care": ["personal-care", "respite-care", "dementia-care"],
  "personal-care": ["companion-care", "post-hospital-care", "24-hour-care"],
  "dementia-care": ["overnight-care", "24-hour-care", "respite-care"],
  "24-hour-care": ["live-in-care", "overnight-care", "dementia-care"],
  "live-in-care": ["24-hour-care", "personal-care", "overnight-care"],
  "overnight-care": ["24-hour-care", "dementia-care", "live-in-care"],
  "respite-care": ["companion-care", "dementia-care", "overnight-care"],
  "post-hospital-care": ["personal-care", "24-hour-care", "companion-care"],
  "veterans-care": ["personal-care", "companion-care", "post-hospital-care"],
};

export function relatedServices(slug: string): Service[] {
  return (RELATED[slug] ?? [])
    .map((s) => services.find((x) => x.slug === s))
    .filter((s): s is Service => Boolean(s));
}
