import React, { useState } from 'react';
import DashboardSidebar from '../components/DashboardSidebar';

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
  });

  const [filterDistrict, setFilterDistrict] = useState('All Districts');
  const [riskFilter, setRiskFilter] = useState('all');

  return (
    <div className="flex-grow flex flex-col w-full h-[calc(100vh-96px)] bg-transparent relative overflow-hidden z-10">
      <div className="flex flex-1 overflow-hidden relative">
        {/* Common Combined Dashboard Sidebar */}
        <DashboardSidebar />

        {/* Cartographic Terrain Canvas Overlay */}
        <div className="flex-1 relative bg-[#060906]/60 backdrop-blur-xs h-full overflow-hidden">
          {/* Floating Map Filter Bar */}
          <div className="absolute top-6 left-6 z-20 flex items-center gap-3 bg-[#080C08]/90 border border-[rgba(228,233,223,0.12)] p-2.5 rounded-[14px] backdrop-blur-md shadow-[0_12px_32px_rgba(0,0,0,0.6)]">
            <select
              value={filterDistrict}
              onChange={(e) => setFilterDistrict(e.target.value)}
              className="h-8 border border-[rgba(228,233,223,0.08)] rounded-[10px] bg-[#0D120C] text-[#E4E9DF] text-xs font-light px-3 outline-none focus:border-[#7A9A6E]"
            >
              <option value="All Districts">All Districts</option>
              <option value="Northern Sector">Northern Sector</option>
              <option value="Eastern Valley">Eastern Valley</option>
              <option value="Coastal Delta">Coastal Delta</option>
            </select>

            <div className="flex items-center gap-1.5 border-l border-[rgba(228,233,223,0.08)] pl-3">
              <button
                onClick={() => setRiskFilter(riskFilter === 'high' ? 'all' : 'high')}
                className={`px-2.5 h-8 border rounded-[8px] text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                  riskFilter === 'high' ? 'bg-[#DC2626]/20 text-[#DC2626] border-[#DC2626]' : 'bg-[#0D120C] border-[rgba(228,233,223,0.08)] text-[#777C70]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]"></span> High
              </button>
              <button
                onClick={() => setRiskFilter(riskFilter === 'med' ? 'all' : 'med')}
                className={`px-2.5 h-8 border rounded-[8px] text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                  riskFilter === 'med' ? 'bg-[#C1B99D]/20 text-[#C1B99D] border-[#C1B99D]' : 'bg-[#0D120C] border-[rgba(228,233,223,0.08)] text-[#777C70]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#C1B99D]"></span> Med
              </button>
              <button
                onClick={() => setRiskFilter(riskFilter === 'low' ? 'all' : 'low')}
                className={`px-2.5 h-8 border rounded-[8px] text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                  riskFilter === 'low' ? 'bg-[#7A9A6E]/20 text-[#7A9A6E] border-[#7A9A6E]' : 'bg-[#0D120C] border-[rgba(228,233,223,0.08)] text-[#777C70]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#7A9A6E]"></span> Low
              </button>
            </div>
          </div>
          <img
            className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-35"
            alt="Cartographic GIS Satellite Terrain Map"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBU2kMUKkTMLoTvz4XMsUjSNSWN1pAPFzvFNees9nE-H6J4cHlYpSgzUofZP5x_PLB_SJRJ63wf4h_YkA3NqmlB2GtIf0u5yA7naskGhiejaPUFTfM-D2EIvVDTQ251y0IrZTt3xh5Ahcb6_zOdKrUdNEJfU-XyLza1lsqIU9Da0XdntFw3uLEpOuFrNtmuAkP7P9hLg8NIsNVVT1sOt5oVE3O751RQ5JHi2_MnXsUhchckuydWi_Ra"
          />

          {/* Cartographic Scanline & Radar Overlay */}
          <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#7A9A6E]/30 to-transparent animate-scanline"></div>
          </div>

          {/* Floating Map Controls */}
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

          {/* Map Marker 1 - Oakhaven Critical */}
          <button
            onClick={() => {
              setSelectedSettlement({
                id: 'S-9921',
                name: 'Oakhaven Terrain Sector',
                risk: 'Critical',
                population: 1452,
                score: '94 / 100',
                hazard: 'Terrain Mudslide',
                distance: '0.4 km',
                routeStatus: 'Compromised',
                progress: 35,
              });
              setDrawerOpen(true);
            }}
            className="absolute top-[30%] left-[45%] -translate-x-1/2 -translate-y-1/2 group z-20"
          >
            <div className="relative flex items-center justify-center w-8 h-8">
              <span className="absolute inset-0 rounded-full bg-[#DC2626] opacity-50 animate-ping"></span>
              <span className="relative w-4 h-4 rounded-full bg-[#DC2626] border-2 border-[#080C08] group-hover:scale-125 transition-transform shadow-[0_0_12px_#DC2626]"></span>
            </div>
          </button>

          {/* Map Marker 2 - Pine Ridge Warning */}
          <button
            onClick={() => {
              setSelectedSettlement({
                id: 'S-8810',
                name: 'Pine Ridge Habitation',
                risk: 'Warning',
                population: 850,
                score: '68 / 100',
                hazard: 'Flash Flood',
                distance: '1.2 km',
                routeStatus: 'Clear',
                progress: 60,
              });
              setDrawerOpen(true);
            }}
            className="absolute top-[60%] left-[65%] -translate-x-1/2 -translate-y-1/2 group z-20"
          >
            <div className="relative flex items-center justify-center w-6 h-6 hover:scale-125 transition-transform">
              <span className="relative w-3.5 h-3.5 rounded-full bg-[#C1B99D] border-2 border-[#080C08]"></span>
            </div>
          </button>

          {/* Map Marker 3 - Riverbend Safe */}
          <button
            onClick={() => {
              setSelectedSettlement({
                id: 'S-4402',
                name: 'Riverbend Shelter Area',
                risk: 'Safe',
                population: 3200,
                score: '15 / 100',
                hazard: 'Low Risk',
                distance: '4.8 km',
                routeStatus: 'Optimal',
                progress: 90,
              });
              setDrawerOpen(true);
            }}
            className="absolute top-[40%] left-[25%] -translate-x-1/2 -translate-y-1/2 group z-20"
          >
            <div className="relative flex items-center justify-center w-6 h-6 hover:scale-125 transition-transform">
              <span className="relative w-3.5 h-3.5 rounded-full bg-[#7A9A6E] border-2 border-[#080C08]"></span>
            </div>
          </button>

          {/* Contextual Details Drawer */}
          {drawerOpen && (
            <div className="absolute top-6 bottom-6 right-6 w-80 md:w-96 bg-[#0D120C]/95 border border-[rgba(122,154,110,0.2)] shadow-2xl rounded-[17px] flex flex-col z-30 backdrop-blur-md">
              {/* Header */}
              <div className="p-5 border-b border-[rgba(228,233,223,0.08)] flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-sans text-[10px] uppercase tracking-wider font-medium text-[#0A0E09] ${
                        selectedSettlement.risk === 'Critical'
                          ? 'bg-[#DC2626] text-white'
                          : selectedSettlement.risk === 'Warning'
                          ? 'bg-[#C1B99D]'
                          : 'bg-[#86A978]'
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

              {/* Drawer Content */}
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

                {/* Specs */}
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

              {/* Action */}
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
