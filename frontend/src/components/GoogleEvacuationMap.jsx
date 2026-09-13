import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
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

// Real Google Maps tile layers
const GOOGLE_TILE_LAYERS = {
  'google-hybrid': {
    name: 'Google Satellite Hybrid',
    url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    maxZoom: 20,
    attribution: '&copy; Google Maps Satellite & Road Overlay',
  },
  'google-streets': {
    name: 'Google Streets',
    url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    maxZoom: 20,
    attribution: '&copy; Google Maps Roadmap',
  },
  'google-terrain': {
    name: 'Google Terrain',
    url: 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    maxZoom: 20,
    attribution: '&copy; Google Maps Topography & Terrain',
  },
  'carto-dark': {
    name: 'Carto Dark GIS',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    subdomains: ['a', 'b', 'c', 'd'],
    maxZoom: 19,
    attribution: '&copy; CARTO &copy; OpenStreetMap',
  },
};

// Custom Origin Pin (Google Maps navigation departure pin)
function createOriginMarkerIcon(name = 'Origin') {
  return L.divIcon({
    className: 'custom-origin-marker',
    html: `
      <div style="position: relative; width: 34px; height: 34px;">
        <div style="
          position: absolute; top: -8px; left: -8px;
          width: 50px; height: 50px;
          border-radius: 50%;
          background: rgba(239, 68, 68, 0.25);
          animation: evac-ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></div>
        <div style="
          width: 34px; height: 34px;
          border-radius: 50%;
          background: #EF4444;
          border: 3px solid #080C08;
          box-shadow: 0 0 16px rgba(239, 68, 68, 0.9), 0 4px 10px rgba(0,0,0,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          font-weight: bold;
          position: relative;
          z-index: 2;
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </div>
        <div style="
          position: absolute;
          top: 36px; left: 50%;
          transform: translateX(-50%);
          background: #0D120C;
          color: #EF4444;
          border: 1px solid rgba(239, 68, 68, 0.4);
          padding: 2px 6px;
          border-radius: 6px;
          font-size: 10px;
          font-family: monospace;
          white-space: nowrap;
          font-weight: bold;
          box-shadow: 0 4px 12px rgba(0,0,0,0.8);
        ">ORIGIN</div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -20],
  });
}

// Custom Destination Pin (Google Maps navigation safe refuge destination flag)
function createDestinationMarkerIcon(name = 'Safe Haven') {
  return L.divIcon({
    className: 'custom-destination-marker',
    html: `
      <div style="position: relative; width: 34px; height: 34px;">
        <div style="
          position: absolute; top: -8px; left: -8px;
          width: 50px; height: 50px;
          border-radius: 50%;
          background: rgba(16, 185, 129, 0.25);
          animation: evac-ping 2.2s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></div>
        <div style="
          width: 34px; height: 34px;
          border-radius: 50%;
          background: #10B981;
          border: 3px solid #080C08;
          box-shadow: 0 0 18px rgba(16, 185, 129, 0.9), 0 4px 10px rgba(0,0,0,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #080C08;
          font-weight: bold;
          position: relative;
          z-index: 2;
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
          </svg>
        </div>
        <div style="
          position: absolute;
          top: 36px; left: 50%;
          transform: translateX(-50%);
          background: #0D120C;
          color: #10B981;
          border: 1px solid rgba(16, 185, 129, 0.4);
          padding: 2px 6px;
          border-radius: 6px;
          font-size: 10px;
          font-family: monospace;
          white-space: nowrap;
          font-weight: bold;
          box-shadow: 0 4px 12px rgba(0,0,0,0.8);
        ">SAFE REFUGE</div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -20],
  });
}

// Custom Nearby Shelter Icon (shows other candidate safezones in vicinity)
function createNearbyShelterIcon(name = '', distanceKm = null) {
  return L.divIcon({
    className: 'custom-nearby-shelter-marker',
    html: `
      <div style="position: relative; width: 26px; height: 26px; cursor: pointer;">
        <div style="
          width: 26px; height: 26px;
          border-radius: 50%;
          background: #091209;
          border: 2px solid #86A978;
          box-shadow: 0 0 10px rgba(134, 169, 120, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #86A978;
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
          </svg>
        </div>
        ${distanceKm != null ? `
          <div style="
            position: absolute;
            top: 28px; left: 50%;
            transform: translateX(-50%);
            background: rgba(13, 18, 12, 0.92);
            color: #86A978;
            border: 1px solid rgba(122, 154, 110, 0.35);
            padding: 1px 5px;
            border-radius: 5px;
            font-size: 9px;
            font-family: monospace;
            white-space: nowrap;
            box-shadow: 0 2px 6px rgba(0,0,0,0.8);
          ">${distanceKm} km</div>
        ` : ''}
      </div>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -16],
  });
}


// Moving Convoy/Vehicle Beacon Icon that flows along the path
function createMovingConvoyIcon() {
  return L.divIcon({
    className: 'custom-convoy-beacon',
    html: `
      <div style="position: relative; width: 22px; height: 22px;">
        <div style="
          width: 22px; height: 22px;
          border-radius: 50%;
          background: #3B82F6;
          border: 2.5px solid #FFFFFF;
          box-shadow: 0 0 14px #3B82F6, 0 2px 8px rgba(0,0,0,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="width: 6px; height: 6px; border-radius: 50%; background: #FFFFFF;"></div>
        </div>
      </div>
    `,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}

// Auto-Fit Map bounds to encompass entire route from origin to destination
function FitRouteBounds({ positions = [] }) {
  const map = useMap();
  const prevBoundsRef = useRef(null);

  useEffect(() => {
    if (!positions || positions.length < 2) return;
    try {
      const bounds = L.latLngBounds(positions);
      const boundsKey = `${positions[0].join(',')}_${positions[positions.length - 1].join(',')}`;
      if (prevBoundsRef.current !== boundsKey) {
        prevBoundsRef.current = boundsKey;
        map.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 15,
          animate: true,
          duration: 1.2,
        });
      }
    } catch (_) {}
  }, [positions, map]);

  return null;
}

export default function GoogleEvacuationMap({
  originLocation = [11.685, 76.132],
  destLocation = [11.605, 76.225],
  startPointName = 'Origin Sector',
  destinationName = 'Designated Refuge Haven',
  routes = [],
  selectedRouteId = 'A',
  onSelectRoute = () => {},
  hazards = [],
  nearbyShelters = [],
  onSelectDestination = () => {},
  planId = null,
  className = '',
}) {
  const [selectedLayer, setSelectedLayer] = useState('google-hybrid');
  const [realRoadPath, setRealRoadPath] = useState(null);
  const [isRoutingLoading, setIsRoutingLoading] = useState(false);
  const [convoyIndex, setConvoyIndex] = useState(0);

  // Fetch real-world road geometry (turn-by-turn driving path) using OSRM
  useEffect(() => {
    if (!originLocation || !destLocation) return;
    const [startLat, startLng] = originLocation;
    const [endLat, endLng] = destLocation;

    let isMounted = true;
    setIsRoutingLoading(true);

    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;

    fetch(osrmUrl)
      .then((res) => {
        if (!res.ok) throw new Error('OSRM network response error');
        return res.json();
      })
      .then((data) => {
        if (isMounted && data.code === 'Ok' && data.routes?.[0]?.geometry?.coordinates) {
          // OSRM coordinates are [lng, lat] -> convert to [lat, lng]
          const roadPoints = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
          setRealRoadPath({
            points: roadPoints,
            distanceKm: Number((data.routes[0].distance / 1000).toFixed(1)),
            durationMin: Math.max(8, Math.round(data.routes[0].duration / 60)),
          });
        }
      })
      .catch((err) => {
        console.warn('[GoogleEvacuationMap] OSRM road geometry unavailable, using backend waypoints:', err.message);
        if (isMounted) setRealRoadPath(null);
      })
      .finally(() => {
        if (isMounted) setIsRoutingLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [originLocation, destLocation]);

  // Selected route data from backend
  const activeRoute = useMemo(() => {
    if (!routes || routes.length === 0) return null;
    return routes.find((r) => r.id === selectedRouteId) || routes[0];
  }, [routes, selectedRouteId]);

  // Primary active path positions (prioritize real-world road path, fallback to backend waypoints)
  const primaryPathPositions = useMemo(() => {
    if (selectedRouteId === 'A' && realRoadPath?.points?.length > 0) {
      return realRoadPath.points;
    }
    if (activeRoute?.waypoints?.length > 0) {
      return activeRoute.waypoints.map((w) => [w.latitude, w.longitude]);
    }
    return [originLocation, destLocation];
  }, [selectedRouteId, realRoadPath, activeRoute, originLocation, destLocation]);

  // Secondary alternative route positions (Route B)
  const secondaryPathPositions = useMemo(() => {
    const routeB = routes.find((r) => r.id === 'B');
    if (routeB?.waypoints?.length > 0) {
      return routeB.waypoints.map((w) => [w.latitude, w.longitude]);
    }
    // Curved default fallback if B not generated
    const midLat = (originLocation[0] + destLocation[0]) / 2 - 0.02;
    const midLng = (originLocation[1] + destLocation[1]) / 2 - 0.015;
    return [originLocation, [midLat, midLng], destLocation];
  }, [routes, originLocation, destLocation]);

  // Smooth Convoy Flow Animation along path
  useEffect(() => {
    if (!primaryPathPositions || primaryPathPositions.length < 2) return;
    const interval = setInterval(() => {
      setConvoyIndex((prev) => (prev + 1) % primaryPathPositions.length);
    }, 180);

    return () => clearInterval(interval);
  }, [primaryPathPositions]);

  const convoyPosition = useMemo(() => {
    if (!primaryPathPositions || primaryPathPositions.length === 0) return originLocation;
    return primaryPathPositions[convoyIndex] || primaryPathPositions[0];
  }, [primaryPathPositions, convoyIndex, originLocation]);

  const currentLayer = GOOGLE_TILE_LAYERS[selectedLayer] || GOOGLE_TILE_LAYERS['google-hybrid'];

  // Real distance & ETA displays
  const displayDistance = realRoadPath?.distanceKm || activeRoute?.distanceKm || 14.2;
  const displayEta = realRoadPath?.durationMin || activeRoute?.etaMinutes || 28;

  return (
    <div className={`relative w-full h-full min-h-[450px] bg-[#060906] overflow-hidden ${className}`}>
      {/* CSS Styles for Animated Google Maps Route Flow & Pings */}
      <style>{`
        @keyframes evac-ping {
          75%, 100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }
        @keyframes googlePathFlow {
          0% { stroke-dashoffset: 48; }
          100% { stroke-dashoffset: 0; }
        }
        .animated-google-route-flow {
          stroke-dasharray: 10, 14;
          animation: googlePathFlow 1.1s linear infinite;
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
        .custom-route-popup .leaflet-popup-content-wrapper {
          background: #0D120C !important;
          color: #E4E9DF !important;
          border: 1px solid rgba(122,154,110,0.35) !important;
          border-radius: 16px !important;
          box-shadow: 0 16px 40px rgba(0,0,0,0.85) !important;
          padding: 2px !important;
        }
        .custom-route-popup .leaflet-popup-tip {
          background: #0D120C !important;
          border: 1px solid rgba(122,154,110,0.35) !important;
        }
        .custom-route-popup .leaflet-popup-close-button {
          color: #777C70 !important;
          padding: 8px !important;
        }
        .custom-route-popup .leaflet-popup-close-button:hover {
          color: #E4E9DF !important;
        }
      `}</style>

      {/* Main Map Canvas */}
      <MapContainer
        center={originLocation}
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

        {/* Auto fit bounds to encompass entire route */}
        <FitRouteBounds positions={[originLocation, destLocation, ...primaryPathPositions]} />

        {/* 1. Hazard Perimeters along Transit Corridor */}
        {hazards.map((hazard, idx) => {
          const coords = hazard.coordinates
            ? [hazard.coordinates[1], hazard.coordinates[0]]
            : null;
          if (!coords || isNaN(coords[0])) return null;

          return (
            <Circle
              key={`hazard-${hazard.name || idx}`}
              center={coords}
              radius={hazard.radiusMeters || 1400}
              pathOptions={{
                color: '#EF4444',
                fillColor: '#EF4444',
                fillOpacity: 0.18,
                weight: 1.6,
                dashArray: '5 4',
              }}
            >
              <Popup className="custom-route-popup">
                <div className="p-2 min-w-[180px] font-sans">
                  <span className="text-[10px] font-bold text-[#EF4444] uppercase tracking-wider">
                    Hazard Blockade
                  </span>
                  <div className="text-xs font-semibold text-[#FFFFFF] mt-1">{hazard.name}</div>
                  <div className="text-[11px] text-[#A0A59A] mt-0.5">Active risk channel avoided by Route A.</div>
                </div>
              </Popup>
            </Circle>
          );
        })}

        {/* 2. Secondary Compromised Route B (Dashed Red/Amber) */}
        {secondaryPathPositions.length > 1 && (
          <>
            <Polyline
              positions={secondaryPathPositions}
              pathOptions={{
                color: '#080C08',
                weight: 5,
                opacity: 0.7,
              }}
            />
            <Polyline
              positions={secondaryPathPositions}
              pathOptions={{
                color: selectedRouteId === 'B' ? '#EF4444' : '#DC2626',
                weight: selectedRouteId === 'B' ? 4.5 : 2.5,
                opacity: selectedRouteId === 'B' ? 0.9 : 0.45,
                dashArray: '8 8',
              }}
              eventHandlers={{
                click: () => onSelectRoute('B'),
              }}
            >
              <Popup className="custom-route-popup">
                <div className="p-2 font-sans text-xs">
                  <span className="text-[10px] font-bold text-[#DC2626] uppercase">Route B — Valley Vector</span>
                  <div className="text-[11px] text-[#EF4444] font-medium mt-1">Status: COMPROMISED / HAZARD CROSSING</div>
                  <div className="text-[10px] text-[#777C70] mt-0.5">High slope instability risk detected.</div>
                </div>
              </Popup>
            </Polyline>
          </>
        )}

        {/* 3. Primary Safe Transit Route (Google Maps Navigation Style) */}
        {/* Outer Dark Casing Border */}
        <Polyline
          positions={primaryPathPositions}
          pathOptions={{
            color: '#080C08',
            weight: 9,
            opacity: 0.95,
            lineCap: 'round',
            lineJoin: 'round',
          }}
        />

        {/* Inner Solid Road Glow */}
        <Polyline
          positions={primaryPathPositions}
          pathOptions={{
            color: selectedRouteId === 'A' ? '#10B981' : '#3B82F6',
            weight: 5.5,
            opacity: 0.95,
            lineCap: 'round',
            lineJoin: 'round',
          }}
          eventHandlers={{
            click: () => onSelectRoute('A'),
          }}
        />

        {/* Animated Moving Dash Flow (Google Maps Traffic / Transit Flow) */}
        <Polyline
          positions={primaryPathPositions}
          className="animated-google-route-flow"
          pathOptions={{
            color: '#FFFFFF',
            weight: 3.5,
            opacity: 0.85,
            lineCap: 'round',
          }}
        />

        {/* 4. Animated Moving Convoy Marker along Route */}
        {convoyPosition && (
          <Marker position={convoyPosition} icon={createMovingConvoyIcon()} zIndexOffset={900}>
            <Popup className="custom-route-popup">
              <div className="p-2 font-sans text-xs">
                <div className="text-[10px] font-bold text-[#3B82F6] uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse"></span>
                  Convoy Telemetry Active
                </div>
                <div className="text-[11px] text-[#E4E9DF] mt-1">Active transit moving towards {destinationName}.</div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* 5. Origin Departure Marker */}
        <Marker position={originLocation} icon={createOriginMarkerIcon(startPointName)} zIndexOffset={1000}>
          <Popup className="custom-route-popup">
            <div className="p-2.5 font-sans min-w-[200px]">
              <span className="text-[10px] font-bold text-[#EF4444] uppercase tracking-wider">
                Evacuation Origin Sector
              </span>
              <div className="text-sm font-semibold text-[#FFFFFF] mt-1">{startPointName}</div>
              <div className="text-[11px] text-[#A0A59A] mt-0.5 font-mono">
                {originLocation[0].toFixed(4)}°N, {originLocation[1].toFixed(4)}°E
              </div>
              <div className="mt-2 pt-1.5 border-t border-[rgba(228,233,223,0.1)] text-[10px] text-[#86A978]">
                Departure Point for Evacuation Corridor
              </div>
            </div>
          </Popup>
        </Marker>

        {/* 6. Destination Safe Haven Marker */}
        <Marker position={destLocation} icon={createDestinationMarkerIcon(destinationName)} zIndexOffset={1000}>
          <Popup className="custom-route-popup">
            <div className="p-2.5 font-sans min-w-[200px]">
              <span className="text-[10px] font-bold text-[#10B981] uppercase tracking-wider">
                Safe Haven Refuge Center
              </span>
              <div className="text-sm font-semibold text-[#FFFFFF] mt-1">{destinationName}</div>
              <div className="text-[11px] text-[#A0A59A] mt-0.5 font-mono">
                {destLocation[0].toFixed(4)}°N, {destLocation[1].toFixed(4)}°E
              </div>
              <div className="mt-2 pt-1.5 border-t border-[rgba(228,233,223,0.1)] text-[10px] text-[#10B981]">
                High-Elevation Safe Zone • Reinforced Medical & Bed Reserve
              </div>
            </div>
          </Popup>
        </Marker>

        {/* 7. Nearby Alternative Safe Refuge Centers in Vicinity */}
        {nearbyShelters.map((shelter) => {
          if (shelter.name === destinationName) return null;
          const coords = shelter.coordinates ? [shelter.coordinates[1], shelter.coordinates[0]] : null;
          if (!coords || isNaN(coords[0])) return null;

          return (
            <Marker
              key={`nearby-shelter-${shelter._id || shelter.name}`}
              position={coords}
              icon={createNearbyShelterIcon(shelter.name, shelter.distanceKm)}
              zIndexOffset={500}
              eventHandlers={{
                click: () => onSelectDestination && onSelectDestination(shelter.name),
              }}
            >
              <Popup className="custom-route-popup">
                <div className="p-2 font-sans min-w-[190px]">
                  <div className="flex items-center justify-between text-[10px] text-[#10B981] font-bold uppercase mb-1">
                    <span>Alternative Safe Haven</span>
                    {shelter.distanceKm != null && (
                      <span className="font-mono text-[#86A978]">{shelter.distanceKm} km</span>
                    )}
                  </div>
                  <div className="text-xs font-semibold text-[#FFFFFF]">{shelter.name}</div>
                  <div className="text-[11px] text-[#A0A59A] mt-1">
                    Capacity: <strong className="text-[#E4E9DF]">{(shelter.capacity || 2500).toLocaleString()}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectDestination && onSelectDestination(shelter.name)}
                    className="mt-2 w-full py-1.5 bg-[#1D2A1B] hover:bg-[#86A978] hover:text-[#080C08] text-[#86A978] border border-[#86A978]/40 rounded-[8px] text-[10px] font-medium uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[13px]">navigation</span>
                    <span>Route To This Refuge</span>
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Floating Top-Right Google Map Mode Selector */}
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
      </div>

      {/* Floating Google Maps Turn-by-Turn Navigation HUD Card */}
      <div className="absolute top-4 left-4 z-[1000] bg-[#080C08]/95 border border-[rgba(122,154,110,0.35)] rounded-[18px] p-3.5 backdrop-blur-md font-sans shadow-2xl max-w-xs pointer-events-auto">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider text-[#86A978]">
            <span className="material-symbols-outlined text-[15px] text-[#10B981]">navigation</span>
            <span>Google Path Flow</span>
          </div>
          {isRoutingLoading ? (
            <span className="text-[10px] text-[#777C70] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#86A978] animate-ping"></span>
              Calculating...
            </span>
          ) : (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 font-semibold">
              LIVE FLOW
            </span>
          )}
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-xl font-bold text-[#FFFFFF] tracking-tight">{displayDistance} km</span>
          <span className="text-xs text-[#86A978] font-medium">• {displayEta} min transit</span>
        </div>

        <div className="text-[11px] text-[#B0B5A8] flex items-center gap-1.5 mb-2.5">
          <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
          <span className="truncate">Clear Contour High-Ground Highway</span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[rgba(228,233,223,0.08)] text-[10px]">
          <div>
            <div className="text-[#777C70]">From:</div>
            <div className="text-[#E4E9DF] font-medium truncate">{startPointName}</div>
          </div>
          <div>
            <div className="text-[#777C70]">To Refuge:</div>
            <div className="text-[#10B981] font-medium truncate">{destinationName}</div>
          </div>
        </div>

        {planId && (
          <div className="mt-2 pt-1.5 border-t border-[rgba(228,233,223,0.06)] text-[9px] font-mono text-[#777C70] flex justify-between">
            <span>Matrix ID: {planId}</span>
            <span className="text-[#86A978]">94% Clearance</span>
          </div>
        )}
      </div>

      {/* Floating Bottom-Left Navigation Legend */}
      <div className="absolute bottom-6 left-6 bg-[#080C08]/92 border border-[rgba(228,233,223,0.14)] p-3.5 rounded-[16px] z-[1000] font-sans text-xs backdrop-blur-md shadow-2xl pointer-events-auto">
        <div className="text-[10px] uppercase tracking-[0.16em] text-[#7A9A6E] mb-2 font-medium flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7A9A6E] animate-pulse"></span>
          Evacuation Routing Legend
        </div>
        <div className="flex flex-col gap-1.5 text-[11px]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-1 bg-[#10B981] rounded-full shadow-[0_0_6px_#10B981]"></div>
            <span className="text-[#E4E9DF]">Route A — Active Flow Corridor</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-1 border-t-2 border-dashed border-[#EF4444]"></div>
            <span className="text-[#B0B5A8]">Route B — Blocked Hazard Sector</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-[#EF4444] rounded-full animate-pulse"></div>
            <span className="text-[#B0B5A8]">Origin Danger Sector</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-[#10B981] rounded-full"></div>
            <span className="text-[#B0B5A8]">Safe Refuge Haven</span>
          </div>
        </div>
      </div>
    </div>
  );
}
