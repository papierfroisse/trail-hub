import React, { useState } from 'react';
import { FAMOUS_GR_LIST } from '../data/grData';
import GpxMap from './GpxMap';
import ElevationProfile from './ElevationProfile';
import { Compass, MapPin, Navigation, ArrowRight, Mountain, Calendar, Layers, CheckCircle2, ChevronRight, PlusCircle } from 'lucide-react';

export default function GrCatalog({ onSelectGrForPlanner }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGr, setSelectedGr] = useState(FAMOUS_GR_LIST[0]);
  const [activeViewMode, setActiveViewMode] = useState('stages'); // 'stages' | 'map' | 'profile'

  const filteredGrs = FAMOUS_GR_LIST.filter(gr => 
    gr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gr.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gr.shortName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Générer un profil d'altitude fictif réaliste pour l'aperçu si aucun GPX brut n'est chargé
  const generateMockProfileFromWaypoints = (waypoints, totalDist) => {
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

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div className="glass-card" style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8), rgba(17, 24, 39, 0.9))' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(59, 130, 246, 0.4)' }}>
            <Compass size={28} color="#3b82f6" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>Catalogue des Grands GR & Sentiers</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Explorez les Sentiers de Grande Randonnée emblématiques et préparez vos grandes traversées.
            </p>
          </div>
        </div>

        {/* Barre de recherche & filtres */}
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Rechercher un GR, une région (ex: GR20, Pyrénées, Alpes, Corse)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              minWidth: '280px',
              padding: '0.75rem 1.25rem',
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

      {/* Main Grid: Left List - Right Details */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) 2fr', gap: '1.5rem' }}>
        
        {/* Left Column: GR Cards Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredGrs.map((gr) => {
            const isSelected = selectedGr?.id === gr.id;
            return (
              <div
                key={gr.id}
                onClick={() => setSelectedGr(gr)}
                className="glass-card"
                style={{
                  padding: '1.25rem',
                  cursor: 'pointer',
                  borderLeft: isSelected ? `5px solid ${gr.color}` : '1px solid var(--border-color)',
                  background: isSelected ? 'rgba(31, 41, 55, 0.95)' : 'rgba(31, 41, 55, 0.5)',
                  boxShadow: isSelected ? `0 0 15px ${gr.color}33` : 'none',
                  transform: isSelected ? 'scale(1.01)' : 'scale(1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <span className="badge" style={{ backgroundColor: `${gr.color}22`, color: gr.color, border: `1px solid ${gr.color}44` }}>
                    {gr.shortName}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <MapPin size={12} /> {gr.region}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
                  {gr.name}
                </h3>

                <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <div><strong style={{ color: '#fff' }}>{gr.distanceKm}</strong> km</div>
                  <div><strong style={{ color: 'var(--primary-orange)' }}>+{gr.elevationGainM}m</strong> D+</div>
                  <div><strong style={{ color: '#fff' }}>{gr.recommendedDays}</strong> jours</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Selected GR Full Detail Panel */}
        {selectedGr && (
          <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
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

              <button
                onClick={() => onSelectGrForPlanner(selectedGr)}
                className="btn btn-primary"
              >
                <PlusCircle size={18} />
                <span>Ajouter au Planificateur Multi-GR</span>
              </button>
            </div>

            {/* Quick Metrics Banner */}
            <div className="stats-grid" style={{ marginBottom: 0 }}>
              <div className="glass-card stat-card" style={{ background: 'rgba(15, 23, 42, 0.6)' }}>
                <div className="stat-icon" style={{ background: 'rgba(249, 115, 22, 0.15)', color: 'var(--primary-orange)' }}>
                  <Navigation size={24} />
                </div>
                <div>
                  <div className="stat-value">{selectedGr.distanceKm} km</div>
                  <div className="stat-label">Distance totale</div>
                </div>
              </div>

              <div className="glass-card stat-card" style={{ background: 'rgba(15, 23, 42, 0.6)' }}>
                <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--emerald-green)' }}>
                  <Mountain size={24} />
                </div>
                <div>
                  <div className="stat-value">+{selectedGr.elevationGainM} m</div>
                  <div className="stat-label">Dénivelé positif (D+)</div>
                </div>
              </div>

              <div className="glass-card stat-card" style={{ background: 'rgba(15, 23, 42, 0.6)' }}>
                <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
                  <Calendar size={24} />
                </div>
                <div>
                  <div className="stat-value">{selectedGr.recommendedDays} Jours</div>
                  <div className="stat-label">Durée recommandée</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              {selectedGr.description}
            </p>

            {/* Tabs for Stages vs Map vs Elevation Profile */}
            <div style={{ display: 'flex', gap: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <button
                onClick={() => setActiveViewMode('stages')}
                className={`btn btn-sm ${activeViewMode === 'stages' ? 'btn-primary' : 'btn-secondary'}`}
              >
                <Layers size={16} /> Étapes ({selectedGr.stages.length})
              </button>
              <button
                onClick={() => setActiveViewMode('map')}
                className={`btn btn-sm ${activeViewMode === 'map' ? 'btn-primary' : 'btn-secondary'}`}
              >
                <MapPin size={16} /> Carte interactive
              </button>
              <button
                onClick={() => setActiveViewMode('profile')}
                className={`btn btn-sm ${activeViewMode === 'profile' ? 'btn-primary' : 'btn-secondary'}`}
              >
                <Mountain size={16} /> Profil d'altitude
              </button>
            </div>

            {/* Tab View Content */}
            {activeViewMode === 'stages' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '420px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                {selectedGr.stages.map((stage) => (
                  <div 
                    key={stage.number}
                    style={{
                      padding: '1rem 1.25rem',
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
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: `${selectedGr.color}22`, color: selectedGr.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>
                        {stage.number}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{stage.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Temps estimé : {stage.timeEst}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <div><strong style={{ color: '#fff' }}>{stage.distanceKm}</strong> km</div>
                      <div><strong style={{ color: 'var(--emerald-green)' }}>+{stage.dPlus}m</strong></div>
                      <div><strong style={{ color: 'var(--red-accent)' }}>-{stage.dMinus}m</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeViewMode === 'map' && (
              <GpxMap 
                waypoints={selectedGr.waypoints} 
                height="400px" 
                color={selectedGr.color} 
              />
            )}

            {activeViewMode === 'profile' && (
              <ElevationProfile 
                profileData={generateMockProfileFromWaypoints(selectedGr.waypoints, selectedGr.distanceKm)}
                color={selectedGr.color}
                height="320px"
              />
            )}

          </div>
        )}

      </div>
    </div>
  );
}
