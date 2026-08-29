import React, { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Hide on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      return;
    }

    const onMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Check if hovering interactive element
      const target = e.target;
      if (target) {
        const isInteractive =
          target.closest('button') ||
          target.closest('a') ||
          target.closest('input') ||
          target.closest('select') ||
          target.closest('textarea') ||
          target.closest('[role="button"]') ||
          target.closest('.interactive') ||
          window.getComputedStyle(target).cursor === 'pointer';

        setIsHovered(!!isInteractive);
      }
    };

    const onMouseDown = () => setIsClicked(true);
    const onMouseUp = () => setIsClicked(false);

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed top-0 left-0 pointer-events-none z-[9999] transition-opacity duration-300"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0px)`,
        opacity: isVisible ? 1 : 0,
      }}
    >
      {/* Container centered around cursor hotspot at (0,0) */}
      <div className="relative -top-[2px] -left-[2px] flex items-center justify-center">
        
        {/* Outer Ring Overlay (Matching SVG Images) */}
        <div
          className={`absolute rounded-full border transition-all duration-200 ease-out ${
            isHovered
              ? 'w-10 h-10 border-[#E879F9] bg-[#E879F9]/10 shadow-[0_0_16px_rgba(232,121,249,0.5)] scale-110'
              : 'w-7 h-7 border-[#E879F9]/60 bg-[#E879F9]/5 shadow-[0_0_8px_rgba(232,121,249,0.2)]'
          } ${isClicked ? 'scale-90 bg-[#E879F9]/25 border-[#E879F9]' : ''}`}
          style={{
            transform: 'translate(-35%, -35%)',
          }}
        />

        {/* Custom Arrow Pointer SVG matching the user uploaded assets */}
        <svg
          width="28"
          height="28"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`relative z-10 transition-transform duration-150 ${
            isClicked ? 'scale-95' : isHovered ? 'scale-105' : 'scale-100'
          }`}
        >
          {/* Black Stroke Shadow Layer */}
          <path
            d="M3 3L11.5 25.5L16.2 16.2L25.5 11.5L3 3Z"
            fill="#080C08"
            stroke="#080C08"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Off-white Arrow Body */}
          <path
            d="M3 3L11.5 25.5L16.2 16.2L25.5 11.5L3 3Z"
            fill="#F4F3EE"
            stroke="#080C08"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Accent Pink Dot at Bottom-Left of Pointer (from user's SVG image) */}
          <circle
            cx="7.5"
            cy="21.5"
            r="3.5"
            fill="#E879F9"
            stroke="#080C08"
            strokeWidth="1"
          />
        </svg>
      </div>
    </div>
  );
}
