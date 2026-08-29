import React, { useState } from 'react';
import DashboardSidebar from '../components/DashboardSidebar';

export default function RiskZoneIdPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activePlace, setActivePlace] = useState({
    name: 'Oakhaven Valley Sector',
    coords: "6°12'S 106°48'E",
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

  return (
    <div className="flex-grow flex flex-col w-full h-[calc(100vh-96px)] bg-[#080C08] relative overflow-hidden z-10 font-sans text-xs font-light text-[#E4E9DF]">
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

            {/* Map Canvas Visual Area */}
            <div className="flex-1 relative w-full bg-[#060906] overflow-hidden flex items-center justify-center">
              {/* Synthetic Cartographic Grid & Topo SVG Background */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#7A9A6E" strokeWidth="0.5" opacity="0.4" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  {/* Topo contour lines */}
                  <path d="M 0 100 Q 300 50 600 200 T 1200 150" fill="none" stroke="#7A9A6E" strokeWidth="1" opacity="0.5" />
                  <path d="M 0 250 Q 400 180 800 350 T 1400 300" fill="none" stroke="#86A978" strokeWidth="1" opacity="0.4" />
                  <path d="M 0 400 Q 200 500 700 420 T 1500 550" fill="none" stroke="#6F9164" strokeWidth="1" opacity="0.3" />
                </svg>
              </div>

              {/* Radar Scan Line */}
              <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#7A9A6E]/40 to-transparent animate-scanline"></div>
              </div>

              {/* Active Place Spotlight Marker */}
              <div className="relative z-20 flex flex-col items-center animate-bounce-slow">
                <div className="relative flex items-center justify-center w-28 h-28">
                  <span
                    className={`absolute inset-0 rounded-full opacity-40 animate-ping ${
                      activePlace.status === 'Critical' ? 'bg-[#DC2626]' : activePlace.status === 'Warning' ? 'bg-[#C1B99D]' : 'bg-[#7A9A6E]'
                    }`}
                  ></span>
                  <span
                    className={`w-14 h-14 rounded-full border-2 border-[#080C08] shadow-2xl flex items-center justify-center ${
                      activePlace.status === 'Critical'
                        ? 'bg-[#DC2626] text-white shadow-[0_0_24px_#DC2626]'
                        : activePlace.status === 'Warning'
                        ? 'bg-[#C1B99D] text-[#0A0E09]'
                        : 'bg-[#7A9A6E] text-[#0A0E09]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[28px]">location_on</span>
                  </span>
                </div>
                <div className="mt-2 bg-[#0D120C]/95 border border-[rgba(122,154,110,0.3)] px-4 py-2 rounded-[12px] text-center shadow-xl backdrop-blur-md">
                  <p className="font-display font-light text-sm text-[#E4E9DF]">{activePlace.name}</p>
                  <p className="text-[10px] text-[#777C70] font-mono mt-0.5">{activePlace.coords}</p>
                </div>
              </div>

              {/* Zoom Controls */}
              <div className="absolute top-6 right-6 flex flex-col gap-2 z-20">
                <button className="w-10 h-10 bg-[#080C08] border border-[rgba(228,233,223,0.08)] rounded-[12px] flex items-center justify-center text-[#E4E9DF] hover:border-[rgba(122,154,110,0.3)]">
                  <span className="material-symbols-outlined">add</span>
                </button>
                <button className="w-10 h-10 bg-[#080C08] border border-[rgba(228,233,223,0.08)] rounded-[12px] flex items-center justify-center text-[#E4E9DF] hover:border-[rgba(122,154,110,0.3)]">
                  <span className="material-symbols-outlined">remove</span>
                </button>
                <button className="w-10 h-10 bg-[#6F9164] text-[#0A0E09] rounded-[12px] flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined">my_location</span>
                </button>
              </div>

              {/* Legend */}
              <div className="absolute bottom-6 left-6 bg-[#080C08]/90 border border-[rgba(228,233,223,0.08)] p-4 rounded-[14px] z-20 font-sans text-xs backdrop-blur-md shadow-lg">
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
