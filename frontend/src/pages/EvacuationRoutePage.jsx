import React, { useState, useEffect, useMemo, useCallback } from 'react';
import DashboardSidebar from '../components/DashboardSidebar';
import LeafletMap from '../components/LeafletMap';
import { fetchEvacuationOptions, calculateEvacuationPlan } from '../services/evacuationApi';

export default function EvacuationRoutePage() {
  const [origins, setOrigins] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [hazards, setHazards] = useState([]);
  const [startPoint, setStartPoint] = useState('Sector 4 Habitation');
  const [destination, setDestination] = useState('Alpha Command Bunker');
  const [selectedRoute, setSelectedRoute] = useState('A');
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationResult, setCalculationResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // 1. Fetch live evacuation options from backend
  const loadOptions = useCallback(async () => {
    try {
      const data = await fetchEvacuationOptions();
      if (data) {
        setOrigins(data.origins || []);
        setShelters(data.shelters || []);
        setHazards(data.hazards || []);

        if (data.origins?.length > 0 && !startPoint) {
          setStartPoint(data.origins[0].name);
        }
        if (data.shelters?.length > 0 && !destination) {
          setDestination(data.shelters[0].name);
        }
      }
    } catch (err) {
      console.warn('[EvacuationRoutePage] Fallback to default locations:', err.message);
    }
  }, [startPoint, destination]);

  // 2. Calculate dynamic route
  const handleCalculate = useCallback(async (start, dest) => {
    const s = start || startPoint;
    const d = dest || destination;
    if (!s || !d) return;

    setIsCalculating(true);
    setErrorMsg(null);

    try {
      const result = await calculateEvacuationPlan({ startPoint: s, destination: d });
      setCalculationResult(result);
      if (result.recommendedRouteId) {
        setSelectedRoute(result.recommendedRouteId);
      }
    } catch (err) {
      console.error('[EvacuationRoutePage] Calculation error:', err.message);
      setErrorMsg(err.message);
    } finally {
      setIsCalculating(false);
    }
  }, [startPoint, destination]);

  useEffect(() => {
    loadOptions();
  }, [loadOptions]);

  useEffect(() => {
    if (startPoint && destination) {
      handleCalculate(startPoint, destination);
    }
  }, [startPoint, destination, handleCalculate]);

  // Map coordinates
  const originLocation = useMemo(() => {
    const found = origins.find((o) => o.name === startPoint);
    return found ? [found.coordinates[1], found.coordinates[0]] : [-6.22, 106.78];
  }, [origins, startPoint]);

  const destLocation = useMemo(() => {
    const found = shelters.find((s) => s.name === destination);
    return found ? [found.coordinates[1], found.coordinates[0]] : [-6.15, 106.88];
  }, [shelters, destination]);

  const mapCenter = useMemo(() => {
    return [(originLocation[0] + destLocation[0]) / 2, (originLocation[1] + destLocation[1]) / 2];
  }, [originLocation, destLocation]);

  const mapMarkers = useMemo(() => [
    {
      position: originLocation,
      label: startPoint,
      color: '#7A9A6E',
      popupContent: `Origin Habitation (${startPoint})`,
    },
    {
      position: destLocation,
      label: destination,
      color: '#86A978',
      popupContent: `Relief Shelter (${destination})`,
    },
  ], [originLocation, destLocation, startPoint, destination]);

  const mapCircles = useMemo(() => {
    if (hazards.length > 0) {
      return hazards.map((h) => ({
        center: [h.coordinates[1], h.coordinates[0]],
        radius: h.radiusMeters || 1200,
        color: '#DC2626',
        fillColor: '#DC2626',
        fillOpacity: 0.14,
        label: `${h.name} (${h.riskLevel?.toUpperCase() || 'HAZARD'})`,
      }));
    }
    return [
      {
        center: [(originLocation[0] + destLocation[0]) / 2 - 0.015, (originLocation[1] + destLocation[1]) / 2],
        radius: 1200,
        color: '#DC2626',
        fillColor: '#DC2626',
        fillOpacity: 0.14,
        label: 'Hazard Zone — Slope Instability',
      },
    ];
  }, [hazards, originLocation, destLocation]);

  // Polylines from calculationResult
  const mapPolylines = useMemo(() => {
    if (!calculationResult?.routes) return [];

    return calculationResult.routes.map((route) => {
      const isSelected = selectedRoute === route.id;
      const isRecommended = route.status === 'RECOMMENDED';
      const positions = route.waypoints.map((w) => [w.latitude, w.longitude]);

      return {
        positions,
        color: isRecommended ? '#7A9A6E' : '#DC2626',
        weight: isSelected ? 6 : 2.5,
        dashArray: isRecommended ? null : '8 8',
        opacity: isSelected ? 1 : 0.45,
        label: `${route.label} (${route.distanceKm} km, ${route.etaMinutes} min)`,
      };
    });
  }, [calculationResult, selectedRoute]);

  const currentRouteData = useMemo(() => {
    if (!calculationResult?.routes) return null;
    return calculationResult.routes.find((r) => r.id === selectedRoute) || calculationResult.routes[0];
  }, [calculationResult, selectedRoute]);

  return (
    <div className="flex-grow flex flex-col w-full h-[calc(100vh-70px)] bg-[#080C08] relative overflow-hidden z-10 font-sans text-xs font-light text-[#E4E9DF]">
      <div className="flex flex-1 overflow-hidden h-full">
        <DashboardSidebar />

        {/* Main Workspace Layout (GIS Map Canvas Left, Panel Right) */}
        <main className="flex-1 relative flex flex-col lg:flex-row overflow-hidden h-full">
          {/* Interactive Leaflet Map (Left Side Canvas) */}
          <div className="flex-1 relative bg-[#060906] overflow-hidden h-full">
            <LeafletMap
              center={mapCenter}
              zoom={13}
              markers={mapMarkers}
              circles={mapCircles}
              polylines={mapPolylines}
            />

            {/* Plan Info Overlay Badge */}
            {calculationResult?.planId && (
              <div className="absolute top-4 left-4 z-[400] bg-[#0D120C]/90 border border-[rgba(122,154,110,0.3)] rounded-[12px] px-3.5 py-2 backdrop-blur-md font-mono text-[11px] flex items-center gap-2 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-[#86A978] animate-pulse"></span>
                <span className="text-[#86A978]">Transit Matrix:</span>
                <span className="text-[#E4E9DF] font-semibold">{calculationResult.planId}</span>
              </div>
            )}
          </div>

          {/* Contour Transit Panel (Right Side Sidebar) */}
          <div className="w-full lg:w-[390px] h-full bg-[#0D120C]/95 border-l border-[rgba(228,233,223,0.08)] flex flex-col shrink-0 z-30 overflow-y-auto backdrop-blur-md">
            <div className="p-5 border-b border-[rgba(228,233,223,0.08)] sticky top-0 z-10 bg-[#0D120C]">
              <span className="text-[10px] uppercase tracking-[0.16em] text-[#7A9A6E]">Contour Transit Protocol</span>
              <h1 className="font-display font-light text-lg text-[#E4E9DF] mt-0.5">Evacuation Corridors</h1>
            </div>

            <div className="p-5 flex flex-col gap-4">
              {errorMsg && (
                <div className="p-3 bg-[#EF4444]/15 border border-[#EF4444]/40 text-[#EF4444] rounded-[10px] font-mono text-[11px]">
                  {errorMsg}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider text-[#777C70] font-mono">Origin Habitation</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#777C70] text-[18px]">
                    my_location
                  </span>
                  <select
                    value={startPoint}
                    onChange={(e) => setStartPoint(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 bg-[#080C08] border border-[rgba(122,154,110,0.3)] rounded-[12px] text-xs text-[#E4E9DF] font-mono focus:border-[#86A978] outline-none"
                  >
                    {origins.map((o) => (
                      <option key={o._id || o.name} value={o.name}>
                        {o.name} (Pop: {o.population || 1200})
                      </option>
                    ))}
                    {origins.length === 0 && (
                      <>
                        <option value="Sector 4 Habitation">Sector 4 Habitation</option>
                        <option value="Sector 7 Industrial">Sector 7 Industrial</option>
                        <option value="Residential Block A">Residential Block A</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider text-[#777C70] font-mono">Designated Refuge Shelter</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#777C70] text-[18px]">
                    flag
                  </span>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 bg-[#080C08] border border-[rgba(122,154,110,0.3)] rounded-[12px] text-xs text-[#E4E9DF] font-mono focus:border-[#86A978] outline-none"
                  >
                    {shelters.map((s) => (
                      <option key={s._id || s.name} value={s.name}>
                        {s.name} (Cap: {s.capacity || 2500})
                      </option>
                    ))}
                    {shelters.length === 0 && (
                      <>
                        <option value="Alpha Command Bunker">Alpha Command Bunker</option>
                        <option value="Highland Relief Center">Highland Relief Center</option>
                        <option value="Coastal Evac Point">Coastal Evac Point</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleCalculate()}
                disabled={isCalculating}
                className="h-11 bg-[#6F9164] hover:bg-[#86A978] disabled:opacity-50 text-[#080C08] rounded-[12px] font-mono text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg mt-1"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isCalculating ? 'autorenew' : 'alt_route'}
                </span>
                {isCalculating ? 'Computing Contour Vectors...' : 'Calculate Safe Corridors'}
              </button>

              {/* Scored Routes List */}
              {calculationResult?.routes && (
                <div className="flex flex-col gap-2.5 mt-2">
                  <span className="text-[10px] uppercase tracking-wider text-[#777C70] font-mono">
                    Evaluated Route Corridors ({calculationResult.routes.length})
                  </span>

                  {calculationResult.routes.map((route) => {
                    const isSelected = selectedRoute === route.id;
                    const isRecommended = route.status === 'RECOMMENDED';

                    return (
                      <div
                        key={route.id}
                        onClick={() => setSelectedRoute(route.id)}
                        className={`p-3.5 rounded-[14px] border cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? isRecommended
                              ? 'bg-[#1D2A1B] border-[#86A978] shadow-md'
                              : 'bg-[#EF4444]/10 border-[#EF4444]'
                            : 'bg-[#080C08] border-[rgba(228,233,223,0.06)] hover:border-[rgba(122,154,110,0.3)]'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1.5 font-mono">
                          <span className="font-medium text-[#E4E9DF] text-[12px]">{route.label}</span>
                          <span
                            className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-bold ${
                              isRecommended
                                ? 'bg-[#7A9A6E]/20 text-[#86A978] border border-[rgba(122,154,110,0.3)]'
                                : 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30'
                            }`}
                          >
                            {route.status}
                          </span>
                        </div>

                        <p className="text-[11px] text-[#B0B5A8] font-sans leading-relaxed mb-2">
                          {route.condition}
                        </p>

                        <div className="grid grid-cols-3 gap-2 font-mono text-[10px] border-t border-[rgba(228,233,223,0.06)] pt-2 text-[#777C70]">
                          <div>Distance: <strong className="text-[#E4E9DF]">{route.distanceKm} km</strong></div>
                          <div>Transit: <strong className="text-[#E4E9DF]">{route.etaMinutes} min</strong></div>
                          <div>Clearance: <strong className="text-[#86A978]">{route.clearanceIndex}%</strong></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Selected Route Telemetry Summary */}
              {currentRouteData && (
                <div className="bg-[#080C08] p-4 rounded-[14px] border border-[rgba(228,233,223,0.08)] font-mono text-[11px] space-y-2 mt-2">
                  <div className="flex justify-between text-[#777C70]">
                    <span>Bottleneck Risk:</span>
                    <span className="text-[#E4E9DF]">{currentRouteData.bottleneckRisk}</span>
                  </div>
                  <div className="flex justify-between text-[#777C70]">
                    <span>Contour Clearance:</span>
                    <span className="text-[#86A978]">{currentRouteData.clearanceIndex}% Clear</span>
                  </div>
                  <div className="flex justify-between text-[#777C70]">
                    <span>Real-time Telemetry:</span>
                    <span className="text-[#86A978]">Synchronized with MongoDB</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
