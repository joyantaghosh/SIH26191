import React from 'react';

export default function SafeZonesLogo({ className = "h-8 w-auto", color = "currentColor", iconOnly = false, ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={iconOnly ? "0 0 130 140" : "0 0 550 140"}
      role="img"
      aria-labelledby="logoTitle logoDesc"
      className={`logo-svg transition-all ${className}`}
      {...props}
    >
      <title id="logoTitle">Safe Zones</title>
      <desc id="logoDesc">Safe Zones official solid pin logo with filled dot O typography.</desc>

      <style>{`
        .logo-pin-glow {
          transform-origin: center;
          animation: pinPulse 4s ease-in-out infinite;
        }
        @keyframes pinPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
      `}</style>

      {/* Solid Location Pin Emblem */}
      <g className="logo-pin-glow" transform="translate(10, 5)">
        <path
          d="M 55 5 
             C 24 5, 0 29, 0 60 
             C 0 96, 55 132, 55 132 
             C 55 132, 110 96, 110 60 
             C 110 29, 86 5, 55 5 Z"
          fill={color}
        />
      </g>

      {/* Stylized SAFEZONES Typography */}
      {!iconOnly && (
        <g fill={color} transform="translate(142, 42)">
          {/* S */}
          <path d="M 28 14 C 28 8, 22 4, 14 4 C 6 4, 2 8, 2 14 C 2 22 26 20 26 31 C 26 38, 18 42, 12 42 C 4 42, 0 38, 0 31 L 6 31 C 6 34, 9 37, 12 37 C 16 37, 20 34, 20 31 C 20 23, -2 25, -2 14 C -2 6, 5 0, 14 0 C 23 0, 34 5, 34 14 Z" transform="translate(0, 5) scale(1.05)"/>

          {/* A (Mountain Chevron Peak ^) */}
          <path d="M 0 52 L 18 0 L 36 52 L 29 52 L 18 18 L 7 52 Z" transform="translate(42, 0)"/>

          {/* F */}
          <path d="M 0 0 L 26 0 L 26 6 L 6 6 L 6 22 L 22 22 L 22 28 L 6 28 L 6 52 L 0 52 Z" transform="translate(86, 0)"/>

          {/* E (Three Horizontal Bars ≡) */}
          <g transform="translate(120, 0)">
            <rect x="0" y="0" width="28" height="6" rx="1.5"/>
            <rect x="0" y="23" width="22" height="6" rx="1.5"/>
            <rect x="0" y="46" width="28" height="6" rx="1.5"/>
          </g>

          {/* Z */}
          <path d="M 0 0 L 28 0 L 5 45 L 28 45 L 28 52 L 0 52 L 23 6 L 0 6 Z" transform="translate(156, 0)"/>

          {/* O (Solid Filled Circle) */}
          <circle cx="15" cy="26" r="17" transform="translate(192, 0)"/>

          {/* N */}
          <path d="M 0 0 L 6 0 L 22 38 L 22 0 L 28 0 L 28 52 L 22 52 L 6 14 L 6 52 L 0 52 Z" transform="translate(232, 0)"/>

          {/* E (Three Horizontal Bars ≡) */}
          <g transform="translate(268, 0)">
            <rect x="0" y="0" width="28" height="6" rx="1.5"/>
            <rect x="0" y="23" width="22" height="6" rx="1.5"/>
            <rect x="0" y="46" width="28" height="6" rx="1.5"/>
          </g>

          {/* S */}
          <path d="M 28 14 C 28 8, 22 4, 14 4 C 6 4, 2 8, 2 14 C 2 22 26 20 26 31 C 26 38, 18 42, 12 42 C 4 42, 0 38, 0 31 L 6 31 C 6 34, 9 37, 12 37 C 16 37, 20 34, 20 31 C 20 23, -2 25, -2 14 C -2 6, 5 0, 14 0 C 23 0, 34 5, 34 14 Z" transform="translate(304, 5) scale(1.05)"/>
        </g>
      )}
    </svg>
  );
}
