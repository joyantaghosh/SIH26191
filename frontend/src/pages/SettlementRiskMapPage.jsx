import React, { useState } from 'react';
import DashboardSidebar from '../components/DashboardSidebar';
import { Link } from 'react-router-dom';

export default function SettlementRiskMapPage() {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [selectedSettlement, setSelectedSettlement] = useState({
    id: 'S-9921',
    name: 'Oakhaven Terrain Sector',
    risk: 'Critical',
    population: 1452,
    score: '94 / 100',
    hazard: 'Terrain Mudslide',
    distance: '0.4 km',
    routeStatus: 'Compromised',
    progress: 35,
    top: '35%',
    left: '45%',
  });

  const [filterDistrict, setFilterDistrict] = useState('All Districts');
  const [riskFilter, setRiskFilter] = useState('all');

  const settlements = [
    {
      id: 'S-9921',
      name: 'Oakhaven Terrain Sector',
      risk: 'Critical',
      population: 1452,
      score: '94 / 100',
      hazard: 'Terrain Mudslide',
      distance: '0.4 km',
      routeStatus: 'Compromised',
      progress: 35,
      top: '35%',
      left: '45%',
      district: 'Northern Sector',
    },
    {
      id: 'S-8810',
      name: 'Pine Ridge Habitation',
      risk: 'Warning',
      population: 850,
      score: '68 / 100',
      hazard: 'Flash Flood',
      distance: '1.2 km',
      routeStatus: 'Clear',
      progress: 60,
      top: '60%',
      left: '65%',
      district: 'Eastern Valley',
    },
    {
      id: 'S-4402',
      name: 'Riverbend Shelter Area',
      risk: 'Safe',
      population: 3200,
      score: '15 / 100',
      hazard: 'Low Risk',
      distance: '4.8 km',
      routeStatus: 'Optimal',
      progress: 90,
      top: '40%',
      left: '25%',
      district: 'Coastal Delta',
    },
    {
      id: 'S-3105',
      name: 'Highland Ridge West',
      risk: 'Critical',
      population: 980,
      score: '88 / 100',
      hazard: 'Slope Landslide',
      distance: '0.7 km',
      routeStatus: 'Blocked',
      progress: 20,
      top: '25%',
      left: '70%',
      district: 'Northern Sector',
    },
  ];

  const filteredSettlements = settlements.filter((s) => {
    if (filterDistrict !== 'All Districts' && s.district !== filterDistrict) return false;
    if (riskFilter === 'high' && s.risk !== 'Critical') return false;
    if (riskFilter === 'med' && s.risk !== 'Warning') return false;
    if (riskFilter === 'low' && s.risk !== 'Safe') return false;
    return true;
  });

  return (
    <div className="flex-grow flex flex-col w-full h-[calc(100vh-96px)] bg-[#080C08] relative overflow-hidden z-10 font-sans text-xs font-light text-[#E4E9DF]">
      <div className="flex flex-1 overflow-hidden h-full">
        <DashboardSidebar
          extraContent={
            <div className="space-y-4">
              <h3 className="text-[10px] uppercase tracking-[0.16em] text-[#7A9A6E] font-medium">Contour Filters</h3>
              <div className="flex flex-col gap-2">
                <label className="text-[11px] text-[#777C70]">District Zone</label>
                <select
                  value={filterDistrict}
                  onChange={(e) => setFilterDistrict(e.target.value)}
                  className="h-10 border border-[rgba(228,233,223,0.08)] rounded-[12px] bg-[#080C08] text-[#E4E9DF] text-xs font-light px-3 w-full outline-none focus:border-[#7A9A6E]"
                >
                  <option value="All Districts">All Districts</option>
                  <option value="Northern Sector">Northern Sector</option>
                  <option value="Eastern Valley">Eastern Valley</option>
                  <option value="Coastal Delta">Coastal Delta</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[11px] text-[#777C70]">Risk Level Filter</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setRiskFilter(riskFilter === 'high' ? 'all' : 'high')}
                    className={`flex-1 border rounded-[10px] h-9 text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors ${
                      riskFilter === 'high' ? 'bg-[#DC2626]/20 text-[#DC2626] border-[#DC2626]' : 'bg-[#080C08] border-[rgba(228,233,223,0.08)] text-[#777C70]'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]"></span> High
                  </button>
                  <button
                    onClick={() => setRiskFilter(riskFilter === 'med' ? 'all' : 'med')}
                    className={`flex-1 border rounded-[10px] h-9 text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors ${
                      riskFilter === 'med' ? 'bg-[#C1B99D]/20 text-[#C1B99D] border-[#C1B99D]' : 'bg-[#080C08] border-[rgba(228,233,223,0.08)] text-[#777C70]'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C1B99D]"></span> Med
                  </button>
                  <button
                    onClick={() => setRiskFilter(riskFilter === 'low' ? 'all' : 'low')}
                    className={`flex-1 border rounded-[10px] h-9 text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors ${
                      riskFilter === 'low' ? 'bg-[#7A9A6E]/20 text-[#7A9A6E] border-[#7A9A6E]' : 'bg-[#080C08] border-[rgba(228,233,223,0.08)] text-[#777C70]'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7A9A6E]"></span> Low
                  </button>
                </div>
              </div>
            </div>
          }
        />

        {/* Cartographic GIS Interactive Canvas Area */}
        <div className="flex-1 relative bg-[#060906] h-full overflow-hidden flex items-center justify-center">
          {/* Topographic Vector SVG Canvas (No Broken Image Links) */}
          <div className="absolute inset-0 opacity-25 pointer-events-none">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="gisGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#7A9A6E" strokeWidth="0.5" opacity="0.3" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#gisGrid)" />
              {/* Contour Elevation Bands */}
              <circle cx="45%" cy="35%" r="180" fill="none" stroke="#DC2626" strokeWidth="1" strokeDasharray="6 4" opacity="0.4" />
              <circle cx="45%" cy="35%" r="300" fill="none" stroke="#C1B99D" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
              <path d="M 50 150 Q 350 100 750 300 T 1350 250" fill="none" stroke="#86A978" strokeWidth="1.5" opacity="0.4" />
              <path d="M 100 450 Q 500 350 950 500 T 1550 400" fill="none" stroke="#7A9A6E" strokeWidth="1.5" opacity="0.3" />
            </svg>
          </div>

          {/* Scanline Radar Sweep */}
          <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#7A9A6E]/40 to-transparent animate-scanline"></div>
          </div>

          {/* Floating Control Toolbar */}
          <div className="absolute top-6 right-6 flex flex-col gap-2 z-20">
            <button className="w-10 h-10 bg-[#080C08] border border-[rgba(228,233,223,0.08)] rounded-[12px] flex items-center justify-center text-[#E4E9DF] hover:border-[rgba(122,154,110,0.3)] hover:scale-105 transition-all">
              <span className="material-symbols-outlined">add</span>
            </button>
            <button className="w-10 h-10 bg-[#080C08] border border-[rgba(228,233,223,0.08)] rounded-[12px] flex items-center justify-center text-[#E4E9DF] hover:border-[rgba(122,154,110,0.3)] hover:scale-105 transition-all">
              <span className="material-symbols-outlined">remove</span>
            </button>
            <button className="w-10 h-10 bg-[#080C08] border border-[rgba(228,233,223,0.08)] rounded-[12px] flex items-center justify-center text-[#86A978] hover:border-[rgba(122,154,110,0.3)] hover:scale-105 transition-all">
              <span className="material-symbols-outlined">layers</span>
            </button>
          </div>

          {/* Interactive Settlement Markers */}
          {filteredSettlements.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setSelectedSettlement(item);
                setDrawerOpen(true);
              }}
              style={{ top: item.top, left: item.left }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group z-20 focus:outline-none"
            >
              <div className="relative flex flex-col items-center">
                <div className="relative flex items-center justify-center w-8 h-8">
                  {item.risk === 'Critical' && (
                    <span className="absolute inset-0 rounded-full bg-[#DC2626] opacity-50 animate-ping"></span>
                  )}
                  <span
                    className={`relative w-4 h-4 rounded-full border-2 border-[#080C08] group-hover:scale-125 transition-transform ${
                      item.risk === 'Critical'
                        ? 'bg-[#DC2626] shadow-[0_0_12px_#DC2626]'
                        : item.risk === 'Warning'
                        ? 'bg-[#C1B99D]'
                        : 'bg-[#7A9A6E]'
                    }`}
                  ></span>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-[#0D120C]/95 border border-[rgba(228,233,223,0.12)] px-2.5 py-1 rounded-[8px] text-[10px] text-[#E4E9DF] whitespace-nowrap mt-1 shadow-lg pointer-events-none">
                  {item.name}
                </div>
              </div>
            </button>
          ))}

          {/* Details Drawer */}
          {drawerOpen && selectedSettlement && (
            <div className="absolute top-6 bottom-6 right-6 w-80 md:w-96 bg-[#0D120C]/95 border border-[rgba(122,154,110,0.2)] shadow-2xl rounded-[17px] flex flex-col z-30 backdrop-blur-md">
              {/* Drawer Header */}
              <div className="p-5 border-b border-[rgba(228,233,223,0.08)] flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-sans text-[10px] uppercase tracking-wider font-medium ${
                        selectedSettlement.risk === 'Critical'
                          ? 'bg-[#DC2626] text-white'
                          : selectedSettlement.risk === 'Warning'
                          ? 'bg-[#C1B99D] text-[#0A0E09]'
                          : 'bg-[#86A978] text-[#0A0E09]'
                      }`}
                    >
                      {selectedSettlement.risk}
                    </span>
                    <span className="text-xs text-[#777C70]">ID: {selectedSettlement.id}</span>
                  </div>
                  <h3 className="font-display font-light text-lg text-[#E4E9DF]">{selectedSettlement.name}</h3>
                </div>
                <button onClick={() => setDrawerOpen(false)} className="text-[#777C70] hover:text-[#E4E9DF] p-1">
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              {/* Drawer Body */}
              <div className="p-5 flex-1 overflow-y-auto space-y-5 font-sans text-xs font-light">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-[rgba(228,233,223,0.08)] rounded-[12px] p-3.5 bg-[#080C08]">
                    <p className="text-[10px] uppercase text-[#777C70] tracking-wider mb-1">Population</p>
                    <p className="font-display font-light text-lg text-[#E4E9DF]">{selectedSettlement.population.toLocaleString()}</p>
                  </div>
                  <div className="border border-[rgba(228,233,223,0.08)] rounded-[12px] p-3.5 bg-[#080C08]">
                    <p className="text-[10px] uppercase text-[#777C70] tracking-wider mb-1">Vuln. Score</p>
                    <p className="font-display font-light text-lg text-[#86A978]">{selectedSettlement.score}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-[rgba(228,233,223,0.06)]">
                    <span className="text-[11px] uppercase text-[#777C70]">Hazard Type</span>
                    <span className="text-[#E4E9DF]">{selectedSettlement.hazard}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-[rgba(228,233,223,0.06)]">
                    <span className="text-[11px] uppercase text-[#777C70]">Distance to Hazard</span>
                    <span className="text-[#E4E9DF]">{selectedSettlement.distance}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-[rgba(228,233,223,0.06)]">
                    <span className="text-[11px] uppercase text-[#777C70]">Evac Route Status</span>
                    <span className="text-[#C1B99D] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">warning</span> {selectedSettlement.routeStatus}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="bg-[#080C08] p-4 rounded-[12px] border border-[rgba(228,233,223,0.08)]">
                  <h4 className="text-[10px] uppercase text-[#777C70] tracking-wider mb-2">Relocation Progress</h4>
                  <div className="w-full bg-[#1D2A1B] rounded-full h-1.5 mb-2">
                    <div className="bg-[#7A9A6E] h-1.5 rounded-full" style={{ width: `${selectedSettlement.progress}%` }}></div>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#777C70]">In Transit</span>
                    <span className="text-[#86A978] font-medium">{selectedSettlement.progress}% Complete</span>
                  </div>
                </div>
              </div>

              {/* Drawer Footer Action */}
              <div className="p-4 border-t border-[rgba(228,233,223,0.08)] bg-[#080C08] rounded-b-[17px]">
                <Link
                  to="/evacuation-route"
                  className="w-full bg-[#6F9164] hover:bg-[#86A978] text-[#0A0E09] h-11 rounded-[12px] font-medium text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  Initiate Protocol
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
