import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSavedTrails, saveTrails } from '../utils/storage';

const TrailContext = createContext(null);

const SAMPLE_TRAILS = [
  {
    id: "trail-utmb-1",
    name: "Ultra-Trail du Mont-Blanc (UTMB)",
    date: "2026-08-28",
    distanceKm: 171,
    dPlus: 9960,
    dMinus: 9960,
    status: "À venir",
    notes: "Objectif majeur de la saison. Ravitaillements à Courmayeur, Champex et Trient.",
    waypoints: [
      { name: "Chamonix (Départ)", lat: 45.9237, lng: 6.8694, ele: 1035 },
      { name: "Les Houches", lat: 45.8906, lng: 6.7983, ele: 1008 },
      { name: "Les Contamines", lat: 45.8228, lng: 6.7264, ele: 1164 },
      { name: "Courmayeur (Italie)", lat: 45.7969, lng: 6.9678, ele: 1224 },
      { name: "Champex-Lac (Suisse)", lat: 46.0278, lng: 7.1147, ele: 1466 },
      { name: "Chamonix (Arrivée)", lat: 45.9237, lng: 6.8694, ele: 1035 }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: "trail-tar-2",
    name: "Trail des Aiguilles Rouges (TAR)",
    date: "2026-09-27",
    distanceKm: 53,
    dPlus: 3800,
    dMinus: 3800,
    status: "À venir",
    notes: "Parcours technique face à la chaîne du Mont-Blanc.",
    waypoints: [
      { name: "Chamonix", lat: 45.9237, lng: 6.8694, ele: 1035 },
      { name: "Col de la Flégère", lat: 45.9606, lng: 6.8864, ele: 1877 },
      { name: "Lac Blanc", lat: 45.9819, lng: 6.9039, ele: 2352 },
      { name: "Chamonix", lat: 45.9237, lng: 6.8694, ele: 1035 }
    ],
    createdAt: new Date().toISOString()
  }
];

export function TrailProvider({ children }) {
  const [trails, setTrails] = useState([]);
  const [selectedTrail, setSelectedTrail] = useState(null);
  const [activeHoverPoint, setActiveHoverPoint] = useState(null); // Pour la synchronisation carte ↔️ profil d'altitude

  useEffect(() => {
    const loaded = getSavedTrails();
    if (loaded.length === 0) {
      setTrails(SAMPLE_TRAILS);
      saveTrails(SAMPLE_TRAILS);
    } else {
      setTrails(loaded);
    }
  }, []);

  const addTrail = (newTrail) => {
    const updated = [newTrail, ...trails];
    setTrails(updated);
    saveTrails(updated);
  };

  const deleteTrail = (id) => {
    const updated = trails.filter(t => t.id !== id);
    setTrails(updated);
    saveTrails(updated);
    if (selectedTrail?.id === id) {
      setSelectedTrail(null);
    }
  };

  return (
    <TrailContext.Provider value={{
      trails,
      addTrail,
      deleteTrail,
      selectedTrail,
      setSelectedTrail,
      activeHoverPoint,
      setActiveHoverPoint,
      reloadTrails: () => setTrails(getSavedTrails())
    }}>
      {children}
    </TrailContext.Provider>
  );
}

export function useTrails() {
  const context = useContext(TrailContext);
  if (!context) {
    throw new Error("useTrails doit être utilisé au sein de TrailProvider");
  }
  return context;
}
