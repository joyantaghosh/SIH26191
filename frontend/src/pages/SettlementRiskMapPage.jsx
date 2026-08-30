import React, { useState, useEffect, useCallback } from 'react';
import DashboardSidebar from '../components/DashboardSidebar';
import { Link } from 'react-router-dom';
import { fetchSettlements, fetchSettlementStats } from '../services/settlementApi';

export default function SettlementRiskMapPage() {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [settlements, setSettlements] = useState([]);
  const [districts, setDistricts] = useState(['All Districts']);
  const [selectedSettlement, setSelectedSettlement] = useState(null);
  const [stats, setStats] = useState(null);
  const [filterDistrict, setFilterDistrict] = useState('All Districts');
  const [riskFilter, setRiskFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // 1. Fetch settlements from backend API
  const loadData = useCallback(async () => {
    try {
      const params = {};
      if (filterDistrict !== 'All Districts') params.district = filterDistrict;
      if (riskFilter !== 'all') params.riskLevel = riskFilter;

      const [res, statsRes] = await Promise.all([
        fetchSettlements(params),
        fetchSettlementStats().catch(() => null),
      ]);

      const list = res.settlements || [];
      setSettlements(list);
      if (res.districts) setDistricts(res.districts);
      if (statsRes) setStats(statsRes);

      if (list.length > 0 && !selectedSettlement) {
        setSelectedSettlement(list[0]);
      }
    } catch (err) {
      console.warn('[SettlementRiskMapPage] Fetch failed:', err.message);
    } finally {
      setLoading(false);
    }
  }, [filterDistrict, riskFilter, selectedSettlement]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getRiskBadge = (risk) => {
    const r = String(risk || '').toLowerCase();
    if (r === 'critical') return { color: '#EF4444', bg: 'bg-[#EF4444]/20 border-[#EF4444]/40 text-[#EF4444]' };
    if (r === 'warning') return { color: '#F59E0B', bg: 'bg-[#F59E0B]/20 border-[#F59E0B]/40 text-[#F59E0B]' };
    return { color: '#10B981', bg: 'bg-[#10B981]/20 border-[#10B981]/40 text-[#10B981]' };
  };

  return (
    <div className="flex-grow flex flex-col w-full h-[calc(100vh-70px)] bg-[#080C08] relative overflow-hidden z-10 font-sans text-xs font-light text-[#E4E9DF]">
      <div className="flex flex-1 overflow-hidden h-full">
        <DashboardSidebar
          extraContent={
            <div className="space-y-4 font-mono">
              <h3 className="text-[10px] uppercase tracking-[0.16em] text-[#7A9A6E] font-medium">Contour Filters</h3>
              <div className="flex flex-col gap-2">
                <label className="text-[11px] text-[#777C70]">District Zone</label>
                <select
                  value={filterDistrict}
                  onChange={(e) => setFilterDistrict(e.target.value)}
                  className="h-10 border border-[rgba(122,154,110,0.3)] rounded-[12px] bg-[#080C08] text-[#E4E9DF] text-xs px-3 w-full outline-none focus:border-[#86A978]"
                >
                  {districts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] text-[#777C70]">Risk Level Filter</label>
                <div className="flex gap-2">
                  {[
                    { key: 'all', label: 'All', color: '#86A978' },
                    { key: 'critical', label: 'Critical', color: '#EF4444' },
                    { key: 'warning', label: 'Warn', color: '#F59E0B' },
                    { key: 'safe', label: 'Safe', color: '#10B981' },
                  ].map((lvl) => (
                    <button
                      key={lvl.key}
                      onClick={() => setRiskFilter(lvl.key)}
                      className={`flex-1 border rounded-[10px] h-8 text-[10px] uppercase tracking-wider flex items-center justify-center gap-1 transition-colors ${
                        riskFilter === lvl.key
                          ? 'bg-[#1D2A1B] text-[#86A978] border-[#86A978]'
                          : 'bg-[#080C08] border-[rgba(228,233,223,0.08)] text-[#777C70]'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: lvl.color }}></span>
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

              {stats && (
                <div className="pt-3 border-t border-[rgba(228,233,223,0.06)] text-[10px] text-[#777C70] space-y-1">
                  <div className="flex justify-between">
                    <span>Total Monitored:</span>
                    <strong className="text-[#E4E9DF]">{stats.totalSettlements}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Critical Habitations:</span>
                    <strong className="text-[#EF4444]">{stats.criticalCount}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Population at Risk:</span>
                    <strong className="text-[#86A978]">{stats.totalPopulation.toLocaleString()}</strong>
                  </div>
                </div>
              )}
            </div>
          }
        />

        {/* Main Interactive Map & Details Area */}
        <main className="flex-1 relative flex overflow-hidden h-full">
          {/* Map Surface Background Canvas */}
          <div className="flex-1 relative bg-[#060906] overflow-hidden">
            {/* Ambient Map Grids & Topographic Lines */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#7A9A6E_1px,transparent_1px)] [background-size:24px_24px]"></div>

            {/* Settlement Geographic Nodes */}
            <div className="absolute inset-0 p-8">
              {settlements.map((s) => {
                const isSelected = selectedSettlement?.settlementId === s.settlementId;
                const badge = getRiskBadge(s.riskLevel);

                return (
                  <div
                    key={s.settlementId}
                    onClick={() => {
                      setSelectedSettlement(s);
                      setDrawerOpen(true);
                    }}
                    style={{ top: s.mapPlacement?.top || '40%', left: s.mapPlacement?.left || '40%' }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-all duration-300 z-20`}
                  >
                    {/* Pulsing Danger Wave */}
                    <div
                      className="absolute inset-0 rounded-full animate-ping opacity-30 pointer-events-none"
                      style={{ backgroundColor: badge.color }}
                    ></div>

                    {/* Node Pin Marker */}
                    <div
                      className={`px-3 py-1.5 rounded-full font-mono text-[11px] font-medium flex items-center gap-2 shadow-2xl transition-all ${
                        isSelected
                          ? 'ring-2 ring-[#86A978] scale-110 bg-[#0D120C] text-[#E4E9DF]'
                          : 'bg-[#0D120C]/90 text-[#B0B5A8] hover:scale-105'
                      }`}
                      style={{ border: `1px solid ${badge.color}` }}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: badge.color }}></span>
                      <span>{s.name}</span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${badge.bg}`}>
                        {s.riskLevel}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Status Ribbon */}
            <div className="absolute bottom-6 left-6 z-10 bg-[#0D120C]/90 border border-[rgba(122,154,110,0.3)] rounded-[14px] p-4 backdrop-blur-md font-mono text-xs max-w-md">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#86A978] animate-pulse"></span>
                <span className="text-[#86A978] uppercase text-[10px] tracking-wider">Cartographic Stream</span>
              </div>
              <p className="text-[#777C70] text-[11px] font-sans">
                Real-time slope vulnerability telemetry active across {settlements.length} settlement sectors.
              </p>
            </div>
          </div>

          {/* Right GIS Telemetry Inspector Drawer */}
          {drawerOpen && selectedSettlement && (
            <div className="w-full md:w-[380px] bg-[#0D120C]/95 border-l border-[rgba(228,233,223,0.08)] p-6 z-30 flex flex-col justify-between overflow-y-auto backdrop-blur-md">
              <div>
                <div className="flex justify-between items-start mb-4 border-b border-[rgba(228,233,223,0.06)] pb-3">
                  <div>
                    <span className="font-mono text-[10px] text-[#86A978] bg-[#1D2A1B] px-2 py-0.5 rounded border border-[rgba(122,154,110,0.2)]">
                      {selectedSettlement.settlementId}
                    </span>
                    <h2 className="font-display font-medium text-lg text-[#E4E9DF] mt-1.5">
                      {selectedSettlement.name}
                    </h2>
                    <span className="text-[#777C70] text-[11px]">{selectedSettlement.district}</span>
                  </div>

                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="p-1 rounded text-[#777C70] hover:text-[#E4E9DF]"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="bg-[#080C08] p-3.5 rounded-[12px] border border-[rgba(228,233,223,0.06)] flex justify-between items-center">
                    <span className="text-[#777C70]">Vulnerability Score:</span>
                    <span className="text-sm font-bold text-[#EF4444]">
                      {selectedSettlement.vulnerabilityScore} / 100
                    </span>
                  </div>

                  <div className="bg-[#080C08] p-3.5 rounded-[12px] border border-[rgba(228,233,223,0.06)] flex justify-between items-center">
                    <span className="text-[#777C70]">Population:</span>
                    <span className="text-sm font-medium text-[#E4E9DF]">
                      {selectedSettlement.population?.toLocaleString()}
                    </span>
                  </div>

                  <div className="bg-[#080C08] p-3.5 rounded-[12px] border border-[rgba(228,233,223,0.06)] flex justify-between items-center">
                    <span className="text-[#777C70]">Primary Hazard:</span>
                    <span className="text-[#86A978]">{selectedSettlement.hazardType}</span>
                  </div>

                  <div className="bg-[#080C08] p-3.5 rounded-[12px] border border-[rgba(228,233,223,0.06)] flex justify-between items-center">
                    <span className="text-[#777C70]">Evacuation Route:</span>
                    <span
                      className={`font-semibold ${
                        selectedSettlement.routeStatus === 'Compromised' || selectedSettlement.routeStatus === 'Blocked'
                          ? 'text-[#EF4444]'
                          : 'text-[#10B981]'
                      }`}
                    >
                      {selectedSettlement.routeStatus}
                    </span>
                  </div>
                </div>

                {/* Evacuation Readiness Progress */}
                <div className="mt-5 p-4 bg-[#080C08] border border-[rgba(228,233,223,0.06)] rounded-[14px]">
                  <div className="flex justify-between text-xs font-mono mb-2">
                    <span className="text-[#777C70]">Evacuation Readiness</span>
                    <span className="text-[#86A978] font-bold">{selectedSettlement.progress}%</span>
                  </div>
                  <div className="w-full bg-[#1D2A1B] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#7A9A6E] h-full transition-all duration-500"
                      style={{ width: `${selectedSettlement.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 mt-6 border-t border-[rgba(228,233,223,0.06)] space-y-2">
                <Link
                  to="/evacuation-route"
                  className="w-full h-10 bg-[#6F9164] hover:bg-[#86A978] text-[#080C08] font-mono text-xs font-semibold uppercase tracking-wider rounded-[12px] transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <span className="material-symbols-outlined text-[16px]">alt_route</span>
                  Route Evacuation
                </Link>

                <Link
                  to="/risk-alerts"
                  className="w-full h-10 bg-[#080C08] hover:bg-[#1D2A1B] text-[#B0B5A8] border border-[rgba(122,154,110,0.3)] font-mono text-xs rounded-[12px] transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#EF4444]">campaign</span>
                  Dispatch Alert
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
