import React, { useState, useEffect, useCallback } from 'react';
import DashboardSidebar from '../components/DashboardSidebar';
import { fetchAlerts, fetchLiveTelemetry, triggerWeatherScan, dismissAlert } from '../services/alertApi';
import { getRiskZones } from '../services/riskZoneApi';

export default function RiskAlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [zones, setZones] = useState([]);
  const [telemetry, setTelemetry] = useState(null);
  const [loadingAlerts, setLoadingAlerts] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Form State
  const [selectedZoneId, setSelectedZoneId] = useState('');
  const [customThreshold, setCustomThreshold] = useState(60);
  const [customScanRadius, setCustomScanRadius] = useState(15);
  const [bannerMessage, setBannerMessage] = useState(null);

  // 1. Fetch live alerts from backend
  const loadAlertsData = useCallback(async () => {
    try {
      const params = {};
      if (statusFilter !== 'ALL') params.status = statusFilter;
      const res = await fetchAlerts(params);
      const list = res.alerts || res || [];
      setAlerts(Array.isArray(list) ? list : []);
    } catch (err) {
      console.warn('[RiskAlertsPage] Could not load alerts from backend:', err.message);
    } finally {
      setLoadingAlerts(false);
    }
  }, [statusFilter]);

  // 2. Fetch live atmospheric telemetry & hazard score preview
  const loadTelemetryData = useCallback(async () => {
    try {
      const data = await fetchLiveTelemetry(-6.2, 106.8);
      setTelemetry(data);
    } catch (err) {
      console.warn('[RiskAlertsPage] Could not load telemetry:', err.message);
    }
  }, []);

  // 3. Load DB Risk Zones for selector
  const loadZonesData = useCallback(async () => {
    try {
      const data = await getRiskZones();
      if (Array.isArray(data) && data.length > 0) {
        setZones(data);
        setSelectedZoneId(data[0].id || data[0].zoneId);
      }
    } catch (err) {
      console.warn('[RiskAlertsPage] Could not load risk zones:', err.message);
    }
  }, []);

  useEffect(() => {
    loadAlertsData();
    loadTelemetryData();
    loadZonesData();

    // Auto poll alerts and telemetry every 25 seconds
    const interval = setInterval(() => {
      loadAlertsData();
      loadTelemetryData();
    }, 25000);

    return () => clearInterval(interval);
  }, [loadAlertsData, loadTelemetryData, loadZonesData]);

  // Handle On-Demand Real-Time Weather Scan
  const handleRunScan = async (e) => {
    if (e) e.preventDefault();
    setScanning(true);
    setBannerMessage(null);

    try {
      // Find selected zone coordinates or default to [-6.2, 106.8]
      const targetZone = zones.find((z) => z.id === selectedZoneId || z.zoneId === selectedZoneId);
      const lat = targetZone?.latitude ?? -6.2;
      const lng = targetZone?.longitude ?? 106.8;

      const result = await triggerWeatherScan({
        latitude: lat,
        longitude: lng,
        scanRadiusKm: Number(customScanRadius),
        threshold: Number(customThreshold),
        forceQuery: true,
      });

      setBannerMessage({
        type: 'success',
        text: result.triggered
          ? `🚨 Hazard Threshold Breached! Score: ${result.hazardConfidenceScore}/100 [${result.severity}]. Alert generated and dispatched.`
          : `✅ Scan Complete: Score ${result.hazardConfidenceScore}/100 is below threshold (${result.threshold}). Status nominal.`,
      });

      await loadAlertsData();
      await loadTelemetryData();
    } catch (err) {
      setBannerMessage({
        type: 'error',
        text: `Scan execution failed: ${err.message}`,
      });
    } finally {
      setScanning(false);
      setTimeout(() => setBannerMessage(null), 6000);
    }
  };

  // Handle Dismiss / Acknowledge Alert
  const handleDismiss = async (alertId) => {
    try {
      await dismissAlert(alertId);
      setAlerts((prev) =>
        prev.map((a) => (a.alertId === alertId || a._id === alertId ? { ...a, status: 'DISMISSED' } : a))
      );
    } catch (err) {
      console.error('Failed to dismiss alert:', err);
    }
  };

  const getSeverityBadge = (severity) => {
    const s = String(severity || '').toUpperCase();
    if (s === 'CRITICAL') return { color: '#EF4444', bg: 'bg-[#EF4444]/20 border-[#EF4444]/40 text-[#EF4444]' };
    if (s === 'HIGH') return { color: '#F59E0B', bg: 'bg-[#F59E0B]/20 border-[#F59E0B]/40 text-[#F59E0B]' };
    if (s === 'MEDIUM') return { color: '#EAB308', bg: 'bg-[#EAB308]/20 border-[#EAB308]/40 text-[#EAB308]' };
    return { color: '#10B981', bg: 'bg-[#10B981]/20 border-[#10B981]/40 text-[#10B981]' };
  };

  return (
    <div className="flex-grow flex flex-col w-full h-[calc(100vh-70px)] bg-[#080C08] relative z-10 font-sans text-xs font-light text-[#E4E9DF] overflow-hidden">
      <div className="flex flex-1 overflow-hidden h-full">
        <DashboardSidebar />

        {/* Main Content Canvas */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto h-full">
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-[rgba(228,233,223,0.08)] pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse"></span>
                <span className="text-[10px] uppercase tracking-[0.16em] text-[#7A9A6E] font-medium">
                  Early Warning & Hazard Dispatch Protocol
                </span>
              </div>
              <h1 className="font-display font-light text-2xl md:text-3xl text-[#E4E9DF]">
                Automated Weather <span className="text-[#86A978]">Risk Alerts</span>
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  loadAlertsData();
                  loadTelemetryData();
                }}
                className="px-3.5 py-2 bg-[#0D120C] hover:bg-[#1D2A1B] text-[#B0B5A8] border border-[rgba(122,154,110,0.3)] rounded-[12px] flex items-center gap-1.5 transition-all text-[11px]"
              >
                <span className="material-symbols-outlined text-[16px]">refresh</span>
                Sync Telemetry
              </button>

              <button
                type="button"
                onClick={handleRunScan}
                disabled={scanning}
                className="px-4 py-2 bg-[#6F9164] hover:bg-[#86A978] disabled:opacity-50 text-[#080C08] font-medium rounded-[12px] flex items-center gap-2 shadow-lg transition-all text-[11px]"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {scanning ? 'autorenew' : 'radar'}
                </span>
                {scanning ? 'Scanning Atmospheric Radar...' : 'Scan Now'}
              </button>
            </div>
          </div>

          {/* Banner Notification */}
          {bannerMessage && (
            <div
              className={`mb-6 p-4 rounded-[14px] border font-mono text-xs flex items-center gap-2 transition-all animate-fade-in ${
                bannerMessage.type === 'error'
                  ? 'bg-[#EF4444]/15 border-[#EF4444]/50 text-[#EF4444]'
                  : 'bg-[#7A9A6E]/15 border-[#7A9A6E]/50 text-[#86A978]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {bannerMessage.type === 'error' ? 'error' : 'verified'}
              </span>
              <span>{bannerMessage.text}</span>
            </div>
          )}

          {/* Live Telemetry Radar Cards */}
          {telemetry && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-6 font-mono">
              <div className="bg-[#0D120C] border border-[rgba(228,233,223,0.08)] p-4 rounded-[16px] flex flex-col justify-between">
                <span className="text-[10px] text-[#777C70] uppercase tracking-wider">Precipitation Rate</span>
                <div className="text-xl font-light text-[#E4E9DF] mt-1">
                  {telemetry.weatherData?.rainIntensityMmHr ?? 0}{' '}
                  <span className="text-xs text-[#777C70] font-normal">mm/h</span>
                </div>
                <span className="text-[10px] text-[#86A978] mt-1 truncate">
                  3h Accum: {telemetry.weatherData?.rainAccumulation3hMm ?? 0} mm
                </span>
              </div>

              <div className="bg-[#0D120C] border border-[rgba(228,233,223,0.08)] p-4 rounded-[16px] flex flex-col justify-between">
                <span className="text-[10px] text-[#777C70] uppercase tracking-wider">Wind & Gusts</span>
                <div className="text-xl font-light text-[#E4E9DF] mt-1">
                  {telemetry.weatherData?.windSpeedMs ?? 0}{' '}
                  <span className="text-xs text-[#777C70] font-normal">m/s</span>
                </div>
                <span className="text-[10px] text-[#B0B5A8] mt-1 truncate">
                  Max Gust: {telemetry.weatherData?.windGustMs ?? 0} m/s
                </span>
              </div>

              <div className="bg-[#0D120C] border border-[rgba(228,233,223,0.08)] p-4 rounded-[16px] flex flex-col justify-between">
                <span className="text-[10px] text-[#777C70] uppercase tracking-wider">Barometric Pressure</span>
                <div className="text-xl font-light text-[#E4E9DF] mt-1">
                  {telemetry.weatherData?.pressureHpa ?? 1013}{' '}
                  <span className="text-xs text-[#777C70] font-normal">hPa</span>
                </div>
                <span className="text-[10px] text-[#B0B5A8] mt-1 truncate">
                  Humidity: {telemetry.weatherData?.humidity ?? 70}%
                </span>
              </div>

              <div className="bg-[#0D120C] border border-[rgba(122,154,110,0.3)] p-4 rounded-[16px] flex flex-col justify-between bg-gradient-to-br from-[#0D120C] to-[#1D2A1B]/40">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-[#86A978] uppercase tracking-wider">Hazard Confidence</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-semibold ${
                      getSeverityBadge(telemetry.severity).bg
                    }`}
                  >
                    {telemetry.severity}
                  </span>
                </div>
                <div className="text-2xl font-light text-[#E4E9DF] mt-1 flex items-baseline gap-1">
                  {telemetry.hazardConfidenceScore ?? 0}
                  <span className="text-xs text-[#777C70] font-normal">/100</span>
                </div>
                <div className="w-full bg-[#080C08] h-1.5 rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full transition-all duration-700"
                    style={{
                      width: `${telemetry.hazardConfidenceScore}%`,
                      backgroundColor: getSeverityBadge(telemetry.severity).color,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Alert Feed Section (Left 7 Cols) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-display font-light text-lg text-[#E4E9DF] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#EF4444] text-[20px]">notifications_active</span>
                  Live Alert Stream ({alerts.length})
                </h2>

                {/* Status Filter Toggle */}
                <div className="flex items-center gap-1 bg-[#0D120C] p-1 rounded-xl border border-[rgba(228,233,223,0.08)] text-[10px] font-mono">
                  {['ALL', 'ACTIVE', 'DISMISSED'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setStatusFilter(f)}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        statusFilter === f
                          ? 'bg-[#7A9A6E]/20 text-[#86A978] border border-[rgba(122,154,110,0.3)]'
                          : 'text-[#777C70] hover:text-[#E4E9DF]'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {loadingAlerts && (
                <div className="py-12 text-center text-[#777C70] font-mono">
                  <span className="material-symbols-outlined text-3xl animate-spin mb-2">autorenew</span>
                  <p>Synchronizing MongoDB Alert Feed...</p>
                </div>
              )}

              {!loadingAlerts && alerts.length === 0 && (
                <div className="bg-[#0D120C] border border-[rgba(228,233,223,0.08)] rounded-[18px] p-8 text-center text-[#777C70] font-mono">
                  <span className="material-symbols-outlined text-4xl text-[#7A9A6E] mb-2">verified</span>
                  <h3 className="text-sm font-medium text-[#E4E9DF]">No Active Weather Alerts</h3>
                  <p className="text-xs text-[#777C70] mt-1 max-w-sm mx-auto">
                    All monitored regional sectors are currently operating within nominal threshold boundaries.
                  </p>
                </div>
              )}

              {alerts.map((alert) => {
                const badge = getSeverityBadge(alert.severity);
                const isDismissed = alert.status === 'DISMISSED';

                return (
                  <div
                    key={alert._id || alert.alertId}
                    className={`bg-[#0D120C] border rounded-[18px] p-5 shadow-lg relative overflow-hidden transition-all duration-300 ${
                      isDismissed
                        ? 'opacity-50 border-[rgba(228,233,223,0.05)]'
                        : 'border-[rgba(228,233,223,0.1)] hover:border-[rgba(122,154,110,0.4)]'
                    }`}
                    style={{ borderLeftWidth: '4px', borderLeftColor: isDismissed ? '#565C51' : badge.color }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-semibold text-[#86A978] bg-[#1D2A1B] px-2 py-0.5 rounded border border-[rgba(122,154,110,0.2)] uppercase">
                          {alert.alertId}
                        </span>
                        <span className={`font-mono text-[9px] px-2 py-0.5 rounded-full uppercase border ${badge.bg}`}>
                          {alert.severity} ({alert.hazardConfidenceScore}/100)
                        </span>
                      </div>

                      <span className="text-[11px] font-mono text-[#777C70]">
                        {alert.dispatchedAt ? new Date(alert.dispatchedAt).toLocaleTimeString() : 'Recent'}
                      </span>
                    </div>

                    <h3 className="font-display font-medium text-sm text-[#E4E9DF] mt-1 mb-1.5">{alert.title}</h3>
                    <p className="font-sans text-xs text-[#B0B5A8] leading-relaxed mb-3">{alert.description}</p>

                    {/* Affected Zones Pills */}
                    {alert.affectedZoneSnapshots && alert.affectedZoneSnapshots.length > 0 && (
                      <div className="mb-3 pt-2 border-t border-[rgba(228,233,223,0.06)] flex flex-wrap gap-1.5 items-center">
                        <span className="text-[10px] font-mono uppercase text-[#777C70]">Target Sectors:</span>
                        {alert.affectedZoneSnapshots.map((z, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-[#080C08] border border-[rgba(228,233,223,0.08)] text-[10px] text-[#E4E9DF] font-mono"
                          >
                            {z.zoneId}: {z.name}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="flex items-center justify-between pt-2 border-t border-[rgba(228,233,223,0.06)] font-mono text-[11px]">
                      <div className="flex items-center gap-3 text-[#777C70]">
                        {alert.totalPopulationAtRisk > 0 && (
                          <span>Population: <strong className="text-[#E4E9DF]">{alert.totalPopulationAtRisk.toLocaleString()}</strong></span>
                        )}
                        <span>Channels: <strong className="text-[#86A978]">WS, SMS, Email</strong></span>
                      </div>

                      {!isDismissed ? (
                        <button
                          type="button"
                          onClick={() => handleDismiss(alert.alertId || alert._id)}
                          className="px-3 py-1 bg-[#1D2A1B] hover:bg-[#6F9164] text-[#86A978] hover:text-[#080C08] border border-[rgba(122,154,110,0.3)] rounded-lg text-[11px] font-medium transition-all"
                        >
                          Acknowledge & Dismiss
                        </button>
                      ) : (
                        <span className="text-[#565C51] flex items-center gap-1 text-[10px]">
                          <span className="material-symbols-outlined text-[14px]">done_all</span> Acknowledged
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Weather Scan & Alert Trigger Console (Right 5 Cols) */}
            <div className="lg:col-span-5">
              <div className="bg-[#0D120C] border border-[rgba(228,233,223,0.08)] rounded-[20px] p-6 shadow-xl sticky top-6 font-mono text-xs">
                <div className="flex items-center gap-2 mb-4 border-b border-[rgba(228,233,223,0.08)] pb-3">
                  <span className="material-symbols-outlined text-[#86A978] text-[20px]">radar</span>
                  <h2 className="font-display font-light text-base text-[#E4E9DF]">
                    Atmospheric <span className="text-[#86A978]">Scan Trigger</span>
                  </h2>
                </div>

                <form onSubmit={handleRunScan} className="space-y-4 font-sans">
                  <div>
                    <label className="block text-[#777C70] text-[11px] uppercase tracking-wider mb-1 font-mono">
                      Target Sector Zone
                    </label>
                    <select
                      value={selectedZoneId}
                      onChange={(e) => setSelectedZoneId(e.target.value)}
                      className="w-full h-11 border border-[rgba(122,154,110,0.3)] rounded-[12px] px-3 font-mono text-xs bg-[#080C08] text-[#E4E9DF] focus:border-[#86A978] outline-none"
                    >
                      {zones.map((zone) => (
                        <option key={zone.id || zone.zoneId} value={zone.id || zone.zoneId}>
                          {zone.zoneId}: {zone.name} ({zone.region || 'Active Sector'})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#777C70] text-[10px] uppercase tracking-wider mb-1 font-mono">
                        Threshold (0-100)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={customThreshold}
                        onChange={(e) => setCustomThreshold(e.target.value)}
                        className="w-full h-10 border border-[rgba(122,154,110,0.3)] rounded-[10px] px-3 font-mono text-xs bg-[#080C08] text-[#E4E9DF] outline-none focus:border-[#86A978]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#777C70] text-[10px] uppercase tracking-wider mb-1 font-mono">
                        Radius (km)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={customScanRadius}
                        onChange={(e) => setCustomScanRadius(e.target.value)}
                        className="w-full h-10 border border-[rgba(122,154,110,0.3)] rounded-[10px] px-3 font-mono text-xs bg-[#080C08] text-[#E4E9DF] outline-none focus:border-[#86A978]"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[rgba(228,233,223,0.06)] font-mono text-[11px] text-[#777C70] space-y-1.5">
                    <div className="flex justify-between">
                      <span>Data Pipeline:</span>
                      <span className="text-[#86A978]">Axios / Open-Meteo Live</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Geospatial Engine:</span>
                      <span className="text-[#E4E9DF]">MongoDB $nearSphere</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cron Auto-Scan:</span>
                      <span className="text-[#86A978]">Every 15 min Active</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={scanning}
                    className="w-full h-11 bg-[#6F9164] hover:bg-[#86A978] disabled:opacity-50 text-[#080C08] rounded-[12px] font-mono text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg mt-4"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {scanning ? 'hourglass_top' : 'bolt'}
                    </span>
                    {scanning ? 'Evaluating Telemetry...' : 'Execute Weather Hazard Scan'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
