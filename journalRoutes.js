// Shared URL scheme for Elsewhere. Used by the client router and the
// build-time prerender so canonicals, titles, and the sitemap cannot drift.

export const SITE_ORIGIN = "https://jainfam.net";
export const JOURNAL_BASE = "/travel";
export const SITEMAP_LASTMOD = "2026-09-30";

export const HOME_TITLE = "Elsewhere, by Ripul Jain";
export const HOME_DESCRIPTION =
  "A travel photo journal by Ripul Jain — destinations, recents, and field notes from the road.";
export const RECENTS_DESCRIPTION =
  "Recent travel photos, field notes, and visual fragments by Ripul Jain.";

export const DEFAULT_IMAGE = `${SITE_ORIGIN}/travel/Assets/RMNP/DSC_3271.jpg`;
const AUTHOR_ID = `${SITE_ORIGIN}/travel/#author`;
const WEBSITE_ID = `${SITE_ORIGIN}/travel/#website`;

export const slugify = (id) =>
  String(id)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export function journalPath(suffix = "") {
  const extra = String(suffix || "").replace(/^\/+/, "").replace(/\/+$/, "");
  if (!extra) return `${JOURNAL_BASE}/`;
  return `${JOURNAL_BASE}/${extra}`;
}

export function canonicalUrl(suffix = "") {
  return `${SITE_ORIGIN}${journalPath(suffix)}`;
}

export function absoluteAsset(assetPath) {
  if (!assetPath) return DEFAULT_IMAGE;
  if (/^https?:\/\//i.test(assetPath)) return assetPath;
  const path = assetPath.startsWith(`${JOURNAL_BASE}/`)
    ? assetPath
    : `${JOURNAL_BASE}/${String(assetPath).replace(/^\/+/, "")}`;
  return `${SITE_ORIGIN}${path}`;
}

export function normalizePathname(pathname) {
  let path = String(pathname || "/").replace(/\/index\.html$/, "");
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  return path || "/";
}

export function isJournalRoot(pathname) {
  return normalizePathname(pathname) === JOURNAL_BASE;
}

export function parseJournalPath(pathname) {
  const path = normalizePathname(pathname);
  if (path === JOURNAL_BASE) return { page: "home" };
  const prefix = `${JOURNAL_BASE}/`;
  if (!path.startsWith(prefix)) return { page: "not-found" };
  let rest = path.slice(prefix.length);
  try {
    rest = decodeURIComponent(rest);
  } catch {
    return { page: "not-found" };
  }
  if (!rest || rest.includes("..")) return { page: "not-found" };
  if (rest === "recents") return { page: "recents" };
  if (rest.startsWith("recents/")) {
    const slug = rest.slice("recents/".length);
    if (!slug || slug.includes("/")) return { page: "not-found" };
    return { page: "recent-detail", slug };
  }
  if (rest.includes("/")) return { page: "not-found" };
  return { page: "trip", slug: rest };
}

export function legacyHashToPath(hash, tripSlugs) {
  const raw = String(hash || "")
    .replace(/^#/, "")
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");
  if (!raw || raw === "journal-main") return null;
  if (raw === "recents") return journalPath("recents");
  if (raw.startsWith("recents/")) {
    const slug = raw.slice("recents/".length);
    if (!slug || slug.includes("/")) return null;
    return journalPath(`recents/${slug}`);
  }
  if (tripSlugs.includes(raw)) return journalPath(raw);
  return null;
}

export function hashRedirectScript(tripSlugs) {
  const list = JSON.stringify(tripSlugs);
  return `<script id="legacy-hash-redirect">
(function () {
  var trips = ${list};
  var path = (location.pathname || "/").replace(/\\/index\\.html$/, "").replace(/\\/$/, "") || "/";
  if (path !== "/travel") return;
  var raw = (location.hash || "").replace(/^#/, "").replace(/^\\/+/, "").replace(/\\/+$/, "");
  if (!raw || raw === "journal-main") return;
  var dest = null;
  if (raw === "recents") dest = "/travel/recents";
  else if (raw.indexOf("recents/") === 0) {
    var slug = raw.slice("recents/".length);
    if (slug && slug.indexOf("/") === -1) dest = "/travel/recents/" + slug;
  } else if (trips.indexOf(raw) !== -1) dest = "/travel/" + raw;
  if (!dest) return;
  location.replace(dest + location.search);
})();
</script>`;
}

export function sortRecents(recents) {
  return recents
    .map((entry, index) => ({ entry, index }))
    .sort((a, b) => b.entry.date.localeCompare(a.entry.date) || a.index - b.index)
    .map(({ entry }) => entry);
}

export function tripImage(trip) {
  return trip?.image || trip?.coverImage || trip?.images?.[0] || "";
}

export function leadSentence(text) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  // Hide periods in single-letter abbreviations ("720 S. Wells") so the title
  // stays a real sentence. Avoid lookbehind — it is a syntax error in older browsers.
  const marked = clean.replace(/\b([A-Z])\./g, "$1\u0000");
  const match = marked.match(/^.*?[.!?](?=\s|$)/);
  return (match ? match[0] : marked).replace(/\u0000/g, ".").trim();
}

export function describeTrip(trip) {
  const lead = trip.tagline || trip.intro || "";
  return `${trip.location}, ${trip.country} (${trip.year}): ${lead}`.trim();
}

function personNode() {
  return {
    "@type": "Person",
    "@id": AUTHOR_ID,
    name: "Ripul Jain",
    url: canonicalUrl(),
    jobTitle: "Travel Photographer & Writer",
  };
}

function websiteNode() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: "Elsewhere",
    url: canonicalUrl(),
    description: HOME_DESCRIPTION,
    inLanguage: "en-US",
    publisher: { "@id": AUTHOR_ID },
  };
}

function breadcrumb(items) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildHead({ page, trip, recent, trips = [], recents = [] }) {
  const sortedRecents = sortRecents(recents);
  const homeTrip = trips.find((item) => item.slug === "rocky-mountain-national-park") || trips[0];
  let title = HOME_TITLE;
  let description = HOME_DESCRIPTION;
  let canonical = canonicalUrl();
  let image = absoluteAsset(tripImage(homeTrip));
  let ogType = "website";
  let jsonLd;

  if (!image) image = DEFAULT_IMAGE;

  if (page === "trip" && trip) {
    title = `${trip.location} — Elsewhere`;
    description = describeTrip(trip);
    canonical = canonicalUrl(trip.slug);
    image = absoluteAsset(tripImage(trip));
    ogType = "article";
    jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        websiteNode(),
        personNode(),
        {
          "@type": "TouristDestination",
          name: `${trip.location}, ${trip.country}`,
          description: trip.intro || trip.tagline || description,
          url: canonical,
          image,
        },
        breadcrumb([
          { name: "Elsewhere", url: canonicalUrl() },
          { name: trip.location, url: canonical },
        ]),
      ],
    };
  } else if (page === "recents") {
    title = "Recents — Elsewhere";
    description = RECENTS_DESCRIPTION;
    canonical = canonicalUrl("recents");
    image = absoluteAsset(sortedRecents[0]?.image);
    jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        websiteNode(),
        personNode(),
        {
          "@type": "CollectionPage",
          name: "Recents",
          description,
          url: canonical,
          isPartOf: { "@id": WEBSITE_ID },
          mainEntity: {
            "@type": "ItemList",
            itemListElement: sortedRecents.map((entry, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: entry.location,
              url: canonicalUrl(`recents/${entry.slug}`),
            })),
          },
        },
      ],
    };
  } else if (page === "recent-detail" && recent) {
    const lead = leadSentence(recent.caption) || recent.location;
    title = `${lead} — Elsewhere`;
    description = `${recent.location}: ${recent.caption || ""}`.trim();
    canonical = canonicalUrl(`recents/${recent.slug}`);
    image = absoluteAsset(recent.image);
    ogType = "article";
    jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        websiteNode(),
        personNode(),
        {
          "@type": "BlogPosting",
          headline: lead,
          description: recent.caption || description,
          datePublished: recent.date,
          image,
          url: canonical,
          inLanguage: "en-US",
          author: { "@id": AUTHOR_ID },
          isPartOf: { "@id": WEBSITE_ID },
          mainEntityOfPage: canonical,
        },
        breadcrumb([
          { name: "Elsewhere", url: canonicalUrl() },
          { name: "Recents", url: canonicalUrl("recents") },
          { name: recent.location, url: canonical },
        ]),
      ],
    };
  } else if (page === "not-found") {
    title = "Not found — Elsewhere";
    description = "This page is not in the Elsewhere journal.";
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      url: canonicalUrl(),
      isPartOf: { "@id": WEBSITE_ID },
    };
  } else {
    jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        websiteNode(),
        personNode(),
        {
          "@type": "ItemList",
          name: "Featured Travel Destinations & Photo Journals",
          itemListElement: trips.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "TouristDestination",
              name: `${item.location}, ${item.country}`,
              description: item.intro || item.tagline || "",
              url: canonicalUrl(item.slug),
              image: absoluteAsset(tripImage(item)),
            },
          })),
        },
      ],
    };
  }

  return { title, description, canonical, image, ogType, jsonLd };
}

export function crawlablePages({ trips, recents }) {
  const sortedRecents = sortRecents(recents);
  return [
    { page: "home", suffix: "" },
    ...trips.map((trip) => ({ page: "trip", suffix: trip.slug, trip })),
    { page: "recents", suffix: "recents" },
    ...sortedRecents.map((recent) => ({
      page: "recent-detail",
      suffix: `recents/${recent.slug}`,
      recent,
    })),
  ].map((entry) => ({
    ...entry,
    loc: canonicalUrl(entry.suffix),
    head: buildHead({ page: entry.page, trip: entry.trip, recent: entry.recent, trips, recents }),
  }));
}

export function renderSitemap(pages, lastmod = SITEMAP_LASTMOD) {
  const urls = pages
    .map(
      (page) => `  <url>
    <loc>${xmlEscape(page.loc)}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
