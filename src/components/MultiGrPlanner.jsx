import React, { useState, useEffect } from 'react';
import { FAMOUS_GR_LIST } from '../data/grData';
import { generateGPXString } from '../utils/gpxParser';
import GpxMap from './GpxMap';
import ElevationProfile from './ElevationProfile';
import { Route, Plus, Trash2, ArrowUp, ArrowDown, Download, Save, MapPin, Mountain, Calendar, Layers, Sparkles, CheckCircle2 } from 'lucide-react';

export default function MultiGrPlanner({ preselectedGr, onSaveAsPersonalTrail }) {
  const [plannerName, setPlannerName] = useState('Mon Aventure Multi-GR');
  const [selectedStages, setSelectedStages] = useState([]);
  const [availableGrId, setAvailableGrId] = useState(FAMOUS_GR_LIST[0].id);
  const [selectedStageIdx, setSelectedStageIdx] = useState(0);

  // Pre-load if navigated from catalog
  useEffect(() => {
    if (preselectedGr && preselectedGr.stages) {
      const initialStages = preselectedGr.stages.map(s => ({
        grId: preselectedGr.id,
        grName: preselectedGr.shortName,
        color: preselectedGr.color,
        stageNumber: s.number,
        name: s.name,
        distanceKm: s.distanceKm,
        dPlus: s.dPlus,
        dMinus: s.dMinus,
        timeEst: s.timeEst
      }));
      setSelectedStages(initialStages);
      setPlannerName(`Grande Traversée ${preselectedGr.shortName}`);
    }
  }, [preselectedGr]);

  // Ajouter une étape au planificateur
  const handleAddStage = () => {
    const targetGr = FAMOUS_GR_LIST.find(g => g.id === availableGrId);
    if (!targetGr || !targetGr.stages[selectedStageIdx]) return;

    const s = targetGr.stages[selectedStageIdx];
    const newStage = {
      id: `${targetGr.id}-stage-${s.number}-${Date.now()}`,
      grId: targetGr.id,
      grName: targetGr.shortName,
      color: targetGr.color,
      stageNumber: s.number,
      name: `${targetGr.shortName} - ${s.name}`,
      distanceKm: s.distanceKm,
      dPlus: s.dPlus,
      dMinus: s.dMinus,
      timeEst: s.timeEst
    };

    setSelectedStages([...selectedStages, newStage]);
  };

  // Supprimer une étape
  const handleRemoveStage = (index) => {
    const updated = [...selectedStages];
    updated.splice(index, 1);
    setSelectedStages(updated);
  };

  // Déplacer une étape vers le haut / bas
  const handleMoveStage = (index, direction) => {
    if ((direction === -1 && index === 0) || (direction === 1 && index === selectedStages.length - 1)) return;
    const updated = [...selectedStages];
    const temp = updated[index];
    updated[index] = updated[index + direction];
    updated[index + direction] = temp;
    setSelectedStages(updated);
  };

  // Calculs totaux
  const totalDist = Math.round(selectedStages.reduce((sum, s) => sum + s.distanceKm, 0) * 10) / 10;
  const totalDPlus = selectedStages.reduce((sum, s) => sum + s.dPlus, 0);
  const totalDMinus = selectedStages.reduce((sum, s) => sum + s.dMinus, 0);
  const totalDays = selectedStages.length;

  // Extraire les waypoints pour la carte interactive à partir des GR sélectionnés
  const combinedWaypoints = [];
  selectedStages.forEach((s) => {
    const parentGr = FAMOUS_GR_LIST.find(g => g.id === s.grId);
    if (parentGr && parentGr.waypoints) {
      // Ajouter les waypoints correspondants
      parentGr.waypoints.forEach(wpt => combinedWaypoints.push(wpt));
    }
  });

  // Générer les points pour le profil d'altitude
  const combinedProfileData = [];
  let currentDist = 0;
  selectedStages.forEach((s) => {
    currentDist += s.distanceKm;
    const eleEstimate = 1000 + (s.dPlus - s.dMinus) * 0.5;
    combinedProfileData.push({
      dist: Math.round(currentDist * 10) / 10,
      ele: Math.max(200, Math.min(2800, Math.round(eleEstimate)))
    });
  });

  // Télécharger le GPX combiné
  const handleDownloadCombinedGpx = () => {
    const gpxString = generateGPXString(plannerName, combinedWaypoints.length > 0 ? combinedWaypoints : [
      { name: "Départ", lat: 45.0, lng: 6.0, ele: 800 },
      { name: "Arrivée", lat: 45.5, lng: 6.5, ele: 1200 }
    ]);

    const blob = new Blob([gpxString], { type: 'application/gpx+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${plannerName.toLowerCase().replace(/\s+/g, '_')}.gpx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Enregistrer comme Trail personnel
  const handleSaveToPersonalTrails = () => {
    const newTrail = {
      id: `custom-multi-gr-${Date.now()}`,
      name: plannerName,
      type: 'Multi-GR',
      distanceKm: totalDist,
      dPlus: totalDPlus,
      dMinus: totalDMinus,
      days: totalDays,
      status: 'À venir',
      date: new Date().toISOString().slice(0, 10),
      waypoints: combinedWaypoints,
      stages: selectedStages,
      createdAt: new Date().toISOString()
    };
    onSaveAsPersonalTrail(newTrail);
  };

  const currentSelectedGrForSelector = FAMOUS_GR_LIST.find(g => g.id === availableGrId);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header Panel */}
      <div className="glass-card" style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.85), rgba(15, 23, 42, 0.95))' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(249, 115, 22, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(249, 115, 22, 0.4)' }}>
              <Route size={28} color="var(--primary-orange)" />
            </div>
            <div>
              <input
                type="text"
                value={plannerName}
                onChange={(e) => setPlannerName(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '2px solid var(--primary-orange)',
                  color: '#fff',
                  fontSize: '1.6rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-heading)',
                  outline: 'none',
                  padding: '0.2rem 0'
                }}
              />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                Combinez plusieurs tronçons de GR différents pour composer votre propre traversée sur-mesure.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={handleDownloadCombinedGpx}
              disabled={selectedStages.length === 0}
              className="btn btn-secondary"
            >
              <Download size={18} />
              <span>Exporter GPX</span>
            </button>

            <button
              onClick={handleSaveToPersonalTrails}
              disabled={selectedStages.length === 0}
              className="btn btn-primary"
            >
              <Save size={18} />
              <span>Sauvegarder dans mes Trails</span>
            </button>
          </div>

        </div>

        {/* Global Summary Bar */}
        <div className="stats-grid" style={{ marginTop: '1.5rem', marginBottom: 0 }}>
          <div className="glass-card stat-card" style={{ background: 'rgba(15, 23, 42, 0.6)' }}>
            <div className="stat-icon" style={{ background: 'rgba(249, 115, 22, 0.15)', color: 'var(--primary-orange)' }}>
              <MapPin size={24} />
            </div>
            <div>
              <div className="stat-value">{totalDist} km</div>
              <div className="stat-label">Distance totale combinée</div>
            </div>
          </div>

          <div className="glass-card stat-card" style={{ background: 'rgba(15, 23, 42, 0.6)' }}>
            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--emerald-green)' }}>
              <Mountain size={24} />
            </div>
            <div>
              <div className="stat-value">+{totalDPlus} m</div>
              <div className="stat-label">Dénivelé positif (D+)</div>
            </div>
          </div>

          <div className="glass-card stat-card" style={{ background: 'rgba(15, 23, 42, 0.6)' }}>
            <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: 'var(--purple-accent)' }}>
              <Calendar size={24} />
            </div>
            <div>
              <div className="stat-value">{totalDays} Étapes</div>
              <div className="stat-label">Nombres de jours/étapes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Selector Control Bar */}
      <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={20} color="var(--primary-orange)" />
          Ajouter une étape au parcours :
        </div>

        {/* GR Dropdown */}
        <select
          value={availableGrId}
          onChange={(e) => {
            setAvailableGrId(e.target.value);
            setSelectedStageIdx(0);
          }}
          style={{
            padding: '0.6rem 1rem',
            borderRadius: '10px',
            background: '#0f172a',
            color: '#fff',
            border: '1px solid var(--border-color)',
            fontSize: '0.9rem',
            outline: 'none'
          }}
        >
          {FAMOUS_GR_LIST.map((gr) => (
            <option key={gr.id} value={gr.id}>
              {gr.shortName} - {gr.name}
            </option>
          ))}
        </select>

        {/* Stage Dropdown */}
        {currentSelectedGrForSelector && (
          <select
            value={selectedStageIdx}
            onChange={(e) => setSelectedStageIdx(Number(e.target.value))}
            style={{
              padding: '0.6rem 1rem',
              borderRadius: '10px',
              background: '#0f172a',
              color: '#fff',
              border: '1px solid var(--border-color)',
              fontSize: '0.9rem',
              outline: 'none',
              flex: 1,
              minWidth: '220px'
            }}
          >
            {currentSelectedGrForSelector.stages.map((stage, idx) => (
              <option key={idx} value={idx}>
                Étape {stage.number} : {stage.name} ({stage.distanceKm} km, +{stage.dPlus}m)
              </option>
            ))}
          </select>
        )}

        <button onClick={handleAddStage} className="btn btn-primary btn-sm">
          <Plus size={16} /> Ajouter l'étape
        </button>
      </div>

      {/* Selected Sequence List */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layers size={20} color="var(--primary-orange)" />
          Séquence des Étapes Combinées ({selectedStages.length})
        </h3>

        {selectedStages.length === 0 ? (
          <div style={{ padding: '3rem 1.5rem', textAlign: 'center', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '12px', border: '1px dashed var(--border-color)', color: 'var(--text-muted)' }}>
            <Sparkles size={36} color="var(--primary-orange)" style={{ margin: '0 auto 1rem auto', display: 'block' }} />
            <p style={{ fontWeight: 600, color: '#fff', fontSize: '1.05rem' }}>Aucune étape sélectionnée</p>
            <p style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Choisissez un GR ci-dessus et ajoutez ses étapes pour composer votre itinéraire personnalisé sur-mesure.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {selectedStages.map((stage, idx) => (
              <div
                key={stage.id || idx}
                style={{
                  padding: '1rem 1.25rem',
                  borderRadius: '12px',
                  background: 'rgba(15, 23, 42, 0.75)',
                  borderLeft: `5px solid ${stage.color || 'var(--primary-orange)'}`,
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span className="badge" style={{ backgroundColor: `${stage.color}22`, color: stage.color, border: `1px solid ${stage.color}44` }}>
                    Jour {idx + 1} • {stage.grName}
                  </span>
                  <div>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>{stage.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Temps de marche/trail : {stage.timeEst}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem' }}>
                    <div><strong style={{ color: '#fff' }}>{stage.distanceKm}</strong> km</div>
                    <div><strong style={{ color: 'var(--emerald-green)' }}>+{stage.dPlus}m</strong></div>
                    <div><strong style={{ color: 'var(--red-accent)' }}>-{stage.dMinus}m</strong></div>
                  </div>

                  {/* Move & Delete Controls */}
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button
                      onClick={() => handleMoveStage(idx, -1)}
                      disabled={idx === 0}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.35rem', opacity: idx === 0 ? 0.3 : 1 }}
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      onClick={() => handleMoveStage(idx, 1)}
                      disabled={idx === selectedStages.length - 1}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.35rem', opacity: idx === selectedStages.length - 1 ? 0.3 : 1 }}
                    >
                      <ArrowDown size={16} />
                    </button>
                    <button
                      onClick={() => handleRemoveStage(idx)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.35rem', color: 'var(--red-accent)', background: 'rgba(239, 68, 68, 0.15)' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Map & Elevation Preview */}
      {selectedStages.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={18} color="var(--primary-orange)" /> Carte de la Traversée Combinée
            </h4>
            <GpxMap waypoints={combinedWaypoints} height="320px" color="var(--primary-orange)" />
          </div>

          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mountain size={18} color="var(--emerald-green)" /> Profil d'Altitude Estimé
            </h4>
            <ElevationProfile profileData={combinedProfileData} color="var(--emerald-green)" height="300px" />
          </div>
        </div>
      )}

    </div>
  );
}
