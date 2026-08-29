import React from 'react';
import SafeZonesLogo from './SafeZonesLogo';

export default function Footer() {
  return (
    <footer id="footer" className="bg-[#060906] border-t border-[rgba(228,233,223,0.06)] w-full mt-auto relative z-10 py-12">
      <div className="w-full px-6 lg:px-[60px] max-w-[1440px] mx-auto flex flex-col gap-10 font-sans text-xs font-light text-[#777C70]">
        
        {/* Footer Top Grid: About, Privacy Policy, Contact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-[rgba(228,233,223,0.05)]">
          {/* About Section */}
          <div id="about" className="flex flex-col gap-3 scroll-mt-28">
            <h4 className="text-[13px] font-normal text-[#E4E9DF] uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#7A9A6E]"></span>
              About Safe Zones
            </h4>
            <p className="text-[#8B9184] leading-relaxed text-[13px]">
              Safe Zones is an atmospheric Geospatial & Terrain Intelligence system providing real-time hazard detection, carrying capacity assessments, and emergency evacuation modeling across vulnerable sectors.
            </p>
          </div>

          {/* Privacy Policy Section */}
          <div id="privacy" className="flex flex-col gap-3 scroll-mt-28">
            <h4 className="text-[13px] font-normal text-[#E4E9DF] uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#7A9A6E]"></span>
              Privacy & Data Policy
            </h4>
            <p className="text-[#8B9184] leading-relaxed text-[13px]">
              Telemetry data and risk telemetry metrics are encrypted under atmospheric security protocols. All geospatial coordinates are strictly utilized for life-safety routing and public hazard mitigation.
            </p>
          </div>

          {/* Contact Section */}
          <div id="contact" className="flex flex-col gap-3 scroll-mt-28">
            <h4 className="text-[13px] font-normal text-[#E4E9DF] uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#7A9A6E]"></span>
              Contact Control Center
            </h4>
            <div className="text-[#8B9184] leading-relaxed text-[13px] flex flex-col gap-1.5">
              <p><span className="text-[#E4E9DF]">Emergency Command:</span> ops@safezones-intelligence.gov</p>
              <p><span className="text-[#E4E9DF]">Geospatial Support:</span> telemetry@safezones-intelligence.gov</p>
              <p><span className="text-[#E4E9DF]">Hotline:</span> +1 (800) 555-TERRAIN</p>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <SafeZonesLogo className="h-5 w-auto text-[#86A978]" color="#86A978" />
            <span className="text-[#565C51]">|</span>
            <span className="tracking-wide">
              © 2026 Cartographic Terrain System. Atmospheric Intelligence Protocol.
            </span>
          </div>
          <div className="flex items-center gap-2 text-[#7A9A6E] border border-[rgba(122,154,110,0.2)] bg-[#0D120C] px-3 py-1 rounded-full text-[11px] tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#86A978] animate-pulse"></span>
            Terrain System: Nominal
          </div>
        </div>
      </div>
    </footer>
  );
}
