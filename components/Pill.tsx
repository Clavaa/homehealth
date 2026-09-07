import Link from "next/link";
import type { ReactNode } from "react";

/**
 * The site's one button shape: a sentence-case pill.
 * Variants map to the Style Bible:
 *  - clay:          THE accent. Use once per viewport, for the primary CTA.
 *  - juniper:       filled juniper — calm primary when clay is already spent.
 *  - juniperOutline:outlined juniper — secondary (usually the phone number).
 *  - whiteOutline:  for juniper bands only (recruiting band — never clay).
 */
const variants = {
  clay: "bg-clay text-white hover:bg-clay-deep",
  juniper: "bg-juniper text-white hover:bg-juniper-deep",
  juniperOutline:
    "border-2 border-juniper text-juniper hover:bg-juniper hover:text-white",
  whiteOutline:
    "border-2 border-white/80 text-white hover:bg-white hover:text-juniper",
} as const;

const sizes = {
  md: "px-6 py-3 text-[16px]",
  lg: "px-8 py-4 text-[17px]",
} as const;

interface PillProps {
  href: string;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  children: ReactNode;
  className?: string;
}

export function Pill({
  href,
  variant = "juniper",
  size = "md",
  children,
  className = "",
}: PillProps) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors ${variants[variant]} ${sizes[size]} ${className}`;
  if (href.startsWith("tel:") || href.startsWith("mailto:") || href.startsWith("#")) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
