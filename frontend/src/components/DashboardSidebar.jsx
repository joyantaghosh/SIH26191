import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function DashboardSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    {
      name: 'Risk Zone Overview',
      path: '/risk-zone-id',
      altPaths: ['/settlement-risk-map'],
      icon: 'gpp_maybe',
    },
    {
      name: 'Relocation Routing',
      path: '/evacuation-route',
      icon: 'alt_route',
    },
    {
      name: 'Capacity',
      path: '/carrying-capacity',
      icon: 'equalizer',
    },
    {
      name: 'Alerts',
      path: '/risk-alerts',
      icon: 'warning',
    },
    {
      name: 'Priority',
      path: '/relocation-priority',
      icon: 'priority_high',
    },
  ];

  return (
    <aside className="hidden md:flex flex-col h-full w-64 bg-[#0D120C]/90 border-r border-[rgba(228,233,223,0.08)] p-5 shrink-0 z-30 backdrop-blur-md">
      {/* Header */}
      <div className="mb-6 px-2">
        <span className="text-[10px] uppercase tracking-[0.16em] text-[#7A9A6E] font-mono">
          Terrain Operations
        </span>
        <h2 className="font-display font-light text-[#E4E9DF] text-lg mt-0.5 tracking-tight">
          Dashboard
        </h2>
      </div>

      {/* Common Dashboard Nav List */}
      <nav className="flex flex-col gap-2 flex-1">
        {navItems.map((item) => {
          const isActive =
            currentPath === item.path || (item.altPaths && item.altPaths.includes(currentPath));

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-[12px] text-xs font-light transition-all duration-200 ${
                isActive
                  ? 'bg-[#080C08] border border-[rgba(122,154,110,0.45)] text-[#86A978] shadow-[0_4px_16px_rgba(0,0,0,0.5)] font-normal'
                  : 'text-[#777C70] hover:text-[#E4E9DF] hover:bg-[#080C08]/60 hover:border hover:border-[rgba(228,233,223,0.08)]'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[20px] ${
                  isActive ? 'text-[#86A978]' : 'text-[#777C70]'
                }`}
              >
                {item.icon}
              </span>
              <span>{item.name}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#7A9A6E] animate-pulse"></span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* System Operational Telemetry Badge */}
      <div className="mt-auto p-3.5 rounded-[12px] bg-[#080C08]/80 border border-[rgba(228,233,223,0.06)] flex items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-[#7A9A6E] animate-ping"></span>
        <div className="flex flex-col">
          <span className="text-[10px] text-[#7A9A6E] uppercase tracking-wider font-mono">Stream Status</span>
          <span className="text-[11px] text-[#E4E9DF] font-light">GIS Telemetry Active</span>
        </div>
      </div>
    </aside>
  );
}
