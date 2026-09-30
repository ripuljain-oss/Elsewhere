import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { RECENTS } from "../recents.js";
import {
  buildHead,
  canonicalUrl,
  crawlablePages,
  hashRedirectScript,
  isJournalRoot,
  journalPath,
  legacyHashToPath,
  parseJournalPath,
  slugify,
} from "../journalRoutes.js";
import { readTrips } from "../scripts/readTrips.mjs";
import { applyHead } from "../scripts/htmlShell.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
const fail = (message) => failures.push(message);

const KNOWN_TRIP_SLUGS = [
  "rocky-mountain-national-park",
  "guatemala",
  "merida",
  "olympic-national-park",
  "panama",
  "roatan",
  "portugal",
  "mexico-city",
];

const trips = readTrips();
if (trips.map((trip) => trip.slug).join(",") !== KNOWN_TRIP_SLUGS.join(",")) {
  fail(`trip slugs drifted from the known journal: ${trips.map((trip) => trip.slug).join(", ")}`);
}
for (const trip of trips) {
  if (!trip.location || !trip.image || !trip.country) {
    fail(`trip ${trip.slug} is missing location, country, or image`);
  }
  if (slugify(trip.id) !== trip.slug) fail(`slugify mismatch for ${trip.id}`);
}

const cases = [
  ["/travel/", { page: "home" }],
  ["/travel", { page: "home" }],
  ["/travel/index.html", { page: "home" }],
  ["/travel/merida", { page: "trip", slug: "merida" }],
  ["/travel/merida/", { page: "trip", slug: "merida" }],
  ["/travel/recents", { page: "recents" }],
  ["/travel/recents/", { page: "recents" }],
  ["/travel/recents/estes-park-elk-window", { page: "recent-detail", slug: "estes-park-elk-window" }],
  ["/travel/recents/estes-park-elk-window/", { page: "recent-detail", slug: "estes-park-elk-window" }],
  ["/travel/Assets/RMNP/DSC_3271.jpg", { page: "not-found" }],
  ["/guatemala", { page: "not-found" }],
];
for (const [path, expected] of cases) {
  const parsed = parseJournalPath(path);
  if (parsed.page !== expected.page || parsed.slug !== expected.slug) {
    fail(`parseJournalPath(${path}) => ${JSON.stringify(parsed)}, expected ${JSON.stringify(expected)}`);
  }
}

if (!isJournalRoot("/travel") || !isJournalRoot("/travel/") || isJournalRoot("/travel/merida")) {
  fail("isJournalRoot did not treat only /travel as the journal root");
}

const hashCases = [
  ["#merida", "/travel/merida"],
  ["#/merida", "/travel/merida"],
  ["#recents", "/travel/recents"],
  ["#recents/", "/travel/recents"],
  ["#recents/estes-park-elk-window", "/travel/recents/estes-park-elk-window"],
  ["#journal-main", null],
  ["#not-a-trip", null],
  ["#recents/a/b", null],
  ["", null],
];
for (const [hash, expected] of hashCases) {
  const got = legacyHashToPath(hash, KNOWN_TRIP_SLUGS);
  if (got !== expected) fail(`legacyHashToPath(${hash}) => ${got}, expected ${expected}`);
}
if (journalPath() !== "/travel/" || journalPath("recents") !== "/travel/recents") {
  fail("journalPath did not preserve the /travel base");
}
if (canonicalUrl("merida") !== "https://jainfam.net/travel/merida") {
  fail("canonicalUrl dropped the origin or base");
}

const pages = crawlablePages({ trips, recents: RECENTS });
if (pages.length !== 1 + trips.length + 1 + RECENTS.length) {
  fail(`expected ${1 + trips.length + 1 + RECENTS.length} crawlable pages, got ${pages.length}`);
}
if (pages[0].loc !== "https://jainfam.net/travel/") fail("homepage must be the first crawlable URL");
const titles = new Set();
for (const page of pages) {
  if (titles.has(page.head.title)) fail(`duplicate title: ${page.head.title}`);
  titles.add(page.head.title);
  if (page.head.canonical !== page.loc) fail(`canonical drifted for ${page.loc}`);
  if (page.loc.includes("#")) fail(`hash loc: ${page.loc}`);
  if (!page.head.description || !page.head.image) fail(`missing description or image for ${page.loc}`);
  if (!page.head.image.startsWith("https://jainfam.net/travel/")) {
    fail(`image left the journal origin: ${page.head.image}`);
  }
}
const cafe = pages.find((page) => page.suffix === "recents/cafe-tabeeb-south-loop");
if (!cafe || !cafe.head.title.includes("Wells")) {
  fail(`cafe title dropped the street after the "S." abbreviation: ${cafe?.head.title}`);
}

const indexHtml = readFileSync(join(root, "index.html"), "utf8");
if (!indexHtml.includes('id="legacy-hash-redirect"')) fail("index.html is missing the hash redirect script");
if (!indexHtml.includes("G-1P8LT831MG")) fail("index.html is missing GA4");
for (const slug of KNOWN_TRIP_SLUGS) {
  if (!indexHtml.includes(`"url": "https://jainfam.net/travel/${slug}"`)) {
    fail(`index.html JSON-LD still missing path URL for ${slug}`);
  }
  if (indexHtml.includes(`https://jainfam.net/travel/#${slug}`)) {
    fail(`index.html still advertises a hash URL for ${slug}`);
  }
}
const redirect = hashRedirectScript(KNOWN_TRIP_SLUGS);
if (!indexHtml.includes(redirect)) {
  fail("index.html hash redirect script drifted from hashRedirectScript()");
}

const shell = applyHead(indexHtml, pages.find((page) => page.suffix === "merida").head, {
  tripSlugs: KNOWN_TRIP_SLUGS,
});
if (!shell.includes("<title>Mérida — Elsewhere</title>")) fail("applyHead did not set the Mérida title");
if (!shell.includes('href="https://jainfam.net/travel/merida"')) fail("applyHead did not set the Mérida canonical");
if (!shell.includes("G-1P8LT831MG")) fail("applyHead stripped gtag");
if (shell.includes("#merida")) fail("applyHead left a #merida fragment");
if ((shell.match(/id="legacy-hash-redirect"/g) || []).length !== 1) {
  fail("applyHead duplicated or dropped the hash redirect");
}
const home = buildHead({ page: "home", trips, recents: RECENTS });
const recentsHead = buildHead({ page: "recents", trips, recents: RECENTS });
if (home.title === recentsHead.title || home.description === recentsHead.description) {
  fail("homepage and recents shells share title or description");
}

if (failures.length) {
  console.error(failures.join("\n\n"));
  process.exit(1);
}

console.log(`routes: ${pages.length} crawlable paths; hash redirects and head shells match`);
