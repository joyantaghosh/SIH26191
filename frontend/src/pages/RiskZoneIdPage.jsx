import React from 'react';
import DashboardSidebar from '../components/DashboardSidebar';

export default function RiskZoneIdPage() {
  return (
    <div className="flex-grow flex flex-col w-full h-[calc(100vh-96px)] bg-transparent relative overflow-hidden z-10 font-sans text-xs font-light text-[#E4E9DF]">
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />

        {/* GIS Canvas Container */}
        <main className="flex-1 relative bg-[#060906]/60 backdrop-blur-xs overflow-hidden flex flex-col lg:flex-row">
          <div className="flex-1 h-full relative z-10">
            <img
              className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-35"
              alt="GIS Risk Zone Satellite Canvas"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnaiXbhpRPQ8WFmYSxaVB9iWn6ei4bYlptZk6iqQ_x8bqgnCHGBYKr2nO0Oy9h_n73WAoHxKYvqnhUG-z1w9otIJi9xr53sRlBpSaEkaSkTae45JB0u-TLTlvYdL9Ik8EZfKTcPwE9qH7OiZh-aYL5jFTZYC8wgbVuf3koA0Y7G_wrYYrzh6DoTL6BPzqIwYPp9bG2PqpXSWRXWpyFEKEIiO01EZlrkw_p_Y_uoEuV0xJp_a7Cx6Pa"
            />

            {/* Contour Risk Spot Glows */}
            <div className="absolute top-[30%] left-[40%] w-36 h-36 bg-[#DC2626]/20 border border-[#DC2626]/40 rounded-full animate-pulse blur-md"></div>
            <div className="absolute top-[30%] left-[40%] w-24 h-24 bg-[#DC2626]/30 border border-[#DC2626] rounded-full flex items-center justify-center backdrop-blur-sm">
              <span className="material-symbols-outlined text-[#DC2626] text-[28px]">warning</span>
            </div>

            {/* Controls */}
            <div className="absolute top-6 right-6 flex flex-col gap-2 z-20">
              <button className="w-10 h-10 bg-[#080C08] border border-[rgba(228,233,223,0.08)] rounded-[12px] flex items-center justify-center text-[#E4E9DF] hover:border-[rgba(122,154,110,0.3)]">
                <span className="material-symbols-outlined">add</span>
              </button>
              <button className="w-10 h-10 bg-[#080C08] border border-[rgba(228,233,223,0.08)] rounded-[12px] flex items-center justify-center text-[#E4E9DF] hover:border-[rgba(122,154,110,0.3)]">
                <span className="material-symbols-outlined">remove</span>
              </button>
              <button className="w-10 h-10 bg-[#6F9164] text-[#0A0E09] rounded-[12px] flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined">edit</span>
              </button>
            </div>

            {/* Legend */}
            <div className="absolute bottom-6 left-6 bg-[#080C08]/90 border border-[rgba(228,233,223,0.08)] p-4 rounded-[12px] z-20 font-sans text-xs animate-float-slow backdrop-blur-md shadow-lg">
              <div className="text-[10px] uppercase tracking-[0.16em] text-[#7A9A6E] mb-2 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7A9A6E] animate-pulse"></span>
                Contour Legend
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 bg-[#DC2626] rounded-full animate-pulse"></div>
                  <span className="text-[#E4E9DF]">Critical Hazard</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 bg-[#C1B99D] rounded-full"></div>
                  <span className="text-[#B0B5A8]">High Vulnerability</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 bg-[#7A9A6E] rounded-full"></div>
                  <span className="text-[#B0B5A8]">Nominal Safe Ridge</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar Analysis & Tools */}
          <div className="w-full lg:w-[380px] h-full bg-[#0D120C]/95 border-l border-[rgba(228,233,223,0.08)] flex flex-col shrink-0 z-30 overflow-y-auto backdrop-blur-md">
            <div className="p-6 border-b border-[rgba(228,233,223,0.08)] sticky top-0 z-10 bg-[#0D120C]">
              <span className="text-[10px] uppercase tracking-[0.16em] text-[#7A9A6E]">Telemetry Analysis</span>
              <h2 className="font-display font-light text-lg text-[#E4E9DF] mt-0.5">Zone Scorecard</h2>
              <p className="font-sans text-[11px] text-[#777C70]">Coords: 6°12'S 106°48'E</p>
            </div>

            {/* Score Card */}
            <div className="p-6 border-b border-[rgba(228,233,223,0.08)]">
              <div className="bg-[#080C08] border border-[rgba(122,154,110,0.18)] rounded-[17px] p-5 relative hover:border-[rgba(134,169,120,0.4)] transition-all duration-300">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="text-[10px] uppercase text-[#777C70] tracking-wider">Computed Vulnerability</div>
                    <div className="font-display text-4xl font-light text-[#E4E9DF] tracking-tight mt-1">
                      87<span className="text-lg text-[#777C70] font-normal">/100</span>
                    </div>
                  </div>
                  <div className="bg-[#DC2626]/20 border border-[#DC2626]/40 text-[#DC2626] px-2.5 py-1 rounded-full text-[10px] uppercase font-medium flex items-center gap-1 animate-pulse-glow">
                    <span className="material-symbols-outlined text-[14px]">warning</span>
                    Critical
                  </div>
                </div>

                <p className="text-xs text-[#777C70] leading-relaxed border-t border-[rgba(228,233,223,0.06)] pt-3 mt-3">
                  Immediate relocation protocol recommended. Sector displays high contour vulnerability due to proximity to active landslide channel.
                </p>

                {/* Metrics */}
                <div className="mt-4 space-y-2.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-20 text-[#777C70] text-[11px]">Severity</span>
                    <div className="flex-1 h-1.5 bg-[#1D2A1B] rounded-full overflow-hidden">
                      <div className="h-full bg-[#DC2626] w-[90%] transition-all duration-1000"></div>
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
                <span className="text-[11px] uppercase text-[#777C70]">Risk Classification</span>
                <span className="text-[#DC2626] font-medium">Critical (Red)</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[rgba(228,233,223,0.06)]">
                <span className="text-[11px] uppercase text-[#777C70]">Hazard Telemetry Type</span>
                <span className="text-[#E4E9DF]">Flood / Mudslide</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[rgba(228,233,223,0.06)]">
                <span className="text-[11px] uppercase text-[#777C70]">Severity Index</span>
                <span className="text-[#86A978] font-medium">8 / 10</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[rgba(228,233,223,0.06)]">
                <span className="text-[11px] uppercase text-[#777C70]">Population</span>
                <span className="text-[#E4E9DF]">1,452</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[rgba(228,233,223,0.06)]">
                <span className="text-[11px] uppercase text-[#777C70]">Distance to Hazard</span>
                <span className="text-[#E4E9DF]">0.4 km</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[rgba(228,233,223,0.06)]">
                <span className="text-[11px] uppercase text-[#777C70]">Evac Route Status</span>
                <span className="text-[#C1B99D] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">warning</span> Compromised
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}


