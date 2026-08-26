import React, { useState, useMemo } from 'react';
import { 
  Mountain, 
  MapPin, 
  Compass, 
  Flag, 
  ShieldCheck, 
  Download, 
  ExternalLink, 
  Search, 
  Clock, 
  Plus, 
  ChevronRight, 
  CheckCircle2, 
  Home, 
  Calendar,
  AlertTriangle
} from 'lucide-react';
import GpxMap from './GpxMap';
import ElevationProfile from './ElevationProfile';
import { ALPS_SUMMITS_LIST } from '../data/summitsData';
import { useToast } from '../context/ToastContext';

// Helper de génération de profil d'altitude interpolé
function generateSummitElevationProfile(waypoints, totalGain) {
  if (!waypoints || waypoints.length === 0) return [];
  const profile = [];
  let currentDist = 0;
  
  waypoints.forEach((wp, index) => {
    if (index > 0) {
      const prevWp = waypoints[index - 1];
      // Approximation de distance (Haversine simplifiée)
      const dLat = (wp.lat - prevWp.lat) * 111.32;
      const dLng = (wp.lng - prevWp.lng) * 111.32 * Math.cos(((wp.lat + prevWp.lat) / 2) * (Math.PI / 180));
      const dist = Math.sqrt(dLat * dLat + dLng * dLng);
      currentDist += dist;
    }
    profile.push({
      dist: Number(currentDist.toFixed(1)),
      ele: wp.ele || 2500,
      lat: wp.lat,
      lng: wp.lng
    });
  });
  return profile;
}

export default function SummitsCatalog({ onAddTrail }) {
  const [selectedSummitId, setSelectedSummitId] = useState(ALPS_SUMMITS_LIST[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [massifFilter, setMassifFilter] = useState('all');
  const [elevationFilter, setElevationFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [hoverPoint, setHoverPoint] = useState(null);

  const { addToast } = useToast();

  const selectedSummit = useMemo(() => {
    return ALPS_SUMMITS_LIST.find(s => s.id === selectedSummitId) || ALPS_SUMMITS_LIST[0];
  }, [selectedSummitId]);

  // Massifs uniques
  const uniqueMassifs = useMemo(() => {
    return Array.from(new Set(ALPS_SUMMITS_LIST.map(s => s.massif)));
  }, []);

  // Filtrage des sommets
  const filteredSummits = useMemo(() => {
    return ALPS_SUMMITS_LIST.filter(summit => {
      const matchesSearch = 
        summit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        summit.massif.toLowerCase().includes(searchQuery.toLowerCase()) ||
        summit.country.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesMassif = massifFilter === 'all' || summit.massif === massifFilter;

      const matchesElevation = 
        elevationFilter === 'all' ||
        (elevationFilter === '4000' && summit.elevationM >= 4000) ||
        (elevationFilter === '3000-4000' && summit.elevationM >= 3000 && summit.elevationM < 4000) ||
        (elevationFilter === 'sub3000' && summit.elevationM < 3000);

      const matchesDifficulty = 
        difficultyFilter === 'all' ||
        (difficultyFilter === 'F' && summit.difficulty.startsWith('F')) ||
        (difficultyFilter === 'PD' && summit.difficulty.startsWith('PD')) ||
        (difficultyFilter === 'AD' && summit.difficulty.startsWith('AD'));

      return matchesSearch && matchesMassif && matchesElevation && matchesDifficulty;
    });
  }, [searchQuery, massifFilter, elevationFilter, difficultyFilter]);

  // Profil altimétrique calculé
  const elevationProfile = useMemo(() => {
    if (!selectedSummit || !selectedSummit.waypoints) return [];
    return generateSummitElevationProfile(selectedSummit.waypoints, selectedSummit.elevationGainM);
  }, [selectedSummit]);

  // Téléchargement du fichier GPX officiel de la voie normale
  const downloadSummitGpx = (summit) => {
    if (!summit || !summit.waypoints || summit.waypoints.length === 0) {
      addToast("Tracé GPX indisponible pour ce sommet", "error");
      return;
    }

    const gpxContent = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="TrailHub - Topoguide Alpinisme" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>${summit.name}</name>
    <desc>${summit.description} - Cotation: ${summit.difficulty} - Sommet: ${summit.elevationM}m</desc>
  </metadata>
  ${summit.refuge ? `  <wpt lat="${summit.refuge.lat}" lon="${summit.refuge.lng}">
    <name>${summit.refuge.name}</name>
    <ele>${summit.refuge.elevationM}</ele>
    <type>Refuge</type>
  </wpt>` : ''}
  ${summit.waypoints.map(wp => `  <wpt lat="${wp.lat}" lon="${wp.lng}">
    <name>${wp.name}</name>
    <ele>${wp.ele || 0}</ele>
  </wpt>`).join('\n')}
  <trk>
    <name>${summit.name} (Voie Normale)</name>
    <trkseg>
      ${summit.waypoints.map(wp => `      <trkpt lat="${wp.lat}" lon="${wp.lng}">
        <ele>${wp.ele || 0}</ele>
      </trkpt>`).join('\n')}
    </trkseg>
  </trk>
</gpx>`;

    const blob = new Blob([gpxContent], { type: 'application/gpx+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${summit.id}-voie-normale.gpx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    addToast(`GPX téléchargé : ${summit.shortName}`, "success");
  };

  // Importation directe dans Mes Trails
  const handleImportToMyTrails = (summit) => {
    if (!onAddTrail) return;
    
    const newTrail = {
      id: `summit-${summit.id}-${Date.now()}`,
      name: `Ascension ${summit.shortName}`,
      location: `${summit.massif} (${summit.country})`,
      distance: Number((summit.stages?.reduce((acc, s) => acc + (s.distanceKm || 0), 0) || 12).toFixed(1)),
      elevationGain: summit.elevationGainM || 1500,
      elevationLoss: summit.elevationGainM || 1500,
      difficulty: summit.difficulty,
      estimatedTime: `${summit.recommendedDays} jours`,
      description: `${summit.description} (Refuge: ${summit.refuge?.name || 'Bivouac'})`,
      waypoints: summit.waypoints || [],
      trackPoints: summit.waypoints || [],
      profileData: elevationProfile,
      createdAt: new Date().toISOString()
    };

    onAddTrail(newTrail);
    addToast(`Ascension "${summit.shortName}" ajoutée à vos projets !`, "success");
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* ── HEADER & BANNIÈRE ALPINISME ── */}
      <div className="card" style={{ 
        position: 'relative', 
        overflow: 'hidden', 
        border: '1px solid rgba(59, 130, 246, 0.3)',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 58, 138, 0.35) 100%)' 
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span style={{ 
              background: 'rgba(59, 130, 246, 0.2)', 
              color: '#60a5fa', 
              padding: '0.35rem 0.75rem', 
              borderRadius: '20px', 
              fontSize: '0.8rem', 
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              border: '1px solid rgba(59, 130, 246, 0.4)'
            }}>
              <Mountain size={14} />
              TOPOGUIDE DES GRANDS SOMMETS
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              • {ALPS_SUMMITS_LIST.length} Voies Normales Homologuées
            </span>
          </div>

          <h2 style={{ fontSize: '1.9rem', fontWeight: 900, color: '#fff', margin: '0.3rem 0 0.75rem 0' }}>
            Grands Sommets & Refuges d'Altitude
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '850px', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
            Topoguide interactif des <strong>sommets emblématiques des Alpes et des Pyrénées</strong>. Consultez les cotations alpines (F, PD, AD), le découpage par refuge de départ, les listes de matériel requis et téléchargez la trace GPX officielle pour votre montre GPS.
          </p>
        </div>
      </div>

      {/* ── FILTRES & RECHERCHE ── */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Barre de recherche */}
          <div style={{ position: 'relative', flex: '1 1 260px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text"
              placeholder="Rechercher un sommet, un massif, un pays..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input"
              style={{ paddingLeft: '2.75rem', width: '100%' }}
            />
          </div>

          {/* Filtres déroulants */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Massif */}
            <select 
              value={massifFilter} 
              onChange={(e) => setMassifFilter(e.target.value)}
              className="input"
              style={{ width: 'auto', minWidth: '160px', padding: '0.5rem 1rem' }}
            >
              <option value="all">Tous les Massifs ({ALPS_SUMMITS_LIST.length})</option>
              {uniqueMassifs.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            {/* Altitude */}
            <select 
              value={elevationFilter} 
              onChange={(e) => setElevationFilter(e.target.value)}
              className="input"
              style={{ width: 'auto', minWidth: '150px', padding: '0.5rem 1rem' }}
            >
              <option value="all">Toutes altitudes</option>
              <option value="4000">4 000m et + (Les 4000)</option>
              <option value="3000-4000">3 000m - 4 000m</option>
              <option value="sub3000">&lt; 3 000m</option>
            </select>

            {/* Difficulté alpine */}
            <select 
              value={difficultyFilter} 
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="input"
              style={{ width: 'auto', minWidth: '150px', padding: '0.5rem 1rem' }}
            >
              <option value="all">Toutes cotations</option>
              <option value="F">F (Facile / Rando Alpine)</option>
              <option value="PD">PD (Peu Difficile)</option>
              <option value="AD">AD (Assez Difficile)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── CONTENU PRINCIPAL : LISTE & DÉTAIL DU SOMMET SÉLECTIONNÉ ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 380px) 1fr', gap: '1.75rem', alignItems: 'start' }}>
        
        {/* COLONNE GAUCHE : SÉLECTEUR DE SOMMETS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0.5rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              {filteredSummits.length} Sommet{filteredSummits.length > 1 ? 's' : ''} disponible{filteredSummits.length > 1 ? 's' : ''}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '820px', overflowY: 'auto', paddingRight: '0.25rem' }}>
            {filteredSummits.map(summit => {
              const isSelected = summit.id === selectedSummit.id;
              return (
                <div 
                  key={summit.id}
                  onClick={() => setSelectedSummitId(summit.id)}
                  className="card"
                  style={{
                    padding: '1.1rem',
                    cursor: 'pointer',
                    borderRadius: '12px',
                    border: isSelected ? `2px solid ${summit.color || '#3b82f6'}` : '1px solid var(--border-color)',
                    background: isSelected ? 'rgba(59, 130, 246, 0.08)' : 'var(--card-bg)',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ 
                        background: summit.color || '#3b82f6', 
                        color: '#fff', 
                        fontSize: '0.75rem', 
                        fontWeight: 900, 
                        padding: '0.2rem 0.5rem', 
                        borderRadius: '6px' 
                      }}>
                        {summit.elevationM} m
                      </span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                        {summit.difficulty}
                      </span>
                    </div>

                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={12} /> {summit.recommendedDays}j
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: '0.2rem 0 0.4rem 0' }}>
                    {summit.shortName}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.6rem' }}>
                    <MapPin size={13} style={{ color: summit.color || '#3b82f6' }} />
                    <span>{summit.massif} • {summit.country}</span>
                  </div>

                  {summit.refuge && (
                    <div style={{ 
                      fontSize: '0.75rem', 
                      background: 'rgba(255, 255, 255, 0.04)', 
                      padding: '0.35rem 0.6rem', 
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      color: 'var(--text-muted)'
                    }}>
                      <Home size={12} style={{ color: '#10b981' }} />
                      <span>Refuge : <strong>{summit.refuge.name}</strong> ({summit.refuge.elevationM}m)</span>
                    </div>
                  )}
                </div>
              );
            })}

            {filteredSummits.length === 0 && (
              <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                <AlertTriangle size={32} style={{ margin: '0 auto 0.75rem auto', color: '#f59e0b' }} />
                <p>Aucun sommet ne correspond à vos critères de recherche.</p>
              </div>
            )}
          </div>
        </div>

        {/* COLONNE DROITE : FICHE COMPLÈTE DU SOMMET */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* CARTE D'EN-TÊTE DU SOMMET */}
          <div className="card" style={{ padding: '1.75rem', borderTop: `4px solid ${selectedSummit.color || '#3b82f6'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                  <span style={{ 
                    background: selectedSummit.color || '#3b82f6', 
                    color: '#fff', 
                    fontSize: '0.85rem', 
                    fontWeight: 900, 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '8px' 
                  }}>
                    {selectedSummit.elevationM} m d'altitude
                  </span>
                  <span style={{ 
                    background: 'rgba(255,255,255,0.08)', 
                    color: '#fff', 
                    fontSize: '0.8rem', 
                    fontWeight: 700, 
                    padding: '0.25rem 0.6rem', 
                    borderRadius: '6px' 
                  }}>
                    Cotation : {selectedSummit.difficulty}
                  </span>
                </div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#fff', margin: '0.2rem 0' }}>
                  {selectedSummit.name}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
                  <span>📍 {selectedSummit.massif}</span>
                  <span>•</span>
                  <span>🌍 {selectedSummit.country}</span>
                  <span>•</span>
                  <span>🏔️ Type : {selectedSummit.routeType}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <button 
                  onClick={() => handleImportToMyTrails(selectedSummit)}
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Plus size={16} />
                  <span>Ajouter à Mes Projets</span>
                </button>
              </div>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, margin: '0 0 1.25rem 0' }}>
              {selectedSummit.description}
            </p>

            {/* GRILLE DES MÉTRIQUES CLÉS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Altitude Sommet</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#60a5fa' }}>{selectedSummit.elevationM} m</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Dénivelé Positif (D+)</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--emerald-green)' }}>+{selectedSummit.elevationGainM} m</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Durée Conseillée</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#f59e0b' }}>{selectedSummit.recommendedDays} Jours</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Altitude Refuge</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#a855f7' }}>{selectedSummit.refuge?.elevationM || '—'} m</span>
              </div>
            </div>

            {/* MATÉRIEL ALPIN REQUIS */}
            {selectedSummit.gearRequired && (
              <div style={{ 
                background: 'rgba(245, 158, 11, 0.08)', 
                border: '1px solid rgba(245, 158, 11, 0.25)', 
                padding: '1rem', 
                borderRadius: '10px',
                marginBottom: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fbbf24', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                  <ShieldCheck size={16} />
                  <span>MATÉRIEL ALPINISME OBLIGATOIRE RECOMMANDÉ</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {selectedSummit.gearRequired.map((item, idx) => (
                    <span 
                      key={idx}
                      style={{ 
                        background: 'rgba(0,0,0,0.3)', 
                        color: '#fef3c7', 
                        padding: '0.25rem 0.6rem', 
                        borderRadius: '6px', 
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        border: '1px solid rgba(245, 158, 11, 0.2)'
                      }}
                    >
                      ✓ {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* FICHE REFUGE */}
            {selectedSummit.refuge && (
              <div style={{ 
                background: 'rgba(16, 185, 129, 0.08)', 
                border: '1px solid rgba(16, 185, 129, 0.25)', 
                padding: '1.1rem', 
                borderRadius: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--emerald-green)', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                    <Home size={16} />
                    <span>REFUGE DE DÉPART DE L'ASCENSION</span>
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
                    {selectedSummit.refuge.name} ({selectedSummit.refuge.elevationM}m)
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Capacité : <strong>{selectedSummit.refuge.capacity} places</strong> • Gardiennage : <strong>{selectedSummit.refuge.wardenPeriod}</strong>
                  </div>
                </div>

                {selectedSummit.refuge.url && (
                  <a 
                    href={selectedSummit.refuge.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-secondary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <ExternalLink size={14} />
                    <span>Réservation & Infos Refuge</span>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* CARTE DE L'ASCENSION */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Compass size={18} style={{ color: selectedSummit.color || '#3b82f6' }} />
              <span>Tracé Cartographique de la Voie Normale</span>
            </h3>

            <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
              <GpxMap 
                waypoints={selectedSummit.waypoints || []}
                trackPoints={selectedSummit.waypoints || []}
                height="380px"
                color={selectedSummit.color || '#3b82f6'}
                hoverPoint={hoverPoint}
              />
            </div>
          </div>

          {/* PROFIL D'ALTITUDE */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mountain size={18} style={{ color: '#60a5fa' }} />
              <span>Profil Altimétrique & Pente de la Voie</span>
            </h3>

            <ElevationProfile 
              profileData={elevationProfile}
              color={selectedSummit.color || '#3b82f6'}
              height="240px"
              onHoverPoint={setHoverPoint}
            />
          </div>

          {/* DÉCOUPAGE DES ÉTAPES */}
          {selectedSummit.stages && selectedSummit.stages.length > 0 && (
            <div className="card" style={{ padding: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={18} style={{ color: '#10b981' }} />
                <span>Programme & Découpage de l'Ascension ({selectedSummit.stages.length} Jours)</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {selectedSummit.stages.map(stg => (
                  <div 
                    key={stg.number}
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid var(--border-color)',
                      padding: '1rem',
                      borderRadius: '10px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.75rem'
                    }}
                  >
                    <div>
                      <span style={{ 
                        background: 'rgba(59, 130, 246, 0.2)', 
                        color: '#60a5fa', 
                        fontSize: '0.75rem', 
                        fontWeight: 800, 
                        padding: '0.2rem 0.5rem', 
                        borderRadius: '4px',
                        marginRight: '0.6rem'
                      }}>
                        JOUR {stg.number}
                      </span>
                      <strong style={{ color: '#fff', fontSize: '0.95rem' }}>{stg.name}</strong>
                    </div>

                    <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Distance : <strong style={{ color: '#fff' }}>{stg.distanceKm} km</strong></span>
                      <span style={{ color: 'var(--text-muted)' }}>D+ : <strong style={{ color: 'var(--emerald-green)' }}>+{stg.dPlus} m</strong></span>
                      <span style={{ color: 'var(--text-muted)' }}>D- : <strong style={{ color: '#f87171' }}>-{stg.dMinus} m</strong></span>
                      <span style={{ color: 'var(--text-muted)' }}>Temps : <strong style={{ color: '#fbbf24' }}>{stg.timeEst}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BANNIÈRE SYNCHRO MONTRE & TOPOGUIDE OFFICIEL AVEC QR CODE */}
          <div className="card" style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(15, 23, 42, 0.95) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            padding: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}>
            <div style={{ flex: '1 1 300px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--emerald-green)', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                <ShieldCheck size={18} />
                <span>EXPORT MONTRE GPS & TOPOGUIDE HOMOLOGUÉ</span>
              </div>
              <h4 style={{ color: '#fff', fontWeight: 800, marginBottom: '0.4rem', fontSize: '1.1rem' }}>
                Emportez le Tracé de l'Ascension sur votre Montre
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                Scannez ce QR Code avec votre smartphone pour consulter le site officiel du sommet ou téléchargez directement le fichier GPX pour l'importer dans votre montre (Garmin, Suunto, Coros, Apple Watch, Strava).
              </p>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {selectedSummit.officialUrl && (
                  <a
                    href={selectedSummit.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm"
                    style={{
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: 'var(--emerald-green)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontWeight: 700
                    }}
                  >
                    <ExternalLink size={15} />
                    <span>Site Officiel / Topo</span>
                  </a>
                )}

                <button
                  onClick={() => downloadSummitGpx(selectedSummit)}
                  className="btn btn-sm btn-secondary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Download size={15} />
                  <span>Télécharger GPX Montre</span>
                </button>
              </div>
            </div>

            <div style={{
              background: '#fff',
              padding: '0.6rem',
              borderRadius: '10px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.35rem',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.35)',
              border: '2px solid rgba(16, 185, 129, 0.3)'
            }}>
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${encodeURIComponent(selectedSummit.officialUrl || "https://www.ffcam.fr/")}`} 
                alt={`QR Code officiel ${selectedSummit.shortName}`}
                style={{ width: '110px', height: '110px' }}
              />
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Topo Officiel
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
