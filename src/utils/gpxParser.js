// Utilitaire de lecture, analyse et génération de fichiers GPX

// Formule de Haversine pour le calcul de distance terrestre en km
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Rayon de la Terre en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Analyser un contenu XML GPX brut
export function parseGPX(xmlText) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, "application/xml");

  const trackPoints = [];
  const trkpts = xmlDoc.querySelectorAll("trkpt, rtept, wpt");

  let totalDistanceKm = 0;
  let dPlus = 0;
  let dMinus = 0;
  let minElevation = Infinity;
  let maxElevation = -Infinity;

  let prevPoint = null;

  trkpts.forEach((pt, index) => {
    const lat = parseFloat(pt.getAttribute("lat"));
    const lng = parseFloat(pt.getAttribute("lon"));
    const eleTag = pt.querySelector("ele");
    const timeTag = pt.querySelector("time");

    const ele = eleTag ? parseFloat(eleTag.textContent) : 0;
    const time = timeTag ? timeTag.textContent : null;

    if (!isNaN(lat) && !isNaN(lng)) {
      if (ele < minElevation) minElevation = ele;
      if (ele > maxElevation) maxElevation = ele;

      if (prevPoint) {
        const distStep = calculateDistanceKm(prevPoint.lat, prevPoint.lng, lat, lng);
        totalDistanceKm += distStep;

        const eleDiff = ele - prevPoint.ele;
        if (eleDiff > 0) {
          dPlus += eleDiff;
        } else {
          dMinus += Math.abs(eleDiff);
        }
      }

      const pointData = {
        index,
        lat,
        lng,
        ele,
        time,
        distanceKm: Math.round(totalDistanceKm * 100) / 100
      };

      trackPoints.push(pointData);
      prevPoint = pointData;
    }
  });

  // Calcul du profil d'élévation échantillonné (pour graphiques fluides)
  const profileSample = sampleElevationProfile(trackPoints, 100);

  return {
    trackPoints,
    stats: {
      totalDistanceKm: Math.round(totalDistanceKm * 10) / 10,
      dPlus: Math.round(dPlus),
      dMinus: Math.round(dMinus),
      minElevation: isFinite(minElevation) ? Math.round(minElevation) : 0,
      maxElevation: isFinite(maxElevation) ? Math.round(maxElevation) : 0,
      pointsCount: trackPoints.length
    },
    elevationProfile: profileSample
  };
}

// Échantillonner les points d'élévation pour alléger le rendu du graphique
function sampleElevationProfile(points, maxSamples = 100) {
  if (points.length <= maxSamples) {
    return points.map(p => ({
      dist: p.distanceKm,
      ele: p.ele
    }));
  }

  const step = Math.floor(points.length / maxSamples);
  const sampled = [];

  for (let i = 0; i < points.length; i += step) {
    sampled.push({
      dist: points[i].distanceKm,
      ele: points[i].ele
    });
  }

  // S'assurer d'inclure le dernier point
  const last = points[points.length - 1];
  if (sampled[sampled.length - 1].dist !== last.distanceKm) {
    sampled.push({
      dist: last.distanceKm,
      ele: last.ele
    });
  }

  return sampled;
}

// Générer un fichier GPX XML à télécharger
export function generateGPXString(title, waypoints) {
  let gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="TrailHub App - https://trailhub.app" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>${title}</name>
    <time>${new Date().toISOString()}</time>
  </metadata>
  <trk>
    <name>${title}</name>
    <trkseg>
`;

  waypoints.forEach((pt) => {
    gpx += `      <trkpt lat="${pt.lat}" lon="${pt.lng}">\n`;
    if (pt.ele !== undefined) gpx += `        <ele>${pt.ele}</ele>\n`;
    if (pt.name) gpx += `        <name>${pt.name}</name>\n`;
    gpx += `      </trkpt>\n`;
  });

  gpx += `    </trkseg>
  </trk>
</gpx>`;

  return gpx;
}
