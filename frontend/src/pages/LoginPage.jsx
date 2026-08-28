import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('officer@meridiangeo.gov.in');
  const [password, setPassword] = useState('••••••••••••');
  const [role, setRole] = useState('Cartographic Analyst');
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAuthenticated(true);
      setTimeout(() => {
        navigate('/settlement-risk-map');
      }, 800);
    }, 600);
  };

  return (
    <div className="flex-grow flex items-center justify-center p-6 bg-transparent font-sans text-[#E4E9DF] relative z-10">
      <div className="w-full max-w-[440px] bg-[#0D120C]/90 rounded-[17px] border border-[rgba(122,154,110,0.18)] shadow-[0_20px_60px_rgba(0,0,0,0.5)] p-8 sm:p-10 backdrop-blur-md">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border border-[rgba(122,154,110,0.3)] bg-[#080C08] flex items-center justify-center text-[#86A978] mb-4">
            <span className="material-symbols-outlined text-[24px]">explore</span>
          </div>
          <h1 className="font-display text-[26px] font-light text-[#E4E9DF] tracking-tight">Meridian Geo</h1>
          <p className="font-sans text-xs font-light text-[#777C70] uppercase tracking-[0.16em] mt-1.5">
            Terrain Access Authentication
          </p>
        </div>

        {authenticated ? (
          <div className="bg-[#0D120C] border border-[#7A9A6E]/40 p-6 rounded-[12px] text-center animate-fadeIn">
            <span className="material-symbols-outlined text-[#86A978] text-[36px] mb-2">verified</span>
            <p className="font-sans text-sm font-light text-[#E4E9DF] tracking-wide">Access Granted</p>
            <p className="font-sans text-xs font-light text-[#777C70] mt-1">Connecting to Cartographic Stream...</p>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[11px] font-light text-[#777C70] uppercase tracking-[0.16em] mb-2" htmlFor="email">
                Officer Telemetry Email
              </label>
              <input
                className="w-full h-11 px-4 border border-[rgba(228,233,223,0.08)] rounded-[12px] bg-[#080C08] text-[#E4E9DF] focus:border-[#7A9A6E] focus:outline-none transition-colors text-sm font-light"
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-light text-[#777C70] uppercase tracking-[0.16em] mb-2" htmlFor="password">
                Passcode
              </label>
              <input
                className="w-full h-11 px-4 border border-[rgba(228,233,223,0.08)] rounded-[12px] bg-[#080C08] text-[#E4E9DF] focus:border-[#7A9A6E] focus:outline-none transition-colors text-sm font-light"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-light text-[#777C70] uppercase tracking-[0.16em] mb-2" htmlFor="role">
                Operational Clearance
              </label>
              <select
                className="w-full h-11 px-4 border border-[rgba(228,233,223,0.08)] rounded-[12px] bg-[#080C08] text-[#E4E9DF] focus:border-[#7A9A6E] focus:outline-none transition-colors text-sm font-light cursor-pointer"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="Cartographic Analyst">Cartographic Analyst</option>
                <option value="Disaster Telemetry Director">Disaster Telemetry Director</option>
                <option value="Geospatial Specialist">Geospatial Specialist</option>
                <option value="Relocation Dispatcher">Relocation Dispatcher</option>
              </select>
            </div>

            <button
              className="w-full h-12 mt-4 bg-[#6F9164] hover:bg-[#86A978] text-[#0A0E09] font-medium text-xs uppercase tracking-wider rounded-[17px] transition-all flex items-center justify-center gap-2 shadow-[0_8px_28px_rgba(0,0,0,0.35)]"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                  Authenticating...
                </>
              ) : (
                <>
                  Enter Terrain Matrix
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </>
              )}
            </button>

            <div className="text-center pt-3">
              <span className="text-[11px] font-light text-[#777C70]">
                Request Credentials via Cartographic Protocol
              </span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
