// Fichier de données pour les Véloroutes / Voies Vertes en France
// Contient les tracés de base, les étapes et les points d'intérêt (eau, toilettes, etc.)

export const BIKE_ROUTES_LIST = [
  {
    id: "viarhona",
    name: "ViaRhôna (EuroVelo 17)",
    shortName: "ViaRhôna",
    type: "Véloroute",
    region: "Auvergne-Rhône-Alpes & PACA",
    distanceKm: 815,
    elevationGainM: 1900,
    recommendedDays: 14,
    difficulty: "Facile / Familial",
    color: "#0ea5e9", // Sky Blue
    description: "Du lac Léman à la mer Méditerranée, la ViaRhôna vous conduit le long du fleuve Rhône. Un itinéraire idéal pour le cyclotourisme en famille, alternant voies vertes sécurisées et routes partagées.",
    startLocation: "Saint-Gingolph (Lac Léman)",
    endLocation: "Port-Saint-Louis-du-Rhône / Sète",
    waypoints: [
      { name: "Saint-Gingolph", lat: 46.393, lng: 6.804, ele: 375 },
      { name: "Thonon-les-Bains", lat: 46.372, lng: 6.478, ele: 425 },
      { name: "Genève", lat: 46.204, lng: 6.143, ele: 375 },
      { name: "Seyssel", lat: 45.958, lng: 5.831, ele: 260 },
      { name: "Lagnieu", lat: 45.922, lng: 5.348, ele: 200 },
      { name: "Lyon", lat: 45.764, lng: 4.835, ele: 170 },
      { name: "Vienne", lat: 45.525, lng: 4.876, ele: 155 },
      { name: "Tournon-sur-Rhône", lat: 45.068, lng: 4.832, ele: 125 },
      { name: "Valence", lat: 44.933, lng: 4.892, ele: 120 },
      { name: "Montélimar", lat: 44.558, lng: 4.750, ele: 80 },
      { name: "Avignon", lat: 43.949, lng: 4.806, ele: 20 },
      { name: "Arles", lat: 43.676, lng: 4.630, ele: 10 },
      { name: "Port-Saint-Louis-du-Rhône", lat: 43.387, lng: 4.805, ele: 2 }
    ],
    stages: [
      { number: 1, name: "St-Gingolph ➔ Thonon ➔ Genève", distanceKm: 70, dPlus: 320, timeEst: "4h00" },
      { number: 2, name: "Genève ➔ Seyssel", distanceKm: 60, dPlus: 450, timeEst: "3h30" },
      { number: 3, name: "Seyssel ➔ Belley ➔ Lagnieu", distanceKm: 85, dPlus: 280, timeEst: "5h00" },
      { number: 4, name: "Lagnieu ➔ Lyon (Parc de la Tête d'Or)", distanceKm: 65, dPlus: 120, timeEst: "3h45" },
      { number: 5, name: "Lyon ➔ Vienne", distanceKm: 35, dPlus: 80, timeEst: "2h00" },
      { number: 6, name: "Vienne ➔ Sablons", distanceKm: 33, dPlus: 50, timeEst: "1h50" },
      { number: 7, name: "Sablons ➔ Tournon-sur-Rhône", distanceKm: 38, dPlus: 70, timeEst: "2h15" },
      { number: 8, name: "Tournon ➔ Valence", distanceKm: 25, dPlus: 30, timeEst: "1h30" },
      { number: 9, name: "Valence ➔ Montélimar", distanceKm: 62, dPlus: 110, timeEst: "3h45" },
      { number: 10, name: "Montélimar ➔ Pont-Saint-Esprit", distanceKm: 42, dPlus: 80, timeEst: "2h30" },
      { number: 11, name: "Pont-Saint-Esprit ➔ Avignon", distanceKm: 48, dPlus: 60, timeEst: "2h45" },
      { number: 12, name: "Avignon ➔ Beaucaire ➔ Arles", distanceKm: 47, dPlus: 50, timeEst: "2h45" },
      { number: 13, name: "Arles ➔ Port-Saint-Louis-du-Rhône", distanceKm: 45, dPlus: 10, timeEst: "2h30" }
    ],
    // Points d'intérêt (toilettes, eau, etc.)
    pois: [
      { type: "toilet", name: "Toilettes Publiques - Port de Thonon", lat: 46.375, lng: 6.479, notes: "Gratuit, accessible PMR" },
      { type: "water", name: "Fontaine d'Eau Potable - Parc de Genève", lat: 46.208, lng: 6.155, notes: "Eau potable gratuite" },
      { type: "toilet", name: "Toilettes Publiques - Gare de Seyssel", lat: 45.957, lng: 5.834, notes: "Ouvert 7j/7" },
      { type: "repair", name: "Borne de Réparation Vélo - Culoz", lat: 45.849, lng: 5.782, notes: "Outils en libre service et pompe à pied" },
      { type: "water", name: "Point d'eau - Halte Nautique de Lagnieu", lat: 45.918, lng: 5.342, notes: "Robinet extérieur d'eau potable" },
      { type: "toilet", name: "Toilettes - Parc de la Tête d'Or (Lyon)", lat: 45.779, lng: 4.854, notes: "Plusieurs blocs dans le parc" },
      { type: "water", name: "Fontaine - Berges du Rhône (Lyon)", lat: 45.760, lng: 4.839, notes: "Eau potable sur la voie verte" },
      { type: "toilet", name: "Toilettes - Port de Plaisance de Vienne", lat: 45.528, lng: 4.871, notes: "Proche de la piste cyclable" },
      { type: "repair", name: "Atelier Vélo Coopératif - Valence", lat: 44.931, lng: 4.896, notes: "Réparation assistée et vente de pièces" },
      { type: "toilet", name: "Toilettes & Eau - Halte de Rochemaure", lat: 44.588, lng: 4.708, notes: "Au pied de la passerelle Himalayenne" },
      { type: "water", name: "Point d'eau - Office de Tourisme de Montélimar", lat: 44.556, lng: 4.747, notes: "Disponible aux horaires d'ouverture" },
      { type: "toilet", name: "Toilettes - Halte fluviale de Pont-Saint-Esprit", lat: 44.251, lng: 4.652, notes: "Propre et gratuit" },
      { type: "water", name: "Point d'eau - Île de la Barthelasse (Avignon)", lat: 43.958, lng: 4.802, notes: "Près du camping municipal" },
      { type: "toilet", name: "Toilettes Publiques - Place Lamartine (Arles)", lat: 43.681, lng: 4.631, notes: "Payant (0.50€)" }
    ]
  },
  {
    id: "loireavelo",
    name: "La Loire à Vélo (EuroVelo 6)",
    shortName: "Loire à Vélo",
    type: "Véloroute",
    region: "Centre-Val de Loire & Pays de la Loire",
    distanceKm: 900,
    elevationGainM: 950,
    recommendedDays: 15,
    difficulty: "Très Facile / Plat",
    color: "#22c55e", // Green
    description: "Parcourez la vallée des Rois de France. Châteaux de la Loire, vignobles, îles sauvages et paysages fluviaux d'exception classés à l'UNESCO. Une piste cyclable entièrement plate et sécurisée.",
    startLocation: "Cuffy (près de Nevers)",
    endLocation: "Saint-Brevin-les-Pins (Atlantique)",
    waypoints: [
      { name: "Nevers", lat: 46.991, lng: 3.160, ele: 180 },
      { name: "La Charité-sur-Loire", lat: 47.177, lng: 3.017, ele: 160 },
      { name: "Sancerre", lat: 47.330, lng: 2.840, ele: 310 },
      { name: "Briare", lat: 47.641, lng: 2.738, ele: 135 },
      { name: "Orléans", lat: 47.903, lng: 1.908, ele: 110 },
      { name: "Blois", lat: 47.586, lng: 1.334, ele: 75 },
      { name: "Amboise", lat: 47.412, lng: 0.983, ele: 60 },
      { name: "Tours", lat: 47.394, lng: 0.684, ele: 50 },
      { name: "Saumur", lat: 47.260, lng: -0.078, ele: 30 },
      { name: "Angers", lat: 47.473, lng: -0.551, ele: 20 },
      { name: "Nantes", lat: 47.218, lng: -1.553, ele: 10 },
      { name: "Saint-Nazaire", lat: 47.274, lng: -2.213, ele: 5 },
      { name: "Saint-Brevin-les-Pins", lat: 47.218, lng: -2.170, ele: 2 }
    ],
    stages: [
      { number: 1, name: "Nevers ➔ La Charité-sur-Loire", distanceKm: 32, dPlus: 30, timeEst: "2h00" },
      { number: 2, name: "La Charité ➔ Sancerre", distanceKm: 30, dPlus: 80, timeEst: "1h50" },
      { number: 3, name: "Sancerre ➔ Briare (Pont-canal)", distanceKm: 48, dPlus: 40, timeEst: "2h45" },
      { number: 4, name: "Briare ➔ Sully-sur-Loire", distanceKm: 42, dPlus: 30, timeEst: "2h30" },
      { number: 5, name: "Sully ➔ Orléans", distanceKm: 48, dPlus: 20, timeEst: "2h45" },
      { number: 6, name: "Orléans ➔ Beaugency ➔ Blois", distanceKm: 65, dPlus: 50, timeEst: "3h45" },
      { number: 7, name: "Blois ➔ Amboise", distanceKm: 40, dPlus: 60, timeEst: "2h15" },
      { number: 8, name: "Amboise ➔ Tours", distanceKm: 30, dPlus: 30, timeEst: "1h45" },
      { number: 9, name: "Tours ➔ Villandry ➔ Saumur", distanceKm: 62, dPlus: 80, timeEst: "3h30" },
      { number: 10, name: "Saumur ➔ Angers (Bouchemaine)", distanceKm: 55, dPlus: 70, timeEst: "3h15" },
      { number: 11, name: "Angers ➔ Ancenis", distanceKm: 65, dPlus: 40, timeEst: "3h45" },
      { number: 12, name: "Ancenis ➔ Nantes", distanceKm: 40, dPlus: 30, timeEst: "2h15" },
      { number: 13, name: "Nantes ➔ Saint-Brevin (L'Estuaire)", distanceKm: 60, dPlus: 20, timeEst: "3h30" }
    ],
    pois: [
      { type: "water", name: "Point d'eau - Gare de Nevers", lat: 46.994, lng: 3.151, notes: "Eau potable en gare" },
      { type: "toilet", name: "Toilettes Publiques - Sancerre (Canal)", lat: 47.332, lng: 2.851, notes: "Au pied de la colline" },
      { type: "toilet", name: "Toilettes - Pont-canal de Briare", lat: 47.643, lng: 2.731, notes: "Côté Briare port" },
      { type: "water", name: "Fontaine d'eau - Quai du Chatelet (Orléans)", lat: 47.901, lng: 1.912, notes: "Sur le quai piéton/vélo" },
      { type: "repair", name: "Borne de Réparation - Château de Chambord", lat: 47.616, lng: 1.517, notes: "Près des parkings vélo" },
      { type: "toilet", name: "Toilettes - Château de Villandry", lat: 47.340, lng: 0.513, notes: "En face des guichets" },
      { type: "water", name: "Point d'eau - Port de Saumur", lat: 47.262, lng: -0.076, notes: "Près de l'Office de Tourisme" },
      { type: "toilet", name: "Toilettes - Quai de la Fosse (Nantes)", lat: 47.209, lng: -1.569, notes: "Sanitaire automatique" },
      { type: "repair", name: "Atelier vélo Mobile - Le Voyage à Nantes", lat: 47.215, lng: -1.554, notes: "Réparations d'urgence en saison" }
    ]
  }
];
