import React, { useState, useEffect } from 'react';
import { BRUTALIST_COLORS } from '../constants/gallery';

const UnderConstruction: React.FC = () => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  const messages = [
    "Currently rebuilding this because the Spotify API sucks and wouldn't let me make the previous app public. :)"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTyping(false);
      setTimeout(() => {
        setCurrentMessage((prev) => (prev + 1) % messages.length);
        setIsTyping(true);
      }, 1000);
    }, 3000);

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: `linear-gradient(135deg, ${BRUTALIST_COLORS.BLACK} 0%, ${BRUTALIST_COLORS.BLUE} 100%)`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'monospace',
      color: BRUTALIST_COLORS.WHITE,
      padding: '20px',
      textAlign: 'center'
    }}>

      {/* White container for main content */}
      <div style={{
        backgroundColor: 'white',
        color: BRUTALIST_COLORS.BLACK,
        padding: '40px',
        borderRadius: '10px',
        border: `3px solid ${BRUTALIST_COLORS.BLACK}`,
        boxShadow: `8px 8px 0px ${BRUTALIST_COLORS.RED}`,
        maxWidth: '600px',
        width: '100%',
        marginBottom: '40px'
      }}>

        {/* Main title */}
        <h1 style={{
          fontSize: '3rem',
          marginBottom: '20px',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          textShadow: `2px 2px 0px ${BRUTALIST_COLORS.RED}`,
          animation: 'glow 2s ease-in-out infinite alternate'
        }}>
          Under Construction
        </h1>

        {/* Animated message */}
        <div style={{
          fontSize: '1.2rem',
          marginBottom: '20px',
          minHeight: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span style={{
            borderRight: isTyping ? '2px solid black' : 'none',
            paddingRight: isTyping ? '5px' : '0'
          }}>
            {messages[currentMessage]}
          </span>
        </div>

      </div>

      {/* Footer */}
      <div style={{
        fontSize: '0.9rem',
        color: BRUTALIST_COLORS.GRAY,
        marginTop: 'auto',
        paddingTop: '20px'
      }}>
        <div>Built with React, Three.js, and a lot of patience</div>
      </div>
    </div>
  );
};

export default UnderConstruction; 