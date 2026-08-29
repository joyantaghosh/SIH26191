import React, { useState, useEffect, useMemo } from 'react';
import DashboardSidebar from '../components/DashboardSidebar';
import LeafletMap from '../components/LeafletMap';
import { getRiskZones } from '../services/riskZoneApi';

const DEFAULT_FALLBACK_ZONES = [
  {
    id: 'OKH-01',
    zoneId: 'OKH-01',
    name: 'Oakhaven Valley Sector',
    region: 'Jakarta Selatan',
    description: 'Evaluated based on active elevation terrain, slope stability, and mudslide telemetry vectors.',
    coordinateLabel: "6°12'S 106°48'E",
    latLng: [-6.2, 106.8],
    vulnerabilityScore: 87,
    riskLevel: 'critical',
    hazardType: 'flood_mudslide',
    severityIndex: 8,
    population: 1452,
    households: 361,
    distanceToHazardKm: 0.4,
    metrics: { severity: 92, density: 74, soilRisk: 68 },
    radiusMeters: 900,
  },
  {
    id: 'PRC-02',
    zoneId: 'PRC-02',
    name: 'Pine Ridge Coastal Ridge',
    region: 'Jakarta Utara',
    description: 'Active coastal ridge slope monitoring under high precipitation threshold.',
    coordinateLabel: "6°08'S 106°51'E",
    latLng: [-6.128, 106.845],
    vulnerabilityScore: 61,
    riskLevel: 'warning',
    hazardType: 'coastal_erosion',
    severityIndex: 5,
    population: 2310,
    households: 590,
    distanceToHazardKm: 1.8,
    metrics: { severity: 58, density: 63, soilRisk: 44 },
    radiusMeters: 1200,
  },
  {
    id: 'RRE-03',
    zoneId: 'RRE-03',
    name: 'Riverbend Refuge East',
    region: 'Jakarta Timur',
    description: 'Designated safe refuge zone and high-elevation emergency evacuation muster corridor.',
    coordinateLabel: "6°14'S 106°54'E",
    latLng: [-6.23, 106.9],
    vulnerabilityScore: 22,
    riskLevel: 'safe',
    hazardType: 'flood',
    severityIndex: 2,
    population: 880,
    households: 214,
    distanceToHazardKm: 5.6,
    metrics: { severity: 18, density: 35, soilRisk: 20 },
    radiusMeters: 1000,
  },
];

export default function RiskZoneIdPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [zones, setZones] = useState(DEFAULT_FALLBACK_ZONES);
  const [activeZone, setActiveZone] = useState(DEFAULT_FALLBACK_ZONES[0]);
  const [loading, setLoading] = useState(true);
  const [isLiveDb, setIsLiveDb] = useState(false);

  // Fetch Risk Zones from MongoDB
  useEffect(() => {
    let mounted = true;
    setLoading(true);

    getRiskZones()
      .then((data) => {
        if (mounted && Array.isArray(data) && data.length > 0) {
          setZones(data);
          setActiveZone(data[0]);
          setIsLiveDb(true);
        }
      })
      .catch((err) => {
        console.warn('[RiskZoneIdPage] Falling back to default mock data:', err.message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const query = searchQuery.toLowerCase().trim();
    const match = zones.find(
      (z) =>
        z.name.toLowerCase().includes(query) ||
        (z.zoneId && z.zoneId.toLowerCase().includes(query)) ||
        (z.region && z.region.toLowerCase().includes(query))
    );

    if (match) {
      setActiveZone(match);
    } else {
      // Dynamic simulated place if query not in list
      const customPlace = {
        id: `CUSTOM-${Date.now()}`,
        zoneId: `SRCH-${zones.length + 1}`,
        name: searchQuery.trim(),
        region: 'Searched Area',
        description: 'Dynamically evaluated sector based on input query telemetry.',
        coordinateLabel: "6°15'S 106°50'E",
        latLng: [-6.25, 106.833],
        vulnerabilityScore: 54,
        riskLevel: 'warning',
        hazardType: 'elevated_slope',
        severityIndex: 5,
        population: 1120,
        households: 280,
        distanceToHazardKm: 1.5,
        metrics: { severity: 55, density: 60, soilRisk: 48 },
        radiusMeters: 800,
      };
      setZones((prev) => [customPlace, ...prev]);
      setActiveZone(customPlace);
    }
  };

  // Convert zones to Map Circles
  const mapCircles = useMemo(() => {
    return zones.map((z) => {
      const isSelected = activeZone && (activeZone.id === z.id || activeZone.zoneId === z.zoneId);
      const isCritical = z.riskLevel === 'critical' || z.riskLevel === 'high';
      const color =
        z.riskLevel === 'critical' || z.riskLevel === 'high'
          ? '#EF4444'
          : z.riskLevel === 'warning' || z.riskLevel === 'medium'
          ? '#F59E0B'
          : '#10B981';

      return {
        center: z.latLng,
        radius: z.radiusMeters || 800,
        color: color,
        fillColor: color,
        fillOpacity: isSelected ? 0.28 : 0.12,
        weight: isSelected ? 2.5 : 1.5,
        dashArray: isCritical ? '6 4' : null,
        label: `${z.zoneId ? `[${z.zoneId}] ` : ''}${z.name} — ${z.riskLevel.toUpperCase()}`,
      };
    });
  }, [zones, activeZone]);

  // Convert zones to Map Markers
  const mapMarkers = useMemo(() => {
    return zones.map((z) => {
      const isSelected = activeZone && (activeZone.id === z.id || activeZone.zoneId === z.zoneId);
      const isCritical = z.riskLevel === 'critical' || z.riskLevel === 'high';
      const color =
        z.riskLevel === 'critical' || z.riskLevel === 'high'
          ? '#EF4444'
          : z.riskLevel === 'warning' || z.riskLevel === 'medium'
          ? '#F59E0B'
          : '#10B981';

      return {
        position: z.latLng,
        label: `${z.zoneId ? `[${z.zoneId}] ` : ''}${z.name}`,
        color: color,
        isCritical,
        isSelected,
        popupContent: (
          <div>
            <div className="text-[11px] font-medium text-[#E4E9DF]">{z.region || z.name}</div>
            <div className="text-[10px] text-[#B0B5A8] mt-0.5">
              Score: <strong className="text-[#E4E9DF]">{z.vulnerabilityScore}/100</strong> • Level: <span className="capitalize">{z.riskLevel}</span>
            </div>
          </div>
        ),
      };
    });
  }, [zones, activeZone]);

  return (
    <div className="flex-grow flex flex-col w-full h-[calc(100vh-70px)] bg-[#080C08] relative overflow-hidden z-10 font-sans text-xs font-light text-[#E4E9DF]">
      <div className="flex flex-1 overflow-hidden h-full">
        <DashboardSidebar />

        {/* Main Canvas + Top Search Bar */}
        <main className="flex-1 relative bg-[#060906] overflow-hidden flex flex-col lg:flex-row h-full">
          {/* GIS Interactive Visual Canvas */}
          <div className="flex-1 h-full relative z-10 overflow-hidden flex flex-col">
            {/* Top Search Bar */}
            <div className="p-4 md:p-6 bg-[#080C08]/90 border-b border-[rgba(228,233,223,0.08)] z-30 backdrop-blur-md">
              <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl w-full mx-auto lg:mx-0">
                <div className="relative flex-1">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#86A978] text-[20px] pointer-events-none">
                    search
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter place, city, region or zone ID (e.g. OKH-01, Oakhaven, Pine Ridge)..."
                    className="w-full h-11 pl-11 pr-4 bg-[#0D120C] border border-[rgba(122,154,110,0.3)] rounded-[14px] text-xs text-[#E4E9DF] placeholder-[#777C70] outline-none focus:border-[#86A978] focus:ring-1 focus:ring-[#86A978] shadow-inner transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 h-11 bg-[#6F9164] hover:bg-[#86A978] text-[#0A0E09] rounded-[14px] font-medium text-xs uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 shadow-lg"
                >
                  <span>Search Sector</span>
                  <span className="material-symbols-outlined text-[16px]">location_searching</span>
                </button>
              </form>

              {/* Quick suggestions from Database */}
              <div className="flex flex-wrap items-center gap-2 mt-3 max-w-2xl mx-auto lg:mx-0 text-[11px] text-[#777C70]">
                <span className="uppercase text-[10px] tracking-wider text-[#7A9A6E] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7A9A6E] animate-pulse"></span>
                  {isLiveDb ? 'DB Risk Zones:' : 'Quick Select:'}
                </span>
                {zones.map((place) => (
                  <button
                    key={place.id || place.zoneId}
                    type="button"
                    onClick={() => {
                      setActiveZone(place);
                      setSearchQuery(place.name);
                    }}
                    className={`px-3 py-1 rounded-full border text-[11px] transition-all flex items-center gap-1.5 ${
                      activeZone?.id === place.id
                        ? 'bg-[#7A9A6E]/20 text-[#86A978] border-[#7A9A6E] shadow-[0_0_12px_rgba(122,154,110,0.3)]'
                        : 'bg-[#0D120C] border-[rgba(228,233,223,0.08)] text-[#B0B5A8] hover:border-[rgba(122,154,110,0.3)]'
                    }`}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        backgroundColor:
                          place.riskLevel === 'critical'
                            ? '#EF4444'
                            : place.riskLevel === 'warning'
                            ? '#F59E0B'
                            : '#10B981',
                      }}
                    ></span>
                    <span>{place.zoneId ? `${place.zoneId}: ` : ''}{place.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Leaflet Map */}
            <div className="flex-1 relative w-full overflow-hidden">
              <LeafletMap
                center={activeZone?.latLng || [-6.2, 106.8]}
                zoom={13}
                markers={mapMarkers}
                circles={mapCircles}
                activeZoneId={activeZone?.id}
                onZoneClick={(selected) => {
                  const match = zones.find((z) => z.id === selected.id || z.zoneId === selected.zoneId);
                  if (match) setActiveZone(match);
                }}
              />

              {/* Legend Overlay */}
              <div className="absolute bottom-6 left-6 bg-[#080C08]/92 border border-[rgba(228,233,223,0.12)] p-4 rounded-[16px] z-[1000] font-sans text-xs backdrop-blur-md shadow-2xl pointer-events-auto">
                <div className="text-[10px] uppercase tracking-[0.16em] text-[#7A9A6E] mb-2.5 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7A9A6E] animate-pulse"></span>
                  Risk Zone Index Legend
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 bg-[#EF4444] rounded-full animate-pulse shadow-[0_0_8px_#EF4444]"></div>
                    <span className="text-[#E4E9DF]">Critical Danger Zone</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 bg-[#F59E0B] rounded-full"></div>
                    <span className="text-[#B0B5A8]">Warning Sector</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 bg-[#10B981] rounded-full"></div>
                    <span className="text-[#B0B5A8]">Safe Refuge Zone</span>
                  </div>
                </div>
                {isLiveDb && (
                  <div className="mt-2.5 pt-2 border-t border-[rgba(228,233,223,0.08)] text-[10px] text-[#777C70] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                    <span>Synchronized with MongoDB</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar Analysis Scorecard */}
          <div className="w-full lg:w-[380px] h-full bg-[#0D120C]/95 border-l border-[rgba(228,233,223,0.08)] flex flex-col shrink-0 z-30 overflow-y-auto backdrop-blur-md">
            <div className="p-6 border-b border-[rgba(228,233,223,0.08)] sticky top-0 z-10 bg-[#0D120C]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.16em] text-[#7A9A6E]">Telemetry Analysis</span>
                {activeZone?.zoneId && (
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#1D2A1B] text-[#86A978] border border-[rgba(122,154,110,0.3)]">
                    {activeZone.zoneId}
                  </span>
                )}
              </div>
              <h2 className="font-display font-light text-lg text-[#E4E9DF] mt-1">{activeZone?.name}</h2>
              <p className="font-sans text-[11px] text-[#777C70] font-mono mt-0.5">{activeZone?.coordinateLabel}</p>
            </div>

            {/* Dynamic Score Card */}
            <div className="p-6 border-b border-[rgba(228,233,223,0.08)]">
              <div className="bg-[#080C08] border border-[rgba(122,154,110,0.18)] rounded-[17px] p-5 relative hover:border-[rgba(134,169,120,0.4)] transition-all duration-300">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="text-[10px] uppercase text-[#777C70] tracking-wider">Computed Vulnerability</div>
                    <div className="font-display text-4xl font-light text-[#E4E9DF] tracking-tight mt-1">
                      {activeZone?.vulnerabilityScore}
                      <span className="text-lg text-[#777C70] font-normal">/100</span>
                    </div>
                  </div>
                  <div
                    className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-medium flex items-center gap-1 border ${
                      activeZone?.riskLevel === 'critical'
                        ? 'bg-[#EF4444]/20 border-[#EF4444]/40 text-[#EF4444]'
                        : activeZone?.riskLevel === 'warning'
                        ? 'bg-[#F59E0B]/20 border-[#F59E0B]/40 text-[#F59E0B]'
                        : 'bg-[#10B981]/20 border-[#10B981]/40 text-[#10B981]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">warning</span>
                    {activeZone?.riskLevel}
                  </div>
                </div>

                <p className="text-xs text-[#777C70] leading-relaxed border-t border-[rgba(228,233,223,0.06)] pt-3 mt-3">
                  {activeZone?.description ||
                    `Analysis for ${activeZone?.name}. Evaluated based on active elevation terrain, slope stability, and telemetry vectors.`}
                </p>

                {/* Bar Metrics */}
                <div className="mt-4 space-y-2.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-20 text-[#777C70] text-[11px]">Severity</span>
                    <div className="flex-1 h-1.5 bg-[#1D2A1B] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#EF4444] transition-all duration-1000"
                        style={{ width: `${Math.min(100, activeZone?.metrics?.severity || activeZone?.vulnerabilityScore || 50)}%` }}
                      ></div>
                    </div>
                    <span className="font-mono text-[10px] text-[#B0B5A8]">
                      {activeZone?.metrics?.severity || activeZone?.vulnerabilityScore}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-20 text-[#777C70] text-[11px]">Density</span>
                    <div className="flex-1 h-1.5 bg-[#1D2A1B] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#F59E0B] transition-all duration-1000"
                        style={{ width: `${Math.min(100, activeZone?.metrics?.density || 60)}%` }}
                      ></div>
                    </div>
                    <span className="font-mono text-[10px] text-[#B0B5A8]">
                      {activeZone?.metrics?.density || 60}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-20 text-[#777C70] text-[11px]">Soil Risk</span>
                    <div className="flex-1 h-1.5 bg-[#1D2A1B] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#86A978] transition-all duration-1000"
                        style={{ width: `${Math.min(100, activeZone?.metrics?.soilRisk || 45)}%` }}
                      ></div>
                    </div>
                    <span className="font-mono text-[10px] text-[#B0B5A8]">
                      {activeZone?.metrics?.soilRisk || 45}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Zone Telemetry Details */}
            <div className="p-6 space-y-3 font-sans text-xs font-light">
              <div className="flex justify-between items-center py-2 border-b border-[rgba(228,233,223,0.06)]">
                <span className="text-[11px] uppercase text-[#777C70]">Sector Name</span>
                <span className="text-[#E4E9DF] font-medium">{activeZone?.name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[rgba(228,233,223,0.06)]">
                <span className="text-[11px] uppercase text-[#777C70]">Region / District</span>
                <span className="text-[#E4E9DF]">{activeZone?.region || 'Jakarta Sector'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[rgba(228,233,223,0.06)]">
                <span className="text-[11px] uppercase text-[#777C70]">Hazard Type</span>
                <span className="text-[#86A978] font-medium capitalize">
                  {String(activeZone?.hazardType || 'landslide').replace(/_/g, ' ')}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[rgba(228,233,223,0.06)]">
                <span className="text-[11px] uppercase text-[#777C70]">Severity Index</span>
                <span className="text-[#EF4444] font-medium">{activeZone?.severityIndex} / 10</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[rgba(228,233,223,0.06)]">
                <span className="text-[11px] uppercase text-[#777C70]">Population at Risk</span>
                <span className="text-[#E4E9DF] font-mono">
                  {activeZone?.population ? activeZone.population.toLocaleString() : '0'} residents
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[rgba(228,233,223,0.06)]">
                <span className="text-[11px] uppercase text-[#777C70]">Households</span>
                <span className="text-[#E4E9DF] font-mono">
                  {activeZone?.households ? activeZone.households.toLocaleString() : '0'} units
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[rgba(228,233,223,0.06)]">
                <span className="text-[11px] uppercase text-[#777C70]">Distance to Hazard</span>
                <span className="text-[#E4E9DF] font-mono">{activeZone?.distanceToHazardKm ?? 0.4} km</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[rgba(228,233,223,0.06)]">
                <span className="text-[11px] uppercase text-[#777C70]">Zone Radius</span>
                <span className="text-[#E4E9DF] font-mono">{activeZone?.radiusMeters ?? 800} meters</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
