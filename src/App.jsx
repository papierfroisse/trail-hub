import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import GrCatalog from './components/GrCatalog';
import MultiGrPlanner from './components/MultiGrPlanner';
import TrailList from './components/TrailList';
import TrailDetail from './components/TrailDetail';
import EquipmentManager from './components/EquipmentManager';
import ChecklistManager from './components/ChecklistManager';
import SettingsModal from './components/SettingsModal';

import { ToastProvider, useToast } from './context/ToastContext';
import { TrailProvider, useTrails } from './context/TrailContext';
import { GearProvider, useGear } from './context/GearContext';

function MainAppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [preselectedGrForPlanner, setPreselectedGrForPlanner] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { trails, addTrail, deleteTrail, selectedTrail, setSelectedTrail, reloadTrails } = useTrails();
  const { equipmentList, updateEquipmentList, reloadEquipment } = useGear();
  const { addToast } = useToast();

  const handleSaveTrail = (newTrail) => {
    addTrail(newTrail);
    addToast(`Trail "${newTrail.name}" ajouté avec succès !`, 'success');
  };

  const handleDeleteTrail = (id) => {
    deleteTrail(id);
    addToast('Trail supprimé.', 'info');
  };

  const handleSaveEquipment = (newList) => {
    updateEquipmentList(newList);
    addToast('Inventaire mis à jour.', 'success');
  };

  const handleSelectGrForPlanner = (gr) => {
    setPreselectedGrForPlanner(gr);
    setActiveTab('multi-gr-planner');
    addToast(`GR ${gr.shortName} chargé dans le planificateur !`, 'info');
  };

  const handleSaveMultiGrAsPersonalTrail = (trailObj) => {
    handleSaveTrail(trailObj);
    setSelectedTrail(trailObj);
    setActiveTab('trail-detail');
    addToast('Itinéraire Multi-GR enregistré dans vos trails !', 'success');
  };

  return (
    <div className="app-container">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'trail-detail' && tab !== 'checklist') setSelectedTrail(null);
        }} 
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

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

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onReloadData={() => {
          reloadTrails();
          reloadEquipment();
          addToast('Données réimportées avec succès !', 'success');
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <TrailProvider>
        <GearProvider>
          <MainAppContent />
        </GearProvider>
      </TrailProvider>
    </ToastProvider>
  );
}
