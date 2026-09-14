import Link from "next/link";
import { site, hourlyRange, RATE_TBD } from "@/site.config";

/**
 * Published-pricing persona cards (the anti-"Request Personalized Pricing"
 * move). All dollar figures come from site.config placeholders — TODO until
 * real rates are set. One-line persona stories keep it human.
 */

const personas = [
  {
    title: "A few mornings a week",
    price: site.rates.hourlyMin ? `from ${site.rates.hourlyMin}/hr` : RATE_TBD,
    example: site.rates.weeklyExampleMornings
      ? `e.g. 4 hrs, 3 mornings a week ≈ ${site.rates.weeklyExampleMornings}/wk`
      : "e.g. 4 hrs, 3 mornings a week",
    story:
      "Dad's fine, mostly — it's showers, lunch, and someone noticing if something's off.",
    corner: "rounded-tl-[var(--radius-corner)]",
  },
  {
    title: "Help every day",
    price: site.rates.hourlyMin ? `from ${site.rates.hourlyMin}/hr` : RATE_TBD,
    example: site.rates.weeklyExampleDaily
      ? `e.g. 6 hrs every day ≈ ${site.rates.weeklyExampleDaily}/wk`
      : "e.g. 6 hrs every day",
    story:
      "Mom needs a steady hand through mornings and meals — and you need to go back to work.",
    corner: "",
  },
  {
    title: "Around the clock",
    price: site.rates.weeklyExample247 ? `${site.rates.weeklyExample247}/wk` : RATE_TBD,
    example: "24/7 shift care or live-in — we'll help you pick",
    story:
      "After the second fall at night, 'checking in' stopped being enough.",
    corner: "rounded-br-[var(--radius-corner)]",
  },
];

export function PricingPersonas({ showLink = true }: { showLink?: boolean }) {
  return (
    <section className="bg-sage">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-juniper/70">
            Real prices, published
          </p>
          <h2 className="mt-2 text-3xl text-juniper sm:text-4xl">
            What home care actually costs
          </h2>
          <p className="mt-4 text-ink/80">
            {hourlyRange() ? (
              <>
                Most agencies make you sit through a sales call to hear a
                number. Here are ours: {hourlyRange()}, depending on the level
                of care and schedule.
              </>
            ) : (
              <>
                Your rate depends on the level of care and the schedule, so we
                quote it after a free in-home assessment — one flat hourly
                number, in writing, with no obligation to accept it.
              </>
            )}
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {personas.map((p) => (
            <div
              key={p.title}
              className={`flex flex-col rounded-[var(--radius-card)] bg-white p-7 shadow-sm ${p.corner}`}
            >
              <h3 className="text-xl text-juniper">{p.title}</h3>
              <p className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold text-ink">
                {p.price}
              </p>
              <p className="mt-1 text-sm text-ink/60">{p.example}</p>
              <p className="mt-5 flex-1 border-t border-mist pt-4 text-[15px] italic leading-relaxed text-ink/75">
                &ldquo;{p.story}&rdquo;
              </p>
            </div>
          ))}
        </div>

        <p className="mt-8 max-w-2xl text-[15px] text-ink/70">
          Every rate includes scheduling, supervision, and insurance — and
          there are no contracts. You can change or stop care anytime.{" "}
          {showLink && (
            <>
              <Link href="/pricing" className="font-semibold text-juniper underline underline-offset-2">
                See full pricing
              </Link>{" "}
              or{" "}
              <Link href="/how-to-pay" className="font-semibold text-juniper underline underline-offset-2">
                ways to pay for care
              </Link>
              .
            </>
          )}
        </p>
      </div>
    </section>
  );
}
