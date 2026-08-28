import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function RiskAlertsPage() {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      zone: 'Village A - Flood Risk',
      severity: 'Critical',
      time: 'Just Now',
      desc: 'Flood risk reached critical level. Immediate relocation protocols enacted.',
      acknowledged: false,
      color: '#DC2626',
    },
    {
      id: 2,
      zone: 'Village B - Escalation',
      severity: 'High',
      time: '12 mins ago',
      desc: 'Risk level increased to High due to upstream river swelling.',
      acknowledged: false,
      color: '#f97316',
    },
  ]);

  // Form State
  const [targetZone, setTargetZone] = useState('Village A');
  const [severity, setSeverity] = useState('critical');
  const [message, setMessage] = useState('');
  const [channels, setChannels] = useState({ sms: true, app: true, radio: false });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleAcknowledge = (id) => {
    setAlerts(alerts.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)));
  };

  const handleTransmitAlert = (e) => {
    e.preventDefault();
    if (!message) return;

    const newAlertObj = {
      id: Date.now(),
      zone: `${targetZone} - Broadcast`,
      severity: severity.charAt(0).toUpperCase() + severity.slice(1),
      time: 'Just Now',
      desc: message,
      acknowledged: false,
      color: severity === 'critical' ? '#DC2626' : severity === 'high' ? '#f97316' : '#eab308',
    };

    setAlerts([newAlertObj, ...alerts]);
    setMessage('');
    setShowSuccessModal(true);
    setTimeout(() => setShowSuccessModal(false), 3000);
  };

  return (
    <div className="flex-grow flex flex-col w-full min-h-[calc(100vh-72px)] bg-transparent relative z-10 font-sans text-xs font-light text-[#E4E9DF]">
      <div className="flex flex-1 overflow-hidden">
        {/* SideNavBar */}
        <aside className="hidden md:flex flex-col h-full w-80 bg-surface border-r border-outline-variant p-4 shrink-0 font-mono text-xs">
          <div className="mb-6 px-2">
            <div className="font-display font-bold text-primary text-base">Command Center</div>
            <div className="text-on-surface-variant uppercase mt-1">Vigilant Operations</div>
          </div>
          <nav className="flex flex-col gap-1.5 flex-1">
            <Link to="/risk-zone-id" className="flex items-center gap-3 p-3 text-on-surface-variant hover:bg-surface-container-high transition-colors rounded-lg">
              <span className="material-symbols-outlined text-[20px]">gpp_maybe</span>
              <span>Risk Zones</span>
            </Link>
            <Link to="/relocation-priority" className="flex items-center gap-3 p-3 text-on-surface-variant hover:bg-surface-container-high transition-colors rounded-lg">
              <span className="material-symbols-outlined text-[20px]">priority_high</span>
              <span>Priority Matrix</span>
            </Link>
            <Link to="/risk-alerts" className="flex items-center gap-3 p-3 bg-secondary-container text-on-secondary-container font-semibold rounded-lg shadow-sm">
              <span className="material-symbols-outlined text-[20px]">add_alert</span>
              <span>Active Alerts</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content Canvas */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          <div className="flex justify-between items-center mb-8 border-b border-outline-variant pb-6">
            <div>
              <h1 className="font-display font-bold text-2xl md:text-3xl text-primary mb-1">Active Alerts Dispatch</h1>
              <p className="font-sans text-sm text-on-surface-variant">Real-time risk notifications requiring immediate command attention.</p>
            </div>
          </div>

          {/* Success Banner */}
          {showSuccessModal && (
            <div className="mb-6 p-4 bg-safe-green/10 border border-safe-green text-safe-green rounded-xl font-mono text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              Emergency alert successfully transmitted across selected distribution channels!
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Alert Feed Section */}
            <div className="lg:col-span-7 flex flex-col gap-4 font-mono text-xs">
              <h2 className="font-display font-bold text-lg text-primary mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#DC2626]">notifications_active</span>
                Live Emergency Feed ({alerts.length})
              </h2>

              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`bg-surface border-l-4 rounded-xl p-5 shadow-sm relative overflow-hidden transition-all ${
                    alert.acknowledged ? 'opacity-60 border-l-gray-400' : ''
                  }`}
                  style={{ borderLeftColor: alert.acknowledged ? '#94a3b8' : alert.color }}
                >
                  <div
                    className="absolute top-0 right-0 font-mono text-[10px] px-3 py-1 uppercase rounded-bl-lg text-white font-bold"
                    style={{ backgroundColor: alert.acknowledged ? '#94a3b8' : alert.color }}
                  >
                    {alert.acknowledged ? 'Acknowledged' : alert.severity}
                  </div>

                  <div className="flex gap-4 items-start">
                    <span
                      className="material-symbols-outlined text-3xl mt-1"
                      style={{ color: alert.acknowledged ? '#94a3b8' : alert.color }}
                    >
                      {alert.severity === 'Critical' ? 'warning' : 'error'}
                    </span>
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-display font-bold text-base text-primary">{alert.zone}</h3>
                        <span className="text-on-surface-variant text-[11px] mr-24">{alert.time}</span>
                      </div>
                      <p className="font-sans text-xs text-on-surface-variant mb-4">{alert.desc}</p>
                      <div className="flex gap-3">
                        {!alert.acknowledged ? (
                          <button
                            onClick={() => handleAcknowledge(alert.id)}
                            className="bg-[#DC2626] text-white px-4 py-2 rounded font-mono text-xs font-bold hover:bg-red-700 transition-colors shadow-sm"
                          >
                            Acknowledge Risk
                          </button>
                        ) : (
                          <span className="text-safe-green font-mono text-xs font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">check</span> Response Dispatched
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Alert Creation Form */}
            <div className="lg:col-span-5">
              <div className="bg-surface border border-outline-variant rounded-xl p-6 shadow-sm sticky top-6 font-mono text-xs">
                <h2 className="font-display font-bold text-lg text-primary mb-4 border-b border-outline-variant pb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">campaign</span>
                  Broadcast New Alert
                </h2>

                <form onSubmit={handleTransmitAlert} className="space-y-4">
                  <div>
                    <label className="block text-primary font-bold mb-1">Target Zone</label>
                    <select
                      value={targetZone}
                      onChange={(e) => setTargetZone(e.target.value)}
                      className="w-full h-10 border border-outline-variant rounded px-3 font-mono text-xs bg-surface focus:ring-1 focus:ring-primary outline-none"
                    >
                      <option value="Village A">Village A (Valley Delta)</option>
                      <option value="Village B">Village B (Coastal Cliff)</option>
                      <option value="Northern Sector">Northern Sector Grid</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-primary font-bold mb-1">Severity Level</label>
                    <div className="flex gap-2">
                      {['critical', 'high', 'advisory'].map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setSeverity(lvl)}
                          className={`flex-1 py-2 border rounded font-mono text-xs uppercase font-bold transition-colors ${
                            severity === lvl
                              ? lvl === 'critical'
                                ? 'bg-[#DC2626] text-white border-[#DC2626]'
                                : lvl === 'high'
                                ? 'bg-[#f97316] text-white border-[#f97316]'
                                : 'bg-[#eab308] text-white border-[#eab308]'
                              : 'bg-surface border-outline-variant text-on-surface-variant'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-primary font-bold mb-1">Message Preview</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Enter emergency broadcast telemetry..."
                      className="w-full border border-outline-variant rounded p-3 font-sans text-xs bg-surface focus:ring-1 focus:ring-primary outline-none h-24 resize-none"
                      required
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-primary font-bold mb-2">Distribution Channels</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={channels.sms}
                          onChange={(e) => setChannels({ ...channels, sms: e.target.checked })}
                          className="rounded border-outline-variant text-primary"
                        />
                        <span className="material-symbols-outlined text-on-surface-variant text-[18px]">sms</span>
                        <span>SMS Direct Telemetry</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={channels.app}
                          onChange={(e) => setChannels({ ...channels, app: e.target.checked })}
                          className="rounded border-outline-variant text-primary"
                        />
                        <span className="material-symbols-outlined text-on-surface-variant text-[18px]">notifications_active</span>
                        <span>App Push Notification</span>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#0F172A] text-white h-10 rounded font-mono text-xs font-bold uppercase tracking-wider hover:bg-primary-container transition-colors flex items-center justify-center gap-2 mt-4 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[18px]">send</span>
                    Transmit Emergency Alert
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
