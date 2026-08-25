import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = readFileSync(join(root, "travesite.jsx"), "utf8");

const rules = [
  [/\.pair-grid > div img \{[^}]+\}/, "pair-grid journal photos"],
  [/\.block-feature img \{[^}]+\}/, "feature journal photos"],
  [/\.single-image \{[^}]+\}/, "single journal photos"],
  [/\.recents-feed-entry img \{[^}]+\}/, "recents feed photos"],
];

const failures = [];
for (const [pattern, label] of rules) {
  const match = source.match(pattern);
  if (!match) {
    failures.push(`Missing CSS rule for ${label}`);
    continue;
  }
  if (!/height:\s*auto/.test(match[0])) {
    failures.push(
      `${label} must set height: auto so HTML width/height attributes cannot stretch the photo (PR #1 bug). Found:\n${match[0]}`
    );
  }
}

if (failures.length) {
  console.error(failures.join("\n\n"));
  process.exit(1);
}

console.log("css-height-auto: journal/recents photo rules set height: auto");
