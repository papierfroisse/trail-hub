import React, { useState, useEffect } from 'react';
import { FAMOUS_GR_LIST } from '../data/grData';
import { ALL_GR_CATALOG } from '../data/allGrCatalog';
import { CITIES_COORDINATES } from '../data/citiesCoordinates';
import GpxMap from './GpxMap';
import ElevationProfile from './ElevationProfile';
import { Compass, MapPin, Navigation, Mountain, Calendar, Layers, PlusCircle, Search, Download, Activity } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';

export default function GrCatalog({ onSelectGrForPlanner }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCatalogTab, setActiveCatalogTab] = useState('famous'); // 'famous' | 'all'
  
  // Fonction pour extraire le numéro du GR afin de trier numériquement
  const getGrNumber = (gr) => {
    if (!gr) return 9999;
    if (gr.num) return parseInt(gr.num, 10);
    const match = (gr.shortName || '').match(/\d+/);
    return match ? parseInt(match[0], 10) : 9999;
  };

  // Liste complète triée statique (Fallback)
  const sortedAllGrList = [...FAMOUS_GR_LIST, ...ALL_GR_CATALOG].sort((a, b) => getGrNumber(a) - getGrNumber(b));

  const [famousGrs, setFamousGrs] = useState(FAMOUS_GR_LIST);
  const [allGrs, setAllGrs] = useState(sortedAllGrList);
  const [selectedGr, setSelectedGr] = useState(FAMOUS_GR_LIST[0]);
  const [activeViewMode, setActiveViewMode] = useState('stages'); // 'stages' | 'map' | 'profile'
  const [loadingDb, setLoadingDb] = useState(false);
  const [hikerProfile, setHikerProfile] = useState('active'); // 'relaxed' | 'active' | 'runner' | 'ultra'

  // Charger les GR réels depuis Supabase si configuré
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const fetchGrsFromDb = async () => {
      setLoadingDb(true);
      try {
        const { data, error } = await supabase
          .from('gr_routes')
          .select('*');

        if (error) throw error;

        if (data && data.length > 0) {
          const formatted = data.map(gr => ({
            id: gr.id,
            name: gr.name,
            shortName: gr.short_name,
            region: gr.region,
            color: gr.color,
            distanceKm: gr.distance_km,
            elevationGainM: gr.elevation_gain_m,
            recommendedDays: gr.recommended_days,
            description: gr.description,
            stages: gr.stages || [],
            waypoints: gr.waypoints || [],
            isDetailed: gr.stages && gr.stages.length > 0
          }));

          // Les GR Majeurs (ceux avec étapes détaillées)
          const famous = formatted.filter(gr => gr.isDetailed || ['gr20', 'gr21', 'gr34', 'gr52', 'gr54', 'gr58', 'gr65', 'gr70', 'gr400', 'gr738', 'gr5', 'gr10'].includes(gr.id));
          // Tous les GR triés numériquement
          const sortedAll = [...formatted].sort((a, b) => getGrNumber(a) - getGrNumber(b));

          setFamousGrs(famous);
          setAllGrs(sortedAll);

          // Mettre à jour le GR sélectionné si présent en base
          const match = formatted.find(g => g.id === selectedGr.id);
          if (match) {
            setSelectedGr(match);
          } else {
            setSelectedGr(famous[0] || formatted[0]);
          }
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des GR Supabase:", err);
      } finally {
        setLoadingDb(false);
      }
    };

    fetchGrsFromDb();
  }, []);

  // Générateur dynamique d'étapes et de coordonnées réelles à partir du dictionnaire de villes
  const enrichSimpleGr = (gr) => {
    if (!gr) return null;
    if (gr.stages && gr.stages.length > 0) return gr; // Déjà détaillé

    const rawCities = gr.description.split(' • ').map(c => c.trim().replace(/\(.*?\)/g, '').trim());
    const cities = rawCities.filter(c => c.length > 1);
    const citiesCount = cities.length;

    // Déterminer le relief de la région pour les simulations d'altitudes
    let reliefMaxEle = 120;
    let roughness = 0.05;
    const reg = (gr.region || '').toLowerCase();
    if (reg.includes('alpes') || reg.includes('mercantour')) {
      reliefMaxEle = 2600;
      roughness = 0.25;
    } else if (reg.includes('pyrénées')) {
      reliefMaxEle = 2400;
      roughness = 0.22;
    } else if (reg.includes('corse')) {
      reliefMaxEle = 2100;
      roughness = 0.20;
    } else if (reg.includes('massif central') || reg.includes('auvergne') || reg.includes('cévennes')) {
      reliefMaxEle = 1400;
      roughness = 0.15;
    } else if (reg.includes('bretagne')) {
      reliefMaxEle = 320;
      roughness = 0.08;
    } else if (reg.includes('normandie')) {
      reliefMaxEle = 300;
      roughness = 0.07;
    } else if (reg.includes('jura')) {
      reliefMaxEle = 1500;
      roughness = 0.18;
    } else if (reg.includes('vosges') || reg.includes('alsace')) {
      reliefMaxEle = 1200;
      roughness = 0.14;
    } else if (reg.includes('provence') || reg.includes('var') || reg.includes('marseille')) {
      reliefMaxEle = 900;
      roughness = 0.12;
    }

    // Résoudre les coordonnées réelles des villes
    const resolvedPoints = [];
    cities.forEach(cityName => {
      const match = CITIES_COORDINATES[cityName.toLowerCase()];
      if (match) {
        resolvedPoints.push({
          name: cityName,
          lat: match.lat,
          lng: match.lng,
          ele: Math.round(80 + Math.random() * (reliefMaxEle * 0.4))
        });
      }
    });

    // Si on a moins de 2 points trouvés, on fait un tracé de repli centré sur la région
    if (resolvedPoints.length < 2) {
      let baseCoords = { lat: 46.5, lng: 2.5 };
      if (reg.includes('alpes')) baseCoords = { lat: 45.0, lng: 6.2 };
      else if (reg.includes('pyrénées')) baseCoords = { lat: 42.8, lng: 0.5 };
      else if (reg.includes('corse')) baseCoords = { lat: 42.1, lng: 9.1 };
      else if (reg.includes('bretagne')) baseCoords = { lat: 48.2, lng: -3.0 };
      else if (reg.includes('normandie')) baseCoords = { lat: 49.2, lng: -0.5 };
      else if (reg.includes('île-de-france') || reg.includes('paris')) baseCoords = { lat: 48.85, lng: 2.35 };

      for (let i = 0; i < Math.max(citiesCount, 3); i++) {
        const cityName = cities[i % citiesCount] || `Point ${i}`;
        const angle = (i / Math.max(citiesCount, 3)) * Math.PI * 1.5;
        const radius = 0.2 + (i * 0.05);
        resolvedPoints.push({
          name: cityName,
          lat: baseCoords.lat + Math.sin(angle) * radius,
          lng: baseCoords.lng + Math.cos(angle) * radius,
          ele: Math.round(80 + Math.random() * (reliefMaxEle * 0.3))
        });
      }
    }

    // Calculer la distance réelle cumulée entre les points géocodés
    let realDist = 0;
    for (let i = 0; i < resolvedPoints.length - 1; i++) {
      const lat1 = resolvedPoints[i].lat * Math.PI / 180;
      const lon1 = resolvedPoints[i].lng * Math.PI / 180;
      const lat2 = resolvedPoints[i+1].lat * Math.PI / 180;
      const lon2 = resolvedPoints[i+1].lng * Math.PI / 180;
      const dlat = lat2 - lat1;
      const dlon = lon2 - lon1;
      const a = Math.sin(dlat/2) * Math.sin(dlat/2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon/2) * Math.sin(dlon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      realDist += 6371 * c;
    }

    // Si le GR est circulaire (ex: Tour de Paris / boucle), on boucle le tracé
    const isCircular = gr.name.toLowerCase().includes('tour') || gr.name.toLowerCase().includes('boucle');
    if (isCircular && resolvedPoints.length > 2) {
      // Connecter le dernier point au premier
      resolvedPoints.push({
        ...resolvedPoints[0],
        name: resolvedPoints[0].name + " (Retour)"
      });
      // Rajouter la dernière liaison à la distance
      const i = resolvedPoints.length - 2;
      const lat1 = resolvedPoints[i].lat * Math.PI / 180;
      const lon1 = resolvedPoints[i].lng * Math.PI / 180;
      const lat2 = resolvedPoints[0].lat * Math.PI / 180;
      const lon2 = resolvedPoints[0].lng * Math.PI / 180;
      const dlat = lat2 - lat1;
      const dlon = lon2 - lon1;
      const a = Math.sin(dlat/2) * Math.sin(dlat/2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon/2) * Math.sin(dlon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      realDist += 6371 * c;
    }

    const finalDistance = Math.round(gr.distanceKm || realDist || 120);
    const numStages = Math.max(Math.ceil(finalDistance / 22), 2);
    const distPerStage = finalDistance / numStages;

    // Découper le tracé en étapes journalières basées sur les points géocodés
    const stages = [];
    let accumulatedDPlus = 0;

    for (let i = 1; i <= numStages; i++) {
      const ptIndexStart = Math.floor(((i - 1) / numStages) * (resolvedPoints.length - 1));
      const ptIndexEnd = Math.floor((i / numStages) * (resolvedPoints.length - 1));
      const startCity = resolvedPoints[ptIndexStart]?.name || "Départ";
      const endCity = resolvedPoints[ptIndexEnd]?.name || "Arrivée";
      
      const stageDPlus = Math.round((0.55 + Math.random() * 0.7) * (reliefMaxEle / 3.0));
      accumulatedDPlus += stageDPlus;

      const speed = 4.0 - (stageDPlus / 600);
      const activeSpeed = Math.max(speed, 2.3);
      const rawHours = distPerStage / activeSpeed;
      const hours = Math.floor(rawHours);
      const minutes = Math.round((rawHours % 1) * 60);

      stages.push({
        number: i,
        name: `${startCity} ➔ ${endCity}`,
        distanceKm: Math.round(distPerStage * 10) / 10,
        dPlus: stageDPlus,
        timeEst: `${hours}h${minutes < 10 ? '0' : ''}${minutes}`
      });
    }

    return {
      ...gr,
      distanceKm: finalDistance,
      elevationGainM: accumulatedDPlus,
      recommendedDays: numStages,
      stages,
      waypoints: resolvedPoints
    };
  };

  // Liste fusionnée dynamique
  const currentCatalogList = activeCatalogTab === 'famous' ? famousGrs : allGrs;

  const filteredGrs = currentCatalogList.filter(gr => 
    gr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (gr.region || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (gr.shortName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectGr = (gr) => {
    setSelectedGr(enrichSimpleGr(gr));
    setActiveViewMode('stages');
  };

  const handleTabChange = (tab) => {
    setActiveCatalogTab(tab);
    const list = tab === 'famous' ? famousGrs : allGrs;
    setSelectedGr(enrichSimpleGr(list[0]));
    setActiveViewMode('stages');
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
  const climbs = hasWaypoints ? detectClimbs(selectedGr.waypoints) : [];

  const getEstimatedTime = (dist, dPlus, profile) => {
    let baseSpeed = 4.5;
    let dPlusPenalty = 10;
    
    if (profile === 'relaxed') {
      baseSpeed = 3.5;
      dPlusPenalty = 12;
    } else if (profile === 'active') {
      baseSpeed = 4.5;
      dPlusPenalty = 10;
    } else if (profile === 'runner') {
      baseSpeed = 8.0;
      dPlusPenalty = 6;
    } else if (profile === 'ultra') {
      baseSpeed = 10.0;
      dPlusPenalty = 5;
    }
    
    const rawHours = dist / baseSpeed;
    const penaltyHours = (dPlus / 100) * (dPlusPenalty / 60);
    const totalHours = rawHours + penaltyHours;
    
    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours % 1) * 60);
    return `${hours}h${minutes < 10 ? '0' : ''}${minutes}`;
  };

  const downloadGpx = (gr) => {
    if (!gr || !gr.waypoints || gr.waypoints.length === 0) return;
    
    let gpxContent = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="TrailHub" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>${gr.name}</name>
    <desc>${gr.description || ''}</desc>
  </metadata>
  <trk>
    <name>${gr.shortName}</name>
    <trkseg>`;

    gr.waypoints.forEach(pt => {
      gpxContent += `
      <trkpt lat="${pt.lat}" lon="${pt.lng}">
        <name>${pt.name}</name>
        <ele>${pt.ele || 0}</ele>
      </trkpt>`;
    });

    gpxContent += `
    </trkseg>
  </trk>
</gpx>`;

    const blob = new Blob([gpxContent], { type: 'application/gpx+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${gr.id}_route.gpx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getClimbCategory = (dPlus, distKm) => {
    const score = dPlus * (dPlus / (distKm * 1000 || 1));
    if (dPlus > 800 || score > 40) return { label: 'Hors Catégorie (HC)', color: '#ef4444' };
    if (dPlus > 500 || score > 25) return { label: '1ère Catégorie', color: '#f97316' };
    if (dPlus > 300 || score > 15) return { label: '2ème Catégorie', color: '#eab308' };
    if (dPlus > 180 || score > 8) return { label: '3ème Catégorie', color: '#3b82f6' };
    return { label: '4ème Catégorie', color: '#10b981' };
  };

  const detectClimbs = (waypoints) => {
    if (!waypoints || waypoints.length < 2) return [];
    
    const climbs = [];
    let currentClimb = null;
    
    // Calculer la distance cumulée entre les points
    const pointsWithDist = [];
    let totalDist = 0;
    
    for (let i = 0; i < waypoints.length; i++) {
      if (i > 0) {
        const lat1 = waypoints[i-1].lat * Math.PI / 180;
        const lon1 = waypoints[i-1].lng * Math.PI / 180;
        const lat2 = waypoints[i].lat * Math.PI / 180;
        const lon2 = waypoints[i].lng * Math.PI / 180;
        const dlat = lat2 - lat1;
        const dlon = lon2 - lon1;
        const a = Math.sin(dlat/2) * Math.sin(dlat/2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon/2) * Math.sin(dlon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        totalDist += 6371 * c;
      }
      pointsWithDist.push({
        ...waypoints[i],
        dist: totalDist
      });
    }

    // Parcourir les points pour détecter les segments ascendants
    for (let i = 0; i < pointsWithDist.length - 1; i++) {
      const p1 = pointsWithDist[i];
      const p2 = pointsWithDist[i+1];
      const eleDiff = p2.ele - p1.ele;
      const distDiff = p2.dist - p1.dist;
      
      if (eleDiff > 5) { // Ça monte
        if (!currentClimb) {
          currentClimb = {
            startIndex: i,
            startName: p1.name,
            startEle: p1.ele,
            startDist: p1.dist,
            maxEle: p2.ele,
            endName: p2.name,
            endDist: p2.dist,
            dPlus: eleDiff
          };
        } else {
          currentClimb.maxEle = Math.max(currentClimb.maxEle, p2.ele);
          currentClimb.endName = p2.name;
          currentClimb.endDist = p2.dist;
          currentClimb.dPlus += eleDiff;
        }
      } else if (eleDiff < -35) { // Ça descend de façon significative, on clôture la montée en cours
        if (currentClimb) {
          const climbDist = currentClimb.endDist - currentClimb.startDist;
          const slope = climbDist > 0.1 ? (currentClimb.dPlus / (climbDist * 1000)) * 100 : 0;
          
          if (currentClimb.dPlus >= 120 && slope >= 2.0) {
            climbs.push({
              name: `${currentClimb.startName} ➔ ${currentClimb.endName}`,
              distanceKm: Math.round(climbDist * 10) / 10,
              dPlus: Math.round(currentClimb.dPlus),
              slopeAvg: Math.round(slope * 10) / 10,
              startEle: currentClimb.startEle,
              endEle: currentClimb.maxEle
            });
          }
          currentClimb = null;
        }
      }
    }
    
    // Si une montée est encore active à la fin
    if (currentClimb) {
      const climbDist = currentClimb.endDist - currentClimb.startDist;
      const slope = climbDist > 0.1 ? (currentClimb.dPlus / (climbDist * 1000)) * 100 : 0;
      if (currentClimb.dPlus >= 120 && slope >= 2.0) {
        climbs.push({
          name: `${currentClimb.startName} ➔ ${currentClimb.endName}`,
          distanceKm: Math.round(climbDist * 10) / 10,
          dPlus: Math.round(currentClimb.dPlus),
          slopeAvg: Math.round(slope * 10) / 10,
          startEle: currentClimb.startEle,
          endEle: currentClimb.maxEle
        });
      }
    }
    
    return climbs;
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

              {/* Boutons d'action */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {hasWaypoints && (
                  <button
                    onClick={() => downloadGpx(selectedGr)}
                    className="btn"
                    style={{
                      background: 'rgba(59, 130, 246, 0.15)',
                      color: '#60a5fa',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.6rem 1.1rem',
                      borderRadius: '8px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Download size={18} />
                    <span>Exporter GPX</span>
                  </button>
                )}
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

            {/* Volet de liaison GPS / Montre */}
            {hasWaypoints && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.05), rgba(15, 23, 42, 0.4))',
                padding: '1.25rem',
                borderRadius: '12px',
                border: '1px solid rgba(249, 115, 22, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1.5rem',
                flexWrap: 'wrap'
              }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: '0.4rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Activity size={16} color="#fc5200" />
                    Synchroniser sur votre Montre / GPS
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.5, margin: 0 }}>
                    Scannez ce QR Code avec votre téléphone pour ouvrir le tracé officiel dans votre application <strong>Strava</strong>. Vous pourrez ensuite le synchroniser directement sur votre montre en 1 clic !
                  </p>
                </div>
                <div style={{
                  background: '#fff',
                  padding: '0.5rem',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(selectedGr.stravaRouteUrl || `https://www.strava.com/routes/explore?query=${selectedGr.shortName}`)}`} 
                    alt="QR Code de synchronisation montre"
                    style={{ width: '100px', height: '100px' }}
                  />
                </div>
              </div>
            )}

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
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                        <Layers size={18} color={selectedGr.color} />
                        Étapes journalières ({selectedGr.stages.length})
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(15, 23, 42, 0.4)', padding: '0.35rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rythme :</span>
                        <select 
                          value={hikerProfile} 
                          onChange={(e) => setHikerProfile(e.target.value)}
                          style={{
                            background: 'rgba(15, 23, 42, 0.8)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '0.2rem 0.5rem',
                            fontSize: '0.75rem',
                            outline: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="relaxed">🚶‍♂️ Randonneur tranquille (3.5 km/h)</option>
                          <option value="active">🥾 Randonneur actif (4.5 km/h)</option>
                          <option value="runner">🏃‍♂️ Traileur léger (8.0 km/h)</option>
                          <option value="ultra">⚡ Ultra-traileur (10.0 km/h)</option>
                        </select>
                      </div>
                    </div>
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
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Est: {getEstimatedTime(stage.distanceKm, stage.dPlus || 0, hikerProfile)}</div>
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

                {/* 3. Analyse ClimbPro — Détection des cols */}
                {climbs.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                      <Mountain size={18} color="#fc5200" />
                      Analyse des Cols (ClimbPro)
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                      {climbs.map((climb, idx) => {
                        const cat = getClimbCategory(climb.dPlus, climb.distanceKm);
                        return (
                          <div 
                            key={idx}
                            style={{
                              padding: '1rem',
                              borderRadius: '12px',
                              background: 'rgba(15, 23, 42, 0.65)',
                              border: '1px solid var(--border-color)',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.5rem'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: cat.color }}>
                                {cat.label}
                              </span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                Alt: {climb.startEle}m ➔ {climb.endEle}m
                              </span>
                            </div>
                            <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {climb.name}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
                              <div>Long. : <strong style={{ color: '#fff' }}>{climb.distanceKm} km</strong></div>
                              <div>Dénivelé : <strong style={{ color: 'var(--primary-orange)' }}>+{climb.dPlus}m</strong></div>
                              <div>Pente : <strong style={{ color: '#fff' }}>{climb.slopeAvg}%</strong></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 4. Profil d'Altitude */}
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
