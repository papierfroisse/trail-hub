import React, { useState } from 'react';
import { parseGPX } from '../utils/gpxParser';
import TrailCalendar from './TrailCalendar';
import { MapPin, Plus, Upload, Trash2, Calendar, Mountain, Navigation, CheckCircle2, Clock, FileText, ChevronRight, Grid, Calendar as CalendarIcon } from 'lucide-react';

export default function TrailList({ trails, onSaveTrail, onDeleteTrail, onSelectTrail }) {
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL' | 'À venir' | 'Terminé' | 'Wishlist'
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'calendar'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState('gpx'); // 'gpx' | 'manual'

  // Formulaire manuel
  const [newTrailName, setNewTrailName] = useState('');
  const [newTrailDate, setNewTrailDate] = useState(new Date().toISOString().slice(0, 10));
  const [newTrailDist, setNewTrailDist] = useState('');
  const [newTrailDPlus, setNewTrailDPlus] = useState('');
  const [newTrailStatus, setNewTrailStatus] = useState('À venir');
  const [newTrailNotes, setNewTrailNotes] = useState('');

  // Fichier GPX importé
  const [gpxFileName, setGpxFileName] = useState('');
  const [parsedGpxData, setParsedGpxData] = useState(null);

  // Gérer l'upload GPX
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setGpxFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const xmlText = event.target.result;
      const parsed = parseGPX(xmlText);
      setParsedGpxData(parsed);
      
      // Auto-remplir le nom du trail si vide
      if (!newTrailName) {
        const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " ");
        setNewTrailName(cleanName);
      }
    };
    reader.readAsText(file);
  };

  // Sauvegarder le nouveau trail (depuis GPX ou Manuel)
  const handleSubmitNewTrail = (e) => {
    e.preventDefault();
    if (!newTrailName) return;

    const trailObj = {
      id: `trail-${Date.now()}`,
      name: newTrailName,
      date: newTrailDate,
      distanceKm: parsedGpxData ? parsedGpxData.stats.totalDistanceKm : parseFloat(newTrailDist) || 0,
      dPlus: parsedGpxData ? parsedGpxData.stats.dPlus : parseInt(newTrailDPlus) || 0,
      dMinus: parsedGpxData ? parsedGpxData.stats.dMinus : parseInt(newTrailDPlus) || 0,
      status: newTrailStatus,
      notes: newTrailNotes,
      trackPoints: parsedGpxData ? parsedGpxData.trackPoints : [],
      elevationProfile: parsedGpxData ? parsedGpxData.elevationProfile : [],
      createdAt: new Date().toISOString()
    };

    onSaveTrail(trailObj);

    // Reset Form
    setNewTrailName('');
    setNewTrailDist('');
    setNewTrailDPlus('');
    setNewTrailNotes('');
    setGpxFileName('');
    setParsedGpxData(null);
    setIsModalOpen(false);
  };

  const filteredTrails = trails.filter(t => filterStatus === 'ALL' || t.status === filterStatus);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header Bar */}
      <div className="glass-card" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <MapPin size={28} color="var(--primary-orange)" />
            Mes Trails & Itinéraires GPX
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Importez vos fichiers GPX, gérez vos parcours prévus et vos courses réalisées.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {/* Boutons de changement de vue */}
          <div style={{ display: 'flex', gap: '0.25rem', background: 'rgba(15, 23, 42, 0.6)', padding: '0.35rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '0.4rem 0.8rem',
                borderRadius: '8px',
                border: 'none',
                background: viewMode === 'list' ? 'var(--primary-orange)' : 'transparent',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.85rem'
              }}
              title="Vue Liste"
            >
              <Grid size={15} />
              <span>Liste</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              style={{
                padding: '0.4rem 0.8rem',
                borderRadius: '8px',
                border: 'none',
                background: viewMode === 'calendar' ? 'var(--primary-orange)' : 'transparent',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.85rem'
              }}
              title="Vue Calendrier"
            >
              <CalendarIcon size={15} />
              <span>Calendrier</span>
            </button>
          </div>

          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
            <Plus size={18} />
            <span>Ajouter un Trail / GPX</span>
          </button>
        </div>
      </div>

      {/* Reste du code géré en dessous */}
      {viewMode === 'calendar' ? (
        <TrailCalendar trails={trails} onSelectTrail={onSelectTrail} />
      ) : (
        <>
          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {[
              { id: 'ALL', label: `Tous (${trails.length})` },
              { id: 'À venir', label: `À venir (${trails.filter(t => t.status === 'À venir').length})` },
              { id: 'Terminé', label: `Terminés (${trails.filter(t => t.status === 'Terminé').length})` },
              { id: 'Wishlist', label: `Wishlist (${trails.filter(t => t.status === 'Wishlist').length})` }
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setFilterStatus(btn.id)}
                className={`btn btn-sm ${filterStatus === btn.id ? 'btn-primary' : 'btn-secondary'}`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Grid of Trails */}
      {viewMode === 'list' && (
        filteredTrails.length === 0 ? (
          <div className="glass-card" style={{ padding: '3.5rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Upload size={42} color="var(--primary-orange)" style={{ margin: '0 auto 1rem auto', display: 'block', opacity: 0.8 }} />
            <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '1.2rem', marginBottom: '0.5rem' }}>Aucun trail trouvé</h3>
            <p style={{ fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto 1.5rem auto' }}>
              Vous n'avez pas encore ajouté d'itinéraire dans cette catégorie. Cliquez ci-dessous pour importer un fichier .GPX ou saisir un trail.
            </p>
            <button onClick={() => setIsModalOpen(true)} className="btn btn-primary btn-sm">
              <Plus size={16} /> Ajouter un trail
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {filteredTrails.map((trail) => {
              const isCompleted = trail.status === 'Terminé';
              const isWishlist = trail.status === 'Wishlist';
              return (
                <div
                  key={trail.id}
                  className="glass-card"
                  style={{
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justify: 'space-between',
                    gap: '1.25rem',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <span className={`badge ${isCompleted ? 'badge-emerald' : isWishlist ? 'badge-purple' : 'badge-orange'}`}>
                        {trail.status}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Calendar size={13} /> {trail.date || 'Non daté'}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem', lineHeight: 1.3 }}>
                      {trail.name}
                    </h3>

                    {trail.notes && (
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {trail.notes}
                      </p>
                    )}

                    <div style={{ display: 'flex', gap: '1.25rem', background: 'rgba(15, 23, 42, 0.6)', padding: '0.85rem', borderRadius: '10px', fontSize: '0.9rem' }}>
                      <div>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Distance</span>
                        <strong style={{ color: '#fff', fontSize: '1.1rem' }}>{trail.distanceKm}</strong> km
                      </div>
                      <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '1.25rem' }}>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Dénivelé D+</span>
                        <strong style={{ color: 'var(--emerald-green)', fontSize: '1.1rem' }}>+{trail.dPlus}</strong> m
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                    <button
                      onClick={() => onDeleteTrail(trail.id)}
                      className="btn btn-secondary btn-sm"
                      style={{ color: 'var(--red-accent)', background: 'transparent', border: 'none' }}
                    >
                      <Trash2 size={16} /> Supprimer
                    </button>

                    <button
                      onClick={() => onSelectTrail(trail)}
                      className="btn btn-primary btn-sm"
                    >
                      <span>Détails & GPX</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* Modal d'ajout de trail / GPX */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1.5rem'
        }}>
          <div className="glass-card" style={{ maxWidth: '540px', width: '100%', padding: '2rem', background: '#1e293b' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff' }}>Nouveau Trail / Import GPX</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
            </div>

            {/* Toggle GPX vs Manuel */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: '#0f172a', padding: '0.25rem', borderRadius: '10px' }}>
              <button
                type="button"
                onClick={() => setActiveModalTab('gpx')}
                style={{
                  flex: 1, padding: '0.5rem', borderRadius: '8px', border: 'none',
                  background: activeModalTab === 'gpx' ? 'var(--primary-orange)' : 'transparent',
                  color: '#fff', fontWeight: 700, cursor: 'pointer'
                }}
              >
                📁 Importer un fichier GPX
              </button>
              <button
                type="button"
                onClick={() => setActiveModalTab('manual')}
                style={{
                  flex: 1, padding: '0.5rem', borderRadius: '8px', border: 'none',
                  background: activeModalTab === 'manual' ? 'var(--primary-orange)' : 'transparent',
                  color: '#fff', fontWeight: 700, cursor: 'pointer'
                }}
              >
                ✍️ Saisie Manuelle
              </button>
            </div>

            <form onSubmit={handleSubmitNewTrail} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {activeModalTab === 'gpx' && (
                <div style={{ border: '2px dashed var(--primary-orange)', padding: '2rem 1.5rem', borderRadius: '12px', textAlign: 'center', background: 'rgba(249, 115, 22, 0.05)' }}>
                  <Upload size={36} color="var(--primary-orange)" style={{ margin: '0 auto 0.75rem auto', display: 'block' }} />
                  <p style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>
                    {gpxFileName ? `Fichier : ${gpxFileName}` : "Cliquez ou glissez votre fichier .gpx ici"}
                  </p>

                  <input
                    type="file"
                    accept=".gpx"
                    onChange={handleFileUpload}
                    style={{ opacity: 0, position: 'absolute', cursor: 'pointer' }}
                    id="gpx-input"
                  />
                  <label htmlFor="gpx-input" className="btn btn-secondary btn-sm" style={{ marginTop: '1rem', cursor: 'pointer' }}>
                    Parcourir mon ordinateur
                  </label>

                  {parsedGpxData && (
                    <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--emerald-green)', background: 'rgba(16, 185, 129, 0.15)', padding: '0.5rem', borderRadius: '8px' }}>
                      ✓ GPX Analysé : {parsedGpxData.stats.totalDistanceKm} km | +{parsedGpxData.stats.dPlus}m D+ ({parsedGpxData.stats.pointsCount} points)
                    </div>
                  )}
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Nom du trail</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Trail des Aiguilles Rouges 30km"
                  value={newTrailName}
                  onChange={(e) => setNewTrailName(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', background: '#0f172a', border: '1px solid var(--border-color)', color: '#fff' }}
                />
              </div>

              {activeModalTab === 'manual' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Distance (km)</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      placeholder="Ex: 42.5"
                      value={newTrailDist}
                      onChange={(e) => setNewTrailDist(e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', background: '#0f172a', border: '1px solid var(--border-color)', color: '#fff' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Dénivelé D+ (m)</label>
                    <input
                      type="number"
                      required
                      placeholder="Ex: 2500"
                      value={newTrailDPlus}
                      onChange={(e) => setNewTrailDPlus(e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', background: '#0f172a', border: '1px solid var(--border-color)', color: '#fff' }}
                    />
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Date prévisionnelle</label>
                  <input
                    type="date"
                    value={newTrailDate}
                    onChange={(e) => setNewTrailDate(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', background: '#0f172a', border: '1px solid var(--border-color)', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Statut</label>
                  <select
                    value={newTrailStatus}
                    onChange={(e) => setNewTrailStatus(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', background: '#0f172a', border: '1px solid var(--border-color)', color: '#fff' }}
                  >
                    <option value="À venir">À venir</option>
                    <option value="Terminé">Terminé</option>
                    <option value="Wishlist">Wishlist</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Notes / Remarques</label>
                <textarea
                  rows="2"
                  placeholder="Lieu, refuges, stratégie de nutrition..."
                  value={newTrailNotes}
                  onChange={(e) => setNewTrailNotes(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', background: '#0f172a', border: '1px solid var(--border-color)', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary btn-sm">Annuler</button>
                <button type="submit" className="btn btn-primary btn-sm">Enregistrer le trail</button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
