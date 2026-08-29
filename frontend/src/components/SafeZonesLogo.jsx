import React from 'react';

export default function SafeZonesLogo({ className = "h-8 w-auto", color = "#7A9A6E", iconOnly = false, ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={iconOnly ? "0 0 130 140" : "0 0 540 140"}
      role="img"
      aria-labelledby="logoTitle logoDesc"
      className={`logo-svg transition-all ${className}`}
      {...props}
    >
      <title id="logoTitle">Safe Zones</title>
      <desc id="logoDesc">Official Safe Zones logo featuring mountain location pin emblem and stylized typography.</desc>
      
      <style>{`
        .logo-pin-idle {
          transform-origin: center;
          animation: logoFloat 5s ease-in-out infinite;
        }
        @keyframes logoFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
      `}</style>

      {/* Mountain Location Pin Emblem */}
      <g className="logo-pin-idle" transform="translate(5, 5)">
        {/* Outer Location Pin Frame */}
        <path
          d="M 60 8 C 26 8, 4 30, 4 64 C 4 100, 60 132, 60 132 C 60 132, 116 100, 116 64 C 116 30, 94 8, 60 8 Z"
          fill="none"
          stroke={color}
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Back Mountain Peak */}
        <path
          d="M 28 66 L 50 36 L 74 66 Z"
          fill={color}
        />
        {/* Back Peak Snowline Accent */}
        <polygon points="50,36 44,45 50,49 56,45" fill="#080C08" />

        {/* Front Mountain Peak */}
        <path
          d="M 46 72 L 74 30 L 102 72 Z"
          fill={color}
        />
        {/* Front Peak Snowline Accent */}
        <polygon points="74,30 64,45 74,50 84,45" fill="#080C08" />

        {/* Double Curving Road Path at Pin Base */}
        <path
          d="M 26 104 C 42 90, 60 76, 82 74"
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="M 38 116 C 54 100, 74 86, 96 84"
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
        />
      </g>

      {/* Stylized Wordmark SAFEZONES */}
      {!iconOnly && (
        <g fill={color} transform="translate(138, 42)">
          {/* S */}
          <path d="M 28 14 C 28 8, 22 4, 14 4 C 6 4, 2 8, 2 14 C 2 22 26 20 26 31 C 26 38, 18 42, 12 42 C 4 42, 0 38, 0 31 L 6 31 C 6 34, 9 37, 12 37 C 16 37, 20 34, 20 31 C 20 23, -2 25, -2 14 C -2 6, 5 0, 14 0 C 23 0, 34 5, 34 14 Z" transform="translate(0, 5) scale(1.1)"/>
          
          {/* A (Mountain Chevron Peak Style) */}
          <path d="M 0 52 L 18 0 L 36 52 L 29 52 L 18 18 L 7 52 Z" transform="translate(42, 0)"/>
          
          {/* F */}
          <path d="M 0 0 L 26 0 L 26 6 L 6 6 L 6 22 L 22 22 L 22 28 L 6 28 L 6 52 L 0 52 Z" transform="translate(86, 0)"/>
          
          {/* E (Three Distinct Horizontal Bars as shown in official logo) */}
          <g transform="translate(120, 0)">
            <rect x="0" y="0" width="28" height="6" rx="1.5"/>
            <rect x="0" y="23" width="22" height="6" rx="1.5"/>
            <rect x="0" y="46" width="28" height="6" rx="1.5"/>
          </g>

          {/* Z */}
          <path d="M 0 0 L 28 0 L 5 45 L 28 45 L 28 52 L 0 52 L 23 6 L 0 6 Z" transform="translate(156, 0)"/>
          
          {/* O */}
          <path d="M 16 0 C 26 0, 32 11, 32 26 C 32 41, 26 52, 16 52 C 6 52, 0 41, 0 26 C 0 11, 6 0, 16 0 Z M 16 6 C 11 6, 6 13, 6 26 C 6 39, 11 46, 16 46 C 21 46, 26 39, 26 26 C 26 13, 21 6, 16 6 Z" transform="translate(192, 0)"/>

          {/* N */}
          <path d="M 0 0 L 6 0 L 22 38 L 22 0 L 28 0 L 28 52 L 22 52 L 6 14 L 6 52 L 0 52 Z" transform="translate(232, 0)"/>

          {/* E (Three Horizontal Bars) */}
          <g transform="translate(268, 0)">
            <rect x="0" y="0" width="28" height="6" rx="1.5"/>
            <rect x="0" y="23" width="22" height="6" rx="1.5"/>
            <rect x="0" y="46" width="28" height="6" rx="1.5"/>
          </g>

          {/* S */}
          <path d="M 28 14 C 28 8, 22 4, 14 4 C 6 4, 2 8, 2 14 C 2 22 26 20 26 31 C 26 38, 18 42, 12 42 C 4 42, 0 38, 0 31 L 6 31 C 6 34, 9 37, 12 37 C 16 37, 20 34, 20 31 C 20 23, -2 25, -2 14 C -2 6, 5 0, 14 0 C 23 0, 34 5, 34 14 Z" transform="translate(304, 5) scale(1.1)"/>
        </g>
      )}
    </svg>
  );
}
