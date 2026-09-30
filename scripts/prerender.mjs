import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { RECENTS } from "../recents.js";
import { crawlablePages, renderSitemap } from "../journalRoutes.js";
import { readTrips } from "./readTrips.mjs";
import { applyHead } from "./htmlShell.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = join(root, "dist");
const trips = readTrips();
const pages = crawlablePages({ trips, recents: RECENTS });
const tripSlugs = trips.map((trip) => trip.slug);
const sitemap = renderSitemap(pages);

writeFileSync(join(root, "public/sitemap.xml"), sitemap);

const titles = new Set();
const locs = new Set();
for (const page of pages) {
  if (titles.has(page.head.title)) {
    throw new Error(`duplicate document title: ${page.head.title}`);
  }
  if (locs.has(page.loc)) throw new Error(`duplicate canonical: ${page.loc}`);
  titles.add(page.head.title);
  locs.add(page.loc);
  if (page.loc.includes("#")) throw new Error(`hash canonical: ${page.loc}`);
  if (page.suffix === "travel" || page.suffix.startsWith("travel/")) {
    throw new Error(`refusing to emit dist/travel for ${page.suffix}`);
  }
}

if (process.argv.includes("--sitemap-only")) {
  console.log(`sitemap: wrote ${pages.length} locs to public/sitemap.xml`);
  process.exit(0);
}

const templatePath = join(distDir, "index.html");
if (!existsSync(templatePath)) {
  throw new Error("dist/index.html missing — run vite build before prerender");
}
const template = readFileSync(templatePath, "utf8");

for (const page of pages) {
  const html = applyHead(template, page.head, { tripSlugs });
  const rel = page.suffix ? join(page.suffix, "index.html") : "index.html";
  const out = join(distDir, rel);
  if (out.startsWith(join(distDir, "travel") + "/") || out === join(distDir, "travel")) {
    throw new Error(`refusing to write ${out}`);
  }
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
}

writeFileSync(join(distDir, "sitemap.xml"), sitemap);
if (existsSync(join(distDir, "travel"))) {
  throw new Error("prerender emitted dist/travel; that conflicts with the Vercel rewrite");
}

console.log(
  `prerender: ${pages.length} HTML shells (home + ${trips.length} trips + recents + ${RECENTS.length} entries); sitemap lastmod synced`
);
