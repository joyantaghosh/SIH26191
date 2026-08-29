import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SafeZonesLogo from '../components/SafeZonesLogo';
import { useAuth } from '../context/AuthContext';
import { getGoogleOAuthUrl } from '../services/authApi';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('officer@safezones.gov.in');
  const [password, setPassword] = useState('OfficerPass123!');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [authSuccess, setAuthSuccess] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const destination = location.state?.from?.pathname || '/risk-zone-id';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (isRegister) {
        if (!name.trim()) throw new Error('Please enter your full officer name.');
        await register({ name, email, password });
      } else {
        await login(email, password);
      }

      setAuthSuccess(true);
      setTimeout(() => {
        navigate(destination, { replace: true });
      }, 700);
    } catch (err) {
      console.error('[LoginPage] Auth error:', err.message);
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = getGoogleOAuthUrl();
  };

  const handleQuickDemoFill = () => {
    setIsRegister(false);
    setEmail('officer@safezones.gov.in');
    setPassword('OfficerPass123!');
    setErrorMsg(null);
  };

  return (
    <div className="flex-grow flex items-center justify-center p-6 bg-transparent font-sans text-[#E4E9DF] relative z-10 min-h-[calc(100vh-70px)]">
      <div className="w-full max-w-[440px] bg-[#0D120C]/95 rounded-[20px] border border-[rgba(122,154,110,0.22)] shadow-[0_24px_70px_rgba(0,0,0,0.8)] p-8 sm:p-10 backdrop-blur-md relative overflow-hidden animate-fade-in">
        {/* Cartographic Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#7A9A6E] to-transparent"></div>

        {/* Brand Header */}
        <div className="text-center mb-6 flex flex-col items-center">
          <div className="mb-2 text-[#86A978] transition-transform hover:scale-105">
            <SafeZonesLogo className="h-12 w-auto text-[#86A978]" color="#86A978" />
          </div>
          <h2 className="font-display font-light text-xl text-[#E4E9DF]">
            {isRegister ? 'Register Security Clearance' : 'Command Access Portal'}
          </h2>
          <p className="font-sans text-[11px] font-light text-[#777C70] uppercase tracking-[0.16em] mt-1">
            Terrain Intelligence Protocol
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center bg-[#080C08] p-1 rounded-[14px] border border-[rgba(228,233,223,0.08)] mb-6 font-mono text-xs">
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-[10px] transition-all ${
              !isRegister
                ? 'bg-[#1D2A1B] text-[#86A978] font-medium border border-[rgba(122,154,110,0.3)] shadow-sm'
                : 'text-[#777C70] hover:text-[#E4E9DF]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-[10px] transition-all ${
              isRegister
                ? 'bg-[#1D2A1B] text-[#86A978] font-medium border border-[rgba(122,154,110,0.3)] shadow-sm'
                : 'text-[#777C70] hover:text-[#E4E9DF]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <div className="mb-5 p-3.5 bg-[#EF4444]/15 border border-[#EF4444]/40 rounded-[12px] text-[#EF4444] text-xs font-mono flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success Splash */}
        {authSuccess ? (
          <div className="bg-[#080C08] border border-[#7A9A6E]/40 p-6 rounded-[16px] text-center animate-fade-in">
            <span className="material-symbols-outlined text-[#86A978] text-[40px] mb-2 animate-bounce">
              verified
            </span>
            <h3 className="font-display font-medium text-base text-[#E4E9DF]">Clearance Granted</h3>
            <p className="font-sans text-xs text-[#777C70] mt-1">Connecting to Cartographic Stream...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-[11px] font-mono text-[#777C70] uppercase tracking-wider mb-1.5" htmlFor="name">
                  Full Name / Call-Sign
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Officer Jane Doe"
                  className="w-full h-11 px-4 border border-[rgba(122,154,110,0.3)] rounded-[12px] bg-[#080C08] text-[#E4E9DF] text-xs focus:border-[#86A978] focus:outline-none transition-colors"
                  required={isRegister}
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] font-mono text-[#777C70] uppercase tracking-wider mb-1.5" htmlFor="email">
                Officer Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer@safezones.gov.in"
                className="w-full h-11 px-4 border border-[rgba(122,154,110,0.3)] rounded-[12px] bg-[#080C08] text-[#E4E9DF] text-xs focus:border-[#86A978] focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#777C70] uppercase tracking-wider mb-1.5" htmlFor="password">
                Passcode {isRegister && <span className="text-[10px] text-[#565C51]">(Min 8 chars, 1 uppercase, 1 digit)</span>}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-11 px-4 border border-[rgba(122,154,110,0.3)] rounded-[12px] bg-[#080C08] text-[#E4E9DF] text-xs focus:border-[#86A978] focus:outline-none transition-colors"
                required
              />
            </div>

            {/* Google Single Sign-On Button */}
            <div>
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full h-11 px-4 border border-[rgba(228,233,223,0.12)] hover:border-[rgba(122,154,110,0.5)] rounded-[12px] bg-[#080C08] hover:bg-[#0D120C] text-[#E4E9DF] transition-all text-xs font-mono tracking-wide flex items-center justify-center gap-3 cursor-pointer group shadow-sm"
              >
                <svg className="w-4 h-4 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                  <path fill="#FBBC05" d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8s.1-2 .4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z" />
                  <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>

            {/* Primary Submit Button */}
            <button
              className="w-full h-12 mt-2 bg-[#6F9164] hover:bg-[#86A978] disabled:opacity-50 text-[#080C08] font-mono text-xs font-semibold uppercase tracking-wider rounded-[14px] transition-all flex items-center justify-center gap-2 shadow-lg"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-[16px] animate-spin">autorenew</span>
                  Verifying Credentials...
                </>
              ) : (
                <>
                  {isRegister ? 'Complete Clearance Registration' : 'Enter Terrain Matrix'}
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </>
              )}
            </button>

            {/* Demo Quick Fill Button */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={handleQuickDemoFill}
                className="text-[11px] font-mono text-[#7A9A6E] hover:text-[#86A978] transition-colors underline decoration-dotted"
              >
                Auto-Fill Demo Officer Credentials
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
