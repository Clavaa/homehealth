import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import {
  leadershipByTier,
  tierLabels,
  type Leader,
  type LeadershipTier,
} from "@/data/leadership";
import { InitialAvatar } from "@/components/InitialAvatar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { MidPageCTA } from "@/components/MidPageCTA";
import { RecruitBand } from "@/components/RecruitBand";

export const metadata: Metadata = pageMeta({
  title: "Our Leadership Team",
  description:
    "Meet the leadership of Juniper at Home — the executives, operations leaders, and program directors who stand behind every visit.",
  path: "/about/leadership",
});

/**
 * The operational chain a family's care travels through — rendered as a
 * layer list on the page. One plain sentence per layer: what that layer
 * does for a family.
 */
const branchLayers = [
  {
    role: "Branch Managers",
    sentence:
      "Run your local office and own how care goes for every family it serves.",
  },
  {
    role: "Intake Coordinators",
    sentence:
      "Answer your first call, listen to what happened, and get care moving without runaround.",
  },
  {
    role: "Care Coordinators",
    sentence:
      "Visit your home, build the care plan with you, and adjust it as needs change.",
  },
  {
    role: "Staffing & Scheduling Coordinators",
    sentence:
      "Match your family with the right caregiver and keep the same faces showing up on time.",
  },
  {
    role: "Recruiters",
    sentence:
      "Keep finding and screening good caregivers, so there's always someone we trust to send.",
  },
  {
    role: "EVV & Compliance",
    sentence:
      "Verify electronically that every visit started and ended as promised — no honor system.",
  },
  {
    role: "HHAs & PCAs",
    sentence:
      "The caregivers themselves — the trained, screened people doing the actual caring in your home.",
  },
];

const tiers: LeadershipTier[] = ["executive", "vp", "director"];

export default function LeadershipPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
          { name: "Leadership" },
        ]}
      />
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <p className="text-sm font-semibold uppercase tracking-wider text-clay">
          Leadership
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl leading-[1.1] text-juniper sm:text-5xl">
          The people <em className="hero-italic">responsible</em>
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-ink/80">
          Home care is personal, so you should know who stands behind it.
          These are the people accountable for how caregivers are screened,
          how visits are verified, and how your family is treated — by name
          and by role.
        </p>
      </section>

      {/* ── Tiers ──────────────────────────────────────────────── */}
      {tiers.map((tier, tierIndex) => {
        const leaders = leadershipByTier(tier);
        const label = tierLabels[tier];
        const banded = tierIndex === 1; // middle tier on sage for rhythm
        return (
          <section key={tier} className={banded ? "bg-sage" : undefined}>
            <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
              <div className="max-w-2xl">
                <h2 className="text-3xl text-juniper sm:text-4xl">
                  {label.heading}
                </h2>
                <p className="mt-3 text-ink/80">{label.sub}</p>
              </div>
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {leaders.map((leader, i) => (
                  <LeaderCard
                    key={leader.name}
                    leader={leader}
                    bigCorner={i === 0}
                    banded={banded}
                  />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* ── How a branch runs ──────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-14">
          <div>
            <h2 className="text-3xl text-juniper sm:text-4xl">
              How a branch runs
            </h2>
            <p className="mt-4 max-w-md text-ink/80">
              Titles are one thing; here&rsquo;s the actual chain your
              family&rsquo;s care travels through at every local branch, top
              to bottom. Every layer exists for one reason — so the last one
              can do its job well.
            </p>
            <Link
              href="/services"
              className="mt-6 inline-block text-[15px] font-semibold text-juniper underline underline-offset-4"
            >
              What that care looks like &rarr;
            </Link>
          </div>

          <ol className="relative">
            {branchLayers.map((layer, i) => {
              const isLast = i === branchLayers.length - 1;
              return (
                <li key={layer.role} className="relative flex gap-5 pb-4 last:pb-0">
                  {/* Rail: marker + connector */}
                  <div className="flex flex-col items-center">
                    <span
                      className={`z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-[family-name:var(--font-display)] text-sm font-semibold ${
                        isLast
                          ? "bg-juniper text-white"
                          : "border-2 border-juniper/30 bg-white text-juniper"
                      }`}
                    >
                      {i + 1}
                    </span>
                    {!isLast && (
                      <span
                        aria-hidden="true"
                        className="w-0.5 flex-1 bg-juniper/20"
                      />
                    )}
                  </div>
                  {/* Layer card */}
                  <div
                    className={`mb-1 flex-1 rounded-[var(--radius-card)] p-5 ${
                      isLast
                        ? "rounded-br-[var(--radius-corner)] bg-juniper text-white"
                        : "bg-white shadow-sm ring-1 ring-mist"
                    }`}
                  >
                    <h3
                      className={`text-lg font-semibold ${
                        isLast ? "text-white" : "text-juniper"
                      }`}
                    >
                      {layer.role}
                    </h3>
                    <p
                      className={`mt-1 text-[15px] leading-relaxed ${
                        isLast ? "text-white/85" : "text-ink/75"
                      }`}
                    >
                      {layer.sentence}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ── CTA (the page's one clay moment) ───────────────────── */}
      <div className="pb-16 sm:pb-20">
        <MidPageCTA
          heading="Every one of these people works for your family"
          body="Start where every family starts: a free in-home assessment. A care coordinator visits, listens, and writes up a plan — no cost, no pressure, no obligation."
        />
      </div>

      <RecruitBand />
    </>
  );
}

function LeaderCard({
  leader,
  bigCorner,
  banded,
}: {
  leader: Leader;
  bigCorner: boolean;
  banded: boolean;
}) {
  return (
    <div
      className={`rounded-[var(--radius-card)] bg-white p-7 shadow-sm ${
        banded ? "" : "ring-1 ring-mist"
      } ${bigCorner ? "rounded-tl-[var(--radius-corner)]" : ""}`}
    >
      <InitialAvatar name={leader.name} />
      <h3 className="mt-4 text-xl text-juniper">{leader.name}</h3>
      <p className="mt-0.5 text-sm font-semibold uppercase tracking-wider text-juniper/60">
        {leader.title}
      </p>
      <p className="mt-3 text-[15px] leading-relaxed text-ink/75">{leader.bio}</p>
    </div>
  );
}
