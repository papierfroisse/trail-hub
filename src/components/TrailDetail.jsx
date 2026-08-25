import React, { useState } from 'react';
import GpxMap from './GpxMap';
import ElevationProfile from './ElevationProfile';
import RaceStrategyCalculator from './RaceStrategyCalculator';
import { ArrowLeft, MapPin, Mountain, Calendar, CheckCircle2, Download, Backpack, Layers, Calculator } from 'lucide-react';
import { generateGPXString } from '../utils/gpxParser';

export default function TrailDetail({ trail, onBack, onOpenChecklist }) {
  const [hoverPoint, setHoverPoint] = useState(null);

  if (!trail) return null;

  const handleDownloadGpx = () => {
    let waypoints = trail.waypoints || [];
    if (trail.trackPoints && trail.trackPoints.length > 0) {
      waypoints = trail.trackPoints;
    }
    const gpxText = generateGPXString(trail.name, waypoints);
    const blob = new Blob([gpxText], { type: 'application/gpx+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${trail.name.toLowerCase().replace(/\s+/g, '_')}.gpx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Back & Actions Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <button onClick={onBack} className="btn btn-secondary btn-sm">
          <ArrowLeft size={18} /> Retour à la liste
        </button>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={onOpenChecklist} className="btn btn-secondary btn-sm">
            <Backpack size={18} color="var(--primary-orange)" /> Prepa Sac & Checklist
          </button>
          <button onClick={handleDownloadGpx} className="btn btn-primary btn-sm">
            <Download size={18} /> Télécharger GPX
          </button>
        </div>
      </div>

      {/* Main Trail Title Panel */}
      <div className="glass-card" style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.85), rgba(15, 23, 42, 0.95))' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span className={`badge ${trail.status === 'Terminé' ? 'badge-emerald' : 'badge-orange'}`}>
                {trail.status}
              </span>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Calendar size={15} /> {trail.date || 'Non daté'}
              </span>
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>{trail.name}</h1>
            {trail.notes && <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>{trail.notes}</p>}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="stats-grid" style={{ marginBottom: 0 }}>
          <div className="glass-card stat-card" style={{ background: 'rgba(15, 23, 42, 0.6)' }}>
            <div className="stat-icon" style={{ background: 'rgba(249, 115, 22, 0.15)', color: 'var(--primary-orange)' }}>
              <MapPin size={24} />
            </div>
            <div>
              <div className="stat-value">{trail.distanceKm} km</div>
              <div className="stat-label">Distance totale</div>
            </div>
          </div>

          <div className="glass-card stat-card" style={{ background: 'rgba(15, 23, 42, 0.6)' }}>
            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--emerald-green)' }}>
              <Mountain size={24} />
            </div>
            <div>
              <div className="stat-value">+{trail.dPlus} m</div>
              <div className="stat-label">Dénivelé positif (D+)</div>
            </div>
          </div>

          <div className="glass-card stat-card" style={{ background: 'rgba(15, 23, 42, 0.6)' }}>
            <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: 'var(--red-accent)' }}>
              <Mountain size={24} style={{ transform: 'rotate(180deg)' }} />
            </div>
            <div>
              <div className="stat-value">-{trail.dMinus || trail.dPlus} m</div>
              <div className="stat-label">Dénivelé négatif (D-)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Map & Synchronized Elevation Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ color: '#fff', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={20} color="var(--primary-orange)" /> Carte de l'Itinéraire (Survol synchro)
          </h3>
          <GpxMap 
            waypoints={trail.waypoints || []} 
            trackPoints={trail.trackPoints || []} 
            height="380px" 
            color="var(--primary-orange)"
            hoverPoint={hoverPoint}
          />
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ color: '#fff', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Mountain size={20} color="var(--emerald-green)" /> Profil Altimétrique (Survoler pour repérer sur la carte)
          </h3>
          <ElevationProfile 
            profileData={trail.elevationProfile || []} 
            color="var(--emerald-green)" 
            height="350px" 
            onHoverPoint={setHoverPoint}
          />
        </div>
      </div>

      {/* Race Strategy & Performance Calculator */}
      <RaceStrategyCalculator trail={trail} />

      {/* Stage Table if Multi-GR */}
      {trail.stages && trail.stages.length > 0 && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ color: '#fff', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={20} color="var(--purple-accent)" /> Découpage en Étapes ({trail.stages.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {trail.stages.map((stage, idx) => (
              <div key={idx} style={{ padding: '0.85rem 1.25rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                <div style={{ fontWeight: 700, color: '#fff' }}>
                  Jour {idx + 1} : {stage.name}
                </div>
                <div style={{ display: 'flex', gap: '1.25rem', color: 'var(--text-muted)' }}>
                  <div><strong style={{ color: '#fff' }}>{stage.distanceKm}</strong> km</div>
                  <div><strong style={{ color: 'var(--emerald-green)' }}>+{stage.dPlus}m</strong> D+</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
