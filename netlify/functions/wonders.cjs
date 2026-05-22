const commonsImage = (fileName) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=1600`;

const wonders = [
  {
    slug: "great-wall-of-china",
    name: "Great Wall of China",
    country: "China",
    coordinates: { lat: 40.4319, lng: 116.5704 },
    built: "7th century BCE onward",
    type: "Fortification network",
    lead: "A monumental defensive system crossing mountains, deserts, and ancient trade routes in northern China.",
    summary:
      "The Great Wall is not one continuous wall but a vast network of walls, watchtowers, barracks, passes, and signal stations. Earlier states began building defensive barriers centuries before the Qin dynasty linked several of them. The Ming dynasty later created many of the dramatic stone and brick sections seen today near Beijing.",
    facts: [
      "Its surviving sections stretch across thousands of kilometers of northern China.",
      "Beacon towers used smoke and fire signals to communicate across long distances.",
      "The wall protected borders, controlled movement, and helped regulate trade routes."
    ],
    images: [
      commonsImage("The_Great_Wall_of_China_at_Jinshanling-edit.jpg"),
      commonsImage("Great_Wall_of_China_July_2006.JPG")
    ]
  },
  {
    slug: "petra",
    name: "Petra",
    country: "Jordan",
    coordinates: { lat: 30.3285, lng: 35.4444 },
    built: "1st century BCE to 2nd century CE",
    type: "Rock-cut city",
    lead: "A rose-colored city carved into sandstone cliffs by the Nabataeans, once a powerful desert trade capital.",
    summary:
      "Petra flourished because the Nabataeans mastered water control and positioned their city at the meeting point of major caravan routes. Its facades, tombs, temples, and engineered channels show a culture that blended Arabian, Hellenistic, Egyptian, and Roman influences.",
    facts: [
      "The famous Treasury is a carved royal tomb, not a treasury.",
      "Petra's water channels and cisterns supported life in an arid landscape.",
      "The narrow Siq canyon creates one of archaeology's most dramatic entrances."
    ],
    images: [commonsImage("Petra_Jordan_BW_21.JPG"), commonsImage("Treasury_petra_crop.jpeg")]
  },
  {
    slug: "christ-the-redeemer",
    name: "Christ the Redeemer",
    country: "Brazil",
    coordinates: { lat: -22.9519, lng: -43.2105 },
    built: "1922 to 1931",
    type: "Art Deco statue",
    lead: "An Art Deco monument standing above Rio de Janeiro with arms extended over the city and Guanabara Bay.",
    summary:
      "Designed by Brazilian engineer Heitor da Silva Costa with work by sculptor Paul Landowski, Christ the Redeemer became one of the world's most recognizable modern monuments. Its reinforced concrete and soapstone surface were chosen for strength, texture, and weather resistance.",
    facts: [
      "The statue stands on Corcovado Mountain inside Tijuca National Park.",
      "It is about 30 meters tall, not counting its pedestal.",
      "Its silhouette has become an international symbol of Rio de Janeiro."
    ],
    images: [
      commonsImage("Christ_the_Redeemer_-_Cristo_Redentor.jpg"),
      commonsImage("Cristo_Redentor_-_Rio_de_Janeiro,_Brasil.jpg")
    ]
  },
  {
    slug: "machu-picchu",
    name: "Machu Picchu",
    country: "Peru",
    coordinates: { lat: -13.1631, lng: -72.545 },
    built: "15th century",
    type: "Inca citadel",
    lead: "A high mountain Inca citadel set between steep Andean peaks and sophisticated agricultural terraces.",
    summary:
      "Machu Picchu was built during the height of the Inca Empire and is often linked to the reign of Pachacuti. Its stone architecture, terracing, astronomical alignments, and water channels reveal remarkable planning in a difficult mountain environment.",
    facts: [
      "Its stones were shaped to fit together without mortar.",
      "Terraces helped manage farming, drainage, and slope stability.",
      "The site sits above the Urubamba River valley."
    ],
    images: [commonsImage("Machu_Picchu,_Peru.jpg"), commonsImage("Before_Machu_Picchu.jpg")]
  },
  {
    slug: "chichen-itza",
    name: "Chichen Itza",
    country: "Mexico",
    coordinates: { lat: 20.6843, lng: -88.5678 },
    built: "600 to 1200 CE",
    type: "Maya city",
    lead: "A major Maya city on the Yucatan Peninsula, famous for El Castillo and its precise astronomical symbolism.",
    summary:
      "Chichen Itza was one of the most influential cities of the northern Maya lowlands. Its architecture reflects Maya and central Mexican influences, with temples, ball courts, platforms, and sacred cenotes that supported civic, religious, and political life.",
    facts: [
      "El Castillo is associated with solar alignments during equinox periods.",
      "The Great Ball Court is among the largest known in Mesoamerica.",
      "Sacred cenotes were central to ritual and water access."
    ],
    images: [commonsImage("Chichen_Itza_3.jpg"), commonsImage("El_Castillo,_Chichen_Itza.jpg")]
  },
  {
    slug: "colosseum",
    name: "Colosseum",
    country: "Italy",
    coordinates: { lat: 41.8902, lng: 12.4922 },
    built: "70 to 80 CE",
    type: "Roman amphitheatre",
    lead: "Rome's immense amphitheatre, built for public spectacles and engineered on a scale that still feels astonishing.",
    summary:
      "The Colosseum was commissioned under Emperor Vespasian and completed under Titus. It could host tens of thousands of spectators for gladiatorial contests, staged hunts, processions, and public events, using vaults, corridors, seating tiers, and underground service areas to control movement and spectacle.",
    facts: [
      "Its original name was the Flavian Amphitheatre.",
      "The hypogeum beneath the arena held machinery, corridors, and holding areas.",
      "Its concrete and stone engineering influenced stadium design for centuries."
    ],
    images: [commonsImage("Colosseo_2020.jpg"), commonsImage("Colosseum_in_Rome,_Italy_-_April_2007.jpg")]
  },
  {
    slug: "taj-mahal",
    name: "Taj Mahal",
    country: "India",
    coordinates: { lat: 27.1751, lng: 78.0421 },
    built: "1632 to 1653",
    type: "Mughal mausoleum",
    lead: "A white marble mausoleum in Agra, created by Shah Jahan in memory of Mumtaz Mahal.",
    summary:
      "The Taj Mahal is one of the finest achievements of Mughal architecture, combining Persian, Islamic, and Indian design traditions. Its marble dome, minarets, gardens, reflecting pool, calligraphy, and inlaid stonework were planned as a unified expression of symmetry and memory.",
    facts: [
      "Its marble changes tone with the light throughout the day.",
      "The complex includes gardens, mosque, guest house, gates, and riverfront terraces.",
      "Pietra dura inlay adds floral and geometric detail to the marble surfaces."
    ],
    images: [commonsImage("Taj-Mahal.jpg"), commonsImage("Taj_Mahal_(Edited).jpeg")]
  }
];

exports.handler = async (event) => {
  const slug = event.queryStringParameters?.slug;
  const payload = slug ? wonders.find((wonder) => wonder.slug === slug) : wonders;

  if (!payload) {
    return {
      statusCode: 404,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ error: "Wonder not found" })
    };
  }

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=300"
    },
    body: JSON.stringify(payload)
  };
};
