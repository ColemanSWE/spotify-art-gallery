import React from 'react';
import { BRUTALIST_COLORS } from '../../constants/gallery';
import { SpotifyAlbum } from '../../types/spotify';

interface MobileFallbackProps {
  albums: SpotifyAlbum[];
  timeRange: 'short_term' | 'medium_term' | 'long_term';
  onTimeRangeChange: (range: 'short_term' | 'medium_term' | 'long_term') => void;
  onLogout: () => void;
}

export const MobileFallback: React.FC<MobileFallbackProps> = ({
  albums,
  timeRange,
  onTimeRangeChange,
  onLogout
}) => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: BRUTALIST_COLORS.BLACK,
      color: BRUTALIST_COLORS.WHITE,
      fontFamily: 'JetBrains Mono, monospace',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <h1 style={{
          color: BRUTALIST_COLORS.YELLOW,
          fontSize: '2rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '3px',
          marginBottom: '20px',
          textShadow: `3px 3px 0px ${BRUTALIST_COLORS.PINK}`
        }}>
          🖥️ DESKTOP EXPERIENCE
        </h1>
        
        <div style={{
          backgroundColor: BRUTALIST_COLORS.WHITE,
          color: BRUTALIST_COLORS.BLACK,
          border: `4px solid ${BRUTALIST_COLORS.BLACK}`,
          boxShadow: `8px 8px 0px ${BRUTALIST_COLORS.YELLOW}`,
          padding: '30px',
          marginBottom: '30px',
          textAlign: 'left'
        }}>
          <h2 style={{
            fontSize: '1.2rem',
            marginBottom: '15px',
            textTransform: 'uppercase',
            letterSpacing: '2px'
          }}>
            🎵 3D GALLERY OPTIMIZED FOR DESKTOP
          </h2>
          <p style={{ marginBottom: '15px', lineHeight: '1.5' }}>
            <strong>THIS IS A 3D WALKING EXPERIENCE</strong> designed for desktop with mouse and keyboard controls.
          </p>
          <ul style={{ marginBottom: '15px', paddingLeft: '20px', lineHeight: '1.6' }}>
            <li><strong>MOUSE:</strong> Look around the gallery</li>
            <li><strong>WASD:</strong> Walk through 3D space</li>
            <li><strong>ESC:</strong> Pause and settings</li>
          </ul>
          <p style={{ fontWeight: 700, textTransform: 'uppercase' }}>
            📱 Visit on desktop for the full experience!
          </p>
        </div>

        {albums.length > 0 && (
          <>
            <h3 style={{
              color: BRUTALIST_COLORS.CYAN,
              fontSize: '1.2rem',
              marginBottom: '20px',
              textTransform: 'uppercase',
              letterSpacing: '2px'
            }}>
              YOUR TOP ALBUMS ({timeRange.replace('_', ' ').toUpperCase()})
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '15px',
              marginBottom: '30px'
            }}>
              {albums.slice(0, 12).map((album, index) => (
                <div key={album.id} style={{
                  backgroundColor: BRUTALIST_COLORS.WHITE,
                  border: `3px solid ${BRUTALIST_COLORS.BLACK}`,
                  boxShadow: `4px 4px 0px ${BRUTALIST_COLORS.BLACK}`,
                  padding: '10px'
                }}>
                  <img 
                    src={album.images[1]?.url || album.images[0]?.url} 
                    alt={album.name}
                    style={{ 
                      width: '100%', 
                      height: 'auto',
                      display: 'block',
                      marginBottom: '8px'
                    }}
                  />
                  <div style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: BRUTALIST_COLORS.BLACK,
                    lineHeight: '1.2'
                  }}>
                    {album.name}
                  </div>
                  <div style={{
                    fontSize: '0.7rem',
                    color: BRUTALIST_COLORS.BLACK,
                    marginTop: '4px'
                  }}>
                    {album.artists[0]?.name}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <select
            value={timeRange}
            onChange={(e) => onTimeRangeChange(e.target.value as any)}
            style={{
              backgroundColor: BRUTALIST_COLORS.GREEN,
              color: BRUTALIST_COLORS.BLACK,
              border: `4px solid ${BRUTALIST_COLORS.BLACK}`,
              boxShadow: `4px 4px 0px ${BRUTALIST_COLORS.BLACK}`,
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: 700,
              textTransform: 'uppercase',
              fontFamily: 'JetBrains Mono, monospace',
              cursor: 'pointer'
            }}
          >
            <option value="short_term">LAST 4 WEEKS</option>
            <option value="medium_term">LAST 6 MONTHS</option>
            <option value="long_term">ALL TIME</option>
          </select>
          
          <button
            onClick={() => {
              if (window.confirm('LOG OUT AND TRY A DIFFERENT ACCOUNT?')) {
                onLogout();
              }
            }}
            style={{
              backgroundColor: BRUTALIST_COLORS.PINK,
              color: BRUTALIST_COLORS.BLACK,
              border: `4px solid ${BRUTALIST_COLORS.BLACK}`,
              boxShadow: `4px 4px 0px ${BRUTALIST_COLORS.BLACK}`,
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: 700,
              textTransform: 'uppercase',
              fontFamily: 'JetBrains Mono, monospace',
              cursor: 'pointer'
            }}
          >
            🚪 LOGOUT
          </button>
        </div>
      </div>
    </div>
  );
}; 