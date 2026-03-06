import { useState, useEffect, useRef, useCallback } from "react";

const TRIPS = [
  {
    id: "Merida",
    location: "Merida",
    country: "Mexico",
    year: "2025",
    tagline: "The capital of the Yucatan Peninsula.",
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
      null,
      null,
      "Cathedral towers rising above the trees in the square.",
      null,
      "Lines of shade across a modern courtyard.",
    ],
  },
  {
    id: "Panama",
    location: "Panama",
    country: "Panama",
    year: "2025",
    tagline: "Between oceans, high-rises, and jungle.",
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
      "Strolling past teal doors and whitewashed walls in the old quarter.",
      null,
      "Tour boats waiting on a misty canal morning.",
      "Rooftops and bell tower at golden hour over Casco.",
      null,
      null,
      null,
      null,
      null,
      null,
    ],
  },
];

const PhotoPlaceholder = ({ trip, style = {}, label, overlay = false, imageIndex = 0, naturalDimensions = false }) => {
  const hasImage = trip.images && trip.images[imageIndex];
  const placeholderStyle = naturalDimensions && !hasImage ? { minHeight: 400 } : {};
  return (
    <div style={{
      background: hasImage ? undefined : `linear-gradient(145deg, ${trip.color1} 0%, ${trip.color2} 45%, ${trip.color3} 100%)`,
      position: "relative", overflow: "hidden",
      ...placeholderStyle, ...style
    }}>
      {hasImage ? (
        <img
          src={trip.images[imageIndex]}
          alt=""
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
  const containerRef = useRef(null);
  const heroIntervalRef = useRef(null);

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
    setPageVisible(false);
    setTimeout(() => {
      setActiveTrip(trip);
      setPage("trip");
      if (containerRef.current) containerRef.current.scrollTop = 0;
      setTimeout(() => setPageVisible(true), 80);
    }, 350);
  };

  const navigateHome = () => {
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
          padding-top: 14px;
        }

        @media (max-width: 700px) {
          .masonry-grid { grid-template-columns: 1fr !important; grid-auto-rows: 240px !important; }
          .masonry-grid > div { grid-column: 1 !important; grid-row: span 1 !important; }
          .split-row { grid-template-columns: 1fr !important; }
          .split-row > * { height: 260px !important; }
          .hero-title { font-size: 3rem !important; }
          .section-pad { padding: 0 20px 60px !important; }
          .journal-pad { padding: 60px 20px !important; }
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
        <nav />
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
                  <PhotoPlaceholder trip={trip} style={{ width: "100%", height: "100%" }} />
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
              </div>

              {/* Dots */}
              <div style={{
                position: "absolute", bottom: "7%", left: "50%", transform: "translateX(-50%)",
                display: "flex", gap: "10px", alignItems: "center",
              }}>
                {TRIPS.map((_, i) => (
                  <div key={i} className={`hero-dot ${heroIdx === i ? "active" : ""}`}
                    onClick={() => changeHero(i)}
                    style={{ width: heroIdx === i ? "28px" : "7px", height: "7px" }}
                  />
                ))}
              </div>

              {/* Scroll cue */}
              <div className="scroll-cue" style={{
                position: "absolute", bottom: "2.5%", left: "50%", transform: "translateX(-50%)",
                display: "flex", flexDirection: "column", alignItems: "center", gap: "10px",
              }}>
                <div style={{ width: "1px", height: "36px", background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.3))" }} />
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "9px", letterSpacing: "4px", textTransform: "uppercase" }}>scroll</span>
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
                          <PhotoPlaceholder trip={trip} style={{ width: "100%", height: "100%" }} />
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
            <div style={{ height: "100vh", position: "relative", overflow: "hidden" }}>
              <PhotoPlaceholder trip={activeTrip} style={{ width: "100%", height: "100%" }} />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to bottom, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.18) 40%, rgba(0,0,0,0.72) 100%)",
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
                  {activeTrip.country} · {activeTrip.year}
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
              {/* Scroll cue */}
              <div className="scroll-cue" style={{
                position: "absolute", bottom: "3%", left: "50%", transform: "translateX(-50%)",
                display: "flex", flexDirection: "column", alignItems: "center", gap: "10px",
              }}>
                <div style={{ width: "1px", height: "36px", background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.3))" }} />
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "9px", letterSpacing: "4px", textTransform: "uppercase" }}>scroll</span>
              </div>
            </div>

            {/* Photo journal */}
            {Array.isArray(activeTrip.images) && activeTrip.images.length > 0 && (
              <>
                <div className="journal-pad" style={{ maxWidth: "1140px", margin: "0 auto", padding: "100px 48px 40px" }}>
                  {activeTrip.images.slice(0, -1).map((_, i) => (
                    <RevealBlock key={i} delay={Math.min(0.18, i * 0.02)} style={{ marginBottom: "32px" }}>
                      <PhotoPlaceholder
                        trip={activeTrip}
                        imageIndex={i}
                        naturalDimensions
                        label={i === 0 ? "Golden Hour" : undefined}
                        style={{ width: "100%", borderRadius: "2px" }}
                      />
                      {activeTrip.imageCaptions?.[i] && (
                        <p className="photo-caption">{activeTrip.imageCaptions[i]}</p>
                      )}
                    </RevealBlock>
                  ))}
                </div>

                {/* Full-bleed (last image) */}
                <RevealBlock style={{ margin: "20px 0 0" }}>
                  <div style={{ position: "relative" }}>
                    <PhotoPlaceholder
                      trip={activeTrip}
                      imageIndex={activeTrip.images.length - 1}
                      naturalDimensions
                      label="Panorama"
                      style={{ width: "100%", borderRadius: "2px" }}
                    />
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 50%)",
                    }} />
                    <div style={{
                      position: "absolute", bottom: "36px", left: "50%", transform: "translateX(-50%)",
                      textAlign: "center",
                    }}>
                      <div style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
                        color: "rgba(255,255,255,0.85)", fontWeight: 300,
                        fontStyle: "italic", letterSpacing: "-0.5px",
                      }}>
                        {activeTrip.location}
                      </div>
                    </div>
                  </div>
                </RevealBlock>
                {activeTrip.imageCaptions?.[activeTrip.images.length - 1] && (
                  <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "14px 48px 0" }}>
                    <p className="photo-caption">{activeTrip.imageCaptions[activeTrip.images.length - 1]}</p>
                  </div>
                )}
              </>
            )}

            {/* Bottom nav */}
            <div style={{ maxWidth: "1140px", margin: "0 auto", padding: "60px 48px 80px" }}>
              <RevealBlock>
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  borderTop: "1px solid rgba(26,26,24,0.08)", paddingTop: "44px",
                }}>
                  <span className="back-link" onClick={navigateHome} style={{
                    fontSize: "11px", letterSpacing: "2.5px", textTransform: "uppercase",
                  }}>
                    <span className="arrow">←</span> All trips
                  </span>

                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <span style={{
                      color: "#8A8780", fontSize: "10px", letterSpacing: "2px",
                      textTransform: "uppercase", marginRight: "4px",
                    }}>More journeys</span>
                    {TRIPS.filter(t => t.id !== activeTrip.id).slice(0, 3).map(trip => (
                      <div key={trip.id} className="thumb-card"
                        style={{ width: "64px", height: "44px" }}
                        onClick={() => navigateTo(trip)}
                        title={trip.location}
                      >
                        <PhotoPlaceholder trip={trip} style={{ width: "100%", height: "100%" }} />
                      </div>
                    ))}
                  </div>
                </div>
              </RevealBlock>
            </div>

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
    </div>
  );
}
