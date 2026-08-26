# 🏔️ TrailHub - Gestionnaire de Trails & Planificateur Multi-GR

> Application web moderne pour planifier vos courses de Trail Running, composer des itinéraires multi-GR (Sentiers de Grande Randonnée), analyser vos traces GPX avec cartes et profils d'altitude, et gérer le poids de votre sac à dos.

---

## ✨ Fonctionnalités Principales

- **🥾 Catalogue des Grands GR (Sentiers de Grande Randonnée)**
  - Base de données intégrée des sentiers emblématiques : **GR20 (Corse), Tour du Mont-Blanc (TMB), GR10 (Pyrénées), GR54 (Écrins), GR5 (GTA), GR70 (Stevenson)**.
  - Découpage par étape (distance, D+, D-, temps estimé).

- **🔀 Planificateur d'Itinéraire Multi-GR (Création Sur-Mesure)**
  - Assemblage interactif de plusieurs tronçons de GR différents pour composer une traversée personnalisée.
  - Calcul dynamique de la distance totale, du dénivelé cumulé (D+) et du nombre d'étapes.
  - **Export GPX natif** du tracé combiné et sauvegarde dans vos projets.

- **🗺️ Visualisation GPX & Cartographie Interactive**
  - Importation et analyse automatique de fichiers `.gpx` directement dans le navigateur.
  - Carte interactive (Leaflet / OpenStreetMap) avec tracé et marqueurs d'étapes.
  - **Profil d'altitude dynamique** (Chart.js) avec survol interactif distance vs altitude.

- **🎒 Inventaire d'Équipement & Calculateur de Sac à Dos**
  - Gestion par catégorie (Chaussures, Sac & Hydratation, Vêtements, Bivouac, Électronique, Secours, Nutrition).
  - Calcul du **Poids de Base** (hors consommables) et du **Poids Total** du sac.
  - Checklist interactive de préparation avec barre de progression.

- **💾 Sauvegarde & Portabilité 100% Locale**
  - Données conservées sans inscription dans le stockage local (LocalStorage / IndexedDB).
  - Import et export complet des données au format JSON.

---

## 🛠️ Tech Stack

| Élément | Technologie |
|---|---|
| **Framework** | React 18 + Vite |
| **Styling** | Custom CSS Design Tokens (Dark Slate Theme + Glassmorphism) |
| **Cartographie** | Leaflet.js + React-Leaflet |
| **Graphiques** | Chart.js + React-Chartjs-2 |
| **Icônes** | Lucide React |
| **Analyseur GPX** | Parser XML natif (Formule de Haversine) |

---

## 🚀 Prise en main & Installation

### Prérequis
- [Node.js](https://nodejs.org/) (v18+)
- `npm` ou `yarn`

### Installation locale

```bash
# 1. Cloner le projet
git clone https://github.com/votre-compte/trail-hub.git

# 2. Accéder au dossier
cd trail-hub

# 3. Installer les dépendances
npm install

# 4. Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:5173/`.

### Build de Production

```bash
npm run build
```

Les fichiers optimisés seront générés dans le dossier `dist/`.

---

## 📂 Structure du Projet

```
trail-hub/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx               # Barre de navigation principale
│   │   ├── Dashboard.jsx            # Tableau de bord et statistiques
│   │   ├── GrCatalog.jsx            # Catalogue des Grands GR
│   │   ├── MultiGrPlanner.jsx       # Planificateur multi-GR combiné
│   │   ├── TrailList.jsx            # Gestionnaire de trails & upload GPX
│   │   ├── TrailDetail.jsx          # Détails d'un trail (Carte + Alti)
│   │   ├── GpxMap.jsx               # Composant carte Leaflet
│   │   ├── ElevationProfile.jsx     # Graphique du profil d'altitude
│   │   ├── EquipmentManager.jsx     # Inventaire du matériel
│   │   ├── ChecklistManager.jsx     # Checklist sac & poids
│   │   └── SettingsModal.jsx        # Export / Import JSON
│   ├── data/
│   │   └── grData.js                # Base de données des GRs & matériel
│   ├── utils/
│   │   ├── gpxParser.js             # Parser / Générateur GPX & Haversine
│   │   └── storage.js               # Gestionnaire LocalStorage
│   ├── App.jsx                      # Composant racine
│   ├── index.css                    # Thème CSS & variables
│   └── main.jsx                     # Point d'entrée React
├── package.json
├── vite.config.js
├── SOURCES.md                   # Répertoire complet des sources officielles
└── README.md
```

---

## 📚 Sources & Références Officielles

Toutes les données d'itinéraires (GR®, Véloroutes, étapes, dénivelés, hébergements) sont documentées et adossées aux organismes officiels gestionnaires (FFRandonnée, Parcs Nationaux, IGN, EuroVelo).

Consultez le fichier complet : **[SOURCES.md](./SOURCES.md)**.

---

## 📄 Licence & Propriété Intellectuelle

- Ce projet est sous licence MIT.
- Les appellations **GR®**, **GRP®**, **PR®** et les balisages associés sont des marques déposées de la **Fédération Française de la Randonnée Pédestre (FFRandonnée)**.
