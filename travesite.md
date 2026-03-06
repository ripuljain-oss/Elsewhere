# Travesite — Travel Photo Website Plan

## Concept & Aesthetic Direction

**Tone:** Refined editorial minimalism — think a high-end travel magazine distilled into a digital experience. Generous white space, large dramatic imagery, and restrained typography that never competes with the photos.

**Unforgettable element:** Photos are the hero. Every design decision exists to showcase them. Navigation is nearly invisible; the imagery breathes.

**Color palette:**
- Background: `#F7F4EF` (warm off-white, like aged paper)
- Text: `#1A1A18` (near-black, organic)
- Accent: `#C8A96E` (muted gold — warmth, travel, discovery)
- Secondary text: `#8A8780` (soft warm grey)

**Typography:**
- Display: *Cormorant Garamond* — elegant, editorial, timeless
- Body / UI: *DM Sans* — clean, modern contrast to the serif display

---

## Site Structure

```
/                    → Landing page (all trips)
/trips/[location]    → Individual location page
```

---

## Pages

### 1. Landing Page `/`

**Purpose:** A curated gallery of all trips, inviting exploration.

**Layout:**
- Full-viewport hero with a single rotating "featured" photo and large serif title: *"Moments from the road."*
- Subtle animated fade-in on load
- Below hero: a **masonry or asymmetric grid** of trip cards — one per destination
- Each card shows:
  - A cover photo (fills the card)
  - Location name overlaid at the bottom in white Cormorant Garamond
  - Country / year in small DM Sans
  - Hover: photo gently scales up (1.04×), gold accent line slides in

**Header:**
- Minimal — site name on the left in small caps, nothing else
- On scroll: header shrinks slightly and gains a frosted-glass blur background

**Footer:**
- Single line: year + name, centered, tiny

---

### 2. Location Page `/trips/[location]`

**Purpose:** An immersive photo journal for a single trip.

**Layout:**
- **Hero:** Full-bleed first photo, location name in large Cormorant Garamond centered over a soft dark gradient
- Below: alternating full-width and side-by-side photo layouts to create editorial rhythm
- Optional: a short text caption or note beneath select photos (italic, restrained)
- Photos load with a subtle fade-in as they enter the viewport (Intersection Observer)
- At the very bottom: "← Back to all trips" link in small DM Sans with a gentle left-arrow animation

**Photo treatments:**
- No heavy filters — photos shown as-is
- Occasional single photo gets a full-bleed edge-to-edge treatment for drama
- Side-by-side pairs use slight size asymmetry (60/40 split) for visual interest

---

## Technical Approach

| Concern | Approach |
|---|---|
| Framework | Vanilla HTML/CSS/JS (or Next.js if scale needed) |
| Photos | Lazy-loaded with `loading="lazy"` + fade-in via IntersectionObserver |
| Routing | One HTML file per location, or JS-based routing |
| Fonts | Google Fonts: Cormorant Garamond + DM Sans |
| Animations | CSS transitions + keyframes only (no heavy libraries) |
| Responsiveness | Mobile-first; grid collapses to single column on small screens |
| Performance | Images served at appropriate sizes via `srcset` |

---

## Component Breakdown

### `TripCard` (Landing page)
```
[ Photo fills card                    ]
[                                     ]
[                                     ]
[ Location Name          Country 2024 ]  ← gold line on hover
```

### `PhotoRow` (Location page — alternating layouts)
```
Layout A: [    Full width photo    ]

Layout B: [ Large photo ] [ Small photo ]

Layout C: [ Small photo ] [ Large photo ]

Layout D: [    Full bleed edge-to-edge   ]
```

---

## Content Structure (per location)

Each trip needs:
- `cover_photo` — used on landing page card and location hero
- `location_name` — e.g. "Kyoto"
- `country` — e.g. "Japan"
- `year` — e.g. "2023"
- `photos[]` — ordered array of photo paths
- `captions{}` — optional map of photo → caption text

---

## Design Principles

1. **Photos first.** Never let chrome compete with imagery.
2. **Restraint is luxury.** More white space = more premium feel.
3. **Warmth over sterility.** The off-white background and gold accent give soul.
4. **Typography does the heavy lifting.** Cormorant Garamond elevates even simple text.
5. **Motion should feel inevitable.** Animations are subtle and purposeful — nothing should feel like a trick.
