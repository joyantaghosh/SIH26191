# 🌐 SafeZones — Frontend Web Application

> **Landslide Risk Intelligence, Cartographic Terrain Analysis & Geospatial Decision Support System**

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.1.6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9.4-199900?style=for-the-badge&logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![React Router](https://img.shields.io/badge/React_Router-6.22.3-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com/)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Design Philosophy & Aesthetic](#-design-philosophy--aesthetic)
- [Key Modules & Pages](#-key-modules--pages)
- [Interactive Components & Visual Effects](#-interactive-components--visual-effects)
- [Tech Stack & Libraries](#-tech-stack--libraries)
- [Project Directory Structure](#-project-directory-structure)
- [Getting Started & Local Development](#-getting-started--local-development)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running Development Server](#running-development-server)
  - [Building for Production](#building-for-production)
  - [Previewing Production Build](#previewing-production-build)
- [Configuration & Environment Variables](#-configuration--environment-variables)
- [Available Scripts](#-available-scripts)
- [Backend Integration](#-backend-integration)

---

## 🧭 Overview

**SafeZones** is a high-performance, responsive Single Page Application (SPA) designed for disaster management authorities, urban planners, geologists, and emergency response teams. It provides precision geospatial risk modeling, settlement carrying capacity calculations, dynamic evacuation route planning, and real-time early warning feeds for landslide-prone terrains.

Built with **React 18**, **Vite**, **Tailwind CSS**, and **Leaflet GIS**, the frontend delivers an immersive, dark cartographic experience tailored for high-stakes decision-making.

---

## 🎨 Design Philosophy & Aesthetic

Inspired by editorial cartography and scientific instrument interfaces (*Meridian Geo* design system):

- **Surface & Atmosphere**: Deep obsidian `#080C08` canvas layered with organic botanical green contours (`#7A9A6E`, `#86A978`) and warm geological accents (`#C1B99D`).
- **Topographic Terrain Field**: Interactive, animated contour lines reacting to user cursor coordinates and parallax depth layers.
- **Atmospheric Refraction**: Real-time canvas-based rain droplet screen refraction simulation reflecting high-precipitation hazard conditions.
- **Typography**: Ultra-light editorial display headings paired with high-legibility geometric sans-serif for numerical data and metrics.
- **Restrained Chrome**: Fine 1px translucent borders, understated glow states, and large negative space over bulky container cards.

---

## 🚀 Key Modules & Pages

| Route | Page Component | Description |
| :--- | :--- | :--- |
| `/` | [`HomePage.jsx`](file:///d:/codings/hackathon/SIH26191/frontend/src/pages/HomePage.jsx) | Atmospheric hero portal with dynamic terrain parallax, live system telemetry, feature matrix, and quick navigation. |
| `/risk-zone-id` | [`RiskZoneIdPage.jsx`](file:///d:/codings/hackathon/SIH26191/frontend/src/pages/RiskZoneIdPage.jsx) | Sector-by-sector slope stability analysis, soil saturation modeling, historical slide frequency, and risk index scoring. |
| `/evacuation-route` | [`EvacuationRoutePage.jsx`](file:///d:/codings/hackathon/SIH26191/frontend/src/pages/EvacuationRoutePage.jsx) | Dynamic safe corridor navigation, bottleneck identification, alternate route generators, and emergency muster points. |
| `/carrying-capacity` | [`CarryingCapacityPage.jsx`](file:///d:/codings/hackathon/SIH26191/frontend/src/pages/CarryingCapacityPage.jsx) | Ecological footprint, slope load-bearing limits, water catchment strain, and settlement expansion threshold simulator. |
| `/relocation-priority` | [`RelocationPriorityPage.jsx`](file:///d:/codings/hackathon/SIH26191/frontend/src/pages/RelocationPriorityPage.jsx) | Multi-criteria decision matrix scoring settlement vulnerability, socio-economic factors, and relocation urgency tiers. |
| `/risk-alerts` | [`RiskAlertsPage.jsx`](file:///d:/codings/hackathon/SIH26191/frontend/src/pages/RiskAlertsPage.jsx) | Real-time sensor feeds, precipitation threshold alarms, acoustic emission monitoring, and automated emergency dispatches. |
| `/settlement-risk-map` | [`SettlementRiskMapPage.jsx`](file:///d:/codings/hackathon/SIH26191/frontend/src/pages/SettlementRiskMapPage.jsx) | Interactive OpenStreetMap/Leaflet geospatial map visualizing settlement clusters, hazard polygons, and safe zones. |
| `/login` | [`LoginPage.jsx`](file:///d:/codings/hackathon/SIH26191/frontend/src/pages/LoginPage.jsx) | Officer & analyst authentication portal supporting email/password and Google OAuth 2.0 single sign-on. |

---

## 🧩 Interactive Components & Visual Effects

- **[`Navbar.jsx`](file:///d:/codings/hackathon/SIH26191/frontend/src/components/Navbar.jsx)**: Glassmorphic top navigation with active route indicators, quick action triggers, and live telemetry badge.
- **[`SafeZonesLogo.jsx`](file:///d:/codings/hackathon/SIH26191/frontend/src/components/SafeZonesLogo.jsx)**: Custom vector SVG logo featuring cartographic contours and topographic geometry.
- **[`TerrainBackground.jsx`](file:///d:/codings/hackathon/SIH26191/frontend/src/components/TerrainBackground.jsx)**: Canvas-driven procedural elevation contour field that smoothly responds to mouse movement and scroll depth.
- **[`RainScreenEffect.jsx`](file:///d:/codings/hackathon/SIH26191/frontend/src/components/RainScreenEffect.jsx)**: Physics-based glass condensation and rain droplet refraction simulation emphasizing adverse meteorological conditions.
- **[`LeafletMap.jsx`](file:///d:/codings/hackathon/SIH26191/frontend/src/components/LeafletMap.jsx)**: Dark-themed cartographic GIS map wrapper using OpenStreetMap tiles with custom SVG marker pins and zone overlays.
- **[`DashboardSidebar.jsx`](file:///d:/codings/hackathon/SIH26191/frontend/src/components/DashboardSidebar.jsx)**: Collapsible contextual sidebar for analytical tools, layer toggles, and filter controls.
- **[`Footer.jsx`](file:///d:/codings/hackathon/SIH26191/frontend/src/components/Footer.jsx)**: Editorial footer with system versioning, protocol specs, legal notes, and quick resource links.

---

## 🛠️ Tech Stack & Libraries

### Core Framework & Build Tooling
- **[React 18.2](https://react.dev/)**: Modern component architecture with Hooks and Suspense.
- **[Vite 5.1](https://vitejs.dev/)**: Ultra-fast next-generation frontend development server and ES module bundler.
- **[React Router DOM 6.22](https://reactrouter.com/)**: Client-side declarative routing and navigation.

### Styling & Design System
- **[Tailwind CSS 3.4](https://tailwindcss.com/)**: Utility-first CSS framework with custom extended cartographic color palette and animations.
- **[PostCSS](https://postcss.org/) & [Autoprefixer](https://github.com/postcss/autoprefixer)**: CSS processing and automated cross-browser vendor prefixing.
- **[tailwind-merge](https://github.com/dcastil/tailwind-merge) & [clsx](https://github.com/lukeed/clsx)**: Dynamic, conflict-free class name composition.

### Mapping & Icons
- **[Leaflet 1.9](https://leafletjs.com/) & [React-Leaflet 4.2](https://react-leaflet.js.org/)**: Open-source interactive geospatial maps and layer management.
- **[Lucide React](https://lucide.dev/)**: Clean, consistent icon set designed for modern web applications.

---

## 📂 Project Directory Structure

```
frontend/
├── public/                    # Static public assets
├── src/
│   ├── components/            # Reusable UI & Visual Effect Components
│   │   ├── DashboardSidebar.jsx   # Analytics sidebar & layer switchers
│   │   ├── Footer.jsx             # Global site footer
│   │   ├── LeafletMap.jsx         # Geospatial Leaflet map integration
│   │   ├── Navbar.jsx             # Top bar navigation & telemetry indicator
│   │   ├── RainScreenEffect.jsx   # Precipitation screen refraction canvas
│   │   ├── SafeZonesLogo.jsx      # Topographic SVG brand logo
│   │   └── TerrainBackground.jsx  # Parallax contour elevation background
│   ├── pages/                 # Full Page Views & Analytical Dashboards
│   │   ├── CarryingCapacityPage.jsx   # Ecological & structural load analysis
│   │   ├── EvacuationRoutePage.jsx    # Evacuation paths & safe corridors
│   │   ├── HomePage.jsx               # Landing page & system overview
│   │   ├── LoginPage.jsx              # Officer auth & SSO portal
│   │   ├── RelocationPriorityPage.jsx # Priority scoring & settlement matrix
│   │   ├── RiskAlertsPage.jsx         # Live telemetry alarms & warnings
│   │   ├── RiskZoneIdPage.jsx         # Hazard zone classification
│   │   └── SettlementRiskMapPage.jsx  # Interactive GIS settlement map
│   ├── App.jsx                # Application root with router configuration
│   ├── index.css              # Global styles, fonts, utilities & keyframes
│   └── main.jsx               # React DOM entry point
├── design.md                  # Comprehensive Meridian Geo design specification
├── index.html                 # HTML5 template & font imports
├── package.json               # Project manifest & dependency definitions
├── postcss.config.js          # PostCSS plugins configuration
├── tailwind.config.js         # Tailwind theme extension & color variables
├── vite.config.js             # Vite configuration with React plugin
└── README.md                  # Frontend documentation & guide
```

---

## 🚀 Getting Started & Local Development

### Prerequisites

Ensure you have installed:
- **[Node.js](https://nodejs.org/)** (v18.x or v20.x LTS recommended)
- **[npm](https://www.npmjs.com/)** (v9.x or higher) or **yarn** / **pnpm**

### Installation

1. Clone the repository and navigate into the `frontend` folder:
   ```bash
   cd SIH26191/frontend
   ```

2. Install all dependencies:
   ```bash
   npm install
   ```

### Running Development Server

Start the local Vite development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

The application will be accessible at:
👉 **`http://localhost:5173`** (or the port indicated in your console output)

### Building for Production

Compile optimized static assets for production deployment:

```bash
npm run build
```

This creates a `dist/` directory containing minified, production-ready HTML, JavaScript, and CSS bundles.

### Previewing Production Build

Test the production bundle locally before deploying:

```bash
npm run preview
```

---

## ⚙️ Configuration & Environment Variables

If connecting to a custom backend endpoint or third-party GIS tile provider, create a `.env` file in the `frontend/` root:

```env
# Backend API Base URL
VITE_API_BASE_URL=http://localhost:5000/api/v1

# Optional: Custom Map Tile Provider (Default uses CartoDB Dark Matter / OpenStreetMap)
VITE_MAP_TILE_URL=https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png
```

---

## 🧪 Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server with instant HMR. |
| `npm run build` | Builds the project for production into the `dist/` folder. |
| `npm run preview` | Serves the production build locally for verification. |
| `npm run lint` | Runs ESLint to check for syntax errors and style violations. |

---

## 🔗 Backend Integration

This frontend is designed to communicate with the **SIH26191 Express / Node.js backend**:

- **Authentication Endpoints**: `/api/v1/auth/login`, `/api/v1/auth/register`, `/api/v1/auth/google`, `/api/v1/auth/me`
- **User Profile Management**: `/api/v1/users/me`
- **Health Check**: `/api/health`

For complete backend configuration, database setup, and REST API schema documentation, please refer to the [Backend Documentation (`backend/README.md`)](file:///d:/codings/hackathon/SIH26191/backend/README.md).

---

<div align="center">
  <sub>Developed for SafeZones Risk Intelligence Protocol • SIH26191</sub>
</div>
