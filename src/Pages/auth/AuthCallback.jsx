import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';



const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { handleGoogleCallback } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setError('Google authentication failed. Please try again.');
      setTimeout(() => navigate('/login'), 3000);
      return;
    }

    if (token) {
      handleGoogleCallback(token)
        .then(() => {
          navigate('/');
        })
        .catch((err) => {
          setError(err.message || 'Authentication failed');
          setTimeout(() => navigate('/login'), 3000);
        });
    } else {
      setError('No token received');
      setTimeout(() => navigate('/login'), 3000);
    }
  }, [searchParams, handleGoogleCallback, navigate]);

  if (error) {
    return (
      <div className="min-h-[calc(100vh-70px)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Authentication Failed</h2>
          <p className="text-slate-500 mb-4">{error}</p>
          <p className="text-sm text-slate-400">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-70px)] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <h2 className="text-xl font-semibold text-slate-800 mb-2">Completing Sign In</h2>
        <p className="text-slate-500">Please wait while we authenticate your account...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
