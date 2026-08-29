import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import SafeZonesLogo from './SafeZonesLogo';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const id = location.state.scrollTo;
      setTimeout(() => {
        const el = document.getElementById(id) || document.getElementById('footer');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
      }, 150);
    }
  }, [location]);

  const handleScrollTo = (id) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: id } });
    } else {
      const el = document.getElementById(id) || document.getElementById('footer');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }
    }
  };

  const handleHomeClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-[#080C08]/95 backdrop-blur border-b border-[rgba(228,233,223,0.055)] w-full sticky top-0 z-50 transition-colors">
      <div className="flex justify-between items-center w-full px-6 lg:px-[60px] h-[70px] max-w-[1440px] mx-auto relative">
        {/* Brand Logo */}
        <Link to="/" onClick={handleHomeClick} className="flex items-center gap-3 group">
          <div className="flex items-center justify-center text-[#86A978] transition-transform group-hover:scale-105">
            <SafeZonesLogo className="h-8 w-auto text-[#86A978]" color="#86A978" />
          </div>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-[32px] xl:gap-[42px] h-full">
          <NavLink
            to="/"
            onClick={handleHomeClick}
            className={({ isActive }) =>
              `text-[15px] font-light transition-colors tracking-tight ${
                isActive
                  ? 'text-[#C1C8BB] font-normal border-b border-[#7A9A6E] pb-1'
                  : 'text-[#777C70] hover:text-[#C1C8BB]'
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/risk-zone-id"
            className={({ isActive }) =>
              `text-[15px] font-light transition-colors tracking-tight ${
                isActive
                  ? 'text-[#C1C8BB] font-normal border-b border-[#7A9A6E] pb-1'
                  : 'text-[#777C70] hover:text-[#C1C8BB]'
              }`
            }
          >
            Dashboard
          </NavLink>

          <button
            onClick={() => handleScrollTo('privacy')}
            className="text-[15px] font-light text-[#777C70] hover:text-[#C1C8BB] transition-colors tracking-tight"
          >
            Privacy Policy
          </button>

          <button
            onClick={() => handleScrollTo('about')}
            className="text-[15px] font-light text-[#777C70] hover:text-[#C1C8BB] transition-colors tracking-tight"
          >
            About
          </button>

          <button
            onClick={() => handleScrollTo('contact')}
            className="text-[15px] font-light text-[#777C70] hover:text-[#C1C8BB] transition-colors tracking-tight"
          >
            Contact
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => navigate('/login')}
            className="h-[40px] px-5 rounded-full bg-[#6F9164] hover:bg-[#86A978] text-[#0A0E09] font-medium text-xs tracking-wide transition-all shadow-lg hover:-translate-y-0.5 flex items-center gap-2"
          >
            <span>Login</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>

          {/* Emergency Alert Toggle */}
          <button
            onClick={() => setEmergencyActive(!emergencyActive)}
            title="Toggle Live Emergency State"
            className={`p-2 rounded-full border transition-colors ${
              emergencyActive 
                ? 'bg-[#DC2626]/20 border-[#DC2626] text-[#DC2626] animate-pulse' 
                : 'border-[rgba(228,233,223,0.08)] text-[#777C70] hover:text-[#E4E9DF]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">warning</span>
          </button>

          {/* Settings Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              title="Settings"
              className={`p-2 rounded-full border transition-colors ${
                settingsOpen
                  ? 'border-[#7A9A6E] text-[#86A978] bg-[#0D120C]'
                  : 'border-[rgba(228,233,223,0.08)] text-[#777C70] hover:text-[#E4E9DF]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">settings</span>
            </button>

            {/* Dropdown Menu */}
            {settingsOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-[#0D120C] border border-[rgba(122,154,110,0.3)] rounded-[14px] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.85)] backdrop-blur-md z-50 animate-fade-in">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[rgba(228,233,223,0.06)]">
                  <span className="text-[12px] font-medium text-[#E4E9DF] tracking-wide flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-[#86A978]">settings</span>
                    Settings
                  </span>
                </div>
                <div className="py-4 text-center text-[#565C51] italic text-[11px]">
                  No active settings configured
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#B0B5A8] hover:text-[#E4E9DF]"
          >
            <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Emergency Active Alert Banner */}
      {emergencyActive && (
        <div className="bg-[#0D120C] border-b border-[#DC2626]/40 text-[#E4E9DF] px-6 py-2.5 text-xs font-light flex items-center justify-between">
          <div className="flex items-center gap-3 max-w-[1440px] mx-auto w-full">
            <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-ping"></span>
            <span className="text-[#C1B99D] uppercase tracking-wider text-[11px]">Terrain Telemetry Emergency:</span>
            <span className="text-[#B0B5A8]">Live evacuation protocol active for Sector 4 (Valley Delta). Contour telemetry update in progress.</span>
          </div>
          <button onClick={() => setEmergencyActive(false)} className="text-[#777C70] hover:text-[#E4E9DF] text-[11px] uppercase tracking-wider">
            Dismiss
          </button>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#080C08] border-b border-[rgba(228,233,223,0.08)] px-6 py-6 flex flex-col gap-4">
          <NavLink
            to="/"
            onClick={handleHomeClick}
            className={({ isActive }) =>
              `py-2 text-base font-light transition-colors ${
                isActive ? 'text-[#86A978] font-normal' : 'text-[#777C70]'
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/risk-zone-id"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `py-2 text-base font-light transition-colors ${
                isActive ? 'text-[#86A978] font-normal' : 'text-[#777C70]'
              }`
            }
          >
            Dashboard
          </NavLink>

          <button
            onClick={() => handleScrollTo('privacy')}
            className="py-2 text-left text-base font-light text-[#777C70] hover:text-[#86A978] transition-colors"
          >
            Privacy Policy
          </button>

          <button
            onClick={() => handleScrollTo('about')}
            className="py-2 text-left text-base font-light text-[#777C70] hover:text-[#86A978] transition-colors"
          >
            About
          </button>

          <button
            onClick={() => handleScrollTo('contact')}
            className="py-2 text-left text-base font-light text-[#777C70] hover:text-[#86A978] transition-colors"
          >
            Contact
          </button>
        </div>
      )}
    </header>
  );
}
