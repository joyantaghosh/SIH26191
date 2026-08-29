/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Meridian Geo Terrain Palette
        "mg-bg": "#080C08",
        "mg-bg-deep": "#060906",
        "mg-bg-elevated": "#0D120C",
        "mg-surface": "#0D120C",
        "mg-surface-interactive": "rgba(13,18,12,0.78)",
        "mg-green": "#7A9A6E",
        "mg-green-light": "#86A978",
        "mg-green-dark": "#536D4B",
        "mg-terrain": "#6F9164",
        "mg-warm": "#C1B99D",
        "mg-warm-muted": "#8F8A76",
        "mg-warm-faint": "#625F51",
        "mg-text": "#E4E9DF",
        "mg-text-secondary": "#B0B5A8",
        "mg-text-muted": "#777C70",
        "mg-text-faint": "#565C51",
        "mg-border": "rgba(228,233,223,0.07)",
        "mg-border-visible": "rgba(228,233,223,0.12)",
        "mg-border-green": "rgba(122,154,110,0.20)",
        
        // Semantic overrides aligned with Meridian Geo
        "background": "#080C08",
        "surface": "#0D120C",
        "primary": "#E4E9DF",
        "on-surface": "#E4E9DF",
        "on-surface-variant": "#B0B5A8",
        "outline-variant": "rgba(228,233,223,0.08)",
        "danger-red": "#DC2626",
        "warning-yellow": "#C1B99D",
        "safe-green": "#7A9A6E",
        "risk-orange": "#86A978",
      },
      fontFamily: {
        display: ['Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
        body: ['Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      letterSpacing: {
        'eyebrow': '0.13em',
        'label': '0.16em',
        'display': '-0.04em',
      },
      borderRadius: {
        'mg-card': '17px',
        'mg-control': '9999px',
      }
    },
  },
  plugins: [],
}
