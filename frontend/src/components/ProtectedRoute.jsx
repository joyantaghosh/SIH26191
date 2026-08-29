import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center min-h-[60vh] text-[#86A978] font-mono text-xs">
        <span className="material-symbols-outlined text-4xl animate-spin mb-3">autorenew</span>
        <span className="uppercase tracking-[0.16em]">Verifying Cartographic Clearance...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page while preserving intended destination URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
