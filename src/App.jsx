import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import GrCatalog from './components/GrCatalog';
import MultiGrPlanner from './components/MultiGrPlanner';
import TrailList from './components/TrailList';
import TrailDetail from './components/TrailDetail';
import EquipmentManager from './components/EquipmentManager';
import ChecklistManager from './components/ChecklistManager';
import SettingsModal from './components/SettingsModal';

import { getSavedTrails, saveTrails, getEquipmentList, saveEquipmentList } from './utils/storage';
import { DEFAULT_GEAR_ITEMS } from './data/grData';

// Trails d'exemple si premier lancement
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

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [trails, setTrails] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [selectedTrail, setSelectedTrail] = useState(null);
  const [preselectedGrForPlanner, setPreselectedGrForPlanner] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Initialisation du stockage
  useEffect(() => {
    const loadedTrails = getSavedTrails();
    if (loadedTrails.length === 0) {
      setTrails(SAMPLE_TRAILS);
      saveTrails(SAMPLE_TRAILS);
    } else {
      setTrails(loadedTrails);
    }

    const loadedEquipment = getEquipmentList();
    setEquipmentList(loadedEquipment);
  }, []);

  // Sauvegarde auto des trails
  const handleSaveTrail = (newTrail) => {
    const updated = [newTrail, ...trails];
    setTrails(updated);
    saveTrails(updated);
  };

  const handleDeleteTrail = (id) => {
    const updated = trails.filter(t => t.id !== id);
    setTrails(updated);
    saveTrails(updated);
    if (selectedTrail && selectedTrail.id === id) {
      setSelectedTrail(null);
      setActiveTab('trails');
    }
  };

  const handleSaveEquipment = (newList) => {
    setEquipmentList(newList);
    saveEquipmentList(newList);
  };

  // Redirection depuis le catalogue GR vers le planificateur
  const handleSelectGrForPlanner = (gr) => {
    setPreselectedGrForPlanner(gr);
    setActiveTab('multi-gr-planner');
  };

  // Enregistrer un itinéraire multi-GR dans ses trails
  const handleSaveMultiGrAsPersonalTrail = (trailObj) => {
    handleSaveTrail(trailObj);
    setSelectedTrail(trailObj);
    setActiveTab('trail-detail');
  };

  return (
    <div className="app-container">
      {/* Navigation Topbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'trail-detail' && tab !== 'checklist') setSelectedTrail(null);
        }} 
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === 'dashboard' && (
          <Dashboard 
            trails={trails}
            equipmentList={equipmentList}
            onNavigateTab={setActiveTab}
            onSelectTrail={(t) => {
              setSelectedTrail(t);
              setActiveTab('trail-detail');
            }}
          />
        )}

        {activeTab === 'gr-catalog' && (
          <GrCatalog 
            onSelectGrForPlanner={handleSelectGrForPlanner}
          />
        )}

        {activeTab === 'multi-gr-planner' && (
          <MultiGrPlanner 
            preselectedGr={preselectedGrForPlanner}
            onSaveAsPersonalTrail={handleSaveMultiGrAsPersonalTrail}
          />
        )}

        {activeTab === 'trails' && (
          <TrailList 
            trails={trails}
            onSaveTrail={handleSaveTrail}
            onDeleteTrail={handleDeleteTrail}
            onSelectTrail={(t) => {
              setSelectedTrail(t);
              setActiveTab('trail-detail');
            }}
          />
        )}

        {activeTab === 'trail-detail' && selectedTrail && (
          <TrailDetail 
            trail={selectedTrail}
            onBack={() => setActiveTab('trails')}
            onOpenChecklist={() => setActiveTab('checklist')}
          />
        )}

        {activeTab === 'equipment' && (
          <EquipmentManager 
            equipmentList={equipmentList}
            onSaveEquipment={handleSaveEquipment}
          />
        )}

        {activeTab === 'checklist' && (
          <ChecklistManager 
            trail={selectedTrail}
            equipmentList={equipmentList}
            onBack={() => setActiveTab(selectedTrail ? 'trail-detail' : 'equipment')}
          />
        )}
      </main>

      {/* Settings / Options Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onReloadData={() => {
          setTrails(getSavedTrails());
          setEquipmentList(getEquipmentList());
        }}
      />
    </div>
  );
}
