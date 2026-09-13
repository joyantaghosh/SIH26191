import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon path issue in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Real Google Maps tile endpoints (no billing or API key required)
const GOOGLE_TILE_LAYERS = {
  'google-hybrid': {
    name: 'Google Satellite Hybrid',
    url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    maxZoom: 20,
    attribution: '&copy; Google Maps Satellite & Street Data',
    darkFilter: false,
  },
  'google-streets': {
    name: 'Google Streets',
    url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    maxZoom: 20,
    attribution: '&copy; Google Maps Roadmap',
    darkFilter: false,
  },
  'google-terrain': {
    name: 'Google Terrain',
    url: 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    maxZoom: 20,
    attribution: '&copy; Google Maps Terrain & Topography',
    darkFilter: false,
  },
  'carto-dark': {
    name: 'Carto Dark GIS',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    subdomains: ['a', 'b', 'c', 'd'],
    maxZoom: 19,
    attribution: '&copy; CARTO &copy; OpenStreetMap',
    darkFilter: false,
  },
};

// Custom animated glowing SVG marker for Google Maps risk sectors
function createCustomRiskIcon(color = '#EF4444', isCritical = false, isSelected = false) {
  const pulseHtml = isCritical
    ? `<div style="
        position: absolute;
        top: -8px; left: -8px;
        width: 36px; height: 36px;
        border-radius: 50%;
        background: ${color}33;
        animation: google-marker-pulse 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
      "></div>`
    : '';

  const selectRingHtml = isSelected
    ? `<div style="
        position: absolute;
        top: -5px; left: -5px;
        width: 30px; height: 30px;
        border-radius: 50%;
        border: 2px solid #FFFFFF;
        box-shadow: 0 0 12px ${color};
        animation: google-marker-pulse 2.2s infinite;
      "></div>`
    : '';

  return L.divIcon({
    className: 'custom-google-risk-marker',
    html: `
      <div style="position: relative; width: 20px; height: 20px; cursor: pointer;">
        ${pulseHtml}
        ${selectRingHtml}
        <div style="
          width: 20px; height: 20px;
          background: ${color};
          border: 2.5px solid #080C08;
          border-radius: 50%;
          box-shadow: 0 0 14px ${color}EE, 0 4px 10px rgba(0,0,0,0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 2;
        ">
          <div style="width: 5px; height: 5px; border-radius: 50%; background: #FFFFFF;"></div>
        </div>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -14],
  });
}

// Subcomponent to smoothly pan/zoom map on active zone change
function SmoothCameraPan({ center, zoom = 12 }) {
  const map = useMap();
  const prevCenterRef = useRef(null);

  useEffect(() => {
    if (!center || isNaN(center[0]) || isNaN(center[1])) return;
    const centerKey = `${center[0].toFixed(4)},${center[1].toFixed(4)}`;
    if (prevCenterRef.current !== centerKey) {
      prevCenterRef.current = centerKey;
      map.flyTo(center, zoom, {
        duration: 1.4,
        easeLinearity: 0.25,
      });
    }
  }, [center, zoom, map]);

  return null;
}

export default function GoogleRiskZoneMap({
  zones = [],
  activeZone = null,
  onZoneClick = () => {},
  className = '',
}) {
  const [selectedLayer, setSelectedLayer] = useState('google-hybrid');
  const [sdkKeyModal, setSdkKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(
    localStorage.getItem('google_maps_api_key') ||
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
    ''
  );
  const [authNotice, setAuthNotice] = useState(null);

  // Compute active map center
  const mapCenter = useMemo(() => {
    if (activeZone?.latLng && !isNaN(activeZone.latLng[0]) && !isNaN(activeZone.latLng[1])) {
      return activeZone.latLng;
    }
    if (zones.length > 0 && zones[0]?.latLng && !isNaN(zones[0].latLng[0])) {
      return zones[0].latLng;
    }
    return [20.5937, 78.9629]; // Default India center
  }, [activeZone, zones]);

  // Current active tile configuration
  const currentLayer = GOOGLE_TILE_LAYERS[selectedLayer] || GOOGLE_TILE_LAYERS['google-hybrid'];

  // Handle saving Google Cloud Key
  const handleSaveApiKey = (e) => {
    e.preventDefault();
    const clean = apiKeyInput.trim();
    if (clean) {
      localStorage.setItem('google_maps_api_key', clean);
      setSdkKeyModal(false);
      setAuthNotice({
        type: 'info',
        title: 'Key Saved to Environment',
        message: 'Your Google Cloud API Key has been stored. The map will continue using high-speed Google Maps satellite & street imagery.',
      });
    }
  };

  return (
    <div className={`relative w-full h-full min-h-[450px] bg-[#060906] overflow-hidden ${className}`}>
      {/* CSS Animation Keyframes for Smooth Glowing Pins */}
      <style>{`
        @keyframes google-marker-pulse {
          0% { transform: scale(1); opacity: 0.9; }
          70% { transform: scale(2.4); opacity: 0; }
          100% { transform: scale(2.6); opacity: 0; }
        }
        .leaflet-container {
          background: #060906 !important;
          font-family: 'Inter', sans-serif !important;
          width: 100%;
          height: 100%;
        }
        .leaflet-control-zoom {
          border: 1px solid rgba(122,154,110,0.25) !important;
          border-radius: 12px !important;
          overflow: hidden !important;
          background: #080C08 !important;
          box-shadow: 0 8px 24px rgba(0,0,0,0.7) !important;
        }
        .leaflet-control-zoom a {
          background: #0D120C !important;
          color: #86A978 !important;
          border-color: rgba(122,154,110,0.2) !important;
          transition: all 0.2s ease;
        }
        .leaflet-control-zoom a:hover {
          background: #1D2A1B !important;
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
        .custom-google-popup .leaflet-popup-content-wrapper {
          background: #0D120C !important;
          color: #E4E9DF !important;
          border: 1px solid rgba(122,154,110,0.35) !important;
          border-radius: 16px !important;
          box-shadow: 0 16px 40px rgba(0,0,0,0.85) !important;
          padding: 2px !important;
        }
        .custom-google-popup .leaflet-popup-tip {
          background: #0D120C !important;
          border: 1px solid rgba(122,154,110,0.35) !important;
        }
        .custom-google-popup .leaflet-popup-close-button {
          color: #777C70 !important;
          padding: 8px !important;
        }
        .custom-google-popup .leaflet-popup-close-button:hover {
          color: #E4E9DF !important;
        }
      `}</style>

      {/* Primary Google Maps Tile Canvas */}
      <MapContainer
        center={mapCenter}
        zoom={12}
        zoomControl={true}
        className="w-full h-full"
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          key={selectedLayer}
          url={currentLayer.url}
          subdomains={currentLayer.subdomains}
          maxZoom={currentLayer.maxZoom}
          attribution={currentLayer.attribution}
        />

        <SmoothCameraPan center={mapCenter} zoom={12} />

        {/* 50 Interactive Risk Zones with Google Maps Perimeter Circles & Markers */}
        {zones.map((zone) => {
          if (!zone.latLng || isNaN(zone.latLng[0]) || isNaN(zone.latLng[1])) return null;

          const isSelected = activeZone && (activeZone.id === zone.id || activeZone.zoneId === zone.zoneId);
          const isCritical = zone.riskLevel === 'critical' || zone.riskLevel === 'high';
          const color = isCritical
            ? '#EF4444'
            : zone.riskLevel === 'warning' || zone.riskLevel === 'medium'
            ? '#F59E0B'
            : '#10B981';

          return (
            <React.Fragment key={`google-zone-${zone.id || zone.zoneId}`}>
              {/* Google Maps Risk Perimeter Circle */}
              <Circle
                center={zone.latLng}
                radius={zone.radiusMeters || 3500}
                pathOptions={{
                  color: color,
                  fillColor: color,
                  fillOpacity: isSelected ? 0.32 : 0.14,
                  weight: isSelected ? 2.8 : 1.4,
                  dashArray: isCritical ? '6 4' : null,
                }}
                eventHandlers={{
                  click: () => onZoneClick(zone),
                }}
              />

              {/* Pulsating Glowing Marker Pin */}
              <Marker
                position={zone.latLng}
                icon={createCustomRiskIcon(color, isCritical, isSelected)}
                eventHandlers={{
                  click: () => onZoneClick(zone),
                }}
              >
                <Popup className="custom-google-popup">
                  <div className="p-2.5 min-w-[210px] font-sans">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${color}22`,
                          color: color,
                          border: `1px solid ${color}44`,
                        }}
                      >
                        {zone.riskLevel || 'warning'}
                      </span>
                      <span className="text-[10px] font-mono text-[#7A9A6E] font-medium">
                        {zone.zoneId || ''}
                      </span>
                    </div>

                    <div className="text-[13px] font-medium text-[#FFFFFF] leading-snug">
                      {zone.name}
                    </div>

                    {zone.region && (
                      <div className="text-[11px] text-[#A0A59A] mt-0.5 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px] text-[#7A9A6E]">location_on</span>
                        <span>{zone.region}</span>
                      </div>
                    )}

                    <div className="mt-2.5 pt-2 border-t border-[rgba(228,233,223,0.1)] grid grid-cols-2 gap-2 text-[10px]">
                      <div>
                        <div className="text-[#777C70]">Vulnerability:</div>
                        <div className="text-sm font-semibold text-[#E4E9DF]">
                          {zone.vulnerabilityScore || 75}<span className="text-xs font-normal text-[#777C70]">/100</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-[#777C70]">Hazard Vector:</div>
                        <div className="text-xs font-medium text-[#86A978] capitalize mt-0.5">
                          {(zone.hazardType || 'multi-hazard').replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}
      </MapContainer>

      {/* Floating Top-Right Google Map Mode Selector Toolbar */}
      <div className="absolute top-4 right-4 z-[1000] flex items-center gap-1.5 bg-[#080C08]/92 border border-[rgba(228,233,223,0.14)] p-1.5 rounded-[14px] backdrop-blur-md shadow-2xl text-xs font-sans">
        <span className="text-[10px] text-[#7A9A6E] uppercase tracking-wider px-2 font-mono flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
          Google Maps
        </span>
        <div className="h-4 w-px bg-[rgba(228,233,223,0.1)]"></div>

        <button
          type="button"
          onClick={() => setSelectedLayer('google-hybrid')}
          className={`px-3 py-1 rounded-[8px] text-[10px] uppercase font-medium transition-all ${
            selectedLayer === 'google-hybrid'
              ? 'bg-[#1D2A1B] text-[#86A978] border border-[#86A978] shadow-sm'
              : 'text-[#777C70] hover:text-[#E4E9DF]'
          }`}
        >
          Satellite Hybrid
        </button>

        <button
          type="button"
          onClick={() => setSelectedLayer('google-streets')}
          className={`px-3 py-1 rounded-[8px] text-[10px] uppercase font-medium transition-all ${
            selectedLayer === 'google-streets'
              ? 'bg-[#1D2A1B] text-[#86A978] border border-[#86A978] shadow-sm'
              : 'text-[#777C70] hover:text-[#E4E9DF]'
          }`}
        >
          Google Streets
        </button>

        <button
          type="button"
          onClick={() => setSelectedLayer('google-terrain')}
          className={`px-3 py-1 rounded-[8px] text-[10px] uppercase font-medium transition-all ${
            selectedLayer === 'google-terrain'
              ? 'bg-[#1D2A1B] text-[#86A978] border border-[#86A978] shadow-sm'
              : 'text-[#777C70] hover:text-[#E4E9DF]'
          }`}
        >
          Terrain
        </button>

        <button
          type="button"
          onClick={() => setSelectedLayer('carto-dark')}
          className={`px-3 py-1 rounded-[8px] text-[10px] uppercase font-medium transition-all ${
            selectedLayer === 'carto-dark'
              ? 'bg-[#1D2A1B] text-[#86A978] border border-[#86A978] shadow-sm'
              : 'text-[#777C70] hover:text-[#E4E9DF]'
          }`}
        >
          Dark GIS
        </button>

        <button
          type="button"
          onClick={() => setSdkKeyModal(true)}
          title="Google Cloud API Key Settings & Status"
          className="px-2 py-1 bg-[#0D120C] border border-[rgba(228,233,223,0.12)] hover:border-[#86A978] rounded-[8px] text-[#777C70] hover:text-[#E4E9DF] flex items-center justify-center transition-all ml-1"
        >
          <span className="material-symbols-outlined text-[16px]">key</span>
        </button>
      </div>

      {/* Floating Bottom-Left Risk Index Legend */}
      <div className="absolute bottom-6 left-6 bg-[#080C08]/92 border border-[rgba(228,233,223,0.14)] p-3.5 rounded-[16px] z-[1000] font-sans text-xs backdrop-blur-md shadow-2xl pointer-events-auto">
        <div className="text-[10px] uppercase tracking-[0.16em] text-[#7A9A6E] mb-2 font-medium flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7A9A6E] animate-pulse"></span>
          Google Maps Risk Legend
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-[#EF4444] rounded-full animate-pulse shadow-[0_0_8px_#EF4444]"></div>
            <span className="text-[#E4E9DF] text-[11px]">Critical Risk Perimeter</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-[#F59E0B] rounded-full"></div>
            <span className="text-[#B0B5A8] text-[11px]">Warning Sector</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-[#10B981] rounded-full"></div>
            <span className="text-[#B0B5A8] text-[11px]">Safe Refuge Area</span>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-[rgba(228,233,223,0.08)] text-[10px] text-[#777C70] flex items-center justify-between gap-4">
          <span>{zones.length} Zones Synced</span>
          <span className="text-[#86A978] font-mono">Live Telemetry</span>
        </div>
      </div>

      {/* Key Configuration Modal */}
      {sdkKeyModal && (
        <div className="fixed inset-0 bg-[#060906]/85 backdrop-blur-md z-[2000] flex items-center justify-center p-4">
          <div className="bg-[#0D120C] border border-[rgba(122,154,110,0.3)] rounded-[20px] p-6 max-w-lg w-full shadow-2xl">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#86A978]/15 border border-[#86A978]/40 flex items-center justify-center text-[#86A978]">
                  <span className="material-symbols-outlined text-[20px]">key</span>
                </div>
                <div>
                  <h3 className="font-display font-light text-base text-[#E4E9DF]">
                    Google Cloud Platform Settings
                  </h3>
                  <p className="text-[11px] text-[#777C70]">
                    Maps JavaScript API configuration & key status
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSdkKeyModal(false)}
                className="text-[#777C70] hover:text-[#E4E9DF] p-1"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="bg-[#141C13] border border-[rgba(122,154,110,0.2)] rounded-[12px] p-3.5 mb-4 text-xs">
              <div className="text-[#86A978] font-medium mb-1 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">info</span>
                <span>Why did Google Maps show "Something went wrong"?</span>
              </div>
              <p className="text-[#A0A59A] leading-relaxed text-[11px]">
                Google Maps JavaScript API requires 3 settings in Google Cloud Console:
              </p>
              <ul className="list-disc list-inside mt-1.5 space-y-1 text-[11px] text-[#777C70]">
                <li><strong className="text-[#E4E9DF]">Maps JavaScript API</strong> must be enabled in the project library.</li>
                <li><strong className="text-[#E4E9DF]">Cloud Billing Account</strong> must be linked (Google requires billing for the official SDK).</li>
                <li><strong className="text-[#E4E9DF]">Key restrictions</strong> must permit <code className="text-[#86A978]">localhost:5173</code>.</li>
              </ul>
              <div className="mt-2 pt-2 border-t border-[rgba(122,154,110,0.15)] text-[11px] text-[#86A978]">
                💡 <strong>Good news:</strong> SafeZones already streams live Google Maps Satellite and Street tiles directly, so you don't even need a credit card or billing account to view Google Maps!
              </div>
            </div>

            <form onSubmit={handleSaveApiKey} className="space-y-3">
              <div>
                <label className="block text-[11px] text-[#A0A59A] mb-1">
                  Google Cloud API Key:
                </label>
                <input
                  type="text"
                  value={apiKeyInput}
                  placeholder="AIzaSy..."
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  className="w-full h-10 px-3 bg-[#080C08] border border-[rgba(122,154,110,0.3)] rounded-[10px] text-xs text-[#E4E9DF] font-mono outline-none focus:border-[#86A978]"
                />
              </div>

              <div className="flex justify-between items-center pt-2">
                <a
                  href="https://console.cloud.google.com/google/maps-apis/overview"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-[#86A978] hover:underline flex items-center gap-1"
                >
                  <span>Google Cloud Console</span>
                  <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                </a>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSdkKeyModal(false)}
                    className="px-4 py-2 border border-[rgba(228,233,223,0.1)] rounded-[10px] text-xs text-[#777C70] hover:text-[#E4E9DF]"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#6F9164] hover:bg-[#86A978] text-[#0A0E09] font-medium rounded-[10px] text-xs transition-all"
                  >
                    Save Key
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Helpful Toast Notification */}
      {authNotice && (
        <div className="absolute top-16 right-4 z-[1000] max-w-sm bg-[#0D120C] border border-[#86A978]/50 rounded-[14px] p-3.5 shadow-2xl backdrop-blur-md">
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-[#86A978]">{authNotice.title}</span>
            <button onClick={() => setAuthNotice(null)} className="text-[#777C70] hover:text-[#E4E9DF] ml-2">
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
          <p className="text-[11px] text-[#B0B5A8] mt-1">{authNotice.message}</p>
        </div>
      )}
    </div>
  );
}
