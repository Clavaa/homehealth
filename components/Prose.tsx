import { Fragment } from "react";

/**
 * Renders a generated paragraph, honoring the one bit of markup the copy in
 * lib/county-narrative.ts uses: **bold** for the distinction a reader most
 * needs to catch. Everything else stays plain text — this is deliberately not
 * a markdown renderer, so generated copy can never inject markup.
 */
export function Prose({ children, className }: { children: string; className?: string }) {
  const parts = children.split(/\*\*(.+?)\*\*/g);
  return (
    <p className={className}>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold text-juniper">
            {part}
          </strong>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </p>
  );
}
