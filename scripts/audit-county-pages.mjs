#!/usr/bin/env node
/**
 * Audits the built county pages. This content is generated for 3,144 URLs from
 * four datasets, so a single bad branch ships thousands of broken sentences —
 * these are the invariants that catch that before it does.
 *
 * Run after `npm run build`:  node scripts/audit-county-pages.mjs
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const BUILT = join(ROOT, ".next", "server", "app", "home-care");

if (!existsSync(BUILT)) {
  console.error("No build output at .next/server/app/home-care — run `npm run build` first.");
  process.exit(1);
}

const facts = JSON.parse(readFileSync(join(ROOT, "data", "county-facts.json"), "utf8"));
const counties = JSON.parse(readFileSync(join(ROOT, "data", "counties.json"), "utf8"));

/** Body text only — the shared header/footer is not what we're auditing. */
function body(html) {
  let s = html.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, "");
  const i = s.indexOf("Home care ·");
  const j = s.indexOf("Bordering");
  if (i > 0 && j > i) s = s.slice(i, j);
  return s
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ");
}

/** What each state calls its county-equivalents — must match lib/county-facts. */
const NOUN = {
  Louisiana: /\bcount(y|ies)\b/,
  Alaska: /\bcount(y|ies)\b/,
  Connecticut: /\bcount(y|ies)\b/,
};

const failures = [];
const fail = (page, msg) => failures.push(`${page}: ${msg}`);

let pages = 0;
const stateDirs = readdirSync(BUILT, { withFileTypes: true }).filter((d) => d.isDirectory());

// state slug -> display name
const slugToState = {};
for (const name of Object.keys(counties)) {
  slugToState[name.toLowerCase().replace(/[^a-z0-9]+/g, "-")] = name;
}

for (const dir of stateDirs) {
  const stateName = slugToState[dir.name];
  if (!stateName) continue; // sitemap dirs etc.
  const files = readdirSync(join(BUILT, dir.name)).filter((f) => f.endsWith(".html"));
  for (const file of files) {
    pages++;
    const page = `${dir.name}/${file.replace(/\.html$/, "")}`;
    const text = body(readFileSync(join(BUILT, dir.name, file), "utf8"));

    // 1. No leaked template artifacts.
    for (const bad of ["undefined", "NaN", "[object", "${", "null "]) {
      if (text.includes(bad)) fail(page, `contains "${bad}"`);
    }

    // 2. No unresolved ordinal weirdness from the rank helpers.
    if (/\bfirst-(oldest|highest)\b/.test(text)) fail(page, 'says "first-oldest/highest"');

    // 3. The right noun for the state's county-equivalents.
    const wrong = NOUN[stateName];
    if (wrong && wrong.test(text)) fail(page, `uses "county" in ${stateName}`);

    // 4. Singular/plural agreement on the generated counts.
    if (/\b1 of them carry\b/.test(text)) fail(page, 'says "1 of them carry"');
    if (/\b1 (agencies|nursing homes|certified nursing homes) \b/.test(text))
      fail(page, "plural noun after 1");

    // 5. Anything that made it to the page should be attributed.
    if (!text.includes("CDC/ATSDR") && /in numbers/.test(text))
      fail(page, "stat band without source line");

    // 6. Substance: these pages exist to be more than a name swap.
    const words = text.split(" ").length;
    if (words < 450) fail(page, `only ${words} words of body copy`);
  }
}

// 7. Data-level invariant: a stated share and headcount must reconcile.
let mismatched = 0;
for (const d of Object.values(facts)) {
  if (d.popTotal > 0 && d.pop65 !== undefined && d.pct65 !== undefined) {
    if (Math.abs((d.pop65 / d.popTotal) * 100 - d.pct65) > 0.15) mismatched++;
  }
}
if (mismatched) failures.push(`county-facts.json: ${mismatched} counties where pct65 ≠ pop65/popTotal`);

console.log(`audited ${pages} county pages`);
if (failures.length) {
  console.error(`\n${failures.length} problem(s):`);
  for (const f of failures.slice(0, 40)) console.error("  ✗ " + f);
  if (failures.length > 40) console.error(`  … and ${failures.length - 40} more`);
  process.exit(1);
}
console.log("all invariants hold ✓");
