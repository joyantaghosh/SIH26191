import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import RainScreenEffect from '../components/RainScreenEffect';

export default function HomePage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      // Normalized coordinates from -1 to 1
      const x = (e.clientX - innerWidth / 2) / (innerWidth / 2);
      const y = (e.clientY - innerHeight / 2) / (innerHeight / 2);
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="flex-grow flex flex-col w-full relative z-10">
      {/* Rain Screen Water Drop Refraction Effect */}
      <RainScreenEffect />

      {/* Hero Section with Foreground vs Midground Parallax Depth */}
      <section className="w-full max-w-[1440px] mx-auto px-6 lg:px-[60px] pt-[60px] pb-[96px] min-h-[700px] flex flex-col justify-between relative animate-fade-in-up">
        <div className="grid lg:grid-cols-12 gap-12 items-start pt-6">
          
          {/* FOREGROUND LAYER 1: Editorial Content Column (Foreground Floating Plane) */}
          <div 
            className="lg:col-span-7 flex flex-col z-20 transition-transform duration-300 ease-out"
            style={{
              transform: `translate3d(${-mousePos.x * 22}px, ${-mousePos.y * 16}px, 0px)`,
            }}
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-4 mb-10">
              <span className="w-9 h-[1px] bg-[#7A9A6E] animate-pulse"></span>
              <span className="font-sans text-[13px] font-normal tracking-[0.13em] text-[#7A9A6E] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                Meridian Geo — Cartographic Terrain Protocol
              </span>
            </div>

            {/* Display XL Heading with Crisp Foreground Projection */}
            <h1 className="font-display text-[54px] sm:text-[72px] lg:text-[84px] font-extralight text-[#E4E9DF] leading-[0.98] tracking-[-0.04em] max-w-[720px] mb-8 drop-shadow-[0_12px_32px_rgba(0,0,0,0.9)]">
              Geospatial Terrain <span className="text-[#86A978] drop-shadow-[0_0_24px_rgba(134,169,120,0.4)]">Intelligence.</span>
            </h1>

            {/* Body Description */}
            <p className="font-sans text-[18px] sm:text-[20px] font-light text-[#777C70] leading-[1.7] max-w-[680px] mb-12 drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
              Atmospheric cartographic field for high-stakes risk identification, carrying capacity calculations, and precision relocation modeling across vulnerable terrain sectors.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6">
              <Link
                to="/risk-zone-id"
                className="w-full sm:w-[255px] h-[60px] bg-[#080C08]/90 border border-[rgba(122,154,110,0.4)] hover:border-[rgba(134,169,120,0.8)] hover:bg-[#0D120C] text-[#E4E9DF] rounded-[17px] font-light text-[15px] flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.8)] hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(122,154,110,0.3)] group backdrop-blur-md"
              >
                <span>Explore Terrain Zones</span>
                <span className="material-symbols-outlined text-[18px] text-[#86A978] group-hover:translate-x-1.5 transition-transform duration-300">arrow_forward</span>
              </Link>
              
              <Link
                to="/relocation-priority"
                className="h-[60px] px-6 text-[#777C70] hover:text-[#B4BBAE] font-light text-[15px] flex items-center justify-center gap-2 transition-colors duration-300 hover:translate-x-1"
              >
                <span>Relocation Matrix</span>
                <span className="material-symbols-outlined text-[18px] text-[#8F8A76]">chevron_right</span>
              </Link>
            </div>
          </div>

          {/* MIDGROUND LAYER 2: Cartographic GIS Canvas Frame (Midground Suspended Plane) */}
          <div 
            className="lg:col-span-5 relative w-full h-[420px] lg:h-[500px] rounded-[17px] border border-[rgba(228,233,223,0.12)] bg-[#0D120C]/80 overflow-hidden shadow-[0_32px_90px_rgba(0,0,0,0.85)] flex items-center justify-center group backdrop-blur-md transition-transform duration-500 ease-out z-10"
            style={{
              transform: `translate3d(${mousePos.x * 24}px, ${mousePos.y * 18}px, 0px) rotateX(${-mousePos.y * 5}deg) rotateY(${mousePos.x * 7}deg)`,
              transformStyle: 'preserve-3d',
            }}
          >
            <img
              className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-40 group-hover:scale-105 transition-transform duration-700"
              alt="Cartographic Terrain Visualization"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoqddqtNvw7G19DsMeGja1zEfz3eOAtbmrP_KK5NPhhD6pgbYBJi1zf71nVOa1ftxUgookM2u4VPz2RgV4xoJb4_IOTvZ67MDkgBKLPQB3sVv_DybYB9Q90iuAQOUyYK-XfFFXNzq8Mi6vUycempL4E0DT_z74e3PbBGrNK18FVWNdzh1aV1aQ5f9S6_uq3AQMRLuKywPLN28ES6lSfj6jWNOn9AWafaMQADHHV_tXd-m-y9VAFWWa"
            />

            {/* Cartographic Legend (Floating Sub-plane) */}
            <div 
              className="absolute top-5 left-5 bg-[#080C08]/90 border border-[rgba(228,233,223,0.12)] p-4 rounded-[12px] flex flex-col gap-2.5 font-sans text-xs font-light backdrop-blur-lg shadow-[0_16px_40px_rgba(0,0,0,0.6)] animate-float-slow"
              style={{
                transform: `translate3d(${mousePos.x * 12}px, ${mousePos.y * 10}px, 20px)`,
              }}
            >
              <div className="text-[10px] uppercase tracking-[0.16em] text-[#7A9A6E] font-medium mb-1 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7A9A6E] animate-ping"></span>
                Contour Telemetry
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-pulse"></span>
                <span className="text-[#E4E9DF]">Critical Hazard Contour</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#C1B99D]"></span>
                <span className="text-[#B0B5A8]">Vulnerable Basin</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#7A9A6E]"></span>
                <span className="text-[#B0B5A8]">Nominal Safe Ridge</span>
              </div>
            </div>

            {/* Rotating Vector Reticle */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
              <div className="w-40 h-40 border border-dashed border-[rgba(122,154,110,0.5)] rounded-full flex items-center justify-center animate-radar-sweep">
                <div className="w-20 h-20 border border-[rgba(134,169,120,0.7)] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* FOREGROUND LAYER: Statistics Open Strip */}
        <div 
          className="w-full border-t border-[rgba(228,233,223,0.08)] pt-8 mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8 transition-transform duration-300 ease-out z-20"
          style={{
            transform: `translate3d(${-mousePos.x * 12}px, ${-mousePos.y * 8}px, 0px)`,
          }}
        >
          <div className="hover:-translate-y-2 transition-transform duration-300 p-4 rounded-[14px] bg-[#0D120C]/40 backdrop-blur-sm border border-[rgba(228,233,223,0.04)]">
            <div className="font-display font-extralight text-[36px] lg:text-[44px] text-[#DDE3D8] tracking-[-0.04em] drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
              98.4<span className="text-[#86A978]">%</span>
            </div>
            <div className="text-[11px] font-light tracking-[0.16em] text-[#777C70] uppercase mt-2">
              Contour Resolution Accuracy
            </div>
          </div>

          <div className="hover:-translate-y-2 transition-transform duration-300 p-4 rounded-[14px] bg-[#0D120C]/40 backdrop-blur-sm border border-[rgba(228,233,223,0.04)]">
            <div className="font-display font-extralight text-[36px] lg:text-[44px] text-[#DDE3D8] tracking-[-0.04em] drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
              14,200<span className="text-[#C1B99D]">k</span>
            </div>
            <div className="text-[11px] font-light tracking-[0.16em] text-[#777C70] uppercase mt-2">
              Assessed Shelter Spots
            </div>
          </div>

          <div className="hover:-translate-y-2 transition-transform duration-300 p-4 rounded-[14px] bg-[#0D120C]/40 backdrop-blur-sm border border-[rgba(228,233,223,0.04)]">
            <div className="font-display font-extralight text-[36px] lg:text-[44px] text-[#DDE3D8] tracking-[-0.04em] drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
              02<span className="text-[#86A978]">h</span>
            </div>
            <div className="text-[11px] font-light tracking-[0.16em] text-[#777C70] uppercase mt-2">
              Early Hazard Warning Buffer
            </div>
          </div>

          <div className="hover:-translate-y-2 transition-transform duration-300 p-4 rounded-[14px] bg-[#0D120C]/40 backdrop-blur-sm border border-[rgba(228,233,223,0.04)]">
            <div className="font-display font-extralight text-[36px] lg:text-[44px] text-[#DDE3D8] tracking-[-0.04em] drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
              24<span className="text-[#7A9A6E]">/7</span>
            </div>
            <div className="text-[11px] font-light tracking-[0.16em] text-[#777C70] uppercase mt-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7A9A6E] animate-pulse"></span>
              Live Telemetry Stream
            </div>
          </div>
        </div>
      </section>

      {/* Feature Sections - Elevating Foreground Cards */}
      <section className="w-full border-t border-[rgba(228,233,223,0.06)] py-20 bg-[#060906]/70 backdrop-blur-md relative z-20">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[60px]">
          <div className="mb-12">
            <span className="text-[12px] font-light tracking-[0.16em] text-[#7A9A6E] uppercase">Core Capabilities</span>
            <h2 className="font-display text-[32px] sm:text-[40px] font-extralight text-[#E4E9DF] mt-2 drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
              Cartographic Terrain Operations
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-[17px] bg-[#0D120C]/85 border border-[rgba(228,233,223,0.09)] hover:border-[rgba(122,154,110,0.45)] hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-all duration-300 flex flex-col justify-between group backdrop-blur-md">
              <div>
                <div className="w-10 h-10 rounded-full border border-[rgba(122,154,110,0.3)] bg-[#080C08] text-[#86A978] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#7A9A6E]/10 transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                  <span className="material-symbols-outlined text-[20px]">radar</span>
                </div>
                <h3 className="font-display text-[22px] font-light text-[#E4E9DF] mb-3">Hazard Identification</h3>
                <p className="font-sans text-[15px] font-light text-[#777C70] leading-relaxed">
                  Identify and classify high-risk habitation zones with sub-meter topographic precision using real-time contour telemetry.
                </p>
              </div>
              <Link to="/risk-zone-id" className="font-sans text-xs text-[#86A978] hover:text-[#E4E9DF] flex items-center gap-1 mt-8 transition-colors group-hover:translate-x-1">
                <span>View Risk Zones</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </Link>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-[17px] bg-[#0D120C]/85 border border-[rgba(228,233,223,0.09)] hover:border-[rgba(122,154,110,0.45)] hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-all duration-300 flex flex-col justify-between group backdrop-blur-md">
              <div>
                <div className="w-10 h-10 rounded-full border border-[rgba(122,154,110,0.3)] bg-[#080C08] text-[#86A978] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#7A9A6E]/10 transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                  <span className="material-symbols-outlined text-[20px]">equalizer</span>
                </div>
                <h3 className="font-display text-[22px] font-light text-[#E4E9DF] mb-3">Carrying Capacity</h3>
                <p className="font-sans text-[15px] font-light text-[#777C70] leading-relaxed">
                  Analyze water, power, shelter, and resource availability for safe sectors to ensure sustainable population relocation.
                </p>
              </div>
              <Link to="/carrying-capacity" className="font-sans text-xs text-[#86A978] hover:text-[#E4E9DF] flex items-center gap-1 mt-8 transition-colors group-hover:translate-x-1">
                <span>Check Capacity</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </Link>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-[17px] bg-[#0D120C]/85 border border-[rgba(228,233,223,0.09)] hover:border-[rgba(122,154,110,0.45)] hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-all duration-300 flex flex-col justify-between group backdrop-blur-md">
              <div>
                <div className="w-10 h-10 rounded-full border border-[rgba(122,154,110,0.3)] bg-[#080C08] text-[#86A978] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#7A9A6E]/10 transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                  <span className="material-symbols-outlined text-[20px]">alt_route</span>
                </div>
                <h3 className="font-display text-[22px] font-light text-[#E4E9DF] mb-3">Evacuation Routing</h3>
                <p className="font-sans text-[15px] font-light text-[#777C70] leading-relaxed">
                  Calculate optimal transit channels avoiding terrain mudslides, flash floods, and structural bottlenecks.
                </p>
              </div>
              <Link to="/evacuation-route" className="font-sans text-xs text-[#86A978] hover:text-[#E4E9DF] flex items-center gap-1 mt-8 transition-colors group-hover:translate-x-1">
                <span>Plan Routing</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
