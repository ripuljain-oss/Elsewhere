import { hashRedirectScript } from "../journalRoutes.js";

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

function setMeta(html, attr, key, value) {
  const re = new RegExp(`<meta\\b(?=[^>]*\\b${attr}="${key}")([^>]*)>`, "i");
  const match = html.match(re);
  if (!match) throw new Error(`missing meta ${attr}="${key}"`);
  if (!/content="[^"]*"/.test(match[0])) throw new Error(`meta ${key} has no content attribute`);
  const tag = match[0].replace(/content="[^"]*"/, `content="${escapeAttr(value)}"`);
  return html.replace(match[0], tag);
}

export function applyHead(html, head, { tripSlugs }) {
  if (!html.includes("G-1P8LT831MG")) {
    throw new Error("shell template is missing the GA4 gtag id");
  }
  let out = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(head.title)}</title>`);
  if (!out.includes(`<title>${escapeAttr(head.title)}</title>`)) {
    throw new Error("failed to set <title>");
  }

  out = setMeta(out, "name", "description", head.description);
  out = setMeta(out, "property", "og:title", head.title);
  out = setMeta(out, "property", "og:description", head.description);
  out = setMeta(out, "property", "og:url", head.canonical);
  out = setMeta(out, "property", "og:image", head.image);
  out = setMeta(out, "property", "og:type", head.ogType);
  out = setMeta(out, "name", "twitter:title", head.title);
  out = setMeta(out, "name", "twitter:description", head.description);
  out = setMeta(out, "name", "twitter:image", head.image);

  const canonical = `<link rel="canonical" href="${escapeAttr(head.canonical)}" />`;
  if (!/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/.test(out)) {
    throw new Error("missing canonical link");
  }
  out = out.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/, canonical);

  const json = JSON.stringify(head.jsonLd, null, 2).replace(/</g, "\\u003c");
  if (!/<script type="application\/ld\+json">/.test(out)) {
    throw new Error("missing JSON-LD script");
  }
  out = out.replace(
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
    `<script type="application/ld+json">\n${json}\n    </script>`
  );

  const redirect = hashRedirectScript(tripSlugs);
  if (out.includes('id="legacy-hash-redirect"')) {
    out = out.replace(/<script id="legacy-hash-redirect">[\s\S]*?<\/script>/, redirect);
  } else {
    out = out.replace("</head>", `    ${redirect}\n  </head>`);
  }

  if (!out.includes("G-1P8LT831MG")) throw new Error("gtag was stripped while applying head");
  if ((out.match(/id="legacy-hash-redirect"/g) || []).length !== 1) {
    throw new Error("expected exactly one legacy hash redirect script");
  }
  return out;
}
