import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";

/**
 * A real photograph when one has been generated for this slot, and the styled
 * placeholder when one hasn't.
 *
 * The point of the fallback is that photography and code ship independently:
 * a page referencing a slot that doesn't exist yet renders its brief instead
 * of a broken image, and the build never fails over a missing file. Drop a
 * `<slug>.webp` into public/photos and the same page starts showing it.
 *
 * Server-only — it stats the filesystem at render time, which under static
 * export means build time.
 */

const DIR = path.join(process.cwd(), "public", "photos");

// Read once per build rather than statting per page: [town] and [slug] render
// thousands of times and would otherwise hammer the filesystem.
const available: ReadonlySet<string> = (() => {
  try {
    return new Set(
      fs.readdirSync(DIR)
        .filter((f) => f.endsWith(".webp"))
        .map((f) => f.replace(/\.webp$/, "")),
    );
  } catch {
    return new Set<string>(); // no photos directory yet — all slots fall back
  }
})();

export function hasPhoto(slug: string): boolean {
  return available.has(slug);
}

const cornerClass = {
  tl: "rounded-tl-[var(--radius-corner)]",
  tr: "rounded-tr-[var(--radius-corner)]",
  bl: "rounded-bl-[var(--radius-corner)]",
  br: "rounded-br-[var(--radius-corner)]",
  none: "",
} as const;

interface PhotoProps {
  /** File basename in public/photos, without extension. */
  slug: string;
  /** Alt text — the same sentence that briefed the shot. */
  intent: string;
  /** Shown inside the placeholder when the photo is missing. */
  label: string;
  bigCorner?: keyof typeof cornerClass;
  className?: string;
  /** Set on the one image above the fold so it isn't lazy-loaded. */
  priority?: boolean;
  /** Matches the container width so the browser picks a sane source size. */
  sizes?: string;
}

export function Photo({
  slug,
  intent,
  label,
  bigCorner = "br",
  className = "",
  priority = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
}: PhotoProps) {
  if (!hasPhoto(slug)) {
    return (
      <PhotoPlaceholder intent={intent} label={label} bigCorner={bigCorner} className={className} />
    );
  }
  return (
    <div
      className={`relative overflow-hidden rounded-[var(--radius-card)] ${cornerClass[bigCorner]} bg-sand ${className}`}
    >
      <Image
        src={`/photos/${slug}.webp`}
        alt={intent}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}
