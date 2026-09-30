import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { RECENTS } from "../recents.js";
import { crawlablePages } from "../journalRoutes.js";
import { readTrips } from "../scripts/readTrips.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];

function fail(message) {
  failures.push(message);
}

function read(rel) {
  return readFileSync(join(root, rel), "utf8");
}

function locsIn(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
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

const pages = crawlablePages({ trips: readTrips(), recents: RECENTS });
const expected = pages.map((page) => page.loc);

const sitemap = read("public/sitemap.xml");
if (!sitemap.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')) {
  fail("sitemap.xml is missing the urlset schema xmlns");
}
if (!/<urlset[\s>]/.test(sitemap) || !sitemap.includes("</urlset>")) {
  fail("sitemap.xml must be a urlset document");
}

const locs = locsIn(sitemap);
if (locs[0] !== "https://jainfam.net/travel/") {
  fail(`homepage loc must be first; got ${locs[0] || "(none)"}`);
}
if (locs.join("\n") !== expected.join("\n")) {
  fail(
    `sitemap locs drifted from crawlable paths.\nexpected (${expected.length}):\n${expected.join("\n")}\n\nactual (${locs.length}):\n${locs.join("\n")}`
  );
}
for (const loc of locs) {
  if (!loc.startsWith("https://jainfam.net/travel/")) {
    fail(`unexpected sitemap loc outside the journal: ${loc}`);
  }
  if (loc.includes("#")) {
    fail(`hash-fragment loc is not a crawlable page: ${loc}`);
  }
}
if (!sitemap.includes("<lastmod>2026-09-30</lastmod>")) {
  fail("sitemap lastmod was not updated for the path-route launch");
}

if (existsSync(join(root, "dist"))) {
  const distSitemap = join(root, "dist/sitemap.xml");
  const distRobots = join(root, "dist/robots.txt");
  if (!existsSync(distSitemap)) {
    fail("dist/sitemap.xml missing after build — Vite must copy public/sitemap.xml");
  } else {
    const built = readFileSync(distSitemap, "utf8");
    const builtLocs = locsIn(built);
    if (builtLocs.join("\n") !== expected.join("\n")) {
      fail(`dist/sitemap.xml locs drifted (${builtLocs.length} vs ${expected.length})`);
    }
    if (built.includes("#")) {
      fail("dist/sitemap.xml still lists hash-fragment URLs");
    }
  }
  if (!existsSync(distRobots)) {
    fail("dist/robots.txt missing after build");
  } else if (!readFileSync(distRobots, "utf8").includes("https://jainfam.net/travel/sitemap.xml")) {
    fail("dist/robots.txt must advertise https://jainfam.net/travel/sitemap.xml");
  }
  // A dist/travel/ copy fights Vercel: rewrite /travel/:path* → /:path* plus a
  // real dist/travel directory can hang production alias assignment.
  // Shells live at dist/<slug>/index.html so that rewrite serves them.
  if (existsSync(join(root, "dist/travel"))) {
    fail("do not emit dist/travel/; Vercel rewrites /travel/* onto dist root");
  }

  const shells = [
    ["index.html", "Elsewhere, by Ripul Jain", "https://jainfam.net/travel/"],
    ["merida/index.html", "Mérida — Elsewhere", "https://jainfam.net/travel/merida"],
    ["recents/index.html", "Recents — Elsewhere", "https://jainfam.net/travel/recents"],
    [
      "recents/hancock-water-tower-skylight/index.html",
      "875 North Michigan Avenue",
      "https://jainfam.net/travel/recents/hancock-water-tower-skylight",
    ],
  ];
  const seenTitles = new Set();
  for (const [rel, titlePart, canonical] of shells) {
    const file = join(root, "dist", rel);
    if (!existsSync(file)) {
      fail(`missing prerendered shell dist/${rel}`);
      continue;
    }
    const html = readFileSync(file, "utf8");
    if (!html.includes(`<title>`) || !html.includes(titlePart)) {
      fail(`dist/${rel} title does not include ${titlePart}`);
    }
    if (!html.includes(`href="${canonical}"`)) {
      fail(`dist/${rel} is missing canonical ${canonical}`);
    }
    if (!html.includes("G-1P8LT831MG")) fail(`dist/${rel} dropped the GA4 gtag`);
    if (html.includes("#merida") || html.includes("#recents")) {
      fail(`dist/${rel} still contains a hash route`);
    }
    if (!html.includes("/travel/_assets/")) {
      fail(`dist/${rel} is missing the absolute /travel/_assets bundle (nested shells would 404 a relative script)`);
    }
    if (rel.endsWith("/index.html") && rel !== "index.html") {
      const flat = rel.replace(/\/index\.html$/, ".html");
      const flatFile = join(root, "dist", flat);
      if (!existsSync(flatFile)) {
        fail(`missing Vite-preview shell dist/${flat} (preview rewrites /path to /path.html)`);
      } else if (!readFileSync(flatFile, "utf8").includes(titlePart)) {
        fail(`dist/${flat} title does not include ${titlePart}`);
      }
    }
    const title = html.match(/<title>([^<]*)<\/title>/)?.[1] || "";
    if (seenTitles.has(title)) fail(`dist shell title is not unique: ${title}`);
    seenTitles.add(title);
  }
}

if (failures.length) {
  console.error(failures.join("\n\n"));
  process.exit(1);
}

console.log(`sitemap: ${expected.length} crawlable locs under https://jainfam.net/travel/`);
