import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function EvacuationRoutePage() {
  const [startPoint, setStartPoint] = useState('Sector 4 Habitation');
  const [destination, setDestination] = useState('Alpha Command Bunker');
  const [selectedRoute, setSelectedRoute] = useState('A');
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = () => {
    setIsCalculating(true);
    setTimeout(() => setIsCalculating(false), 800);
  };

  return (
    <div className="flex-grow flex flex-col w-full h-[calc(100vh-96px)] bg-transparent relative overflow-hidden z-10 font-sans text-xs font-light text-[#E4E9DF]">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="hidden xl:flex bg-[#0D120C]/90 border-r border-[rgba(228,233,223,0.08)] flex-col h-full p-5 w-60 z-40">
          <div className="mb-6 px-2">
            <span className="text-[10px] uppercase tracking-[0.16em] text-[#7A9A6E]">Terrain Navigation</span>
            <h2 className="font-display font-light text-[#E4E9DF] text-base mt-0.5">Evacuation Routing</h2>
          </div>
          <nav className="flex flex-col gap-2 flex-1">
            <Link to="/risk-zone-id" className="flex items-center gap-3 px-3.5 py-2.5 rounded-[12px] text-[#777C70] hover:text-[#E4E9DF] hover:bg-[#080C08]/50 transition-colors">
              <span className="material-symbols-outlined text-[18px]">gpp_maybe</span>
              <span>Risk Zones</span>
            </Link>
            <Link to="/relocation-priority" className="flex items-center gap-3 px-3.5 py-2.5 rounded-[12px] text-[#777C70] hover:text-[#E4E9DF] hover:bg-[#080C08]/50 transition-colors">
              <span className="material-symbols-outlined text-[18px]">priority_high</span>
              <span>Priority</span>
            </Link>
            <Link to="/evacuation-route" className="flex items-center gap-3 px-3.5 py-2.5 rounded-[12px] bg-[#080C08] border border-[rgba(122,154,110,0.3)] text-[#86A978] shadow-sm">
              <span className="material-symbols-outlined text-[18px]">moped</span>
              <span>Relocation Routing</span>
            </Link>
          </nav>
        </aside>

        {/* Data & Route Configuration Panel */}
        <main className="flex-1 relative flex flex-col md:flex-row overflow-hidden">
          <div className="w-full md:w-80 lg:w-96 flex-shrink-0 bg-[#0D120C]/95 border-r border-[rgba(228,233,223,0.08)] h-full flex flex-col z-20 overflow-y-auto backdrop-blur-md">
            <div className="p-5 border-b border-[rgba(228,233,223,0.08)]">
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

          {/* GIS Route SVG Map Overlay */}
          <div className="flex-1 relative bg-[#060906]/60 backdrop-blur-xs overflow-hidden">
            <img
              className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-35"
              alt="GIS Route Planning Satellite Canvas"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAS6SyX4mSUByeXmbOr3Imq714QBwc4QM5z5tcGWLNaRzrDfwK-J-bt61jldEPev8-eD8eE2TIoPbKDqx3biEsqT3LJmDp4ZMLBPCh9un_3XMfRWyVq9hP-dMUFhHmT-QFSHs4Se5Z5Z2ljWzV52QCZNR0Dtn69SAH21jVwvNEI4uehdEcvO9NaaeE7cTdu2oiBHNkZuIQ9AiE2c-EQnITC5_v8TqZrRCndDiTyqrLQsEPuKets-fdM"
            />

            {/* Interactive Vector SVG Overlay */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 1000 800" preserveAspectRatio="xMidYMid slice">
              {/* Hazard Zones */}
              <circle cx="600" cy="300" r="120" fill="#DC2626" fillOpacity="0.12" stroke="#DC2626" strokeWidth="1" strokeDasharray="4 4" />

              {/* Route B (Red Dashed) */}
              <path
                d="M 200 400 L 400 350 L 550 320 L 700 200 L 800 150"
                fill="none"
                stroke="#DC2626"
                strokeWidth={selectedRoute === 'B' ? '5' : '2'}
                strokeDasharray="6 6"
                opacity={selectedRoute === 'B' ? '1' : '0.4'}
              />

              {/* Route A (Green Cartographic Line) */}
              <path
                d="M 200 400 L 250 500 L 450 550 L 650 450 L 800 150"
                fill="none"
                stroke="#7A9A6E"
                strokeWidth={selectedRoute === 'A' ? '6' : '3'}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 200 400 L 250 500 L 450 550 L 650 450 L 800 150"
                fill="none"
                stroke="#86A978"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Nodes */}
              <circle cx="200" cy="400" r="8" fill="#7A9A6E" stroke="#080C08" strokeWidth="2" />
              <text x="180" y="375" fill="#E4E9DF" fontSize="12" fontWeight="300">
                {startPoint.toUpperCase()}
              </text>

              <circle cx="800" cy="150" r="10" fill="#86A978" stroke="#080C08" strokeWidth="2" />
              <text x="825" y="155" fill="#E4E9DF" fontSize="12" fontWeight="300">
                {destination.toUpperCase()}
              </text>
            </svg>

            {/* Floating Map Controls */}
            <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-30">
              <button className="w-10 h-10 bg-[#080C08] border border-[rgba(228,233,223,0.08)] rounded-[12px] flex items-center justify-center text-[#E4E9DF] hover:border-[rgba(122,154,110,0.3)]">
                <span className="material-symbols-outlined">add</span>
              </button>
              <button className="w-10 h-10 bg-[#080C08] border border-[rgba(228,233,223,0.08)] rounded-[12px] flex items-center justify-center text-[#E4E9DF] hover:border-[rgba(122,154,110,0.3)]">
                <span className="material-symbols-outlined">remove</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
