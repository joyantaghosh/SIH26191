import React, { useState, useEffect, useCallback } from 'react';
import DashboardSidebar from '../components/DashboardSidebar';
import { fetchCapacitySectors, calculateCarryingCapacity } from '../services/capacityApi';

export default function CarryingCapacityPage() {
  const [sectors, setSectors] = useState([]);
  const [selectedSectorId, setSelectedSectorId] = useState('');
  const [pop, setPop] = useState(4800);
  const [land, setLand] = useState(1250);
  const [water, setWater] = useState(150000);
  const [housing, setHousing] = useState(2100);
  const [beds, setBeds] = useState(350);
  const [isCalculating, setIsCalculating] = useState(false);
  const [assessment, setAssessment] = useState(null);

  // 1. Fetch live sectors on mount
  useEffect(() => {
    fetchCapacitySectors()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setSectors(data);
          const first = data[0];
          setSelectedSectorId(first.sectorId);
          setPop(first.currentPopulation);
          setLand(first.landHectares);
          setWater(first.waterSupplyLitersDay);
          setHousing(first.housingUnits);
          setBeds(first.medicalBeds);
        }
      })
      .catch((err) => console.warn('[CarryingCapacityPage] Error fetching sectors:', err.message));
  }, []);

  // When sector dropdown changes, fill in sector defaults
  const handleSectorChange = (secId) => {
    setSelectedSectorId(secId);
    const found = sectors.find((s) => s.sectorId === secId);
    if (found) {
      setPop(found.currentPopulation);
      setLand(found.landHectares);
      setWater(found.waterSupplyLitersDay);
      setHousing(found.housingUnits);
      setBeds(found.medicalBeds);
    }
  };

  // 2. Run carrying capacity matrix calculation
  const handleRecalculate = useCallback(async () => {
    setIsCalculating(true);
    try {
      const activeSector = sectors.find((s) => s.sectorId === selectedSectorId);
      const res = await calculateCarryingCapacity({
        sectorName: activeSector?.name || 'Custom Matrix Terrain',
        population: pop,
        landHectares: land,
        waterSupplyLitersDay: water,
        housingUnits: housing,
        medicalBeds: beds,
      });

      setAssessment(res);
    } catch (err) {
      console.error('[CarryingCapacityPage] Calculation failed:', err.message);
    } finally {
      setIsCalculating(false);
    }
  }, [sectors, selectedSectorId, pop, land, water, housing, beds]);

  useEffect(() => {
    handleRecalculate();
  }, [handleRecalculate]);

  // Derived or calculated metrics
  const maxCapacity = assessment?.calculatedMetrics?.maxSafeCapacity ?? Math.floor(beds * 18.5);
  const availableCap = assessment?.calculatedMetrics?.availableCapacity ?? Math.max(0, maxCapacity - pop);
  const popPercentage = assessment?.calculatedMetrics?.populationSaturationPercent ?? ((pop / maxCapacity) * 100).toFixed(1);

  const waterUtil = assessment?.calculatedMetrics?.waterUtilizationPercent ?? Math.min(100, Math.round((pop * 25) / (water / 10)));
  const housingUtil = assessment?.calculatedMetrics?.housingUtilizationPercent ?? Math.min(100, Math.round((pop / (housing * 3.5)) * 100));
  const healthUtil = assessment?.calculatedMetrics?.healthUtilizationPercent ?? Math.min(100, Math.round((pop / maxCapacity) * 100));
  const stressLevel = assessment?.calculatedMetrics?.stressLevel || 'NORMAL';

  return (
    <div className="flex-grow flex flex-col w-full min-h-[calc(100vh-70px)] bg-[#080C08] relative z-10 font-sans text-xs font-light text-[#E4E9DF]">
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 max-w-7xl mx-auto w-full">
          <header className="mb-8 border-b border-[rgba(228,233,223,0.08)] pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#86A978] animate-pulse"></span>
                <span className="text-[10px] uppercase tracking-[0.16em] text-[#7A9A6E]">
                  Slope Load & Resource Equilibrium
                </span>
              </div>
              <h1 className="font-display font-light text-2xl md:text-3xl text-[#E4E9DF]">
                Carrying Capacity <span className="text-[#86A978]">Matrix</span>
              </h1>
              <p className="text-xs text-[#777C70] mt-1">
                Calculates multi-resource maximum safe population thresholds for designated refuge terrain.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-[11px] uppercase tracking-wider flex items-center gap-1.5 font-mono font-medium border ${
                  stressLevel === 'CRITICAL'
                    ? 'bg-[#EF4444]/20 border-[#EF4444]/40 text-[#EF4444]'
                    : stressLevel === 'ELEVATED'
                    ? 'bg-[#F59E0B]/20 border-[#F59E0B]/40 text-[#F59E0B]'
                    : 'bg-[#7A9A6E]/15 border-[#7A9A6E]/30 text-[#86A978]'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    stressLevel === 'CRITICAL' ? 'bg-[#EF4444]' : stressLevel === 'ELEVATED' ? 'bg-[#F59E0B]' : 'bg-[#86A978]'
                  } animate-pulse`}
                ></span>
                Sector Stress: {stressLevel}
              </span>
            </div>
          </header>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Inputs Form */}
            <section className="xl:col-span-4 flex flex-col gap-6">
              <div className="bg-[#0D120C] rounded-[20px] border border-[rgba(122,154,110,0.2)] p-6 shadow-xl backdrop-blur-md">
                <h2 className="font-display font-light text-base text-[#E4E9DF] mb-4 flex items-center gap-2 border-b border-[rgba(228,233,223,0.06)] pb-3">
                  <span className="material-symbols-outlined text-[#86A978] text-[20px]">tune</span>
                  Terrain Parameters
                </h2>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleRecalculate();
                  }}
                  className="space-y-4 text-xs font-mono"
                >
                  <div>
                    <label className="block text-[#777C70] uppercase tracking-wider text-[10px] mb-1.5">
                      Refuge Sector Preset
                    </label>
                    <select
                      value={selectedSectorId}
                      onChange={(e) => handleSectorChange(e.target.value)}
                      className="w-full h-10 border border-[rgba(122,154,110,0.3)] rounded-[12px] bg-[#080C08] text-[#E4E9DF] px-3 focus:border-[#86A978] outline-none"
                    >
                      {sectors.map((s) => (
                        <option key={s.sectorId} value={s.sectorId}>
                          {s.sectorId}: {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#777C70] uppercase tracking-wider text-[10px] mb-1.5">
                      Assigned Population
                    </label>
                    <input
                      type="number"
                      value={pop}
                      onChange={(e) => setPop(Number(e.target.value))}
                      className="w-full h-10 border border-[rgba(122,154,110,0.3)] rounded-[12px] bg-[#080C08] text-[#E4E9DF] px-3 outline-none focus:border-[#86A978]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#777C70] uppercase tracking-wider text-[10px] mb-1.5">
                        Land Area (Ha)
                      </label>
                      <input
                        type="number"
                        value={land}
                        onChange={(e) => setLand(Number(e.target.value))}
                        className="w-full h-10 border border-[rgba(122,154,110,0.3)] rounded-[12px] bg-[#080C08] text-[#E4E9DF] px-3 outline-none focus:border-[#86A978]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#777C70] uppercase tracking-wider text-[10px] mb-1.5">
                        Water (L/day)
                      </label>
                      <input
                        type="number"
                        value={water}
                        onChange={(e) => setWater(Number(e.target.value))}
                        className="w-full h-10 border border-[rgba(122,154,110,0.3)] rounded-[12px] bg-[#080C08] text-[#E4E9DF] px-3 outline-none focus:border-[#86A978]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#777C70] uppercase tracking-wider text-[10px] mb-1.5">
                        Housing Units
                      </label>
                      <input
                        type="number"
                        value={housing}
                        onChange={(e) => setHousing(Number(e.target.value))}
                        className="w-full h-10 border border-[rgba(122,154,110,0.3)] rounded-[12px] bg-[#080C08] text-[#E4E9DF] px-3 outline-none focus:border-[#86A978]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#777C70] uppercase tracking-wider text-[10px] mb-1.5">
                        Medical Beds
                      </label>
                      <input
                        type="number"
                        value={beds}
                        onChange={(e) => setBeds(Number(e.target.value))}
                        className="w-full h-10 border border-[rgba(122,154,110,0.3)] rounded-[12px] bg-[#080C08] text-[#E4E9DF] px-3 outline-none focus:border-[#86A978]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isCalculating}
                    className="w-full h-11 bg-[#6F9164] hover:bg-[#86A978] disabled:opacity-50 text-[#080C08] rounded-[12px] font-mono text-xs font-semibold uppercase tracking-wider transition-all mt-4 flex items-center justify-center gap-2 shadow-lg"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {isCalculating ? 'autorenew' : 'calculate'}
                    </span>
                    {isCalculating ? 'Evaluating Equilibrium...' : 'Recalculate Telemetry'}
                  </button>
                </form>
              </div>
            </section>

            {/* KPI Results & Visualizations */}
            <section className="xl:col-span-8 flex flex-col gap-6 font-mono">
              {/* Statistical Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#0D120C] rounded-[18px] border border-[rgba(228,233,223,0.08)] p-5 shadow-lg">
                  <div className="text-[#777C70] text-[10px] uppercase tracking-[0.16em] font-medium mb-1">
                    Max Safe Threshold
                  </div>
                  <div className="font-display font-light text-3xl text-[#E4E9DF] tracking-tight">
                    {maxCapacity.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-[#777C70] mt-1 font-sans">Individuals sustained</div>
                </div>

                <div className="bg-[#0D120C] rounded-[18px] border border-[rgba(228,233,223,0.08)] p-5 shadow-lg">
                  <div className="text-[#777C70] text-[10px] uppercase tracking-[0.16em] font-medium mb-1">
                    Current Population
                  </div>
                  <div className="font-display font-light text-3xl text-[#86A978] tracking-tight">
                    {pop.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-[#777C70] mt-1 font-sans">{popPercentage}% of max capacity</div>
                </div>

                <div className="bg-[#0D120C] rounded-[18px] border border-[rgba(122,154,110,0.3)] p-5 shadow-lg bg-gradient-to-br from-[#0D120C] to-[#1D2A1B]/40">
                  <div className="text-[#86A978] text-[10px] uppercase tracking-[0.16em] font-medium mb-1">
                    Available Reserve
                  </div>
                  <div className="font-display font-light text-3xl text-[#E4E9DF] tracking-tight">
                    {availableCap.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-[#777C70] mt-1 font-sans">Headcount slots</div>
                </div>
              </div>

              {/* Resource Utilization Progress Bars */}
              <div className="bg-[#0D120C] rounded-[20px] border border-[rgba(228,233,223,0.08)] p-6 lg:p-7 flex-1 shadow-lg">
                <h3 className="font-display font-light text-lg text-[#E4E9DF] mb-5 flex items-center gap-2 border-b border-[rgba(228,233,223,0.06)] pb-3">
                  <span className="material-symbols-outlined text-[#86A978] text-[20px]">bar_chart</span>
                  Resource Utilization Telemetry
                </h3>

                <div className="space-y-5 text-xs font-mono">
                  {/* Water */}
                  <div>
                    <div className="flex justify-between items-end mb-1.5">
                      <span className="text-[#E4E9DF] font-sans">Water Reservoir Reserves</span>
                      <span className="text-[#86A978] font-bold">{waterUtil}%</span>
                    </div>
                    <div className="w-full bg-[#080C08] rounded-full h-2 overflow-hidden border border-[rgba(228,233,223,0.06)]">
                      <div
                        className="bg-[#7A9A6E] h-full transition-all duration-500"
                        style={{ width: `${waterUtil}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Housing */}
                  <div>
                    <div className="flex justify-between items-end mb-1.5">
                      <span className="text-[#E4E9DF] font-sans">Refuge Shelter Density</span>
                      <span className="text-[#F59E0B] font-bold">{housingUtil}%</span>
                    </div>
                    <div className="w-full bg-[#080C08] rounded-full h-2 overflow-hidden border border-[rgba(228,233,223,0.06)]">
                      <div
                        className="bg-[#F59E0B] h-full transition-all duration-500"
                        style={{ width: `${housingUtil}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Healthcare */}
                  <div>
                    <div className="flex justify-between items-end mb-1.5">
                      <span className="text-[#E4E9DF] font-sans">Medical Relief Bed Saturation</span>
                      <span className="text-[#EF4444] font-bold">{healthUtil}%</span>
                    </div>
                    <div className="w-full bg-[#080C08] rounded-full h-2 overflow-hidden border border-[rgba(228,233,223,0.06)]">
                      <div
                        className="bg-[#EF4444] h-full transition-all duration-500"
                        style={{ width: `${healthUtil}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Recommendations Box */}
                {assessment?.recommendations && assessment.recommendations.length > 0 && (
                  <div className="mt-6 p-4 bg-[#080C08] border border-[rgba(122,154,110,0.2)] rounded-[14px] text-xs font-sans text-[#B0B5A8] space-y-2">
                    <div className="flex items-center gap-2 text-[#86A978] font-mono text-[11px] uppercase font-semibold">
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                      Automated Operational Recommendations
                    </div>
                    <ul className="list-disc pl-4 space-y-1 text-[#B0B5A8]">
                      {assessment.recommendations.map((rec, idx) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
