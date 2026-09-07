/**
 * Juniper at Home logo — a juniper sprig mark beside the wordmark.
 *
 * The mark: a curved sprig with needle pairs swept toward the tip and a
 * three-berry cluster nested in the lower crook. Sprig in juniper, berries
 * in clay (default), or white sprig + butter berries when `reversed` for
 * the dark footer band.
 *
 * The wordmark is real text (accessible, crisp at any size) set in the
 * site's Fraunces 600 — "Juniper" in juniper green, "at Home" in Fraunces
 * italic clay, echoing the italic-clay-word hero device.
 */

type LogoProps = {
  /** White/butter version for dark bands (footer). */
  reversed?: boolean;
  className?: string;
};

export function Logo({ reversed = false, className = "" }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <SprigMark reversed={reversed} />
      <span className="whitespace-nowrap font-[family-name:var(--font-display)] text-[22px] font-semibold leading-none tracking-[-0.01em]">
        <span className={reversed ? "text-white" : "text-juniper"}>
          Juniper
        </span>{" "}
        <em className={reversed ? "text-butter" : "text-clay"}>
          at Home
        </em>
      </span>
    </span>
  );
}

export function SprigMark({
  reversed = false,
  className = "h-10 w-10 shrink-0",
}: LogoProps) {
  const sprig = reversed ? "#ffffff" : "#1e4d45"; // juniper
  const berry = reversed ? "#e9c46a" : "#c96f4a"; // butter / clay
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" className={className}>
      <g fill="none" stroke={sprig} strokeWidth="2.2" strokeLinecap="round">
        {/* main stem */}
        <path d="M16 45 C19 36 22.5 27 27 19 C29 15.4 31.2 11.4 34 7" />
        {/* needle pairs, swept toward the tip */}
        <path d="M33.2 8.2 L29.8 3.6" />
        <path d="M33.2 8.2 L38.4 5.6" />
        <path d="M30.8 12.4 L26.6 8.6" />
        <path d="M30.8 12.4 L36.6 10.4" />
        <path d="M28.5 16.4 L23.8 13" />
        <path d="M28.5 16.4 L34.6 14.6" />
        <path d="M26.2 20.6 L21.2 17.6" />
        <path d="M26.2 20.6 L32.2 19.2" />
        <path d="M24.2 24.8 L19 22.4" />
        <path d="M22.3 29.4 L17 27.6" />
        <path d="M20.7 33.8 L15.4 32.6" />
      </g>
      {/* berry cluster nested in the lower-right crook */}
      <g fill={berry}>
        <circle cx="30.5" cy="31.5" r="4.3" />
        <circle cx="37" cy="27.5" r="3.1" />
        <circle cx="36" cy="36.5" r="2.4" />
      </g>
    </svg>
  );
}
