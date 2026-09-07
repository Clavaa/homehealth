import { initialsOf } from "@/data/leadership";

/**
 * Styled initial avatar — the site's stand-in for people photos (we never
 * publish photos of people on leadership pages). Circle, sage background,
 * juniper initials set in the display face.
 */
export function InitialAvatar({
  name,
  size = "md",
  className = "",
}: {
  name: string;
  size?: "md" | "lg";
  className?: string;
}) {
  const sizes = {
    md: "h-16 w-16 text-xl",
    lg: "h-20 w-20 text-2xl",
  } as const;

  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full bg-sage font-[family-name:var(--font-display)] font-semibold text-juniper ring-1 ring-juniper/10 ${sizes[size]} ${className}`}
    >
      {initialsOf(name)}
    </span>
  );
}
