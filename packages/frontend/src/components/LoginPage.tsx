import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ApiService } from '../services/apiService';

const LoginPage: React.FC = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const [isErrorHidder, setIsErrorHidder] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Check for error parameters in URL
  const urlParams = new URLSearchParams(location.search);
  const error = urlParams.get('error');
  
  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case 'access_denied':
        return 'YOU DENIED ACCESS TO YOUR SPOTIFY ACCOUNT';
      case 'auth_failed':
        return 'AUTHENTICATION FAILED - PLEASE TRY AGAIN';
      case 'no_user_id':
        return 'FAILED TO GET USER INFORMATION FROM SPOTIFY';
      default:
        return errorCode ? 'AUTHENTICATION ERROR OCCURRED' : null;
    }
  };

  const handleLogin = async () => {
    if (isLoading) return; // Prevent multiple clicks
    
    try {
      setIsLoading(true);
      
      // Clear any previous session data first
      logout();
      
      const data = await ApiService.getSpotifyAuthUrl();
      
      if (data.authUrl) {
        // Small delay to show loading state before redirect
        setTimeout(() => {
          window.location.href = data.authUrl;
        }, 500);
      } else {
        console.error('No auth URL received');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Failed to get Spotify auth URL:', error);
      setIsLoading(false);
    }
  };

  const handleClearError = () => {
    setIsErrorHidder(true);
    logout();
  };

  const errorMessage = getErrorMessage(error);

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title glitch" data-text="3D GALLERY">
          3D GALLERY
        </h1>
        <p className="login-subtitle">
          CONNECT SPOTIFY TO ENTER THE BRUTALIST MUSIC DIMENSION
        </p>

        {errorMessage && (
          <div style={{
            background: 'var(--brutal-red)',
            border: '4px solid var(--brutal-black)',
            boxShadow: '8px 8px 0px var(--brutal-black)',
            padding: '20px',
            marginBottom: '20px',
            textAlign: 'center',
            color: 'var(--brutal-white)'
          }}>
            {!isErrorHidder && (
              <div style={{fontWeight: 700, marginBottom: '15px', fontSize: '16px'}}>
                ⚠️ ERROR: {errorMessage}
              </div>
            )}
            <button
              onClick={handleClearError}
              style={{
                backgroundColor: 'var(--brutal-white)',
                color: 'var(--brutal-black)',
                border: '3px solid var(--brutal-black)',
                boxShadow: '4px 4px 0px var(--brutal-black)',
                padding: '10px 15px',
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                cursor: 'pointer',
                fontFamily: 'JetBrains Mono, monospace'
              }}
            >
              CLEAR ERROR & RETRY
            </button>
          </div>
        )}
        
        <div style={{
          background: 'var(--brutal-yellow)',
          border: '4px solid var(--brutal-black)',
          boxShadow: '8px 8px 0px var(--brutal-black)',
          padding: '20px',
          marginBottom: '30px',
          textAlign: 'left'
        }}>
          <div style={{fontWeight: 700, marginBottom: '10px', color: 'var(--brutal-black)'}}>
             FEATURES:
          </div>
          <div style={{fontWeight: 700, marginBottom: '8px', color: 'var(--brutal-black)'}}>
             GEOMETRIC 3D ALBUM GALLERY
          </div>
          <div style={{fontWeight: 700, marginBottom: '8px', color: 'var(--brutal-black)'}}>
             FIRST-PERSON EXPLORATION
          </div>
          <div style={{fontWeight: 700, marginBottom: '8px', color: 'var(--brutal-black)'}}>
             YOUR TOP ALBUMS AS ART
          </div>
        </div>
        
        <button 
          onClick={handleLogin}
          disabled={isLoading}
          className="login-button"
          style={{
            opacity: isLoading ? 0.7 : 1,
            cursor: isLoading ? 'not-allowed' : 'crosshair',
            transform: isLoading ? 'none' : undefined,
            transition: 'all 0.2s cubic-bezier(0.76, 0, 0.24, 1)',
            backgroundColor: isLoading ? 'var(--brutal-cyan)' : undefined,
            pointerEvents: isLoading ? 'none' : 'auto'
          }}
        >
          {isLoading ? (
            <>
              <span style={{
                display: 'inline-block',
                marginRight: '8px'
              }}>
                🔄
              </span>
              CONNECTING TO SPOTIFY...
            </>
          ) : (
            '▶ CONNECT SPOTIFY ◀'
          )}
        </button>
        
        <div style={{
          marginTop: '20px',
          background: 'var(--brutal-pink)',
          border: '4px solid var(--brutal-black)',
          boxShadow: '4px 4px 0px var(--brutal-black)',
          padding: '15px',
          fontSize: '12px',
          fontWeight: 700,
          color: 'var(--brutal-black)'
        }}>
          ⚠️ WARNING: REQUIRES ACTIVE SPOTIFY ACCOUNT AND LISTENING HISTORY
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 