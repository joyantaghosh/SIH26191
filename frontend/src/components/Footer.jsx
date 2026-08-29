import React from 'react';
import SafeZonesLogo from './SafeZonesLogo';

export default function Footer() {
  return (
    <footer className="bg-[#060906] border-t border-[rgba(228,233,223,0.06)] w-full mt-auto relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-center w-full px-6 lg:px-[60px] py-8 max-w-[1440px] mx-auto gap-4 font-sans text-xs font-light text-[#777C70]">
        <div className="flex items-center gap-3">
          <SafeZonesLogo className="h-5 w-auto text-[#86A978]" color="#86A978" />
          <span className="font-display font-light text-[#DDE3D8] text-sm tracking-tight">Safe Zones</span>
          <span className="text-[#565C51]">|</span>
          <span className="tracking-wide">
            © 2026 Safe Zones Cartographic Terrain System. Atmospheric Intelligence Protocol.
          </span>
        </div>
        <nav className="flex flex-wrap items-center gap-6">
          <span className="hover:text-[#B0B5A8] transition-colors cursor-pointer tracking-wider uppercase text-[11px]">
            Contour Telemetry
          </span>
          <span className="hover:text-[#B0B5A8] transition-colors cursor-pointer tracking-wider uppercase text-[11px]">
            Terrain Protocol
          </span>
          <span className="hover:text-[#B0B5A8] transition-colors cursor-pointer tracking-wider uppercase text-[11px]">
            Access Matrix
          </span>
          <div className="flex items-center gap-2 text-[#7A9A6E] border border-[rgba(122,154,110,0.2)] bg-[#0D120C] px-3 py-1 rounded-full text-[11px] tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#86A978] animate-pulse"></span>
            Terrain System: Nominal
          </div>
        </nav>
      </div>
    </footer>
  );
}
