import React from 'react';
import { Mountain, Navigation, Compass, Calendar, MapPin, Backpack, Route, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { FAMOUS_GR_LIST } from '../data/grData';
import { ALPS_SUMMITS_LIST } from '../data/summitsData';

export default function Dashboard({ trails = [], equipmentList = [], onNavigateTab, onSelectTrail }) {
  // Calculer les statistiques globales
  const totalKmPlanned = trails.reduce((sum, t) => sum + (Number(t.distanceKm || t.distance) || 0), 0);
  const totalDPlus = trails.reduce((sum, t) => sum + (Number(t.dPlus || t.elevationGain) || 0), 0);
  const upcomingTrails = trails.filter(t => t.status === 'À venir' || t.status === 'Planifié');
  const completedTrails = trails.filter(t => t.status === 'Terminé');

  const nextTrail = upcomingTrails.length > 0 ? upcomingTrails[0] : null;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Hero Welcome Banner */}
      <div 
        className="glass-card" 
        style={{
          padding: '2.5rem 2rem',
          background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(15, 23, 42, 0.95)), url("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '700px' }}>
          <span className="badge badge-orange" style={{ marginBottom: '1rem' }}>
            <Sparkles size={14} /> Bienvenue sur TrailHub
          </span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#fff', lineHeight: 1.15, marginBottom: '1rem' }}>
            Planifiez vos Sorties, vos GPX et vos Traversées Multi-GR
          </h1>
          <p style={{ color: '#d1d5db', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
            Un espace centralisé pour cartographier vos itinéraires de trail, composer des aventures reliant plusieurs GR et gérer votre sac à dos.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button onClick={() => onNavigateTab('multi-gr-planner')} className="btn btn-primary">
              <Route size={18} />
              <span>Composer un Itinéraire Multi-GR</span>
            </button>
            <button onClick={() => onNavigateTab('summits')} className="btn btn-secondary">
              <Mountain size={18} />
              <span>Sommets & Refuges</span>
            </button>
            <button onClick={() => onNavigateTab('trails')} className="btn btn-secondary">
              <MapPin size={18} />
              <span>Mes Trails & GPX</span>
            </button>
            <button onClick={() => onNavigateTab('equipment')} className="btn btn-secondary">
              <Backpack size={18} />
              <span>Mon Équipement ({equipmentList?.length || 0})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Global Stat Cards */}
      <div className="stats-grid">
        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(249, 115, 22, 0.15)', color: 'var(--primary-orange)' }}>
            <Navigation size={26} />
          </div>
          <div>
            <div className="stat-value">{Math.round(totalKmPlanned)} km</div>
            <div className="stat-label">Distance totale planifiée</div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--emerald-green)' }}>
            <Mountain size={26} />
          </div>
          <div>
            <div className="stat-value">+{totalDPlus.toLocaleString()} m</div>
            <div className="stat-label">Dénivelé positif (D+) cumulé</div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
            <Calendar size={26} />
          </div>
          <div>
            <div className="stat-value">{upcomingTrails.length}</div>
            <div className="stat-label">Trails à venir</div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: 'var(--purple-accent)' }}>
            <CheckCircle2 size={26} />
          </div>
          <div>
            <div className="stat-value">{completedTrails.length}</div>
            <div className="stat-label">Sorties terminées</div>
          </div>
        </div>
      </div>

      {/* Prochain Objectif & Featured GR Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) 2fr', gap: '1.5rem' }}>
        
        {/* Prochain Objectif */}
        <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={20} color="var(--primary-orange)" /> Prochain Objectif
            </h3>

            {nextTrail ? (
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <span className="badge badge-orange" style={{ marginBottom: '0.5rem' }}>{nextTrail.status}</span>
                <h4 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem' }}>
                  {nextTrail.name}
                </h4>

                <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <div><strong style={{ color: '#fff' }}>{nextTrail.distanceKm}</strong> km</div>
                  <div><strong style={{ color: 'var(--emerald-green)' }}>+{nextTrail.dPlus}m</strong> D+</div>
                  <div><strong style={{ color: '#fff' }}>{nextTrail.date}</strong></div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
                <p>Aucun trail à venir planifié.</p>
                <button onClick={() => onNavigateTab('trails')} className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
                  Planifier un trail
                </button>
              </div>
            )}
          </div>

          {nextTrail && (
            <button onClick={() => onSelectTrail(nextTrail)} className="btn btn-secondary btn-sm" style={{ marginTop: '1.5rem' }}>
              Voir les détails & la carte <ArrowRight size={16} />
            </button>
          )}
        </div>

        {/* Explore GR Showcase */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Compass size={20} color="#3b82f6" /> Les Sentiers de Grande Randonnée (GR)
            </h3>
            <button onClick={() => onNavigateTab('gr-catalog')} className="btn btn-secondary btn-sm">
              Tout le catalogue <ArrowRight size={16} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '1rem' }}>
            {FAMOUS_GR_LIST.slice(0, 3).map((gr) => (
              <div
                key={gr.id}
                onClick={() => onNavigateTab('gr-catalog')}
                style={{
                  padding: '1.1rem',
                  borderRadius: '12px',
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <span className="badge" style={{ backgroundColor: `${gr.color}22`, color: gr.color, border: `1px solid ${gr.color}44`, marginBottom: '0.5rem' }}>
                  {gr.shortName}
                </span>
                <h4 style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>
                  {gr.name}
                </h4>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {gr.distanceKm} km • +{gr.elevationGainM}m D+
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Explore Grands Sommets Showcase */}
      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Mountain size={20} color="#60a5fa" /> Grands Sommets & Voies Normales des Alpes (4000m)
          </h3>
          <button onClick={() => onNavigateTab('summits')} className="btn btn-secondary btn-sm">
            Tous les sommets ({ALPS_SUMMITS_LIST.length}) <ArrowRight size={16} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {ALPS_SUMMITS_LIST.slice(0, 4).map((summit) => (
            <div
              key={summit.id}
              onClick={() => onNavigateTab('summits')}
              style={{
                padding: '1.1rem',
                borderRadius: '12px',
                background: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className="badge" style={{ backgroundColor: `${summit.color || '#3b82f6'}22`, color: summit.color || '#3b82f6', border: `1px solid ${summit.color || '#3b82f6'}44` }}>
                  {summit.elevationM} m
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                  {summit.difficulty}
                </span>
              </div>
              <h4 style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', marginBottom: '0.35rem' }}>
                {summit.shortName}
              </h4>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                +{summit.elevationGainM}m D+ • Refuge {summit.refuge?.name.split('(')[0]}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
