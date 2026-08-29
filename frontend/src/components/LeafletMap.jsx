import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getRiskZones } from '../services/riskZoneApi';

// Fix default marker icon path issue in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom glowing risk marker creator
function createRiskMarkerIcon(color = '#7A9A6E', isCritical = false, isSelected = false) {
  const pulseHtml = isCritical
    ? `<div style="
        position: absolute;
        top: -6px; left: -6px;
        width: 32px; height: 32px;
        border-radius: 50%;
        background: ${color}44;
        animation: leaflet-ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
      "></div>`
    : '';

  const selectRingHtml = isSelected
    ? `<div style="
        position: absolute;
        top: -4px; left: -4px;
        width: 28px; height: 28px;
        border-radius: 50%;
        border: 2px solid #FFFFFF;
        box-shadow: 0 0 10px #FFFFFF;
      "></div>`
    : '';

  return L.divIcon({
    className: 'custom-leaflet-risk-marker',
    html: `
      <div style="position: relative; width: 20px; height: 20px;">
        ${pulseHtml}
        ${selectRingHtml}
        <div style="
          width: 20px; height: 20px;
          background: ${color};
          border: 2px solid #080C08;
          border-radius: 50%;
          box-shadow: 0 0 14px ${color}AA, 0 3px 8px rgba(0,0,0,0.8);
          position: relative;
          z-index: 2;
        "></div>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -14],
  });
}

// Helper to recenter map smoothly when center prop changes
function RecenterMap({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && Array.isArray(center) && center.length === 2 && !isNaN(center[0]) && !isNaN(center[1])) {
      map.flyTo(center, zoom || map.getZoom(), { duration: 1.2, easeLinearity: 0.25 });
    }
  }, [center, zoom, map]);
  return null;
}

/**
 * LeafletMap - Geospatial Dark-Themed Interactive Map
 * 
 * Supports:
 * - Direct DB risk zones loading (`loadDbZones={true}`)
 * - Custom markers, circles, polylines
 * - Interactive zone selection callback (`onZoneClick`)
 * - Dark cartographic styling
 */
export default function LeafletMap({
  center = [-6.2, 106.8],
  zoom = 13,
  markers = [],
  circles = [],
  polylines = [],
  loadDbZones = false,
  activeZoneId = null,
  onZoneClick = null,
  className = '',
  style = {},
}) {
  const [dbZones, setDbZones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  // Load zones from database if requested or if no custom layers supplied
  useEffect(() => {
    if (!loadDbZones && (markers.length > 0 || circles.length > 0)) {
      return;
    }

    let isMounted = true;
    setLoading(true);
    setFetchError(null);

    getRiskZones()
      .then((zones) => {
        if (isMounted) {
          setDbZones(zones);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.warn('[LeafletMap] Could not fetch DB risk zones:', err.message);
          setFetchError(err.message);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [loadDbZones, markers.length, circles.length]);

  // Combine DB zones with prop circles/markers if active
  const effectiveCenter = useMemo(() => {
    if (center && !isNaN(center[0]) && !isNaN(center[1])) return center;
    if (dbZones.length > 0 && dbZones[0].latLng) return dbZones[0].latLng;
    return [-6.2, 106.8];
  }, [center, dbZones]);

  return (
    <div className={`relative w-full h-full min-h-[300px] overflow-hidden ${className}`} style={style}>
      {/* Dark theme CSS overrides for Leaflet */}
      <style>{`
        @keyframes leaflet-ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .leaflet-container {
          background: #060906 !important;
          font-family: 'Inter', sans-serif !important;
          width: 100%;
          height: 100%;
        }
        .leaflet-tile-pane {
          filter: brightness(0.42) contrast(1.25) saturate(0.35) hue-rotate(85deg);
        }
        .leaflet-control-zoom {
          border: 1px solid rgba(122,154,110,0.2) !important;
          border-radius: 10px !important;
          overflow: hidden !important;
        }
        .leaflet-control-zoom a {
          background: #0D120C !important;
          color: #86A978 !important;
          border-color: rgba(122,154,110,0.2) !important;
          transition: all 0.2s ease;
        }
        .leaflet-control-zoom a:hover {
          background: #1A231A !important;
          color: #E4E9DF !important;
        }
        .leaflet-control-attribution {
          background: rgba(8,12,8,0.85) !important;
          color: #565C51 !important;
          font-size: 10px !important;
          backdrop-blur: 4px;
        }
        .leaflet-control-attribution a {
          color: #7A9A6E !important;
        }
        .leaflet-popup-content-wrapper {
          background: #0D120C !important;
          color: #E4E9DF !important;
          border: 1px solid rgba(122,154,110,0.35) !important;
          border-radius: 14px !important;
          box-shadow: 0 12px 36px rgba(0,0,0,0.85) !important;
          font-family: 'Inter', sans-serif !important;
          padding: 4px !important;
        }
        .leaflet-popup-tip {
          background: #0D120C !important;
          border: 1px solid rgba(122,154,110,0.35) !important;
        }
        .leaflet-popup-close-button {
          color: #777C70 !important;
          padding: 6px !important;
        }
        .leaflet-popup-close-button:hover {
          color: #E4E9DF !important;
        }
        .custom-leaflet-risk-marker {
          background: transparent !important;
          border: none !important;
        }
      `}</style>

      <MapContainer
        center={effectiveCenter}
        zoom={zoom}
        zoomControl={true}
        className="w-full h-full"
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <RecenterMap center={effectiveCenter} zoom={zoom} />

        {/* 1. DB RISK ZONES (Circles & Markers) */}
        {dbZones.map((zone) => {
          const isSelected = activeZoneId === zone.id || activeZoneId === zone.zoneId;
          const isCritical = zone.riskLevel === 'critical' || zone.riskLevel === 'high';
          const color = zone.color || (isCritical ? '#EF4444' : '#F59E0B');

          return (
            <React.Fragment key={`db-zone-${zone.id}`}>
              {/* Perimeter Risk Circle */}
              <Circle
                center={zone.latLng}
                radius={zone.radiusMeters || 800}
                pathOptions={{
                  color: color,
                  fillColor: color,
                  fillOpacity: isSelected ? 0.28 : 0.14,
                  weight: isSelected ? 2.5 : 1.5,
                  dashArray: isCritical ? '6 4' : null,
                }}
                eventHandlers={{
                  click: () => onZoneClick && onZoneClick(zone),
                }}
              />

              {/* Center Risk Zone Marker */}
              <Marker
                position={zone.latLng}
                icon={createRiskMarkerIcon(color, isCritical, isSelected)}
                eventHandlers={{
                  click: () => onZoneClick && onZoneClick(zone),
                }}
              >
                <Popup>
                  <div className="p-2 min-w-[210px] text-xs font-sans">
                    <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-[rgba(228,233,223,0.1)]">
                      <span className="font-mono text-[10px] font-semibold text-[#86A978] uppercase px-1.5 py-0.5 rounded bg-[#1D2A1B]">
                        {zone.zoneId}
                      </span>
                      <span
                        className="text-[10px] uppercase font-medium px-2 py-0.5 rounded-full"
                        style={{
                          background: `${color}22`,
                          color: color,
                          border: `1px solid ${color}44`,
                        }}
                      >
                        {zone.riskLevel}
                      </span>
                    </div>

                    <h4 className="font-medium text-[13px] text-[#E4E9DF] leading-tight mb-1">{zone.name}</h4>
                    {zone.region && <p className="text-[11px] text-[#777C70] mb-2">{zone.region}</p>}

                    <div className="grid grid-cols-2 gap-1.5 my-2 pt-1 border-t border-[rgba(228,233,223,0.06)] text-[10px]">
                      <div>
                        <span className="text-[#777C70] block">Vulnerability</span>
                        <span className="text-[#E4E9DF] font-medium">{zone.vulnerabilityScore}/100</span>
                      </div>
                      <div>
                        <span className="text-[#777C70] block">Severity</span>
                        <span className="text-[#E4E9DF] font-medium">{zone.severityIndex}/10</span>
                      </div>
                      <div>
                        <span className="text-[#777C70] block">Population</span>
                        <span className="text-[#E4E9DF] font-medium">{zone.population.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[#777C70] block">Hazard</span>
                        <span className="text-[#86A978] font-medium truncate capitalize">
                          {zone.hazardType.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>

                    {onZoneClick && (
                      <button
                        type="button"
                        onClick={() => onZoneClick(zone)}
                        className="w-full mt-2 py-1.5 px-3 bg-[#1D2A1B] hover:bg-[#6F9164] text-[#86A978] hover:text-[#080C08] border border-[rgba(122,154,110,0.3)] rounded-lg text-[11px] font-medium transition-colors"
                      >
                        Inspect Telemetry →
                      </button>
                    )}
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}

        {/* 2. CUSTOM PROP CIRCLES */}
        {circles.map((circle, i) => (
          <Circle
            key={`custom-circle-${i}`}
            center={circle.center}
            radius={circle.radius || 500}
            pathOptions={{
              color: circle.color || '#DC2626',
              fillColor: circle.fillColor || circle.color || '#DC2626',
              fillOpacity: circle.fillOpacity !== undefined ? circle.fillOpacity : 0.15,
              weight: circle.weight || 1.5,
              dashArray: circle.dashArray || '6 4',
            }}
          >
            {circle.label && (
              <Popup>
                <div className="p-1 text-xs text-[#E4E9DF]">{circle.label}</div>
              </Popup>
            )}
          </Circle>
        ))}

        {/* 3. CUSTOM PROP POLYLINES (Evacuation Routes) */}
        {polylines.map((line, i) => (
          <Polyline
            key={`custom-poly-${i}`}
            positions={line.positions}
            pathOptions={{
              color: line.color || '#7A9A6E',
              weight: line.weight || 4,
              dashArray: line.dashArray || null,
              opacity: line.opacity !== undefined ? line.opacity : 1,
            }}
          >
            {line.label && (
              <Popup>
                <div className="p-1 text-xs text-[#E4E9DF]">{line.label}</div>
              </Popup>
            )}
          </Polyline>
        ))}

        {/* 4. CUSTOM PROP MARKERS */}
        {markers.map((marker, i) => (
          <Marker
            key={`custom-marker-${i}`}
            position={marker.position}
            icon={createRiskMarkerIcon(marker.color || '#86A978', marker.isCritical, marker.isSelected)}
          >
            {(marker.label || marker.popupContent) && (
              <Popup>
                <div className="p-1.5 text-xs">
                  {marker.label && <strong className="text-[#E4E9DF] block mb-1">{marker.label}</strong>}
                  {marker.popupContent && <div className="text-[#B0B5A8]">{marker.popupContent}</div>}
                </div>
              </Popup>
            )}
          </Marker>
        ))}
      </MapContainer>

      {/* Loading Overlay Badge */}
      {loading && (
        <div className="absolute top-4 left-4 z-[1000] bg-[#080C08]/90 border border-[rgba(122,154,110,0.3)] px-3 py-1.5 rounded-full flex items-center gap-2 text-[11px] text-[#86A978] shadow-lg backdrop-blur-md pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-[#86A978] animate-ping"></span>
          <span>Loading MongoDB Risk Zones...</span>
        </div>
      )}

      {/* Connection Indicator / Live DB Zone Counter */}
      {dbZones.length > 0 && !loading && (
        <div className="absolute top-4 left-4 z-[1000] bg-[#080C08]/85 border border-[rgba(122,154,110,0.2)] px-3 py-1 rounded-full flex items-center gap-2 text-[11px] text-[#B0B5A8] shadow-md backdrop-blur-md pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
          <span>Live DB Telemetry: <strong className="text-[#E4E9DF] font-mono">{dbZones.length}</strong> Risk Zones</span>
        </div>
      )}
    </div>
  );
}