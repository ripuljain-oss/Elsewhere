// ─────────────────────────────────────────────────────────────
// RECENTS — ongoing journal entries
//
// To add a new entry:
//   1. Drop image into /public/Assets/Recents/
//   2. Copy an entry below, paste it at the TOP of the array
//   3. Update slug, date, image, location, caption
//      (slug must be unique — used in the permalink URL)
//   4. Commit + push → Vercel auto-deploys
//   5. For Instagram: post same image + caption, set bio link to
//      https://el5ewhere.net/#recents/{slug}
//
// Caption voice: informational, one verified fact, ~20-25 words.
// No feelings, no brochure adjectives.
// ─────────────────────────────────────────────────────────────

export const RECENTS = [
  {
    slug: "antigua-semana-santa",
    date: "2026-04-21",
    image: "/Assets/Recents/IMG_0577.jpg",
    location: "Antigua, Guatemala",
    caption: "Maya women during Semana Santa in Antigua. Holy Week draws pilgrims from highland villages across Guatemala, each wearing traje with patterns specific to their community.",
  },
  {
    slug: "antigua-edge-street",
    date: "2026-04-21",
    image: "/Assets/Recents/IMG_0597.jpg",
    location: "Antigua, Guatemala",
    caption: "A cobblestone street at the edge of Antigua. The city's colonial grid and terracotta rooftops have been preserved under UNESCO protection since 1979.",
  },
];
