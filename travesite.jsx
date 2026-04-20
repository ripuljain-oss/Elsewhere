import { useState, useEffect, useRef, useCallback } from "react";

const TRIPS = [
  {
    id: "Guatemala",
    location: "Antigua",
    country: "Guatemala",
    year: "2026",
    dates: "March 27 – April 5, 2026",
    tagline: "Holy Week in a colonial city ringed by volcanoes.",
    intro: "Ten days in Antigua during Semana Santa, with a long weekend on Lake Atitlán. The cobblestones, the incense, the alfombras being swept away by dawn — a city that rebuilds itself every night.",
    coverImage: "/Assets/Guatemala/10-L1004452.jpg",
    featuredIndices: [8, 11],
    color1: "#3D2066",
    color2: "#C8A228",
    color3: "#1E6B4A",
    accent: "#F0E8D8",
    emoji: "🌋",
    images: [
      "/Assets/Guatemala/1-IMG_0619.jpg",
      "/Assets/Guatemala/2-IMG_0600.jpg",
      "/Assets/Guatemala/3-IMG_0595.jpg",
      "/Assets/Guatemala/4-L1004653.jpg",
      "/Assets/Guatemala/5-L1004627.jpg",
      "/Assets/Guatemala/6-L1004501.jpg",
      "/Assets/Guatemala/7-APC_0005.jpg",
      "/Assets/Guatemala/8-L1004486.jpg",
      "/Assets/Guatemala/9-L1004468.jpg",
      "/Assets/Guatemala/10-L1004452.jpg",
      "/Assets/Guatemala/11-IMG_0341.jpg",
      "/Assets/Guatemala/12-L1004403.jpg",
      "/Assets/Guatemala/13-L1004400.jpg",
      "/Assets/Guatemala/14-L1004389.jpg",
      "/Assets/Guatemala/15-L1004386.jpg",
      "/Assets/Guatemala/16-L1004372.jpg",
      "/Assets/Guatemala/17-L1004349.jpg",
    ],
    imageCaptions: [
      "Penitentes in black robes moving through the cobblestones on Good Friday night.",
      "An alfombra of dyed sawdust laid down at midnight, waiting for the procession to pass over it.",
      "Families working the alfombra on a side street, bougainvillea spilling over the wall above them.",
      "Two horses waiting on the black slope of Fuego, the cloud line closing in.",
      "The entrance to La Azotea, a coffee estate outside Jocotenango, working since the 19th century.",
      "A lancha crossing Lake Atitlán, the cone of San Pedro rising clean behind it.",
      "The dock at dusk, the three volcanoes lined up on the far shore.",
      "In a hammock above the lake, somewhere between asleep and watching the boats.",
      "The Santa Catalina Arch on a busy Semana Santa morning, soap bubbles drifting through the crowd.",
      "Agua volcano above the terra cotta rooftops, visible from anywhere in the city.",
      "The ruins of La Merced convent, purple cloth hung under the arches for Holy Week.",
      "Looking down 5a Avenida Norte toward the arch, the city packed for the week.",
      "The roofless nave of the Cathedral, three brick arches still holding.",
      "Inside the Museo Nacional de Arte, vaulted stone carved over centuries.",
      "Agua from behind the ruins, the volcano framed between old stone and new clouds.",
      "Laying the alfombra in front of the cathedral, hours of work for a procession that will walk through it.",
      "The Santa Catalina Arch — the yellow clock arch that frames Antigua's main street.",
    ],
  },
  {
    id: "Merida",
    location: "Merida",
    country: "Mexico",
    year: "2025",
    tagline: "The capital of the Yucatan Peninsula.",
    intro: "A slow week in the Yucatán capital. Everything stops for the heat at midday, and the city doesn't really start again until dusk.",
    color1: "#F2C14F", // warm sunlit yellow
    color2: "#E27D60", // colonial coral
    color3: "#85CDCA", // Yucatán turquoise
    accent: "#F6E8C3",
    emoji: "🌴",
    images: [
      "/Assets/Merida/IMG_1674.JPG",
      "/Assets/Merida/L1004004.jpg",
      "/Assets/Merida/L1004029.jpg",
      "/Assets/Merida/L1004034.jpg",
      "/Assets/Merida/L1004069.jpg",
      "/Assets/Merida/L1004082.jpg",
    ],
    imageCaptions: [
      "A weathered church façade opening onto the plaza.",
      "Looking up at a century of carved stone.",
      "A terracotta curve against the afternoon sky.",
      "Cathedral towers rising above the trees in the square.",
      "Electric blue on a white-hot afternoon.",
      "Lines of shade across a modern courtyard.",
    ],
  },
  {
    id: "Olympic National Park",
    location: "Olympic National Park",
    country: "United States",
    year: "2025",
    tagline: "Rainforest, coast, and peaks in the Pacific Northwest.",
    intro: "Five days between the rainforest and the coast. The moss underfoot, the fog coming in off the Pacific, the kids finding things we would have walked past.",
    featuredIndices: [15],
    color1: "#1B3D2E",
    color2: "#4A6B5C",
    color3: "#7A9B8A",
    accent: "#C5D8C8",
    emoji: "🌲",
    images: [
      "/Assets/OlympicNationalPark/IMG20250724120117.jpg",
      "/Assets/OlympicNationalPark/IMG20250724120147.jpg",
      "/Assets/OlympicNationalPark/IMG20250725082741.jpg",
      "/Assets/OlympicNationalPark/IMG20250729103336.jpg",
      "/Assets/OlympicNationalPark/IMG20250729103619.jpg",
      "/Assets/OlympicNationalPark/IMG20250730092557.jpg",
      "/Assets/OlympicNationalPark/IMG_0330.jpg",
      "/Assets/OlympicNationalPark/IMG_0350.jpg",
      "/Assets/OlympicNationalPark/IMG_0394.jpg",
      "/Assets/OlympicNationalPark/IMG_0403.jpg",
      "/Assets/OlympicNationalPark/IMG_0409.jpg",
      "/Assets/OlympicNationalPark/IMG_0470.jpg",
      "/Assets/OlympicNationalPark/IMG_0493.jpg",
      "/Assets/OlympicNationalPark/IMG_0506.jpg",
      "/Assets/OlympicNationalPark/IMG_0526.jpg",
      "/Assets/OlympicNationalPark/IMG_0601.jpg",
      "/Assets/OlympicNationalPark/IMG_0643.jpg",
    ],
    imageCaptions: [
      "A dark cabin in the old growth.",
      "Looking straight up at a hundred years of growth.",
      "Small under the canopy.",
      "A homestead at the edge of the forest.",
      "Moss thick enough to muffle sound.",
      "One kayak on a still morning.",
      "Two chairs, no one in them yet.",
      "Sitting into the view.",
      "Small against the range.",
      "Walking the ridge with the Olympics behind.",
      "The canopy closing in overhead.",
      "Light through the trees on the bridge crossing.",
      "A falls below the old firs.",
      "Resting where the sun breaks through.",
      "Wild huckleberries picked off the trail.",
      "Standing in the Hoh, looking up.",
      "Two kids on the rocks, fog coming in off the coast.",
    ],
  },
  {
    id: "Panama",
    location: "Panama",
    country: "Panama",
    year: "2025",
    tagline: "Between oceans, high-rises, and jungle.",
    intro: "A week split between Casco Viejo and the hills above the canal. Old stone and new glass, running at the same time.",
    featuredIndices: [3],
    color1: "#0057A8", // canal blue
    color2: "#E63946", // warm red
    color3: "#18A999", // tropical green
    accent: "#F5F3F0",
    emoji: "🇵🇦",
    images: [
      "/Assets/Panama/023D5074-17EE-439A-BEC5-1199BD3F8338.jpg",
      "/Assets/Panama/0899DF95-6270-4F94-BA9D-2821C0BFF4AB.jpg",
      "/Assets/Panama/133DE66C-32E0-4043-8474-EF01105BCACE.jpg",
      "/Assets/Panama/2EA2666C-2638-4A18-9573-58CE10437CD8.jpg",
      "/Assets/Panama/323B7A5A-ABAD-4392-9C2C-5087EE1985B3.jpg",
      "/Assets/Panama/6709ABAC-79B6-480C-BE7D-FC9E14F49838.jpg",
      "/Assets/Panama/71BAB93C-716C-4E20-9707-201964B26557.jpg",
      "/Assets/Panama/75EC1171-321C-4ED3-BFA0-97587C2ABC25.jpg",
      "/Assets/Panama/767197F4-3DA3-44EA-8AC1-8D9BCFA3E517.jpg",
      "/Assets/Panama/86B6642D-D6CC-449F-82CA-2567D7C4146A.jpg",
      "/Assets/Panama/AF9105BF-ABCF-4313-A80B-C4BFF34DAC67.jpg",
      "/Assets/Panama/BC25127D-FD31-40DB-A29E-BB83EE745BF6.jpg",
    ],
    imageCaptions: [
      "Kids playing fútbol on a waterfront court in Casco Viejo.",
      "Palm-lined pools glowing blue at dusk.",
      "Strolling past arched doors and whitewashed walls in the old quarter.",
      "String lights and the new skyline framed by the old city.",
      "Tour boats waiting on a misty canal morning.",
      "Rooftops and bell tower at golden hour over Casco.",
      "Bikes in primary colors outside a turquoise shopfront.",
      "Something grows in every ruin.",
      "Open ridge above the jungle, looking toward the range.",
      "A hundred hats strung above a Casco alley.",
      null,
      "The bar at last light, before the night begins.",
    ],
  },
  {
    id: "Roatan",
    location: "Roatan",
    country: "Honduras",
    year: "2024",
    tagline: "Caribbean island off the coast of Honduras.",
    intro: "A long weekend on a reef we'd been meaning to dive for years. Warm water, limestone, and not much else on the schedule.",
    color1: "#0B5C6B",
    color2: "#1A8FA3",
    color3: "#7EC8C4",
    accent: "#E8DCC4",
    emoji: "🏝️",
    images: [
      "/Assets/Roatan/IMG_0692.jpg",
      "/Assets/Roatan/B3A76398-D187-4E63-B43A-D429C82426D4.jpg",
      "/Assets/Roatan/IMG_0247.jpg",
      "/Assets/Roatan/IMG_0259.jpg",
      "/Assets/Roatan/IMG_0265.jpg",
      "/Assets/Roatan/IMG_0271.jpg",
      "/Assets/Roatan/IMG_0283.jpg",
      "/Assets/Roatan/IMG_0327.jpg",
      "/Assets/Roatan/IMG_1117.jpg",
    ],
    imageCaptions: [
      "The reef from above, tracing the edge of the island.",
      "The dock at dusk, before the last light went.",
      "Boats tied up on a still morning.",
      "Every road here leads into the green.",
      "Two kids watching the last of the day wash in.",
      "A sailboat at anchor in the quiet before dark.",
      "Crossing into the canopy.",
      "The island from the water, palms along the shore.",
      "Limestone and jungle at the water's edge.",
    ],
  },
  {
    id: "Portugal",
    location: "Portugal",
    country: "Portugal",
    year: "2024",
    tagline: "Where the ocean meets the old world.",
    intro: "Ten days from Lisbon to the Algarve. Tile, pine, ocean — and tram 24 most mornings.",
    featuredIndices: [7],
    color1: "#2D5016",
    color2: "#C41E3A",
    color3: "#8B7355",
    accent: "#F4E4BC",
    emoji: "🇵🇹",
    images: [
      "/Assets/Portugal/IMG_5547.jpg",
      "/Assets/Portugal/L1001104.jpg",
      "/Assets/Portugal/L1001107.jpg",
      "/Assets/Portugal/L1001113.jpg",
      "/Assets/Portugal/L1001129.jpg",
      "/Assets/Portugal/L1001154.jpg",
      "/Assets/Portugal/L1001164.jpg",
      "/Assets/Portugal/L1001184.jpg",
      "/Assets/Portugal/L1001203.jpg",
      "/Assets/Portugal/L1001269.jpg",
      "/Assets/Portugal/L1001270.jpg",
      "/Assets/Portugal/L1001279.jpg",
      "/Assets/Portugal/L1001287.jpg",
      "/Assets/Portugal/L1001295.jpg",
      "/Assets/Portugal/L1001305.jpg",
    ],
    imageCaptions: [
      "Golden cliffs and a lone sea stack on the Algarve coast.",
      "The queue forming at the Potato Project on a Lisbon street.",
      "A conserveira since 1942, tiled floor to ceiling.",
      "Everyone moving through the pines above the city.",
      "Terra cotta as far as the eye can see.",
      "One figure on a balcony on Avenida da Liberdade.",
      "Tram 24 making the climb through the old streets.",
      "Light at the end of the cave.",
      "The Algarve cliffs on an overcast afternoon.",
      "A walled garden and a clock tower in the Alentejo.",
      "The bell tower through the castle walls.",
      "Descending to Ponta da Piedade.",
      "Arches and sea stacks off the southern tip.",
      "Atlantic at the edge of the map.",
      "Blue tiles on the steps leading in.",
    ],
  },
  {
    id: "Mexico City",
    location: "Mexico City",
    country: "Mexico",
    year: "2022",
    tagline: "Tacos, stone stelae, and a city too big to leave.",
    intro: "A first visit that turned into a long stay. Museums, tacos, and the slow realization that one week wasn't going to be enough.",
    color1: "#8B2635",
    color2: "#D4855A",
    color3: "#4A7C59",
    accent: "#F2E8D0",
    emoji: "🌮",
    images: [
      "/Assets/Mexico City/000565330018.jpg",
      "/Assets/Mexico City/000565330019.jpg",
      "/Assets/Mexico City/000565330020.jpg",
      "/Assets/Mexico City/000565330023.jpg",
      "/Assets/Mexico City/000565330026.jpg",
      "/Assets/Mexico City/000565330029.jpg",
      "/Assets/Mexico City/IMG_3715.JPG",
      "/Assets/Mexico City/IMG_3729.JPG",
      "/Assets/Mexico City/IMG_3730.JPG",
      "/Assets/Mexico City/IMG_3731.jpg",
      "/Assets/Mexico City/IMG_3733.JPG",
      "/Assets/Mexico City/IMG_3736.JPG",
      "/Assets/Mexico City/IMG_3751.JPG",
      "/Assets/Mexico City/IMG_3756.JPG",
    ],
    imageCaptions: [
      "A carved stone stela in the Museo Nacional de Antropología, sunlight cutting hard shadows across the gallery.",
      "The central courtyard of the Antropología, the umbrella fountain above a still reflecting pool.",
      "An outdoor scale model of Teotihuacán, seen through foreground cacti.",
      "A woman reads on the steps outside the museum, the honeycomb concrete facade behind her.",
      "Looking straight down through branches at a lone pedestrian crossing a Condesa intersection.",
      "Morning light through a terrace overhang, garden foliage catching the haze.",
      "Overhead view of a garden restaurant in Condesa, diners under a thick canopy of vines.",
      "Clay bowls of guisados ready for the lunch rush at a mercado stall.",
      "A chorizo taco on a white plate, just made.",
      "Working the tortilla press at the corner tortillería.",
      "A guide explaining something in the back of the market.",
      "A taquero at his stall, chorizo links hanging above, focused on the next order.",
      "Shaving al pastor off the trompo.",
      "A taco al pastor, onion and cilantro loaded, from a wax paper plate.",
    ],
  },
];

const PhotoPlaceholder = ({ trip, style = {}, label, overlay = false, imageIndex = 0, naturalDimensions = false, loading, src }) => {
  const imageSrc = src || (trip.images && trip.images[imageIndex]);
  const hasImage = Boolean(imageSrc);
  const placeholderStyle = naturalDimensions && !hasImage ? { minHeight: 400 } : {};
  return (
    <div style={{
      background: hasImage ? undefined : `linear-gradient(145deg, ${trip.color1} 0%, ${trip.color2} 45%, ${trip.color3} 100%)`,
      position: "relative", overflow: "hidden",
      ...placeholderStyle, ...style
    }}>
      {hasImage ? (
        <img
          src={imageSrc}
          alt=""
          loading={loading}
          style={naturalDimensions ? {
            width: "100%", height: "auto", display: "block", verticalAlign: "top",
          } : {
            position: "absolute", inset: 0,
            width: "100%", height: "100%", objectFit: "cover",
          }}
        />
      ) : (
        <>
          <div style={{
            position: "absolute", inset: 0,
            background: `radial-gradient(ellipse at 25% 35%, ${trip.accent}22 0%, transparent 65%)`,
          }} />
          <div style={{
            position: "absolute", inset: 0,
            background: `radial-gradient(ellipse at 80% 70%, rgba(255,255,255,0.04) 0%, transparent 55%)`,
          }} />
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
            opacity: 0.3,
          }} />
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{
              fontSize: "clamp(3rem, 6vw, 5rem)",
              filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.4)) drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
              opacity: 0.85,
            }}>{trip.emoji}</span>
          </div>
        </>
      )}
      {label && (
        <div style={{
          position: "absolute", bottom: "16px", left: "50%", transform: "translateX(-50%)",
          color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans', sans-serif",
          fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", whiteSpace: "nowrap",
        }}>{label}</div>
      )}
      {overlay && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.08)" }} />
      )}
    </div>
  );
};

function useIntersectionObserver(ref, options = {}) {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsVisible(true); obs.disconnect(); }
    }, { threshold: 0.1, ...options });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return isVisible;
}

function RevealBlock({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  const visible = useIntersectionObserver(ref);
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(32px)",
      transition: `opacity 0.9s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 0.9s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  );
}

export default function Elsewhere() {
  const [page, setPage] = useState("home");
  const [activeTrip, setActiveTrip] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [heroIdx, setHeroIdx] = useState(0);
  const [heroFading, setHeroFading] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [imageMeta, setImageMeta] = useState({});
  const containerRef = useRef(null);
  const heroIntervalRef = useRef(null);
  const lightboxTouchStartRef = useRef({ x: 0 });

  useEffect(() => {
    if (!activeTrip?.images?.length) return;
    setImageMeta({});
    activeTrip.images.forEach((src, idx) => {
      const img = new Image();
      img.onload = () => {
        const orientation = img.naturalHeight > img.naturalWidth * 1.05 ? "portrait" : "landscape";
        setImageMeta((prev) => ({ ...prev, [idx]: { orientation } }));
      };
      img.src = src;
    });
  }, [activeTrip?.id]);

  const photoBlocks = (() => {
    if (!activeTrip?.images?.length) return [];
    const blocks = [];
    const n = activeTrip.images.length;
    const featured = new Set(activeTrip.featuredIndices || []);
    let i = 0;
    while (i < n) {
      if (featured.has(i)) {
        blocks.push({ type: "feature", indices: [i] });
        i += 1;
        continue;
      }
      const thisP = imageMeta[i]?.orientation === "portrait";
      const nextP = imageMeta[i + 1]?.orientation === "portrait";
      const nextFeatured = featured.has(i + 1);
      if (thisP && nextP && !nextFeatured && i + 1 < n) {
        blocks.push({ type: "pair", indices: [i, i + 1] });
        i += 2;
      } else {
        blocks.push({ type: "single", indices: [i] });
        i += 1;
      }
    }
    return blocks;
  })();

  const currentTripIndex = activeTrip ? TRIPS.findIndex(t => t.id === activeTrip.id) : -1;
  const prevTrip = currentTripIndex >= 0 ? TRIPS[(currentTripIndex - 1 + TRIPS.length) % TRIPS.length] : null;
  const nextTrip = currentTripIndex >= 0 ? TRIPS[(currentTripIndex + 1) % TRIPS.length] : null;

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (!activeTrip?.images?.length) return;
      if (e.key === "ArrowLeft") setLightboxIndex(i => (i - 1 + activeTrip.images.length) % activeTrip.images.length);
      if (e.key === "ArrowRight") setLightboxIndex(i => (i + 1) % activeTrip.images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, activeTrip?.images?.length]);

  const startHeroInterval = useCallback(() => {
    clearInterval(heroIntervalRef.current);
    heroIntervalRef.current = setInterval(() => {
      setHeroFading(true);
      setTimeout(() => {
        setHeroIdx(p => (p + 1) % TRIPS.length);
        setHeroFading(false);
      }, 600);
    }, 5000);
  }, []);

  useEffect(() => {
    startHeroInterval();
    return () => clearInterval(heroIntervalRef.current);
  }, [startHeroInterval]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => setScrolled(el.scrollTop > 80);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const navigateTo = (trip) => {
    setLightboxOpen(false);
    setPageVisible(false);
    setTimeout(() => {
      setActiveTrip(trip);
      setPage("trip");
      if (containerRef.current) containerRef.current.scrollTop = 0;
      setTimeout(() => setPageVisible(true), 80);
    }, 350);
  };

  const navigateHome = () => {
    setLightboxOpen(false);
    setPageVisible(false);
    setTimeout(() => {
      setPage("home");
      if (containerRef.current) containerRef.current.scrollTop = 0;
      setTimeout(() => setPageVisible(true), 80);
    }, 350);
  };

  const changeHero = (i) => {
    setHeroFading(true);
    setTimeout(() => { setHeroIdx(i); setHeroFading(false); }, 300);
    startHeroInterval();
  };

  const isTrip = page === "trip";
  const headerTextColor = isTrip && !scrolled ? "rgba(255,255,255,0.9)" : "#1A1A18";
  const headerNavColor = isTrip && !scrolled ? "rgba(255,255,255,0.5)" : "#8A8780";

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#F7F4EF", height: "100vh", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap" rel="stylesheet" />

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 2px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(200,169,110,0.3); border-radius: 2px; }

        .trip-card {
          cursor: pointer;
          position: relative;
          overflow: hidden;
          border-radius: 2px;
        }
        .trip-card .card-photo {
          width: 100%; height: 100%;
          transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .trip-card:hover .card-photo { transform: scale(1.05); }
        .trip-card .gold-line {
          position: absolute; bottom: 0; left: 0;
          width: 0; height: 2px;
          background: linear-gradient(90deg, #C8A96E, #E8D5A3);
          transition: width 0.5s cubic-bezier(0.22,1,0.36,1);
        }
        .trip-card:hover .gold-line { width: 100%; }
        .trip-card .card-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.1) 50%, transparent 100%);
          transition: background 0.5s ease;
        }
        .trip-card:hover .card-overlay {
          background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.15) 60%, transparent 100%);
        }
        .trip-card .card-label {
          transition: transform 0.5s cubic-bezier(0.22,1,0.36,1);
        }
        .trip-card:hover .card-label { transform: translateY(-4px); }

        .nav-item {
          cursor: pointer;
          transition: color 0.3s ease;
          position: relative;
        }
        .nav-item::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0; right: 0;
          height: 1px;
          background: #C8A96E;
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }
        .nav-item:hover::after { transform: scaleX(1); }

        .back-link {
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          transition: all 0.35s cubic-bezier(0.22,1,0.36,1);
          color: #8A8780;
        }
        .back-link:hover { color: #C8A96E; letter-spacing: 2.5px; }
        .back-link:hover .arrow { transform: translateX(-6px); }
        .arrow { transition: transform 0.35s cubic-bezier(0.22,1,0.36,1); display: inline-block; }

        .thumb-card {
          cursor: pointer;
          overflow: hidden;
          border-radius: 2px;
          opacity: 0.65;
          transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1);
        }
        .thumb-card:hover { opacity: 1; transform: scale(1.04); }

        .hero-dot {
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.5s cubic-bezier(0.22,1,0.36,1);
          background: rgba(255,255,255,0.35);
        }
        .hero-dot.active { background: #C8A96E; }
        .hero-dot:hover { background: rgba(255,255,255,0.7); }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroReveal {
          from { opacity: 0; transform: translateY(40px) skewY(0.5deg); }
          to { opacity: 1; transform: translateY(0) skewY(0); }
        }
        @keyframes lineGrow {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        @keyframes scrollCue {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(6px); opacity: 0.8; }
        }
        .scroll-cue { animation: scrollCue 2.5s ease-in-out infinite; }

        .divider-line {
          transform-origin: left;
          animation: lineGrow 1.2s cubic-bezier(0.22,1,0.36,1) 0.8s both;
        }

        .photo-caption {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          color: #8A8780;
          font-size: 15px;
          letter-spacing: 0.3px;
          line-height: 1.7;
          padding: 14px 0 0 14px;
          border-left: 1px solid rgba(200,169,110,0.35);
          margin-left: 0;
        }

        .photo-journal { padding: 80px 0 40px; }
        .block-contained {
          max-width: 1140px;
          margin: 0 auto 56px;
          padding: 0 48px;
        }
        .block-feature {
          width: 100%;
          margin: 70px 0 70px;
          padding: 0;
        }
        .block-feature img {
          width: 100%;
          display: block;
          cursor: pointer;
        }
        .block-feature .photo-caption {
          max-width: 1140px;
          margin: 14px auto 0;
          padding: 14px 48px 0 calc(48px + 14px);
        }
        .pair-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 28px;
        }
        .pair-grid > div img {
          width: 100%;
          display: block;
          cursor: pointer;
        }
        .single-image { width: 100%; display: block; cursor: pointer; }

        .intro-block {
          max-width: 780px;
          margin: 0 auto;
          padding: 110px 48px 40px;
          text-align: left;
        }
        .intro-meta {
          color: #8A8780;
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          font-family: 'DM Sans', sans-serif;
          margin-bottom: 24px;
        }
        .intro-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.3rem, 2.2vw, 1.7rem);
          line-height: 1.55;
          color: #2A2822;
          font-weight: 400;
          font-style: italic;
          letter-spacing: -0.1px;
        }
        .intro-divider {
          width: 36px;
          height: 1px;
          background: #C8A96E;
          margin-top: 40px;
        }

        .hero-cta {
          margin-top: 36px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: rgba(255,255,255,0.85);
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          letter-spacing: 3px;
          text-transform: uppercase;
          padding: 12px 22px;
          border: 1px solid rgba(200,169,110,0.55);
          background: rgba(0,0,0,0.18);
          backdrop-filter: blur(6px);
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.22,1,0.36,1);
          animation: fadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.7s both;
        }
        .hero-cta:hover {
          background: rgba(200,169,110,0.18);
          border-color: rgba(200,169,110,0.85);
          letter-spacing: 4px;
        }
        .hero-cta .arrow { transition: transform 0.4s cubic-bezier(0.22,1,0.36,1); }
        .hero-cta:hover .arrow { transform: translateX(4px); }

        .trip-nav {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          max-width: 1140px;
          margin: 40px auto 0;
          padding: 0 48px;
        }
        .trip-nav-card {
          position: relative;
          overflow: hidden;
          cursor: pointer;
          height: 220px;
          border-radius: 2px;
        }
        .trip-nav-card .nav-photo {
          width: 100%; height: 100%;
          transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .trip-nav-card:hover .nav-photo { transform: scale(1.06); }
        .trip-nav-card .nav-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 50%, transparent 100%);
        }
        .trip-nav-card .nav-label {
          position: absolute;
          left: 0; right: 0; bottom: 0;
          padding: 24px;
        }

        @media (max-width: 700px) {
          .masonry-grid { grid-template-columns: 1fr !important; grid-auto-rows: 240px !important; }
          .masonry-grid > div { grid-column: 1 !important; grid-row: span 1 !important; }
          .split-row { grid-template-columns: 1fr !important; }
          .split-row > * { height: 260px !important; }
          .hero-title { font-size: 3rem !important; }
          .section-pad { padding: 0 20px 60px !important; }
          .journal-pad { padding: 60px 20px !important; }
          .photo-journal { padding: 40px 0 20px; }
          .block-contained { padding: 0 20px; margin-bottom: 36px; }
          .block-feature { margin: 40px 0; }
          .block-feature .photo-caption { padding: 14px 20px 0 34px; }
          .pair-grid { grid-template-columns: 1fr; gap: 36px; }
          .intro-block { padding: 60px 20px 20px; }
          .trip-nav { grid-template-columns: 1fr; padding: 0 20px; gap: 16px; }
          .trip-nav-card { height: 160px; }
          header { padding: 16px 20px !important; }
        }
      `}</style>

      {/* ─── HEADER ─── */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        padding: "22px 48px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        backdropFilter: scrolled ? "blur(24px) saturate(180%)" : "none",
        background: scrolled ? "rgba(247,244,239,0.88)" : "transparent",
        borderBottom: scrolled ? "1px solid rgba(200,169,110,0.12)" : "1px solid transparent",
        transition: "all 0.6s cubic-bezier(0.22,1,0.36,1)",
      }}>
        <div onClick={navigateHome} style={{
          cursor: "pointer",
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "13px", letterSpacing: "5px", textTransform: "uppercase",
          color: headerTextColor, fontWeight: 400,
          transition: "color 0.5s ease",
          userSelect: "none",
        }}>
          Elsewhere
        </div>
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase",
          color: headerNavColor, fontWeight: 400,
          transition: "color 0.5s ease",
          userSelect: "none",
        }}>
          A journal by Ripul Jain
        </div>
      </header>

      {/* ─── SCROLLABLE CONTENT ─── */}
      <div ref={containerRef} style={{
        height: "100vh", overflowY: "auto", overflowX: "hidden",
        opacity: pageVisible ? 1 : 0,
        transition: "opacity 0.35s ease",
      }}>

        {/* ══════════════════════════════ HOME PAGE ══════════════════════════════ */}
        {page === "home" && (
          <div>

            {/* Hero */}
            <div style={{ height: "100vh", position: "relative", overflow: "hidden" }}>

              {/* Background photos crossfade */}
              {TRIPS.map((trip, i) => (
                <div key={trip.id} style={{
                  position: "absolute", inset: 0,
                  opacity: heroIdx === i ? (heroFading ? 0 : 1) : 0,
                  transition: "opacity 1.4s cubic-bezier(0.4,0,0.2,1)",
                }}>
                  <PhotoPlaceholder
                    trip={trip}
                    src={trip.coverImage || trip.images?.[0]}
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
              ))}

              {/* Gradient overlays */}
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.35) 55%, rgba(26,26,24,0.78) 100%)",
              }} />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to right, rgba(0,0,0,0.15) 0%, transparent 60%)",
              }} />

              {/* Hero text */}
              <div style={{
                position: "absolute", bottom: "18%", left: 0, right: 0,
                textAlign: "center", padding: "0 48px",
              }}>
                <div style={{
                  display: "inline-block",
                  color: "rgba(200,169,110,0.7)", fontSize: "10px", letterSpacing: "5px",
                  textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif",
                  marginBottom: "24px",
                  animation: "fadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.2s both",
                }}>
                  {TRIPS[heroIdx].country} · {TRIPS[heroIdx].year}
                </div>
                <h1 className="hero-title" style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(3.2rem, 7.5vw, 7rem)",
                  fontWeight: 300, color: "white", lineHeight: 1.05,
                  letterSpacing: "-0.5px",
                  animation: "heroReveal 1.3s cubic-bezier(0.22,1,0.36,1) 0.1s both",
                }}>
                  Postcards from<br /><em>elsewhere.</em>
                </h1>
                <div style={{
                  width: "32px", height: "1px",
                  background: "linear-gradient(90deg, transparent, #C8A96E, transparent)",
                  margin: "28px auto",
                  animation: "fadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.5s both",
                }} />
                <p style={{
                  color: "rgba(255,255,255,0.45)", fontSize: "12px", letterSpacing: "3px",
                  textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
                  animation: "fadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.6s both",
                }}>
                  {TRIPS[heroIdx].tagline}
                </p>
                <div
                  className="hero-cta"
                  role="button"
                  tabIndex={0}
                  onClick={() => navigateTo(TRIPS[heroIdx])}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); navigateTo(TRIPS[heroIdx]); } }}
                >
                  Open journal <span className="arrow">→</span>
                </div>
              </div>

              {/* Dots */}
              <div style={{
                position: "absolute", bottom: "6%", left: "50%", transform: "translateX(-50%)",
                display: "flex", gap: "10px", alignItems: "center",
              }}>
                {TRIPS.map((_, i) => (
                  <div key={i} className={`hero-dot ${heroIdx === i ? "active" : ""}`}
                    onClick={(e) => { e.stopPropagation(); changeHero(i); }}
                    style={{ width: heroIdx === i ? "28px" : "7px", height: "7px" }}
                  />
                ))}
              </div>
            </div>

            {/* Section header */}
            <div className="section-pad" style={{ padding: "88px 48px 44px", maxWidth: "1280px", margin: "0 auto" }}>
              <RevealBlock>
                <div style={{
                  display: "flex", alignItems: "baseline", justifyContent: "space-between",
                  paddingBottom: "22px", borderBottom: "1px solid rgba(26,26,24,0.07)",
                }}>
                  <h2 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 400,
                    color: "#1A1A18", letterSpacing: "-0.3px",
                  }}>All destinations</h2>
                  <span style={{
                    color: "#8A8780", fontSize: "11px", letterSpacing: "2.5px",
                    textTransform: "uppercase", fontWeight: 400,
                  }}>{TRIPS.length} journeys</span>
                </div>
              </RevealBlock>
            </div>

            {/* Masonry grid */}
            <div className="section-pad" style={{ padding: "0 48px 100px", maxWidth: "1280px", margin: "0 auto" }}>
              <div className="masonry-grid" style={{
                display: "grid",
                gridTemplateColumns: "repeat(12, 1fr)",
                gridAutoRows: "72px",
                gap: "14px",
              }}>
                {TRIPS.map((trip, i) => {
                  const layouts = [
                    { col: "1 / 7", row: "span 6" },
                    { col: "7 / 13", row: "span 8" },
                    { col: "1 / 5", row: "span 7" },
                    { col: "5 / 13", row: "span 5" },
                    { col: "1 / 8", row: "span 6" },
                    { col: "8 / 13", row: "span 7" },
                    { col: "1 / 13", row: "span 5" },
                  ];
                  const layout = layouts[i] || layouts[0];
                  return (
                    <RevealBlock key={trip.id} delay={i * 0.08} style={{
                      gridColumn: layout.col, gridRow: layout.row,
                    }}>
                      <div className="trip-card" style={{ height: "100%" }}
                        onClick={() => navigateTo(trip)}
                        onMouseEnter={() => setHoveredCard(trip.id)}
                        onMouseLeave={() => setHoveredCard(null)}
                      >
                        <div className="card-photo" style={{ position: "absolute", inset: 0 }}>
                          <PhotoPlaceholder trip={trip} style={{ width: "100%", height: "100%" }} loading="lazy" />
                        </div>
                        <div className="card-overlay" />
                        <div className="card-label" style={{
                          position: "absolute", bottom: 0, left: 0, right: 0,
                          padding: "22px 20px 18px",
                        }}>
                          <div style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: "clamp(1.15rem, 2.2vw, 1.75rem)",
                            color: "white", fontWeight: 400, letterSpacing: "0.2px", lineHeight: 1.2,
                          }}>{trip.location}</div>
                          <div style={{
                            color: "rgba(255,255,255,0.45)", fontSize: "10px",
                            letterSpacing: "2.5px", textTransform: "uppercase",
                            marginTop: "5px", fontFamily: "'DM Sans', sans-serif",
                          }}>{trip.country} · {trip.year}</div>
                        </div>
                        <div className="gold-line" />
                      </div>
                    </RevealBlock>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <footer style={{
              borderTop: "1px solid rgba(26,26,24,0.06)",
              padding: "30px 48px",
              display: "flex", justifyContent: "center", alignItems: "center",
            }}>
              <p style={{ color: "#8A8780", fontSize: "10px", letterSpacing: "2.5px", textTransform: "uppercase" }}>
                © 2026 — Elsewhere
              </p>
            </footer>
          </div>
        )}

        {/* ══════════════════════════════ TRIP PAGE ══════════════════════════════ */}
        {page === "trip" && activeTrip && (
          <div>

            {/* Trip Hero */}
            <div
              style={{
                height: "100vh", position: "relative", overflow: "hidden",
              }}
            >
              <PhotoPlaceholder
                trip={activeTrip}
                src={activeTrip.coverImage || activeTrip.images?.[0]}
                style={{ width: "100%", height: "100%" }}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to bottom, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.22) 40%, rgba(0,0,0,0.75) 100%)",
              }} />
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                textAlign: "center", padding: "0 48px",
              }}>
                <p style={{
                  color: "rgba(200,169,110,0.8)", fontSize: "10px", letterSpacing: "5px",
                  textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif",
                  marginBottom: "22px",
                  animation: "fadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.1s both",
                }}>
                  {activeTrip.country} · {activeTrip.dates || activeTrip.year}
                </p>
                <h1 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(4rem, 9vw, 8rem)",
                  color: "white", fontWeight: 300, lineHeight: 0.95,
                  letterSpacing: "-1.5px",
                  animation: "heroReveal 1.3s cubic-bezier(0.22,1,0.36,1) 0.05s both",
                }}>
                  {activeTrip.location}
                </h1>
                <div style={{
                  width: "48px", height: "1px",
                  background: "#C8A96E",
                  margin: "30px auto 0",
                  animation: "lineGrow 1s cubic-bezier(0.22,1,0.36,1) 0.8s both",
                  transformOrigin: "left",
                }} />
                <p style={{
                  color: "rgba(255,255,255,0.4)", fontSize: "12px", letterSpacing: "2.5px",
                  textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif",
                  marginTop: "22px",
                  animation: "fadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.9s both",
                }}>
                  {activeTrip.tagline}
                </p>
              </div>
            </div>

            {/* Intro block */}
            {activeTrip.intro && (
              <RevealBlock>
                <div className="intro-block">
                  <div className="intro-meta">
                    {activeTrip.dates || activeTrip.year} · {activeTrip.images?.length || 0} photos
                  </div>
                  <p className="intro-text">{activeTrip.intro}</p>
                  <div className="intro-divider" />
                </div>
              </RevealBlock>
            )}

            {/* Photo journal — varied layout (single / pair / feature) */}
            {Array.isArray(activeTrip.images) && activeTrip.images.length > 0 && (
              <div className="photo-journal">
                {photoBlocks.map((block, bi) => {
                  if (block.type === "feature") {
                    const idx = block.indices[0];
                    return (
                      <RevealBlock key={bi} delay={Math.min(0.18, bi * 0.03)}>
                        <div className="block-feature">
                          <img
                            src={activeTrip.images[idx]}
                            alt=""
                            loading="lazy"
                            onClick={() => { setLightboxIndex(idx); setLightboxOpen(true); }}
                          />
                          {activeTrip.imageCaptions?.[idx] && (
                            <p className="photo-caption">{activeTrip.imageCaptions[idx]}</p>
                          )}
                        </div>
                      </RevealBlock>
                    );
                  }
                  if (block.type === "pair") {
                    return (
                      <RevealBlock key={bi} delay={Math.min(0.18, bi * 0.03)}>
                        <div className="block-contained">
                          <div className="pair-grid">
                            {block.indices.map(idx => (
                              <div key={idx}>
                                <img
                                  src={activeTrip.images[idx]}
                                  alt=""
                                  loading="lazy"
                                  onClick={() => { setLightboxIndex(idx); setLightboxOpen(true); }}
                                />
                                {activeTrip.imageCaptions?.[idx] && (
                                  <p className="photo-caption">{activeTrip.imageCaptions[idx]}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </RevealBlock>
                    );
                  }
                  const idx = block.indices[0];
                  return (
                    <RevealBlock key={bi} delay={Math.min(0.18, bi * 0.03)}>
                      <div className="block-contained">
                        <img
                          className="single-image"
                          src={activeTrip.images[idx]}
                          alt=""
                          loading="lazy"
                          onClick={() => { setLightboxIndex(idx); setLightboxOpen(true); }}
                        />
                        {activeTrip.imageCaptions?.[idx] && (
                          <p className="photo-caption">{activeTrip.imageCaptions[idx]}</p>
                        )}
                      </div>
                    </RevealBlock>
                  );
                })}
              </div>
            )}

            {/* Prev / Next trip navigation */}
            <div style={{ maxWidth: "1140px", margin: "60px auto 0", padding: "0 48px" }}>
              <RevealBlock>
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  borderTop: "1px solid rgba(26,26,24,0.08)", paddingTop: "36px",
                }}>
                  <span className="back-link" onClick={navigateHome} style={{
                    fontSize: "11px", letterSpacing: "2.5px", textTransform: "uppercase",
                  }}>
                    <span className="arrow">←</span> All trips
                  </span>
                  <span style={{
                    color: "#8A8780", fontSize: "10px", letterSpacing: "3px",
                    textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif",
                  }}>
                    Continue the journey
                  </span>
                </div>
              </RevealBlock>
            </div>
            <RevealBlock>
              <div className="trip-nav">
                {prevTrip && (
                  <div className="trip-nav-card" onClick={() => navigateTo(prevTrip)}>
                    <div className="nav-photo">
                      <PhotoPlaceholder
                        trip={prevTrip}
                        src={prevTrip.coverImage || prevTrip.images?.[0]}
                        style={{ width: "100%", height: "100%" }}
                        loading="lazy"
                      />
                    </div>
                    <div className="nav-overlay" />
                    <div className="nav-label">
                      <div style={{
                        color: "rgba(200,169,110,0.85)", fontSize: "10px",
                        letterSpacing: "3px", textTransform: "uppercase",
                        marginBottom: "6px", fontFamily: "'DM Sans', sans-serif",
                      }}>
                        ← Previous
                      </div>
                      <div style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "clamp(1.3rem, 2.2vw, 1.8rem)",
                        color: "white", fontWeight: 400, lineHeight: 1.2,
                      }}>
                        {prevTrip.location}
                      </div>
                      <div style={{
                        color: "rgba(255,255,255,0.55)", fontSize: "10px",
                        letterSpacing: "2px", textTransform: "uppercase",
                        marginTop: "4px", fontFamily: "'DM Sans', sans-serif",
                      }}>
                        {prevTrip.country} · {prevTrip.year}
                      </div>
                    </div>
                  </div>
                )}
                {nextTrip && (
                  <div className="trip-nav-card" onClick={() => navigateTo(nextTrip)}>
                    <div className="nav-photo">
                      <PhotoPlaceholder
                        trip={nextTrip}
                        src={nextTrip.coverImage || nextTrip.images?.[0]}
                        style={{ width: "100%", height: "100%" }}
                        loading="lazy"
                      />
                    </div>
                    <div className="nav-overlay" />
                    <div className="nav-label" style={{ textAlign: "right" }}>
                      <div style={{
                        color: "rgba(200,169,110,0.85)", fontSize: "10px",
                        letterSpacing: "3px", textTransform: "uppercase",
                        marginBottom: "6px", fontFamily: "'DM Sans', sans-serif",
                      }}>
                        Next →
                      </div>
                      <div style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "clamp(1.3rem, 2.2vw, 1.8rem)",
                        color: "white", fontWeight: 400, lineHeight: 1.2,
                      }}>
                        {nextTrip.location}
                      </div>
                      <div style={{
                        color: "rgba(255,255,255,0.55)", fontSize: "10px",
                        letterSpacing: "2px", textTransform: "uppercase",
                        marginTop: "4px", fontFamily: "'DM Sans', sans-serif",
                      }}>
                        {nextTrip.country} · {nextTrip.year}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </RevealBlock>
            <div style={{ height: "80px" }} />

            {/* Footer */}
            <footer style={{
              borderTop: "1px solid rgba(26,26,24,0.06)",
              padding: "30px 48px", textAlign: "center",
            }}>
              <p style={{ color: "#8A8780", fontSize: "10px", letterSpacing: "2.5px", textTransform: "uppercase" }}>
                © 2026 — Elsewhere
              </p>
            </footer>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && page === "trip" && activeTrip?.images?.length > 0 && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photo lightbox"
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.92)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            padding: "48px",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setLightboxOpen(false); }}
          onTouchStart={(e) => {
            if (activeTrip?.images?.length <= 1) return;
            lightboxTouchStartRef.current = { x: e.touches[0].clientX };
          }}
          onTouchEnd={(e) => {
            if (activeTrip?.images?.length <= 1) return;
            const touch = e.changedTouches[0];
            const deltaX = touch.clientX - lightboxTouchStartRef.current.x;
            const threshold = 50;
            if (deltaX > threshold) {
              setLightboxIndex((i) => (i - 1 + activeTrip.images.length) % activeTrip.images.length);
            } else if (deltaX < -threshold) {
              setLightboxIndex((i) => (i + 1) % activeTrip.images.length);
            }
          }}
        >
          <div style={{
            position: "absolute", top: "28px", left: "32px",
            color: "rgba(255,255,255,0.6)", fontSize: "11px", letterSpacing: "3px",
            textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif",
          }}>
            {String(lightboxIndex + 1).padStart(2, "0")} / {String(activeTrip.images.length).padStart(2, "0")}
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={() => setLightboxOpen(false)}
            style={{
              position: "absolute", top: "20px", right: "24px",
              background: "none", border: "none", color: "rgba(255,255,255,0.8)",
              fontSize: "28px", cursor: "pointer", padding: "8px", lineHeight: 1,
            }}
          >
            ×
          </button>
          {activeTrip.images.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous"
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => (i - 1 + activeTrip.images.length) % activeTrip.images.length); }}
                style={{
                  position: "absolute", left: "24px", top: "50%", transform: "translateY(-50%)",
                  background: "rgba(255,255,255,0.1)", border: "none", color: "white",
                  width: "48px", height: "48px", borderRadius: "50%", fontSize: "24px", cursor: "pointer",
                }}
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="Next"
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => (i + 1) % activeTrip.images.length); }}
                style={{
                  position: "absolute", right: "24px", top: "50%", transform: "translateY(-50%)",
                  background: "rgba(255,255,255,0.1)", border: "none", color: "white",
                  width: "48px", height: "48px", borderRadius: "50%", fontSize: "24px", cursor: "pointer",
                }}
              >
                ›
              </button>
            </>
          )}
          <img
            src={activeTrip.images[lightboxIndex]}
            alt=""
            style={{ maxWidth: "100%", maxHeight: "calc(100vh - 120px)", objectFit: "contain" }}
            onClick={(e) => e.stopPropagation()}
          />
          {activeTrip.imageCaptions?.[lightboxIndex] && (
            <p style={{
              marginTop: "20px", color: "rgba(255,255,255,0.85)", fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic", fontSize: "18px", textAlign: "center", maxWidth: "600px",
            }}>
              {activeTrip.imageCaptions[lightboxIndex]}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
