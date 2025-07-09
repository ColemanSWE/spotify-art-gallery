import React from 'react';
import { BRUTALIST_COLORS } from '../../constants/gallery';

interface InstructionsProps {
  hasPointerLock: boolean;
}

export const Instructions: React.FC<InstructionsProps> = ({ hasPointerLock }) => {
  return (
    <>
      {/* Brutalist Instructions - Only show when not paused */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        color: BRUTALIST_COLORS.WHITE,
        fontSize: '14px',
        backgroundColor: BRUTALIST_COLORS.BLACK,
        border: `4px solid ${BRUTALIST_COLORS.WHITE}`,
        boxShadow: `4px 4px 0px ${BRUTALIST_COLORS.WHITE}`,
        padding: '20px',
        maxWidth: '250px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '1px',
        lineHeight: '1.4'
      }}>
        <div style={{marginBottom: '10px', color: BRUTALIST_COLORS.YELLOW}}>CONTROLS:</div>
        <div>CLICK TO ENTER GALLERY</div>
        <div>WASD - MOVEMENT</div>
        <div>MOUSE - LOOK AROUND</div>
        <div>ESC - PAUSE MENU</div>
      </div>

      {/* Click to Enter Gallery prompt */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 999,
        color: BRUTALIST_COLORS.BLACK,
        fontSize: '24px',
        backgroundColor: BRUTALIST_COLORS.YELLOW,
        border: `4px solid ${BRUTALIST_COLORS.BLACK}`,
        boxShadow: `8px 8px 0px ${BRUTALIST_COLORS.BLACK}`,
        padding: '20px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '2px',
        pointerEvents: 'none',
        opacity: hasPointerLock ? 0 : 1,
        transition: 'opacity 0.3s ease'
      }}>
        CLICK TO ENTER GALLERY
      </div>
    </>
  );
}; 