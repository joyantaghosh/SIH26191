import React, { useState, useMemo } from 'react';
import DashboardSidebar from '../components/DashboardSidebar';
import LeafletMap from '../components/LeafletMap';

export default function EvacuationRoutePage() {
  const [startPoint, setStartPoint] = useState('Sector 4 Habitation');
  const [destination, setDestination] = useState('Alpha Command Bunker');
  const [selectedRoute, setSelectedRoute] = useState('A');
  const [isCalculating, setIsCalculating] = useState(false);

  // Location coordinates for start and destination
  const locations = {
    'Sector 4 Habitation': [-6.22, 106.78],
    'Sector 7 Industrial': [-6.18, 106.82],
    'Residential Block A': [-6.25, 106.76],
    'Alpha Command Bunker': [-6.15, 106.88],
    'Highland Relief Center': [-6.12, 106.85],
    'Coastal Evac Point': [-6.28, 106.92],
  };

  // Route waypoints
  const routeA = useMemo(() => {
    const start = locations[startPoint] || [-6.22, 106.78];
    const end = locations[destination] || [-6.15, 106.88];
    // Generate a safer southern arc route
    return [
      start,
      [start[0] + 0.02, (start[1] + end[1]) / 2 - 0.02],
      [(start[0] + end[0]) / 2 + 0.03, (start[1] + end[1]) / 2],
      [end[0] + 0.01, end[1] - 0.03],
      end,
    ];
  }, [startPoint, destination]);

  const routeB = useMemo(() => {
    const start = locations[startPoint] || [-6.22, 106.78];
    const end = locations[destination] || [-6.15, 106.88];
    // Generate a direct but dangerous northern route
    return [
      start,
      [(start[0] + end[0]) / 2 - 0.02, (start[1] + end[1]) / 2 - 0.01],
      [end[0] - 0.01, end[1] - 0.02],
      end,
    ];
  }, [startPoint, destination]);

  // Hazard zone near the center
  const hazardCenter = useMemo(() => {
    const start = locations[startPoint] || [-6.22, 106.78];
    const end = locations[destination] || [-6.15, 106.88];
    return [(start[0] + end[0]) / 2 - 0.015, (start[1] + end[1]) / 2];
  }, [startPoint, destination]);

  const mapCenter = useMemo(() => {
    const start = locations[startPoint] || [-6.22, 106.78];
    const end = locations[destination] || [-6.15, 106.88];
    return [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2];
  }, [startPoint, destination]);

  const mapMarkers = useMemo(() => [
    {
      position: locations[startPoint] || [-6.22, 106.78],
      label: startPoint,
      color: '#7A9A6E',
      popupContent: 'Starting Point',
    },
    {
      position: locations[destination] || [-6.15, 106.88],
      label: destination,
      color: '#86A978',
      popupContent: 'Destination (Safe Zone)',
    },
  ], [startPoint, destination]);

  const mapCircles = useMemo(() => [
    {
      center: hazardCenter,
      radius: 1200,
      color: '#DC2626',
      fillColor: '#DC2626',
      fillOpacity: 0.12,
      label: 'Hazard Zone — Landslide Risk',
    },
  ], [hazardCenter]);

  const mapPolylines = useMemo(() => [
    {
      positions: routeB,
      color: '#DC2626',
      weight: selectedRoute === 'B' ? 5 : 2,
      dashArray: '8 8',
      opacity: selectedRoute === 'B' ? 1 : 0.4,
      label: 'Route B — Blocked (Landslide Hazard)',
    },
    {
      positions: routeA,
      color: '#7A9A6E',
      weight: selectedRoute === 'A' ? 6 : 3,
      opacity: selectedRoute === 'A' ? 1 : 0.6,
      label: 'Route A — Recommended (Clear Contour)',
    },
  ], [routeA, routeB, selectedRoute]);

  const handleCalculate = () => {
    setIsCalculating(true);
    setTimeout(() => setIsCalculating(false), 800);
  };

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
          </div>

          {/* Contour Transit Panel (Right Side Sidebar) */}
          <div className="w-full lg:w-[380px] h-full bg-[#0D120C]/95 border-l border-[rgba(228,233,223,0.08)] flex flex-col shrink-0 z-30 overflow-y-auto backdrop-blur-md">
            <div className="p-5 border-b border-[rgba(228,233,223,0.08)] sticky top-0 z-10 bg-[#0D120C]">
              <span className="text-[10px] uppercase tracking-[0.16em] text-[#7A9A6E]">Contour Transit</span>
              <h1 className="font-display font-light text-lg text-[#E4E9DF] mt-0.5">Route Configuration</h1>
            </div>

            <div className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider text-[#777C70]">Starting Point</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#777C70] text-[18px]">my_location</span>
                  <select
                    value={startPoint}
                    onChange={(e) => setStartPoint(e.target.value)}
                    className="w-full h-11 pl-9 pr-8 bg-[#080C08] border border-[rgba(228,233,223,0.08)] rounded-[12px] text-[#E4E9DF] focus:border-[#7A9A6E] outline-none appearance-none cursor-pointer text-xs"
                  >
                    <option value="Sector 4 Habitation">Sector 4 Habitation</option>
                    <option value="Sector 7 Industrial">Sector 7 Industrial</option>
                    <option value="Residential Block A">Residential Block A</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider text-[#777C70]">Destination (Safe Zone)</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#777C70] text-[18px]">flag</span>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full h-11 pl-9 pr-8 bg-[#080C08] border border-[rgba(228,233,223,0.08)] rounded-[12px] text-[#E4E9DF] focus:border-[#7A9A6E] outline-none appearance-none cursor-pointer text-xs"
                  >
                    <option value="Alpha Command Bunker">Alpha Command Bunker</option>
                    <option value="Highland Relief Center">Highland Relief Center</option>
                    <option value="Coastal Evac Point">Coastal Evac Point</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleCalculate}
                className="w-full h-11 bg-[#6F9164] hover:bg-[#86A978] text-[#0A0E09] rounded-[17px] font-medium text-xs uppercase tracking-wider transition-all shadow-md mt-1 flex items-center justify-center gap-2"
              >
                {isCalculating ? (
                  <>
                    <span className="w-4 h-4 border-2 border-[#0A0E09] border-t-transparent rounded-full animate-spin"></span>
                    Calculating...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">route</span>
                    Calculate Optimal Routes
                  </>
                )}
              </button>
            </div>

            {/* Available Routes List */}
            <div className="flex-1 bg-[#080C08] border-t border-[rgba(228,233,223,0.08)] p-5 flex flex-col gap-3 overflow-y-auto">
              <h3 className="text-[10px] text-[#7A9A6E] uppercase tracking-[0.16em] font-medium mb-1 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7A9A6E] animate-pulse"></span>
                Calculated Routes
              </h3>

              {/* Route A Card */}
              <div
                onClick={() => setSelectedRoute('A')}
                className={`bg-[#0D120C] border rounded-[17px] p-4 cursor-pointer transition-all duration-300 relative overflow-hidden hover:-translate-y-0.5 ${
                  selectedRoute === 'A' ? 'border-[#7A9A6E] shadow-[0_0_24px_rgba(122,154,110,0.25)]' : 'border-[rgba(228,233,223,0.07)] hover:border-[#7A9A6E]/50'
                }`}
              >
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#7A9A6E]"></div>
                <div className="flex justify-between items-start mb-2 pl-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-display font-light text-base text-[#E4E9DF]">Route A</h4>
                      <span className="bg-[#7A9A6E]/20 text-[#86A978] px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider animate-pulse-glow">Recommended</span>
                    </div>
                    <div className="text-xs text-[#777C70] mt-1">5.2 km • Est. 14 min</div>
                  </div>
                </div>
                <div className="pl-2 grid grid-cols-2 gap-2 mt-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase text-[#777C70]">Condition</span>
                    <p className="text-[#E4E9DF]">Clear Contour</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-[#777C70]">Risk Level</span>
                    <p className="text-[#86A978]">Low Risk</p>
                  </div>
                </div>
              </div>

              {/* Route B Card */}
              <div
                onClick={() => setSelectedRoute('B')}
                className={`bg-[#0D120C] border rounded-[17px] p-4 cursor-pointer transition-all duration-300 relative overflow-hidden hover:-translate-y-0.5 ${
                  selectedRoute === 'B' ? 'border-[#DC2626] shadow-[0_0_24px_rgba(220,38,38,0.25)]' : 'border-[rgba(228,233,223,0.07)] opacity-70 hover:opacity-100'
                }`}
              >
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#DC2626]"></div>
                <div className="flex justify-between items-start mb-2 pl-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-display font-light text-base text-[#E4E9DF]">Route B</h4>
                      <span className="bg-[#DC2626]/20 text-[#DC2626] px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider">Blocked</span>
                    </div>
                    <div className="text-xs text-[#777C70] mt-1">4.1 km • Hazard Obstacle</div>
                  </div>
                </div>
                <div className="pl-2 grid grid-cols-2 gap-2 mt-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase text-[#777C70]">Condition</span>
                    <p className="text-[#DC2626]">Landslide Hazard</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-[#777C70]">Risk Level</span>
                    <p className="text-[#DC2626]">High Risk</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
