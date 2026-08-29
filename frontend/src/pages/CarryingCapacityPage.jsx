import React, { useState } from 'react';
import DashboardSidebar from '../components/DashboardSidebar';

export default function CarryingCapacityPage() {
  const [pop, setPop] = useState(4800);
  const [land, setLand] = useState(1250);
  const [water, setWater] = useState(150000);
  const [elec, setElec] = useState(45);
  const [housing, setHousing] = useState(2100);
  const [beds, setBeds] = useState(350);

  // Dynamic calculations based on inputs
  const maxCapacity = Math.floor(beds * 18.5);
  const availableCap = Math.max(0, maxCapacity - pop);
  const popPercentage = ((pop / maxCapacity) * 100).toFixed(1);

  const waterUtil = Math.min(100, Math.round((pop * 25) / (water / 10)));
  const housingUtil = Math.min(100, Math.round((pop / (housing * 3.5)) * 100));
  const healthUtil = Math.min(100, Math.round((pop / maxCapacity) * 100));

  return (
    <div className="flex-grow flex flex-col w-full min-h-[calc(100vh-70px)] bg-transparent relative z-10 font-sans text-xs font-light text-[#E4E9DF]">
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-6xl mx-auto">
            <header className="mb-10 border-b border-[rgba(228,233,223,0.08)] pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.16em] text-[#7A9A6E]">Terrain Capacity Analysis</span>
                <h1 className="font-display font-extralight text-3xl md:text-4xl text-[#E4E9DF] mt-1">Carrying Capacity Matrix</h1>
                <p className="text-sm text-[#777C70] mt-1">Calculates maximum safe population thresholds for designated refuge terrain.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-[#7A9A6E]/15 border border-[#7A9A6E]/30 text-[#86A978] rounded-full text-[11px] uppercase tracking-wider flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#86A978] animate-pulse"></span>
                  Status: Sector Nominal
                </span>
              </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
              {/* Inputs Form */}
              <section className="xl:col-span-4 flex flex-col gap-6">
                <div className="bg-[#0D120C]/90 rounded-[17px] border border-[rgba(122,154,110,0.18)] p-6 shadow-xl backdrop-blur-md">
                  <h2 className="font-display font-light text-lg text-[#E4E9DF] mb-5 flex items-center gap-2 border-b border-[rgba(228,233,223,0.06)] pb-3">
                    <span className="material-symbols-outlined text-[#86A978]">tune</span>
                    Terrain Parameters
                  </h2>

                  <form className="space-y-4 text-xs font-light">
                    <div>
                      <label className="block text-[#777C70] uppercase tracking-wider text-[10px] mb-1.5">Existing Population</label>
                      <input
                        type="number"
                        value={pop}
                        onChange={(e) => setPop(Number(e.target.value))}
                        className="w-full h-11 border border-[rgba(228,233,223,0.08)] rounded-[12px] bg-[#080C08] text-[#E4E9DF] px-3.5 outline-none focus:border-[#7A9A6E]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[#777C70] uppercase tracking-wider text-[10px] mb-1.5">Land (Ha)</label>
                        <input
                          type="number"
                          value={land}
                          onChange={(e) => setLand(Number(e.target.value))}
                          className="w-full h-11 border border-[rgba(228,233,223,0.08)] rounded-[12px] bg-[#080C08] text-[#E4E9DF] px-3.5 outline-none focus:border-[#7A9A6E]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#777C70] uppercase tracking-wider text-[10px] mb-1.5">Water (L/day)</label>
                        <input
                          type="number"
                          value={water}
                          onChange={(e) => setWater(Number(e.target.value))}
                          className="w-full h-11 border border-[rgba(228,233,223,0.08)] rounded-[12px] bg-[#080C08] text-[#E4E9DF] px-3.5 outline-none focus:border-[#7A9A6E]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[#777C70] uppercase tracking-wider text-[10px] mb-1.5">Medical Beds</label>
                      <input
                        type="number"
                        value={beds}
                        onChange={(e) => setBeds(Number(e.target.value))}
                        className="w-full h-11 border border-[rgba(228,233,223,0.08)] rounded-[12px] bg-[#080C08] text-[#E4E9DF] px-3.5 outline-none focus:border-[#7A9A6E]"
                      />
                    </div>

                    <button
                      type="button"
                      className="w-full h-11 bg-[#6F9164] hover:bg-[#86A978] text-[#0A0E09] rounded-[17px] font-medium text-xs uppercase tracking-wider transition-all mt-4 flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">calculate</span>
                      Recalculate Telemetry
                    </button>
                  </form>
                </div>
              </section>

              {/* KPI Results & Visualizations */}
              <section className="xl:col-span-8 flex flex-col gap-6">
                {/* Open Statistical Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-[#0D120C]/90 rounded-[17px] border border-[rgba(228,233,223,0.08)] p-6">
                    <div className="text-[#777C70] text-[10px] uppercase tracking-[0.16em] font-medium mb-1">Max Safe Threshold</div>
                    <div className="font-display font-extralight text-3xl lg:text-4xl text-[#E4E9DF] tracking-tight">{maxCapacity.toLocaleString()}</div>
                    <div className="text-xs text-[#777C70] mt-1">individuals</div>
                  </div>

                  <div className="bg-[#0D120C]/90 rounded-[17px] border border-[rgba(228,233,223,0.08)] p-6">
                    <div className="text-[#777C70] text-[10px] uppercase tracking-[0.16em] font-medium mb-1">Current Population</div>
                    <div className="font-display font-extralight text-3xl lg:text-4xl text-[#C1B99D] tracking-tight">{pop.toLocaleString()}</div>
                    <div className="text-xs text-[#777C70] mt-1">{popPercentage}% of max capacity</div>
                  </div>

                  <div className="bg-[#0D120C]/90 rounded-[17px] border border-[rgba(122,154,110,0.2)] p-6">
                    <div className="text-[#7A9A6E] text-[10px] uppercase tracking-[0.16em] font-medium mb-1">Available Reserve</div>
                    <div className="font-display font-extralight text-3xl lg:text-4xl text-[#86A978] tracking-tight">{availableCap.toLocaleString()}</div>
                    <div className="text-xs text-[#777C70] mt-1">headcount slots</div>
                  </div>
                </div>

                {/* Resource Utilization Progress Bars */}
                <div className="bg-[#0D120C]/90 rounded-[17px] border border-[rgba(228,233,223,0.08)] p-6 lg:p-8 flex-1">
                  <h3 className="font-display font-light text-xl text-[#E4E9DF] mb-6 flex items-center gap-2 border-b border-[rgba(228,233,223,0.06)] pb-4">
                    <span className="material-symbols-outlined text-[#86A978]">bar_chart</span>
                    Resource Utilization Telemetry
                  </h3>

                  <div className="space-y-6 text-xs">
                    {/* Water */}
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-[#E4E9DF]">Water Reserves</span>
                        <span className="text-[#86A978] font-medium">{waterUtil}%</span>
                      </div>
                      <div className="w-full bg-[#1D2A1B] rounded-full h-1.5">
                        <div className="bg-[#7A9A6E] h-1.5 rounded-full" style={{ width: `${waterUtil}%` }}></div>
                      </div>
                    </div>

                    {/* Housing */}
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-[#E4E9DF]">Refuge Shelter Density</span>
                        <span className="text-[#C1B99D] font-medium">{housingUtil}%</span>
                      </div>
                      <div className="w-full bg-[#1D2A1B] rounded-full h-1.5">
                        <div className="bg-[#C1B99D] h-1.5 rounded-full" style={{ width: `${housingUtil}%` }}></div>
                      </div>
                    </div>

                    {/* Healthcare */}
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-[#E4E9DF]">Medical Capacity (Beds)</span>
                        <span className="text-[#DC2626] font-medium">{healthUtil}%</span>
                      </div>
                      <div className="w-full bg-[#1D2A1B] rounded-full h-1.5">
                        <div className="bg-[#DC2626] h-1.5 rounded-full" style={{ width: `${healthUtil}%` }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Constraint Box */}
                  <div className="mt-8 p-4 bg-[#080C08] border border-[rgba(122,154,110,0.18)] rounded-[12px] text-xs text-[#777C70] flex gap-3">
                    <span className="material-symbols-outlined text-[#86A978]">info</span>
                    <div>
                      <strong className="text-[#E4E9DF] block mb-1 font-normal uppercase tracking-wider text-[10px]">Bottleneck Insight</strong>
                      Medical bed capacity ({beds} units) remains the main limiting factor at {healthUtil}% utilization.
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}


