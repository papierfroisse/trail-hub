import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import GrCatalog from './components/GrCatalog';
import BikeCatalog from './components/BikeCatalog';
import MultiGrPlanner from './components/MultiGrPlanner';
import TrailList from './components/TrailList';
import TrailDetail from './components/TrailDetail';
import EquipmentManager from './components/EquipmentManager';
import ChecklistManager from './components/ChecklistManager';
import SettingsModal from './components/SettingsModal';
import Auth from './components/Auth';

import { ToastProvider, useToast } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TrailProvider, useTrails } from './context/TrailContext';
import { GearProvider, useGear } from './context/GearContext';
import { RefreshCw, X } from 'lucide-react';

function MainAppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [preselectedGrForPlanner, setPreselectedGrForPlanner] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const { trails, addTrail, deleteTrail, selectedTrail, setSelectedTrail, reloadTrails, syncing: syncingTrails } = useTrails();
  const { equipmentList, updateEquipmentList, reloadEquipment, syncing: syncingGear } = useGear();
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

  const isSyncing = syncingTrails || syncingGear;

  return (
    <div className="app-container">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'trail-detail' && tab !== 'checklist') setSelectedTrail(null);
        }} 
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Cloud Sync Progress Bar */}
      {isSyncing && (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', background: 'rgba(15, 23, 42, 0.95)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', zIndex: 1000, boxShadow: '0 4px 20px rgba(0,0,0,0.5)', color: '#fff', fontSize: '0.85rem' }}>
          <RefreshCw size={16} className="animate-spin" color="var(--primary-orange)" style={{ animation: 'spin 1.5s linear infinite' }} />
          <span>Synchronisation cloud...</span>
        </div>
      )}

      {/* Auth Modal Overlay */}
      {isAuthOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '450px' }}>
            <button 
              onClick={() => setIsAuthOpen(false)}
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', zIndex: 1001 }}
            >
              <X size={20} />
            </button>
            <Auth onClose={() => setIsAuthOpen(false)} />
          </div>
        </div>
      )}

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

        {activeTab === 'bike-routes' && (
          <BikeCatalog 
            onSaveAsPersonalTrail={handleSaveMultiGrAsPersonalTrail}
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
      <AuthProvider>
        <TrailProvider>
          <GearProvider>
            <MainAppContent />
          </GearProvider>
        </TrailProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
