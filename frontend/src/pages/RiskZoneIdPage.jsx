import React, { useState, useMemo } from 'react';
import DashboardSidebar from '../components/DashboardSidebar';
import LeafletMap from '../components/LeafletMap';

export default function RiskZoneIdPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activePlace, setActivePlace] = useState({
    name: 'Oakhaven Valley Sector',
    coords: "6°12'S 106°48'E",
    latLng: [-6.2, 106.8],
    score: 87,
    status: 'Critical',
    hazard: 'Flood / Mudslide',
    severity: '8 / 10',
    population: '1,452',
    distance: '0.4 km',
    route: 'Compromised',
  });

  const samplePlaces = [
    {
      name: 'Oakhaven Valley Sector',
      coords: "6°12'S 106°48'E",
      latLng: [-6.2, 106.8],
      score: 87,
      status: 'Critical',
      hazard: 'Flood / Mudslide',
      severity: '8 / 10',
      population: '1,452',
      distance: '0.4 km',
      route: 'Compromised',
    },
    {
      name: 'Pine Ridge Coastal Ridge',
      coords: "6°18'S 106°54'E",
      latLng: [-6.3, 106.9],
      score: 68,
      status: 'Warning',
      hazard: 'Flash Flood',
      severity: '6 / 10',
      population: '850',
      distance: '1.2 km',
      route: 'Clear',
    },
    {
      name: 'Riverbend Refuge East',
      coords: "6°05'S 106°39'E",
      latLng: [-6.083, 106.65],
      score: 24,
      status: 'Safe',
      hazard: 'Low Risk Contour',
      severity: '2 / 10',
      population: '3,200',
      distance: '4.8 km',
      route: 'Optimal',
    },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const match = samplePlaces.find((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (match) {
      setActivePlace(match);
    } else {
      setActivePlace({
        name: searchQuery.trim(),
        coords: "6°15'S 106°50'E",
        latLng: [-6.25, 106.833],
        score: Math.floor(Math.random() * 40) + 50,
        status: 'Warning',
        hazard: 'Elevated Slope Terrain',
        severity: '5 / 10',
        population: '980',
        distance: '1.5 km',
        route: 'Monitored',
      });
    }
  };

  // Map data derived from active place and all sample places
  const mapMarkers = useMemo(() => {
    return samplePlaces.map((place) => ({
      position: place.latLng,
      label: place.name,
      color:
        place.status === 'Critical'
          ? '#DC2626'
          : place.status === 'Warning'
          ? '#C1B99D'
          : '#7A9A6E',
      popupContent: `${place.hazard} — Score: ${place.score}/100`,
    }));
  }, []);

  const mapCircles = useMemo(() => {
    return samplePlaces.map((place) => ({
      center: place.latLng,
      radius:
        place.status === 'Critical'
          ? 800
          : place.status === 'Warning'
          ? 500
          : 300,
      color:
        place.status === 'Critical'
          ? '#DC2626'
          : place.status === 'Warning'
          ? '#C1B99D'
          : '#7A9A6E',
      fillOpacity: place.name === activePlace.name ? 0.2 : 0.08,
      label: `${place.name} — ${place.status}`,
    }));
  }, [activePlace.name]);

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
                    placeholder="Enter place, city, region or zone ID (e.g. Oakhaven, Pine Ridge, 6°12'S)..."
                    className="w-full h-11 pl-11 pr-4 bg-[#0D120C] border border-[rgba(122,154,110,0.3)] rounded-[14px] text-xs text-[#E4E9DF] placeholder-[#777C70] outline-none focus:border-[#86A978] focus:ring-1 focus:ring-[#86A978] shadow-inner transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 h-11 bg-[#6F9164] hover:bg-[#86A978] text-[#0A0E09] rounded-[14px] font-medium text-xs uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 shadow-lg"
                >
                  <span>Search Place</span>
                  <span className="material-symbols-outlined text-[16px]">location_searching</span>
                </button>
              </form>

              {/* Quick suggestions */}
              <div className="flex flex-wrap items-center gap-2 mt-3 max-w-2xl mx-auto lg:mx-0 text-[11px] text-[#777C70]">
                <span className="uppercase text-[10px] tracking-wider text-[#7A9A6E]">Quick Select:</span>
                {samplePlaces.map((place) => (
                  <button
                    key={place.name}
                    type="button"
                    onClick={() => {
                      setActivePlace(place);
                      setSearchQuery(place.name);
                    }}
                    className={`px-2.5 py-1 rounded-full border transition-all ${
                      activePlace.name === place.name
                        ? 'bg-[#7A9A6E]/20 text-[#86A978] border-[#7A9A6E]'
                        : 'bg-[#0D120C] border-[rgba(228,233,223,0.08)] text-[#B0B5A8] hover:border-[rgba(122,154,110,0.3)]'
                    }`}
                  >
                    {place.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Leaflet Map */}
            <div className="flex-1 relative w-full overflow-hidden">
              <LeafletMap
                center={activePlace.latLng}
                zoom={13}
                markers={mapMarkers}
                circles={mapCircles}
              />

              {/* Legend Overlay */}
              <div className="absolute bottom-6 left-6 bg-[#080C08]/90 border border-[rgba(228,233,223,0.08)] p-4 rounded-[14px] z-[1000] font-sans text-xs backdrop-blur-md shadow-lg pointer-events-auto">
                <div className="text-[10px] uppercase tracking-[0.16em] text-[#7A9A6E] mb-2 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7A9A6E] animate-pulse"></span>
                  Risk Zone Index Legend
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 bg-[#DC2626] rounded-full animate-pulse"></div>
                    <span className="text-[#E4E9DF]">Critical Risk Zone</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 bg-[#C1B99D] rounded-full"></div>
                    <span className="text-[#B0B5A8]">Warning Sector</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 bg-[#7A9A6E] rounded-full"></div>
                    <span className="text-[#B0B5A8]">Safe Refuge Zone</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar Analysis Scorecard */}
          <div className="w-full lg:w-[380px] h-full bg-[#0D120C]/95 border-l border-[rgba(228,233,223,0.08)] flex flex-col shrink-0 z-30 overflow-y-auto backdrop-blur-md">
            <div className="p-6 border-b border-[rgba(228,233,223,0.08)] sticky top-0 z-10 bg-[#0D120C]">
              <span className="text-[10px] uppercase tracking-[0.16em] text-[#7A9A6E]">Telemetry Analysis</span>
              <h2 className="font-display font-light text-lg text-[#E4E9DF] mt-0.5">Zone Scorecard</h2>
              <p className="font-sans text-[11px] text-[#777C70] font-mono mt-0.5">{activePlace.coords}</p>
            </div>

            {/* Dynamic Score Card */}
            <div className="p-6 border-b border-[rgba(228,233,223,0.08)]">
              <div className="bg-[#080C08] border border-[rgba(122,154,110,0.18)] rounded-[17px] p-5 relative hover:border-[rgba(134,169,120,0.4)] transition-all duration-300">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="text-[10px] uppercase text-[#777C70] tracking-wider">Computed Vulnerability</div>
                    <div className="font-display text-4xl font-light text-[#E4E9DF] tracking-tight mt-1">
                      {activePlace.score}<span className="text-lg text-[#777C70] font-normal">/100</span>
                    </div>
                  </div>
                  <div
                    className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-medium flex items-center gap-1 border ${
                      activePlace.status === 'Critical'
                        ? 'bg-[#DC2626]/20 border-[#DC2626]/40 text-[#DC2626]'
                        : activePlace.status === 'Warning'
                        ? 'bg-[#C1B99D]/20 border-[#C1B99D]/40 text-[#C1B99D]'
                        : 'bg-[#7A9A6E]/20 border-[#7A9A6E]/40 text-[#86A978]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">warning</span>
                    {activePlace.status}
                  </div>
                </div>

                <p className="text-xs text-[#777C70] leading-relaxed border-t border-[rgba(228,233,223,0.06)] pt-3 mt-3">
                  Analysis for <strong className="text-[#E4E9DF]">{activePlace.name}</strong>. Evaluated based on active elevation terrain, slope stability, and mudslide telemetry vectors.
                </p>

                {/* Bar Metrics */}
                <div className="mt-4 space-y-2.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-20 text-[#777C70] text-[11px]">Severity</span>
                    <div className="flex-1 h-1.5 bg-[#1D2A1B] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#DC2626] transition-all duration-1000"
                        style={{ width: `${Math.min(100, activePlace.score)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-20 text-[#777C70] text-[11px]">Density</span>
                    <div className="flex-1 h-1.5 bg-[#1D2A1B] rounded-full overflow-hidden">
                      <div className="h-full bg-[#C1B99D] w-[75%]"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-20 text-[#777C70] text-[11px]">Soil Risk</span>
                    <div className="flex-1 h-1.5 bg-[#1D2A1B] rounded-full overflow-hidden">
                      <div className="h-full bg-[#86A978] w-[85%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Zone Telemetry Details */}
            <div className="p-6 space-y-3 font-sans text-xs font-light">
              <div className="flex justify-between items-center py-2 border-b border-[rgba(228,233,223,0.06)]">
                <span className="text-[11px] uppercase text-[#777C70]">Location Name</span>
                <span className="text-[#E4E9DF] font-medium">{activePlace.name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[rgba(228,233,223,0.06)]">
                <span className="text-[11px] uppercase text-[#777C70]">Hazard Type</span>
                <span className="text-[#E4E9DF]">{activePlace.hazard}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[rgba(228,233,223,0.06)]">
                <span className="text-[11px] uppercase text-[#777C70]">Severity Index</span>
                <span className="text-[#86A978] font-medium">{activePlace.severity}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[rgba(228,233,223,0.06)]">
                <span className="text-[11px] uppercase text-[#777C70]">Population</span>
                <span className="text-[#E4E9DF]">{activePlace.population}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[rgba(228,233,223,0.06)]">
                <span className="text-[11px] uppercase text-[#777C70]">Distance to Hazard</span>
                <span className="text-[#E4E9DF]">{activePlace.distance}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[rgba(228,233,223,0.06)]">
                <span className="text-[11px] uppercase text-[#777C70]">Evac Route Status</span>
                <span className="text-[#C1B99D] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">warning</span> {activePlace.route}
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
