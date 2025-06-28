import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const { login } = useAuth();

  const handleLogin = async () => {
    await login();
  };

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
      <h1 style={{ marginBottom: '2rem', fontSize: '3rem' }}>
        Spotify 3D Art Gallery
      </h1>
      <p style={{ 
        marginBottom: '3rem', 
        fontSize: '1.2rem', 
        textAlign: 'center',
        maxWidth: '600px',
        lineHeight: '1.6'
      }}>
        Connect your Spotify account to visualize your top albums as a 3D art gallery.
        Your music taste, reimagined in three dimensions.
      </p>
      <button
        onClick={handleLogin}
        style={{
          backgroundColor: '#1DB954',
          color: 'white',
          border: 'none',
          padding: '15px 30px',
          fontSize: '1.1rem',
          borderRadius: '50px',
          cursor: 'pointer',
          fontWeight: 'bold',
          transition: 'background-color 0.3s ease',
          boxShadow: '0 4px 15px rgba(29, 185, 84, 0.3)'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#1ed760';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#1DB954';
        }}
      >
        Connect with Spotify
      </button>
      <div style={{ 
        marginTop: '2rem', 
        fontSize: '0.9rem', 
        color: '#b3b3b3',
        textAlign: 'center'
      }}>
        <p>We'll redirect you to Spotify to authorize access to your listening data.</p>
      </div>
    </div>
  );
};

export default LoginPage; 