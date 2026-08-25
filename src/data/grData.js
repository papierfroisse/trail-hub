// Catalogue complet des Sentiers de Grande Randonnée (GR) emblématiques
export const FAMOUS_GR_LIST = [
  {
    id: "gr20",
    name: "GR 20 - La Traversée de la Corse",
    shortName: "GR 20",
    region: "Corse",
    distanceKm: 180,
    elevationGainM: 12000,
    elevationLossM: 12000,
    recommendedDays: 15,
    difficulty: "Difficile / Expert",
    color: "#ef4444", // Red
    description: "Considéré comme l'un des sentiers les plus mythiques et techniques d'Europe. Traversée du nord au sud de la Corse par les crêtes granitiques.",
    startLocation: "Calenzana",
    endLocation: "Conca",
    waypoints: [
      { name: "Calenzana", lat: 42.5086, lng: 8.8553, ele: 275 },
      { name: "Refuge d'Ortu di u Piobbu", lat: 42.4561, lng: 8.9042, ele: 1570 },
      { name: "Refuge de Carrozzu", lat: 42.4183, lng: 8.9216, ele: 1270 },
      { name: "Haut Asco", lat: 42.4045, lng: 8.9221, ele: 1420 },
      { name: "Refuge de Tighjettu", lat: 42.3781, lng: 8.8953, ele: 1680 },
      { name: "Refuge de Ciottulu di i Mori", lat: 42.3486, lng: 8.8795, ele: 1990 },
      { name: "Manganu", lat: 42.2742, lng: 8.9567, ele: 1600 },
      { name: "Vizzavona (Étape centrale)", lat: 42.1284, lng: 9.1322, ele: 920 },
      { name: "Refuge d'Ese", lat: 42.0211, lng: 9.1351, ele: 1610 },
      { name: "Refuge de Usciolu", lat: 41.9324, lng: 9.1725, ele: 1750 },
      { name: "Refuge de Bavella", lat: 41.7961, lng: 9.2246, ele: 1215 },
      { name: "Conca", lat: 41.7353, lng: 9.3333, ele: 130 }
    ],
    stages: [
      { number: 1, name: "Calenzana ➔ Ortu di u Piobbu", distanceKm: 10.5, dPlus: 1360, dMinus: 60, timeEst: "6h30" },
      { number: 2, name: "Ortu di u Piobbu ➔ Carrozzu", distanceKm: 7.0, dPlus: 700, dMinus: 980, timeEst: "7h00" },
      { number: 3, name: "Carrozzu ➔ Haut-Asco", distanceKm: 6.0, dPlus: 800, dMinus: 640, timeEst: "6h00" },
      { number: 4, name: "Haut-Asco ➔ Tighjettu (Pointe des Décombres)", distanceKm: 9.0, dPlus: 1200, dMinus: 950, timeEst: "8h00" },
      { number: 5, name: "Tighjettu ➔ Ciottulu di i Mori", distanceKm: 6.5, dPlus: 620, dMinus: 310, timeEst: "4h00" },
      { number: 6, name: "Ciottulu di i Mori ➔ Manganu", distanceKm: 23.0, dPlus: 650, dMinus: 1040, timeEst: "8h00" },
      { number: 7, name: "Manganu ➔ Vizzavona", distanceKm: 28.0, dPlus: 1300, dMinus: 1980, timeEst: "9h30" },
      { number: 8, name: "Vizzavona ➔ Capanelle", distanceKm: 14.5, dPlus: 900, dMinus: 220, timeEst: "5h15" },
      { number: 9, name: "Capanelle ➔ Prati", distanceKm: 16.5, dPlus: 890, dMinus: 600, timeEst: "6h00" },
      { number: 10, name: "Prati ➔ Usciolu", distanceKm: 10.5, dPlus: 700, dMinus: 750, timeEst: "5h45" },
      { number: 11, name: "Usciolu ➔ Asinau", distanceKm: 15.0, dPlus: 850, dMinus: 1100, timeEst: "7h00" },
      { number: 12, name: "Asinau ➔ Paliri (Bavella)", distanceKm: 15.5, dPlus: 440, dMinus: 960, timeEst: "6h30" },
      { number: 13, name: "Paliri ➔ Conca", distanceKm: 13.0, dPlus: 160, dMinus: 950, timeEst: "5h00" }
    ]
  },
  {
    id: "tmb",
    name: "TMB - Tour du Mont-Blanc (GR TMB)",
    shortName: "TMB",
    region: "Alpes (France / Italie / Suisse)",
    distanceKm: 170,
    elevationGainM: 10000,
    elevationLossM: 10000,
    recommendedDays: 10,
    difficulty: "Moyen à Soutenu",
    color: "#3b82f6", // Blue
    description: "Le tour du géant des Alpes traversant 3 pays (France, Italie, Suisse). Paysages époustouflants de glaciers, cols alpins et vallées verdoyantes.",
    startLocation: "Les Houches (France)",
    endLocation: "Les Houches (France)",
    waypoints: [
      { name: "Les Houches", lat: 45.8906, lng: 6.7983, ele: 1008 },
      { name: "Les Contamines-Montjoie", lat: 45.8228, lng: 6.7264, ele: 1164 },
      { name: "Col de la Croix du Bonhomme", lat: 45.7236, lng: 6.7144, ele: 2479 },
      { name: "Les Chapieux", lat: 45.6961, lng: 6.7344, ele: 1550 },
      { name: "Courmayeur (Italie)", lat: 45.7969, lng: 6.9678, ele: 1224 },
      { name: "Refuge Bonatti", lat: 45.8447, lng: 7.0322, ele: 2025 },
      { name: "Grand Col Ferret (Suisse)", lat: 45.8921, lng: 7.0789, ele: 2537 },
      { name: "La Fouly", lat: 45.9333, lng: 7.0983, ele: 1600 },
      { name: "Champex-Lac", lat: 46.0278, lng: 7.1147, ele: 1466 },
      { name: "Col de la Forclaz", lat: 46.0583, lng: 7.0011, ele: 1526 },
      { name: "Trient", lat: 46.0558, lng: 6.9939, ele: 1300 },
      { name: "Col de Balme", lat: 46.0286, lng: 6.9714, ele: 2191 },
      { name: "La Flégère / Chamonix", lat: 45.9606, lng: 6.8864, ele: 1877 }
    ],
    stages: [
      { number: 1, name: "Les Houches ➔ Les Contamines", distanceKm: 16.0, dPlus: 646, dMinus: 633, timeEst: "5h00" },
      { number: 2, name: "Les Contamines ➔ Les Chapieux (Col du Bonhomme)", distanceKm: 18.0, dPlus: 1316, dMinus: 929, timeEst: "7h30" },
      { number: 3, name: "Les Chapieux ➔ Courmayeur (Col de la Seigne)", distanceKm: 24.5, dPlus: 1004, dMinus: 1320, timeEst: "8h30" },
      { number: 4, name: "Courmayeur ➔ Refuge Bonatti", distanceKm: 12.0, dPlus: 860, dMinus: 60, timeEst: "4h30" },
      { number: 5, name: "Refuge Bonatti ➔ La Fouly (Grand Col Ferret)", distanceKm: 20.0, dPlus: 890, dMinus: 1310, timeEst: "6h30" },
      { number: 6, name: "La Fouly ➔ Champex-Lac", distanceKm: 15.0, dPlus: 420, dMinus: 560, timeEst: "4h30" },
      { number: 7, name: "Champex-Lac ➔ Trient (Bovine ou Fenêtre d'Arpette)", distanceKm: 16.0, dPlus: 740, dMinus: 900, timeEst: "5h30" },
      { number: 8, name: "Trient ➔ La Flégère (Col de Balme)", distanceKm: 18.0, dPlus: 1250, dMinus: 670, timeEst: "6h45" },
      { number: 9, name: "La Flégère ➔ Les Houches (Le Brévent)", distanceKm: 17.0, dPlus: 770, dMinus: 1540, timeEst: "6h30" }
    ]
  },
  {
    id: "gr10",
    name: "GR 10 - La Traversée des Pyrénées",
    shortName: "GR 10",
    region: "Pyrénées (Atlantique à Méditerranée)",
    distanceKm: 920,
    elevationGainM: 55000,
    elevationLossM: 55000,
    recommendedDays: 50,
    difficulty: "Soutenu à Expert",
    color: "#f59e0b", // Amber
    description: "Une aventure monumentale reliant l'Océan Atlantique (Hendaye) à la Mer Méditerranée (Banyuls-sur-Mer) à travers toute la chaîne des Pyrénées.",
    startLocation: "Hendaye (64)",
    endLocation: "Banyuls-sur-Mer (66)",
    waypoints: [
      { name: "Hendaye (Atlantique)", lat: 43.3708, lng: -1.7775, ele: 5 },
      { name: "Sare", lat: 43.3125, lng: -1.5808, ele: 75 },
      { name: "Saint-Jean-Pied-de-Port", lat: 43.1636, lng: -1.2372, ele: 180 },
      { name: "La Pierre Saint-Martin", lat: 42.9731, lng: -0.7458, ele: 1650 },
      { name: "Etsaut (Vallée d'Aspe)", lat: 42.8986, lng: -0.5678, ele: 600 },
      { name: "Goust / Gourette", lat: 42.9583, lng: -0.3328, ele: 1350 },
      { name: "Cauterets", lat: 42.8894, lng: -0.1136, ele: 930 },
      { name: "Gavarnie (Cirque)", lat: 42.7356, lng: -0.0089, ele: 1370 },
      { name: "Luchon", lat: 42.7906, lng: 0.5947, ele: 630 },
      { name: "Mérens-les-Vals (Ariège)", lat: 42.6581, lng: 1.8361, ele: 1050 },
      { name: "Mont-Louis (Pyrénées-Orientales)", lat: 42.5089, lng: 2.1214, ele: 1600 },
      { name: "Banyuls-sur-Mer (Méditerranée)", lat: 42.4828, lng: 3.1292, ele: 0 }
    ],
    stages: [
      { number: 1, name: "Tronçon Pays Basque (Hendaye ➔ Saint-Jean-Pied-de-Port)", distanceKm: 75.0, dPlus: 3200, dMinus: 3000, timeEst: "3-4 Jours" },
      { number: 2, name: "Tronçon Béarn & Aspe (St-Jean ➔ Cauterets)", distanceKm: 140.0, dPlus: 8900, dMinus: 8200, timeEst: "7-8 Jours" },
      { number: 3, name: "Tronçon Hautes-Pyrénées (Cauterets ➔ Luchon)", distanceKm: 160.0, dPlus: 11000, dMinus: 11200, timeEst: "8-9 Jours" },
      { number: 4, name: "Tronçon Ariège (Luchon ➔ Mérens)", distanceKm: 220.0, dPlus: 14500, dMinus: 14000, timeEst: "11-13 Jours" },
      { number: 5, name: "Tronçon Canigou & Catalogne (Mérens ➔ Banyuls)", distanceKm: 325.0, dPlus: 17400, dMinus: 18600, timeEst: "15-17 Jours" }
    ]
  },
  {
    id: "gr54",
    name: "GR 54 - Tour de l'Oisans et des Écrins",
    shortName: "GR 54",
    region: "Alpes du Sud (Isère & Hautes-Alpes)",
    distanceKm: 176,
    elevationGainM: 12800,
    elevationLossM: 12800,
    recommendedDays: 10,
    difficulty: "Expert / Très Engagé",
    color: "#10b981", // Emerald Green
    description: "Le tour des Écrins est réputé comme le GR le plus sauvage et le plus rude des Alpes. Cols à plus de 2700m et vallées encaissées au pied des glaciers.",
    startLocation: "Bourg d'Oisans",
    endLocation: "Bourg d'Oisans",
    waypoints: [
      { name: "Bourg d'Oisans", lat: 45.0544, lng: 6.0306, ele: 720 },
      { name: "La Grave / Villar-d'Arêne", lat: 45.0458, lng: 6.3072, ele: 1500 },
      { name: "Col d'Arsine", lat: 44.9800, lng: 6.4022, ele: 2341 },
      { name: "Le Monêtier-les-Bains", lat: 44.9758, lng: 6.5078, ele: 1470 },
      { name: "Vallouise", lat: 44.8456, lng: 6.4878, ele: 1160 },
      { name: "Col de l'Aulp Martin", lat: 44.7892, lng: 6.3811, ele: 2761 },
      { name: "La Chapelle-en-Valgaudemar", lat: 44.8153, lng: 6.1897, ele: 1100 },
      { name: "Col de la Muzelle", lat: 44.9542, lng: 6.0967, ele: 2613 },
      { name: "Venosc", lat: 44.9903, lng: 6.0694, ele: 960 }
    ],
    stages: [
      { number: 1, name: "Bourg d'Oisans ➔ Le Besse (Col de Cluy)", distanceKm: 15.0, dPlus: 1200, dMinus: 400, timeEst: "6h00" },
      { number: 2, name: "Besse ➔ La Grave / Villar-d'Arêne", distanceKm: 18.0, dPlus: 900, dMinus: 850, timeEst: "6h30" },
      { number: 3, name: "Villar-d'Arêne ➔ Le Monêtier (Col d'Arsine)", distanceKm: 17.5, dPlus: 700, dMinus: 750, timeEst: "5h45" },
      { number: 4, name: "Le Monêtier ➔ Vallouise (Col de l'Eychauda)", distanceKm: 15.0, dPlus: 1000, dMinus: 1300, timeEst: "6h00" },
      { number: 5, name: "Vallouise ➔ Refuge du Pré de la Chaumette", distanceKm: 23.0, dPlus: 1650, dMinus: 1000, timeEst: "8h30" },
      { number: 6, name: "Pré de la Chaumette ➔ Valgaudemar (Col d'Aulp Martin)", distanceKm: 19.0, dPlus: 1200, dMinus: 1900, timeEst: "8h00" },
      { number: 7, name: "Valgaudemar ➔ Refuge de Valloire / La Chapelle", distanceKm: 16.0, dPlus: 1100, dMinus: 800, timeEst: "6h30" },
      { number: 8, name: "La Chapelle ➔ Le Désert en Valjouffrey", distanceKm: 14.0, dPlus: 1400, dMinus: 1500, timeEst: "7h00" },
      { number: 9, name: "Le Désert ➔ Refuge de la Muzelle", distanceKm: 12.0, dPlus: 1450, dMinus: 700, timeEst: "6h30" },
      { number: 10, name: "Refuge de la Muzelle ➔ Bourg d'Oisans", distanceKm: 13.0, dPlus: 300, dMinus: 1700, timeEst: "5h00" }
    ]
  },
  {
    id: "gr5",
    name: "GR 5 - La Grande Traversée des Alpes (GTA)",
    shortName: "GR 5",
    region: "Vosges, Jura, Alpes (du Lac Léman à Nice)",
    distanceKm: 620,
    elevationGainM: 35000,
    elevationLossM: 35000,
    recommendedDays: 35,
    difficulty: "Soutenu",
    color: "#8b5cf6", // Purple
    description: "Traversée intégrale des Alpes françaises, depuis les rives du Lac Léman (Saint-Gingolph / Thonon) jusqu'à la mer Méditerranée à Nice.",
    startLocation: "Saint-Gingolph (Lac Léman)",
    endLocation: "Nice (Promenade des Anglais)",
    waypoints: [
      { name: "Saint-Gingolph", lat: 46.3931, lng: 6.8042, ele: 375 },
      { name: "Samoëns", lat: 46.0833, lng: 6.7222, ele: 700 },
      { name: "Les Houches", lat: 45.8906, lng: 6.7983, ele: 1008 },
      { name: "Landry (Tarentaise)", lat: 45.5708, lng: 6.7417, ele: 780 },
      { name: "Tignes / Val d'Isère", lat: 45.4700, lng: 6.9097, ele: 1850 },
      { name: "Modane (Maurienne)", lat: 45.1936, lng: 6.6733, ele: 1060 },
      { name: "Briançon", lat: 44.8964, lng: 6.6358, ele: 1320 },
      { name: "Château-Ville-Vieille (Queyras)", lat: 44.7578, lng: 6.7917, ele: 1380 },
      { name: "Saint-Dalmas-le-Selvage (Mercantour)", lat: 44.2833, lng: 6.8667, ele: 1500 },
      { name: "Roure / Saint-Sauveur", lat: 44.0911, lng: 7.1517, ele: 1100 },
      { name: "Nice (Promenade des Anglais)", lat: 43.6961, lng: 7.2656, ele: 5 }
    ],
    stages: [
      { number: 1, name: "Lac Léman ➔ Samoëns (Chablais)", distanceKm: 48.0, dPlus: 3100, dMinus: 2800, timeEst: "3 Jours" },
      { number: 2, name: "Samoëns ➔ Les Houches (Haut-Giffre)", distanceKm: 42.0, dPlus: 2600, dMinus: 2300, timeEst: "2-3 Jours" },
      { number: 3, name: "Les Houches ➔ Landry (Beaufortain)", distanceKm: 65.0, dPlus: 3900, dMinus: 4100, timeEst: "4 Jours" },
      { number: 4, name: "Landry ➔ Modane (Vanoise)", distanceKm: 85.0, dPlus: 4800, dMinus: 4500, timeEst: "5 Jours" },
      { number: 5, name: "Modane ➔ Briançon (Cerveyrette)", distanceKm: 62.0, dPlus: 3400, dMinus: 3200, timeEst: "3 Jours" },
      { number: 6, name: "Briançon ➔ Saint-Dalmas (Queyras / Ubaye)", distanceKm: 110.0, dPlus: 6800, dMinus: 6600, timeEst: "6 Jours" },
      { number: 7, name: "Saint-Dalmas ➔ Nice (Mercantour & Arrière-pays)", distanceKm: 150.0, dPlus: 8400, dMinus: 9800, timeEst: "8 Jours" }
    ]
  },
  {
    id: "gr70",
    name: "GR 70 - Le Chemin de Stevenson",
    shortName: "GR 70",
    region: "Massif Central (Auvergne, Cévennes)",
    distanceKm: 272,
    elevationGainM: 7800,
    elevationLossM: 8100,
    recommendedDays: 12,
    difficulty: "Modéré",
    color: "#ec4899", // Pink/Rose
    description: "Sur les traces de l'écrivain Robert Louis Stevenson à travers le Velay, le Gévaudan, le Mont Lozère et le Parc National des Cévennes.",
    startLocation: "Le Puy-en-Velay (43)",
    endLocation: "Alès (30)",
    waypoints: [
      { name: "Le Puy-en-Velay", lat: 45.0431, lng: 3.8853, ele: 630 },
      { name: "Monastier-sur-Gazeille", lat: 44.9392, lng: 3.9953, ele: 940 },
      { name: "Pradelles", lat: 44.7694, lng: 3.8822, ele: 1150 },
      { name: "Cheylard-l'Évêque", lat: 44.6531, lng: 3.8167, ele: 1120 },
      { name: "Chasseradès", lat: 44.5514, lng: 3.8267, ele: 1170 },
      { name: "Le Bleymard (Mont Lozère)", lat: 44.4867, lng: 3.7347, ele: 1070 },
      { name: "Le Pont-de-Montvert", lat: 44.3639, lng: 3.7467, ele: 870 },
      { name: "Florac", lat: 44.3236, lng: 3.5931, ele: 540 },
      { name: "Saint-Germain-de-Calberte", lat: 44.2181, lng: 3.8094, ele: 500 },
      { name: "Alès", lat: 44.1272, lng: 4.0833, ele: 140 }
    ],
    stages: [
      { number: 1, name: "Le Puy-en-Velay ➔ Le Monastier", distanceKm: 19.0, dPlus: 550, dMinus: 240, timeEst: "5h00" },
      { number: 2, name: "Le Monastier ➔ Bouchet-Saint-Nicolas", distanceKm: 24.0, dPlus: 600, dMinus: 320, timeEst: "6h00" },
      { number: 3, name: "Bouchet-St-Nicolas ➔ Pradelles", distanceKm: 21.0, dPlus: 320, dMinus: 400, timeEst: "5h30" },
      { number: 4, name: "Pradelles ➔ Cheylard-l'Évêque", distanceKm: 21.5, dPlus: 450, dMinus: 480, timeEst: "5h30" },
      { number: 5, name: "Cheylard-l'Évêque ➔ La Bastide-Puylaurent", distanceKm: 19.5, dPlus: 480, dMinus: 580, timeEst: "5h00" },
      { number: 6, name: "La Bastide ➔ Le Bleymard", distanceKm: 17.0, dPlus: 400, dMinus: 350, timeEst: "4h30" },
      { number: 7, name: "Le Bleymard ➔ Le Pont-de-Montvert (Mont Lozère 1699m)", distanceKm: 19.0, dPlus: 650, dMinus: 850, timeEst: "5h30" },
      { number: 8, name: "Le Pont-de-Montvert ➔ Florac", distanceKm: 28.0, dPlus: 680, dMinus: 1010, timeEst: "7h30" },
      { number: 9, name: "Florac ➔ Cassagnas", distanceKm: 18.0, dPlus: 420, dMinus: 300, timeEst: "4h30" },
      { number: 10, name: "Cassagnas ➔ Saint-Germain-de-Calberte", distanceKm: 15.0, dPlus: 450, dMinus: 630, timeEst: "4h00" },
      { number: 11, name: "St-Germain ➔ Saint-Jean-du-Gard", distanceKm: 24.0, dPlus: 670, dMinus: 980, timeEst: "6h30" },
      { number: 12, name: "St-Jean-du-Gard ➔ Alès", distanceKm: 23.5, dPlus: 550, dMinus: 620, timeEst: "6h00" }
    ]
  }
];

export const DEFAULT_GEAR_ITEMS = [
  {
    id: "gear-shoes-1",
    name: "Hoka Speedgoat 5",
    category: "Chaussures",
    weightGrams: 580,
    isPacked: true,
    notes: "Accroche excellente en haute montagne"
  },
  {
    id: "gear-bag-1",
    name: "Salomon Active Skin 8 (Gilet Trail)",
    category: "Sac & Hydratation",
    weightGrams: 280,
    isPacked: true,
    notes: "Flasques 2x500ml incluses"
  },
  {
    id: "gear-bivy-1",
    name: "Tente Ferrino Sintesi 1 place",
    category: "Bivouac",
    weightGrams: 990,
    isPacked: false,
    notes: "Pour itinéraire en autonomie complète"
  },
  {
    id: "gear-cloth-1",
    name: "Veste Imperméable Gore-Tex 10k/10k",
    category: "Vêtements",
    weightGrams: 190,
    isPacked: true,
    notes: "Obligatoire en haute montagne"
  },
  {
    id: "gear-tech-1",
    name: "Lampe Frontale Petzl Nao RL 1500 lumens",
    category: "Électronique",
    weightGrams: 145,
    isPacked: true,
    notes: "Batterie rechargeable USB"
  },
  {
    id: "gear-safety-1",
    name: "Couverture de survie + Sifflet de secours",
    category: "Secours & Pharmacie",
    weightGrams: 85,
    isPacked: true,
    notes: "Matériel de sécurité obligatoire"
  },
  {
    id: "gear-nutri-1",
    name: "Poche à eau 1.5L + Gels & Barres Énergie",
    category: "Nutrition & Eau",
    weightGrams: 1800,
    isPacked: true,
    notes: "1.5 kg d'eau + 300g ravitaillement"
  }
];
