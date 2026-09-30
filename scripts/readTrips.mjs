import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { slugify } from "../journalRoutes.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function field(chunk, key) {
  const match = chunk.match(new RegExp(`^\\s*${key}:\\s*"((?:\\\\.|[^"\\\\])*)"`, "m"));
  if (!match) return "";
  return JSON.parse(`"${match[1]}"`);
}

export function parseTrips(source) {
  const start = source.indexOf("const RAW_TRIPS = [");
  if (start < 0) throw new Error("RAW_TRIPS not found in travesite.jsx");
  const end = source.indexOf("\n];", start);
  if (end < 0) throw new Error("RAW_TRIPS array did not close");
  const body = source.slice(start, end);
  const trips = [];
  for (const chunk of body.split(/\n  \{/)) {
    const id = field(chunk, "id");
    if (!id) continue;
    const cover = field(chunk, "coverImage");
    const images = [...chunk.matchAll(/^\s*"(\/Assets\/[^"]+)"/gm)].map((match) => match[1]);
    trips.push({
      id,
      slug: slugify(id),
      location: field(chunk, "location"),
      country: field(chunk, "country"),
      year: field(chunk, "year"),
      tagline: field(chunk, "tagline"),
      intro: field(chunk, "intro"),
      image: cover || images[0] || "",
    });
  }
  if (!trips.length) throw new Error("parsed zero trips from travesite.jsx");
  return trips;
}

export function readTrips(file = join(root, "travesite.jsx")) {
  return parseTrips(readFileSync(file, "utf8"));
}
