import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SafeZonesLogo from '../components/SafeZonesLogo';

export default function LoginPage() {
  const [email, setEmail] = useState('officer@safezones.gov.in');
  const [password, setPassword] = useState('••••••••••••');
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
        navigate('/risk-zone-id');
      }, 800);
    }, 600);
  };

  return (
    <div className="flex-grow flex items-center justify-center p-6 bg-transparent font-sans text-[#E4E9DF] relative z-10">
      <div className="w-full max-w-[440px] bg-[#0D120C]/90 rounded-[17px] border border-[rgba(122,154,110,0.18)] shadow-[0_20px_60px_rgba(0,0,0,0.5)] p-8 sm:p-10 backdrop-blur-md">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="mb-2 text-[#86A978]">
            <SafeZonesLogo className="h-14 w-auto text-[#86A978]" color="#86A978" />
          </div>
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

            {/* Login with Google Button */}
            <div>
              <label className="block text-[11px] font-light text-[#777C70] uppercase tracking-[0.16em] mb-2">
                Single Sign-On
              </label>
              <button
                type="button"
                onClick={handleLogin}
                className="w-full h-11 px-4 border border-[rgba(228,233,223,0.12)] hover:border-[rgba(122,154,110,0.5)] rounded-[12px] bg-[#080C08] hover:bg-[#0D120C] text-[#E4E9DF] transition-all text-xs font-light tracking-wide flex items-center justify-center gap-3 cursor-pointer group shadow-sm"
              >
                <svg className="w-4 h-4 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8s.1-2 .4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                  />
                </svg>
                <span>Login with Google</span>
              </button>
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
