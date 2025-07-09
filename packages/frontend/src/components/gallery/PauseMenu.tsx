import React from 'react';
import { BRUTALIST_COLORS } from '../../constants/gallery';

interface PauseMenuProps {
  isVisible: boolean;
  timeRange: 'short_term' | 'medium_term' | 'long_term';
  onTimeRangeChange: (range: 'short_term' | 'medium_term' | 'long_term') => void;
  onResume: () => void;
  onLogout: () => void;
  isAuthenticated: boolean;
}

export const PauseMenu: React.FC<PauseMenuProps> = ({
  isVisible,
  timeRange,
  onTimeRangeChange,
  onResume,
  onLogout,
  isAuthenticated
}) => {
  if (!isVisible) return null;

  return (
    <div 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'JetBrains Mono, monospace',
        cursor: 'crosshair'
      }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseUp={(e) => e.stopPropagation()}
    >
      <div style={{
        backgroundColor: BRUTALIST_COLORS.BLACK,
        border: `6px solid ${BRUTALIST_COLORS.WHITE}`,
        boxShadow: `12px 12px 0px ${BRUTALIST_COLORS.WHITE}`,
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '25px',
        alignItems: 'center',
        maxWidth: '500px'
      }}>
        <h2 style={{
          color: BRUTALIST_COLORS.YELLOW,
          fontSize: '2.5rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '4px',
          margin: 0,
          marginBottom: '10px'
        }}>
          ⏸️ PAUSED
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
          <label style={{ 
            color: BRUTALIST_COLORS.WHITE, 
            fontSize: '16px', 
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '2px'
          }}>
            TIME RANGE:
          </label>
          <select
            value={timeRange}
            onChange={(e) => {
              e.stopPropagation();
              onTimeRangeChange(e.target.value as any);
            }}
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: BRUTALIST_COLORS.YELLOW,
              color: BRUTALIST_COLORS.BLACK,
              border: `4px solid ${BRUTALIST_COLORS.BLACK}`,
              boxShadow: `4px 4px 0px ${BRUTALIST_COLORS.BLACK}`,
              padding: '15px 20px',
              fontSize: '16px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontFamily: 'JetBrains Mono, monospace',
              cursor: 'crosshair',
              minWidth: '200px'
            }}
          >
            <option value="short_term">LAST 4 WEEKS</option>
            <option value="medium_term">LAST 6 MONTHS</option>
            <option value="long_term">ALL TIME</option>
          </select>
        </div>
        
        <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onResume();
            }}
            style={{
              backgroundColor: BRUTALIST_COLORS.GREEN,
              color: BRUTALIST_COLORS.BLACK,
              border: `4px solid ${BRUTALIST_COLORS.BLACK}`,
              boxShadow: `4px 4px 0px ${BRUTALIST_COLORS.BLACK}`,
              padding: '15px 25px',
              fontSize: '18px',
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
            ▶️ RESUME
          </button>
          
          {isAuthenticated && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                if (window.confirm('ARE YOU SURE YOU WANT TO LOG OUT?')) {
                  onLogout();
                }
              }}
              style={{
                backgroundColor: BRUTALIST_COLORS.PINK,
                color: BRUTALIST_COLORS.BLACK,
                border: `4px solid ${BRUTALIST_COLORS.BLACK}`,
                boxShadow: `4px 4px 0px ${BRUTALIST_COLORS.BLACK}`,
                padding: '15px 25px',
                fontSize: '18px',
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
              🚪 LOGOUT
            </button>
          )}
        </div>
      </div>
    </div>
  );
}; 