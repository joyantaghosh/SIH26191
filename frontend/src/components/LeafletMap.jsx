import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon path issue in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom colored marker creator
function createColoredIcon(color) {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `<div style="
      width: 22px; height: 22px;
      background: ${color};
      border: 2px solid #080C08;
      border-radius: 50%;
      box-shadow: 0 0 12px ${color}88, 0 4px 8px rgba(0,0,0,0.5);
    "></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -14],
  });
}

// Component to recenter map when center prop changes
function RecenterMap({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || map.getZoom(), { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
}

/**
 * LeafletMap - A reusable interactive map component styled for the Safe Zones dark theme.
 *
 * Props:
 * - center: [lat, lng] array
 * - zoom: number (default 13)
 * - markers: Array of { position: [lat, lng], label, color, popupContent }
 * - circles: Array of { center: [lat, lng], radius, color, fillColor, fillOpacity, label }
 * - polylines: Array of { positions: [[lat,lng],...], color, weight, dashArray, opacity }
 * - className: extra container classes
 * - style: extra container styles
 */
export default function LeafletMap({
  center = [-6.2, 106.8],
  zoom = 13,
  markers = [],
  circles = [],
  polylines = [],
  className = '',
  style = {},
}) {
  return (
    <div className={`relative w-full h-full ${className}`} style={style}>
      {/* Dark theme CSS overrides for Leaflet */}
      <style>{`
        .leaflet-container {
          background: #060906 !important;
          font-family: 'Inter', sans-serif !important;
        }
        .leaflet-tile-pane {
          filter: brightness(0.35) contrast(1.3) saturate(0.3) hue-rotate(80deg);
        }
        .leaflet-control-zoom a {
          background: #0D120C !important;
          color: #86A978 !important;
          border-color: rgba(122,154,110,0.3) !important;
        }
        .leaflet-control-zoom a:hover {
          background: #1A231A !important;
          color: #E4E9DF !important;
        }
        .leaflet-control-attribution {
          background: rgba(8,12,8,0.85) !important;
          color: #565C51 !important;
          font-size: 9px !important;
        }
        .leaflet-control-attribution a {
          color: #7A9A6E !important;
        }
        .leaflet-popup-content-wrapper {
          background: #0D120C !important;
          color: #E4E9DF !important;
          border: 1px solid rgba(122,154,110,0.3) !important;
          border-radius: 12px !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.7) !important;
          font-family: 'Inter', sans-serif !important;
          font-size: 12px !important;
          font-weight: 300 !important;
        }
        .leaflet-popup-tip {
          background: #0D120C !important;
          border: 1px solid rgba(122,154,110,0.3) !important;
        }
        .leaflet-popup-close-button {
          color: #777C70 !important;
        }
        .custom-leaflet-marker {
          background: transparent !important;
          border: none !important;
        }
      `}</style>

      <MapContainer
        center={center}
        zoom={zoom}
        zoomControl={true}
        className="w-full h-full rounded-none"
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <RecenterMap center={center} zoom={zoom} />

        {/* Render circles (risk zones, hazard areas) */}
        {circles.map((circle, i) => (
          <Circle
            key={`circle-${i}`}
            center={circle.center}
            radius={circle.radius || 500}
            pathOptions={{
              color: circle.color || '#DC2626',
              fillColor: circle.fillColor || circle.color || '#DC2626',
              fillOpacity: circle.fillOpacity || 0.15,
              weight: 1.5,
              dashArray: circle.dashArray || '6 4',
            }}
          >
            {circle.label && <Popup>{circle.label}</Popup>}
          </Circle>
        ))}

        {/* Render polylines (routes) */}
        {polylines.map((line, i) => (
          <Polyline
            key={`polyline-${i}`}
            positions={line.positions}
            pathOptions={{
              color: line.color || '#7A9A6E',
              weight: line.weight || 4,
              dashArray: line.dashArray || null,
              opacity: line.opacity !== undefined ? line.opacity : 1,
            }}
          >
            {line.label && <Popup>{line.label}</Popup>}
          </Polyline>
        ))}

        {/* Render markers */}
        {markers.map((marker, i) => (
          <Marker
            key={`marker-${i}`}
            position={marker.position}
            icon={createColoredIcon(marker.color || '#86A978')}
          >
            {(marker.label || marker.popupContent) && (
              <Popup>
                {marker.label && <strong style={{ color: '#E4E9DF' }}>{marker.label}</strong>}
                {marker.popupContent && <div style={{ color: '#B0B5A8', marginTop: 4 }}>{marker.popupContent}</div>}
              </Popup>
            )}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
