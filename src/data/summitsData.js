// Base de données des Grands Sommets des Alpes & Pyrénées (Alpinisme & Randonnée Alpine)
// Sources de référence : FFCAM (Club Alpin Français), CAI (Club Alpino Italiano), Camptocamp, guides officiels

export const ALPS_SUMMITS_LIST = [
  // ──────────────────────────── MONT-BLANC (4808m) ────────────────────────────
  {
    id: "mont-blanc",
    name: "Mont Blanc — Voie Royale du Goûter",
    shortName: "Mont Blanc (4808m)",
    massif: "Massif du Mont-Blanc",
    country: "France",
    elevationM: 4808,
    valleyElevationM: 2372, // Nid d'Aigle
    elevationGainM: 2436,
    difficulty: "PD- (Peu Difficile)",
    routeType: "Glaciaire & Arête de neige",
    recommendedDays: 2,
    color: "#3b82f6",
    description: "Le toit de l'Europe occidentale. Voie normale par le refuge du Goûter, l'arête des Bosses et le Dôme du Goûter. Une ascension mythique nécessitant acclimatation, excellente condition physique et encadrement alpin.",
    officialUrl: "https://www.ffcam.fr/",
    gearRequired: ["Crampons 12 pointes", "Piolet classique", "Baudrier + Corde 50m", "Casque d'alpinisme", "Lunettes cat. 4", "Veste thermique grand froid", "DVA / Pelle / Sonde"],
    refuge: {
      name: "Refuge du Goûter (FFCAM)",
      elevationM: 3835,
      capacity: 120,
      wardenPeriod: "Juin à Septembre",
      lat: 45.851,
      lng: 6.830,
      url: "https://refugedugouter.ffcam.fr/"
    },
    waypoints: [
      { name: "Nid d'Aigle (Départ TMB)", lat: 45.858, lng: 6.797, ele: 2372 },
      { name: "Refuge de Tête Rousse", lat: 45.854, lng: 6.818, ele: 3167 },
      { name: "Traversée du Couloir du Goûter", lat: 45.853, lng: 6.824, ele: 3340 },
      { name: "Refuge du Goûter", lat: 45.851, lng: 6.830, ele: 3835 },
      { name: "Dôme du Goûter", lat: 45.839, lng: 6.844, ele: 4304 },
      { name: "Abri Vallot (Secours)", lat: 45.834, lng: 6.852, ele: 4362 },
      { name: "Arête des Bosses", lat: 45.833, lng: 6.858, ele: 4547 },
      { name: "Sommet du Mont Blanc", lat: 45.832, lng: 6.865, ele: 4808 }
    ],
    stages: [
      { number: 1, name: "Nid d'Aigle (2372m) ➔ Refuge du Goûter (3835m)", distanceKm: 5.5, dPlus: 1463, dMinus: 0, timeEst: "5h00" },
      { number: 2, name: "Refuge du Goûter ➔ Sommet du Mont Blanc ➔ Descente", distanceKm: 12.0, dPlus: 973, dMinus: 2436, timeEst: "10h00" }
    ]
  },

  // ──────────────────────────── DÔME DE NEIGE DES ÉCRINS (4015m) ────────────────────────────
  {
    id: "dome-ecrins",
    name: "Dôme de Neige des Écrins — Voie Normale",
    shortName: "Dôme des Écrins (4015m)",
    massif: "Massif des Écrins",
    country: "France",
    elevationM: 4015,
    valleyElevationM: 1874, // Pré de Madame Carle
    elevationGainM: 2141,
    difficulty: "F+ (Facile supérieur)",
    routeType: "Glaciaire (Glacier Blanc)",
    recommendedDays: 2,
    color: "#06b6d4",
    description: "Le 4000 le plus accessible des Alpes françaises. Une splendide remontée du Glacier Blanc au cœur du Parc National des Écrins, idéale pour s'initier à la haute montagne et aux 4000.",
    officialUrl: "https://www.ecrins-parcnational.fr/",
    gearRequired: ["Crampons", "Piolet", "Corde d'alpinisme", "Baudrier", "Broches à glace", "Casque", "Vêtements d'alpinisme"],
    refuge: {
      name: "Refuge des Écrins (FFCAM)",
      elevationM: 3175,
      capacity: 118,
      wardenPeriod: "Avril à Septembre",
      lat: 44.935,
      lng: 6.388,
      url: "https://refugedesecrins.ffcam.fr/"
    },
    waypoints: [
      { name: "Pré de Madame Carle (Parking)", lat: 44.917, lng: 6.417, ele: 1874 },
      { name: "Refuge du Glacier Blanc", lat: 44.929, lng: 6.402, ele: 2542 },
      { name: "Refuge des Écrins", lat: 44.935, lng: 6.388, ele: 3175 },
      { name: "Plateau du Glacier Blanc", lat: 44.937, lng: 6.372, ele: 3400 },
      { name: "La Brèche Lory (Rimaye)", lat: 44.929, lng: 6.357, ele: 3974 },
      { name: "Sommet du Dôme de Neige", lat: 44.927, lng: 6.354, ele: 4015 }
    ],
    stages: [
      { number: 1, name: "Pré de Madame Carle ➔ Refuge des Écrins", distanceKm: 7.2, dPlus: 1300, dMinus: 0, timeEst: "4h30" },
      { number: 2, name: "Refuge des Écrins ➔ Sommet du Dôme ➔ Retour Vallée", distanceKm: 13.5, dPlus: 840, dMinus: 2141, timeEst: "8h00" }
    ]
  },

  // ──────────────────────────── GRAND PARADIS (4061m) ────────────────────────────
  {
    id: "gran-paradiso",
    name: "Grand Paradis — Voie Normale par Victor-Emmanuel",
    shortName: "Grand Paradis (4061m)",
    massif: "Massif du Grand-Paradis",
    country: "Italie (Val d'Aoste)",
    elevationM: 4061,
    valleyElevationM: 1960, // Pont Valsavarenche
    elevationGainM: 2101,
    difficulty: "F+ (Facile / Mixte final)",
    routeType: "Glacier & Arête rocheuse finale",
    recommendedDays: 2,
    color: "#10b981",
    description: "Le seul sommet de plus de 4000m entièrement situé en Italie. Situé au cœur du plus ancien parc national italien, il offre un panorama grandiose sur tout l'arc alpin du Mont-Blanc au Mont Rose.",
    officialUrl: "https://www.pngp.it/",
    gearRequired: ["Crampons", "Piolet", "Corde", "Baudrier", "Casque", "Matériel de sécurité glacier"],
    refuge: {
      name: "Rifugio Vittorio Emanuele II (CAI)",
      elevationM: 2735,
      capacity: 120,
      wardenPeriod: "Avril à Septembre",
      lat: 45.518,
      lng: 7.234,
      url: "https://www.rifugiovittorioemanuele.com/"
    },
    waypoints: [
      { name: "Pont (Valsavarenche)", lat: 45.529, lng: 7.202, ele: 1960 },
      { name: "Refuge Victor-Emmanuel II", lat: 45.518, lng: 7.234, ele: 2735 },
      { name: "La Schiena d'Asino (Dos d'Âne)", lat: 45.522, lng: 7.251, ele: 3500 },
      { name: "Le Col du Grand Paradis", lat: 45.518, lng: 7.262, ele: 3880 },
      { name: "La Vierge du Sommet", lat: 45.520, lng: 7.271, ele: 4061 }
    ],
    stages: [
      { number: 1, name: "Pont Valsavarenche ➔ Refuge Victor-Emmanuel", distanceKm: 5.0, dPlus: 775, dMinus: 0, timeEst: "2h30" },
      { number: 2, name: "Refuge ➔ Sommet du Grand Paradis ➔ Pont", distanceKm: 12.0, dPlus: 1326, dMinus: 2101, timeEst: "8h30" }
    ]
  },

  // ──────────────────────────── BARRE DES ÉCRINS (4102m) ────────────────────────────
  {
    id: "barre-ecrins",
    name: "Barre des Écrins — Arête Ouest",
    shortName: "Barre des Écrins (4102m)",
    massif: "Massif des Écrins",
    country: "France",
    elevationM: 4102,
    valleyElevationM: 1874,
    elevationGainM: 2228,
    difficulty: "PD+ / AD- (Arête mixte aérienne)",
    routeType: "Glaciaire & Escalade rocheuse (II/III)",
    recommendedDays: 2,
    color: "#f59e0b",
    description: "Le point culminant du massif des Écrins et le 4000 le plus méridional des Alpes. L'ascension finale par l'arête Ouest au-dessus de la face Sud est un grand classique d'alpinisme d'envergure.",
    officialUrl: "https://www.ecrins-parcnational.fr/",
    gearRequired: ["Crampons", "Piolet", "Corde 50m", "Sangles & Mousquetons", "Baudrier", "Casque"],
    refuge: {
      name: "Refuge des Écrins (FFCAM)",
      elevationM: 3175,
      capacity: 118,
      wardenPeriod: "Avril à Septembre",
      lat: 44.935,
      lng: 6.388,
      url: "https://refugedesecrins.ffcam.fr/"
    },
    waypoints: [
      { name: "Pré de Madame Carle", lat: 44.917, lng: 6.417, ele: 1874 },
      { name: "Refuge des Écrins", lat: 44.935, lng: 6.388, ele: 3175 },
      { name: "Brèche Lory", lat: 44.929, lng: 6.357, ele: 3974 },
      { name: "Pic Lory", lat: 44.928, lng: 6.356, ele: 4088 },
      { name: "Sommet de la Barre des Écrins", lat: 44.926, lng: 6.359, ele: 4102 }
    ],
    stages: [
      { number: 1, name: "Pré de Madame Carle ➔ Refuge des Écrins", distanceKm: 7.2, dPlus: 1300, dMinus: 0, timeEst: "4h30" },
      { number: 2, name: "Refuge ➔ Arête Ouest ➔ Sommet ➔ Descente", distanceKm: 14.0, dPlus: 927, dMinus: 2228, timeEst: "9h30" }
    ]
  },

  // ──────────────────────────── MONT ROSE / POINTE GNIFETTI (4554m) ────────────────────────────
  {
    id: "mont-rose",
    name: "Mont Rose — Pointe Gnifetti & Refuge Margherita",
    shortName: "Mont Rose / Gnifetti (4554m)",
    massif: "Massif du Mont-Rose",
    country: "Italie / Suisse",
    elevationM: 4554,
    valleyElevationM: 3275, // Punta Indren (téléphérique Gressoney)
    elevationGainM: 1279,
    difficulty: "F / PD- (Glacier majestueux)",
    routeType: "Glaciaire haute altitude",
    recommendedDays: 2,
    color: "#ec4899",
    description: "La Pointe Gnifetti (Signalkuppe) abrite le refuge le plus haut d'Europe : la cabane Reine Marguerite (4554m). Une immersion spectaculaire dans le deuxième plus haut massif d'Europe.",
    officialUrl: "https://www.rifugimonterosa.it/",
    gearRequired: ["Crampons", "Piolet", "Corde de glacier", "Baudrier", "Broches à glace", "Vêtements d'expédition"],
    refuge: {
      name: "Capanna Regina Margherita (CAI)",
      elevationM: 4554,
      capacity: 70,
      wardenPeriod: "Juin à Septembre",
      lat: 45.927,
      lng: 7.876,
      url: "https://www.rifugimonterosa.it/"
    },
    waypoints: [
      { name: "Punta Indren (Arrivée Téléphérique)", lat: 45.882, lng: 7.834, ele: 3275 },
      { name: "Refuge Mantova", lat: 45.892, lng: 7.844, ele: 3498 },
      { name: "Cabane Gnifetti", lat: 45.898, lng: 7.849, ele: 3647 },
      { name: "Col du Lys (Lysjoch)", lat: 45.918, lng: 7.868, ele: 4248 },
      { name: "Col Gnifetti", lat: 45.926, lng: 7.871, ele: 4452 },
      { name: "Pointe Gnifetti / Cabane Marguerite", lat: 45.927, lng: 7.876, ele: 4554 }
    ],
    stages: [
      { number: 1, name: "Punta Indren ➔ Cabane Gnifetti (3647m)", distanceKm: 3.5, dPlus: 372, dMinus: 0, timeEst: "2h00" },
      { number: 2, name: "Cabane Gnifetti ➔ Sommet Pointe Gnifetti ➔ Descente", distanceKm: 10.0, dPlus: 907, dMinus: 1279, timeEst: "7h00" }
    ]
  },

  // ──────────────────────────── MONT VISO (3841m) ────────────────────────────
  {
    id: "mont-viso",
    name: "Mont Viso — Voie Normale Sud",
    shortName: "Mont Viso (3841m)",
    massif: "Alpes Cottiennes (Queyras / Piémont)",
    country: "Italie / France",
    elevationM: 3841,
    valleyElevationM: 2020, // Pian del Re
    elevationGainM: 1821,
    difficulty: "PD (Escalade II/III facile)",
    routeType: "Arête & Paroi rocheuse alpine",
    recommendedDays: 2,
    color: "#8b5cf6",
    description: "Le 'Roi de Pierre' des Alpes du Sud. Une pyramide rocheuse isolée visible depuis toute la plaine du Pô et le Queyras. L'ascension rocheuse par la face Sud offre une ambiance alpine exceptionnelle.",
    officialUrl: "https://www.parcomonviso.eu/",
    gearRequired: ["Casque d'alpinisme", "Corde 40m", "Baudrier", "Sangles", "Chaussures d'approche / rocher"],
    refuge: {
      name: "Rifugio Quintino Sella (CAI)",
      elevationM: 2640,
      capacity: 90,
      wardenPeriod: "Juin à Septembre",
      lat: 44.672,
      lng: 7.106,
      url: "https://www.rifugiosella.it/"
    },
    waypoints: [
      { name: "Pian del Re (Source du Pô)", lat: 44.701, lng: 7.093, ele: 2020 },
      { name: "Colle del Viso", lat: 44.678, lng: 7.100, ele: 2650 },
      { name: "Refuge Quintino Sella", lat: 44.672, lng: 7.106, ele: 2640 },
      { name: "Passo delle Sagnette", lat: 44.664, lng: 7.086, ele: 2991 },
      { name: "Bivacco Andreotti", lat: 44.665, lng: 7.091, ele: 3225 },
      { name: "Sommet du Mont Viso", lat: 44.668, lng: 7.091, ele: 3841 }
    ],
    stages: [
      { number: 1, name: "Pian del Re ➔ Refuge Quintino Sella", distanceKm: 6.0, dPlus: 650, dMinus: 30, timeEst: "2h45" },
      { number: 2, name: "Refuge ➔ Sommet du Mont Viso ➔ Retour", distanceKm: 10.5, dPlus: 1201, dMinus: 1821, timeEst: "8h00" }
    ]
  },

  // ──────────────────────────── AIGUILLE DU TOUR (3540m) ────────────────────────────
  {
    id: "aiguille-du-tour",
    name: "Aiguille du Tour — Voie Normale du Col Supérieur",
    shortName: "Aiguille du Tour (3540m)",
    massif: "Massif du Mont-Blanc",
    country: "France / Suisse",
    elevationM: 3540,
    valleyElevationM: 2190, // Télésiège de Charamillon
    elevationGainM: 1350,
    difficulty: "F+ (Facile / Rocher II final)",
    routeType: "Glacier du Tour & Arête rocheuse",
    recommendedDays: 2,
    color: "#14b8a6",
    description: "Le sommet d'initiation par excellence dans le massif du Mont-Blanc. Montée sur le glacier du Tour puis petite escalade facile sur du granite parfait au sommet face au Chardonnet et à l'Argentière.",
    officialUrl: "https://www.ffcam.fr/",
    gearRequired: ["Crampons", "Piolet", "Corde 40m", "Baudrier", "Casque"],
    refuge: {
      name: "Refuge Albert 1er (FFCAM)",
      elevationM: 2702,
      capacity: 130,
      wardenPeriod: "Juin à Septembre",
      lat: 45.999,
      lng: 6.991,
      url: "https://refugealbert1er.ffcam.fr/"
    },
    waypoints: [
      { name: "Col de Balme / Charamillon", lat: 46.004, lng: 6.960, ele: 2190 },
      { name: "Refuge Albert 1er", lat: 45.999, lng: 6.991, ele: 2702 },
      { name: "Col Supérieur du Tour", lat: 45.994, lng: 7.012, ele: 3288 },
      { name: "Sommet Sud de l'Aiguille du Tour", lat: 45.997, lng: 7.009, ele: 3540 }
    ],
    stages: [
      { number: 1, name: "Télésiège ➔ Refuge Albert 1er", distanceKm: 4.5, dPlus: 512, dMinus: 0, timeEst: "2h00" },
      { number: 2, name: "Refuge ➔ Sommet ➔ Retour Vallée", distanceKm: 9.0, dPlus: 838, dMinus: 1350, timeEst: "6h30" }
    ]
  },

  // ──────────────────────────── ROCHE FAURIO (3730m) ────────────────────────────
  {
    id: "roche-faurio",
    name: "Roche Faurio — Voie Normale Sud",
    shortName: "Roche Faurio (3730m)",
    massif: "Massif des Écrins",
    country: "France",
    elevationM: 3730,
    valleyElevationM: 1874,
    elevationGainM: 1856,
    difficulty: "F (Randonnée alpine glaciaire)",
    routeType: "Glacier Blanc & Arête facile",
    recommendedDays: 2,
    color: "#f43f5e",
    description: "Le plus beau belvédère sur la face Nord de la Barre des Écrins. Une course glaciaire facile et très esthétique au cœur du parc des Écrins.",
    officialUrl: "https://www.ecrins-parcnational.fr/",
    gearRequired: ["Crampons", "Piolet", "Corde", "Baudrier", "Casque"],
    refuge: {
      name: "Refuge des Écrins (FFCAM)",
      elevationM: 3175,
      capacity: 118,
      wardenPeriod: "Avril à Septembre",
      lat: 44.935,
      lng: 6.388,
      url: "https://refugedesecrins.ffcam.fr/"
    },
    waypoints: [
      { name: "Pré de Madame Carle", lat: 44.917, lng: 6.417, ele: 1874 },
      { name: "Refuge des Écrins", lat: 44.935, lng: 6.388, ele: 3175 },
      { name: "Arête Sud-Est", lat: 44.951, lng: 6.377, ele: 3550 },
      { name: "Sommet de la Roche Faurio", lat: 44.954, lng: 6.374, ele: 3730 }
    ],
    stages: [
      { number: 1, name: "Pré de Madame Carle ➔ Refuge des Écrins", distanceKm: 7.2, dPlus: 1300, dMinus: 0, timeEst: "4h30" },
      { number: 2, name: "Refuge ➔ Roche Faurio ➔ Retour Vallée", distanceKm: 12.0, dPlus: 555, dMinus: 1856, timeEst: "7h00" }
    ]
  },

  // ──────────────────────────── VIGNEMALE (3298m) — PYRÉNÉES ────────────────────────────
  {
    id: "vignemale",
    name: "Pique Longue du Vignemale — Voie Normale par le Glacier d'Ossoue",
    shortName: "Vignemale (3298m)",
    massif: "Pyrénées (Hautes-Pyrénées)",
    country: "France / Espagne",
    elevationM: 3298,
    valleyElevationM: 1834, // Barrage d'Ossoue
    elevationGainM: 1464,
    difficulty: "F+ (Glacier & Escalade facile)",
    routeType: "Glacier d'Ossoue & Rocher final",
    recommendedDays: 2,
    color: "#a855f7",
    description: "Le point culminant des Pyrénées françaises (3298m). Remontée du seul glacier de type alpin des Pyrénées avec visite des grottes du Comte Russell et vue plongeante sur la spectaculaire face Nord de 800m.",
    officialUrl: "https://www.pyrenees-parcnational.fr/",
    gearRequired: ["Crampons", "Piolet", "Baudrier + Corde", "Casque d'alpinisme"],
    refuge: {
      name: "Refuge de Bayssellance (FFCAM)",
      elevationM: 2651,
      capacity: 92,
      wardenPeriod: "Mai à Octobre",
      lat: 42.774,
      lng: -0.134,
      url: "https://refugedebayssellance.ffcam.fr/"
    },
    waypoints: [
      { name: "Barrage d'Ossoue (Parking)", lat: 42.748, lng: -0.098, ele: 1834 },
      { name: "Refuge de Bayssellance", lat: 42.774, lng: -0.134, ele: 2651 },
      { name: "Glacier d'Ossoue (Base)", lat: 42.772, lng: -0.145, ele: 2750 },
      { name: "Grottes Russell", lat: 42.774, lng: -0.151, ele: 3200 },
      { name: "Sommet de la Pique Longue", lat: 42.773, lng: -0.153, ele: 3298 }
    ],
    stages: [
      { number: 1, name: "Barrage d'Ossoue ➔ Refuge de Bayssellance", distanceKm: 5.5, dPlus: 817, dMinus: 0, timeEst: "2h45" },
      { number: 2, name: "Refuge ➔ Sommet du Vignemale ➔ Retour Parking", distanceKm: 10.5, dPlus: 647, dMinus: 1464, timeEst: "7h00" }
    ]
  }
];
