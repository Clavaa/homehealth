/**
 * Styled stand-in for real photography. Each instance documents the exact
 * shot to source (see `intent`) so the photo shoot has a shopping list.
 *
 * Style Bible photography rules: caregiver + client TOGETHER mid-interaction,
 * warm window light, lived-in homes, caregiver in juniper polo; adult daughter
 * in 1–2 shots. Never seniors alone/frail, never stock joy, never scrubs.
 */
interface PhotoPlaceholderProps {
  /** The alt text the real image should ship with — written now, on purpose. */
  intent: string;
  /** Short label rendered inside the placeholder so slots are identifiable. */
  label: string;
  /** Which corner gets the oversized 80px radius (the signature move). */
  bigCorner?: "tl" | "tr" | "bl" | "br" | "none";
  className?: string;
}

const cornerClass = {
  tl: "rounded-tl-[var(--radius-corner)]",
  tr: "rounded-tr-[var(--radius-corner)]",
  bl: "rounded-bl-[var(--radius-corner)]",
  br: "rounded-br-[var(--radius-corner)]",
  none: "",
} as const;

export function PhotoPlaceholder({
  intent,
  label,
  bigCorner = "br",
  className = "",
}: PhotoPlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={intent}
      className={`relative overflow-hidden rounded-[var(--radius-card)] ${cornerClass[bigCorner]} bg-gradient-to-br from-sage via-sand to-sage ${className}`}
    >
      {/* Soft "window light" wash so the placeholder reads warm, not empty */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(233,196,106,0.35),transparent_60%)]" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
        <svg
          aria-hidden="true"
          viewBox="0 0 48 48"
          className="h-10 w-10 text-juniper/40"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="6" y="10" width="36" height="28" rx="4" />
          <circle cx="18" cy="21" r="4" />
          <path d="M6 34l10-8 8 6 8-9 10 11" />
        </svg>
        <p className="text-sm font-medium text-juniper/60">{label}</p>
        <p className="max-w-xs text-xs leading-snug text-juniper/40">
          Photo slot — {intent}
        </p>
      </div>
    </div>
  );
}
