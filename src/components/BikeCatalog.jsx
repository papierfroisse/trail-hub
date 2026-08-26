import React, { useState } from 'react';
import { BIKE_ROUTES_LIST } from '../data/bikeRoutesData';
import GpxMap from './GpxMap';
import { Navigation, MapPin, Compass, Clock, Layers, PlusCircle, AlertCircle, Mountain } from 'lucide-react';

export default function BikeCatalog({ onSaveAsPersonalTrail }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoute, setSelectedRoute] = useState(BIKE_ROUTES_LIST[0]);
  
  // Filtres POI pour la carte
  const [showToilets, setShowToilets] = useState(true);
  const [showWater, setShowWater] = useState(true);
  const [showRepairs, setShowRepairs] = useState(true);

  const filteredRoutes = BIKE_ROUTES_LIST.filter(route =>
    route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectRoute = (route) => {
    setSelectedRoute(route);
    setActiveViewMode('stages');
  };

  // Filtrer les POIs selon les interrupteurs de l'utilisateur
  const getFilteredPois = () => {
    if (!selectedRoute || !selectedRoute.pois) return [];
    return selectedRoute.pois.filter(poi => {
      if (poi.type === 'toilet' && !showToilets) return false;
      if (poi.type === 'water' && !showWater) return false;
      if (poi.type === 'repair' && !showRepairs) return false;
      return true;
    });
  };

  const handleSaveToMyTrails = () => {
    if (!selectedRoute) return;
    
    // Mapper l'objet véloroute en objet "trail" standard pour le catalogue de l'utilisateur
    const trailObj = {
      id: `bike-${selectedRoute.id}-${Date.now()}`,
      name: `🚲 ${selectedRoute.name}`,
      date: new Date().toISOString().slice(0, 10),
      distanceKm: selectedRoute.distanceKm,
      dPlus: selectedRoute.elevationGainM,
      dMinus: selectedRoute.elevationGainM,
      status: 'À venir',
      notes: `Véloroute suggérée : ${selectedRoute.description}`,
      waypoints: selectedRoute.waypoints.map(w => ({ ...w, ele: w.ele || 100 })),
      createdAt: new Date().toISOString()
    };

    onSaveAsPersonalTrail(trailObj);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div className="glass-card" style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(14, 165, 233, 0.15))' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(14, 165, 233, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(14, 165, 233, 0.4)' }}>
            <Compass size={28} color="#0ea5e9" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>Véloroutes & Voies Vertes (France)</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Explorez les grands itinéraires cyclotouristes français et localisez les points d'eau et sanitaires du parcours.
            </p>
          </div>
        </div>

        {/* Barre de recherche */}
        <div style={{ marginTop: '1.5rem', position: 'relative', maxWidth: '500px' }}>
          <input
            type="text"
            placeholder="Rechercher une véloroute (ex: ViaRhôna, Loire, PACA)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
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

      {/* Main Content Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) 2.5fr', gap: '1.5rem' }}>
        
        {/* Left Side: Route List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {filteredRoutes.map((route) => {
            const isSelected = selectedRoute?.id === route.id;
            return (
              <div
                key={route.id}
                onClick={() => handleSelectRoute(route)}
                className="glass-card"
                style={{
                  padding: '1.25rem',
                  cursor: 'pointer',
                  borderLeft: isSelected ? `5px solid ${route.color}` : '1px solid var(--border-color)',
                  background: isSelected ? 'rgba(31, 41, 55, 0.95)' : 'rgba(31, 41, 55, 0.5)',
                  boxShadow: isSelected ? `0 0 15px ${route.color}33` : 'none',
                  transform: isSelected ? 'scale(1.01)' : 'scale(1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <span className="badge" style={{ backgroundColor: `${route.color}22`, color: route.color, border: `1px solid ${route.color}44` }}>
                    {route.shortName}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <MapPin size={12} /> {route.region}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
                  {route.name}
                </h3>

                <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <div><strong style={{ color: '#fff' }}>{route.distanceKm}</strong> km</div>
                  <div><strong style={{ color: 'var(--primary-orange)' }}>+{route.elevationGainM}m</strong> D+</div>
                  <div><strong style={{ color: '#fff' }}>{route.recommendedDays}</strong> jours</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: Selected Route Details */}
        {selectedRoute ? (
          <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignSelf: 'flex-start' }}>
            
            {/* Header info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                  <span className="badge" style={{ backgroundColor: `${selectedRoute.color}22`, color: selectedRoute.color, border: `1px solid ${selectedRoute.color}44` }}>
                    {selectedRoute.shortName}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{selectedRoute.region}</span>
                </div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>{selectedRoute.name}</h2>
              </div>

              <button onClick={handleSaveToMyTrails} className="btn btn-primary">
                <PlusCircle size={18} />
                <span>Ajouter à mon Agenda de sorties</span>
              </button>
            </div>

            {/* Metrics */}
            <div className="stats-grid" style={{ marginBottom: 0 }}>
              <div className="glass-card stat-card" style={{ background: 'rgba(15, 23, 42, 0.6)' }}>
                <div className="stat-icon" style={{ background: 'rgba(14, 165, 233, 0.15)', color: '#0ea5e9' }}>
                  <Navigation size={24} />
                </div>
                <div>
                  <div className="stat-value">{selectedRoute.distanceKm} km</div>
                  <div className="stat-label">Longueur totale</div>
                </div>
              </div>

              <div className="glass-card stat-card" style={{ background: 'rgba(15, 23, 42, 0.6)' }}>
                <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--emerald-green)' }}>
                  <Mountain size={24} />
                </div>
                <div>
                  <div className="stat-value">+{selectedRoute.elevationGainM} m</div>
                  <div className="stat-label">D+ Estimé</div>
                </div>
              </div>

              <div className="glass-card stat-card" style={{ background: 'rgba(15, 23, 42, 0.6)' }}>
                <div className="stat-icon" style={{ background: 'rgba(249, 115, 22, 0.15)', color: 'var(--primary-orange)' }}>
                  <Clock size={24} />
                </div>
                <div>
                  <div className="stat-value">{selectedRoute.recommendedDays} Jours</div>
                  <div className="stat-label">Durée suggérée</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              {selectedRoute.description}
            </p>
            {/* Affichage complet vertical */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* 1. Carte & Points de service (WC, Eau) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                  <MapPin size={18} color={selectedRoute.color} />
                  Carte & Points de service (WC, Eau, Réparation)
                </h3>

                {/* POI Toggle Filters Bar */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', background: 'rgba(15, 23, 42, 0.6)', padding: '0.75rem 1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>Filtrer les services sur la route :</span>
                  
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => setShowToilets(!showToilets)}
                      className={`btn btn-sm ${showToilets ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ background: showToilets ? '#3b82f6' : 'rgba(59, 130, 246, 0.1)', border: '1px solid #3b82f644' }}
                    >
                      <span>🚾 Toilettes</span>
                    </button>
                    <button
                      onClick={() => setShowWater(!showWater)}
                      className={`btn btn-sm ${showWater ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ background: showWater ? '#06b6d4' : 'rgba(6, 182, 212, 0.1)', border: '1px solid #06b6d444' }}
                    >
                      <span>🚰 Eau potable</span>
                    </button>
                    <button
                      onClick={() => setShowRepairs(!showRepairs)}
                      className={`btn btn-sm ${showRepairs ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ background: showRepairs ? '#f59e0b' : 'rgba(245, 158, 11, 0.1)', border: '1px solid #f59e0b44' }}
                    >
                      <span>🔧 Réparation</span>
                    </button>
                  </div>
                </div>

                {/* The Map Component rendering filtered POIs */}
                <GpxMap
                  waypoints={selectedRoute.waypoints}
                  pois={getFilteredPois()}
                  color={selectedRoute.color}
                  height="380px"
                />
              </div>

              {/* 2. Liste des étapes journalières */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                  <Layers size={18} color={selectedRoute.color} />
                  Étapes journalières ({selectedRoute.stages.length})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '350px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                  {selectedRoute.stages.map((stage) => (
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
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: `${selectedRoute.color}22`, color: selectedRoute.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>
                          {stage.number}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>{stage.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Temps de selle approx: {stage.timeEst}</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        <div><strong style={{ color: '#fff' }}>{stage.distanceKm}</strong> km</div>
                        <div><strong style={{ color: 'var(--emerald-green)' }}>+{stage.dPlus}m</strong></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1.5rem' }}>
              <AlertCircle size={14} color="var(--primary-orange)" />
              <span>Cliquez sur les marqueurs des services 🚾/🚰/🔧 pour voir les détails ou les remarques d'accessibilité.</span>
            </div>

          </div>
        ) : (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Sélectionnez une véloroute dans la liste pour voir les détails.
          </div>
        )}

      </div>

    </div>
  );
}
