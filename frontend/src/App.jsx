import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import TerrainBackground from './components/TerrainBackground';
import CustomCursor from './components/CustomCursor';

// Page Component Imports
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SettlementRiskMapPage from './pages/SettlementRiskMapPage';
import RiskZoneIdPage from './pages/RiskZoneIdPage';
import EvacuationRoutePage from './pages/EvacuationRoutePage';
import CarryingCapacityPage from './pages/CarryingCapacityPage';
import RelocationPriorityPage from './pages/RelocationPriorityPage';
import RiskAlertsPage from './pages/RiskAlertsPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#080C08] text-[#E4E9DF] font-sans antialiased selection:bg-[#7A9A6E] selection:text-[#080C08] relative">
        <CustomCursor />
        <TerrainBackground />
        <div className="relative z-10 flex flex-col flex-grow">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/settlement-risk-map" element={<SettlementRiskMapPage />} />
            <Route path="/risk-zone-id" element={<RiskZoneIdPage />} />
            <Route path="/evacuation-route" element={<EvacuationRoutePage />} />
            <Route path="/carrying-capacity" element={<CarryingCapacityPage />} />
            <Route path="/relocation-priority" element={<RelocationPriorityPage />} />
            <Route path="/risk-alerts" element={<RiskAlertsPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
