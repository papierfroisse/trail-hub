import React, { useState } from 'react';
import { FAMOUS_GR_LIST } from '../data/grData';
import { ALL_GR_CATALOG } from '../data/allGrCatalog';
import GpxMap from './GpxMap';
import ElevationProfile from './ElevationProfile';
import { Compass, MapPin, Navigation, Mountain, Calendar, Layers, PlusCircle, Search } from 'lucide-react';

export default function GrCatalog({ onSelectGrForPlanner }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCatalogTab, setActiveCatalogTab] = useState('famous'); // 'famous' | 'all'
  const [selectedGr, setSelectedGr] = useState(FAMOUS_GR_LIST[0]);
  const [activeViewMode, setActiveViewMode] = useState('stages'); // 'stages' | 'map' | 'profile'

  // Fonction pour extraire le numéro du GR afin de trier numériquement
  const getGrNumber = (gr) => {
    if (gr.num) return parseInt(gr.num, 10);
    const match = gr.shortName.match(/\d+/);
    return match ? parseInt(match[0], 10) : 9999;
  };

  // Liste complète triée (Majeurs + Secondaires)
  const sortedAllGrList = [...FAMOUS_GR_LIST, ...ALL_GR_CATALOG].sort((a, b) => getGrNumber(a) - getGrNumber(b));

  // Fusionner les listes ou filtrer selon l'onglet actif
  const currentCatalogList = activeCatalogTab === 'famous' ? FAMOUS_GR_LIST : sortedAllGrList;

  const filteredGrs = currentCatalogList.filter(gr => 
    gr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gr.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gr.shortName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectGr = (gr) => {
    setSelectedGr(gr);
    // Basculer sur 'stages' ou 'details' selon la présence d'étapes
    if (gr.stages && gr.stages.length > 0) {
      setActiveViewMode('stages');
    } else {
      setActiveViewMode('details');
    }
  };

  const handleTabChange = (tab) => {
    setActiveCatalogTab(tab);
    const list = tab === 'famous' ? FAMOUS_GR_LIST : sortedAllGrList;
    setSelectedGr(list[0]);
    if (list[0].stages) {
      setActiveViewMode('stages');
    } else {
      setActiveViewMode('details');
    }
  };

  // Générer un profil d'altitude fictif réaliste pour l'aperçu si aucun GPX brut n'est chargé
  const generateMockProfileFromWaypoints = (waypoints, totalDist) => {
    if (!waypoints || waypoints.length === 0) return [];
    const points = [];
    const step = totalDist / Math.max(waypoints.length - 1, 1);
    waypoints.forEach((wpt, i) => {
      points.push({
        dist: Math.round(i * step * 10) / 10,
        ele: wpt.ele || 1000
      });
    });
    return points;
  };

  const hasWaypoints = selectedGr && selectedGr.waypoints && selectedGr.waypoints.length > 0;
  const hasStages = selectedGr && selectedGr.stages && selectedGr.stages.length > 0;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div className="glass-card" style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8), rgba(17, 24, 39, 0.9))' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(59, 130, 246, 0.4)' }}>
            <Compass size={28} color="#3b82f6" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>Catalogue des Sentiers de Grande Randonnée (GR)</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Explorez les sentiers de grande randonnée officiels de France et préparez vos grandes traversées.
            </p>
          </div>
        </div>

        {/* Onglets + Recherche */}
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          
          {/* Onglets Filtre Catalogue */}
          <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(15, 23, 42, 0.6)', padding: '0.35rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => handleTabChange('famous')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: 'none',
                background: activeCatalogTab === 'famous' ? 'var(--primary-orange)' : 'transparent',
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Itinéraires Majeurs ({FAMOUS_GR_LIST.length})
            </button>
            <button
              onClick={() => handleTabChange('all')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: 'none',
                background: activeCatalogTab === 'all' ? 'var(--primary-orange)' : 'transparent',
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Tous les GR de France ({ALL_GR_CATALOG.length + FAMOUS_GR_LIST.length})
            </button>
          </div>

          {/* Recherche */}
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
            <input
              type="text"
              placeholder="Rechercher par numéro, nom, région..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.5rem',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                background: 'rgba(15, 23, 42, 0.8)',
                color: '#fff',
                fontSize: '0.95rem',
                outline: 'none'
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Left List - Right Details */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) 2fr', gap: '1.5rem' }}>
        
        {/* Left Column: GR Cards Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '700px', overflowY: 'auto', paddingRight: '0.25rem' }}>
          {filteredGrs.length > 0 ? (
            filteredGrs.map((gr) => {
              const isSelected = selectedGr?.id === gr.id;
              return (
                <div
                  key={gr.id}
                  onClick={() => handleSelectGr(gr)}
                  className="glass-card"
                  style={{
                    padding: '1.1rem 1.25rem',
                    cursor: 'pointer',
                    borderLeft: isSelected ? `5px solid ${gr.color}` : '1px solid var(--border-color)',
                    background: isSelected ? 'rgba(31, 41, 55, 0.95)' : 'rgba(31, 41, 55, 0.5)',
                    boxShadow: isSelected ? `0 0 15px ${gr.color}33` : 'none',
                    transform: isSelected ? 'scale(1.01)' : 'scale(1)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                    <span className="badge" style={{ backgroundColor: `${gr.color}22`, color: gr.color, border: `1px solid ${gr.color}44` }}>
                      {gr.shortName}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <MapPin size={11} /> {gr.region}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>
                    {gr.name}
                  </h3>

                  {gr.distanceKm ? (
                    <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <div><strong style={{ color: '#fff' }}>{gr.distanceKm}</strong> km</div>
                      <div><strong style={{ color: 'var(--primary-orange)' }}>+{gr.elevationGainM}m</strong> D+</div>
                      <div><strong style={{ color: '#fff' }}>{gr.recommendedDays}</strong> j</div>
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {gr.description}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              Aucun sentier trouvé.
            </div>
          )}
        </div>

        {/* Right Column: Selected GR Full Detail Panel */}
        {selectedGr ? (
          <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignSelf: 'flex-start' }}>
            
            {/* Title & Action */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                  <span className="badge" style={{ backgroundColor: `${selectedGr.color}22`, color: selectedGr.color, border: `1px solid ${selectedGr.color}44`, fontSize: '0.85rem' }}>
                    {selectedGr.shortName}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{selectedGr.region}</span>
                </div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>{selectedGr.name}</h2>
              </div>

              {/* Action planner compatible uniquement si waypoints pour le moment */}
              {hasWaypoints && (
                <button
                  onClick={() => onSelectGrForPlanner(selectedGr)}
                  className="btn btn-primary"
                >
                  <PlusCircle size={18} />
                  <span>Ajouter au Planificateur Multi-GR</span>
                </button>
              )}
            </div>

            {/* Quick Metrics Banner (uniquement si valeurs renseignées) */}
            {selectedGr.distanceKm && (
              <div className="stats-grid" style={{ marginBottom: 0 }}>
                <div className="glass-card stat-card" style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem' }}>
                  <div className="stat-icon" style={{ background: 'rgba(249, 115, 22, 0.15)', color: 'var(--primary-orange)' }}>
                    <Navigation size={20} />
                  </div>
                  <div>
                    <div className="stat-value" style={{ fontSize: '1.25rem' }}>{selectedGr.distanceKm} km</div>
                    <div className="stat-label">Distance</div>
                  </div>
                </div>

                <div className="glass-card stat-card" style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem' }}>
                  <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--emerald-green)' }}>
                    <Mountain size={20} />
                  </div>
                  <div>
                    <div className="stat-value" style={{ fontSize: '1.25rem' }}>+{selectedGr.elevationGainM} m</div>
                    <div className="stat-label">D+ Cumulé</div>
                  </div>
                </div>

                <div className="glass-card stat-card" style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem' }}>
                  <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
                    <Calendar size={20} />
                  </div>
                  <div>
                    <div className="stat-value" style={{ fontSize: '1.25rem' }}>{selectedGr.recommendedDays} Jours</div>
                    <div className="stat-label">Durée</div>
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.95rem' }}>Description / Tracé</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                {selectedGr.description}
              </p>
            </div>

            {/* Affichage vertical complet des données du sentier */}
            {(hasStages || hasWaypoints) ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                
                {/* 1. Carte Interactive */}
                {hasWaypoints && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                      <MapPin size={18} color={selectedGr.color} />
                      Carte interactive du tracé
                    </h3>
                    <GpxMap 
                      waypoints={selectedGr.waypoints} 
                      height="380px" 
                      color={selectedGr.color} 
                    />
                  </div>
                )}

                {/* 2. Liste des Étapes journalières */}
                {hasStages && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                      <Layers size={18} color={selectedGr.color} />
                      Étapes journalières ({selectedGr.stages.length})
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '350px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                      {selectedGr.stages.map((stage) => (
                        <div 
                          key={stage.number}
                          style={{
                            padding: '0.85rem 1.1rem',
                            borderRadius: '10px',
                            background: 'rgba(15, 23, 42, 0.7)',
                            border: '1px solid var(--border-color)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '0.75rem'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: `${selectedGr.color}22`, color: selectedGr.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>
                              {stage.number}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>{stage.name}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Est: {stage.timeEst}</div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            <div><strong style={{ color: '#fff' }}>{stage.distanceKm}</strong> km</div>
                            <div><strong style={{ color: 'var(--emerald-green)' }}>+{stage.dPlus}m</strong></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Profil d'Altitude */}
                {hasWaypoints && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                      <Mountain size={18} color={selectedGr.color} />
                      Profil de dénivelé altimétrique
                    </h3>
                    <ElevationProfile 
                      profileData={generateMockProfileFromWaypoints(selectedGr.waypoints, selectedGr.distanceKm)}
                      color={selectedGr.color}
                      height="280px"
                    />
                  </div>
                )}

              </div>
            ) : (
              <div style={{ padding: '1.5rem', background: 'rgba(15, 23, 42, 0.3)', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                💡 Utilisez le bouton d'import GPX dans <strong>Mes Trails & GPX</strong> pour charger le tracé exact de ce GR et générer son profil altimétrique dynamique.
              </div>
            )}

          </div>
        ) : (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Sélectionnez un sentier de grande randonnée dans la liste pour voir les détails.
          </div>
        )}

      </div>
    </div>
  );
}
