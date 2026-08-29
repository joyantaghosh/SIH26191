import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import SafeZonesLogo from './SafeZonesLogo';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [emergencyActive, setEmergencyActive] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Risk Map', path: '/settlement-risk-map' },
    { name: 'Zone ID', path: '/risk-zone-id' },
    { name: 'Capacity', path: '/carrying-capacity' },
    { name: 'Evacuation', path: '/evacuation-route' },
    { name: 'Priority', path: '/relocation-priority' },
    { name: 'Alerts', path: '/risk-alerts' },
  ];

  return (
    <header className="bg-[#080C08]/95 backdrop-blur border-b border-[rgba(228,233,223,0.055)] w-full sticky top-0 z-50 transition-colors">
      <div className="flex justify-between items-center w-full px-6 lg:px-[60px] h-[96px] max-w-[1440px] mx-auto">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex items-center justify-center text-[#86A978] transition-transform group-hover:scale-105">
            <SafeZonesLogo className="h-8 w-auto text-[#86A978]" color="#86A978" />
          </div>
          <span className="text-[11px] font-mono font-light px-2.5 py-0.5 rounded-full border border-[rgba(228,233,223,0.08)] bg-[#0D120C] text-[#777C70] tracking-wider uppercase hidden sm:inline-block">
            Cartographic TERRAIN
          </span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-[32px] xl:gap-[42px] h-full">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `text-[15px] font-light transition-colors tracking-tight ${
                  isActive
                    ? 'text-[#C1C8BB] font-normal border-b border-[#7A9A6E] pb-1'
                    : 'text-[#777C70] hover:text-[#C1C8BB]'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/login')}
            className="hidden sm:flex items-center justify-center h-[42px] px-5 border border-[rgba(228,233,223,0.08)] rounded-full text-[#B0B5A8] hover:text-[#E4E9DF] hover:border-[rgba(122,154,110,0.3)] hover:bg-[#0D120C] transition-all text-xs font-light tracking-wide"
          >
            Login
          </button>
          
          <button
            onClick={() => navigate('/login')}
            className="h-[44px] px-6 rounded-full bg-[#6F9164] hover:bg-[#86A978] text-[#0A0E09] font-medium text-xs tracking-wide transition-all shadow-lg hover:-translate-y-0.5 flex items-center gap-2"
          >
            <span>Request Access</span>
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
        <div className="lg:hidden bg-[#080C08] border-b border-[rgba(228,233,223,0.08)] px-6 py-6 flex flex-col gap-3">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `py-2 text-base font-light transition-colors ${
                  isActive ? 'text-[#86A978] font-normal' : 'text-[#777C70]'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}
