import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUserId, logout } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(location.search);
      const userId = urlParams.get('userId');
      const callbackError = urlParams.get('error');

      if (callbackError) {
        console.error('Authentication error:', callbackError);
        setError(callbackError);
        // Wait a moment to show the error, then redirect
        setTimeout(() => {
          navigate('/?error=' + callbackError);
        }, 3000);
        return;
      }

      if (userId) {
        try {
          await setUserId(userId);
          navigate('/gallery');
        } catch (error) {
          console.error('Failed to set user ID:', error);
          setError('auth_failed');
          setTimeout(() => {
            navigate('/?error=auth_failed');
          }, 3000);
        }
      } else {
        console.error('No userId received from callback');
        setError('no_user_id');
        setTimeout(() => {
          navigate('/?error=no_user_id');
        }, 3000);
      }
    };

    handleCallback();
  }, [location, navigate, setUserId]);

  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: 'var(--brutal-red)',
        color: 'var(--brutal-white)',
        fontFamily: 'JetBrains Mono, monospace',
        textAlign: 'center'
      }}>
        <div style={{ 
          padding: '30px',
          border: '4px solid var(--brutal-black)',
          boxShadow: '8px 8px 0px var(--brutal-black)',
          backgroundColor: 'var(--brutal-white)',
          color: 'var(--brutal-black)',
          marginBottom: '20px'
        }}>
          <h2 style={{ 
            fontSize: '2rem', 
            fontWeight: 700, 
            textTransform: 'uppercase',
            marginBottom: '15px'
          }}>
            ⚠️ AUTHENTICATION ERROR
          </h2>
          <p style={{ fontWeight: 700, marginBottom: '15px' }}>
            SOMETHING WENT WRONG DURING SPOTIFY AUTHENTICATION
          </p>
          <p style={{ fontWeight: 700, fontSize: '14px' }}>
            REDIRECTING YOU BACK TO LOGIN...
          </p>
        </div>
        <button
          onClick={() => {
            logout();
            navigate('/');
          }}
          style={{
            backgroundColor: 'var(--brutal-yellow)',
            color: 'var(--brutal-black)',
            border: '4px solid var(--brutal-black)',
            boxShadow: '4px 4px 0px var(--brutal-black)',
            padding: '15px 25px',
            fontSize: '14px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            cursor: 'pointer',
            fontFamily: 'JetBrains Mono, monospace'
          }}
        >
          GO BACK NOW
        </button>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: 'var(--brutal-black)',
      color: 'var(--brutal-white)',
      fontFamily: 'JetBrains Mono, monospace'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          padding: '30px',
          border: '4px solid var(--brutal-green)',
          boxShadow: '8px 8px 0px var(--brutal-green)',
          backgroundColor: 'var(--brutal-white)',
          color: 'var(--brutal-black)',
          marginBottom: '20px'
        }}>
          <h2 style={{ 
            fontSize: '2rem', 
            fontWeight: 700, 
            textTransform: 'uppercase',
            marginBottom: '15px'
          }}>
            🎵 AUTHENTICATING WITH SPOTIFY...
          </h2>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            border: '4px solid var(--brutal-green)',
            borderTop: '4px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '20px auto'
          }} />
          <p style={{ fontWeight: 700, textTransform: 'uppercase' }}>
            CONNECTING YOUR MUSIC LIBRARY...
          </p>
        </div>
      </div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default AuthCallback; 