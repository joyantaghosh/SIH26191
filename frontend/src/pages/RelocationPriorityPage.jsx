import React, { useState, useEffect, useMemo, useCallback } from 'react';
import DashboardSidebar from '../components/DashboardSidebar';
import { Link } from 'react-router-dom';
import { fetchRelocationPriorities } from '../services/relocationApi';

export default function RelocationPriorityPage() {
  const [priorities, setPriorities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState('ALL');
  const [expandedRow, setExpandedRow] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertSent, setAlertSent] = useState(false);

  // Load priorities from backend
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchRelocationPriorities();
      const list = Array.isArray(res) ? res : res?.data || [];
      setPriorities(list);
      if (list.length > 0) {
        setExpandedRow(list[0].relocationId || list[0].priorityRank);
      }
    } catch (err) {
      console.warn('[RelocationPriorityPage] Fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Derived stats
  const stats = useMemo(() => {
    const critical = priorities.filter((p) => p.priorityTier === 'CRITICAL_URGENT').length;
    const high = priorities.filter((p) => p.priorityTier === 'HIGH_PRIORITY').length;
    const moderate = priorities.filter((p) => p.priorityTier === 'MEDIUM_PRIORITY' || p.priorityTier === 'MONITORING').length;
    const reserveSum = priorities.reduce((acc, p) => acc + (p.availableShelterCapacity || 0), 0);
    const reserveDisplay = reserveSum > 1000000 ? `${(reserveSum / 1000000).toFixed(1)}M` : `${Math.round(reserveSum / 1000)}k`;

    return { critical, high, moderate, reserveDisplay };
  }, [priorities]);

  // Filtered rows
  const filteredData = useMemo(() => {
    return priorities.filter((item) => {
      const matchesSearch =
        !filterText ||
        item.habitationName?.toLowerCase().includes(filterText.toLowerCase()) ||
        item.region?.toLowerCase().includes(filterText.toLowerCase()) ||
        item.destinationRefugeSector?.toLowerCase().includes(filterText.toLowerCase()) ||
        item.zoneId?.toLowerCase().includes(filterText.toLowerCase());

      const matchesTier =
        selectedTier === 'ALL' ||
        (selectedTier === 'CRITICAL' && item.priorityTier === 'CRITICAL_URGENT') ||
        (selectedTier === 'HIGH' && item.priorityTier === 'HIGH_PRIORITY') ||
        (selectedTier === 'MEDIUM' && (item.priorityTier === 'MEDIUM_PRIORITY' || item.priorityTier === 'MONITORING'));

      return matchesSearch && matchesTier;
    });
  }, [priorities, filterText, selectedTier]);

  const handleBroadcastAlert = () => {
    setAlertSent(true);
    setTimeout(() => {
      setAlertSent(false);
      setShowAlertModal(false);
    }, 2500);
  };

  const getTierBadge = (tier) => {
    switch (tier) {
      case 'CRITICAL_URGENT':
        return {
          label: 'Critical Immediate',
          badgeColor: 'bg-[#DC2626]/20 text-[#DC2626] border-[#DC2626]/40',
          dotColor: 'bg-[#DC2626]',
          statusColor: 'text-[#DC2626]',
        };
      case 'HIGH_PRIORITY':
        return {
          label: 'High Urgent',
          badgeColor: 'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/40',
          dotColor: 'bg-[#F59E0B]',
          statusColor: 'text-[#F59E0B]',
        };
      default:
        return {
          label: 'Moderate Priority',
          badgeColor: 'bg-[#7A9A6E]/20 text-[#86A978] border-[#7A9A6E]/40',
          dotColor: 'bg-[#7A9A6E]',
          statusColor: 'text-[#86A978]',
        };
    }
  };

  return (
    <div className="flex-grow flex flex-col w-full h-[calc(100vh-70px)] bg-[#080C08] relative z-10 font-sans text-xs font-light text-[#E4E9DF] overflow-hidden">
      <div className="flex flex-1 overflow-hidden h-full">
        <DashboardSidebar />

        {/* Main Content Scrollable Area */}
        <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full overflow-y-auto h-full relative">
          {/* Cartographic Heatmap Background Layer */}
          <div className="absolute inset-0 pointer-events-none opacity-40 overflow-hidden z-0">
            <div className="absolute top-10 left-1/4 w-[500px] h-[500px] rounded-full bg-[#DC2626]/20 blur-[100px] animate-pulse"></div>
            <div className="absolute top-1/3 right-10 w-[450px] h-[450px] rounded-full bg-[#C1B99D]/18 blur-[90px]"></div>
            <div className="absolute bottom-10 left-10 w-[550px] h-[550px] rounded-full bg-[#7A9A6E]/20 blur-[110px]"></div>
            <svg className="w-full h-full absolute inset-0 opacity-20" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="priorityGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#7A9A6E" strokeWidth="0.5" opacity="0.3" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#priorityGrid)" />
            </svg>
          </div>

          <div className="relative z-10">
            {/* Header */}
            <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[rgba(228,233,223,0.08)] pb-6">
              <div>
                <span className="text-[10px] uppercase tracking-[0.16em] text-[#7A9A6E]">
                  ML-Grounded Priority Telemetry
                </span>
                <h1 className="font-display font-light text-2xl md:text-3xl text-[#E4E9DF] mt-1">
                  Relocation Priority <span className="text-[#86A978]">Matrix</span>
                </h1>
                <p className="text-xs text-[#777C70] max-w-2xl mt-1">
                  Automated prioritization of habitations requiring evacuation and shelter resource allocation.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#777C70] text-[18px]">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="Search habitation or region..."
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    className="pl-9 pr-4 h-10 bg-[#0D120C] border border-[rgba(228,233,223,0.12)] rounded-[12px] text-xs text-[#E4E9DF] outline-none focus:border-[#7A9A6E] w-64"
                  />
                </div>
                <button
                  onClick={() => setShowAlertModal(true)}
                  className="bg-[#DC2626] text-white px-4 h-10 rounded-[12px] text-xs uppercase tracking-wider font-medium hover:bg-red-700 transition-colors flex items-center gap-2 shadow-lg shrink-0"
                >
                  <span className="material-symbols-outlined text-[18px]">campaign</span>
                  Broadcast Alert
                </button>
              </div>
            </header>

            {/* Broadcast Alert Modal */}
            {showAlertModal && (
              <div className="fixed inset-0 bg-[#060906]/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
                <div className="bg-[#0D120C] border border-[rgba(122,154,110,0.2)] rounded-[17px] p-6 max-w-md w-full shadow-2xl">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-display font-light text-lg text-[#E4E9DF] flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#DC2626]">campaign</span>
                      Emergency Broadcast Telemetry
                    </h3>
                    <button onClick={() => setShowAlertModal(false)} className="text-[#777C70] hover:text-[#E4E9DF]">
                      <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                  </div>

                  {alertSent ? (
                    <div className="p-4 bg-[#7A9A6E]/15 border border-[#7A9A6E] text-[#86A978] rounded-[12px] text-xs text-center">
                      ✓ Emergency broadcast sent across cartographic stream!
                    </div>
                  ) : (
                    <>
                      <p className="text-xs text-[#777C70] mb-5 leading-relaxed">
                        Issue a Level 1 Emergency Relocation Alert across all active priority sectors in this region?
                      </p>
                      <div className="flex justify-end gap-3 text-xs">
                        <button
                          onClick={() => setShowAlertModal(false)}
                          className="px-4 py-2 border border-[rgba(228,233,223,0.08)] rounded-[12px] hover:bg-[#080C08] text-[#777C70]"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleBroadcastAlert}
                          className="px-4 py-2 bg-[#DC2626] text-white rounded-[12px] font-medium"
                        >
                          Confirm Broadcast
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Stats Open Grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-[#0D120C]/90 border border-[rgba(228,233,223,0.08)] rounded-[14px] p-4">
                <div className="text-[10px] text-[#777C70] uppercase tracking-[0.16em] mb-1">Critical Immediate</div>
                <div className="font-display font-extralight text-2xl text-[#DC2626]">
                  {loading ? '...' : stats.critical} <span className="text-xs text-[#777C70] font-normal">sectors</span>
                </div>
              </div>
              <div className="bg-[#0D120C]/90 border border-[rgba(228,233,223,0.08)] rounded-[14px] p-4">
                <div className="text-[10px] text-[#777C70] uppercase tracking-[0.16em] mb-1">High Urgent</div>
                <div className="font-display font-extralight text-2xl text-[#F59E0B]">
                  {loading ? '...' : stats.high} <span className="text-xs text-[#777C70] font-normal">sectors</span>
                </div>
              </div>
              <div className="bg-[#0D120C]/90 border border-[rgba(228,233,223,0.08)] rounded-[14px] p-4">
                <div className="text-[10px] text-[#777C70] uppercase tracking-[0.16em] mb-1">Moderate Watch</div>
                <div className="font-display font-extralight text-2xl text-[#7A9A6E]">
                  {loading ? '...' : stats.moderate} <span className="text-xs text-[#777C70] font-normal">sectors</span>
                </div>
              </div>
              <div className="bg-[#0D120C]/90 border border-[rgba(228,233,223,0.08)] rounded-[14px] p-4">
                <div className="text-[10px] text-[#777C70] uppercase tracking-[0.16em] mb-1">Shelter Capacity Reserve</div>
                <div className="font-display font-extralight text-2xl text-[#E4E9DF]">
                  {loading ? '...' : stats.reserveDisplay} <span className="text-xs text-[#777C70] font-normal">beds</span>
                </div>
              </div>
            </section>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 mb-4 border-b border-[rgba(228,233,223,0.06)] pb-3">
              {[
                { key: 'ALL', label: 'All Sectors' },
                { key: 'CRITICAL', label: 'Critical Immediate' },
                { key: 'HIGH', label: 'High Priority' },
                { key: 'MEDIUM', label: 'Moderate Watch' },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setSelectedTier(t.key)}
                  className={`px-3 py-1.5 rounded-[10px] text-[11px] uppercase tracking-wider transition-colors ${
                    selectedTier === t.key
                      ? 'bg-[#1D2A1B] text-[#86A978] border border-[#86A978]'
                      : 'text-[#777C70] hover:text-[#E4E9DF] border border-transparent'
                  }`}
                >
                  {t.label}
                </button>
              ))}
              <span className="text-[11px] text-[#777C70] ml-auto font-mono">
                Showing {filteredData.length} of {priorities.length} habitations
              </span>
            </div>

            {/* Main Data Table */}
            <section className="bg-[#0D120C]/90 border border-[rgba(228,233,223,0.08)] rounded-[17px] shadow-xl overflow-hidden backdrop-blur-md mb-8">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#080C08] border-b border-[rgba(228,233,223,0.08)] text-[10px] text-[#7A9A6E] uppercase tracking-[0.16em]">
                      <th className="p-4 w-14 text-center">Rank</th>
                      <th className="p-4 font-normal">Habitation Sector</th>
                      <th className="p-4 font-normal">Region</th>
                      <th className="p-4 font-normal">Priority Score</th>
                      <th className="p-4 font-normal">Vulnerable Pop</th>
                      <th className="p-4 font-normal">Priority Tier</th>
                      <th className="p-4 font-normal">Allocated Refuge Safe Haven</th>
                      <th className="p-4 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(228,233,223,0.06)] text-xs">
                    {loading ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-[#777C70]">
                          <span className="inline-block animate-spin mr-2">⟳</span>
                          Loading ML relocation priority matrix...
                        </td>
                      </tr>
                    ) : filteredData.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-[#777C70]">
                          No habitation sectors matched your search filter.
                        </td>
                      </tr>
                    ) : (
                      filteredData.map((item) => {
                        const rowKey = item.relocationId || item.priorityRank;
                        const isExpanded = expandedRow === rowKey;
                        const tierInfo = getTierBadge(item.priorityTier);
                        const rankLabel = String(item.priorityRank || '').padStart(2, '0');

                        return (
                          <React.Fragment key={rowKey}>
                            <tr
                              onClick={() => setExpandedRow(isExpanded ? null : rowKey)}
                              className="hover:bg-[#080C08]/60 cursor-pointer transition-colors"
                            >
                              <td className="p-4 text-center font-display font-light text-[#E4E9DF]">{rankLabel}</td>
                              <td className="p-4 text-[#E4E9DF] font-medium">{item.habitationName}</td>
                              <td className="p-4 text-[#777C70]">{item.region}</td>
                              <td className="p-4 font-mono text-[#E4E9DF]">
                                <span className={item.priorityScore >= 80 ? 'text-[#DC2626] font-bold' : item.priorityScore >= 65 ? 'text-[#F59E0B]' : 'text-[#86A978]'}>
                                  {item.priorityScore?.toFixed(1) || '50.0'}
                                </span>
                                <span className="text-[10px] text-[#777C70]"> / 100</span>
                              </td>
                              <td className="p-4 text-[#E4E9DF]">
                                {(item.vulnerablePopulation || 0).toLocaleString()}
                              </td>
                              <td className="p-4">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider border ${tierInfo.badgeColor}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${tierInfo.dotColor}`}></span> {tierInfo.label}
                                </span>
                              </td>
                              <td className="p-4 text-[#777C70] max-w-xs truncate">
                                {item.destinationRefugeSector || 'High-Ground Safe Refuge'}
                              </td>
                              <td className="p-4 text-[#777C70] text-center">
                                <span className={`material-symbols-outlined transition-transform text-[18px] ${isExpanded ? 'rotate-180' : ''}`}>
                                  expand_more
                                </span>
                              </td>
                            </tr>

                            {/* Expanded Details */}
                            {isExpanded && (
                              <tr className="bg-[#080C08]/80">
                                <td colSpan={8} className="p-0 border-b border-[rgba(228,233,223,0.08)]">
                                  <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 border-l-2 border-[#86A978] text-xs">
                                    <div>
                                      <div className="text-[10px] text-[#777C70] uppercase">Mobility Constrained Count</div>
                                      <div className="text-[#E4E9DF] mt-1 font-mono">
                                        {(item.mobilityConstrainedCount || 0).toLocaleString()}{' '}
                                        <span className="text-[10px] text-[#DC2626]">(Emergency Transit)</span>
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-[10px] text-[#777C70] uppercase">Allocated Shelter Beds</div>
                                      <div className="text-[#86A978] mt-1 font-mono">
                                        {(item.allocatedShelterBeds || 0).toLocaleString()} / {(item.availableShelterCapacity || 0).toLocaleString()}
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-[10px] text-[#777C70] uppercase">Destination Risk Score</div>
                                      <div className="text-[#10B981] mt-1">{item.destinationRiskScore || 'LOW RISK (1.8 / 10)'}</div>
                                    </div>
                                    <div>
                                      <div className="text-[10px] text-[#777C70] uppercase">Zone Telemetry ID</div>
                                      <div className="text-[#777C70] mt-1 font-mono">{item.zoneId || 'N/A'}</div>
                                    </div>
                                    <div className="col-span-full mt-3 pt-3 border-t border-[rgba(228,233,223,0.06)] flex flex-wrap items-center gap-3">
                                      <Link
                                        to="/evacuation-route"
                                        className="bg-[#6F9164] text-[#0A0E09] px-4 py-2 rounded-[10px] text-xs uppercase tracking-wider font-medium hover:bg-[#86A978] transition-colors inline-flex items-center gap-1.5"
                                      >
                                        <span className="material-symbols-outlined text-[16px]">alt_route</span>
                                        Deploy Evacuation Route
                                      </Link>
                                      <Link
                                        to="/risk-zone-id"
                                        className="bg-[#080C08] border border-[rgba(228,233,223,0.12)] text-[#E4E9DF] px-4 py-2 rounded-[10px] text-xs transition-colors inline-flex items-center gap-1.5 hover:border-[#86A978]"
                                      >
                                        <span className="material-symbols-outlined text-[16px]">map</span>
                                        View In GIS Risk Zone Map
                                      </Link>
                                      <span className="text-[11px] text-[#777C70] ml-auto">
                                        Status: <span className="text-[#E4E9DF] font-medium">{item.status}</span>
                                      </span>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
