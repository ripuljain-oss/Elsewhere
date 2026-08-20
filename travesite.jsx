import { useState, useEffect, useRef, useCallback } from "react";
import { RECENTS as RECENTS_RAW } from "./recents";

const BASE = import.meta.env.BASE_URL || "/";
const asset = (path) => {
  if (!path) return path;
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  if (path.startsWith(BASE)) return path;
  return `${BASE}${String(path).replace(/^\//, "")}`;
};

const RECENTS = [...RECENTS_RAW]
  .map((entry) => ({ ...entry, image: asset(entry.image) }))
  .sort((a, b) => b.date.localeCompare(a.date));

const RAW_TRIPS = [
  {
    id: "Rocky Mountain National Park",
    location: "Rocky Mountain National Park",
    country: "United States",
    year: "2026",
    dates: "August 8 – 14, 2026",
    heroDate: "August 2026",
    coords: "N 40.3428°",
    tagline: "Tundra, tarns, and the Continental Divide.",
    intro: "A week on both sides of the Divide. Trail Ridge, the Bear Lake chain, Glacier Gorge — and elk in Moraine Park on the way out.",
    coverImage: "/Assets/RMNP/DSC_3271.jpg",
    featuredIndices: [9, 14],
    color1: "#1F3A4A",
    color2: "#5A6B52",
    color3: "#8B9AA0",
    accent: "#D4CDB8",
    emoji: "🏔️",
    images: [
      "/Assets/RMNP/DSC_3152.jpg",
      "/Assets/RMNP/DSC_3165.jpg",
      "/Assets/RMNP/DSC_3166.jpg",
      "/Assets/RMNP/DSC_3170.jpg",
      "/Assets/RMNP/DSC_3172.jpg",
      "/Assets/RMNP/DSC_3181.jpg",
      "/Assets/RMNP/DSC_3192.jpg",
      "/Assets/RMNP/DSC_3206.jpg",
      "/Assets/RMNP/DSC_3215.jpg",
      "/Assets/RMNP/DSC_3217.jpg",
      "/Assets/RMNP/DSC_3227.jpg",
      "/Assets/RMNP/DSC_3244.jpg",
      "/Assets/RMNP/DSC_3251.jpg",
      "/Assets/RMNP/DSC_3268.jpg",
      "/Assets/RMNP/DSC_3271.jpg",
      "/Assets/RMNP/DSC_3284.jpg",
      "/Assets/RMNP/DSC_3371.jpg",
    ],
    imageCaptions: [
      "Longs Peak from the edge of Estes Park. At 14,259 feet it is the park's highest summit and Colorado's northernmost 14,000-foot peak.",
      "A cabin in Estes Park, the east gateway to Rocky Mountain National Park. The town sits at 7,522 feet along the Big Thompson River.",
      "Trail Ridge Road above a glacially carved valley. It is the highest continuous paved highway in the United States, cresting at 12,183 feet.",
      "Adams Falls, East Inlet. The cascade drops about 55 feet through a granite gorge; Grand Lake, Colorado's largest natural lake, lies just beyond.",
      "Adams Falls from across the gorge. Named for Jay Adams, an early Grand Lake settler, it is the first landmark on the East Inlet Trail.",
      "North Inlet Trail near Grand Lake. The post lists a west-to-east traverse to Bear Lake and marks a segment of the 3,100-mile Continental Divide Trail.",
      "Trail Ridge Road from a rocky slope above the trees. Built 1929–1932, it connects Estes Park and Grand Lake across 48 miles of the park.",
      "Nymph Lake. The boys walk a fallen log among yellow pond lilies, which cover the 9,700-foot lake each summer, a half-mile above Bear Lake.",
      "A snowmelt stream between Nymph and Dream lakes. Pleistocene glaciers carved this valley, now a chain of subalpine lakes below Hallett Peak.",
      "Dream Lake and Hallett Peak (12,713 ft). The lake sits at 9,905 feet, 1.1 miles from Bear Lake, at the foot of the Continental Divide.",
      "Quaking aspens along a snowmelt creek. Aspens in the park spread by root clones — some groves have stood for thousands of years.",
      "Alberta Falls on Glacier Creek. The 30-foot cascade, 0.8 miles from the Glacier Gorge trailhead, is named for settler Alberta Sprague.",
      "Glacier Gorge Trail. Pleistocene glaciers carved this canyon; a chain of tarns now sits in the cirques below the Continental Divide.",
      "The Loch, Glacier Gorge. The tarn sits at 10,190 feet below Taylor Peak, in a watershed scientists have monitored for more than forty years.",
      "The Loch, Glacier Gorge, reflecting Taylor Peak. At 13,153 feet, Taylor Peak sits on the Continental Divide at the head of Loch Vale.",
      "A forested valley from a Glacier Gorge overlook. Engelmann spruce and subalpine fir dominate the park between about 9,000 and 11,000 feet.",
      "A cow elk in Moraine Park, Longs Peak beyond. At 14,259 feet, Longs is the only fourteener in Rocky Mountain National Park.",
    ],
  },
  {
    id: "Guatemala",
    location: "Antigua",
    country: "Guatemala",
    year: "2026",
    dates: "March 27 – April 5, 2026",
    heroDate: "March 2026",
    coords: "N 14.5586°",
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
      "Good Friday procession, Antigua. Semana Santa processions here date to the 16th century and are among the largest in Latin America.",
      "Alfombras — carpets of dyed sawdust, flowers, and pine needles — are laid overnight along procession routes and destroyed as the procession passes over them.",
      "Each block's residents design and fund their own alfombra. The work takes 8-12 hours for a procession that walks through it in minutes.",
      "Volcán de Fuego, 3,763 meters. One of Central America's most active volcanoes, with near-daily small eruptions and a major eruption as recent as 2018.",
      "La Azotea, a working coffee finca outside Jocotenango. Guatemala's volcanic soil and 1,500m+ altitude produce prized Arabica — coffee is among the country's top exports.",
      "A lancha crosses Lake Atitlán toward Volcán San Pedro. The lake fills a caldera formed by a massive eruption roughly 84,000 years ago.",
      "Lake Atitlán is ringed by three volcanoes — San Pedro, Tolimán, and Atitlán — and sits at 1,562 meters (5,125 ft). It has no natural outlet.",
      "The lakeside villages — Panajachel, San Pedro, San Marcos — are connected mostly by boat. Roads are steep and few; lanchas run dawn to dusk.",
      "The Santa Catalina Arch was built in the 17th century so cloistered nuns could cross the street to their school without being seen. The clock was added in 1830.",
      "Volcán de Agua, 3,760 meters, dormant. Named for a 1541 mudflow from its crater that destroyed the original Spanish capital at Ciudad Vieja.",
      "La Merced church. The baroque facade was completed in 1767, rebuilt after earlier earthquakes. Purple is the liturgical color of Lent.",
      "5a Avenida Norte, the main thoroughfare to the arch. Antigua's grid was laid out in 1543, when the city was founded as Santiago de los Caballeros.",
      "The Cathedral of San José, completed 1680. The 1773 Santa Marta earthquake collapsed the roof; the nave has remained open to the sky ever since.",
      "A former colonial convent in Antigua. The city's churches and civic buildings were built between 1543 and 1773, almost entirely in Spanish Baroque.",
      "Volcán de Agua dominates the horizon from nearly every street in Antigua. The city sits in a valley between three volcanoes — Agua, Fuego, and Acatenango.",
      "Alfombras are made by stenciling colored sawdust through wooden frames, often with flowers, pine needles, and fruit. The tradition came from Spain and the Canary Islands.",
      "The Santa Catalina Arch is Antigua's most photographed landmark. On clear days, Volcán de Agua is framed directly beneath it.",
    ],
  },
  {
    id: "Merida",
    location: "Mérida",
    country: "Mexico",
    year: "2025",
    heroDate: "2025",
    coords: "N 20.9674°",
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
      "A colonial church façade in Mérida's historic center. The city, founded 1542, was built on the Maya city of T'hó using stones from its dismantled temples.",
      "Casa de Montejo on Plaza Grande, completed 1549. The atlante figures flanking the entrance depict Spanish conquistadors standing on the heads of defeated Maya.",
      "A rooftop terrace in the Centro Histórico. Many of Mérida's colonial mansions have been converted into boutique hotels since the early 2000s.",
      "Cathedral of San Ildefonso on Plaza Grande, built 1562–1598. One of the oldest cathedrals on the American mainland, constructed with stones from the Maya temple that stood on the site.",
      "Saturated colors are a hallmark of Mérida's colonial streets — deep blues, ochres, and corals across single-story facades, many repainted annually.",
      "The Gran Museo del Mundo Maya, opened 2012. The vertical white slats of the facade are designed to evoke the ceiba, the sacred tree in Maya cosmology.",
    ],
  },
  {
    id: "Olympic National Park",
    location: "Olympic National Park",
    country: "United States",
    year: "2025",
    heroDate: "2025",
    coords: "N 47.8021°",
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
      "Old-growth forest, Olympic National Park. The park protects nearly a million acres across rainforest, wilderness coastline, and glaciated peaks.",
      "Sitka spruce and western hemlock dominate Olympic's lowland forests. The tallest trees here exceed 300 feet and can live over 500 years.",
      "The Hoh Rainforest receives 140+ inches of rain per year — one of the largest temperate rainforests in the United States.",
      "An early settler's homestead, preserved in the park. Homesteaders farmed the Olympic valleys before federal protection began in 1909.",
      "Mosses blanket the Hoh so thickly that acoustic ecologists have designated parts of it 'the quietest place in the contiguous US.'",
      "Lake Crescent, glacially carved and 624 feet deep. The water's unusual clarity comes from low nitrogen levels, which keep algae sparse.",
      "A dock on a quiet lake in the Olympic foothills. The Olympic Peninsula holds 1,400 square miles of protected wilderness — nearly the size of Rhode Island.",
      "Hurricane Ridge, reached by a 17-mile road climbing from sea level to 5,242 feet. On clear days, Canada's Vancouver Island is visible across the strait.",
      "The Olympic Mountains rise sharply from sea level to nearly 8,000 feet. Mount Olympus (7,980 ft) is the tallest, though clouds hide it most of the year.",
      "The ridgeline above treeline supports Roosevelt elk and black bears. Roosevelt elk are the largest elk subspecies in North America.",
      "Olympic's old-growth hemlock and spruce have never been logged, protected since the park's establishment in 1938 by Franklin D. Roosevelt.",
      "Bigleaf maples in the Hoh Rainforest drip with club moss. The mosses are epiphytes — they don't parasitize the host tree, only use it for a perch.",
      "One of Olympic's waterfalls, fed by Pacific snowmelt. The park contains over 100 named falls across its rivers and creeks.",
      "Only 5–10% of sunlight reaches the rainforest floor in summer. Seedlings often grow on fallen 'nurse logs' where light can penetrate.",
      "Red and black huckleberries ripen along Olympic's trails in late summer. Black bears forage on them heavily before winter.",
      "The Hall of Mosses trail, Hoh Rainforest. The valley's temperate climate and 140+ inches of rain support one of the densest moss ecosystems on earth.",
      "Olympic's 73-mile wilderness coastline — the longest undeveloped coastline in the contiguous US, and entirely within the park.",
    ],
  },
  {
    id: "Panama",
    location: "Panama",
    country: "Panama",
    year: "2025",
    heroDate: "2025",
    coords: "N 8.9824°",
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
      "Casco Viejo, Panama City's old quarter, founded 1673 after pirates burned the original city. UNESCO World Heritage Site since 1997.",
      "Panama City's skyline is the tallest in Central America — dozens of towers over 500 feet, most built since 2005.",
      "Casco Viejo's architecture blends Spanish colonial, French (from Canal-era engineers), and Caribbean influences across six city blocks.",
      "The financial district rises across the bay from Casco Viejo. The two Panama Citys — 17th-century and 21st-century — sit three miles apart.",
      "The Panama Canal opened in 1914. Ships are raised 85 feet through three sets of locks on each side to cross the continental divide.",
      "The bell tower of Iglesia de San José. Its Golden Altar, dating to the 1670s, was reportedly saved from pirate Henry Morgan by being painted black.",
      "Panama uses the US dollar alongside the balboa. The two currencies have circulated interchangeably since 1904.",
      "Casco Viejo is dotted with partially restored ruins. Restoration accelerated in the late 1990s after decades of neglect following the 1989 US invasion.",
      "Panama's interior is mountainous and dense — about 40% of the country is still forested, much of it protected as national parks.",
      "Panama hats are actually woven in Ecuador — the name comes from their shipment through Panama to US and European markets during the Canal era.",
      "A neighborhood spot in Casco Viejo. The district was near-abandoned through the 1980s before restoration turned it into the city's creative quarter.",
      "Casco Viejo's rooftop bars overlook both the colonial rooftops and the modern skyline across the bay — a view unique among Latin American capitals.",
    ],
  },
  {
    id: "Roatan",
    location: "Roatán",
    country: "Honduras",
    year: "2024",
    heroDate: "2024",
    coords: "N 16.3010°",
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
      "Roatan sits along the Mesoamerican Barrier Reef — the second-largest coral reef system in the world, after Australia's Great Barrier Reef.",
      "The Bay Islands were a British colony until 1861. English is still widely spoken on Roatan alongside Spanish.",
      "Roatan is about 30 miles long, built on uplifted limestone. The fringing reef starts just offshore — one of the few places divers reach deep coral walls from the beach.",
      "The island's interior is tropical hill country rising to 800 feet. Most of Roatan's development stays near the coast.",
      "Roatan sits at 16°N latitude. Water temperatures stay between 78°F and 84°F year-round.",
      "The waters around the Bay Islands are protected as a marine park — commercial fishing, anchoring on coral, and spearfishing are restricted within its boundaries.",
      "Roatan's tropical dry forest hosts parrots, agoutis, and iguanas. The island has a distinct boa constrictor population found nowhere else.",
      "Roatan lies 40 miles off the Honduran mainland. Garifuna communities — descended from peoples exiled from St. Vincent in 1797 — still live along its coast.",
      "Roatan's limestone was once a coral reef itself, formed millions of years ago and then uplifted above sea level by tectonic movement.",
    ],
  },
  {
    id: "Portugal",
    location: "Portugal",
    country: "Portugal",
    year: "2024",
    heroDate: "2024",
    coords: "N 38.7223°",
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
      "The Algarve's cliffs are limestone, sculpted by the Atlantic into sea caves, arches, and stacks. The region runs 155 km along Portugal's southern coast.",
      "A popular Lisbon street food spot. Potatoes reached Europe from the Americas in the 1500s and became a Portuguese staple by the 18th century.",
      "A Lisbon conserveira. Portugal is one of the world's largest producers of tinned fish — sardines, mackerel, tuna, and octopus, often in early-20th-century packaging.",
      "Parque Eduardo VII, Lisbon's largest central park. The geometric hedges frame a direct view down Avenida da Liberdade to the Tagus.",
      "Lisbon's rooftops are tiled in terracotta to the Tagus. The color comes from local clay, fired since Roman times.",
      "Avenida da Liberdade, Lisbon's grand boulevard, laid out in 1879. Its sidewalks are paved in calçada portuguesa — traditional limestone-and-basalt mosaic.",
      "Tram 24 was retired in 1995 and reactivated in 2018. It runs from Praça Luís de Camões up to Campolide through the Príncipe Real neighborhood.",
      "Benagil Cave on the Algarve coast. The domed ceiling and circular skylight formed naturally from millennia of marine erosion of the soft limestone.",
      "The Algarve takes its name from the Arabic 'al-gharb' — 'the west.' It was the last region of Portugal retaken from Muslim rule, in 1249.",
      "A walled town in the Alentejo, Portugal's rural south-central region. The Alentejo produces most of the country's cork, wheat, and olive oil.",
      "A medieval bell tower inside old city walls. Portugal's interior is dotted with walled towns — many built on Roman foundations and fortified during the Reconquista.",
      "Ponta da Piedade, Lagos. The yellow limestone cliffs drop 65 feet to the sea, carved into sea caves, arches, and grottos.",
      "The Atlantic erodes the Algarve's soft limestone quickly by geological standards — arches and stacks here reshape on human timescales.",
      "Cabo de São Vicente, the Algarve's southwestern tip, was considered the edge of the known world in medieval Europe. Portuguese explorers launched from nearby Sagres in the 1400s.",
      "Portuguese azulejos — painted ceramic tiles — arrived from Moorish North Africa in the 15th century. The cobalt-on-white style emerged around 1600, influenced by Chinese porcelain.",
    ],
  },
  {
    id: "Mexico City",
    location: "Mexico City",
    country: "Mexico",
    year: "2022",
    heroDate: "2022",
    coords: "N 19.4326°",
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
      "Museo Nacional de Antropología, opened 1964. Its collection includes the Aztec Sun Stone, Olmec colossal heads, and Maya stelae from across Mesoamerica.",
      "El Paraguas — 'the umbrella' — stands 28 meters tall on a single concrete column. Architect Pedro Ramírez Vázquez designed it to channel rainwater off the canopy into the courtyard pool.",
      "Teotihuacán, 40 km northeast of the city, was the largest city in the pre-Columbian Americas — an estimated 125,000 people at its peak around 500 CE. The Aztecs arrived centuries after it was abandoned.",
      "The museum's concrete facade is a signature of mid-century Mexican modernism. Pedro Ramírez Vázquez also designed the Estadio Azteca, completed two years later in 1966.",
      "Condesa was laid out in the early 1900s on the grounds of the Countess of Miravalle's estate. Its Art Deco buildings date mostly from the 1920s–40s.",
      "Mexico City sits at 7,350 feet — one of the highest capitals in the world. The altitude keeps temperatures mild year-round, rarely above 80°F.",
      "Condesa and neighboring Roma hold some of the densest canopies of jacaranda, ahuehuete, and ficus in the city — a legacy of early-20th-century urban planning.",
      "Guisados — stewed fillings like tinga, chicharrón, and rajas — are central to Mexico City's market lunch culture. Most mercados run full kitchens from sunrise to mid-afternoon.",
      "Chorizo in central Mexico is typically fresh, seasoned with chile ancho, vinegar, and garlic — distinct from the cured Spanish version.",
      "Freshly pressed tortillas, made from nixtamalized corn — a 4,000-year-old process that uses slaked lime to unlock nutrients and make the masa pliable.",
      "Mexico City has over 300 public mercados, most supplied daily from Central de Abasto — the largest wholesale market in the world by volume.",
      "The single-cut taqueria model — one meat, cooked to order — is the dominant form in Mexico City, distinct from the multi-filling restaurants common elsewhere.",
      "Tacos al pastor adapt the Lebanese shawarma, brought by immigrants in the 1920s. Pork replaced lamb; pineapple and chile marinade were Mexican additions.",
      "The standard al pastor plate — two tacos, onion, cilantro, lime, pineapple. The pineapple was originally used as a meat tenderizer before it became the defining garnish.",
    ],
  },
];

const slugify = (id) => String(id).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const altFromCaption = (caption, fallback = "") => {
  if (!caption) return fallback;
  const match = caption.match(/^[^.!?]+[.!?]?/);
  return (match ? match[0] : caption).trim();
};

const TRIPS = RAW_TRIPS
  .map((trip) => ({
    ...trip,
    slug: slugify(trip.id),
    coverImage: trip.coverImage ? asset(trip.coverImage) : trip.coverImage,
    images: (trip.images || []).map(asset),
  }))
  .sort((a, b) => (parseInt(b.year, 10) || 0) - (parseInt(a.year, 10) || 0));

const TRIPS_BY_YEAR = (() => {
  const map = new Map();
  TRIPS.forEach((trip) => {
    const list = map.get(trip.year) || [];
    list.push(trip);
    map.set(trip.year, list);
  });
  return [...map.entries()].map(([year, trips]) => ({ year, trips }));
})();

const PhotoCutline = ({ index, caption }) => {
  if (!caption) return null;
  return (
    <div className="cutline">
      <span className="plate">{String(index + 1).padStart(2, "0")}</span>
      <p className="photo-caption">{caption}</p>
    </div>
  );
};

const PhotoPlaceholder = ({ trip, style = {}, label, overlay = false, imageIndex = 0, naturalDimensions = false, loading = "lazy", src, alt, fetchPriority }) => {
  const imageSrc = src === null ? null : asset(src || (trip.images && trip.images[imageIndex]));
  const hasImage = Boolean(imageSrc);
  const imageAlt = alt || altFromCaption(trip?.imageCaptions?.[imageIndex], trip?.location || "");
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
          alt={imageAlt}
          loading={loading}
          fetchPriority={fetchPriority}
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

const formatRecentDate = (dateStr) => {
  const [y, m, d] = dateStr.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[parseInt(m,10)-1]} ${parseInt(d,10)}, ${y}`;
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
  const [activeRecent, setActiveRecent] = useState(null);
  const containerRef = useRef(null);
  const heroIntervalRef = useRef(null);
  const lightboxTouchStartRef = useRef({ x: 0 });
  const lightboxRef = useRef(null);
  const lightboxRestoreFocusRef = useRef(null);
  const [heroReady, setHeroReady] = useState(() => new Set([0, 1]));

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
  const prevTrip = currentTripIndex > 0 ? TRIPS[currentTripIndex - 1] : null;
  const nextTrip = currentTripIndex >= 0 && currentTripIndex < TRIPS.length - 1 ? TRIPS[currentTripIndex + 1] : null;

  useEffect(() => {
    if (!lightboxOpen) return;
    lightboxRestoreFocusRef.current = document.activeElement;
    const root = lightboxRef.current;
    const getFocusable = () => root ? [...root.querySelectorAll("button")] : [];
    getFocusable()[0]?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") {
        setLightboxOpen(false);
        return;
      }
      if (e.key === "Tab") {
        const list = getFocusable();
        if (!list.length) return;
        const first = list[0];
        const last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
      if (!activeTrip?.images?.length) return;
      if (e.key === "ArrowLeft") setLightboxIndex(i => (i - 1 + activeTrip.images.length) % activeTrip.images.length);
      if (e.key === "ArrowRight") setLightboxIndex(i => (i + 1) % activeTrip.images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      const restore = lightboxRestoreFocusRef.current;
      if (restore && typeof restore.focus === "function") restore.focus();
    };
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
    setHeroReady((prev) => {
      const next = new Set(prev);
      next.add(heroIdx);
      next.add((heroIdx + 1) % TRIPS.length);
      return next;
    });
  }, [heroIdx]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => setScrolled(el.scrollTop > 80);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const fadeThen = (fn) => {
    setLightboxOpen(false);
    setPageVisible(false);
    setTimeout(() => {
      fn();
      if (containerRef.current) containerRef.current.scrollTop = 0;
      requestAnimationFrame(() => setPageVisible(true));
    }, 180);
  };

  const clearHash = () => {
    const path = window.location.pathname + window.location.search;
    if (window.location.hash) history.pushState(null, "", path);
  };

  const navigateTo = (trip) => {
    fadeThen(() => {
      setActiveTrip(trip);
      setActiveRecent(null);
      setPage("trip");
      window.location.hash = trip.slug;
    });
  };

  const navigateHome = () => {
    fadeThen(() => {
      setPage("home");
      setActiveRecent(null);
      setActiveTrip(null);
      clearHash();
    });
  };

  const navigateToRecents = () => {
    fadeThen(() => {
      setPage("recents");
      setActiveRecent(null);
      setActiveTrip(null);
      window.location.hash = "recents";
    });
  };

  const navigateToRecent = (entry) => {
    fadeThen(() => {
      setActiveRecent(entry);
      setActiveTrip(null);
      setPage("recent-detail");
      window.location.hash = `recents/${entry.slug}`;
    });
  };

  useEffect(() => {
    const applyRoute = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (!hash) {
        setPage("home");
        setActiveTrip(null);
        setActiveRecent(null);
        setLightboxOpen(false);
        return;
      }
      if (hash.startsWith("recents/")) {
        const slug = hash.slice("recents/".length);
        const entry = RECENTS.find(r => r.slug === slug);
        if (entry) {
          setActiveRecent(entry);
          setActiveTrip(null);
          setPage("recent-detail");
          return;
        }
      }
      if (hash === "recents") {
        setPage("recents");
        setActiveRecent(null);
        setActiveTrip(null);
        return;
      }
      const trip = TRIPS.find(t => t.slug === hash);
      if (trip) {
        setActiveTrip(trip);
        setActiveRecent(null);
        setPage("trip");
        return;
      }
      setPage("home");
      setActiveTrip(null);
      setActiveRecent(null);
    };
    applyRoute();
    window.addEventListener("hashchange", applyRoute);
    window.addEventListener("popstate", applyRoute);
    return () => {
      window.removeEventListener("hashchange", applyRoute);
      window.removeEventListener("popstate", applyRoute);
    };
  }, []);

  const changeHero = (i) => {
    setHeroFading(true);
    setTimeout(() => { setHeroIdx(i); setHeroFading(false); }, 300);
    startHeroInterval();
  };

  const overPhotoHero = (page === "home" || page === "trip") && !scrolled;
  const headerTextColor = overPhotoHero ? "rgba(255,255,255,0.92)" : "#1A1A18";
  const headerNavColor = overPhotoHero ? "rgba(255,255,255,0.72)" : "#8A8780";

  const renderArchiveCard = (trip) => {
    const coverSrc = trip.coverImage || trip.images?.[0];
    const coverIdx = trip.images?.indexOf(coverSrc) ?? 0;
    return (
    <div className="trip-card" style={{ height: "100%" }}
      onClick={() => navigateTo(trip)}
      onMouseEnter={() => setHoveredCard(trip.id)}
      onMouseLeave={() => setHoveredCard(null)}
    >
      <div className="card-photo" style={{ position: "absolute", inset: 0 }}>
        <PhotoPlaceholder
          trip={trip}
          src={coverSrc}
          alt={altFromCaption(trip.imageCaptions?.[coverIdx >= 0 ? coverIdx : 0], trip.location)}
          style={{ width: "100%", height: "100%" }}
          loading="lazy"
        />
      </div>
      <div className="card-overlay" />
      <div className="card-label" style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        padding: "22px 20px 18px",
      }}>
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "16px",
          color: "white", fontWeight: 500, letterSpacing: "0.3px", lineHeight: 1.3,
        }}>{trip.location}</div>
        <div style={{
          color: "rgba(255,255,255,0.55)", fontSize: "10px",
          letterSpacing: "2.5px", textTransform: "uppercase",
          marginTop: "5px", fontFamily: "'DM Sans', sans-serif",
        }}>{trip.country} · {trip.year}</div>
        {trip.tagline && <div className="card-tagline">{trip.tagline}</div>}
      </div>
    </div>
    );
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#F7F4EF", height: "100vh", overflow: "hidden" }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 2px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(26,26,24,0.18); border-radius: 2px; }

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
        .trip-card .card-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.22) 52%, transparent 100%);
          transition: background 0.5s ease;
        }
        .trip-card:hover .card-overlay {
          background: linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.28) 58%, transparent 100%);
        }
        .card-tagline {
          color: rgba(255,255,255,0.72);
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 400;
          letter-spacing: 0.1px;
          line-height: 1.4;
          margin-top: 8px;
        }
        .year-block {
          display: grid;
          grid-template-columns: 120px 1fr;
          gap: 32px 40px;
          padding: 52px 0;
          border-top: 1px solid rgba(26,26,24,0.08);
        }
        .year-ledger {
          font-family: 'Cormorant Garamond', serif;
          font-size: 42px;
          font-weight: 300;
          color: #1A1A18;
          line-height: 1;
          letter-spacing: -0.5px;
          padding-top: 4px;
        }
        .year-grid-featured .trip-card { aspect-ratio: 16 / 7; }
        .year-grid-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .year-grid-3 .trip-card { aspect-ratio: 4 / 5; }
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
        .lb-text-nav:hover { color: rgba(255,255,255,0.88) !important; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroReveal {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
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

        .cutline {
          display: grid;
          grid-template-columns: 2.4em 1fr;
          column-gap: 12px;
          align-items: start;
          padding: 16px 0 0;
        }
        .plate {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 1.5px;
          color: #8A8780;
          padding-top: 6px;
        }
        .photo-caption {
          font-family: 'Cormorant Garamond', serif;
          font-style: normal;
          font-weight: 400;
          color: #1A1A18;
          font-size: 19px;
          letter-spacing: 0;
          line-height: 1.5;
          padding: 0;
          margin: 0;
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
        .block-feature .cutline {
          max-width: 1140px;
          margin: 0 auto;
          padding: 16px 48px 0;
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
          background: rgba(42,40,34,0.2);
          margin-top: 40px;
        }

        .hero-cta {
          margin-top: 36px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: rgba(255,255,255,0.88);
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          letter-spacing: 3px;
          text-transform: uppercase;
          padding: 12px 22px;
          border: 1px solid rgba(255,255,255,0.35);
          background: rgba(0,0,0,0.22);
          backdrop-filter: blur(6px);
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.22,1,0.36,1);
          animation: fadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.7s both;
        }
        .hero-cta:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.7);
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

        .recents-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .recent-card {
          cursor: pointer;
          overflow: hidden;
          position: relative;
        }
        .recent-card .recent-image {
          aspect-ratio: 3 / 2;
          overflow: hidden;
          background: #E8E3DA;
        }
        .recent-card .recent-image img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .recent-card:hover .recent-image img { transform: scale(1.05); }
        .recent-card .recent-meta {
          padding: 14px 0 0;
          font-family: 'DM Sans', sans-serif;
          color: #8A8780;
          font-size: 10px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
        }

        .recents-feed {
          max-width: 900px;
          margin: 0 auto;
          padding: 60px 48px 100px;
        }
        .recents-feed-entry {
          margin-bottom: 96px;
        }
        .recents-feed-entry img {
          width: 100%;
          display: block;
          cursor: pointer;
        }
        .recents-feed-entry .entry-meta {
          margin-top: 18px;
          padding: 12px 0 0;
          font-family: 'DM Sans', sans-serif;
          color: #8A8780;
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
        }
        .recents-feed-entry .entry-caption {
          margin-top: 10px;
          padding-left: 0;
          font-family: 'Cormorant Garamond', serif;
          font-style: normal;
          color: #1A1A18;
          font-size: 19px;
          line-height: 1.5;
        }

        @media (max-width: 700px) {
          .split-row { grid-template-columns: 1fr !important; }
          .split-row > * { height: 260px !important; }
          .hero-coords { display: none; }
          .hero-title { font-size: 3rem !important; }
          .hero-meta { letter-spacing: 2px !important; line-height: 1.7 !important; max-width: 100%; white-space: normal; }
          .section-pad { padding: 0 20px 60px !important; }
          .journal-pad { padding: 60px 20px !important; }
          .photo-journal { padding: 40px 0 20px; }
          .block-contained { padding: 0 20px; margin-bottom: 36px; }
          .block-feature { margin: 40px 0; }
          .block-feature .cutline { padding: 16px 20px 0; }
          .pair-grid { grid-template-columns: 1fr; gap: 36px; }
          .intro-block { padding: 60px 20px 20px; }
          .trip-nav { grid-template-columns: 1fr; padding: 0 20px; gap: 16px; }
          .trip-nav-card { height: 160px; }
          header { padding: 14px 20px !important; }
          .header-brand { flex-direction: column !important; align-items: flex-start !important; gap: 2px !important; }
          .header-dash { display: none !important; }
          .header-author { font-size: 11px !important; }
          .hero-text { left: 20px !important; right: 20px !important; bottom: 90px !important; }
          .hero-tagline { font-size: 17px !important; }
          .hero-dots { bottom: 28px !important; right: 20px !important; }
          .recents-grid { grid-template-columns: 1fr; gap: 28px; }
          .recents-feed { padding: 40px 20px 60px; }
          .recents-feed-entry { margin-bottom: 60px; }
          .year-block { grid-template-columns: 1fr; gap: 12px; padding: 36px 0; }
          .year-ledger { font-size: 28px; }
          .year-grid-3 { grid-template-columns: 1fr; }
          .year-grid-featured .trip-card { aspect-ratio: 4 / 5; }
        }
      `}</style>

      {/* ─── HEADER ─── */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        padding: "22px 48px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        backdropFilter: scrolled ? "blur(24px) saturate(180%)" : "none",
        background: scrolled ? "rgba(247,244,239,0.88)" : "transparent",
        borderBottom: scrolled ? "1px solid rgba(26,26,24,0.08)" : "1px solid transparent",
        transition: "all 0.6s cubic-bezier(0.22,1,0.36,1)",
      }}>
        <div className="header-brand" onClick={navigateHome} style={{
          cursor: "pointer",
          display: "flex", alignItems: "baseline", gap: "14px",
          transition: "color 0.5s ease",
          textShadow: overPhotoHero ? "0 1px 16px rgba(0,0,0,0.45)" : "none",
        }}>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "13px", letterSpacing: "5px", textTransform: "uppercase",
            color: headerTextColor, fontWeight: 400,
          }}>
            Elsewhere
          </span>
          <span className="header-dash" style={{ color: headerNavColor, opacity: overPhotoHero ? 0.7 : 0.4 }}>—</span>
          <span className="header-author" style={{
            fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
            fontSize: "13px", color: headerNavColor, opacity: overPhotoHero ? 0.95 : 0.55,
          }}>
            by Ripul Jain
          </span>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: "22px",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase",
          color: headerNavColor, fontWeight: 400,
          transition: "color 0.5s ease",
          textShadow: overPhotoHero ? "0 1px 16px rgba(0,0,0,0.45)" : "none",
        }}>
          <span className="nav-item" onClick={navigateToRecents} style={{ cursor: "pointer" }}>
            Recents
          </span>
        </div>
      </header>

      {/* ─── SCROLLABLE CONTENT ─── */}
      <div ref={containerRef} style={{
        height: "100vh", overflowY: "auto", overflowX: "hidden",
        opacity: pageVisible ? 1 : 0,
        transition: "opacity 0.18s ease",
      }}>

        {/* ══════════════════════════════ HOME PAGE ══════════════════════════════ */}
        {page === "home" && (
          <div>

            {/* Hero */}
            <div
              style={{ height: "100vh", position: "relative", overflow: "hidden" }}
              onMouseEnter={() => clearInterval(heroIntervalRef.current)}
              onMouseLeave={() => startHeroInterval()}
            >

              {/* Background photos crossfade — load active + next only */}
              {TRIPS.map((trip, i) => {
                const coverSrc = trip.coverImage || trip.images?.[0];
                const coverIdx = trip.images?.indexOf(coverSrc) ?? 0;
                const shouldLoad = heroReady.has(i) || i === heroIdx || i === (heroIdx + 1) % TRIPS.length;
                return (
                  <div key={trip.id} style={{
                    position: "absolute", inset: 0,
                    opacity: heroIdx === i ? (heroFading ? 0 : 1) : 0,
                    transition: "opacity 1.4s cubic-bezier(0.4,0,0.2,1)",
                  }}>
                    <PhotoPlaceholder
                      trip={trip}
                      src={shouldLoad ? coverSrc : null}
                      alt={altFromCaption(trip.imageCaptions?.[coverIdx >= 0 ? coverIdx : 0], trip.location)}
                      fetchPriority={i === 0 ? "high" : undefined}
                      loading={i === 0 ? "eager" : "lazy"}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </div>
                );
              })}

              {/* Gradient overlays — top wash for header, deep floor for type */}
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to bottom, rgba(26,26,24,0.62) 0%, rgba(26,26,24,0.22) 14%, transparent 30%, rgba(26,26,24,0.5) 58%, rgba(26,26,24,0.9) 80%, rgba(26,26,24,0.96) 100%)",
              }} />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to right, rgba(0,0,0,0.12) 0%, transparent 55%)",
              }} />

              {/* Hero text */}
              <div key={TRIPS[heroIdx].id} className="hero-text" style={{
                position: "absolute", bottom: "44px", left: "48px", right: "48px",
                maxWidth: "820px",
              }}>
                <div className="hero-meta" style={{
                  fontSize: "10px", letterSpacing: "3px",
                  textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.7)",
                  marginBottom: "20px",
                  animation: "fadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.2s both",
                }}>
                  <span className="hero-coords">{TRIPS[heroIdx].coords}{" · "}</span>
                  {TRIPS[heroIdx].location}
                  {" · "}{TRIPS[heroIdx].country}
                  {" · "}{TRIPS[heroIdx].heroDate || TRIPS[heroIdx].year}
                </div>
                <h1 className="hero-title" style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(3.5rem, 8vw, 7.5rem)",
                  fontWeight: 300, color: "white", lineHeight: 0.9,
                  letterSpacing: "-2.5px",
                  margin: 0,
                  textShadow: "0 2px 28px rgba(0,0,0,0.35)",
                  animation: "heroReveal 1.3s cubic-bezier(0.22,1,0.36,1) 0.1s both",
                }}>
                  {TRIPS[heroIdx].location}.
                </h1>
                <p className="hero-tagline" style={{
                  marginTop: "24px",
                  maxWidth: "540px",
                  color: "rgba(255,255,255,0.88)",
                  fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
                  fontSize: "22px", lineHeight: 1.35,
                  animation: "fadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.4s both",
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
              <div className="hero-dots" style={{
                position: "absolute", bottom: "48px", right: "48px",
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

            {/* Year archive */}
            <div className="section-pad" style={{ padding: "56px 48px 24px", maxWidth: "1280px", margin: "0 auto" }}>
              <RevealBlock>
                <div style={{
                  display: "flex", alignItems: "baseline", justifyContent: "space-between",
                  paddingBottom: "8px",
                }}>
                  <h2 style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "10px", fontWeight: 400,
                    color: "#8A8780", letterSpacing: "2.5px", textTransform: "uppercase",
                  }}>Destinations</h2>
                  <span style={{
                    color: "#8A8780", fontSize: "10px", letterSpacing: "2.5px",
                    textTransform: "uppercase", fontWeight: 400,
                  }}>{TRIPS.length} journeys</span>
                </div>
              </RevealBlock>

              {TRIPS_BY_YEAR.map((group, gi) => {
                const isNewest = gi === 0;
                const featuredTrip = isNewest ? group.trips[0] : null;
                const rest = isNewest ? group.trips.slice(1) : group.trips;
                return (
                  <div key={group.year} className="year-block">
                    <div className="year-ledger">{group.year}</div>
                    <div>
                      {featuredTrip && (
                        <RevealBlock>
                          <div className="year-grid-featured">
                            {renderArchiveCard(featuredTrip)}
                          </div>
                        </RevealBlock>
                      )}
                      {rest.length > 0 && (
                        <div className="year-grid-3" style={{ marginTop: featuredTrip ? 16 : 0 }}>
                          {rest.map((trip, i) => (
                            <RevealBlock key={trip.id} delay={i * 0.06}>
                              {renderArchiveCard(trip)}
                            </RevealBlock>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Notebook — recents, demoted */}
            {RECENTS.length > 0 && (
              <div className="section-pad" style={{ padding: "28px 48px 64px", maxWidth: "1280px", margin: "0 auto" }}>
                <RevealBlock>
                  <div style={{
                    display: "flex", alignItems: "baseline", justifyContent: "space-between",
                    paddingBottom: "16px", borderBottom: "1px solid rgba(26,26,24,0.07)",
                    gap: "24px",
                  }}>
                    <div>
                      <h2 style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "10px", fontWeight: 400,
                        color: "#8A8780", letterSpacing: "2.5px", textTransform: "uppercase",
                      }}>Notebook</h2>
                      <div style={{
                        marginTop: "6px",
                        color: "#8A8780", fontSize: "10px", letterSpacing: "2.5px",
                        textTransform: "uppercase", fontWeight: 400,
                      }}>Mostly shot on mobile</div>
                    </div>
                    <span onClick={navigateToRecents} className="nav-item" style={{
                      cursor: "pointer", whiteSpace: "nowrap",
                      color: "#8A8780", fontSize: "10px", letterSpacing: "2.5px",
                      textTransform: "uppercase", fontWeight: 400,
                    }}>See all →</span>
                  </div>
                </RevealBlock>
                <div className="recents-grid" style={{ marginTop: "20px" }}>
                  {RECENTS.slice(0, 3).map((entry, i) => (
                    <RevealBlock key={entry.slug} delay={i * 0.06}>
                      <div className="recent-card" onClick={() => navigateToRecent(entry)}>
                        <div className="recent-image">
                          <img src={entry.image} alt={altFromCaption(entry.caption, entry.location)} loading="lazy" />
                        </div>
                        <div className="recent-meta">
                          {formatRecentDate(entry.date)} · {entry.location}
                        </div>
                      </div>
                    </RevealBlock>
                  ))}
                </div>
              </div>
            )}

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
                alt={altFromCaption(
                  activeTrip.imageCaptions?.[Math.max(0, activeTrip.images.indexOf(activeTrip.coverImage || activeTrip.images?.[0]))],
                  activeTrip.location
                )}
                loading="eager"
                fetchPriority="high"
                style={{ width: "100%", height: "100%" }}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to bottom, rgba(26,26,24,0.58) 0%, rgba(26,26,24,0.18) 20%, rgba(26,26,24,0.28) 50%, rgba(26,26,24,0.78) 78%, rgba(26,26,24,0.88) 100%)",
              }} />
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                textAlign: "center", padding: "0 48px",
              }}>
                <p style={{
                  color: "rgba(255,255,255,0.62)", fontSize: "10px", letterSpacing: "5px",
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
                  background: "rgba(255,255,255,0.3)",
                  margin: "30px auto 0",
                  animation: "lineGrow 1s cubic-bezier(0.22,1,0.36,1) 0.8s both",
                  transformOrigin: "left",
                }} />
                <p style={{
                  color: "rgba(255,255,255,0.85)",
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: "italic",
                  fontSize: "22px",
                  lineHeight: 1.35,
                  letterSpacing: 0,
                  textTransform: "none",
                  maxWidth: "540px",
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
                            alt={altFromCaption(activeTrip.imageCaptions?.[idx], activeTrip.location)}
                            loading="lazy"
                            onClick={() => { setLightboxIndex(idx); setLightboxOpen(true); }}
                          />
                          <PhotoCutline index={idx} caption={activeTrip.imageCaptions?.[idx]} />
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
                                  alt={altFromCaption(activeTrip.imageCaptions?.[idx], activeTrip.location)}
                                  loading="lazy"
                                  onClick={() => { setLightboxIndex(idx); setLightboxOpen(true); }}
                                />
                                <PhotoCutline index={idx} caption={activeTrip.imageCaptions?.[idx]} />
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
                          alt={altFromCaption(activeTrip.imageCaptions?.[idx], activeTrip.location)}
                          loading="lazy"
                          onClick={() => { setLightboxIndex(idx); setLightboxOpen(true); }}
                        />
                        <PhotoCutline index={idx} caption={activeTrip.imageCaptions?.[idx]} />
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
                {!prevTrip && nextTrip && <div />}
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
                        color: "rgba(255,255,255,0.55)", fontSize: "10px",
                        letterSpacing: "3px", textTransform: "uppercase",
                        marginBottom: "6px", fontFamily: "'DM Sans', sans-serif",
                      }}>
                        ← Previous
                      </div>
                      <div style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "16px",
                        color: "white", fontWeight: 500, letterSpacing: "0.3px", lineHeight: 1.3,
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
                        color: "rgba(255,255,255,0.55)", fontSize: "10px",
                        letterSpacing: "3px", textTransform: "uppercase",
                        marginBottom: "6px", fontFamily: "'DM Sans', sans-serif",
                      }}>
                        Next →
                      </div>
                      <div style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "16px",
                        color: "white", fontWeight: 500, letterSpacing: "0.3px", lineHeight: 1.3,
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

        {/* ══════════════════════════════ RECENTS ARCHIVE ══════════════════════════════ */}
        {page === "recents" && (
          <div>
            <div style={{
              maxWidth: "1140px", margin: "0 auto", padding: "140px 48px 60px",
              borderBottom: "1px solid rgba(26,26,24,0.08)", textAlign: "center",
            }}>
              <RevealBlock>
                <div style={{
                  color: "#8A8780", fontSize: "10px", letterSpacing: "5px",
                  textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif",
                  marginBottom: "22px",
                }}>
                  Elsewhere · Journal
                </div>
                <h1 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(3rem, 6vw, 5rem)",
                  color: "#1A1A18", fontWeight: 300, lineHeight: 1,
                  letterSpacing: "-1px",
                }}>
                  Recent Photos
                </h1>
                <div style={{
                  width: "36px", height: "1px", background: "rgba(42,40,34,0.2)",
                  margin: "28px auto",
                }} />
                <p style={{
                  color: "#8A8780", fontSize: "11px", letterSpacing: "3px",
                  textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif",
                }}>
                  Mostly shot on mobile
                </p>
              </RevealBlock>
            </div>

            <div className="recents-feed">
              {RECENTS.map((entry, i) => (
                <RevealBlock key={entry.slug} delay={Math.min(0.2, i * 0.04)}>
                  <div className="recents-feed-entry">
                    <img
                      src={entry.image}
                      alt={altFromCaption(entry.caption, entry.location)}
                      loading="lazy"
                      onClick={() => navigateToRecent(entry)}
                    />
                    <div className="entry-meta">
                      {formatRecentDate(entry.date)} · {entry.location}
                    </div>
                    <p className="entry-caption">{entry.caption}</p>
                  </div>
                </RevealBlock>
              ))}
            </div>

            <div style={{ maxWidth: "1140px", margin: "0 auto 80px", padding: "0 48px" }}>
              <RevealBlock>
                <div style={{
                  borderTop: "1px solid rgba(26,26,24,0.08)", paddingTop: "36px",
                }}>
                  <span className="back-link" onClick={navigateHome} style={{
                    fontSize: "11px", letterSpacing: "2.5px", textTransform: "uppercase",
                  }}>
                    <span className="arrow">←</span> All destinations
                  </span>
                </div>
              </RevealBlock>
            </div>

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

        {/* ══════════════════════════════ RECENT DETAIL ══════════════════════════════ */}
        {page === "recent-detail" && activeRecent && (
          <div>
            <div style={{
              maxWidth: "1140px", margin: "0 auto", padding: "140px 48px 28px",
            }}>
              <RevealBlock>
                <span className="back-link" onClick={navigateToRecents} style={{
                  fontSize: "11px", letterSpacing: "2.5px", textTransform: "uppercase",
                }}>
                  <span className="arrow">←</span> All recents
                </span>
              </RevealBlock>
            </div>

            <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 48px 40px" }}>
              <RevealBlock>
                <img
                  src={activeRecent.image}
                  alt={altFromCaption(activeRecent.caption, activeRecent.location)}
                  loading="eager"
                  fetchPriority="high"
                  style={{ width: "100%", display: "block", cursor: "pointer" }}
                />
              </RevealBlock>
            </div>

            <div style={{ maxWidth: "900px", margin: "0 auto 100px", padding: "0 48px" }}>
              <RevealBlock>
                <div style={{
                  padding: "12px 0 0",
                  fontFamily: "'DM Sans', sans-serif",
                  color: "#8A8780",
                  fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase",
                }}>
                  {formatRecentDate(activeRecent.date)} · {activeRecent.location}
                </div>
                <p style={{
                  marginTop: "10px",
                  fontFamily: "'Cormorant Garamond', serif", fontStyle: "normal",
                  color: "#1A1A18", fontSize: "19px", lineHeight: 1.5, maxWidth: "680px",
                }}>
                  {activeRecent.caption}
                </p>
              </RevealBlock>
            </div>

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
          ref={lightboxRef}
          role="dialog"
          aria-modal="true"
          aria-label="Photo lightbox"
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "#1A1A18",
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
            color: "rgba(255,255,255,0.55)", fontSize: "11px", letterSpacing: "3px",
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
              background: "none", border: "none", color: "rgba(255,255,255,0.75)",
              fontSize: "28px", cursor: "pointer", padding: "8px", lineHeight: 1,
            }}
          >
            ×
          </button>
          {activeTrip.images.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous photo"
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => (i - 1 + activeTrip.images.length) % activeTrip.images.length); }}
                style={{
                  position: "absolute", left: "28px", top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none",
                  color: "rgba(255,255,255,0.5)",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase",
                  cursor: "pointer", padding: "12px 8px",
                }}
                className="lb-text-nav"
              >
                ← Prev
              </button>
              <button
                type="button"
                aria-label="Next photo"
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => (i + 1) % activeTrip.images.length); }}
                style={{
                  position: "absolute", right: "28px", top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none",
                  color: "rgba(255,255,255,0.5)",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase",
                  cursor: "pointer", padding: "12px 8px",
                }}
                className="lb-text-nav"
              >
                Next →
              </button>
            </>
          )}
          <div
            style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", maxWidth: "min(1100px, 100%)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeTrip.images[lightboxIndex]}
              alt={altFromCaption(activeTrip.imageCaptions?.[lightboxIndex], activeTrip.location)}
              loading="lazy"
              style={{ maxWidth: "100%", maxHeight: "calc(100vh - 160px)", objectFit: "contain" }}
            />
            {activeTrip.imageCaptions?.[lightboxIndex] && (
              <p style={{
                marginTop: "20px",
                color: "rgba(255,255,255,0.88)",
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "normal",
                fontSize: "19px",
                lineHeight: 1.5,
                textAlign: "left",
                maxWidth: "720px",
              }}>
                {activeTrip.imageCaptions[lightboxIndex]}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
