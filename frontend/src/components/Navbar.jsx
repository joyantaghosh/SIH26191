import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import SafeZonesLogo from './SafeZonesLogo';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { user, isAuthenticated, logout } = useAuth();
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

  const handleLogout = async () => {
    setUserDropdownOpen(false);
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-[#080C08]/95 backdrop-blur border-b border-[rgba(228,233,223,0.055)] w-full sticky top-0 z-50 transition-colors font-sans">
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
            GIS Dashboard
          </NavLink>

          <NavLink
            to="/risk-alerts"
            className={({ isActive }) =>
              `text-[15px] font-light transition-colors tracking-tight flex items-center gap-1.5 ${
                isActive
                  ? 'text-[#C1C8BB] font-normal border-b border-[#7A9A6E] pb-1'
                  : 'text-[#777C70] hover:text-[#C1C8BB]'
              }`
            }
          >
            <span>Alerts</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-pulse"></span>
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
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Emergency Alert Shortcut */}
          <button
            onClick={() => navigate('/risk-alerts')}
            title="Active Emergency Telemetry"
            className="p-2 rounded-full border border-[rgba(228,233,223,0.08)] hover:border-[#EF4444] text-[#777C70] hover:text-[#EF4444] transition-colors flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[18px]">warning</span>
          </button>

          {/* User Auth Section */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="h-[40px] px-3.5 rounded-full bg-[#0D120C] border border-[rgba(122,154,110,0.35)] hover:border-[#86A978] text-[#E4E9DF] text-xs font-mono flex items-center gap-2 transition-all shadow-md"
              >
                <div className="w-6 h-6 rounded-full bg-[#1D2A1B] text-[#86A978] border border-[rgba(122,154,110,0.4)] flex items-center justify-center font-bold text-[11px]">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'O'}
                </div>
                <span className="max-w-[100px] truncate hidden sm:inline">{user?.name || 'Officer'}</span>
                <span className="material-symbols-outlined text-[14px] text-[#777C70]">expand_more</span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#0D120C] border border-[rgba(122,154,110,0.3)] rounded-[16px] p-3 shadow-[0_16px_40px_rgba(0,0,0,0.9)] backdrop-blur-md z-50 animate-fade-in font-mono text-xs">
                  <div className="px-2 py-1.5 border-b border-[rgba(228,233,223,0.06)] mb-2">
                    <div className="font-medium text-[#E4E9DF] truncate">{user?.name || 'Authorized Officer'}</div>
                    <div className="text-[10px] text-[#777C70] truncate">{user?.email}</div>
                    <span className="inline-block mt-1 text-[9px] uppercase px-1.5 py-0.5 rounded bg-[#1D2A1B] text-[#86A978] border border-[rgba(122,154,110,0.2)]">
                      {user?.role || 'user'} clearance
                    </span>
                  </div>

                  <Link
                    to="/risk-zone-id"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-[#B0B5A8] hover:text-[#E4E9DF] hover:bg-[#1D2A1B]/60 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[#86A978]">dashboard</span>
                    <span>GIS Dashboard</span>
                  </Link>

                  <Link
                    to="/risk-alerts"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-[#B0B5A8] hover:text-[#E4E9DF] hover:bg-[#1D2A1B]/60 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[#EF4444]">notifications_active</span>
                    <span>Live Alerts</span>
                  </Link>

                  <div className="pt-2 mt-1 border-t border-[rgba(228,233,223,0.06)]">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors text-left"
                    >
                      <span className="material-symbols-outlined text-[16px]">logout</span>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="h-[40px] px-5 rounded-full bg-[#6F9164] hover:bg-[#86A978] text-[#0A0E09] font-medium text-xs tracking-wide transition-all shadow-lg hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span>Login</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#B0B5A8] hover:text-[#E4E9DF]"
          >
            <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0D120C] border-b border-[rgba(228,233,223,0.08)] px-6 py-4 space-y-3 font-mono text-xs">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#B0B5A8] hover:text-[#E4E9DF]"
          >
            Home
          </Link>
          <Link
            to="/risk-zone-id"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#B0B5A8] hover:text-[#E4E9DF]"
          >
            GIS Dashboard
          </Link>
          <Link
            to="/risk-alerts"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#B0B5A8] hover:text-[#E4E9DF]"
          >
            Early Warning Alerts
          </Link>
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="block w-full text-left py-2 text-[#EF4444]"
            >
              Sign Out ({user?.name || user?.email})
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#86A978] font-medium"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
