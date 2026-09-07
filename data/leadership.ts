// TODO: replace with actual hires before launch — state licensure and Medicaid programs verify named executives.

/**
 * Leadership roster, config-driven. Bios are ROLE-scoped on purpose: they say
 * what the role does at Juniper at Home. Do not add personal histories,
 * schools, past employers, or years of experience here.
 */

export type LeadershipTier = "executive" | "vp" | "director";

export interface Leader {
  name: string;
  title: string;
  tier: LeadershipTier;
  bio: string;
}

export const tierLabels: Record<LeadershipTier, { heading: string; sub: string }> = {
  executive: {
    heading: "Executive team",
    sub: "The people responsible for the whole company — every branch, every caregiver, every family.",
  },
  vp: {
    heading: "Operations leadership",
    sub: "The leaders who run the machinery behind every visit: branches, Medicaid programs, hiring, scheduling, and billing.",
  },
  director: {
    heading: "Program directors",
    sub: "The people closest to the day-to-day — the first phone call, the visit records, the caregiver files, and how care feels week to week.",
  },
};

export const leadership: Leader[] = [
  // ── C-suite ─────────────────────────────────────────────────────
  {
    name: "Jacob Friedman",
    title: "Chief Executive Officer",
    tier: "executive",
    bio: "Jacob sets the direction for Juniper at Home and holds every branch to one standard: care we would want for our own parents. He spends most of his time where the work happens — in branches, with caregivers, and with families.",
  },
  {
    name: "Samuel Klein",
    title: "President",
    tier: "executive",
    bio: "Samuel runs the company day to day. His job is to make sure a family's experience is the same at every branch — same answers, same follow-through, same care — whether it's our largest office or our newest one.",
  },
  {
    name: "David Berger",
    title: "Chief Operating Officer",
    tier: "executive",
    bio: "David owns the operations behind every visit: staffing, coverage, and the systems branches use every day. When a shift needs filling or a schedule changes at 6 a.m., the process that catches it is his responsibility.",
  },
  {
    name: "Isaac Rosen",
    title: "Chief Financial Officer",
    tier: "executive",
    bio: "Isaac manages the company's finances so two things never wobble: caregivers get paid on time, every time, and every Medicaid program and family is billed correctly. Clean money handling is part of trustworthy care.",
  },
  {
    name: "Leah Stein",
    title: "Chief People Officer",
    tier: "executive",
    bio: "Leah is responsible for what it feels like to work here — pay, training, support, and whether caregivers stay. Families get steady caregivers only when caregivers are treated well, so her work shows up in your living room.",
  },
  {
    name: "Mark Weiss",
    title: "Chief Growth Officer",
    tier: "executive",
    bio: "Mark leads how Juniper at Home grows — new branches, new communities, and new Medicaid programs we can serve. His rule is simple: we don't open anywhere we can't staff and support properly from day one.",
  },
  {
    name: "Rachel Feldman",
    title: "Chief Compliance Officer",
    tier: "executive",
    bio: "Rachel makes sure every branch follows its state's licensure rules and every Medicaid program's rules — background checks, training records, visit documentation, audits. Her team is why families and states can take our word.",
  },

  // ── SVP / VP tier ───────────────────────────────────────────────
  {
    name: "Joseph Green",
    title: "SVP, Branch Operations",
    tier: "vp",
    bio: "Joseph leads our branch managers. He's the person they call when something is hard, and the person who makes sure every branch runs the same playbook — from the first intake call to a caregiver's first shift.",
  },
  {
    name: "Sarah Cohen",
    title: "VP, Medicaid Operations",
    tier: "vp",
    bio: "Sarah runs the Medicaid side of the house: enrollments, service authorizations, and the program rules that decide how many hours a family gets. Her team's job is to make a complicated system feel simple to families.",
  },
  {
    name: "Rebecca Adler",
    title: "VP, Human Resources",
    tier: "vp",
    bio: "Rebecca handles the employment side of caregiving — onboarding, W-2 payroll, benefits, and the everyday questions of a large caregiving workforce. Caregivers here are employees, not gig workers, and her team is why that works.",
  },
  {
    name: "Michael Hart",
    title: "VP, Revenue Cycle",
    tier: "vp",
    bio: "Michael oversees billing and claims — getting every visit billed to the right payer, the first time. For families, his team's work means clear invoices and no surprise bills; for Medicaid programs, it means clean claims.",
  },
  {
    name: "Esther Kaplan",
    title: "VP, Caregiver Recruitment",
    tier: "vp",
    bio: "Esther leads the teams that find and hire our HHAs and PCAs. Recruiting never stops in home care, and her standard doesn't move: hire for heart, screen thoroughly, and never fill a shift with someone we wouldn't send to our own family.",
  },
  {
    name: "Daniel Miller",
    title: "VP, Scheduling & Workforce",
    tier: "vp",
    bio: "Daniel runs scheduling — matching each family with the right caregiver, keeping schedules steady, and covering call-offs before a family feels them. A visit that starts on time, with a familiar face, is his team's product.",
  },

  // ── Director tier ───────────────────────────────────────────────
  {
    name: "Amanda Brooks",
    title: "Director, Intake",
    tier: "director",
    bio: "Amanda's team answers the first call. They listen to what happened this week, explain the options in plain English, and get a family from that call to a first visit without runaround.",
  },
  {
    name: "Jonathan Lewis",
    title: "Director, EVV Operations",
    tier: "director",
    bio: "Jonathan runs electronic visit verification — the state-required system that records when every caregiver arrives and leaves. It means families, and the programs that pay for care, can trust that every visit really happened.",
  },
  {
    name: "Nicole Schwartz",
    title: "Director, Credentialing",
    tier: "director",
    bio: "Nicole's team keeps every caregiver's file complete and current — background checks, training, and required certifications — before a first shift and for every year after. No file, no shift. No exceptions.",
  },
  {
    name: "Melissa Gold",
    title: "Director, Patient Services",
    tier: "director",
    bio: "Melissa looks after how care feels once it's underway — regular check-ins, care plan updates as needs change, and a real person to call when something isn't right. Her team is a family's voice inside the company.",
  },
];

/** "JF" from "Jacob Friedman" — feeds the initial avatars. */
export function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export const leadershipByTier = (tier: LeadershipTier) =>
  leadership.filter((l) => l.tier === tier);
