import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SafeZonesLogo from './SafeZonesLogo';

export default function DashboardSidebar({ extraContent }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    {
      label: 'Risk Zone Overview',
      path: '/risk-zone-id',
      icon: 'gpp_maybe',
      badge: 'GIS Live',
    },
    {
      label: 'Settlement Risk Map',
      path: '/settlement-risk-map',
      icon: 'map',
      badge: 'Contour',
    },
    {
      label: 'Relocation Routing',
      path: '/evacuation-route',
      icon: 'alt_route',
      badge: 'Transit',
    },
    {
      label: 'Capacity',
      path: '/carrying-capacity',
      icon: 'query_stats',
      badge: 'Metrics',
    },
    {
      label: 'Alerts',
      path: '/risk-alerts',
      icon: 'warning',
      badge: 'Live Broadcast',
      badgeColor: 'bg-[#DC2626]/20 text-[#DC2626] border-[#DC2626]/40',
    },
    {
      label: 'Priority',
      path: '/relocation-priority',
      icon: 'priority_high',
      badge: 'Matrix',
    },
  ];

  return (
    <>
      {/* Mobile Drawer Toggle Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0D120C] border-b border-[rgba(228,233,223,0.08)] z-30 shrink-0">
        <div className="flex items-center gap-2">
          <SafeZonesLogo className="h-4 w-auto text-[#86A978]" color="#86A978" />
          <span className="text-[11px] font-light uppercase tracking-[0.16em] text-[#E4E9DF]">
            Dashboard Navigation
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 rounded-[8px] bg-[#080C08] border border-[rgba(228,233,223,0.12)] text-[#E4E9DF] hover:border-[#7A9A6E]"
        >
          <span className="material-symbols-outlined text-[20px]">
            {mobileOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Main Sidebar (Desktop + Mobile Drawer) */}
      <aside
        className={`${
          mobileOpen ? 'flex' : 'hidden'
        } md:flex flex-col h-full w-64 lg:w-72 bg-[#0D120C]/95 border-r border-[rgba(228,233,223,0.08)] p-5 shrink-0 z-40 font-sans text-xs font-light backdrop-blur-md overflow-y-auto transition-all`}
      >
        {/* Header Branding */}
        <div className="mb-6 px-1 border-b border-[rgba(228,233,223,0.06)] pb-4">
          <div className="flex items-center gap-2 mb-2">
            <SafeZonesLogo className="h-6 w-auto text-[#86A978]" color="#86A978" />
            <span className="text-[10px] uppercase tracking-[0.16em] text-[#7A9A6E] font-medium">
              Dashboard Navigation
            </span>
          </div>
          <h2 className="font-display font-light text-[#E4E9DF] text-lg leading-tight">
            <span className="text-[#86A978]">Telemetry</span> Protocol
          </h2>
          <p className="text-[11px] text-[#777C70] mt-0.5 font-light">
            Real-time Geospatial Protocol
          </p>
        </div>

        {/* Primary Dashboard Links */}
        <nav className="space-y-1.5 flex-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`group flex items-center justify-between px-3.5 py-2.5 rounded-[12px] transition-all duration-200 ${
                  isActive
                    ? 'bg-[#080C08] border border-[rgba(122,154,110,0.35)] text-[#86A978] shadow-[0_4px_16px_rgba(122,154,110,0.12)]'
                    : 'text-[#777C70] hover:text-[#E4E9DF] hover:bg-[#080C08]/60 border border-transparent hover:border-[rgba(228,233,223,0.06)]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`material-symbols-outlined text-[19px] transition-colors ${
                      isActive ? 'text-[#86A978]' : 'text-[#777C70] group-hover:text-[#E4E9DF]'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="font-light text-[12px] tracking-wide">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      item.badgeColor
                        ? item.badgeColor
                        : isActive
                        ? 'bg-[#7A9A6E]/20 text-[#86A978] border-[#7A9A6E]/40'
                        : 'bg-[#080C08] text-[#565C51] border-[rgba(228,233,223,0.06)]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Optional Page-Specific Controls / Filters Slot */}
        {extraContent && (
          <div className="mt-6 border-t border-[rgba(228,233,223,0.08)] pt-4 space-y-4">
            {extraContent}
          </div>
        )}

        {/* System Status Footer */}
        <div className="mt-auto border-t border-[rgba(228,233,223,0.08)] pt-4 px-1">
          <div className="flex items-center justify-between text-[10px] text-[#777C70]">
            <span className="uppercase tracking-[0.14em]">Telemetry Status</span>
            <span className="text-[#86A978] font-mono">ONLINE 60FPS</span>
          </div>
          <div className="mt-2 w-full bg-[#080C08] h-1 rounded-full overflow-hidden border border-[rgba(228,233,223,0.06)]">
            <div className="bg-[#7A9A6E] h-full w-[85%] animate-pulse"></div>
          </div>
        </div>
      </aside>
    </>
  );
}
