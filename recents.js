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
//      https://jainfam.net/travel/#recents/{slug}
//
// Caption voice: informational, one verified fact, ~20-25 words.
// No feelings, no brochure adjectives.
// ─────────────────────────────────────────────────────────────

export const RECENTS = [
  {
    slug: "cafe-tabeeb-south-loop",
    date: "2026-08-30",
    image: "/Assets/Recents/File_000.jpeg",
    location: "South Loop, Chicago",
    caption: "Cafe Tabeeb wall sign at 720 S. Wells Street in Chicago's South Loop. Tabeeb is the Arabic word for healer or doctor.",
  },
  {
    slug: "estes-park-elk-window",
    date: "2026-08-28",
    image: "/Assets/Recents/IMG_estes-park-elk.jpg",
    location: "Estes Park, Colorado",
    caption: "Elk in the meadow outside an Estes Park rental. The town sits at 7,522 feet on the eastern edge of Rocky Mountain National Park.",
  },
  {
    slug: "la-quinta-resort-palm-springs",
    date: "2026-05-10",
    image: "/Assets/Recents/IMG_1143.jpg",
    location: "La Quinta, California",
    caption: "La Quinta Resort & Club, founded in 1926, viewed through the property's pergola. The Santa Rosa Mountains form the backdrop behind the resort's original Spanish Colonial casitas.",
  },
  {
    slug: "oak-park-hemingway-murals",
    date: "2026-04-23",
    image: "/Assets/Recents/IMG_0997.jpg",
    location: "Oak Park, Illinois",
    caption: "Mini Murals along the Oak Park Green Line embankment — an Arts Council program running since 2010 with ~230 panels by rotating artists. Several reference Ernest Hemingway, who was born in Oak Park in 1899.",
  },
  {
    slug: "blackhawks-centennial-ot-loss",
    date: "2026-03-17",
    image: "/Assets/Recents/IMG_0117.jpg",
    location: "United Center, Chicago",
    caption: "Blackhawks fell 4-3 in overtime to the Minnesota Wild, Mats Zuccarello with the winner at 3:09. The jumbotron marks the franchise's 100th anniversary season.",
  },
  {
    slug: "pacaya-lava-rock-pizza",
    date: "2026-04-02",
    image: "/Assets/Recents/IMG_0539.jpg",
    location: "Volcán Pacaya, Guatemala",
    caption: "Summit vendors on the Pacaya hike, known for pizzas baked on lava-rock ovens. Pacaya has been continuously active since 1965 — among Central America's most active volcanoes.",
  },
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
