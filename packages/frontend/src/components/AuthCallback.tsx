import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUserId } = useAuth();

  useEffect(() => {
    const handleCallback = () => {
      const urlParams = new URLSearchParams(location.search);
      const userId = urlParams.get('userId');
      const error = urlParams.get('error');

      if (error) {
        console.error('Authentication error:', error);
        // Redirect to login with error message
        navigate('/?error=' + error);
        return;
      }

      if (userId) {
        setUserId(userId);
        // For now, we'll navigate to gallery without JWT token
        // In a production app, you'd want to generate a JWT token for this userId
        navigate('/gallery');
      } else {
        console.error('No userId received from callback');
        navigate('/?error=no_user_id');
      }
    };

    handleCallback();
  }, [location, navigate, setUserId]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#1a1a1a',
      color: 'white'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h2>Authenticating with Spotify...</h2>
        <div style={{ 
          width: '50px', 
          height: '50px', 
          border: '3px solid #1DB954',
          borderTop: '3px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '20px auto'
        }} />
        <p>Please wait while we connect your account.</p>
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