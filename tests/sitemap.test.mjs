import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];

function fail(message) {
  failures.push(message);
}

function read(rel) {
  return readFileSync(join(root, rel), "utf8");
}

const robots = read("public/robots.txt");
if (!/Sitemap:\s*https:\/\/jainfam\.net\/travel\/sitemap\.xml\s*$/m.test(robots)) {
  fail(
    `robots.txt must advertise https://jainfam.net/travel/sitemap.xml (the static path under base /travel/). Found:\n${robots}`
  );
}
if (/Sitemap:\s*https:\/\/jainfam\.net\/sitemap\.xml\s*$/m.test(robots)) {
  fail("robots.txt still points at the root /sitemap.xml URL");
}

const sitemap = read("public/sitemap.xml");
if (!sitemap.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')) {
  fail("sitemap.xml is missing the urlset schema xmlns");
}
if (!/<urlset[\s>]/.test(sitemap) || !sitemap.includes("</urlset>")) {
  fail("sitemap.xml must be a urlset document");
}
if (!sitemap.includes("<loc>https://jainfam.net/travel/</loc>")) {
  fail("sitemap.xml must include the journal homepage https://jainfam.net/travel/");
}

const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (locs[0] !== "https://jainfam.net/travel/") {
  fail(`homepage loc must be first; got ${locs[0] || "(none)"}`);
}
for (const loc of locs) {
  if (!loc.startsWith("https://jainfam.net/travel/")) {
    fail(`unexpected sitemap loc outside the journal: ${loc}`);
  }
}

if (existsSync(join(root, "dist"))) {
  const distSitemap = join(root, "dist/sitemap.xml");
  const distRobots = join(root, "dist/robots.txt");
  if (!existsSync(distSitemap)) {
    fail("dist/sitemap.xml missing after build — Vite must copy public/sitemap.xml");
  } else {
    const built = readFileSync(distSitemap, "utf8");
    if (!built.includes("<loc>https://jainfam.net/travel/</loc>")) {
      fail("dist/sitemap.xml is missing the homepage loc");
    }
  }
  if (!existsSync(distRobots)) {
    fail("dist/robots.txt missing after build");
  } else if (!readFileSync(distRobots, "utf8").includes("https://jainfam.net/travel/sitemap.xml")) {
    fail("dist/robots.txt must advertise https://jainfam.net/travel/sitemap.xml");
  }
  // A dist/travel/ copy fights Vercel: rewrite /travel/:path* → /:path* plus a
  // real dist/travel directory can hang production alias assignment.
  if (existsSync(join(root, "dist/travel"))) {
    fail("do not emit dist/travel/; Vercel rewrites /travel/* onto dist root");
  }
}

if (failures.length) {
  console.error(failures.join("\n\n"));
  process.exit(1);
}

console.log("sitemap: robots points at /travel/sitemap.xml; urlset includes homepage");
