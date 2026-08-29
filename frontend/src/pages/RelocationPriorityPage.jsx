import React, { useState } from 'react';
import DashboardSidebar from '../components/DashboardSidebar';
import { Link } from 'react-router-dom';

export default function RelocationPriorityPage() {
  const [expandedRow, setExpandedRow] = useState('01');
  const [filterText, setFilterText] = useState('');
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertSent, setAlertSent] = useState(false);

  const priorityData = [
    {
      rank: '01',
      name: 'Oakhaven Sector (Valley Delta)',
      severity: 'Critical',
      vuln: 'High',
      timeToImpact: '2 hrs',
      status: 'RED Immediate',
      badgeColor: 'bg-[#DC2626]/20 text-[#DC2626] border-[#DC2626]/40',
      dotColor: 'bg-[#DC2626]',
      pop: '1,240 (High)',
      infra: 'Compromised (Level 3)',
      routes: 'Route Alpha Blocked',
      routeColor: 'text-[#DC2626]',
    },
    {
      rank: '02',
      name: 'Pine Ridge (Coastal Ridge)',
      severity: 'High',
      vuln: 'High',
      timeToImpact: '5 hrs',
      status: 'RED Urgent',
      badgeColor: 'bg-[#C1B99D]/20 text-[#C1B99D] border-[#C1B99D]/40',
      dotColor: 'bg-[#C1B99D]',
      pop: '850 (Medium)',
      infra: 'Vulnerable (Level 2)',
      routes: 'Route Beta Congested',
      routeColor: 'text-[#C1B99D]',
    },
    {
      rank: '03',
      name: 'Highland Slope West',
      severity: 'High',
      vuln: 'Medium',
      timeToImpact: '1 day',
      status: 'AMBER High',
      badgeColor: 'bg-[#C1B99D]/20 text-[#C1B99D] border-[#C1B99D]/40',
      dotColor: 'bg-[#C1B99D]',
      pop: '420 (Low)',
      infra: 'Stable (Level 1)',
      routes: 'Route Gamma Clear',
      routeColor: 'text-[#E4E9DF]',
    },
    {
      rank: '04',
      name: 'Basin Refuge South',
      severity: 'Medium',
      vuln: 'Low',
      timeToImpact: '3 days',
      status: 'GREEN Nominal',
      badgeColor: 'bg-[#7A9A6E]/20 text-[#86A978] border-[#7A9A6E]/40',
      dotColor: 'bg-[#7A9A6E]',
      pop: '1,100 (High)',
      infra: 'Stable (Level 0)',
      routes: 'All Routes Clear',
      routeColor: 'text-[#86A978]',
    },
  ];

  const filteredData = priorityData.filter((item) =>
    item.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const handleBroadcastAlert = () => {
    setAlertSent(true);
    setTimeout(() => {
      setAlertSent(false);
      setShowAlertModal(false);
    }, 2500);
  };

  return (
    <div className="flex-grow flex flex-col w-full min-h-[calc(100vh-70px)] bg-transparent relative z-10 font-sans text-xs font-light text-[#E4E9DF]">
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
              <span className="text-[10px] uppercase tracking-[0.16em] text-[#7A9A6E]">Geospatial Priority Index</span>
              <h2 className="font-display font-extralight text-3xl md:text-4xl text-[#E4E9DF] mt-1">Relocation Priority Matrix</h2>
              <p className="text-sm text-[#777C70] max-w-2xl mt-1">
                Real-time ordering of habitations requiring immediate evacuation calculated from contour telemetry.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#777C70] text-[18px]">search</span>
                <input
                  type="text"
                  placeholder="Filter habitation..."
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  className="pl-9 pr-4 h-11 bg-[#080C08] border border-[rgba(228,233,223,0.08)] rounded-[12px] text-xs text-[#E4E9DF] outline-none focus:border-[#7A9A6E]"
                />
              </div>
              <button
                onClick={() => setShowAlertModal(true)}
                className="bg-[#DC2626] text-white px-5 h-11 rounded-[14px] text-xs uppercase tracking-wider font-medium hover:bg-red-700 transition-colors flex items-center gap-2 shadow-lg shrink-0"
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
                      Issue a Level 1 Emergency Alert across all active priority sectors?
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
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-[#0D120C]/90 border border-[rgba(228,233,223,0.08)] rounded-[17px] p-5">
              <div className="text-[10px] text-[#777C70] uppercase tracking-[0.16em] mb-1">Critical Immediate</div>
              <div className="font-display font-extralight text-3xl text-[#DC2626]">
                12 <span className="text-xs text-[#777C70] font-normal">sectors</span>
              </div>
            </div>
            <div className="bg-[#0D120C]/90 border border-[rgba(228,233,223,0.08)] rounded-[17px] p-5">
              <div className="text-[10px] text-[#777C70] uppercase tracking-[0.16em] mb-1">High Urgent</div>
              <div className="font-display font-extralight text-3xl text-[#C1B99D]">
                24 <span className="text-xs text-[#777C70] font-normal">sectors</span>
              </div>
            </div>
            <div className="bg-[#0D120C]/90 border border-[rgba(228,233,223,0.08)] rounded-[17px] p-5">
              <div className="text-[10px] text-[#777C70] uppercase tracking-[0.16em] mb-1">Moderate Watch</div>
              <div className="font-display font-extralight text-3xl text-[#7A9A6E]">
                48 <span className="text-xs text-[#777C70] font-normal">sectors</span>
              </div>
            </div>
            <div className="bg-[#0D120C]/90 border border-[rgba(228,233,223,0.08)] rounded-[17px] p-5">
              <div className="text-[10px] text-[#777C70] uppercase tracking-[0.16em] mb-1">Available Reserve</div>
              <div className="font-display font-extralight text-3xl text-[#E4E9DF]">
                14k <span className="text-xs text-[#777C70] font-normal">capacity</span>
              </div>
            </div>
          </section>

          {/* Main Data Table */}
          <section className="bg-[#0D120C]/90 border border-[rgba(228,233,223,0.08)] rounded-[17px] shadow-xl overflow-hidden backdrop-blur-md mb-8">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#080C08] border-b border-[rgba(228,233,223,0.08)] text-[10px] text-[#7A9A6E] uppercase tracking-[0.16em]">
                    <th className="p-4 w-12 text-center">Rank</th>
                    <th className="p-4 font-normal">Habitation Sector</th>
                    <th className="p-4 font-normal">Hazard Severity</th>
                    <th className="p-4 font-normal">Vulnerability</th>
                    <th className="p-4 font-normal">Time to Impact</th>
                    <th className="p-4 font-normal">Priority Status</th>
                    <th className="p-4 w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(228,233,223,0.06)] text-xs">
                  {filteredData.map((item) => {
                    const isExpanded = expandedRow === item.rank;
                    return (
                      <React.Fragment key={item.rank}>
                        <tr
                          onClick={() => setExpandedRow(isExpanded ? null : item.rank)}
                          className="hover:bg-[#080C08]/60 cursor-pointer transition-colors"
                        >
                          <td className="p-4 text-center font-display font-light text-[#E4E9DF]">{item.rank}</td>
                          <td className="p-4 text-[#E4E9DF] font-light">{item.name}</td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] uppercase tracking-wider border ${item.badgeColor}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${item.dotColor}`}></span> {item.severity}
                            </span>
                          </td>
                          <td className="p-4 text-[#777C70]">{item.vuln}</td>
                          <td className="p-4 text-[#DC2626] font-medium">{item.timeToImpact}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2 text-[#DC2626] uppercase text-[11px]">
                              <span className="material-symbols-outlined text-[16px]">warning</span> {item.status}
                            </div>
                          </td>
                          <td className="p-4 text-[#777C70]">
                            <span className={`material-symbols-outlined transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                              expand_more
                            </span>
                          </td>
                        </tr>

                        {/* Expanded Details */}
                        {isExpanded && (
                          <tr className="bg-[#080C08]/80">
                            <td colSpan={7} className="p-0 border-b border-[rgba(228,233,223,0.08)]">
                              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 border-l-2 border-[#DC2626] text-xs">
                                <div>
                                  <div className="text-[10px] text-[#777C70] uppercase">Population Density</div>
                                  <div className="text-[#E4E9DF] mt-1">{item.pop}</div>
                                </div>
                                <div>
                                  <div className="text-[10px] text-[#777C70] uppercase">Infrastructure Integrity</div>
                                  <div className="text-[#E4E9DF] mt-1">{item.infra}</div>
                                </div>
                                <div>
                                  <div className="text-[10px] text-[#777C70] uppercase">Evacuation Channel</div>
                                  <div className={`mt-1 ${item.routeColor}`}>{item.routes}</div>
                                </div>
                                <div className="col-span-full mt-4 pt-4 border-t border-[rgba(228,233,223,0.06)] flex gap-3">
                                  <Link
                                    to="/evacuation-route"
                                    className="bg-[#6F9164] text-[#0A0E09] px-4 py-2 rounded-[12px] text-xs uppercase tracking-wider font-medium hover:bg-[#86A978] transition-colors"
                                  >
                                    Deploy Transit
                                  </Link>
                                  <Link
                                    to="/risk-zone-id"
                                    className="bg-[#080C08] border border-[rgba(228,233,223,0.08)] text-[#E4E9DF] px-4 py-2 rounded-[12px] text-xs transition-colors"
                                  >
                                    View GIS Map
                                  </Link>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
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
