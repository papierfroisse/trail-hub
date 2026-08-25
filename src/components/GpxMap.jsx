import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Icones personnalisées Leaflet
const createCustomIcon = (color, label) => {
  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 2px solid #ffffff;
        box-shadow: 0 0 10px rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        font-weight: 800;
        font-size: 11px;
        font-family: sans-serif;
      ">
        ${label}
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14]
  });
};

const startIcon = createCustomIcon('#10b981', 'D'); // Depart (Green)
const endIcon = createCustomIcon('#ef4444', 'A');   // Arrivee (Red)
const waypointIcon = createCustomIcon('#3b82f6', '•'); // Waypoint (Blue)

// Ajustement automatique des limites de la carte
function MapBoundsFitter({ points }) {
  const map = useMap();

  useEffect(() => {
    if (points && points.length > 0) {
      const bounds = L.latLngBounds(points.map(p => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [points, map]);

  return null;
}

export default function GpxMap({ waypoints = [], trackPoints = [], height = "420px", color = "#f97316" }) {
  // Déterminer le centre initial de la carte
  const center = waypoints.length > 0 
    ? [waypoints[0].lat, waypoints[0].lng] 
    : (trackPoints.length > 0 ? [trackPoints[0].lat, trackPoints[0].lng] : [45.0, 6.0]);

  const polylinePositions = trackPoints.length > 0 
    ? trackPoints.map(pt => [pt.lat, pt.lng])
    : waypoints.map(wpt => [wpt.lat, wpt.lng]);

  return (
    <div style={{ height, width: '100%', borderRadius: '14px', overflow: 'hidden', border: '1px solid var(--border-color)', position: 'relative' }}>
      <MapContainer 
        center={center} 
        zoom={9} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Tracé de la trace en ligne */}
        {polylinePositions.length > 0 && (
          <Polyline 
            positions={polylinePositions} 
            pathOptions={{ color: color, weight: 4, opacity: 0.85 }} 
          />
        )}

        {/* Marqueur de départ */}
        {waypoints.length > 0 && (
          <Marker position={[waypoints[0].lat, waypoints[0].lng]} icon={startIcon}>
            <Popup>
              <strong>Départ : {waypoints[0].name}</strong>
              {waypoints[0].ele && <div>Altitude : {waypoints[0].ele} m</div>}
            </Popup>
          </Marker>
        )}

        {/* Marqueurs intermédiaires (Waypoints) */}
        {waypoints.slice(1, -1).map((wpt, idx) => (
          <Marker key={idx} position={[wpt.lat, wpt.lng]} icon={waypointIcon}>
            <Popup>
              <strong>{wpt.name}</strong>
              {wpt.ele && <div>Altitude : {wpt.ele} m</div>}
            </Popup>
          </Marker>
        ))}

        {/* Marqueur d'arrivée */}
        {waypoints.length > 1 && (
          <Marker position={[waypoints[waypoints.length - 1].lat, waypoints[waypoints.length - 1].lng]} icon={endIcon}>
            <Popup>
              <strong>Arrivée : {waypoints[waypoints.length - 1].name}</strong>
              {waypoints[waypoints.length - 1].ele && <div>Altitude : {waypoints[waypoints.length - 1].ele} m</div>}
            </Popup>
          </Marker>
        )}

        {/* Fit Bounds */}
        <MapBoundsFitter points={waypoints.length > 0 ? waypoints : trackPoints} />
      </MapContainer>
    </div>
  );
}
