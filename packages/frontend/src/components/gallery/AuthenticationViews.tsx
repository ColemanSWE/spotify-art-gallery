import React from 'react';
import { BRUTALIST_COLORS } from '../../constants/gallery';
import { useMobileDetection } from '../../hooks/useMobileDetection';

interface AuthenticationViewsProps {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  albumCount: number;
  onLogout: () => void;
}

export const AuthenticationViews: React.FC<AuthenticationViewsProps> = ({
  isAuthenticated,
  loading,
  error,
  albumCount,
  onLogout
}) => {
  const isMobile = useMobileDetection();

  // Not authenticated view
  if (!isAuthenticated) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        color: BRUTALIST_COLORS.BLACK,
        backgroundColor: BRUTALIST_COLORS.WHITE,
        textAlign: 'center',
        fontFamily: 'JetBrains Mono, monospace',
        cursor: 'crosshair',
        padding: isMobile ? '20px' : '40px'
      }}>
        <h2 style={{ 
          color: BRUTALIST_COLORS.BLACK, 
          marginBottom: '20px',
          fontSize: isMobile ? '2rem' : '3rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: isMobile ? '2px' : '4px',
          textShadow: `3px 3px 0px ${BRUTALIST_COLORS.YELLOW}, 6px 6px 0px ${BRUTALIST_COLORS.PINK}`
        }}>
          🎵 SPOTIFY 3D GALLERY
        </h2>
        
        {isMobile && (
          <div style={{
            backgroundColor: BRUTALIST_COLORS.YELLOW,
            color: BRUTALIST_COLORS.BLACK,
            border: `4px solid ${BRUTALIST_COLORS.BLACK}`,
            boxShadow: `8px 8px 0px ${BRUTALIST_COLORS.BLACK}`,
            padding: '20px',
            marginBottom: '20px',
            maxWidth: '400px'
          }}>
            <p style={{ fontWeight: 700, marginBottom: '10px', textTransform: 'uppercase' }}>
              📱 MOBILE DETECTED
            </p>
            <p style={{ fontWeight: 700, fontSize: '14px', lineHeight: '1.4' }}>
              This is a 3D desktop experience! You can still log in to see your albums, but visit on desktop for the full gallery.
            </p>
          </div>
        )}
        <p style={{ 
          marginBottom: '30px', 
          fontSize: '18px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '2px'
        }}>
          CONNECT YOUR SPOTIFY ACCOUNT TO VIEW YOUR MUSIC IN 3D!
        </p>
        <div style={{ 
          padding: '30px',
          border: `4px solid ${BRUTALIST_COLORS.BLACK}`,
          boxShadow: `8px 8px 0px ${BRUTALIST_COLORS.BLACK}`,
          backgroundColor: BRUTALIST_COLORS.YELLOW,
          maxWidth: '600px'
        }}>
          <p style={{fontWeight: 700, marginBottom: '15px'}}>🎨 YOUR TOP ALBUMS WILL BE DISPLAYED AS ARTWORK IN A VIRTUAL GALLERY</p>
          <p style={{fontWeight: 700, marginBottom: '15px'}}>🚶‍♂️ WALK AROUND AND EXPLORE YOUR MUSIC COLLECTION IN 3D SPACE</p>
          <p style={{fontWeight: 700}}>🖼️ EXPERIENCE YOUR MUSIC AS A CURATED ART EXHIBITION</p>
        </div>
      </div>
    );
  }

  // Error view
  if (error) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        color: BRUTALIST_COLORS.WHITE,
        backgroundColor: BRUTALIST_COLORS.RED,
        textAlign: 'center',
        fontFamily: 'JetBrains Mono, monospace',
        cursor: 'crosshair'
      }}>
        <h3 style={{
          fontSize: '2rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '3px',
          marginBottom: '20px'
        }}>
          ⚠️ GALLERY ERROR
        </h3>
        <p style={{ marginBottom: '20px', fontWeight: 700, textTransform: 'uppercase' }}>{error}</p>
        <p style={{ marginBottom: '30px', fontWeight: 700, textTransform: 'uppercase' }}>TRY REFRESHING THE PAGE OR LOGGING OUT AND BACK IN.</p>
        
        <button
          onClick={() => {
            if (window.confirm('LOG OUT TO RESET YOUR CREDENTIALS?')) {
              onLogout();
            }
          }}
          style={{
            backgroundColor: BRUTALIST_COLORS.WHITE,
            color: BRUTALIST_COLORS.BLACK,
            border: `4px solid ${BRUTALIST_COLORS.BLACK}`,
            boxShadow: `4px 4px 0px ${BRUTALIST_COLORS.BLACK}`,
            padding: '15px 25px',
            fontSize: '16px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            cursor: 'crosshair',
            fontFamily: 'JetBrains Mono, monospace',
            transition: 'all 0.2s cubic-bezier(0.76, 0, 0.24, 1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translate(-2px, -2px)';
            e.currentTarget.style.boxShadow = `6px 6px 0px ${BRUTALIST_COLORS.BLACK}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translate(0px, 0px)';
            e.currentTarget.style.boxShadow = `4px 4px 0px ${BRUTALIST_COLORS.BLACK}`;
          }}
        >
          LOGOUT & RETRY
        </button>
      </div>
    );
  }

  // No albums view
  if (isAuthenticated && !loading && !error && albumCount === 0) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        color: BRUTALIST_COLORS.BLACK,
        backgroundColor: BRUTALIST_COLORS.WHITE,
        textAlign: 'center',
        fontFamily: 'JetBrains Mono, monospace',
        cursor: 'crosshair'
      }}>
        <h3 style={{ 
          color: BRUTALIST_COLORS.BLACK, 
          marginBottom: '20px',
          fontSize: '2rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '3px',
          textShadow: `2px 2px 0px ${BRUTALIST_COLORS.GREEN}`
        }}>
          🎵 GALLERY READY!
        </h3>
        <p style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 700, textTransform: 'uppercase' }}>NO ALBUMS FOUND FOR THE SELECTED TIME RANGE.</p>
        <div style={{ 
          padding: '20px',
          border: `4px solid ${BRUTALIST_COLORS.BLACK}`,
          boxShadow: `8px 8px 0px ${BRUTALIST_COLORS.BLACK}`,
          backgroundColor: BRUTALIST_COLORS.CYAN,
          marginBottom: '30px'
        }}>
          <p style={{fontWeight: 700, marginBottom: '10px'}}>💡 TRY CHANGING THE TIME RANGE ABOVE</p>
          <p style={{fontWeight: 700, marginBottom: '10px'}}>🎧 MAKE SURE YOU HAVE LISTENED TO MUSIC ON SPOTIFY</p>
          <p style={{fontWeight: 700}}>⏱️ IT MAY TAKE TIME FOR SPOTIFY TO UPDATE YOUR LISTENING HISTORY</p>
        </div>
        
        <button
          onClick={() => {
            if (window.confirm('LOGOUT AND TRY A DIFFERENT SPOTIFY ACCOUNT?')) {
              onLogout();
            }
          }}
          style={{
            backgroundColor: BRUTALIST_COLORS.PINK,
            color: BRUTALIST_COLORS.BLACK,
            border: `4px solid ${BRUTALIST_COLORS.BLACK}`,
            boxShadow: `4px 4px 0px ${BRUTALIST_COLORS.BLACK}`,
            padding: '15px 25px',
            fontSize: '16px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            cursor: 'crosshair',
            fontFamily: 'JetBrains Mono, monospace',
            transition: 'all 0.2s cubic-bezier(0.76, 0, 0.24, 1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translate(-2px, -2px)';
            e.currentTarget.style.boxShadow = `6px 6px 0px ${BRUTALIST_COLORS.BLACK}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translate(0px, 0px)';
            e.currentTarget.style.boxShadow = `4px 4px 0px ${BRUTALIST_COLORS.BLACK}`;
          }}
        >
          LOGOUT & TRY DIFFERENT ACCOUNT
        </button>
      </div>
    );
  }

  return null;
}; 