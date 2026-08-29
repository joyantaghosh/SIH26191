import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function OAuthSuccessPage() {
  const [searchParams] = useSearchParams();
  const { handleOAuthSuccess } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');

    if (accessToken) {
      handleOAuthSuccess(accessToken);
      navigate('/risk-zone-id', { replace: true });
    } else {
      navigate('/login?error=oauth_failed', { replace: true });
    }
  }, [searchParams, handleOAuthSuccess, navigate]);

  return (
    <div className="flex-grow flex flex-col items-center justify-center min-h-[60vh] text-[#86A978] font-mono text-xs">
      <span className="material-symbols-outlined text-4xl animate-spin mb-3">verified_user</span>
      <span className="uppercase tracking-[0.16em]">Authorizing Single Sign-On Credentials...</span>
    </div>
  );
}
